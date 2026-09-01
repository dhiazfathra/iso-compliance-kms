/**
 * The seeded compliance register, derived and complete, before anything is
 * written anywhere.
 *
 * Two consumers need the same data: `index.ts` writes it into Payload, and
 * `export.ts` writes it to a folder on disk for local mode. Deriving it twice
 * would be two datasets that drift, so it is derived once, here, and referred
 * to by natural key — a clause number, a policy name, a form code — rather than
 * by database id. Each consumer resolves those keys its own way.
 *
 * Nothing in this module performs I/O, so it is deterministic for a given
 * `today` and testable without a database.
 */
import { ACTIVITY, CL, PVERS, ROLES, VERS } from './mockup-data'
import { CATALOG, type CatalogEntry } from './iso-catalog'
import { coverageFor, policyBody, recordBody } from './coverage'
import { DOCUMENTS } from './documents'

export type Standard = '27001' | '9001'

export type SeedUser = {
  name: string
  role: string
  email: string
  access: 'read' | 'write' | 'admin'
}

export type SeedClause = {
  clauseId: string
  standard: Standard
  title: string
  status: 'compliant' | 'gap'
  /** Owner's name; the consumer maps it to whatever it uses for a user. */
  owner: string
  nextReview: string | null
  /** 0 means referenced but out of scope, so it must not move the score. */
  criticality: number
}

export type SeedPolicyRevision = {
  version: string
  date: string
  author: string
  approval?: string
  status?: string
  note: string
}

export type SeedPolicy = {
  name: string
  version: string
  status: string
  owner: string
  /** Clause number. */
  primaryClause: string
  /** Every clause number this policy satisfies, primary included. */
  clauses: string[]
  body: string
  revisions: SeedPolicyRevision[]
}

export type SeedForm = {
  code: string
  name: string
  /** Policy name. */
  policy: string
  primaryClause: string
  alsoSatisfies: string[]
  /** References that resolve to no clause in the register. */
  externalRefs: string[]
}

export type SeedEvidenceRevision = {
  version: string
  date: string
  author: string
  note: string
}

export type SeedEvidenceRow = {
  title: string
  fileType: 'PDF' | 'XLSX' | 'PPTX' | 'DOCX' | 'MD' | 'PNG' | 'JPG'
  /** Form code. */
  form: string
  satisfies: string[]
  uploader: string
  uploadedAt: string
  expiryDate: string | null
  reviewDate: string | null
  retention: string
  sha: string
  revisions: SeedEvidenceRevision[]
  /** The text written into the file itself. */
  body: string
}

export type SeedActivity = { at: string; actor: string; action: string; ref: string }

export type SeedAuditSession = {
  sessionId: string
  label: string
  /** Auditor's name. */
  auditor: string
  startedAt: string
  expiresAt: string
  revoked: boolean
  downloads: number
}

export type SeedData = {
  users: SeedUser[]
  /** The external auditor, kept apart because they are a read-only account. */
  auditor: SeedUser
  clauses: SeedClause[]
  policies: SeedPolicy[]
  forms: SeedForm[]
  evidence: SeedEvidenceRow[]
  activity: SeedActivity[]
  auditSession: SeedAuditSession
  stats: { inScope: number; referenced: number; policies: number }
}

export type BuildOptions = {
  today?: Date
  /** The account the register is administered from. */
  adminEmail: string
  auditorEmail: string
  /** How long the seeded external-auditor session stays live, in hours. */
  auditorSessionHours: number
}

/** '9001 7.5.1' and 'A.6.3' both appear as cross references in the mockup. */
export function bareClauseId(ref: string): string {
  return ref.replace(/^(9001|27001)\s+/, '')
}

export function standardOf(ref: string): Standard {
  if (ref.startsWith('9001 ')) return '9001'
  if (ref.startsWith('27001 ')) return '27001'
  return ref.startsWith('A.') ? '27001' : '9001'
}

const slugEmail = (name: string) => `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@dermaster.local`

const sha = (text: string, date: string) =>
  `sha256:${text.length.toString(16).padStart(2, '0')}${date.replace(/-/g, '')}`

