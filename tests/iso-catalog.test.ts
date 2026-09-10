import { describe, expect, it } from 'bun:test'
import { CATALOG, catalogKey } from '../src/seed/iso-catalog'
import { CL } from '../src/seed/mockup-data'

const ids = CATALOG.map((c) => catalogKey(c.id, c.standard))

describe('the requirement catalogue', () => {
  it('carries all 93 Annex A controls, in their four themes', () => {
    const annex = CATALOG.filter((c) => c.id.startsWith('A.'))
    expect(annex).toHaveLength(93)
    const perTheme = (n: string) => annex.filter((c) => c.id.startsWith(`A.${n}.`)).length
    expect([perTheme('5'), perTheme('6'), perTheme('7'), perTheme('8')]).toEqual([37, 8, 14, 34])
  })

  it('marks Annex A as 27001 and namespaces the ISMS clauses that clash with the QMS', () => {
    expect(CATALOG.every((c) => (c.id.startsWith('A.') ? c.standard === '27001' : true))).toBe(true)
    const numbered = CATALOG.filter((c) => !c.id.startsWith('A.'))
    // Both standards number their clauses 4 to 10, so both appear.
    expect(numbered.some((c) => c.standard === '9001')).toBe(true)
    expect(numbered.some((c) => c.standard === '27001')).toBe(true)
    expect(catalogKey('9.2', '27001')).toBe('27001 9.2')
    expect(catalogKey('9.2', '9001')).toBe('9.2')
    expect(catalogKey('A.5.1', '27001')).toBe('A.5.1')
  })

  it('carries the ISO 27001 management clauses an auditor certifies against', () => {
    const isms = CATALOG.filter((c) => c.standard === '27001' && !c.id.startsWith('A.'))
    for (const top of ['4', '5', '6', '7', '8', '9', '10'])
      expect(isms.some((c) => c.id.startsWith(`${top}.`))).toBe(true)
    // The requirements with no Annex A equivalent, so a gap here is visible.
    for (const id of ['4.3', '6.1.2', '6.1.3', '8.2', '8.3', '9.2.2', '10.2'])
      expect(isms.some((c) => c.id === id)).toBe(true)
  })

  it('covers ISO 9001 clauses 4 to 10, sub-clauses included, and nothing below 4', () => {
    const q = CATALOG.filter((c) => c.standard === '9001').map((c) => c.id)
    // The sub-clauses a finding is actually raised against, not just the parents.
    for (const id of ['4.4.1', '5.1.2', '6.2.1', '7.1.5.2', '8.2.3', '8.3.4', '9.1.2'])
      expect(q).toContain(id)
    for (const top of ['4', '5', '6', '7', '8', '9', '10']) {
      expect(q.some((id) => id === `${top}.1` || id.startsWith(`${top}.`))).toBe(true)
    }
    expect(q.some((id) => /^[123]\./.test(id))).toBe(false)
  })

  it('has no duplicate references and no untitled entry', () => {
    expect(new Set(ids).size).toBe(ids.length)
    expect(CATALOG.every((c) => c.title.trim().length > 2)).toBe(true)
  })

  it('contains every requirement the tracked dataset uses, so nothing is a bare stub', () => {
    const missing = CL.map((c) => c.id).filter((id) => !ids.includes(id))
    expect(missing).toEqual([])
  })
})
