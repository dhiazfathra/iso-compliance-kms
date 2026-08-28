# ADR-0003: Evidence files in Vercel Blob, not in the database

## Status

Accepted

## Date

2026-08-28

## Context

Evidence records are PDFs, spreadsheets, presentations and photographs. A
compliance repository accumulates hundreds of them, and Turso is a poor place
for binaries: row size limits, replication cost, and no HTTP range requests for
an in-browser PDF viewer.

## Decision

The `evidence` collection is a Payload upload collection with
`disableLocalStorage: true`, and `vercelBlobStorage` is registered for it when
`BLOB_READ_WRITE_TOKEN` is present. Payload keeps the metadata row (filename,
mime type, size, URL); Vercel Blob keeps the bytes.

The plugin is registered conditionally so that a local `bun install && bun run
build` works with no Blob token: metadata is recorded, and the preview panel
says plainly that no file is stored.

Uploads are restricted by `mimeTypes` to PDF, the three OOXML formats and
images. That restriction is a trust boundary and is deliberately kept.

## Alternatives Considered

### Base64 blobs in Turso

- Rejected: inflates every row read, and defeats streaming and range requests.

### S3 via `@payloadcms/storage-s3`

- Pros: portable across hosts.
- Cons: another account and credential set for a Vercel-targeted deployment.
- Rejected for now: the storage adapter is one line to swap if the host changes.

## Consequences

- Deployment needs `BLOB_READ_WRITE_TOKEN` in the environment; without it,
  uploads succeed as metadata but store no file.
- Blob URLs are public-by-default; before a live audit with an external reader,
  move to access-controlled URLs.
