# ADR-0007: The seed generates genuinely valid placeholder files

## Status

Accepted

## Date

2026-08-28

## Context

The mockup's dataset names 29 evidence files. `evidence` is an upload
collection, and Payload sniffs uploaded bytes and rejects content that does not
match the declared type, so a stub of arbitrary bytes named `x.xlsx` is refused
with `File type text/plain (from extension xlsx) is not allowed`.

## Decision

`src/seed/placeholder.ts` generates a real file per type: a one-page PDF (whose
only content is the record's own filename), a 1×1 PNG and JPEG, and minimal but
valid OOXML packages for XLSX/DOCX/PPTX, built by a 60-line stored-ZIP writer in
`src/seed/zip.ts`.

## Alternatives Considered

### `allowRestrictedFileTypes: true` on the collection

- Rejected: that switch is a trust boundary on a collection that accepts uploads
  from users. Weakening production validation to make a seed pass is the wrong
  trade.

### An archiver dependency (jszip and friends)

- Pros: less code.
- Cons: a runtime dependency that exists only for seed data.
- Rejected: the ZIP writer is short, has no options, and is exercised every time
  the seed runs.

## Consequences

- Seeded PDFs and images render in the in-app preview, so the preview panel can
  be judged honestly instead of against a placeholder box.
- Office placeholders open in Excel/Word/PowerPoint but contain one cell or
  paragraph. They are seed data, and the UI labels them as such.
