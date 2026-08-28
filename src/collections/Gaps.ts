import type { CollectionConfig } from 'payload'

export const Gaps: CollectionConfig = {
  slug: 'gaps',
  admin: {
    useAsTitle: 'finding',
    defaultColumns: ['clause', 'owner', 'due', 'progress'],
    group: 'Operate',
  },
  fields: [
    { name: 'clause', type: 'relationship', relationTo: 'clauses', required: true },
    { name: 'finding', type: 'textarea', required: true },
    { name: 'task', type: 'text', required: true },
    { name: 'owner', type: 'relationship', relationTo: 'users', required: true },
    { name: 'due', type: 'date', required: true },
    {
      name: 'blocking',
      type: 'checkbox',
      label: 'Blocking certification stage',
      defaultValue: false,
    },
    { name: 'progress', type: 'number', min: 0, max: 100, defaultValue: 0 },
  ],
}
