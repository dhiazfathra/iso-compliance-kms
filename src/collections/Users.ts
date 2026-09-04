import type { CollectionConfig } from 'payload'
import { adminOnlyField, userAccess } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  access: userAccess,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'email'] },
  /**
   * Stated rather than left to the framework's defaults, because these are the
   * numbers the certification body asks for: an account locks after five bad
   * passwords for ten minutes (online guessing is not viable), and a session
   * cookie lives eight hours — one working day — so a stolen cookie expires
   * with the shift rather than lingering for a month.
   */
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 8 * 60 * 60,
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
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
