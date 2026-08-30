# ADR-0017: The seed loads the organisation's real controlled documents

## Status

Accepted — narrows the "hand-written policy text" rejection in
[ADR-0013](0013-certification-ready-seed.md)

## Date

2026-08-30

## Context

Every seeded artefact carried derived text: a policy body generated from the
requirement's title, and an evidence file whose only content was its own
filename. The register had the right shape and nothing to read. Opening any
document in the viewer, the PDF export or the audit pack showed a skeleton, so
neither the Markdown viewer (ADR-0016) nor the audit-session presentation mode
could be judged against anything real.

ADR-0013 rejected writing policy text for all 145 requirements, and that
rejection stands: it is a consulting deliverable, wrong for any specific
organisation, and stale the day the standard is revised.

## Decision

Eight documents that PT Cakrawala Bumi Estetika actually operates are carried in
`src/seed/documents/` as full text, filed against the requirement each satisfies:

| Document                   | Requirement | Cross references               |
| -------------------------- | ----------- | ------------------------------ |
| TRD-SEC-002 — PII handling | A.5.34      | A.5.31, A.8.10, A.8.12, A.5.14 |
| CBE/ISMS/SOP/19 — Leakage  | A.8.12      | A.5.14, A.8.10, A.5.34, A.5.12 |
| Information Deletion       | A.8.10      | A.5.34, A.8.12, A.5.37         |
| Data Governance / MDM      | A.5.12      | A.5.9, A.5.13, A.8.27          |
| ENG-SOP-001 — SDLC         | A.8.25      | A.8.28, A.8.27, A.5.37, 7.5.3  |
| ADR procedure and template | A.8.27      | A.8.25, A.5.37, 7.5.3          |
| SPACE/DORA measurement     | 9.1.1       | 9.1.3, A.8.25, 9.3             |
| Management review (MRM)    | 9.3         | 9001 9.3, 9.1.1, A.5.1         |

Each carries the full Clause → Policy → Form → Evidence chain, a revision
history whose current version matches the document version, and evidence with
its own review and expiry dates. The remaining 137 requirements keep the derived
coverage of ADR-0013 unchanged.

Format follows the document's use, as the organisation already treats them:
Markdown for working documents (SOPs, RCAs, ADRs, running logs), Word for
anything signed or issued (procedures, DPIA, destruction certificates, MRM
minutes), and a spreadsheet for the registers that are kept as one.

`placeholderFile(name, type, body?)` writes that text into the bytes: Markdown
verbatim, one Word paragraph per line, one spreadsheet row per line with a cell
per `|`-separated field, and a wrapped Helvetica page for PDF.

The other 137 requirements do not keep the one-line stub of ADR-0007 either.
`recordBody()` in `coverage.ts` derives a control record for each — the form it
was filed on, who performed and countersigned it, the population and sample, the
result, and when it is next due — so every seeded file reads as a record. It
says in its own closing note that the sample was not drawn from a live system.
The stub remains only as the fallback when no text is supplied at all.

`MD` is a new evidence type: `text/markdown` is on the upload allowlist, and the
download route serves it inline as `text/plain` inside the existing sandboxed
frame. Nothing in a text file executes, and labelling it anything richer would
invite the browser to treat a stored document as markup.

## Alternatives considered

### Add tables to the Markdown subset so registers render as tables

- Pros: a retention schedule reads as a schedule.
- Cons: ADR-0016 decided the subset deliberately, and this would change the
  parser, both renderers and the PDF for every document in the product.
- Rejected for now. Policy bodies express registers as lists instead; the
  evidence files keep their pipe-delimited tables, because those are downloaded
  rather than rendered here.

### Generate the eight documents from a template too

- Rejected: the point is that these are the specific documents an auditor asks
  for by name. A template would reproduce exactly what was already there.

## Consequences

- The audit pack now contains readable documents, so the presentation mode and
  the PDF export can be judged honestly.
- Named people appear as authors, reviewers and approvers, so the register shows
  who operates each control rather than one name on every row.
- These eight documents are the group's own text. Another organisation reusing
  this seed must replace them; the derived coverage is what is generic.
- The documents describe an ISMS run by a 13-person team, and say so where scope
  was deliberately cut — no MDM product, no metrics platform, no schema
  registry. That is a check on building for a scale that has not arrived.
