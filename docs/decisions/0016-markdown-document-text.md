# ADR-0016: controlled document text is Markdown, rendered and exported in-house

## Status

Accepted — extends [ADR-0005](0005-version-history-as-array-fields.md) and
[ADR-0013](0013-certification-ready-seed.md)

## Date

2026-08-29

## Context

Until now a policy in this repository was metadata about a document: a name, a
version, an owner, a clause mapping and a revision history. The document itself
lived somewhere else — a Word file on someone's drive. An auditor asking "show me
the access control policy" got a row, not a text.

Three things had to be decided together:

1. **What the authoring format is.** Payload ships Lexical rich text, which
   stores a JSON node tree. Compliance text is reviewed in diffs and pasted
   between systems, and this repository already keeps its version history as
   plain fields (ADR-0005); a JSON tree is neither reviewable in a diff nor
   trivially exportable.
2. **How the text is rendered.** Anyone with `write` can edit a document body,
   so a body is untrusted input at render time. `marked` plus a sanitiser is the
   normal answer, and it is two dependencies plus a sanitiser configuration to
   keep correct forever.
3. **How the PDF is produced.** The export runs on a server route with no
   browser to print from, so `window.print()` is not available, and a headless
   renderer is not something to put in a Vercel function for a page of text.

## Decision

**Markdown in a `textarea`, one parser, two renderers, no new dependencies.**

- `policies.body` is a plain text field holding Markdown. It diffs, it pastes,
  and it is the same shape in the database, in the export and on screen.
- `lib/markdown.ts` parses it into a block list once, and renders that list to
  HTML. The renderer escapes every character of the source and emits a fixed tag
  set; there is no raw-HTML passthrough, so a stored document body cannot become
  script on our origin. Link targets are restricted to `http(s)`, site-relative
  paths and anchors — a `javascript:` target renders as literal text.
- `lib/pdf.ts` lays the same block list out as A4 pages and writes the PDF by
  hand, the same reasoning as `lib/zip.ts` (ADR-0007): text in two Type 1 fonts
  is a page of PDF syntax, not a rendering engine.
- The editor is a `textarea` beside a live preview that runs the same renderer as
  the saved page, so the editor cannot show something the export would not
  produce. Saving needs `write` and lands in the activity trail.
- `/policies/[id]/download` generates the PDF per request from the stored text,
  under the collection's own access rules, so a download is never a stale copy
  of an approved document.

## Consequences

- The Markdown subset is deliberately small (see README, Known limits). Tables
  and images are the first things a real policy will ask for; they are additions
  to one parser and one layout function, not a change of approach.
- The PDF wraps on average glyph width, so a line of capitals wraps slightly
  early. Embedding the Helvetica widths table is the upgrade path, marked in the
  source.
- Rendering and layout are pure functions over text, so both are covered by
  `tests/markdown.test.ts` and `tests/pdf.test.ts` — including the escaping and
  link rules, which are security behaviour and must not regress.
- Audit packs (ADR-0012) still export evidence files and CSV indexes; including
  each policy's PDF in the pack is now possible and is not done yet.

## Alternatives considered

- **Lexical rich text.** Native to Payload and a better authoring experience,
  but stores a JSON tree: unreviewable in a diff, and an export needs a
  converter per output anyway.
- **`marked` + `dompurify`.** Two dependencies and a sanitiser policy to own, to
  parse a subset this application already fully specifies. Safety here comes
  from never emitting unescaped input, which is a property of the renderer, not
  of a post-processing step.
- **Headless Chromium or a PDF library for the export.** Correct typography, at
  the cost of a heavy dependency or a browser in a serverless function, for a
  document that is a page of text in one font.
- **Uploading the .docx as evidence and calling it the document.** What the
  organisation does today, and the reason the text was invisible to the
  repository: nothing could render it, diff it or export it.
