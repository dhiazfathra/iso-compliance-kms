import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { sessionState } from '@/lib/auth'
import { recordDownload } from '@/lib/audit-session'

/**
 * Every download goes through here rather than straight to the Blob URL, so a
 * read-only audit session's download count is real and the trail records it.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, session, live } = await sessionState()
  if (!user || !live) return NextResponse.redirect(new URL('/login', _req.url))

  const payload = await getPayload({ config })
  const item = await payload.findByID({
    collection: 'evidence',
    id: Number(id),
    depth: 0,
    overrideAccess: false,
    user,
  })
  if (!item?.url) return new NextResponse('No file stored for this record.', { status: 404 })

  if (session) await recordDownload(session, item.title)
  return NextResponse.redirect(new URL(item.url, _req.url))
}
