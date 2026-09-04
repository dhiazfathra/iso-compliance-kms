import type { ClauseNode, FormNode, Graph, PolicyNode, User } from './data'
import { daysUntil } from './format'

/**
 * Groups `items` by the key each one belongs under, in one pass.
 *
 * The hierarchy used to be assembled with a `filter` inside a `map`, which is
 * quadratic: with the full requirement catalogue (ADR-0011) that is clauses ×
 * policies × forms × evidence comparisons on every render of every screen.
 */
export function groupBy<T, K>(items: T[], key: (item: T) => K): Map<K, T[]> {
  const out = new Map<K, T[]>()
  for (const item of items) {
    const k = key(item)
    const bucket = out.get(k)
    if (bucket) bucket.push(item)
    else out.set(k, [item])
  }
  return out
}

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

/**
 * A requirement is in scope when it carries weight (ADR-0011). The rest of the
 * catalogue is loaded as weight-0 stubs so cross-map links resolve, and must
 * not be counted as something this ISMS tracks.
 */
export function isTracked(c: ClauseNode): boolean {
  return (c.criticality ?? 1) > 0
}

export function trackedClauses(clauses: ClauseNode[]): ClauseNode[] {
  return clauses.filter(isTracked)
}

/** Weighted readiness: compliant counts 1, in-progress 0.5, needs-review 0.75. */
export function readiness(clauses: ClauseNode[]): number {
  const weight: Record<string, number> = { compliant: 1, review: 0.75, progress: 0.5, gap: 0 }
  const total = clauses.reduce((n, c) => n + (c.criticality ?? 1), 0)
  if (!total) return 0
  const got = clauses.reduce((n, c) => n + (c.criticality ?? 1) * (weight[c.status] ?? 0), 0)
  return Math.round((got / total) * 100)
}

/** Requirements in one status, optionally narrowed to one standard. */
export function statusCount(clauses: ClauseNode[], status: string, standard?: string): number {
  return clauses.filter((c) => c.status === status && (!standard || c.standard === standard)).length
}

// ── Expiry horizon ───────────────────────────────────────────────────────────

export type ExpiryItem = {
  name: string
  clause: string
  owner: string
  date: string
  href: string
}

export type ExpiryHorizon = { items: ExpiryItem[]; overdue: number; soon: number }

/** How near a date has to be to count as "soon" on the dashboard and the owner table. */
export const SOON_DAYS = 30

/**
 * Everything that can lapse, oldest first: clause review dates and evidence
 * expiry dates in one list, so nothing with a deadline is invisible. `now` is a
 * parameter so the clock stays out of the render — and out of the tests.
 */
export function expiryHorizon(graph: Graph, now: Date = new Date()): ExpiryHorizon {
  const items: ExpiryItem[] = [
    ...graph.clauses
      .filter((c) => c.nextReview)
      .map((c) => ({
        name: `Clause review · ${c.title}`,
        clause: c.clauseId,
        owner: c.owner.name,
        date: c.nextReview!,
        href: `/clauses?q=${encodeURIComponent(c.clauseId)}`,
      })),
    ...graph.evidence
      .filter((e) => e.expiryDate)
      .map((e) => ({
        name: e.title,
        clause: e.satisfies[0] ?? '—',
        owner: e.uploader.name,
        date: e.expiryDate!,
        href: `/evidence/${e.id}`,
      })),
  ].sort((a, b) => a.date.localeCompare(b.date))

  let overdue = 0
  let soon = 0
  for (const x of items) {
    const d = daysUntil(x.date, now)
    if (d === null) continue
    if (d < 0) overdue++
    else if (d <= SOON_DAYS) soon++
  }
  return { items, overdue, soon }
}

// ── Owner accountability ─────────────────────────────────────────────────────

export type OwnerRow = {
  user: User
  total: number
  compliant: number
  progress: number
  review: number
  gap: number
  evidence: number
  due: number
}

/** Requirement load per owner, busiest first. Owners with nothing owned drop out. */
export function ownerLoad(graph: Graph, now: Date = new Date()): OwnerRow[] {
  return graph.users
    .map((user) => {
      const owned = graph.clauses.filter((c) => c.owner.id === user.id)
      const due = owned.filter((c) => {
        const d = daysUntil(c.nextReview, now)
        return d !== null && d <= SOON_DAYS
      }).length
      return {
        user,
        total: owned.length,
        compliant: statusCount(owned, 'compliant'),
        progress: statusCount(owned, 'progress'),
        review: statusCount(owned, 'review'),
        gap: statusCount(owned, 'gap'),
        evidence: graph.evidence.filter((e) => e.uploader.id === user.id).length,
        due,
      }
    })
    .filter((r) => r.total)
    .sort((a, b) => b.total - a.total)
}