const DAY = 86_400_000

export function buildSeedData(options: BuildOptions): SeedData {
  const today = options.today ?? new Date()

  // Users -----------------------------------------------------------------
  const users: SeedUser[] = Object.entries(ROLES).map(([name, role]) => ({
    name,
    role,
    email: slugEmail(name),
    access: 'write',
  }))
  users.push({
    name: 'Dhiaz Fathra',
    role: 'Compliance Manager',
    email: options.adminEmail,
    access: 'admin',
  })
  const auditor: SeedUser = {
    name: 'K. Halim',
    role: 'External auditor',
    email: options.auditorEmail,
    access: 'read',
  }

  // A record that lapsed before the audit is a finding, so any date the mockup
  // left in the past is rolled forward into the next review cycle. The counter
  // is shared so consecutive rolled dates do not all land on the same day.
  let rolled = 0
  function futureReview(date: string | undefined | null): string | null {
    if (!date) return null
    if (new Date(date) > today) return date
    return new Date(today.getTime() + (45 + (rolled++ % 300)) * DAY).toISOString().slice(0, 10)
  }

  // Clauses ---------------------------------------------------------------
  const clauses: SeedClause[] = []
  const known = new Set<string>()
  const seen = new Set(CL.map((c) => c.id))

  /** Catalogue requirements the mockup does not track — seeded with full coverage. */
  const catalogue: CatalogEntry[] = []
  /** References that fall outside the catalogue: visible, but out of scope. */
  const stubs: { id: string; std: Standard; title: string }[] = []

  // Clause numbers are unique within a standard, not across them: ISO 9001 9.2
  // (internal audit) and the ISMS's own 9.2 are different requirements with the
  // same number. The tracked row keeps the bare number; the catalogue entry from
  // the other standard is namespaced the way cross references already are
  // ("9001 9.2"), so both exist and both resolve. See ADR-0011.
  const trackedStandard = new Map(CL.map((c) => [c.id, c.std as Standard]))
  const key = (id: string, std: Standard) => {
    const clash = trackedStandard.get(id)
    return clash && clash !== std ? `${std} ${id}` : id
  }
  const taken = (k: string) =>
    seen.has(k) || stubs.some((s) => s.id === k) || catalogue.some((c) => c.id === k)
  const add = (id: string, std: Standard, title: string) => {
    const k = key(id, std)
    if (taken(k)) return
    stubs.push({ id: k, std, title })
  }

  // The whole catalogue is loaded, not only the requirements the mockup tracks
  // (ADR-0011). Every catalogue requirement is in scope and gets its own policy,
  // form and evidence below, so the seeded ISMS is certification-ready rather
  // than partially implemented. Only references outside the catalogue stay at
  // weight 0.
  for (const entry of CATALOG) {
    const k = key(entry.id, entry.standard)
    if (taken(k)) continue
    catalogue.push({ id: k, standard: entry.standard, title: entry.title })
  }

  // A cross reference may still point outside the catalogue; those get a stub
  // so the many-to-many links always resolve.
  for (const c of CL) {
    for (const p of c.p) {
      for (const f of p.f) {
        for (const x of f.x) {
          add(bareClauseId(x), standardOf(x), 'Referenced requirement — outside the catalogue')
        }
      }
    }
  }

  for (const c of CL) {
    clauses.push({
      clauseId: c.id,
      standard: c.std as Standard,
      title: c.t,
      // Certification-ready: every tracked requirement is closed out.
      status: 'compliant',
      owner: c.o,
      nextReview: futureReview(c.r),
      criticality: 1,
    })
    known.add(c.id)
  }

  for (const s of stubs) {
    clauses.push({
      clauseId: s.id,
      standard: s.std,
      title: s.title,
      // No policy, form or evidence is filed against it yet, which is what
      // "gap" means on every other screen.
      status: 'gap',
      owner: 'Dhiaz Fathra',
      nextReview: null,
      // Weight 0: the requirement is real and visible, but the ISMS has not
      // taken it into scope, so it must not move the readiness score.
      criticality: 0,
    })
    known.add(s.id)
  }

  // Policies, forms, evidence ---------------------------------------------
  const policies: SeedPolicy[] = []
  const forms: SeedForm[] = []
  const evidence: SeedEvidenceRow[] = []
  const policyNames = new Set<string>()

  for (const c of CL) {
    for (const p of c.p) {
      const crossClauses = new Set<string>([c.id])
      for (const f of p.f) {
        for (const x of f.x) {
          const id = bareClauseId(x)
          if (known.has(id)) crossClauses.add(id)
        }
      }

      policies.push({
        name: p.n,
        version: p.v,
        // Nothing is left in draft or in review at certification.
        status: 'Approved',
        owner: c.o,
        primaryClause: c.id,
        clauses: [...crossClauses],
        body: policyBody({ title: p.n, clauseId: c.id, owner: c.o, version: p.v }),
        revisions: (PVERS[p.n] ?? PVERS._default!).map((v) => ({
          version: v.v,
          date: v.d,
          author: v.by,
          approval: v.appr,
          status: v.s,
          note: v.note,
        })),
      })
      policyNames.add(p.n)

      for (const f of p.f) {
        const also: string[] = []
        const externalRefs: string[] = []
        for (const x of f.x) {
          const id = bareClauseId(x)
          if (known.has(id)) also.push(id)
          else externalRefs.push(x)
        }

        forms.push({
          code: f.c,
          name: f.n,
          policy: p.n,
          primaryClause: c.id,
          alsoSatisfies: also,
          externalRefs,
        })

        for (const e of f.e) {
          // Each of these is rolled independently, exactly as the register
          // recorded them: an expiry, its review and the two dates printed
          // inside the record itself each take the next slot in the cycle, so
          // a batch of lapsed records does not all come back due on one day.
          const expiryDate = futureReview(e.ex)
          const reviewDate = futureReview(e.ex)
          const recordNext = futureReview(e.ex) ?? e.d
          const recordExpiry = futureReview(e.ex) ?? e.d
          evidence.push({
            title: e.n,
            fileType: e.ty as SeedEvidenceRow['fileType'],
            form: f.c,
            satisfies: [...new Set([c.id, ...also])],
            uploader: e.by,
            uploadedAt: e.d,
            expiryDate,
            reviewDate,
            retention: '3 years',
            sha: sha(e.n, e.d),
            revisions: (VERS[e.n] ?? [{ v: 'v1', d: e.d, by: e.by, note: 'Initial upload.' }]).map(
              (v) => ({ version: v.v, date: v.d, author: v.by, note: v.note }),
            ),
            body: recordBody({
              entry: { id: c.id, title: c.t, standard: c.std as Standard },
              formCode: f.c,
              owner: c.o,
              performed: e.d,
              next: recordNext,
              expiry: recordExpiry,
              index: e.n.length,
            }),
          })
        }
      }
    }
  }

  // Full coverage for the rest of the catalogue ---------------------------
  // One approved policy, one controlled form and one dated record per
  // requirement: the minimum chain an auditor samples.
  //
  // The clause row is always created here, because the requirement exists
  // whoever answers it. The derived policy, form and record are a *fallback*:
  // where the organisation has written the real document (`documents/`), that
  // document is the answer, and filing a generic one beside it would put two
  // documents in front of an auditor where the ISMS has one.
  const documented = new Set(DOCUMENTS.map((d) => d.clause))
  for (const [i, entry] of catalogue.entries()) {
    const cov = coverageFor(entry, i, today)
    clauses.push({
      clauseId: entry.id,
      standard: entry.standard,
      title: entry.title,
      status: 'compliant',
      owner: cov.owner,
      nextReview: cov.nextReview,
      criticality: 1,
    })
    known.add(entry.id)

    if (documented.has(entry.id)) continue

    policies.push({
      name: cov.policy.name,
      version: cov.policy.version,
      status: cov.policy.status,
      owner: cov.owner,
      primaryClause: entry.id,
      clauses: [entry.id],
      body: cov.policy.body,
      revisions: cov.policy.revisions,
    })

    forms.push({
      code: cov.form.code,
      name: cov.form.name,
      policy: cov.policy.name,
      primaryClause: entry.id,
      alsoSatisfies: [],
      externalRefs: [],
    })

    evidence.push({
      title: cov.evidence.title,
      fileType: cov.evidence.fileType,
      form: cov.form.code,
      satisfies: [entry.id],
      uploader: cov.owner,
      uploadedAt: cov.evidence.uploadedAt,
      expiryDate: cov.evidence.expiryDate,
      reviewDate: cov.evidence.expiryDate,
      retention: '3 years',
      sha: sha(entry.id, cov.evidence.uploadedAt),
      revisions: [
        {
          version: 'v1.0',
          date: cov.evidence.uploadedAt,
          author: cov.owner,
          note: 'Filed against the approved control record.',
        },
      ],
      body: cov.evidence.body,
    })
  }

  // Real controlled documents ---------------------------------------------
  // The organisation's own governance documents (ADR-0017), filed against the
  // requirement they satisfy with their cross references, revision history and
  // review dates intact. Everything above gives the register its shape; this is
  // the text an auditor actually reads.
  for (const doc of DOCUMENTS) {
    if (!known.has(doc.clause))
      throw new Error(`${doc.code} maps to unknown requirement ${doc.clause}`)

    const also: string[] = []
    const externalRefs: string[] = []
    for (const ref of doc.crossRefs) {
      const id = known.has(ref) ? ref : known.has(bareClauseId(ref)) ? bareClauseId(ref) : undefined
      if (id) also.push(id)
      else externalRefs.push(ref)
    }

    const name = `${doc.code} · ${doc.title}`
    policies.push({
      name,
      version: doc.version,
      status: 'Approved',
      owner: doc.owner,
      primaryClause: doc.clause,
      clauses: [...new Set([doc.clause, ...also])],
      body: doc.body,
      revisions: doc.revisions.map((r) => ({
        version: r.version,
        date: r.date,
        author: r.author,
        approval: r.approval,
        status: r.status,
        note: r.note,
      })),
    })

    forms.push({
      code: doc.form.code,
      name: doc.form.name,
      policy: name,
      primaryClause: doc.clause,
      alsoSatisfies: also,
      externalRefs,
    })

    for (const e of doc.evidence) {
      evidence.push({
        title: e.name,
        fileType: e.fileType,
        form: doc.form.code,
        satisfies: [...new Set([doc.clause, ...also])],
        uploader: e.uploader,
        uploadedAt: e.uploadedAt,
        expiryDate: futureReview(e.expiryDate),
        reviewDate: futureReview(e.expiryDate),
        retention: '3 years',
        sha: sha(e.name, e.uploadedAt),
        revisions: [
          {
            version: doc.version,
            date: e.uploadedAt,
            author: e.uploader,
            note: e.note,
          },
        ],
        body: e.body ?? doc.body,
      })
    }
  }

  // Activity --------------------------------------------------------------
  // No gaps are seeded: every requirement in the catalogue is closed out, so
  // the gap register is empty by construction.
  const base = today
  const activity: SeedActivity[] = ACTIVITY.map((a, i) => ({
    at: new Date(base.getTime() - i * 3600_000).toISOString(),
    actor: a.who,
    action: a.what,
    ref: a.ref,
  }))

  // External auditor: a read-only user, and the time-boxed session that scopes
  // them. SESSION-0094 is the one the mockup shows (ADR-0009).
  const auditSession: SeedAuditSession = {
    sessionId: 'SESSION-0094',
    label: 'External · K. Halim',
    auditor: auditor.name,
    startedAt: today.toISOString(),
    expiresAt: new Date(today.getTime() + options.auditorSessionHours * 3600_000).toISOString(),
    revoked: false,
    downloads: 0,
  }

  return {
    users,
    auditor,
    clauses,
    policies,
    forms,
    evidence,
    activity,
    auditSession,
    stats: {
      inScope: CL.length + catalogue.length,
      referenced: stubs.length,
      policies: policyNames.size + catalogue.length,
    },
  }
}
