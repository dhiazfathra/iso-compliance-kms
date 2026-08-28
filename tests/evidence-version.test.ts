import { describe, expect, it } from 'bun:test'
import { prependRevision } from '../src/lib/evidence-version'

const at = new Date('2026-08-28T10:00:00.000Z')

describe('prependRevision', () => {
  it('starts at v1 when the record has no history', () => {
    expect(prependRevision(undefined, { note: 'first', authorId: 3, at })).toEqual([
      { version: 'v1', date: at.toISOString(), author: 3, note: 'first' },
    ])
  })

  it('numbers from the existing history and keeps it newest first', () => {
    const existing = [
      { version: 'v2', date: '2026-07-01T00:00:00.000Z' },
      { version: 'v1', date: '2026-06-01T00:00:00.000Z' },
    ]
    const next = prependRevision(existing, { note: 'third', authorId: 5, at })
    expect(next.map((r) => r.version)).toEqual(['v3', 'v2', 'v1'])
    expect(next[0].author).toBe(5)
  })

  it('falls back to a default note when none is given', () => {
    expect(prependRevision([], { note: '   ', authorId: 1, at })[0].note).toBe(
      'New version uploaded.',
    )
  })

  it('tolerates a record whose revisions field is not an array', () => {
    expect(prependRevision(null, { note: 'x', authorId: 1, at })).toHaveLength(1)
  })
})
