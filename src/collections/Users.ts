import type { CollectionConfig } from 'payload'
import { adminOnlyField, userAccess } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  access: userAccess,
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
      // Collection-level `update` lets a user edit their own record so they can
      // change their name or password. Without this, that also means editing
      // the field the whole role model reads — a one-request path from
      // read-only auditor to admin. Only an admin may write it (ADR-0008).
      access: { create: adminOnlyField, update: adminOnlyField },
      options: [
        { label: 'Read only', value: 'read' },
        { label: 'Write', value: 'write' },
        { label: 'Admin', value: 'admin' },
      ],
    },
  ],
}
