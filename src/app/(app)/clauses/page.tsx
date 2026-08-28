import { Suspense } from 'react'
import { ClauseFilters } from '@/components/ClauseFilters'
import { ClauseTree } from '@/components/ClauseTree'
import { filterClauses, loadGraph, openChainKeys, type ClauseFilter } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function ClausesPage({
  searchParams,
}: {
  searchParams: Promise<ClauseFilter>
}) {
  const { q = '', std = 'all', status = 'all', owner = '', scope = 'tracked' } = await searchParams
  const graph = await loadGraph()

  const clauses = filterClauses(graph.clauses, { q, std, status, owner, scope })
  const initialOpen = openChainKeys(clauses, !!q.trim())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Suspense fallback={<div className="toolbar" />}>
        <ClauseFilters resultLabel={`${clauses.length} of ${graph.clauses.length}`} />
      </Suspense>
      <ClauseTree
        key={`${q}-${std}-${status}-${scope}`}
        clauses={clauses}
        initialOpen={initialOpen}
      />
    </div>
  )
}
