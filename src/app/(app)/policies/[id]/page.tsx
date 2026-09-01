import { notFound } from 'next/navigation'
import { loadGraph } from '@/lib/data'
import { currentUser } from '@/lib/auth'
import { hasLevel } from '@/lib/access'
import { PolicyDetailView } from '@/views/policy-detail'
import { savePolicyBody } from './actions'

export const dynamic = 'force-dynamic'

export default async function PolicyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const graph = await loadGraph()
  const policy = graph.policies.find((p) => String(p.id) === id)
  if (!policy) notFound()

  const user = await currentUser()

  return (
    <PolicyDetailView
      graph={graph}
      base=""
      canWrite={hasLevel(user, 'write')}
      policy={policy}
      onSave={savePolicyBody}
    />
  )
}
