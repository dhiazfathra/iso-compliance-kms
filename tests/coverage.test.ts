import { describe, expect, it } from 'bun:test'
import { CATALOG } from '../src/seed/iso-catalog'
import { coverageFor } from '../src/seed/coverage'
import { CL } from '../src/seed/mockup-data'

const TODAY = new Date('2026-08-28T00:00:00.000Z')
const all = CATALOG.map((e, i) => coverageFor(e, i, TODAY))

describe('full-coverage artefacts', () => {
  it('gives every requirement a policy, a form and a dated record', () => {
    expect(all).toHaveLength(CATALOG.length)
    expect(all.every((c) => c.policy.status === 'Approved')).toBe(true)
    expect(all.every((c) => c.form.code.startsWith('FRM-'))).toBe(true)
    expect(all.every((c) => c.evidence.title.length > 0)).toBe(true)
  })

  it('keeps policy names, form codes and record titles unique', () => {
    for (const key of ['policy', 'form', 'evidence'] as const) {
      const values = all.map((c) =>
        key === 'policy' ? c.policy.name : key === 'form' ? c.form.code : c.evidence.title,
      )
      expect(new Set(values).size).toBe(values.length)
    }
  })

  it('never collides with a form code or policy name from the tracked dataset', () => {
    const codes = new Set(CL.flatMap((c) => c.p.flatMap((p) => p.f.map((f) => f.c))))
    const names = new Set(CL.flatMap((c) => c.p.map((p) => p.n)))
    expect(all.some((c) => codes.has(c.form.code) || names.has(c.policy.name))).toBe(false)
  })

  it('leaves nothing overdue: reviews and expiries sit in the future', () => {
    const t = TODAY.getTime()
    expect(all.every((c) => new Date(c.nextReview).getTime() > t)).toBe(true)
    expect(all.every((c) => new Date(c.evidence.expiryDate).getTime() > t)).toBe(true)
  })

  it('files records in the past, with approval before the record', () => {
    const t = TODAY.getTime()
    expect(all.every((c) => new Date(c.evidence.uploadedAt).getTime() < t)).toBe(true)
    const current = (c: (typeof all)[number]) => c.policy.revisions.at(-1)!
    expect(all.every((c) => current(c).status === 'Current')).toBe(true)
    expect(all.every((c) => new Date(current(c).date) <= new Date(c.evidence.uploadedAt))).toBe(
      true,
    )
  })

  it('assigns the fixed document owner and is deterministic', () => {
    expect(all.every((c) => c.owner === 'Dhiaz Fathra')).toBe(true)
    expect(coverageFor(CATALOG[7], 7, TODAY)).toEqual(all[7])
  })
})
