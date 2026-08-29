import type { Access, FieldAccess } from 'payload'

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

/**
 * Whether a read-only user's external-auditor session is still open. Staff have
 * no session row and are unaffected. This runs inside `access`, not only in the
 * app, so an expired auditor is refused by the REST and GraphQL APIs too — the
 * Payload cookie outlives the session and must not outlive the permission.
 */
export const auditSessionOpen = async (req: {
  user?: MaybeUser & { id?: number | string }
  payload?: {
    find: (
      args: Record<string, unknown>,
    ) => Promise<{ docs: { revoked?: boolean | null; expiresAt: string }[] }>
  }
}): Promise<boolean> => {
  if (req.user?.access !== 'read' || !req.payload) return true
  const found = await req.payload.find({
    collection: 'audit-sessions',
    where: { auditor: { equals: req.user.id } },
    sort: '-startedAt',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const session = found.docs[0]
  return !session || (!session.revoked && new Date(session.expiresAt).getTime() > Date.now())
}

export const signedIn: Access = async ({ req }) =>
  hasLevel(req.user, 'read') && (await auditSessionOpen(req as never))
export const canWrite: Access = ({ req }) => hasLevel(req.user, 'write')
export const adminOnly: Access = ({ req }) => hasLevel(req.user, 'admin')

/** `adminOnly` at field level, for fields a user must not set on their own record. */
export const adminOnlyField: FieldAccess = ({ req }) => hasLevel(req.user, 'admin')

/**
 * Where a `?next=` may send someone after signing in: a path on this site and
 * nothing else. A link that starts on our domain and lands on someone else's is
 * exactly the shape a phishing page wants, so anything but a plain relative
 * path falls back to the dashboard.
 */
export function safeNext(next: string | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return '/'
  return next
}

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
