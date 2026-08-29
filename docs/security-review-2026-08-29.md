# Security review — 2026-08-29

Scope: the whole application source (`src/`) — authentication, the role and
access model, the two byte-serving routes, the audit-pack build and sweep, the
server actions, and the deployment configuration. Payload CMS 3.88 on Next.js
16, SQLite/Turso, Vercel Blob.

## Summary

|                |                                  |
| -------------- | -------------------------------- |
| **Findings**   | 6 (2 Critical, 1 High, 3 Medium) |
| **Risk level** | Critical                         |
| **Confidence** | High on all six                  |

The two critical findings are both authentication-integrity issues: a signing
key that silently falls back to a value published in this repository, and a
self-service route to `admin` for any signed-in user. Either one alone
collapses the three-role model that ADR-0008 rests on, and by extension the
external-auditor containment described in ADR-0009.

What held up well: every collection routes through one `access` module rather
than hand-rolled checks; evidence bytes really do have exactly one door
(ADR-0010) and it re-checks the session; the audit-session expiry is enforced
inside `access` so the REST and GraphQL APIs get it too, not only the screens;
search is an in-memory filter over an already-authorised graph, so there is no
query-injection surface; no `dangerouslySetInnerHTML`, no `eval`, no shell
execution anywhere in the tree; and no secret or database file is tracked in
git.

---

## Findings

### [VULN-001] Hardcoded fallback signing secret (Critical)

- **Location**: `src/payload.config.ts:38`
- **Confidence**: High

**Issue.** The Payload secret falls back to a literal when the environment
variable is absent:

```ts
secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
```

That literal is committed to this repository. Payload derives the JWT signing
key for session cookies from this value, so a deployment that is missing
`PAYLOAD_SECRET` — a mis-copied Vercel environment, a preview deployment, a
self-hosted instance — signs its sessions with a key any reader of the source
already has.

**Impact.** An attacker forges a session cookie for any user, including one
with `access: 'admin'`, without credentials. Complete authentication bypass and
full read/write access to every ISMS record.

**Fix.** Remove the fallback and fail closed at boot. An application that
cannot sign sessions safely must not start.

---

### [VULN-002] Privilege escalation: users may raise their own access level (Critical)

- **Location**: `src/lib/access.ts:70-71` (`userAccess.update`), `src/collections/Users.ts:17-26`
- **Confidence**: High

**Issue.** A user may update their own record, by design, so they can change
their name or password:

```ts
update: (({ req, id }) =>
  hasLevel(req.user, 'admin') || (!!req.user && String(req.user.id) === String(id))) as Access,
```

Collection-level `update` in Payload authorises the whole document. The `access`
field — the field the entire role model reads — carries no field-level access
control of its own, so "may edit my own record" silently means "may set my own
role".

**Impact.** Any authenticated user, including a read-only external auditor
mid-session, promotes themselves to `admin` with one request:

```
PATCH /api/users/<their own id>
Content-Type: application/json

{"access": "admin"}
```

From `admin` they can write every compliance record, delete evidence and the
append-only activity trail, and issue themselves audit sessions. This defeats
ADR-0008 and ADR-0009 entirely: the auditor containment model assumes an
auditor cannot change what they are.

**Fix.** Put field-level access on `access` so only an admin may write it, and
keep the self-update route for the harmless fields.

---

### [VULN-003] Stored XSS via inline SVG evidence (High)

- **Location**: `src/collections/Evidence.ts:15` (`'image/*'`), `src/app/(app)/evidence/[id]/download/route.ts:52-58`
- **Confidence**: High

**Issue.** The upload allowlist admits `image/*`, which matches
`image/svg+xml`. The download route then echoes the stored type back and, for
`?inline=1`, tells the browser to render rather than save it:

```ts
'Content-Type': item.mimeType ?? 'application/octet-stream',
'Content-Disposition': `${inline ? 'inline' : 'attachment'}; ...`,
```

An SVG is an XML document that executes script. `EvidencePreview` loads exactly
this URL in an iframe, on the application's own origin.

**Impact.** A `write` user uploads a crafted SVG as evidence; every colleague
who opens that evidence record — including an admin — executes the attacker's
script on the application origin. The session cookie is `httpOnly`, but the
script does not need to read it: it can call `/api/users/<victim id>` and the
rest of the Payload REST API as the victim, which given VULN-002 is a direct
path to admin. There is also no `X-Content-Type-Options: nosniff`, so a
mislabelled upload can be sniffed into an active type.

