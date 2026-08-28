# ADR-0002: Turso (libSQL) as the database, through the SQLite adapter

## Status

Accepted

## Date

2026-08-28

## Context

The stack is fixed to Turso. Payload 3 ships adapters for Postgres, MongoDB and
SQLite; the SQLite adapter (`@payloadcms/db-sqlite`) speaks libSQL and therefore
Turso, accepting a `url` plus an `authToken`.

## Decision

Use `sqliteAdapter` with `url: process.env.DATABASE_URI` and
`authToken: process.env.DATABASE_AUTH_TOKEN`. The same code path runs against a
local `file:./iso-kms.db` in development and against `libsql://…` in production,
so there is no adapter difference between environments.

Schema changes ship as checked-in migrations: `push: false`, `migrationDir` is
`src/migrations`, and Vercel's build command is
`bun run migrate && bun run build`, so the schema is applied before the new code
serves a request.

**Amended 2026-08-28:** `push: true` was the original decision here. It was
replaced on the trigger this ADR set for itself — the first deployment carrying
data that cannot be re-seeded. Nothing else in the decision changed, so this is
an amendment rather than a superseding ADR.

## Alternatives Considered

### Postgres adapter (Neon/Supabase)

- Pros: Payload's most exercised adapter.
- Cons: not the requested database.
- Rejected: the brief specifies Turso.

### Migrations instead of `push: true`

- Pros: reviewable, reversible schema changes.
- Cons: a migration file per collection edit while the model is still moving.
- **Adopted** on that trigger. `src/migrations/` holds the initial migration
  covering all eight collections; `bun run migrate:create <name>` writes the
  next one and `bun run migrate:status` shows what has run.

## Consequences

- `bun run seed` is destructive by design (it clears the compliance collections)
  and is safe only while the data is reproducible. With `push` gone it no longer
  creates the schema either: `bun run migrate` first on a fresh database.
- A collection change now needs a committed migration. Forgetting one shows up
  as a failing deploy rather than as silent schema drift.
- Turso's HTTP protocol means each query is a network round trip; the whole-graph
  load in ADR-0006 keeps that to a handful of queries per request.
