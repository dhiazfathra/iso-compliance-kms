import { loadGraph } from '@/lib/data'
import { GapsView } from '@/views/gaps'

export const dynamic = 'force-dynamic'

export default async function GapsPage() {
  return <GapsView graph={await loadGraph()} base="" />
}
