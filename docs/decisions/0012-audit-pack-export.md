# ADR-0012: The audit pack is a real ZIP, built after the response and expired by a daily sweep

## Status

Accepted

## Date

2026-08-28

## Context

`/audit-pack` described an export and produced nothing: it listed what a pack
would contain and told the reader to "wire it to a background job before the
first live audit". A certification body is handed a pack, not a screenshot of
one.

The work is I/O-bound rather than clever — read the graph, read every evidence
file, write an archive — but it is too slow to do inside a request, and the
result is a file that must not live forever.

## Decision

**The row is the job.** `audit-packs` holds `packId`, `status`
(`building` → `ready` | `failed`, later `expired`), who asked, when, the stored
URL, its size, and the entry count. Requesting a pack creates the row and
returns; the archive is built in Next's `after()`, so the screen is never
blocked on reading 29 files. The screen lists recent packs with their status,
and a `ready` one gets a download link.

**The archive is written by the ZIP writer this repository already has.**
`src/lib/zip.ts` — sixty lines, written for ADR-0007's seed placeholders — moved
from `src/seed/` and taught to take a `Buffer` as well as a string. No archiver
dependency was added for a second use of the same code.

A pack contains `index.html` (the hyperlinked clause → policy → form → evidence
index, every evidence link pointing at the copy inside the ZIP so it works
offline), `clauses.csv`, `evidence.csv`, `gaps.csv`, `cross-map.csv`,
`MANIFEST.txt`, and `evidence/` with every file.

**Evidence bytes are read back through `/evidence/[id]/download?inline=1`**,
with the requester's cookie, rather than from storage directly. ADR-0010 made
that route the only door to evidence and this keeps it that way — one place
enforces access, and the builder inherits it.

**The pack expires.** `expiresAt` is set 14 days out, matching what the screen
has always promised. A Vercel cron calls `/api/audit-packs/sweep` daily; it
requires `CRON_SECRET` as a bearer token and refuses outright when none is
configured, so it can never be an open delete button. The sweep deletes the blob
and marks the row `expired`; if the delete fails the row stays `ready` and
records the error, because a pack whose file is still out there has not expired
whatever the date says.

## Alternatives Considered

### A queue (QStash, Inngest, SQS)

- Pros: retries, visibility, survives a redeploy mid-build.
- Cons: another service and credential for one job type on a single-tenant
  internal tool.
- Rejected for now. The row already records `failed` with the reason, and
  re-requesting is one click. Revisit when a pack outgrows one function
  invocation.

### Building synchronously and streaming the ZIP to the browser

- Pros: no row, no storage, no lifecycle.
- Cons: the request holds until every file is read; nothing is auditable
  afterwards — and "who exported what, when" is the sort of question this
  repository exists to answer.
- Rejected.

### Storing packs in the `evidence` collection

- Rejected: `evidence` is a trust boundary with a `mimeTypes` allowlist that
  deliberately excludes archives (ADR-0003). Packs get their own prefix,
  `audit-packs/`, so the sweep can find them.

## Consequences

- Pack building is bounded by the function's memory and timeout: every file is
  held in memory at once. Measured on the seeded dataset — 29 files, 66 KB
  zipped — that is nowhere near the limit; a repository with gigabytes of
  evidence needs streaming or a queue, and that is the trigger to revisit.
- `CRON_SECRET` must be set in the deployment or the sweep returns 503 and packs
  accumulate. That is the loud failure, chosen over a quiet unauthenticated
  delete endpoint.
- A pack is a snapshot. It says so in `MANIFEST.txt`, and re-exporting is how you
  get a newer one.
- Downloads go through `/audit-pack/[packId]/download`, so an expired auditor
  session cannot keep pulling an export, and the download lands in the session's
  counter like any other.
