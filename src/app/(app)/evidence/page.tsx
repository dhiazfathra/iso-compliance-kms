import { loadGraph } from '@/lib/data'
import { EvidenceView } from '@/views/evidence'

export const dynamic = 'force-dynamic'

export default async function EvidencePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const graph = await loadGraph()

  return <EvidenceView graph={graph} base="" filter={{ q }} />
}
