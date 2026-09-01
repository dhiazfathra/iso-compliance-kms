import { loadGraph, type ClauseFilter } from '@/lib/data'
import { ClausesView } from '@/views/clauses'

export const dynamic = 'force-dynamic'

export default async function ClausesPage({
  searchParams,
}: {
  searchParams: Promise<ClauseFilter>
}) {
  const { q = '', std = 'all', status = 'all', owner = '', scope = 'tracked' } = await searchParams
  const graph = await loadGraph()

  return <ClausesView graph={graph} base="" filter={{ q, std, status, owner, scope }} />
}
