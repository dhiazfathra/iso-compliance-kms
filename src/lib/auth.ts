import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import type { User as PayloadUser } from '@/payload-types'

/**
 * The signed-in user for this request, resolved from the Payload session
 * cookie. Cached per request so the layout and the page share one lookup.
 */
export const currentUser = cache(async (): Promise<PayloadUser | null> => {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await nextHeaders() })
  return (user as PayloadUser | null) ?? null
})

/** Every audit-facing screen starts here: no session, no data. */
export async function requireUser(): Promise<PayloadUser> {
  const user = await currentUser()
  if (!user) redirect('/login')
  return user
}