// ── Gap register ─────────────────────────────────────────────────────────────

export type GapStats = { open: number; blocking: number; meanProgress: number; medianAge: number }

/** Headline numbers for the gap register. `medianAge` is in days, sign dropped. */
export function gapStats(gaps: Graph['gaps'], now: Date = new Date()): GapStats {
  const ages = gaps.map((g) => Math.abs(daysUntil(g.due, now) ?? 0)).sort((a, b) => a - b)
  return {
    open: gaps.length,
    blocking: gaps.filter((g) => g.blocking).length,
    meanProgress: Math.round(gaps.reduce((n, g) => n + g.progress, 0) / (gaps.length || 1)),
    medianAge: ages.length ? ages[Math.floor(ages.length / 2)] : 0,
  }
}

// ── Cross-mapping matrix ─────────────────────────────────────────────────────

export type MatrixMark = 'primary' | 'cross'
export type MatrixRow = { form: FormNode; policy?: PolicyNode; hits: Map<string, MatrixMark> }
export type Matrix = { rows: MatrixRow[]; columns: ClauseNode[] }

/**
 * Artefacts that satisfy more than one requirement, and only the requirements
 * they actually point at: a matrix of every clause would be mostly empty and
 * unreadable.
 */
export function crossMapMatrix(graph: Graph): Matrix {
  const rows = graph.forms
    .map((form) => {
      const hits = new Map<string, MatrixMark>()
      hits.set(form.primaryClause, 'primary')
      for (const x of form.alsoSatisfies) if (!hits.has(x)) hits.set(x, 'cross')
      return { form, policy: graph.policies.find((p) => p.id === form.policy), hits }
    })
    .filter((r) => r.hits.size > 1)

  return { rows, columns: graph.clauses.filter((c) => rows.some((r) => r.hits.has(c.clauseId))) }
}

// ── Clause search ────────────────────────────────────────────────────────────

export type ClauseFilter = {
  q?: string
  std?: string
  status?: string
  owner?: string
  scope?: string
}

/** Does the needle appear anywhere in a clause's chain, down to evidence titles? */
function matchesNeedle(c: ClauseNode, needle: string): boolean {
  return (
    c.clauseId.toLowerCase().includes(needle) ||
    c.title.toLowerCase().includes(needle) ||
    c.owner.name.toLowerCase().includes(needle) ||
    crossMapOf(c).some((x) => x.toLowerCase().includes(needle)) ||
    c.policies.some(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.forms.some(
          (f) =>
            f.name.toLowerCase().includes(needle) ||
            f.code.toLowerCase().includes(needle) ||
            f.evidence.some((e) => e.title.toLowerCase().includes(needle)),
        ),
    )
  )
}

/**
 * The clauses screen's view of the catalogue. The default scope is the
 * requirements this ISMS has taken in (ADR-0011); the rest of the catalogue is
 * one chip away, or reachable by searching for the clause number.
 */
export function filterClauses(clauses: ClauseNode[], filter: ClauseFilter): ClauseNode[] {
  const needle = (filter.q ?? '').trim().toLowerCase()
  const { std = 'all', status = 'all', owner = '', scope = 'tracked' } = filter

  return clauses.filter((c) => {
    if (scope === 'tracked' && !isTracked(c) && !needle) return false
    if (std !== 'all' && c.standard !== std) return false
    if (status !== 'all' && c.status !== status) return false
    if (owner && c.owner.name !== owner) return false
    return !needle || matchesNeedle(c, needle)
  })
}

/**
 * Node keys to expand on first paint. A search, or a result set small enough to
 * read at once, opens the whole chain: an auditor asking about a clause should
 * see its evidence without another click.
 */
export function openChainKeys(clauses: ClauseNode[], searched: boolean): string[] {
  if (!searched && clauses.length > 3) return []
  return clauses.flatMap((c) => [
    c.clauseId,
    ...c.policies.flatMap((p) => [
      `${c.clauseId}|${p.name}`,
      ...p.forms.map((f) => `${c.clauseId}|${p.name}|${f.code}`),
    ]),
  ])
}
