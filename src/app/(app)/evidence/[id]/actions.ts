'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

/**
 * Uploading a new version replaces the stored file and appends to the record's
 * own version history, so the audit trail stays in one place for evidence and
 * policies alike.
 */
export async function uploadNewVersion(formData: FormData) {
  const id = Number(formData.get('id'))
  const note = String(formData.get('note') ?? '').trim()
  const file = formData.get('file')

  if (!id || !(file instanceof File) || !file.size) {
    return { ok: false, error: 'Choose a file to upload.' }
  }

  const payload = await getPayload({ config })
  const current = await payload.findByID({ collection: 'evidence', id, depth: 0 })
  const revisions = Array.isArray(current.revisions) ? current.revisions : []
  const nextNumber = revisions.length + 1

  const data = Buffer.from(await file.arrayBuffer())

  await payload.update({
    collection: 'evidence',
    id,
    data: {
      uploadedAt: new Date().toISOString(),
      revisions: [
        {
          version: `v${nextNumber}`,
          date: new Date().toISOString(),
          author: typeof current.uploader === 'object' ? current.uploader.id : current.uploader,
          note: note || 'New version uploaded.',
        },
        ...revisions,
      ],
    },
    file: { data, mimetype: file.type, name: file.name, size: data.length },
  })

  await payload.create({
    collection: 'activity',
    data: {
      at: new Date().toISOString(),
      actor: 'Ratna Wijaya',
      action: `uploaded a new version of ${current.title}`,
      ref: String(id),
    },
  })

  revalidatePath(`/evidence/${id}`)
  return { ok: true }
}
