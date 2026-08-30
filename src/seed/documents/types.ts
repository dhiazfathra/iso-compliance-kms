/**
 * Real governance documents (ADR-0017).
 *
 * The derived coverage in `coverage.ts` gives every catalogue requirement a
 * structurally complete chain, but its text is generic. These are the
 * organisation's actual controlled documents — the ones an auditor asks to see
 * by name — carried as full Markdown and filed against the requirement they
 * satisfy, with their cross references, revision history and expiry intact.
 */
export type DocFormat = 'MD' | 'DOCX' | 'PDF' | 'XLSX'

export type SeedRevision = {
  version: string
  date: string
  author: string
  approval: string
  status: 'Superseded' | 'Current'
  note: string
}

export type SeedEvidence = {
  /** Filename as it appears in the register. */
  name: string
  fileType: DocFormat
  uploadedAt: string
  /** Blank when the record does not lapse (an approval minute, say). */
  expiryDate?: string
  uploader: string
  note: string
  /** Body written into the generated file. Defaults to the document body. */
  body?: string
}

export type SeedDocument = {
  /** The organisation's own document number, e.g. `TRD-SEC-002`. */
  code: string
  title: string
  /** Requirement this document primarily satisfies; must exist in the catalogue. */
  clause: string
  /** Other requirements it contributes to — the cross-clause map. */
  crossRefs: string[]
  version: string
  owner: string
  form: { code: string; name: string }
  revisions: SeedRevision[]
  evidence: SeedEvidence[]
  /** The controlled text itself, in Markdown. */
  body: string
}
