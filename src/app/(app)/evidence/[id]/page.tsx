import { notFound } from 'next/navigation'
import { loadGraph } from '@/lib/data'
import { EvidenceDetailView } from '@/views/evidence-detail'
import { uploadNewVersion } from './actions'

export const dynamic = 'force-dynamic'

export default async function EvidenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const graph = await loadGraph()
  const item = graph.evidence.find((e) => String(e.id) === id)
  if (!item) notFound()

  return <EvidenceDetailView graph={graph} base="" item={item} onUpload={uploadNewVersion} />
}
