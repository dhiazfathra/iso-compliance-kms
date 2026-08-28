import type { CollectionConfig } from 'payload'
import { adminOnly, canWrite, signedIn } from '../lib/access'

/**
 * A time-boxed, read-only visit by an external auditor. The row is the session:
 * it names the auditor's user, when it expires, and what was looked at. See
 * ADR-0009.
 */
export const AuditSessions: CollectionConfig = {
  slug: 'audit-sessions',
  labels: { singular: 'Audit session', plural: 'Audit sessions' },
  admin: {
    useAsTitle: 'sessionId',
    defaultColumns: ['sessionId', 'label', 'auditor', 'expiresAt', 'revoked'],
    group: 'Operate',
  },
  // Maintainers issue and revoke sessions; the counters are written by the app
  // itself, because the auditor holding the session may not write anything.
  access: { read: signedIn, create: canWrite, update: canWrite, delete: adminOnly },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'e.g. SESSION-0094' },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'Shown in the banner, e.g. "External · K. Halim"' },
    },
    {
      name: 'auditor',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      admin: { description: 'The read-only user this session belongs to' },
    },
    { name: 'startedAt', type: 'date', required: true },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'After this instant the auditor is signed out',
      },
    },
    { name: 'revoked', type: 'checkbox', defaultValue: false },
    {
      name: 'clausesViewed',
      type: 'array',
      labels: { singular: 'Clause viewed', plural: 'Clauses viewed' },
      admin: { readOnly: true, description: 'Distinct requirements opened during the session' },
      fields: [
        { name: 'clauseId', type: 'text', required: true },
        { name: 'at', type: 'date', required: true },
      ],
    },
    {
      name: 'downloads',
      type: 'number',
      defaultValue: 0,
      admin: { readOnly: true, description: 'Evidence files downloaded during the session' },
    },
  ],
}
