# ADR-0010: Evidence bytes are streamed through the app, never linked from storage

## Status

Accepted — supersedes the storage-exposure consequence of
[ADR-0003](0003-vercel-blob-evidence-storage.md)

## Date

2026-08-28

## Context

ADR-0003 recorded the exposure and the trigger for fixing it: "Blob URLs are
public-by-default; before a live audit with an external reader, move to
access-controlled URLs." ADR-0009 introduced exactly that external reader.

Measured on the deployed app before this change: an anonymous request for
`/api/evidence/file/<filename>` returned the PDF with `200`, while the evidence
record itself correctly returned `401`. Filenames come from the register and are
guessable (`access-review-2026Q2-signed.pdf`), so the whole evidence library was
readable by anyone who could name a file.

`@payloadcms/storage-vercel-blob` types `access` as `'public'` and says so:
"Currently, only 'public' is supported. Vercel plans on adding support for
private blobs in the future." So access-controlled storage URLs are not
available to us at all.

## Decision

The application becomes the only door to the bytes.

1. **`/evidence/[id]/download` streams the file** instead of redirecting to
   storage. It resolves the session (ADR-0008/0009), reads the record with
   `overrideAccess: false`, then pipes the upstream body back with the record's
   own mime type and `Cache-Control: private, no-store`.
2. **Nothing renders a storage URL.** The PDF iframe and the image tag in
   `EvidencePreview` point at the same route with `?inline=1`, which sets
   `Content-Disposition: inline`. A URL that never reaches the browser cannot
   leak from it.
3. **`addRandomSuffix: true`** on the storage plugin, so the object name is not
   derivable from the filename in the register. This is defence in depth, not
   the control: the control is (1) and (2).
4. **A preview is not a download.** `?inline=1` does not increment the audit
   session's download counter; the plain route does. The counter answers "what
   did the auditor take away", which is what a certification body asks.

## Alternatives Considered

### A private Blob store

- Pros: the correct fix.
- Cons: the Payload plugin cannot address one. It would mean dropping the plugin
  and writing our own storage adapter.
- Rejected for now; revisit when the plugin supports private access, at which
  point this route becomes a redirect to a signed URL and keeps its audit role.

### Random suffix alone (capability URLs)

- Pros: one line, no proxying.
- Cons: an unguessable URL is still a bearer token that never expires, is not
  checked against the session, and is copied wherever a screenshot goes.
- Rejected as the control, kept as defence in depth.

## Consequences

- Every evidence byte now crosses the function, so a download costs one extra
  hop and cannot be served from a CDN edge. For documents of this size (hundreds
  of KB) that is not worth optimising.
- The audit trail's download count is now complete for anything fetched through
  the app.
- Blob objects uploaded before this change keep their plain names. They are no
  longer linked anywhere, and re-seeding replaces them with suffixed ones.
- The route is the trust boundary for evidence: any new surface that shows a
  file must use it rather than `item.url`.
