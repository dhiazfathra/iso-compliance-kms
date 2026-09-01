/**
 * The seeded register as the `Graph` every screen already reads.
 *
 * `build.ts` refers to rows by natural key, because the database is what
 * assigns ids. A pack has no database, so it assigns its own: stable, dense
 * numbers in the order the rows were built. Local mode then reads the pack
 * through exactly the same `Graph` type the server hands its own screens, which
 * is what lets both share one set of views.
 */
import { placeholderFile } from './placeholder'
import type { SeedData } from './build'
import type { ClauseNode, EvidenceItem, FormNode, Graph, PolicyNode, User } from '../lib/data'

export type SeedGraph = {
  graph: Graph
  /** Evidence id to the bytes filed for it. */
  files: Map<number, { bytes: Uint8Array; mimetype: string }>
}

export function seedGraph(data: SeedData): SeedGraph {
  const users: User[] = [...data.users, data.auditor].map((u, i) => ({
    id: i + 1,
    name: u.name,
    role: u.role,
  }))
  // Names repeat across accounts — the administrator holds a second record —
  // and the register refers to a person, so the first match is the person.
  const userByName = new Map<string, User>()
  for (const u of users) if (!userByName.has(u.name)) userByName.set(u.name, u)
  const unknown: User = { id: 0, name: '—', role: '' }
  const user = (name: string) => userByName.get(name) ?? unknown

  const clauseIds = new Map<string, number>()
  data.clauses.forEach((c, i) => clauseIds.set(c.clauseId, i + 1))

  const files: SeedGraph['files'] = new Map()
  const evidence: EvidenceItem[] = data.evidence.map((e, i) => {
    const id = i + 1
    const file = placeholderFile(e.title, e.fileType, e.body)
    files.set(id, { bytes: file.data, mimetype: file.mimetype })
    return {
      id,
      title: e.title,
      fileType: e.fileType,
      uploadedAt: e.uploadedAt,
      expiryDate: e.expiryDate,
      reviewDate: e.reviewDate,
      retention: e.retention,
      sha: e.sha,
      filesize: file.size,
      // The bytes travel in the pack, not at a URL: whoever reads the pack
      // resolves them through `graph.json`'s `evidenceFiles`.
      url: null,
      mimeType: file.mimetype,
      uploader: user(e.uploader),
      form: 0,
      satisfies: e.satisfies,
      revisions: e.revisions.map((r) => ({
        version: r.version,
        date: r.date,
        author: r.author,
        note: r.note,
      })),
    }
  })

  const formIds = new Map<string, number>()
  data.forms.forEach((f, i) => formIds.set(f.code, i + 1))
  const evidenceByForm = new Map<string, EvidenceItem[]>()
  data.evidence.forEach((e, i) => {
    const item = evidence[i]!
    item.form = formIds.get(e.form)!
    const list = evidenceByForm.get(e.form)
    if (list) list.push(item)
    else evidenceByForm.set(e.form, [item])
  })

  const forms: FormNode[] = data.forms.map((f) => ({
    id: formIds.get(f.code)!,
    code: f.code,
    name: f.name,
    policy: 0,
    primaryClause: f.primaryClause,
    alsoSatisfies: f.alsoSatisfies,
    externalRefs: f.externalRefs,
    evidence: evidenceByForm.get(f.code) ?? [],
  }))

  const policyIds = new Map<string, number>()
  data.policies.forEach((p, i) => policyIds.set(p.name, i + 1))
  const formsByPolicy = new Map<string, FormNode[]>()
  data.forms.forEach((f, i) => {
    const node = forms[i]!
    node.policy = policyIds.get(f.policy)!
    const list = formsByPolicy.get(f.policy)
    if (list) list.push(node)
    else formsByPolicy.set(f.policy, [node])
  })

  const policies: PolicyNode[] = data.policies.map((p) => ({
    id: policyIds.get(p.name)!,
    name: p.name,
    version: p.version,
    status: p.status,
    owner: user(p.owner),
    body: p.body,
    primaryClause: p.primaryClause,
    clauses: p.clauses,
    revisions: p.revisions.map((r) => ({
      version: r.version,
      date: r.date,
      author: r.author,
      approval: r.approval ?? null,
      status: r.status ?? null,
      note: r.note,
    })),
    forms: formsByPolicy.get(p.name) ?? [],
  }))

  const clauses: ClauseNode[] = data.clauses.map((c) => ({
    id: clauseIds.get(c.clauseId)!,
    clauseId: c.clauseId,
    standard: c.standard,
    title: c.title,
    status: c.status,
    owner: user(c.owner),
    nextReview: c.nextReview,
    criticality: c.criticality,
    policies: policies.filter((p) => p.primaryClause === c.clauseId),
  }))

  return {
    graph: {
      clauses,
      policies,
      forms,
      evidence,
      users,
      // The seed closes every requirement out, so the gap register is empty by
      // construction — see `build.ts`.
      gaps: [],
      activity: data.activity.map((a, i) => ({
        id: i + 1,
        at: a.at,
        actor: a.actor,
        action: a.action,
        ref: a.ref,
      })),
    },
    files,
  }
}
