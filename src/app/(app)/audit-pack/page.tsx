import { getPayload } from 'payload'
import config from '@payload-config'
import { loadGraph } from '@/lib/data'
import { requireUser } from '@/lib/auth'
import { hasLevel } from '@/lib/access'
import { PACK_TTL_DAYS } from '@/lib/audit-pack'
import { AuditPackView } from '@/views/audit-pack'
import { requestAuditPack } from './actions'

export const dynamic = 'force-dynamic'

export default async function AuditPackPage() {
  const graph = await loadGraph()
  const user = await requireUser()
  const payload = await getPayload({ config })
  const packs = await payload.find({
    collection: 'audit-packs',
    sort: '-requestedAt',
    limit: 8,
    depth: 1,
    overrideAccess: false,
    user,
  })

  return (
    <AuditPackView
      graph={graph}
      base=""
      canWrite={hasLevel(user, 'write')}
      packs={packs.docs}
      ttlDays={PACK_TTL_DAYS}
      onRequest={requestAuditPack}
    />
  )
}
