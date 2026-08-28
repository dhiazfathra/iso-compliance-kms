# ADR-0005: Version history as an explicit array field, not Payload drafts

## Status

Accepted

## Date

2026-08-28

## Context

Both policies and evidence need a visible revision history: version label, date,
author, what changed, and — for policies — who approved it. Payload has a
built-in `versions`/drafts feature that snapshots documents on every save.

## Decision

Model the history explicitly as a `revisions` array field on `policies` and
`evidence`, and render it with one shared layout on both screens.

Uploading a new evidence version (`uploadNewVersion` server action) replaces the
stored file, prepends a revision entry, and writes an `activity` row, so the
audit trail and the file are updated in one operation.

## Alternatives Considered

### Payload drafts/versions

- Pros: automatic, no modelling.
- Cons: snapshots are keyed to save events, carry no approval field, and cannot
  be seeded with the historical dates and authors this repository must show
  (revisions going back to 2024). An auditor reads the history, so it has to be
  first-class data, not a side effect of editing.
- Rejected for the user-visible history; it can be enabled later for tamper
  evidence without changing this model.

## Consequences

- Nothing forces a revision entry to be written on an admin-panel edit. The
  server action does it; a bare admin save does not. If admin edits become the
  main path, add an `afterChange` hook that appends the entry.
- Both histories share one visual pattern, which is what the brief asked for.
