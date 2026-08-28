import type { CollectionConfig } from 'payload'
import { adminOnly, signedIn } from '../lib/access'

export const Activity: CollectionConfig = {
  slug: 'activity',
  // Append-only: the trail is evidence, so nobody edits it and only an admin
  // may prune it.
  access: { read: signedIn, create: signedIn, update: () => false, delete: adminOnly },
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['at', 'actor', 'action', 'ref'],
    group: 'Records',
  },
  fields: [
    {
      name: 'at',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'actor', type: 'text', required: true },
    { name: 'action', type: 'text', required: true },
    { name: 'ref', type: 'text', admin: { description: 'Clause id, pack id or session id' } },
  ],
}
