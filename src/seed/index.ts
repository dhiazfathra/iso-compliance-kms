import { getPayload } from 'payload'
import config from '@payload-config'
import { ACTIVITY, CL, PVERS, ROLES, VERS } from './mockup-data'
import { CATALOG, type CatalogEntry } from './iso-catalog'
import { coverageFor, policyBody } from './coverage'
import { placeholderFile } from './placeholder'

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@dermaster.local'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'changeme123'
const AUDITOR_EMAIL = process.env.SEED_AUDITOR_EMAIL || 'k.halim@external.audit'
/** How long the seeded external-auditor session stays live, in hours. */
const AUDITOR_SESSION_HOURS = Number(process.env.SEED_AUDITOR_SESSION_HOURS || 8)

/** '9001 7.5.1' and 'A.6.3' both appear as cross references in the mockup. */
function bareClauseId(ref: string): string {
  return ref.replace(/^(9001|27001)\s+/, '')
}

function standardOf(ref: string): '27001' | '9001' {
  if (ref.startsWith('9001 ')) return '9001'
  if (ref.startsWith('27001 ')) return '27001'
  return ref.startsWith('A.') ? '27001' : '9001'
}

const slugEmail = (name: string) => `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@dermaster.local`

const run = async () => {
  const payload = await getPayload({ config })

  // Wipe in dependency order so the seed is repeatable.
  for (const collection of [
    'audit-sessions',
    'activity',
    'gaps',
    'evidence',
    'forms',
    'policies',
    'clauses',
  ] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }

  // Users -----------------------------------------------------------------
  const userIds = new Map<string, number>()
  for (const [name, role] of Object.entries(ROLES)) {
    const email = slugEmail(name)
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    })
    const doc =
      existing.docs[0] ??
      (await payload.create({
        collection: 'users',
        data: { name, role, email, password: ADMIN_PASSWORD, access: 'write' },
      }))
    userIds.set(name, doc.id)
  }

  const admins = await payload.find({
    collection: 'users',
    where: { email: { equals: ADMIN_EMAIL } },
  })
  if (!admins.docs.length) {
    await payload.create({
      collection: 'users',
      data: {
        name: 'Ratna Wijaya',
        role: 'Compliance Manager',
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        access: 'admin',
      },
    })
  }

  const userId = (name: string) => userIds.get(name) ?? userIds.values().next().value!

  // Clauses ---------------------------------------------------------------
  // Cross references point at clauses that may not be primary rows in the
  // mockup; create stubs for them so the many-to-many links always resolve.
  const clauseIds = new Map<string, number>()
  const seen = new Set(CL.map((c) => c.id))
  const today = new Date()
  const DAY = 86_400_000

  // A record that lapsed before the audit is a finding, so any date the mockup
  // left in the past is rolled forward into the next review cycle.
  let rolled = 0
  function futureReview(date: string | undefined | null): string | null {
    if (!date) return null
    if (new Date(date) > today) return date
    return new Date(today.getTime() + (45 + (rolled++ % 300)) * DAY).toISOString().slice(0, 10)
  }

  /** Catalogue requirements the mockup does not track — seeded with full coverage. */
  const catalogue: CatalogEntry[] = []
  /** References that fall outside the catalogue: visible, but out of scope. */
  const stubs: { id: string; std: '27001' | '9001'; title: string }[] = []
  // Clause numbers are unique within a standard, not across them: ISO 9001 9.2
  // (internal audit) and the ISMS's own 9.2 are different requirements with the
  // same number. The tracked row keeps the bare number; the catalogue entry from
  // the other standard is namespaced the way cross references already are
  // ("9001 9.2"), so both exist and both resolve. See ADR-0011.
  const trackedStandard = new Map(CL.map((c) => [c.id, c.std as '27001' | '9001']))
  const key = (id: string, std: '27001' | '9001') => {
    const clash = trackedStandard.get(id)
    return clash && clash !== std ? `${std} ${id}` : id
  }
  const taken = (k: string) =>
    seen.has(k) || stubs.some((s) => s.id === k) || catalogue.some((c) => c.id === k)
  const add = (id: string, std: '27001' | '9001', title: string) => {
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
    const doc = await payload.create({
      collection: 'clauses',
      data: {
        clauseId: c.id,
        standard: c.std as '27001' | '9001',
        title: c.t,
        // Certification-ready: every tracked requirement is closed out.
        status: 'compliant',
        owner: userId(c.o),
        nextReview: futureReview(c.r),
        criticality: 1,
      },
    })
    clauseIds.set(c.id, doc.id)
  }

  for (const s of stubs) {
    const doc = await payload.create({
      collection: 'clauses',
      data: {
        clauseId: s.id,
        standard: s.std,
        title: s.title,
        // No policy, form or evidence is filed against it yet, which is what
        // "gap" means on every other screen.
        status: 'gap',
        owner: userId('Ratna Wijaya'),
        // Weight 0: the requirement is real and visible, but the ISMS has not
        // taken it into scope, so it must not move the readiness score.
        criticality: 0,
      },
    })
    clauseIds.set(s.id, doc.id)
  }

  // Policies, forms, evidence --------------------------------------------
  const policyIds = new Map<string, number>()

  for (const c of CL) {
    for (const p of c.p) {
      const crossClauses = new Set<number>([clauseIds.get(c.id)!])
      for (const f of p.f) {
        for (const x of f.x) {
          const id = clauseIds.get(bareClauseId(x))
          if (id) crossClauses.add(id)
        }
      }

      const revisions = (PVERS[p.n] ?? PVERS._default).map((v) => ({
        version: v.v,
        date: v.d,
        author: userId(v.by),
        approval: v.appr,
        status: v.s,
        note: v.note,
      }))

      const policy = await payload.create({
        collection: 'policies',
        data: {
          name: p.n,
          version: p.v,
          // Nothing is left in draft or in review at certification.
          status: 'Approved',
          owner: userId(c.o),
          primaryClause: clauseIds.get(c.id)!,
          clauses: [...crossClauses],
          body: policyBody({ title: p.n, clauseId: c.id, owner: c.o, version: p.v }),
          revisions,
        },
      })
      policyIds.set(p.n, policy.id)

      for (const f of p.f) {
        const also: number[] = []
        const externalRefs: { ref: string }[] = []
        for (const x of f.x) {
          const id = clauseIds.get(bareClauseId(x))
          if (id) also.push(id)
          else externalRefs.push({ ref: x })
        }

        const form = await payload.create({
          collection: 'forms',
          data: {
            code: f.c,
            name: f.n,
            policy: policy.id,
            primaryClause: clauseIds.get(c.id)!,
            alsoSatisfies: also,
            externalRefs,
          },
        })

        for (const e of f.e) {
          const revs = (VERS[e.n] ?? [{ v: 'v1', d: e.d, by: e.by, note: 'Initial upload.' }]).map(
            (v) => ({ version: v.v, date: v.d, author: userId(v.by), note: v.note }),
          )
          await payload.create({
            collection: 'evidence',
            data: {
              title: e.n,
              fileType: e.ty as 'PDF' | 'XLSX' | 'PPTX' | 'DOCX' | 'PNG' | 'JPG',
              form: form.id,
              satisfies: [...new Set([clauseIds.get(c.id)!, ...also])],
              uploader: userId(e.by),
              uploadedAt: e.d,
              expiryDate: futureReview(e.ex),
              reviewDate: futureReview(e.ex),
              retention: '3 years',
              sha: `sha256:${e.n.length.toString(16).padStart(2, '0')}${e.d.replace(/-/g, '')}`,
              revisions: revs,
            },
            file: placeholderFile(e.n, e.ty),
          })
        }
      }
    }
  }

  // Full coverage for the rest of the catalogue ---------------------------
  // One approved policy, one controlled form and one dated record per
  // requirement: the minimum chain an auditor samples.
  for (const [i, entry] of catalogue.entries()) {
    const cov = coverageFor(entry, i, today)
    const clause = await payload.create({
      collection: 'clauses',
      data: {
        clauseId: entry.id,
        standard: entry.standard,
        title: entry.title,
        status: 'compliant',
        owner: userId(cov.owner),
        nextReview: cov.nextReview,
        criticality: 1,
      },
    })
    clauseIds.set(entry.id, clause.id)

    const policy = await payload.create({
      collection: 'policies',
      data: {
        name: cov.policy.name,
        version: cov.policy.version,
        status: cov.policy.status,
        owner: userId(cov.owner),
        primaryClause: clause.id,
        clauses: [clause.id],
        body: cov.policy.body,
        revisions: cov.policy.revisions.map((r) => ({ ...r, author: userId(r.author) })),
      },
    })

    const form = await payload.create({
      collection: 'forms',
      data: {
        code: cov.form.code,
        name: cov.form.name,
        policy: policy.id,
        primaryClause: clause.id,
        alsoSatisfies: [],
        externalRefs: [],
      },
    })

    await payload.create({
      collection: 'evidence',
      data: {
        title: cov.evidence.title,
        fileType: cov.evidence.fileType,
        form: form.id,
        satisfies: [clause.id],
        uploader: userId(cov.owner),
        uploadedAt: cov.evidence.uploadedAt,
        expiryDate: cov.evidence.expiryDate,
        reviewDate: cov.evidence.expiryDate,
        retention: '3 years',
        sha: `sha256:${entry.id.length.toString(16).padStart(2, '0')}${cov.evidence.uploadedAt.replace(/-/g, '')}`,
        revisions: [
          {
            version: 'v1.0',
            date: cov.evidence.uploadedAt,
            author: userId(cov.owner),
            note: 'Filed against the approved control record.',
          },
        ],
      },
      file: placeholderFile(cov.evidence.title, cov.evidence.fileType),
    })
  }

  // Activity --------------------------------------------------------------
  // No gaps are seeded: every requirement in the catalogue is closed out, so
  // the gap register is empty by construction.

  // External auditor: a read-only user, and the time-boxed session that scopes
  // them. SESSION-0094 is the one the mockup shows (ADR-0009).
  const auditors = await payload.find({
    collection: 'users',
    where: { email: { equals: AUDITOR_EMAIL } },
  })
  const auditor =
    auditors.docs[0] ??
    (await payload.create({
      collection: 'users',
      data: {
        name: 'K. Halim',
        role: 'External auditor',
        email: AUDITOR_EMAIL,
        password: ADMIN_PASSWORD,
        access: 'read',
      },
    }))
  const startedAt = new Date()
  await payload.create({
    collection: 'audit-sessions',
    data: {
      sessionId: 'SESSION-0094',
      label: 'External · K. Halim',
      auditor: auditor.id,
      startedAt: startedAt.toISOString(),
      expiresAt: new Date(startedAt.getTime() + AUDITOR_SESSION_HOURS * 3600_000).toISOString(),
      revoked: false,
      downloads: 0,
    },
  })

  const base = new Date()
  for (const [i, a] of ACTIVITY.entries()) {
    await payload.create({
      collection: 'activity',
      data: {
        at: new Date(base.getTime() - i * 3600_000).toISOString(),
        actor: a.who,
        action: a.what,
        ref: a.ref,
      },
    })
  }

  payload.logger.info(
    `Seeded ${CL.length + catalogue.length} in-scope requirements ` +
      `(+${stubs.length} referenced, out of scope), ` +
      `${policyIds.size + catalogue.length} policies, 0 open gaps.`,
  )
  process.exit(0)
}

await run()
