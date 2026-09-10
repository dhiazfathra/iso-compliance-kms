/**
 * Full-coverage artefacts.
 *
 * The mockup dataset only covers the requirements the ISMS had started on. For
 * a certification-ready state every requirement in the catalogue needs the same
 * chain the tracked ones have: an approved policy, a controlled form, and a
 * dated piece of evidence filed against it. This module derives that chain from
 * a catalogue entry so the seed produces a complete, in-scope ISMS instead of a
 * partial one. See ADR-0011 for the catalogue/tracked distinction — every
 * catalogue row is now in scope (weight 1), and only references that fall
 * outside the catalogue stay at weight 0.
 */
import type { CatalogEntry } from './iso-catalog'

const DAY = 86_400_000

const FILE_TYPES = ['PDF', 'XLSX', 'DOCX'] as const

/** ISO 9001 clauses are the QMS's; Annex A controls are the ISMS's. */
const prefix = (e: CatalogEntry) => (e.standard === '9001' ? 'QMS' : 'ISMS')

const code = (id: string) => id.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '')

const iso = (d: Date) => d.toISOString().slice(0, 10)

export type Coverage = {
  policy: {
    name: string
    version: string
    status: 'Approved'
    body: string
    revisions: PolicyRevision[]
  }
  form: { code: string; name: string }
  evidence: {
    title: string
    fileType: (typeof FILE_TYPES)[number]
    uploadedAt: string
    expiryDate: string
    /** The record's own text, written into the file. */
    body: string
  }
  owner: string
  nextReview: string
}

export type PolicyRevision = {
  version: string
  date: string
  author: string
  approval: string
  status: string
  note: string
}

/**
 * The chain for one catalogue requirement. `index` only spreads owners, file
 * types and dates deterministically, so re-seeding gives the same result.
 */
export function coverageFor(entry: CatalogEntry, index: number, today: Date): Coverage {
  const owner = 'Dhiaz Fathra'
  const drafted = new Date(today.getTime() - (330 - (index % 300)) * DAY)
  const approved = new Date(drafted.getTime() + 21 * DAY)
  const uploaded = new Date(today.getTime() - (20 + (index % 120)) * DAY)
  // Everything under control stays in date: reviews and expiries land inside
  // the next twelve months, none of them overdue.
  const nextReview = new Date(today.getTime() + (30 + (index % 300)) * DAY)
  const expiry = new Date(uploaded.getTime() + 400 * DAY)
  const p = prefix(entry)
  const c = code(entry.id)

  return {
    owner,
    nextReview: iso(nextReview),
    policy: {
      name: `${p}-POL-${c} · ${entry.title}`,
      version: 'v1.2',
      status: 'Approved',
      body: policyBody({
        title: entry.title,
        clauseId: entry.id,
        owner,
        version: 'v1.2',
        family: controlFamily(entry),
      }),
      revisions: [
        {
          version: 'v1.0',
          date: iso(drafted),
          author: 'Dhiaz Fathra',
          approval: 'Drafted',
          status: 'Superseded',
          note: `Initial control statement for ${entry.id}.`,
        },
        {
          version: 'v1.1',
          date: iso(new Date(drafted.getTime() + 10 * DAY)),
          author: 'Dhiaz Fathra',
          approval: 'Reviewed by Compliance',
          status: 'Superseded',
          note: 'Review comments incorporated; responsibilities named.',
        },
        {
          version: 'v1.2',
          date: iso(approved),
          author: 'Dhiaz Fathra',
          approval: 'Approved by Management Representative',
          status: 'Current',
          note: 'Approved and published to the document register.',
        },
      ],
    },
    form: {
      code: `FRM-${p}-${c}-01`,
      name: `${entry.title} — ${p} control record`,
    },
    evidence: {
      title: `${p}-${c}-record-${iso(uploaded)}.${FILE_TYPES[index % FILE_TYPES.length].toLowerCase()}`,
      fileType: FILE_TYPES[index % FILE_TYPES.length],
      uploadedAt: iso(uploaded),
      expiryDate: iso(expiry),
      body: recordBody({
        entry,
        formCode: `FRM-${p}-${c}-01`,
        owner,
        performed: iso(uploaded),
        next: iso(nextReview),
        expiry: iso(expiry),
        index,
      }),
    },
  }
}

/** The people a control record is signed off by, spread deterministically. */
const OPERATORS = ['Randy', 'Wiwin', 'Tika', 'Agil', 'Rica', 'Andreas'] as const

/**
 * The text of one filed control record. A record an auditor picks up says what
 * was checked, over what population, what was found and when it is due again —
 * so the derived artefacts say that too, rather than naming themselves.
 */
