import type { CollectionConfig } from 'payload'

export const Forms: CollectionConfig = {
  slug: 'forms',
  admin: { useAsTitle: 'name', defaultColumns: ['code', 'name', 'policy'], group: 'Compliance' },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'e.g. FRM-AC-03' },
    },
    { name: 'name', type: 'text', required: true },
    { name: 'policy', type: 'relationship', relationTo: 'policies', required: true },
    { name: 'primaryClause', type: 'relationship', relationTo: 'clauses', required: true },
    {
      name: 'alsoSatisfies',
      type: 'relationship',
      relationTo: 'clauses',
      hasMany: true,
      admin: { description: 'Cross-mapped requirements this form also satisfies' },
    },
    {
      name: 'externalRefs',
      type: 'array',
      labels: { singular: 'Reference', plural: 'References outside tracked scope' },
      fields: [{ name: 'ref', type: 'text', required: true }],
    },
  ],
}
