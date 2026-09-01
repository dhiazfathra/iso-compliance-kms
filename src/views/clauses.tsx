import { Suspense } from 'react'
import { ClauseFilters } from '@/components/ClauseFilters'
import { ClauseTree } from '@/components/ClauseTree'
import { filterClauses, openChainKeys, type ClauseFilter } from '@/lib/graph'
import type { ViewProps } from './types'

export function ClausesView({
  graph,
  base,
  filter,
}: Pick<ViewProps, 'graph' | 'base'> & { filter: Required<ClauseFilter> }) {
  const { q, std, status, owner, scope } = filter
  const clauses = filterClauses(graph.clauses, { q, std, status, owner, scope })
  const initialOpen = openChainKeys(clauses, !!q.trim())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Suspense fallback={<div className="toolbar" />}>
        <ClauseFilters resultLabel={`${clauses.length} of ${graph.clauses.length}`} base={base} />
      </Suspense>
      <ClauseTree
        base={base}
        key={`${q}-${std}-${status}-${scope}`}
        clauses={clauses}
        initialOpen={initialOpen}
      />
    </div>
  )
}
