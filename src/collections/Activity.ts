import type { CollectionConfig } from 'payload'

export const Activity: CollectionConfig = {
  slug: 'activity',
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