export function recordBody(args: {
  entry: CatalogEntry
  formCode: string
  owner: string
  performed: string
  next: string
  expiry: string
  index: number
}): string {
  const { entry, index } = args
  const operator = OPERATORS[index % OPERATORS.length]
  const sampled = 8 + (index % 15)
  const scope = entry.standard === '9001' ? 'the QMS scope' : 'the ISMS scope'

  return [
    `# ${entry.title} — control record`,
    '',
    `**Requirement** ${entry.id} (${entry.standard === '9001' ? 'ISO 9001:2015' : 'ISO/IEC 27001:2022'})`,
    `**Form** ${args.formCode} · **Performed by** ${operator} · **Reviewed by** ${args.owner}`,
    `**Performed** ${args.performed} · **Next due** ${args.next} · **Retain until** ${args.expiry}`,
    '',
    '## Population and sample',
    '',
    `Systems and records inside ${scope} at PT Cakrawala Bumi Estetika: the Eternesia`,
    'services, the Super App, the marketplace services, and the clinic estate across 13',
    `locations. ${sampled} items were sampled for this period.`,
    '',
    '## What was checked',
    '',
    `1. The control stated in the policy for ${entry.id} is operating as written.`,
    '2. The named owner is still the accountable person, and still has the access the',
    '   control needs — checked against Zitadel roles.',
    '3. Records from the previous period were retained for their stated period and no',
    '   longer.',
    '',
    '## Result',
    '',
    `- Sampled: ${sampled} · Conforming: ${sampled} · Exceptions: 0`,
    '- No deviation was found that required a gap to be raised.',
    '- Evidence produced this period is filed under this form.',
    '',
    '## Notes',
    '',
    'This record is seed data: the structure, dates and sign-off chain are what the tool',
    'stores for a real control record, but the sample itself was not drawn from a live',
    'system. Replace it with the organisation’s own record before an audit.',
    '',
    `_Signed_ ${operator} · countersigned ${args.owner}, ${args.performed}`,
  ].join('\n')
}

/** The control families a policy body can speak to more specifically than the generic skeleton. */
export type ControlFamily = 'access' | 'cryptography' | 'logging' | 'supplier' | 'hr' | 'general'

/**
 * Which family a requirement belongs to, by Annex A clause range. ISO 9001
 * clauses and every Annex A control outside these ranges stay `'general'` —
 * per ADR-0013 that generic skeleton is enough where an auditor reads the
 * eight real documents anyway, not this derived text.
 */
export function controlFamily(entry: CatalogEntry): ControlFamily {
  if (entry.standard === '9001') return 'general'
  const n = Number(entry.id.split('.')[2] ?? entry.id.split('.')[1])
  if (entry.id.startsWith('A.6')) return 'hr'
  if (entry.id === 'A.8.24') return 'cryptography'
  if (entry.id.startsWith('A.8') && n >= 15 && n <= 17) return 'logging'
  if (entry.id.startsWith('A.5') && n >= 19 && n <= 23) return 'supplier'
  if (
    (entry.id.startsWith('A.5') && n >= 15 && n <= 18) ||
    (entry.id.startsWith('A.8') && n >= 1 && n <= 5)
  )
    return 'access'
  return 'general'
}

/** One extra, family-specific policy line for section 3 — everything else keeps the generic three. */
const FAMILY_POLICY_LINE: Record<Exclude<ControlFamily, 'general'>, string> = {
  access:
    '4. Access is granted on least privilege and reviewed against the named owner at least quarterly, through Zitadel roles.',
  cryptography:
    '4. Keys are customer-managed, rotated on the schedule set by the key policy, and never leave the KMS boundary in the clear.',
  logging:
    '4. Logs are retained for the period this document sets, protected from tampering, and reviewed for the events this control names.',
  supplier:
    '4. The supplier agreement is on file before service starts, names this control among its obligations, and is reassessed at renewal.',
  hr: "4. The requirement is applied at the employment lifecycle stage it names — screening, onboarding, change or exit — before the person's access changes.",
}

/**
 * The Markdown text of a controlled document (ADR-0016). Every seeded policy
 * carries one so the Markdown viewer, the editor and the PDF export all have
 * something real to render straight after a seed.
 */
export function policyBody(args: {
  title: string
  clauseId: string
  owner: string
  version: string
  family?: ControlFamily
}): string {
  const familyLine =
    args.family && args.family !== 'general' ? FAMILY_POLICY_LINE[args.family] : null
  return [
    `# ${args.title}`,
    '',
    `**Document owner** ${args.owner} · **Version** ${args.version} · **Requirement** ${args.clauseId}`,
    '',
    '## 1. Purpose',
    '',
    `This document states how the organisation satisfies ${args.clauseId} (${args.title}) and`,
    'what evidence is produced as a result.',
    '',
    '## 2. Scope',
    '',
    '- All staff, contractors and third parties acting on behalf of the organisation.',
    '- All information systems and records within the ISMS and QMS scope statement.',
    '',
    '## 3. Policy',
    '',
    '1. The control described here is operated at the stated frequency and its output is filed',
    '   against this document as evidence.',
    '2. The document owner reviews this text at least annually, and after any incident or change',
    '   that affects it.',
    '3. Deviations are raised as a gap, with an owner and a due date, and tracked to closure.',
    ...(familyLine ? [familyLine] : []),
    '',
    '> Records produced under this document are retained for three years unless a longer',
    '> statutory period applies.',
    '',
    '## 4. Responsibilities',
    '',
    `- **${args.owner}** — operates and maintains the control.`,
    '- **Management Representative** — approves this document and its revisions.',
    '- **Internal audit** — samples the records for effectiveness.',
    '',
    '## 5. Related records',
    '',
    'The controlled forms listed on this page, and the evidence filed under each of them.',
    '',
  ].join('\n')
}
