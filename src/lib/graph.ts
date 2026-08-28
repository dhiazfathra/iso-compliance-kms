import type { ClauseNode } from './data'

/** Every clause a clause's artefacts also satisfy — the cross-map, deduped. */
export function crossMapOf(c: ClauseNode): string[] {
  const out = new Set<string>()
  for (const p of c.policies) {
    for (const x of p.clauses) if (x !== c.clauseId) out.add(x)
    for (const f of p.forms) {
      for (const x of f.alsoSatisfies) if (x !== c.clauseId) out.add(x)
      for (const x of f.externalRefs) out.add(x)
    }
  }
  return [...out]
}

export function evidenceCount(c: ClauseNode): number {
  return c.policies.reduce((n, p) => n + p.forms.reduce((m, f) => m + f.evidence.length, 0), 0)
}

/** Weighted readiness: compliant counts 1, in-progress 0.5, needs-review 0.75. */
export function readiness(clauses: ClauseNode[]): number {
  const weight: Record<string, number> = { compliant: 1, review: 0.75, progress: 0.5, gap: 0 }
  const total = clauses.reduce((n, c) => n + (c.criticality ?? 1), 0)
  if (!total) return 0
  const got = clauses.reduce((n, c) => n + (c.criticality ?? 1) * (weight[c.status] ?? 0), 0)
  return Math.round((got / total) * 100)
}
