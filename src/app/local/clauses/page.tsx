'use client'

/**
 * Filters live in the query string here exactly as they do on the hosted app —
 * the filter bar posts a GET, so the two modes share one component and one set
 * of shareable URLs. Reading them client-side needs the Suspense boundary.
 */
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import type { ClauseFilter } from '@/lib/graph'
import { ClausesView } from '@/views/clauses'
import { PackGate } from '../pack-gate'

function Clauses() {
  const params = useSearchParams()
  const filter: Required<ClauseFilter> = {
    q: params.get('q') ?? '',
    std: (params.get('std') ?? 'all') as Required<ClauseFilter>['std'],
    status: (params.get('status') ?? 'all') as Required<ClauseFilter>['status'],
    owner: params.get('owner') ?? '',
    scope: (params.get('scope') ?? 'tracked') as Required<ClauseFilter>['scope'],
  }

  return (
    <PackGate>
      {(pack) => <ClausesView graph={pack.graph} base="/local" filter={filter} />}
    </PackGate>
  )
}

export default function LocalClausesPage() {
  return (
    <Suspense>
      <Clauses />
    </Suspense>
  )
}
