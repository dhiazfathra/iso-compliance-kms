# ADR-0011: Load the whole standard, score only what is in scope

## Status

Accepted — extends [ADR-0004](0004-clause-hierarchy-and-cross-mapping.md)

## Date

2026-08-28

## Context

The repository held the 14 requirements the mockup dataset covers, plus stub
rows invented for whatever a cross reference happened to point at. An auditor
asking "where is A.8.24?" got nothing, and the tool could not answer the first
question a certification body asks — what is in scope and what is not — because
the out-of-scope half of the standard did not exist as data.

## Decision

`src/seed/iso-catalog.ts` carries the full catalogue: all 93 ISO/IEC 27001:2022
Annex A controls across the four themes (37 organizational, 8 people, 14
physical, 34 technological) and the auditable ISO 9001:2015 clauses, 4.1 through
10.3. Only the reference and its short title are held — the standards' own text
is copyrighted and is not reproduced.

Two populations, one table, told apart by the weight that already exists:

|                          | `criticality`     | Status           | In readiness | In the tree by default |
| ------------------------ | ----------------- | ---------------- | ------------ | ---------------------- |
| Tracked (the ISMS scope) | 1, or 2 for a gap | From the dataset | yes          | yes                    |
| Catalogue (the rest)     | 0                 | `gap`            | no           | no — one chip away     |

`/clauses` gains an **In scope / Whole catalogue** filter; "In scope" is the
default, so the working view is unchanged and the full standard is one click
away. A search still reaches catalogue rows in either mode, so looking up
A.8.24 works from anywhere. The dashboard, readiness score and the audit
session's requirement list stay on tracked rows only.

Catalogue rows are `gap` rather than a new status, because that is what every
other screen already means by gap: nothing is filed against it.

### Clause numbers collide across standards

ISO 9001's 9.2 (internal audit) and the ISMS's own 9.2 are different
requirements with the same number, and `clauses.clauseId` is unique. The tracked
row keeps the bare number; the catalogue entry from the other standard is
namespaced `9001 9.2`, which is the syntax cross references in the dataset
already use. Both requirements exist, and both resolve.

## Alternatives Considered

### A separate `catalogue` collection

- Pros: the tracked table stays small and obviously "ours".
- Cons: two tables to join for every cross-map lookup, and a requirement moving
  into scope becomes a migration between tables rather than an edit.
- Rejected.

### A new `scope` field instead of reusing `criticality: 0`

- Pros: says what it means.
- Cons: `criticality` already drives exactly this — ADR-0004 gave weight 0 to
  rows that must not move the score, and every screen already honours it. A
  second field would have to agree with the first forever.
- Rejected; the filter is named for scope even though the storage is the weight.

### Namespacing every clause id (`27001:A.5.15`)

- Pros: no collisions ever.
- Cons: changes every id in the dataset, every cross reference, and every URL,
  to fix two rows.
- Rejected: namespace only what collides.

## Consequences

- The clause count in the sidebar is now the standard's size (145), not the
  project's backlog. Readiness still divides by the 14 tracked requirements, and
  the dashboard says so.
- Bringing a requirement into scope is an edit in the admin: give it a
  criticality above 0 and an owner, and it starts counting.
- The catalogue is transcribed by hand, so it is worth a check against the
  standard before a real certification audit; `tests/iso-catalog.test.ts` guards
  the counts, the theme split, the numbering range and the absence of duplicates.
