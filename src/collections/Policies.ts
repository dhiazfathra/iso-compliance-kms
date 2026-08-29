import type { CollectionConfig } from 'payload'
import { complianceAccess } from '../lib/access'

export const Policies: CollectionConfig = {
  slug: 'policies',
  access: complianceAccess,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'version', 'status', 'owner'],
    group: 'Compliance',
  },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'version', type: 'text', required: true, defaultValue: 'v1.0' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'Draft',
      options: ['Approved', 'In review', 'Draft'].map((v) => ({ label: v, value: v })),
    },
    { name: 'owner', type: 'relationship', relationTo: 'users' },
    {
      name: 'body',
      type: 'textarea',
      admin: {
        description:
          'The document text, in Markdown. Rendered on the policy page and exported as the PDF.',
      },
    },
    { name: 'primaryClause', type: 'relationship', relationTo: 'clauses', required: true },
    {
      name: 'clauses',
      type: 'relationship',
      relationTo: 'clauses',
      hasMany: true,
      admin: {
        description: 'Every requirement this policy satisfies, including cross-mapped ones',
      },
    },
    {
      name: 'revisions',
      type: 'array',
      labels: { singular: 'Revision', plural: 'Revision history' },
      fields: [
        { name: 'version', type: 'text', required: true },
        { name: 'date', type: 'date', required: true },
        { name: 'author', type: 'relationship', relationTo: 'users' },
        { name: 'approval', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'note', type: 'textarea' },
      ],
    },
  ],
}
