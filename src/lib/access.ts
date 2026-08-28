import type { Access } from 'payload'

/**
 * Three roles, stored on `users.access`:
 *
 * - `read`  — sees the whole repository, changes nothing. External auditors.
 * - `write` — maintains compliance data (clauses, policies, forms, evidence, gaps).
 * - `admin` — the above plus user management and destructive deletes.
 *
 * Anonymous requests get nothing. See ADR-0008.
 */
export type AccessLevel = 'read' | 'write' | 'admin'

const RANK: Record<AccessLevel, number> = { read: 1, write: 2, admin: 3 }

export type MaybeUser = { access?: AccessLevel | string | null } | null | undefined

/** True when `user` is signed in and at least `min`. */
export const hasLevel = (user: MaybeUser, min: AccessLevel): boolean => {
  const rank = RANK[(user?.access ?? '') as AccessLevel]
  return !!rank && rank >= RANK[min]
}

export const signedIn: Access = ({ req }) => hasLevel(req.user, 'read')
export const canWrite: Access = ({ req }) => hasLevel(req.user, 'write')
export const adminOnly: Access = ({ req }) => hasLevel(req.user, 'admin')

/** Read for anyone signed in; every mutation needs `write`, deletes need `admin`. */
export const complianceAccess = {
  read: signedIn,
  create: canWrite,
  update: canWrite,
  delete: adminOnly,
}

/** Users are readable by any signed-in user (owner names are on every screen) but
 * only an admin may create or delete one; a user may update their own record. */
export const userAccess = {
  read: signedIn,
  create: adminOnly,
  delete: adminOnly,
  update: (({ req, id }) =>
    hasLevel(req.user, 'admin') || (!!req.user && String(req.user.id) === String(id))) as Access,
  /** Admin-panel access: maintainers only, so a read-only auditor never lands in /admin. */
  admin: ({ req }: { req: { user?: MaybeUser } }) => hasLevel(req.user, 'write'),
}
