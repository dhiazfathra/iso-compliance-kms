# ADR-0004: Strict hierarchy in the tree, many-to-many in the links

## Status

Accepted

## Date

2026-08-28

## Context

The domain is a strict chain — Clause → Policy → Form → Evidence — but the
product's core feature is that one artefact frequently satisfies several
requirements across both ISO 27001 and ISO 9001. A purely hierarchical model
cannot express that; a purely graph model loses the chain an auditor expects to
be walked.

## Decision

Each level carries both a single **primary** parent and a **hasMany** set of
requirements it also satisfies:

| Collection | Primary edge              | Cross-map edge                            |
| ---------- | ------------------------- | ----------------------------------------- |
| `policies` | `primaryClause`           | `clauses` (hasMany)                       |
| `forms`    | `policy`, `primaryClause` | `alsoSatisfies` (hasMany), `externalRefs` |
| `evidence` | `form`                    | `satisfies` (hasMany, primary first)      |

The tree is built from the primary edges, so it stays a tree. The cross-map
edges are rendered wherever the artefact appears — clause tree row, evidence
header, policy detail, matrix, audit session — as the "also satisfies" chips
(`CrossMapChips`).

Cross references in the source data point at requirements that are not
themselves tracked rows (`A.5.10`, `9001 7.5.1`, …). The seed creates a **stub
clause** for each so the relationship resolves and remains clickable. Stubs
carry `criticality: 0`, which excludes them from the readiness score and the
dashboard status counts, and they are hidden from the clause tree unless
searched for.

## Alternatives Considered

### A single `clauseLinks` join collection with a `kind` discriminator

- Pros: one uniform edge table.
- Cons: every screen would resolve links by hand; Payload's admin loses the
  typed relationship pickers.
- Rejected: the per-collection relationship fields are both simpler and better
  in the admin.

### Free-text cross references

- Pros: no stub rows.
- Cons: a chip that cannot be clicked is not a feature; typos are invisible.
- Rejected: cross-mapping is the product, so it must be real data.

## Consequences

- `externalRefs` remains for references that do not resolve to any clause id;
  the matrix shows them in an "outside tracked scope" column.
- Stub clauses appear in the clause count (`39`) but not in the readiness
  denominator (`14`). That difference is intentional and surfaced in the copy.
