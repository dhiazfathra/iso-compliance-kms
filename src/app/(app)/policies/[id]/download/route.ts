import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { sessionState } from '@/lib/auth'
import { markdownPdf } from '@/lib/pdf'
import { fmtDate } from '@/lib/format'

/**
 * The controlled document as a PDF. Generated per request from the stored
 * Markdown rather than kept as a file, so a download can never be a stale copy
 * of an approved document. Access is the collection's own (ADR-0008), and an
 * expired auditor session is refused here as everywhere else.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, live } = await sessionState()
  if (!user || !live) return NextResponse.redirect(new URL('/login', req.url))

  const payload = await getPayload({ config })
  const policy = await payload.findByID({
    collection: 'policies',
    id: Number(id),
    depth: 0,
    overrideAccess: false,
    user,
  })
  if (!policy) return new NextResponse('No such document.', { status: 404 })

  const current = policy.revisions?.[0]
  const subtitle = [
    policy.version,
    policy.status,
    current?.date ? `approved ${fmtDate(current.date)}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  const bytes = markdownPdf(policy.body ?? '', { title: policy.name, subtitle })
  const filename = `${policy.name} ${policy.version}.pdf`.replace(/[^\w.\-() ]+/g, '_')

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-store',
    },
  })
}
