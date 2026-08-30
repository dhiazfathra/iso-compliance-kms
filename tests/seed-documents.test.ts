import { describe, expect, test } from 'bun:test'
import { DOCUMENTS } from '../src/seed/documents'
import { CATALOG } from '../src/seed/iso-catalog'
import { CL } from '../src/seed/mockup-data'

/** Every requirement the seed can link to: the catalogue plus the tracked rows. */
const KNOWN = new Set([
  ...CATALOG.map((c) => c.id),
  ...CATALOG.map((c) => `${c.standard} ${c.id}`),
  ...CL.map((c) => c.id),
])

describe('controlled documents', () => {
  test('every document maps to a requirement that exists', () => {
    for (const doc of DOCUMENTS) {
      expect(KNOWN.has(doc.clause)).toBe(true)
      // A cross reference that resolves to nothing is filed as an external ref
      // by the seed, so it may not exist — but it must not be empty.
      for (const ref of doc.crossRefs) expect(ref.trim().length).toBeGreaterThan(0)
    }
  })

  test('codes, form codes and filenames are unique across the register', () => {
    const codes = DOCUMENTS.map((d) => d.code)
    const forms = DOCUMENTS.map((d) => d.form.code)
    const files = DOCUMENTS.flatMap((d) => d.evidence.map((e) => e.name))
    for (const list of [codes, forms, files]) {
      expect(new Set(list).size).toBe(list.length)
    }
  })

  test('the current revision matches the document version and is filed once', () => {
    for (const doc of DOCUMENTS) {
      const current = doc.revisions.filter((r) => r.status === 'Current')
      expect(current).toHaveLength(1)
      expect(current[0].version).toBe(doc.version)
      // The history has to be in order, or the audit trail says nothing.
      const dates = doc.revisions.map((r) => Date.parse(r.date))
      expect(dates).toEqual([...dates].sort((a, b) => a - b))
      expect(doc.evidence.length).toBeGreaterThan(0)
      expect(doc.body.length).toBeGreaterThan(500)
    }
  })

  test('a file extension matches the declared format', () => {
    for (const e of DOCUMENTS.flatMap((d) => d.evidence)) {
      expect(e.name.split('.').pop()).toBe(e.fileType.toLowerCase())
    }
  })
})