**Fix.** Enumerate the image types actually supported rather than globbing,
serve these bytes under a sandboxing CSP, and send `nosniff`. The `fileType`
field already enumerates PNG and JPG only, so nothing legitimate is lost.

---

### [VULN-004] Zip path traversal in the audit pack (Medium)

- **Location**: `src/lib/audit-pack.ts:177-180`
- **Confidence**: High

**Issue.** Evidence file entries are named from the record's `title`, a free
text field:

```ts
entries.push({ path: `evidence/${item.title}`, content: ... })
```

`title` is never constrained to a filename. A `write` user who sets a title of
`../../../../.bashrc` produces a ZIP entry that escapes the extraction
directory. Duplicate titles also silently produce colliding entries, so one
evidence file can shadow another in the delivered pack.

**Impact.** This is the artefact handed to a certification body. Naive
extraction on the auditor's machine — `unzip` without `-n`, or any library that
does not reject `..` — writes attacker-chosen bytes to an attacker-chosen path
outside the target directory. The collision case is quieter but worse for the
audit itself: evidence that appears delivered but is not the file it claims.

**Fix.** Sanitise entry names to a single path segment and de-duplicate them,
in `packEntries`/`buildPack` where all pack entries converge.

---

### [VULN-005] Request Host header drives an authenticated internal fetch (Medium)

- **Location**: `src/app/(app)/audit-pack/actions.ts:52-58`, consumed at `src/lib/audit-pack.ts:173-175`
- **Confidence**: High

**Issue.** The origin the background build calls back into is assembled from
request headers, and the caller's session cookie is sent along with it:

```ts
const origin = `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('host')}`
const cookie = h.get('cookie') ?? ''
...
await fetch(new URL(`/evidence/${item.id}/download?inline=1`, origin), { headers: { cookie } })
```

Both `Host` and `X-Forwarded-Proto` are attacker-supplied. A request carrying
`Host: attacker.example` makes the build send the requesting user's session
cookie to the attacker's server; `X-Forwarded-Proto: http` downgrades the
callback off TLS.

**Impact.** Session cookie exfiltration and SSRF, giving the attacker the
requesting user's session. Vercel's edge rejects unrecognised Host values
before the function runs, which narrows exploitability on the current
production platform — but the code carries no such assumption, and the
protection disappears behind any other proxy or a self-hosted deployment. The
platform should not be the only thing standing between a request header and an
authenticated outbound call.

**Fix.** Take the origin from server-controlled configuration
(`NEXT_PUBLIC_SERVER_URL`, with the request headers only as a local-dev
fallback), and never accept a scheme from the request.

---

### [VULN-006] Open redirect on the login page (Medium)

- **Location**: `src/app/(auth)/login/page.tsx:16`, `src/components/LoginForm.tsx:23`
- **Confidence**: High

**Issue.** The post-login destination is taken from the query string and used
unvalidated:

```ts
if (user && live) redirect(next || '/')
```

**Impact.** `/login?next=https://attacker.example/` bounces an already-signed-in
user straight off the origin. The usual consequence is credential phishing: the
link genuinely starts at the real ISMS domain, which is exactly the signal
users are taught to check. It also lends authenticity to a fake "your audit
session expired, sign in again" page.

**Fix.** Accept only same-site paths — one leading `/`, no `//` and no scheme —
and fall back to `/` for anything else. The check belongs in one place, since
both the server page and the client form consume `next`.

---

## Checked and not flagged

- **Search inputs** (`q`, `std`, `status`, `owner`, `scope`) filter an
  in-memory graph that `loadGraph` already fetched with `overrideAccess: false`
  and the caller's user. No injection surface, no authorisation bypass.
- **`fetch(pack.url)`** in the pack download route: `url` is written by the
  Vercel Blob plugin, not by a user. Not SSRF.
- **The cron sweep route** refuses when `CRON_SECRET` is unset and compares a
  bearer token; it fails closed. (The comparison is not constant-time, but the
  secret is high-entropy and the route is not an oracle — noted, not flagged.)
- **Page-level authorisation**: `(app)/layout.tsx` calls `requireUser()`, and
  `loadGraph()` calls it again, so a page that forgets the check — such as
  `audit-session/page.tsx` — is still gated twice over.
- **Activity trail** is genuinely append-only: `update: () => false`.
- **Repository hygiene**: `.env`, `.env.local` and `*.db` are all ignored; only
  `.env.example` is tracked, and it holds placeholders.
