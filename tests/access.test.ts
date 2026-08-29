import { describe, expect, it } from 'bun:test'
import {
  adminOnly,
  adminOnlyField,
  safeNext,
  canWrite,
  complianceAccess,
  hasLevel,
  signedIn,
  userAccess,
} from '../src/lib/access'

const req = (access?: string | null, id?: number) =>
  ({ req: { user: access === undefined ? null : { id: id ?? 1, access } } }) as never

describe('hasLevel', () => {
  it('rejects anonymous requests at every level', () => {
    for (const min of ['read', 'write', 'admin'] as const) {
      expect(hasLevel(null, min)).toBe(false)
      expect(hasLevel(undefined, min)).toBe(false)
      expect(hasLevel({ access: null }, min)).toBe(false)
    }
  })

  it('rejects an unrecognised role', () => {
    expect(hasLevel({ access: 'superuser' }, 'read')).toBe(false)
  })

  it('ranks read < write < admin', () => {
    expect(hasLevel({ access: 'read' }, 'read')).toBe(true)
    expect(hasLevel({ access: 'read' }, 'write')).toBe(false)
    expect(hasLevel({ access: 'write' }, 'read')).toBe(true)
    expect(hasLevel({ access: 'write' }, 'write')).toBe(true)
    expect(hasLevel({ access: 'write' }, 'admin')).toBe(false)
    expect(hasLevel({ access: 'admin' }, 'admin')).toBe(true)
  })
})

describe('collection access rules', () => {
  it('lets any signed-in role read and nobody anonymous', async () => {
    expect(await signedIn(req('read'))).toBe(true)
    expect(await signedIn(req())).toBe(false)
  })

  it('gates writes on write, deletes on admin', () => {
    expect(canWrite(req('read'))).toBe(false)
    expect(canWrite(req('write'))).toBe(true)
    expect(adminOnly(req('write'))).toBe(false)
    expect(adminOnly(req('admin'))).toBe(true)
  })

  it('gives a read-only auditor no mutation of compliance data', async () => {
    expect(await complianceAccess.read(req('read'))).toBe(true)
    expect(complianceAccess.create(req('read'))).toBe(false)
    expect(complianceAccess.update(req('read'))).toBe(false)
    expect(complianceAccess.delete(req('read'))).toBe(false)
  })

  it('lets a user update only their own record unless admin', () => {
    expect(userAccess.update({ ...(req('write', 7) as object), id: 7 } as never)).toBe(true)
    expect(userAccess.update({ ...(req('write', 7) as object), id: 8 } as never)).toBe(false)
    expect(userAccess.update({ ...(req('admin', 7) as object), id: 8 } as never)).toBe(true)
    expect(userAccess.update({ ...(req(undefined, 7) as object), id: 7 } as never)).toBe(false)
  })

  it('lets only an admin create or delete users', () => {
    expect(userAccess.create(req('write'))).toBe(false)
    expect(userAccess.create(req('admin'))).toBe(true)
    expect(userAccess.delete(req('admin'))).toBe(true)
  })
})

describe('adminOnlyField', () => {
  it('keeps a user from raising their own access level', () => {
    // The collection lets a user update their own record; this is what stops
    // that from meaning "may make myself an admin".
    expect(adminOnlyField(req('read', 7) as never)).toBe(false)
    expect(adminOnlyField(req('write', 7) as never)).toBe(false)
    expect(adminOnlyField(req('admin', 7) as never)).toBe(true)
    expect(adminOnlyField(req(undefined, 7) as never)).toBe(false)
  })
})

describe('safeNext', () => {
  it('keeps a same-site path', () => {
    expect(safeNext('/evidence/12')).toBe('/evidence/12')
    expect(safeNext('/clauses?std=27001')).toBe('/clauses?std=27001')
  })

  it('refuses to send anyone off this origin', () => {
    expect(safeNext('https://attacker.example')).toBe('/')
    expect(safeNext('//attacker.example')).toBe('/')
    expect(safeNext('/\\attacker.example')).toBe('/')
    expect(safeNext('javascript:alert(1)')).toBe('/')
    expect(safeNext(undefined)).toBe('/')
    expect(safeNext('')).toBe('/')
  })
})
