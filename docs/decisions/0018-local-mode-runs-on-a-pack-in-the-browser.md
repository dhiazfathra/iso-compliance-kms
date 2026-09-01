# ADR-0018: Local mode runs on a pack held in the browser

## Status

Accepted — extends the pack format of
[ADR-0012](0012-audit-pack-export.md) into an import path

## Date

2026-08-31

## Context

The repository was usable only as a deployment: every screen was a Server
Component calling `loadGraph()`, the register lived in SQLite and evidence bytes
lived in Vercel Blob. An organisation evaluating the tool had to stand up a
database and a blob store, hand its controlled documents to somebody else's
infrastructure, and sign in, before it could see whether the chain view was
worth anything. For a document set that is by definition sensitive, that is the
wrong order of trust.

What the organisation already has, once `bun run export:pack` runs, is the whole
register as a folder: `graph.json`, a Markdown file per document, the evidence
files, the CSVs and the HTML index. Everything a screen renders is in there.

## Decision

`/local` runs the same application against that folder, with no account and no
server.

- The pack is the database. It is picked with a folder input or as a zip, parsed
  by `parsePack()` — the one parser, shared with the audit pack — and stored in
  OPFS. `graph.json` is the register; editing rewrites it.
- Screens are shared, not forked. Every screen's JSX moved into `src/views/*`
  behind `ViewProps`, and the two route trees became thin loaders. A view takes
  `base` (`''` hosted, `'/local'` local) for its links and a `FormAction` for
  each mutation, so the hosted tree can pass a server action and the local tree
  an ordinary function. A view that took a closure could not render on the
  server, and a view that hardcoded its links could not be shared at all.
- Mutations that change the register are pure functions in `src/lib/local-edit.ts`
  and tested without a browser. The graph is nested — a document appears under
  every clause that cites it — so an edit that rewrote one copy would show
  different text depending on the screen it was reached from.
- What leaves is what came in: "export as zip" and "generate audit pack" emit
  the same `packEntries()` archive, so local work re-imports, and a pack from
  the hosted app opens locally.

## Consequences

- No account, no network, no telemetry: the documents never leave the machine.
  This is the point, and it is also the risk — clearing site data for the origin
  deletes the pack, and the only backup is the last export. The import screen
  says so, and export is one click from the same place.
- There is nothing to authorise, so there is nothing to authorise against:
  `/local` has no roles and no read-only mode. Access control is a property of
  shared storage, and there is none here.
- Two producers of `Graph` now exist. Anything a screen depends on must be in
  the pack, which keeps `graph.json` honest — a field that never reaches the
  export is a field the local screens cannot show.
- Server-only modules cannot be reached from a shared view. `@/lib/data`
  re-exports the pure helpers from `@/lib/graph` but also imports Payload, so
  views import their helpers from `@/lib/graph` and their types type-only. A
  missed import is a build failure, not a runtime surprise.
