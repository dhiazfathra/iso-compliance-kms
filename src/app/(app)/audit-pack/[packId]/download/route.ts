import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { sessionState } from '@/lib/auth'
import { recordDownload } from '@/lib/audit-session'

/**
 * Packs are served the way evidence is (ADR-0010): through the app, with the
 * session checked, so an expired audit session cannot keep pulling the export.
 */
export async function GET(req: Request, { params }: { params: Promise<{ packId: string }> }) {
  const { packId } = await params
  const { user, session, live } = await sessionState()
  if (!user || !live) return NextResponse.redirect(new URL('/login', req.url))

  const payload = await getPayload({ config })
  const found = await payload.find({
    collection: 'audit-packs',
    where: { packId: { equals: packId } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
    user,
  })
  const pack = found.docs[0]
  if (!pack) return new NextResponse('No such pack.', { status: 404 })
  if (pack.status !== 'ready' || !pack.url) {
    return new NextResponse(`Pack ${packId} is ${pack.status}.`, { status: 409 })
  }

  const upstream = await fetch(pack.url)
  if (!upstream.ok || !upstream.body) {
    return new NextResponse('The stored pack could not be read.', { status: 502 })
  }

  if (session) await recordDownload(session, `audit pack ${packId}`)

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${packId}.zip"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
