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

Schema `push: true` is enabled: the schema is derived from the collection
configuration on boot rather than from checked-in migrations.

## Alternatives Considered

### Postgres adapter (Neon/Supabase)

- Pros: Payload's most exercised adapter.
- Cons: not the requested database.
- Rejected: the brief specifies Turso.

### Migrations instead of `push: true`

- Pros: reviewable, reversible schema changes.
- Cons: a migration file per collection edit while the model is still moving.
- Deferred: switch to `payload migrate` before the first production dataset that
  cannot be re-seeded. Until then `push` keeps iteration cheap.

## Consequences

- `bun run seed` is destructive by design (it clears the compliance collections)
  and is safe only while the data is reproducible.
- Turso's HTTP protocol means each query is a network round trip; the whole-graph
  load in ADR-0006 keeps that to a handful of queries per request.
