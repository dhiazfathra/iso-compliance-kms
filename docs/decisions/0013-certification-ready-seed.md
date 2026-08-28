# ADR-0013: The seed loads a certification-ready ISMS

## Status

Accepted — extends [ADR-0011](0011-full-requirement-catalogue.md)

## Date

2026-08-28

## Context

The seed loaded the mockup's 29 tracked requirements as they were captured
mid-implementation — drafts, findings, past-due reviews — and the remaining 116
catalogue requirements as weight-0 rows with nothing filed against them.
Readiness came out around 60%, the gap register held live findings, and half
the standard had no chain of evidence at all.

That is a useful state to demonstrate remediation from, and a poor state to
demonstrate an audit with: the tool's job is to answer "show me the evidence
for A.8.24" for every requirement a certification body samples, and it could
only answer for a fifth of them.

## Decision

The seed produces the state the tool is meant to be walked through in a Stage 2
audit: 100% weighted readiness, audit-ready.

|                          | Before                    | Now                       |
| ------------------------ | ------------------------- | ------------------------- |
| Requirements in scope    | 29                        | 145 (the whole catalogue) |
| Clause status            | mixed, 4 gaps             | all `compliant`           |
| `criticality`            | 1, 2 on gaps, 0 catalogue | 1 everywhere in scope     |
| Policies                 | 19, some draft            | 146, all `Approved`       |
| Open gaps                | 4                         | 0                         |
| Overdue reviews/expiries | several                   | none                      |

Three mechanisms do it:

1. `src/seed/coverage.ts` derives a chain from a catalogue entry — one approved
   policy with a three-revision history, one controlled form, one dated record
   with a version history — for every requirement the mockup does not track.
   It is a pure function of the entry, its index and today's date, so
   re-seeding is deterministic and names never collide.
2. The mockup's own rows are closed out on load: status `compliant`, policies
   `Approved`, and the two forms that had no record filed (`FRM-CLD-01`,
   `FRM-PM-01`) now carry one in `mockup-data.ts`.
3. Any review or expiry date the mockup left in the past is rolled forward into
   the next twelve months. A lapsed record is a finding, and a seed that ships
   findings is not audit-ready.

No gaps are seeded. The gap register is empty by construction rather than by
filtering, because there is nothing left open to record.

Weight 0 keeps its ADR-0011 meaning — visible but out of scope — and is now
only used by references that fall outside the catalogue. The seeded dataset has
none.

## Alternatives Considered

### An env flag (`SEED_MODE=partial|ready`)

- Pros: keeps the mid-implementation demo one variable away.
- Cons: two datasets to keep true, and every screen would need checking against
  both. The partial state is reachable by editing a handful of rows in `/admin`,
  which is what the tool is for.
- Rejected.

### Hand-written policy text for all 145 requirements

- Pros: the artefacts would read as real documents.
- Cons: that is a consulting deliverable, not a seed; it would be thousands of
  lines of prose in the repository, wrong for any specific organisation, and
  stale the day the standard is revised.
- Rejected. Titles and control records carry the structure; the text is a
  placeholder and the README says so.

### Leave catalogue rows at weight 0 and claim 100% of the tracked subset

- Pros: no new data.
- Cons: "100% of the 29 requirements we chose to track" is exactly the number an
  auditor discounts. Scope is the first thing checked.
- Rejected.

## Consequences

- Readiness reads 100% and the dashboard's status mix is one bar. The gap
  screen's stats are zeroes — an empty register is the correct audit-ready view,
  not a broken screen.
- Seeding now creates 146 policies, 151 forms and 160 evidence files with real
  placeholder bytes, so it takes about a minute and the audit pack grows from
  29 files to 160. Pack building still holds them all in memory (ADR-0012's
  known ceiling), now against a bigger set.
- `/clauses`' In scope / Whole catalogue filter still works, but both views show
  the same 145 rows until something is taken out of scope.
- Demonstrating remediation needs a row edited back into `gap` in `/admin`,
  plus a gap record. That is a two-minute setup, not a seed variant.
