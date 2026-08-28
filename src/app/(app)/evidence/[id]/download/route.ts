import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { sessionState } from '@/lib/auth'
import { recordDownload } from '@/lib/audit-session'

/**
 * The only way evidence bytes leave this application. Vercel Blob URLs are
 * public to anyone holding them and the storage plugin supports nothing else,
 * so the bytes are streamed through here instead of linked: the session is
 * checked, the collection's own access rules are applied, and a read-only audit
 * session's download counter is incremented (ADR-0010).
 *
 * `?inline=1` is the preview (rendered in an iframe or an img); without it the
 * browser is told to save the file.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, session, live } = await sessionState()
  if (!user || !live) return NextResponse.redirect(new URL('/login', req.url))

  const payload = await getPayload({ config })
  const item = await payload.findByID({
    collection: 'evidence',
    id: Number(id),
    depth: 0,
    overrideAccess: false,
    user,
  })
  if (!item?.url) return new NextResponse('No file stored for this record.', { status: 404 })

  const inline = new URL(req.url).searchParams.get('inline') === '1'
  // `item.url` is Payload's own file route, which applies the collection's read
  // access itself — so the caller's session cookie travels with the fetch.
  // A cold instance can refuse its own first subrequest, hence the one retry.
  const read = () =>
    fetch(new URL(item.url!, req.url), { headers: { cookie: req.headers.get('cookie') ?? '' } })
  let upstream = await read()
  if (!upstream.ok) {
    await new Promise((r) => setTimeout(r, 250))
    upstream = await read()
  }
  if (!upstream.ok || !upstream.body) {
    return new NextResponse('The stored file could not be read.', { status: 502 })
  }

  // A preview is a view, not a download; only the latter is counted, which is
  // the number the certification body asks about.
  if (session && !inline) await recordDownload(session, item.title)

  const filename = item.filename ?? item.title
  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': item.mimeType ?? 'application/octet-stream',
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${filename.replace(/"/g, '')}"`,
      // The bytes are access-controlled, so no shared cache may hold them.
      'Cache-Control': 'private, no-store',
    },
  })
}
