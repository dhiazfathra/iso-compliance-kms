import { NextResponse } from 'next/server'
import { sweepExpiredPacks } from '@/lib/audit-pack'

export const dynamic = 'force-dynamic'

/**
 * Daily storage lifecycle (see `crons` in vercel.json): delete the ZIPs whose
 * window has closed. Vercel signs its cron requests with `CRON_SECRET`; without
 * one configured the route refuses, so it can never be an open delete button.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return new NextResponse('CRON_SECRET is not configured.', { status: 503 })
  if (req.headers.get('authorization') !== `Bearer ${secret}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const swept = await sweepExpiredPacks()
  return NextResponse.json({ swept })
}
