# 19. Security round two: one rule, enforced at every door

Date: 2026-09-04

## Status

Accepted. Extends [ADR-0015](0015-security-hardening-fail-closed.md), and
applies it to [ADR-0018](0018-local-mode-runs-on-a-pack-in-the-browser.md).

## Context

A second review of the tree, three weeks after the first
(`docs/security-review-2026-08-29.md`). The six findings from that review were
still fixed and no regression had crept back in; what this pass found was a
different shape of problem.

Local mode landed after the first review. It gives the register a second front
door: the pack is parsed and rendered in the browser, with no server between
the bytes and the screen. Every rule ADR-0015 wrote down was implemented in a
route handler — which local mode does not have. The inline-render allowlist,
the one that exists because a stored SVG rendered on our own origin is a stored
XSS, was enforced on the hosted path only. A `blob:` URL in an iframe runs on
the page's origin, so local mode needed the same rule and had none.

It was not exploitable as shipped: the local download screens map a record's
`fileType` through a closed table to a MIME type, and nothing scriptable is in
that table. But that is a rule held in a lookup table on one screen, not a
decision, and the next screen to render pack bytes would not inherit it.

The pass also found what the last one left open — the operator step for
`NEXT_PUBLIC_SERVER_URL` was never written into `.env.example` — plus a
transitive `dompurify` at 3.4.8 carrying four advisories, an auth envelope
inherited silently from framework defaults, and no HTTP security headers at
all, because neither Next nor Payload sets any on its own.

## Decision

**A security rule lives in a module, not in the door that happens to enforce
it.** `lib/inline-safe` now answers "may these bytes be rendered in place, and
as what" for the hosted evidence route and for local mode alike. It is a pure
module with its own tests, so the rule is verified once rather than inferred
from two implementations that are supposed to agree. The same module owns the
`Content-Disposition` filename sanitiser, which three responses were each
spelling out for themselves.

**A second front door inherits the first door's rules, or it is not shipped.**
Local mode has no server to check anything, which makes it more important that
the check exists in code the browser runs, not less. ADR-0018 traded the server
away; it did not trade the threat model away with it.

**The auth envelope is stated, because a certification body asks for the
number.** Five failed logins, ten-minute lock, eight-hour session cookie —
written on the collection rather than inherited from Payload's defaults. The
values are close to the defaults. The point is that an auditor can read them
here and an upgrade cannot change them quietly.

**Baseline security headers are the application's job.** `nosniff`, `DENY`
framing, `strict-origin-when-cross-origin`, HSTS and a closed
`Permissions-Policy` on every response, from `next.config.mjs`. The download
routes keep their own tighter `Content-Security-Policy`; these are the floor
under everything else. We do not assume the platform sets them.

**Transitive advisories are pinned, not waited out.** `dompurify` is pinned to
`^3.4.14` through `overrides`/`resolutions`. It reaches us four levels down,
under the admin panel's Monaco editor, and its own maintainers will not ship the
bump on our schedule.

**Lint, typecheck and tests gate every pull request.** There was no CI workflow
at all; a review that fixes six things and no gate that keeps them fixed is
half a fix.

## Not an incident

Assessed against one bar: was this ever live in production or on `main`, and
was it actually exploited or trivially exploitable there?

No, on both counts, for every finding:

- No secret, `.env` file or database file is tracked in git, and none ever was
  — `git log --diff-filter=A` over the whole history finds no such path. The
  local `.env`, `.env.local`, `iso-kms.db` and `ruvector.db` are all ignored.
- The local-mode inline gap was reachable in production but not exploitable:
  the closed `fileType` table upstream of it admits no scriptable type, and
  uploading a scriptable type is refused by the collection's enumerated MIME
  list (ADR-0015).
- The `dompurify` advisories require a hostile `setConfig()` call inside the
  authenticated admin panel. There is no path by which an attacker reaches it.
- Everything else — headers, the auth envelope, `.env.example`, CI — is
  hardening. It closes distance to an attack; it is not evidence of one.

No postmortem is written. This section is the determination, recorded so the
next reviewer does not have to make it again from scratch.

## Consequences

- One module to change when the render policy changes, and one test file that
  fails if it changes by accident.
- `text/plain` joins the inline-safe list, which the hosted route did not
  previously allow. Plain text is inert, it is served under `nosniff` and the
  sandboxing CSP, and local mode was already labelling Markdown evidence with
  it.
- Sessions now expire after eight hours. An auditor working a long day signs in
  again; the external-auditor session expiry of [ADR-0009](0009-external-auditor-sessions.md)
  is unaffected and remains the shorter of the two in practice.
- `NEXT_PUBLIC_SERVER_URL` must be set in the Vercel project. Without it, pack
  builds throw in production — deliberately, per ADR-0015.
- A pinned transitive dependency is a thing to re-check on every Payload
  upgrade. When the upstream chain ships 3.4.14 or later on its own, the
  override should be dropped rather than left to drift.
