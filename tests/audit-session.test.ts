import { describe, expect, it } from 'bun:test'
import { sessionIsLive } from '../src/lib/auth'
import { auditSessionOpen } from '../src/lib/access'

const at = (iso: string) => new Date(iso)
const session = (over: Record<string, unknown> = {}) =>
  ({
    id: 1,
    sessionId: 'SESSION-0094',
    label: 'External · K. Halim',
    auditor: 2,
    startedAt: '2026-08-28T08:00:00.000Z',
    expiresAt: '2026-08-28T16:00:00.000Z',
    revoked: false,
    downloads: 0,
    ...over,
  }) as never

describe('sessionIsLive', () => {
  it('is live inside the window', () => {
    expect(sessionIsLive(session(), at('2026-08-28T12:00:00.000Z'))).toBe(true)
  })

  it('is dead at and after the expiry instant', () => {
    expect(sessionIsLive(session(), at('2026-08-28T16:00:00.000Z'))).toBe(false)
    expect(sessionIsLive(session(), at('2026-08-28T16:00:01.000Z'))).toBe(false)
  })

  it('is dead once revoked, however much time is left', () => {
    expect(sessionIsLive(session({ revoked: true }), at('2026-08-28T09:00:00.000Z'))).toBe(false)
  })
})

describe('auditSessionOpen', () => {
  const payload = (docs: unknown[]) => ({ find: async () => ({ docs }) })

  it('does not query for staff users', async () => {
    let queried = false
    const req = {
      user: { id: 1, access: 'write' },
      payload: {
        find: async () => {
          queried = true
          return { docs: [] }
        },
      },
    }
    expect(await auditSessionOpen(req as never)).toBe(true)
    expect(queried).toBe(false)
  })

  it('lets a read-only user with no session through', async () => {
    const req = { user: { id: 8, access: 'read' }, payload: payload([]) }
    expect(await auditSessionOpen(req as never)).toBe(true)
  })

  it('refuses an expired or revoked session', async () => {
    const expired = {
      user: { id: 8, access: 'read' },
      payload: payload([{ expiresAt: '2020-01-01T00:00:00.000Z' }]),
    }
    expect(await auditSessionOpen(expired as never)).toBe(false)
    const revoked = {
      user: { id: 8, access: 'read' },
      payload: payload([{ expiresAt: '2999-01-01T00:00:00.000Z', revoked: true }]),
    }
    expect(await auditSessionOpen(revoked as never)).toBe(false)
  })

  it('allows a live session', async () => {
    const req = {
      user: { id: 8, access: 'read' },
      payload: payload([{ expiresAt: '2999-01-01T00:00:00.000Z' }]),
    }
    expect(await auditSessionOpen(req as never)).toBe(true)
  })
})
