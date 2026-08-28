import { Suspense } from 'react'
import { ClauseFilters } from '@/components/ClauseFilters'
import { ClauseTree } from '@/components/ClauseTree'
import { crossMapOf, loadGraph } from '@/lib/data'

export const dynamic = 'force-dynamic'

type Search = { q?: string; std?: string; status?: string; owner?: string }

export default async function ClausesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { q = '', std = 'all', status = 'all', owner = '' } = await searchParams
  const graph = await loadGraph()
  const needle = q.trim().toLowerCase()

  const clauses = graph.clauses.filter((c) => {
    if (std !== 'all' && c.standard !== std) return false
    if (status !== 'all' && c.status !== status) return false
    if (owner && c.owner.name !== owner) return false
    if (!needle) return true
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
  })

  // A search or a single result opens the chain: an auditor asking about a
  // clause should see its evidence without another click.
  const initialOpen =
    needle || clauses.length <= 3
      ? clauses.flatMap((c) => [
          c.clauseId,
          ...c.policies.flatMap((p) => [
            `${c.clauseId}|${p.name}`,
            ...p.forms.map((f) => `${c.clauseId}|${p.name}|${f.code}`),
          ]),
        ])
      : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Suspense fallback={<div className="toolbar" />}>
        <ClauseFilters resultLabel={`${clauses.length} of ${graph.clauses.length}`} />
      </Suspense>
      <ClauseTree key={`${q}-${std}-${status}`} clauses={clauses} initialOpen={initialOpen} />
    </div>
  )
}
