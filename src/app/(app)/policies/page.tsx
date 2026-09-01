import { loadGraph } from '@/lib/data'
import { PoliciesView } from '@/views/policies'

export const dynamic = 'force-dynamic'

export default async function PoliciesPage() {
  const graph = await loadGraph()

  return <PoliciesView graph={graph} base="" />
}
