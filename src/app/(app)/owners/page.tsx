import { loadGraph } from '@/lib/data'
import { OwnersView } from '@/views/owners'

export const dynamic = 'force-dynamic'

export default async function OwnersPage() {
  const graph = await loadGraph()

  return <OwnersView graph={graph} base="" />
}
