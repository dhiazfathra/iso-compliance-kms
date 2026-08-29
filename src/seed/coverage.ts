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

export const OWNER_POOL = [
  'Dewi Kartika',
  'Andi Prasetyo',
  'Ratna Wijaya',
  'Bayu Santoso',
  'Sari Handayani',
  'Fajar Nugroho',
] as const

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
  const owner = OWNER_POOL[index % OWNER_POOL.length]
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
      body: policyBody({ title: entry.title, clauseId: entry.id, owner, version: 'v1.2' }),
      revisions: [
        {
          version: 'v1.0',
          date: iso(drafted),
          author: owner,
          approval: 'Drafted',
          status: 'Superseded',
          note: `Initial control statement for ${entry.id}.`,
        },
        {
          version: 'v1.1',
          date: iso(new Date(drafted.getTime() + 10 * DAY)),
          author: 'Ratna Wijaya',
          approval: 'Reviewed by Compliance',
          status: 'Superseded',
          note: 'Review comments incorporated; responsibilities named.',
        },
        {
          version: 'v1.2',
          date: iso(approved),
          author: 'Dewi Kartika',
          approval: 'Approved by Management Representative',
          status: 'Current',
          note: 'Approved and published to the document register.',
        },
      ],
    },
    form: {
      code: `FRM-${c}-01`,
      name: `${entry.title} — control record`,
    },
    evidence: {
      title: `${p}-${c}-record-${iso(uploaded)}.${FILE_TYPES[index % FILE_TYPES.length].toLowerCase()}`,
      fileType: FILE_TYPES[index % FILE_TYPES.length],
      uploadedAt: iso(uploaded),
      expiryDate: iso(expiry),
    },
  }
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
}): string {
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
