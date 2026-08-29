import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import { requireUser } from './auth'

export * from './graph'

export type User = { id: number; name: string; role: string }
export type Clause = {
  id: number
  clauseId: string
  standard: string
  title: string
  status: string
  owner: User
  nextReview?: string | null
  criticality?: number | null
}
export type EvidenceItem = {
  id: number
  title: string
  fileType: string
  uploadedAt: string
  expiryDate?: string | null
  reviewDate?: string | null
  retention?: string | null
  sha?: string | null
  filesize?: number | null
  url?: string | null
  mimeType?: string | null
  uploader: User
  form: number
  satisfies: string[]
  revisions: { version: string; date: string; author?: string; note?: string | null }[]
}
export type FormNode = {
  id: number
  code: string
  name: string
  policy: number
  primaryClause: string
  alsoSatisfies: string[]
  externalRefs: string[]
  evidence: EvidenceItem[]
}
export type PolicyNode = {
  id: number
  name: string
  version: string
  status: string
  owner?: User
  /** The controlled document text, in Markdown (ADR-0016). */
  body?: string | null
  primaryClause: string
  clauses: string[]
  revisions: {
    version: string
    date: string
    author?: string
    approval?: string | null
    status?: string | null
    note?: string | null
  }[]
  forms: FormNode[]
}
export type ClauseNode = Clause & { policies: PolicyNode[] }

export type Graph = {
  clauses: ClauseNode[]
  policies: PolicyNode[]
  forms: FormNode[]
  evidence: EvidenceItem[]
  users: User[]
  gaps: {
    id: number
    clause: Clause
    finding: string
    task: string
    owner: User
    due: string
    blocking: boolean
    progress: number
  }[]
  activity: { id: number; at: string; actor: string; action: string; ref?: string | null }[]
}

const rel = <T>(v: unknown): T | undefined => (v && typeof v === 'object' ? (v as T) : undefined)
const relId = (v: unknown): number =>
  v && typeof v === 'object' ? (v as { id: number }).id : Number(v)
const clauseCode = (v: unknown): string =>
  v && typeof v === 'object' ? ((v as { clauseId: string }).clauseId ?? '') : String(v ?? '')

/**
 * One read of the whole compliance graph. The dataset is a few hundred rows, so
 * assembling the hierarchy in memory beats N nested queries per screen — and it
 * gives every screen the same cross-mapping view.
 */
export const loadGraph = cache(async (): Promise<Graph> => {
  const user = await requireUser()
  const payload = await getPayload({ config })
  // The signed-in user is passed through so every read is checked by the
  // collection's own access rules (ADR-0008); nothing here overrides them.
  const opts = { limit: 1000, depth: 1, overrideAccess: false, user, pagination: false } as const

  const [users, clauses, policies, forms, evidence, gaps, activity] = await Promise.all([
    payload.find({ collection: 'users', ...opts }),
    payload.find({ collection: 'clauses', sort: 'clauseId', ...opts }),
    payload.find({ collection: 'policies', sort: 'name', ...opts }),
    payload.find({ collection: 'forms', sort: 'code', ...opts }),
    payload.find({ collection: 'evidence', sort: '-uploadedAt', ...opts }),
    payload.find({ collection: 'gaps', sort: 'due', ...opts }),
    payload.find({ collection: 'activity', sort: '-at', ...opts }),
  ])

  const evidenceItems: EvidenceItem[] = evidence.docs.map((e) => ({
    id: e.id,
    title: e.title,
    fileType: e.fileType,
    uploadedAt: e.uploadedAt,
    expiryDate: e.expiryDate,
    reviewDate: e.reviewDate,
    retention: e.retention,
    sha: e.sha,
    filesize: e.filesize,
    url: e.url,
    mimeType: e.mimeType,
    uploader: rel<User>(e.uploader) ?? { id: 0, name: '—', role: '' },
    form: relId(e.form),
    satisfies: (e.satisfies ?? []).map(clauseCode),
    revisions: (e.revisions ?? []).map((r) => ({
      version: r.version,
      date: r.date,
      author: rel<User>(r.author)?.name,
      note: r.note,
    })),
  }))

  const formNodes: FormNode[] = forms.docs.map((f) => ({
    id: f.id,
    code: f.code,
    name: f.name,
    policy: relId(f.policy),
    primaryClause: clauseCode(f.primaryClause),
    alsoSatisfies: (f.alsoSatisfies ?? []).map(clauseCode),
    externalRefs: (f.externalRefs ?? []).map((x) => x.ref),
    evidence: evidenceItems.filter((e) => e.form === f.id),
  }))

  const policyNodes: PolicyNode[] = policies.docs.map((p) => ({
    id: p.id,
    name: p.name,
    version: p.version,
    status: p.status,
    owner: rel<User>(p.owner),
    body: p.body,
    primaryClause: clauseCode(p.primaryClause),
    clauses: (p.clauses ?? []).map(clauseCode),
    revisions: (p.revisions ?? []).map((r) => ({
      version: r.version,
      date: r.date,
      author: rel<User>(r.author)?.name,
      approval: r.approval,
      status: r.status,
      note: r.note,
    })),
    forms: formNodes.filter((f) => f.policy === p.id),
  }))

  const clauseNodes: ClauseNode[] = clauses.docs.map((c) => ({
    id: c.id,
    clauseId: c.clauseId,
    standard: c.standard,
    title: c.title,
    status: c.status,
    owner: rel<User>(c.owner) ?? { id: 0, name: '—', role: '' },
    nextReview: c.nextReview,
    criticality: c.criticality,
    policies: policyNodes.filter((p) => p.primaryClause === c.clauseId),
  }))

  return {
    clauses: clauseNodes,
    policies: policyNodes,
    forms: formNodes,
    evidence: evidenceItems,
    users: users.docs.map((u) => ({ id: u.id, name: u.name, role: u.role })),
    gaps: gaps.docs.map((g) => ({
      id: g.id,
      clause: rel<Clause>(g.clause)!,
      finding: g.finding,
      task: g.task,
      owner: rel<User>(g.owner)!,
      due: g.due,
      blocking: !!g.blocking,
      progress: g.progress ?? 0,
    })),
    activity: activity.docs.map((a) => ({
      id: a.id,
      at: a.at,
      actor: a.actor,
      action: a.action,
      ref: a.ref,
    })),
  }
})
