# 15. Security hardening: fail closed, and never trust the request

Date: 2026-08-29

## Status

Accepted. Refines [ADR-0008](0008-authentication-and-role-model.md),
[ADR-0010](0010-evidence-bytes-served-through-the-app.md) and
[ADR-0012](0012-audit-pack-export.md).

## Context

A security review of the whole source tree (`docs/security-review-2026-08-29.md`)
found six exploitable issues. Two were critical and both attacked the same
thing: the identity the three-role model is built on. The rest shared a single
root cause — a value that arrives from outside was trusted as if it came from
us.

The pattern worth recording is not the individual bugs. It is that in three
separate places the code preferred to keep working over refusing: a missing
signing secret fell back to a literal, a missing origin fell back to the
request's `Host` header, and an unconstrained upload type fell back to
whatever the browser claimed. Each fallback was convenient in development and
each one was a vulnerability in production.

## Decision

**Missing security configuration is a startup failure, not a default.**
`PAYLOAD_SECRET` has no fallback; the application throws rather than sign
session cookies with a value committed to this repository. A deployment that is
misconfigured must be visibly broken, not quietly forgeable.

**An authenticated outbound call takes its address from configuration.** The
audit-pack build reads evidence bytes back through the app carrying the
requester's cookie (ADR-0010, ADR-0012). That origin now comes from
`NEXT_PUBLIC_SERVER_URL`, then the platform's own injected hostname, and only
outside production from the request host. We do not rely on the edge to
validate `Host` for us; the code states its own requirement.

**Collection-level access is not field-level access.** A user may update their
own record — that is how they change their name or password — but `users.access`
carries its own admin-only field access. Otherwise "edit yourself" silently
means "promote yourself", and the auditor containment of ADR-0009 depends on an
auditor being unable to change what they are.

**Bytes we serve back are treated as hostile.** Uploads are enumerated by exact
MIME type rather than globbed, only PDF, PNG and JPEG may render inline, and
every response carries `nosniff` and a sandboxing CSP. ADR-0010 made this the
single door for evidence; a single door is also the single place to make these
guarantees.

**A name from the database is not a filename.** Evidence titles are free text,
so audit-pack ZIP entries are derived through one shared map that strips path
separators and de-duplicates collisions. The index links and the stored entries
read from the same map, so they cannot disagree.

**A redirect target from a query string is validated to a same-site path.**

## Consequences

Local setup now requires a real `PAYLOAD_SECRET` in `.env` — `cp .env.example .env`
still covers it. Production deployments need `NEXT_PUBLIC_SERVER_URL` set, or
they must run on Vercel where the platform hostname is injected; anything else
fails loudly at pack-build time rather than leaking a cookie quietly.

SVG is no longer an accepted evidence format. Nothing legitimate is lost: the
`fileType` field only ever offered PDF, XLSX, PPTX, DOCX, PNG and JPG.

Existing evidence records uploaded before this change keep whatever MIME type
they were stored with, which is why the serving route re-checks the type
instead of trusting the upload allowlist alone.

## Alternatives considered

**Sanitising the `access` field in a `beforeChange` hook** rather than field
access. It would work, but it puts the rule somewhere nobody reading
`Users.ts` would look for it, and Payload's field access is the mechanism built
for exactly this.

**Serving evidence from a separate origin**, the usual answer to user-uploaded
content rendering as HTML. It is the stronger control, and it is what we would
need if the format list ever had to open up. It also means a second deployment
and a second auth story for what is currently three static image and document
types, so the sandboxing CSP carries it for now.

**Allowing SVG with server-side sanitisation.** Sanitisers for SVG are a
recurring source of bypasses, and no evidence in this ISMS is an SVG.
