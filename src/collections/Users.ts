import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'email'] },
  auth: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: { description: 'e.g. Compliance Manager' },
    },
    {
      name: 'access',
      type: 'select',
      defaultValue: 'write',
      options: [
        { label: 'Read only', value: 'read' },
        { label: 'Write', value: 'write' },
        { label: 'Admin', value: 'admin' },
      ],
    },
  ],
}
