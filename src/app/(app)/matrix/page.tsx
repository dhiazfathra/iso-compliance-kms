import { loadGraph } from '@/lib/data'
import { MatrixView } from '@/views/matrix'

export const dynamic = 'force-dynamic'

export default async function MatrixPage() {
  return <MatrixView graph={await loadGraph()} />
}
