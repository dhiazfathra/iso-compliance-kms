import type { CollectionConfig } from 'payload'

export const Evidence: CollectionConfig = {
  slug: 'evidence',
  upload: {
    // Vercel Blob handles storage; disable local disk writes so the build works on Vercel.
    disableLocalStorage: true,
    mimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/*',
    ],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'form', 'uploader', 'expiryDate'],
    group: 'Records',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Filename as recorded in the register' },
    },
    {
      name: 'fileType',
      type: 'select',
      required: true,
      options: ['PDF', 'XLSX', 'PPTX', 'DOCX', 'PNG', 'JPG'].map((v) => ({ label: v, value: v })),
    },
    { name: 'form', type: 'relationship', relationTo: 'forms', required: true },
    {
      name: 'satisfies',
      type: 'relationship',
      relationTo: 'clauses',
      hasMany: true,
      required: true,
      admin: { description: 'Requirements this evidence explicitly satisfies (primary first)' },
    },
    { name: 'uploader', type: 'relationship', relationTo: 'users', required: true },
    { name: 'uploadedAt', type: 'date', required: true },
    { name: 'expiryDate', type: 'date' },
    { name: 'reviewDate', type: 'date' },
    { name: 'retention', type: 'text', defaultValue: '3 years' },
    { name: 'sha', type: 'text', admin: { description: 'Content digest recorded at upload' } },
    {
      name: 'revisions',
      type: 'array',
      labels: { singular: 'Version', plural: 'Version history' },
      fields: [
        { name: 'version', type: 'text', required: true },
        { name: 'date', type: 'date', required: true },
        { name: 'author', type: 'relationship', relationTo: 'users' },
        { name: 'note', type: 'textarea' },
      ],
    },
  ],
}
