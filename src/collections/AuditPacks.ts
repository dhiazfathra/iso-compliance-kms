import type { CollectionConfig } from 'payload'
import { adminOnly, canWrite, signedIn } from '../lib/access'

/**
 * One export for a certification body: a ZIP of the index, the register and
 * every evidence file, built in the background and kept for a fixed window.
 * The row is the job and the receipt (ADR-0012).
 */
export const AuditPacks: CollectionConfig = {
  slug: 'audit-packs',
  labels: { singular: 'Audit pack', plural: 'Audit packs' },
  admin: {
    useAsTitle: 'packId',
    defaultColumns: ['packId', 'status', 'requestedBy', 'requestedAt', 'expiresAt'],
    group: 'Operate',
  },
  // Anyone signed in may see that a pack exists and download it; only a
  // maintainer may ask for one. The build itself writes as the system.
  access: { read: signedIn, create: canWrite, update: canWrite, delete: adminOnly },
  fields: [
    { name: 'packId', type: 'text', required: true, unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'building',
      options: [
        { label: 'Building', value: 'building' },
        { label: 'Ready', value: 'ready' },
        { label: 'Failed', value: 'failed' },
        { label: 'Expired', value: 'expired' },
      ],
    },
    { name: 'scope', type: 'text', required: true, defaultValue: 'All standards' },
    { name: 'requestedBy', type: 'relationship', relationTo: 'users', required: true },
    { name: 'requestedAt', type: 'date', required: true },
    { name: 'completedAt', type: 'date' },
    {
      name: 'expiresAt',
      type: 'date',
      admin: { description: 'After this the ZIP is deleted from storage by the daily sweep' },
    },
    { name: 'url', type: 'text', admin: { readOnly: true } },
    { name: 'pathname', type: 'text', admin: { readOnly: true, description: 'Blob object key' } },
    { name: 'size', type: 'number', admin: { readOnly: true } },
    { name: 'itemCount', type: 'number', admin: { readOnly: true } },
    { name: 'error', type: 'textarea', admin: { readOnly: true } },
  ],
}
