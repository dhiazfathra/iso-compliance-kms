'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { requireUser } from '@/lib/auth'
import { hasLevel } from '@/lib/access'

/** How much Markdown one controlled document may hold. */
const MAX_BODY = 200_000

/**
 * Saving a document body. The text is stored as written — it is escaped when it
 * is rendered, never on the way in, so what the author reads back is what they
 * typed — and the edit lands in the activity trail like any other change.
 */
export async function savePolicyBody(formData: FormData) {
  const id = Number(formData.get('id'))
  const body = String(formData.get('body') ?? '')

  if (!id) return { ok: false, error: 'Unknown document.' }
  if (body.length > MAX_BODY) return { ok: false, error: 'Document is too long to store.' }

  const user = await requireUser()
  if (!hasLevel(user, 'write')) return { ok: false, error: 'Your session is read-only.' }

  const payload = await getPayload({ config })
  const policy = await payload.update({
    collection: 'policies',
    id,
    overrideAccess: false,
    user,
    data: { body },
  })

  await payload.create({
    collection: 'activity',
    overrideAccess: false,
    user,
    data: {
      at: new Date().toISOString(),
      actor: user.name,
      action: `edited the text of ${policy.name}`,
      ref: String(id),
    },
  })

  revalidatePath(`/policies/${id}`)
  return { ok: true }
}
