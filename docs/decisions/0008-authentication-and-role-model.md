# ADR-0008: Payload sessions gate the app; three roles; no `overrideAccess` with a real user

## Status

Accepted

## Date

2026-08-28

## Context

Every audit-facing screen read through `loadGraph()`, which passed
`overrideAccess: true`. Payload's default `access` on a collection without an
explicit rule is "anyone", so both the custom screens and the REST/GraphQL API
served the entire compliance repository to anonymous requests. A compliance
repository is the wrong thing to publish: it names owners, open gaps, and the
evidence filed against each control.

The `users` collection already carried an `access` select (`read` / `write` /
`admin`) that nothing enforced.

## Decision

1. **One session mechanism.** Payload's own `users` auth collection and its
   `payload-token` cookie. `currentUser()` (`src/lib/auth.ts`) resolves it from
   the request headers via `payload.auth()`, cached per request;
   `requireUser()` redirects to `/login` when there is none. `loadGraph()` calls
   `requireUser()`, so gating cannot be forgotten on a new screen — a screen
   that reads data is a screen that is gated.
2. **`/login` lives in its own route group** (`src/app/(auth)`), outside the
   `(app)` shell, so an anonymous request reaches a login form and never a
   layout that loads data.
3. **Explicit `access` on every collection** (`src/lib/access.ts`), never the
   framework default:

   | Collection                                         | read      | create    | update          | delete  |
   | -------------------------------------------------- | --------- | --------- | --------------- | ------- |
   | `clauses`, `policies`, `forms`, `evidence`, `gaps` | signed in | `write`   | `write`         | `admin` |
   | `activity`                                         | signed in | signed in | **never**       | `admin` |
   | `users`                                            | signed in | `admin`   | self or `admin` | `admin` |

   Roles are ranked `read < write < admin`, so `write` implies read and `admin`
   implies both. `activity` is append-only: the trail is evidence, so no role
   may edit a row.

4. **`overrideAccess: false` plus the real `user`** on every read and write made
   on behalf of a request — `loadGraph()` and the evidence upload action. The
   only remaining privileged path is the seed, which runs as a script with no
   request behind it.
5. **The admin panel is for maintainers.** `users.access.admin` requires
   `write`, so a read-only auditor signing in at `/admin` is refused.

## Alternatives Considered

### Next.js middleware checking for the cookie

- Pros: one file, blocks before rendering.
- Cons: cookie presence is not a session, so it duplicates the check and can
  disagree with it; and it leaves the REST/GraphQL API — the bigger exposure —
  wide open, because that is Payload's own route, not ours.
- Rejected: the fix has to be in the collections' `access`, and once it is
  there, the middleware is redundant.

### A separate `roles` hasMany field, or Payload's `admin` boolean convention

- Pros: matches many Payload examples.
- Cons: `users.access` already exists, is already seeded, and is already shown
  in the admin. Two role fields would be one too many.
- Rejected in favour of the field that exists.

## Consequences

- Any screen added under `src/app/(app)` is gated automatically the moment it
  reads the graph; a screen that reads nothing must call `requireUser()` itself.
- A read-only user (an external auditor, ADR-0009) can reach every screen and
  mutate nothing: the upload action refuses before it touches Payload, and
  Payload refuses again if it did not.
- The seed still runs with full privileges. That is deliberate and is the reason
  `bun run seed` is documented as destructive.
- `users.read` is open to any signed-in user because owner names and roles are
  rendered on nearly every screen. Email addresses come with that; for a
  repository whose users are all internal staff plus a named auditor, that is
  acceptable. If external auditors ever outnumber staff, narrow this to a
  projection.
