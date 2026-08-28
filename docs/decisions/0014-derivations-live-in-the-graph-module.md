# ADR-0014: Every derivation of the compliance graph lives in `lib/graph.ts`

## Status

Accepted — builds on [ADR-0006](0006-whole-graph-load.md) and
[ADR-0011](0011-full-requirement-catalogue.md)

## Date

2026-08-29

## Context

[ADR-0006](0006-whole-graph-load.md) gives every screen the same in-memory
compliance graph in one read. What it did not say is where the screen's _view_
of that graph is computed, and the answer had drifted to "inline, in the Server
Component". Five pages had each grown their own derivation:

| Screen          | Derived inline                                                         |
| --------------- | ---------------------------------------------------------------------- |
| `/` (dashboard) | expiry horizon, overdue count, 30-day count, per-status × per-standard |
| `/owners`       | five-way status split per owner, evidence count, reviews due           |
| `/gaps`         | mean progress, median days to due                                      |
| `/matrix`       | cross-map rows and the columns worth drawing                           |
| `/clauses`      | the nine-level search predicate and the scope rule                     |

Three problems followed from that placement, and none of them are stylistic:

1. **No test surface.** These are compliance calculations — the numbers a
   certification body reads first. The only way to assert on them was to render
   a page. `tests/graph.test.ts` covered `readiness`, `crossMapOf` and
   `evidenceCount`; everything downstream of `loadGraph` was untested.

2. **The rules drifted.** The dashboard computed its own overdue and 30-day
   windows with `(new Date(x.date).getTime() - now.getTime()) / 86400000`, three
   lines away from a tested `daysUntil()` in `format.ts` that does the same
   thing and handles an unparseable date. The owners table used `daysUntil`
   correctly. Same question, two implementations, one of them fragile.

3. **"In scope" was stated four times.** ADR-0011 defines an in-scope
   requirement as one carrying weight. The dashboard wrote
   `(c.criticality ?? 1) > 0`, the clauses screen wrote
   `(c.criticality ?? 1) === 0`, and `readiness()` never checked at all — it is
   correct only because a weight-0 clause contributes zero to both sides of the
   ratio. A coincidence was holding up a headline number.

## Decision

`src/lib/graph.ts` owns every derivation of the compliance graph. A screen may
read the graph, call a derivation, and render. It may not compute a compliance
number inline.

The module exports, alongside the existing `crossMapOf` / `evidenceCount` /
`readiness`:

- `isTracked` / `trackedClauses` — the ADR-0011 scope rule, named once
- `statusCount(clauses, status, standard?)`
- `expiryHorizon(graph, now)` — clause reviews and evidence expiries merged,
  with `overdue` and `soon` counted through `daysUntil`
- `ownerLoad(graph, now)` — the owner accountability table
- `gapStats(gaps, now)` — the gap register headline
- `crossMapMatrix(graph)` — matrix rows and the columns worth drawing
- `filterClauses(clauses, filter)` and `openChainKeys(clauses, searched)`
- `SOON_DAYS` — the one definition of "due soon", used by the dashboard
  headline, the owners column header and its arithmetic

Every function taking a clock takes `now` as a parameter, matching the
convention `format.ts` already set: the clock stays out of the render and out of
the tests.

`STATUS_META` in `format.ts` follows the same rule for presentation. It now
carries `ink` (the status as readable text on the page) and `bar` (the solid
fill for split bars) so that a caller reads a field instead of re-deriving one —
the dashboard had been recovering a text colour by comparing a chip colour
against the paper colour, `STATUS_META[s].color === '#fdfdfc'`.

## Alternatives considered

### A separate `lib/rollups.ts`

Rejected. `graph.ts` was already the module for "derived views over the graph",
at 27 lines with a test file pointed at it. A second module would have split one
idea across two files and forced a naming argument about which derivation goes
where.

### Splitting the Payload-document mapping out of `data.ts`

Rejected, and worth recording so it is not re-proposed: `data.ts` is ~200 lines,
most of it mapping Payload documents onto graph nodes inside a cached loader.
Extracting the mapping fails the deletion test — it has exactly one caller, so
the split would move complexity across a file boundary rather than concentrate
it. One adapter is a hypothetical seam, not a real one. Revisit only if a second
source of graph data appears.

### React Server Component memoisation instead of extraction

Rejected. It addresses recomputation, which was never the problem; the
derivations run once per request already, behind the `cache()`d `loadGraph`.

## Consequences

- Pages are presentation. `/matrix` lost 15 lines, `/owners` 43, `/clauses` 52,
  the dashboard 83; `graph.ts` gained 214 and `tests/graph.test.ts` gained 314.
- The boundaries that mattered are now asserted: a review dated exactly
  `SOON_DAYS` out counts as soon and not overdue, an owner with nothing assigned
  drops out of the table, an empty gap register does not divide by zero, and the
  clause needle is checked against each of the nine levels it claims to reach.
- Changing the readiness weighting, the due-soon window or the search reach is
  one edit in one module, and the test file fails if the behaviour moves.
- The cost: a screen wanting a genuinely one-off number must either add it to
  `graph.ts` or argue that it is presentation. That friction is intended —
  it is what stopped the five copies.
