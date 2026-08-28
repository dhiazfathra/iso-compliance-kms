# ADR-0001: Next.js 16 App Router and Payload CMS in one deployment

## Status

Accepted

## Date

2026-08-28

## Context

The brief asks for a fullstack application built from a Claude Design mockup:
custom audit-facing screens (dashboard, clause tree, evidence detail) plus a
back office where compliance staff maintain clauses, policies, forms and
evidence. Target platform is Vercel, package manager and runtime is bun.

## Decision

One Next.js 16.3.3 App Router application containing both surfaces:

- `src/app/(app)/**` — the audit-facing UI, rendered from the Payload local API.
- `src/app/(payload)/**` — Payload's admin panel and REST/GraphQL routes,
  mounted by `withPayload` in `next.config.mjs`.

Server Components read data through Payload's local API (`getPayload`), not over
HTTP, so a page render is a direct database read with no self-request.

## Alternatives Considered

### Separate Payload service plus a Next.js frontend

- Pros: independent scaling and deploys.
- Cons: two deployments, HTTP hop on every render, shared-secret and CORS
  handling for a single-tenant internal tool.
- Rejected: the coordination cost buys nothing at this size.

### Payload admin only, no custom frontend

- Pros: nothing to build.
- Cons: the mockup's value is the audit-facing layout — cross-mapping made
  visible, one-screen chain of evidence. A generic CRUD admin does not do that.
- Rejected: it is the product requirement.

## Consequences

- Every custom screen sets `export const dynamic = 'force-dynamic'`; the data is
  operational and must not be cached at build time.
- The admin panel is available at `/admin` with no extra infrastructure.
- Payload regenerates `src/app/(payload)/admin/importMap.js` on build, so that
  file's formatting drifts between a `bun run build` and a manual format pass.
