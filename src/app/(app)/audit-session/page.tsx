import { loadGraph } from '@/lib/data'
import { sessionState } from '@/lib/auth'
import { recordClauseView } from '@/lib/audit-session'
import { AuditSessionView } from '@/views/audit-session'

export const dynamic = 'force-dynamic'

export default async function AuditSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ clause?: string }>
}) {
  const { clause } = await searchParams
  const graph = await loadGraph()
  // Default to a requirement the ISMS actually tracks, not the first row of the
  // catalogue (ADR-0011).
  const tracked = graph.clauses.filter((c) => (c.criticality ?? 1) > 0)
  const current = graph.clauses.find((c) => c.clauseId === clause) ?? tracked[0]
  if (!current) return <div className="block">No requirements loaded.</div>

  // The banner below promises the trail; this is where the promise is kept.
  const { session } = await sessionState()
  const viewed = session ? await recordClauseView(session, current.clauseId) : 0

  return (
    <AuditSessionView
      graph={graph}
      base=""
      current={current}
      session={session ? { ...session, viewed } : null}
    />
  )
}
