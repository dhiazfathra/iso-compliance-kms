# ADR-0006: Load the whole compliance graph per request

## Status

Accepted

## Date

2026-08-28

## Context

Every screen needs some slice of the same graph, and several need most of it —
the clause tree walks four levels, the matrix needs every form's cross-map, the
dashboard mixes clause review dates with evidence expiry dates. Resolving those
per screen with nested `depth` queries produces a different query shape per page
and a different idea of what "cross-mapped" means on each.

## Decision

`loadGraph()` in `src/lib/data.ts` issues seven flat queries (one per
collection), assembles the hierarchy in memory, and is wrapped in React's
`cache()` so a single request renders the layout and the page from one load.

Filtering and search run over that in-memory result, not in the database.

## Alternatives Considered

### Per-screen queries with `depth` and `where`

- Pros: less data over the wire per page.
- Cons: seven query shapes to keep consistent, and the cross-map derivation
  duplicated in each.
- Rejected at this scale.

## Consequences

- This is correct for hundreds of rows and wrong for tens of thousands. The
  ceiling is the point at which the clause set stops fitting comfortably in
  memory; at that point push filtering into `where` clauses and paginate the
  clause tree, starting with `loadGraph`'s callers.
- Search over evidence titles and cross references is trivially available
  because the whole graph is already present.
