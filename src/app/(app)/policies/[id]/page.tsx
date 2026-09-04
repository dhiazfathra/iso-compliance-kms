import { notFound } from 'next/navigation'
import { loadGraph, loadPolicyBody } from '@/lib/data'
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

  // The whole-graph read no longer carries document text; this screen is one of
  // the two that renders it, so it asks for its own.
  const [user, body] = await Promise.all([currentUser(), loadPolicyBody(policy.id)])

  return (
    <PolicyDetailView
      graph={graph}
      base=""
      canWrite={hasLevel(user, 'write')}
      policy={{ ...policy, body }}
      onSave={savePolicyBody}
    />
  )
}
