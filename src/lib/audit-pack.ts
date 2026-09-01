/**
 * Building, storing and expiring an audit pack.
 *
 * The pack's contents are `pack.ts`, which is pure and also runs in the
 * browser. This module is the server half: it reads the evidence bytes, uploads
 * the archive and sweeps expired packs.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { del, put } from '@vercel/blob'
import { zip } from './zip'
import { evidenceEntryNames, packEntries } from './pack'
import type { Graph } from './data'

/** How long a pack stays downloadable before the sweep deletes it. */
export const PACK_TTL_DAYS = 14
const PREFIX = 'audit-packs/'

export const packPathname = (packId: string) => `${PREFIX}${packId}.zip`

/**
 * The origin `buildPack` calls back into to read evidence bytes.
 *
 * That call carries the requester's session cookie, so the address must never
 * come from the request: a forged `Host` header would post the cookie to
 * whoever sent it. Configuration first (`NEXT_PUBLIC_SERVER_URL`), then the
 * platform's own injected hostname, and only outside production does the
 * request's host serve as a local-development convenience.
 */
export function selfOrigin(requestHost: string | null): string {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL
  if (configured) return new URL(configured).origin

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`

  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_SERVER_URL is not set; refusing to trust the request host.')
  }
  return `http://${requestHost ?? 'localhost:3000'}`
}

/**
 * Build the ZIP and store it. Runs after the response (`after()`), as the
 * system rather than as the requester: the pack is a fixed export, not a
 * user-shaped query. Evidence bytes are read back through the app's own gated
 * route, so there is still exactly one door to them (ADR-0010).
 */
export async function buildPack({
  packId,
  graph,
  origin,
  cookie,
}: {
  packId: string
  graph: Graph
  origin: string
  cookie: string
}): Promise<void> {
  const payload = await getPayload({ config })
  const at = new Date()

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) throw new Error('No BLOB_READ_WRITE_TOKEN: nowhere to store the pack.')

    const entries = packEntries(graph, packId, at)
    const names = evidenceEntryNames(graph)
    for (const item of graph.evidence) {
      if (!item.url) continue
      const res = await fetch(new URL(`/evidence/${item.id}/download?inline=1`, origin), {
        headers: { cookie },
      })
      if (!res.ok) throw new Error(`Could not read ${item.title} (${res.status}).`)
      entries.push({
        path: `evidence/${names.get(item.id)}`,
        content: new Uint8Array(await res.arrayBuffer()),
      })
    }

    const buf = zip(entries)
    // A Blob, not the raw array: the writers now return `Uint8Array` so they
    // also run in the browser, and Blob is the upload body every runtime takes.
    const stored = await put(packPathname(packId), new Blob([buf]), {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'application/zip',
      token,
    })

    await payload.update({
      collection: 'audit-packs',
      where: { packId: { equals: packId } },
      overrideAccess: true,
      data: {
        status: 'ready',
        completedAt: at.toISOString(),
        expiresAt: new Date(at.getTime() + PACK_TTL_DAYS * 86_400_000).toISOString(),
        url: stored.url,
        pathname: stored.pathname,
        size: buf.length,
        itemCount: entries.length,
      },
    })
  } catch (err) {
    await payload.update({
      collection: 'audit-packs',
      where: { packId: { equals: packId } },
      overrideAccess: true,
      data: { status: 'failed', error: err instanceof Error ? err.message : String(err) },
    })
  }
}

/**
 * The other half of the lifecycle: a pack past its window is deleted from
 * storage and marked expired, so an export cannot outlive the audit it was
 * made for. Returns how many were swept.
 */
export async function sweepExpiredPacks(now = new Date()): Promise<number> {
  const payload = await getPayload({ config })
  const due = await payload.find({
    collection: 'audit-packs',
    where: { status: { equals: 'ready' }, expiresAt: { less_than: now.toISOString() } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })

  const token = process.env.BLOB_READ_WRITE_TOKEN
  let swept = 0
  for (const pack of due.docs) {
    try {
      if (pack.url) {
        if (!token) throw new Error('No BLOB_READ_WRITE_TOKEN: cannot delete the stored pack.')
        await del(pack.url, { token })
      }
    } catch (err) {
      // The row keeps saying `ready` on purpose: a pack whose file is still out
      // there has not expired, whatever the date says. The next sweep retries.
      await payload.update({
        collection: 'audit-packs',
        id: pack.id,
        overrideAccess: true,
        data: { error: `Sweep failed: ${err instanceof Error ? err.message : String(err)}` },
      })
      continue
    }
    await payload.update({
      collection: 'audit-packs',
      id: pack.id,
      overrideAccess: true,
      data: { status: 'expired', url: null, size: null, error: null },
    })
    swept++
  }
  return swept
}
