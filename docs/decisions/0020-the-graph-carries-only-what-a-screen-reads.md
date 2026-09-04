# 20. The whole-graph load carries only what a screen reads

Date: 2026-09-04

## Status

Accepted. Refines [ADR-0006](0006-whole-graph-load.md); depends on
[ADR-0016](0016-markdown-document-text.md) and
[ADR-0017](0017-real-controlled-documents.md).

## Context

[ADR-0006](0006-whole-graph-load.md) chose one read of the whole compliance
graph per request over per-screen queries. That was, and remains, the right
trade: the dataset is a few hundred rows, every screen needs the cross-mapping,
and N nested queries per screen would be both slower and harder to keep
access-checked.

What changed underneath it was the size of a row. ADR-0016 put controlled
document text in the graph as Markdown; ADR-0017 replaced the stubs with the
organisation's real documents. That is roughly a megabyte of prose spread over
the register — and "one read of the whole graph" was, unexamined, still reading
all of it.

Two places render document text: the policy screen and the pack build. Every
other screen — the dashboard, the clause tree, the matrix, owners, gaps,
evidence — was paying for it twice. Once out of SQLite, and again on the way
out: the clause tree is a client component and receives `ClauseNode[]`, each
clause carrying its policies, each policy carrying its body. React serialises
what it is given. Close to a megabyte of Markdown was being written into the
RSC payload of a screen that displays a policy's name, version and status.

Two smaller costs were sitting in the same function. The hierarchy was
assembled with a `filter` inside a `map`, three times over — evidence per form,
forms per policy, policies per clause. Against the full requirement catalogue of
[ADR-0011](0011-full-requirement-catalogue.md) that is hundreds of thousands of
comparisons on every render of every page. And the activity log was read with
`limit: 1000, pagination: false`: an append-only audit trail, read whole, which
means the application got measurably slower every day the ISMS was used — the
one growth curve a compliance tool is guaranteed to be on.

## Decision

**One read of the whole graph, of the fields a screen actually reads.** ADR-0006
is unchanged in shape. What it loads is now scoped: `loadGraph` excludes policy
bodies, and the two callers that need them say so — `loadPolicyBody(id)` for
the policy screen, `loadGraphWithBodies()` for the pack build, which writes
every document out as a file and genuinely needs all of them.

The alternative was to keep the field and stop passing the graph across the
client boundary. Rejected: the clause tree needs the hierarchy it is given, and
trimming props at each boundary means the rule has to be re-applied at every
new one. Excluding the field at the source is one decision in one place.

**The largest field decides the default, not the common case.** A field that
two of eleven screens read is opt-in, whatever the convenience of having it
everywhere. This is the rule to apply to the next large field added to a
collection, before it is added.

**Grouping is one pass.** `groupBy` in `lib/graph`, beside the rest of the pure
graph work, where it is tested directly rather than inferred from a page render.

**The audit trail is read through a window.** `ACTIVITY_WINDOW` entries, most
recent first. Nothing renders more; the collection remains complete, and the
REST and GraphQL APIs still reach all of it under the same access rules.

## Consequences

- The clause tree's RSC payload no longer contains document text. This is the
  change a user feels: it is the largest screen and the one most navigated to.
- A policy screen makes one extra query. It is a single row by primary key,
  in parallel with the user lookup, against a graph read it was already making.
- `PolicyNode.body` is optional and now usually absent. Any new server-side
  reader of it must go through `loadPolicyBody` or `loadGraphWithBodies`; the
  type says so, and the JSDoc on `readGraph` says why.
- Local mode is unaffected. Its graph comes from the pack (ADR-0018), which is
  built with bodies, so an offline register still renders every document.
- An activity view that wants more than the window will need pagination rather
  than a larger constant. That is the correct pressure.
