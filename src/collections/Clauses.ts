import type { CollectionConfig } from 'payload'
import { complianceAccess } from '../lib/access'

export const STATUSES = [
  { label: 'Compliant', value: 'compliant' },
  { label: 'In progress', value: 'progress' },
  { label: 'Needs review', value: 'review' },
  { label: 'Gap', value: 'gap' },
] as const

export const STANDARDS = [
  { label: 'ISO/IEC 27001:2022', value: '27001' },
  { label: 'ISO 9001:2015', value: '9001' },
] as const

export const Clauses: CollectionConfig = {
  slug: 'clauses',
  access: complianceAccess,
  admin: {
    useAsTitle: 'clauseId',
    defaultColumns: ['clauseId', 'standard', 'title', 'status', 'owner', 'nextReview'],
    group: 'Compliance',
  },
  fields: [
    {
      name: 'clauseId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'e.g. A.5.15 or 9.2' },
    },
    { name: 'standard', type: 'select', required: true, options: [...STANDARDS] },
    { name: 'title', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'progress',
      options: [...STATUSES],
    },
    { name: 'owner', type: 'relationship', relationTo: 'users', required: true },
    { name: 'nextReview', type: 'date' },
    {
      name: 'criticality',
      type: 'number',
      defaultValue: 1,
      admin: { description: 'Weight used by the readiness score' },
    },
  ],
}
