import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import type { AuditSession, User as PayloadUser } from '@/payload-types'

/**
 * The signed-in user for this request, resolved from the Payload session
 * cookie. Cached per request so the layout and the page share one lookup.
 */
export const currentUser = cache(async (): Promise<PayloadUser | null> => {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await nextHeaders() })
  return (user as PayloadUser | null) ?? null
})

/**
 * The external-auditor session this user is holding, if any. Staff users have
 * none, and are unaffected by any of the expiry logic below.
 */
export const auditSessionFor = cache(async (userId: number): Promise<AuditSession | null> => {
  const payload = await getPayload({ config })
  const found = await payload.find({
    collection: 'audit-sessions',
    where: { auditor: { equals: userId } },
    sort: '-startedAt',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return (found.docs[0] as AuditSession | undefined) ?? null
})

export const sessionIsLive = (session: AuditSession, now = new Date()): boolean =>
  !session.revoked && new Date(session.expiresAt).getTime() > now.getTime()

/** The user plus their audit session, with the session's expiry already applied. */
export const sessionState = cache(
  async (): Promise<{ user: PayloadUser | null; session: AuditSession | null; live: boolean }> => {
    const user = await currentUser()
    if (!user) return { user: null, session: null, live: false }
    const session = await auditSessionFor(user.id)
    return { user, session, live: !session || sessionIsLive(session) }
  },
)

/**
 * Every audit-facing screen starts here: no session, no data — and an
 * external-auditor session that has expired or been revoked is no session.
 */
export async function requireUser(): Promise<PayloadUser> {
  const { user, session, live } = await sessionState()
  if (!user) redirect('/login')
  if (!live) redirect(`/login?expired=${session?.sessionId ?? '1'}`)
  return user
}
