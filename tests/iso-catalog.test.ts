import { describe, expect, it } from 'bun:test'
import { CATALOG } from '../src/seed/iso-catalog'
import { CL } from '../src/seed/mockup-data'

const ids = CATALOG.map((c) => c.id)

describe('the requirement catalogue', () => {
  it('carries all 93 Annex A controls, in their four themes', () => {
    const annex = CATALOG.filter((c) => c.id.startsWith('A.'))
    expect(annex).toHaveLength(93)
    const perTheme = (n: string) => annex.filter((c) => c.id.startsWith(`A.${n}.`)).length
    expect([perTheme('5'), perTheme('6'), perTheme('7'), perTheme('8')]).toEqual([37, 8, 14, 34])
  })

  it('marks Annex A as 27001 and the numbered clauses as 9001', () => {
    expect(CATALOG.every((c) => (c.id.startsWith('A.') ? c.standard === '27001' : true))).toBe(true)
    expect(CATALOG.filter((c) => !c.id.startsWith('A.')).every((c) => c.standard === '9001')).toBe(
      true,
    )
  })

  it('covers ISO 9001 clauses 4 to 10 and nothing below 4', () => {
    const q = CATALOG.filter((c) => c.standard === '9001').map((c) => c.id)
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
