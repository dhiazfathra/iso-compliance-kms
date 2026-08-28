'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { after } from 'next/server'
import { requireUser } from '@/lib/auth'
import { hasLevel } from '@/lib/access'
import { loadGraph } from '@/lib/data'
import { buildPack } from '@/lib/audit-pack'

/**
 * Request a pack. The row is created and the response returns immediately; the
 * ZIP is built in `after()`, so the screen is never blocked on reading every
 * evidence file (ADR-0012).
 */
export async function requestAuditPack() {
  const user = await requireUser()
  if (!hasLevel(user, 'write')) return { ok: false, error: 'Your session is read-only.' }

  const payload = await getPayload({ config })
  const at = new Date()
  const count = await payload.count({ collection: 'audit-packs', overrideAccess: true })
  const packId = `PACK-${String(count.totalDocs + 1).padStart(4, '0')}`

  await payload.create({
    collection: 'audit-packs',
    overrideAccess: false,
    user,
    data: {
      packId,
      status: 'building',
      scope: 'All standards · in-scope requirements',
      requestedBy: user.id,
      requestedAt: at.toISOString(),
    },
  })

  await payload.create({
    collection: 'activity',
    overrideAccess: false,
    user,
    data: {
      at: at.toISOString(),
      actor: user.name,
      action: `requested audit pack ${packId}`,
      ref: packId,
    },
  })

  const h = await nextHeaders()
  const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('host')}`
  const cookie = h.get('cookie') ?? ''
  const graph = await loadGraph()

  after(async () => {
    await buildPack({ packId, graph, origin, cookie })
  })

  revalidatePath('/audit-pack')
  return { ok: true, packId }
}
