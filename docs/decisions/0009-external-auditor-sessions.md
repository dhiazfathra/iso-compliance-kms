# ADR-0009: The external auditor is a read-only user plus a time-boxed session row

## Status

Accepted

## Date

2026-08-28

## Context

The `/audit-session` banner promised "read-only mirror · every view is written
to the audit trail", and the mockup's trail shows `SESSION-0094`,
"External · K. Halim", 14 clauses viewed, 3 downloads. Neither was true: nothing
was scoped, nothing expired, and nothing was written. A promise about an audit
trail that the system does not keep is worse than no promise.

ADR-0008 gives us roles but not time: Payload's `tokenExpiration` is a property
of the collection, so it cannot express "this auditor has eight hours".

## Decision

An external-auditor visit is two rows:

1. A **user** with `access: 'read'` — ADR-0008's rules already stop every write.
2. An **`audit-sessions` row** naming that user, with `sessionId`, `label`,
   `startedAt`, `expiresAt`, `revoked`, the distinct `clausesViewed`, and a
   `downloads` count.

The session is enforced in two places, deliberately:

- **In the app** — `sessionState()` resolves user and session together, and
  `requireUser()` sends an expired or revoked auditor to
  `/login?expired=<sessionId>`. `/login` uses the same check, so an expired
  auditor holding a still-valid Payload cookie lands on the login form instead
  of bouncing between the two.
- **In `access`** — `signedIn` awaits `auditSessionOpen(req)`, which looks up
  the session for a `read` user and refuses once it is past `expiresAt` or
  revoked. Without this the REST and GraphQL APIs would keep serving the
  repository after the visit ended, because the cookie outlives the session.
  Staff never trigger the lookup: it is skipped unless `access === 'read'`.

Recording is the point of the feature, so it happens on the read path:
`/audit-session?clause=…` records the first view of each requirement, and
`/evidence/[id]/download` — now the only download link on either screen —
increments `downloads`. Both also append an `activity` row, which is what the
banner and the dashboard trail read.

Those two writes run with `overrideAccess: true` and no `user`, because the
auditor must not be able to write their own trail. They are the only privileged
path outside the seed, they are confined to `src/lib/audit-session.ts`, and the
data they write is fixed by the code, not by the request.

## Alternatives Considered

### A magic-link token in the URL, no user row

- Pros: nothing to provision; the link is the session.
- Cons: a second authentication mechanism beside Payload's, with its own cookie,
  its own expiry and its own way of being wrong. It would also sit outside
  collection `access`, which is exactly the mistake ADR-0008 undid.
- Rejected.

### `tokenExpiration` on the users collection

- Pros: free expiry.
- Cons: collection-wide, so shortening it for auditors logs staff out too, and
  it carries no session identity to attribute views to.
- Rejected.

## Consequences

- Sessions are issued in the admin panel (Operate → Audit sessions) or by the
  seed, which creates `SESSION-0094` for `k.halim@external.audit`, live for
  `SEED_AUDITOR_SESSION_HOURS` (default 8). There is no self-service issue flow.
- Counting is per distinct requirement, so re-reading a clause does not inflate
  the number the auditor is shown; every download counts, because that is what
  the certification body asks about.
- Expiry is checked per request. An in-flight render started before expiry
  finishes; the next request does not.
- A `read` user with no session row is an ordinary read-only staff account and
  never expires. That is intentional — the session is the external visit, not
  the role.
- Blob URLs remain public-by-default (ADR-0003), so the download counter records
  what was fetched through the app, not what a leaked URL served afterwards.
  Signed URLs are the fix and are still outstanding.
