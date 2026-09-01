import { describe, expect, test } from 'bun:test'
import { buildSeedData, type SeedData } from '../src/seed/build'
import { CATALOG } from '../src/seed/iso-catalog'

const OPTIONS = {
  today: new Date('2026-06-01T00:00:00.000Z'),
  adminEmail: 'admin@example.test',
  auditorEmail: 'auditor@example.test',
  auditorSessionHours: 8,
}

const data: SeedData = buildSeedData(OPTIONS)

describe('buildSeedData', () => {
  test('is deterministic for a given day', () => {
    // The seeder rolls lapsed dates forward from `today` and spreads them with
    // a running counter, so a stable date must give a stable register.
    expect(JSON.stringify(buildSeedData(OPTIONS))).toBe(JSON.stringify(data))
  })

  test('every natural key a row points at exists', () => {
    const clauses = new Set(data.clauses.map((c) => c.clauseId))
    const policies = new Set(data.policies.map((p) => p.name))
    const forms = new Set(data.forms.map((f) => f.code))
    const users = new Set([...data.users, data.auditor].map((u) => u.name))

    for (const c of data.clauses) expect(users).toContain(c.owner)
    for (const p of data.policies) {
      expect(clauses).toContain(p.primaryClause)
      expect(users).toContain(p.owner)
      for (const id of p.clauses) expect(clauses).toContain(id)
      for (const r of p.revisions) expect(users).toContain(r.author)
    }
    for (const f of data.forms) {
      expect(policies).toContain(f.policy)
      expect(clauses).toContain(f.primaryClause)
      for (const id of f.alsoSatisfies) expect(clauses).toContain(id)
    }
    for (const e of data.evidence) {
      expect(forms).toContain(e.form)
      expect(users).toContain(e.uploader)
      for (const id of e.satisfies) expect(clauses).toContain(id)
      for (const r of e.revisions) expect(users).toContain(r.author)
    }
    expect(users).toContain(data.auditSession.auditor)
  })

  test('the keys rows are looked up by are unique', () => {
    const unique = (xs: string[]) => expect(new Set(xs).size).toBe(xs.length)
    unique(data.clauses.map((c) => c.clauseId))
    unique(data.policies.map((p) => p.name))
    unique(data.forms.map((f) => f.code))
  })

  test('the whole catalogue is in scope, and only it', () => {
    const byId = new Map(data.clauses.map((c) => [c.clauseId, c]))
    for (const entry of CATALOG) {
      // A catalogue requirement is either tracked under its bare number or
      // namespaced by standard when the number collides across the two.
      const clause = byId.get(entry.id) ?? byId.get(`${entry.standard} ${entry.id}`)
      expect(clause).toBeDefined()
      expect(clause!.criticality).toBe(1)
    }
    // Weight 0 is reserved for references outside the catalogue; they carry no
    // policy, form or evidence, which is what "gap" means on every screen.
    for (const c of data.clauses.filter((x) => x.criticality === 0)) {
      expect(c.status).toBe('gap')
      expect(data.policies.some((p) => p.primaryClause === c.clauseId)).toBe(false)
    }
  })

  test('every requirement in scope has the chain an auditor samples', () => {
    for (const c of data.clauses.filter((x) => x.criticality > 0)) {
      const policies = data.policies.filter((p) => p.primaryClause === c.clauseId)
      expect(policies.length).toBeGreaterThan(0)
      const forms = data.forms.filter((f) => policies.some((p) => p.name === f.policy))
      expect(forms.length).toBeGreaterThan(0)
      expect(data.evidence.some((e) => forms.some((f) => f.code === e.form))).toBe(true)
    }
  })

  test('no document or record is filed without text in it', () => {
    for (const p of data.policies) expect(p.body.trim().length).toBeGreaterThan(0)
    for (const e of data.evidence) expect(e.body.trim().length).toBeGreaterThan(0)
  })

  test('nothing in the register is already overdue on the day it is seeded', () => {
    const today = OPTIONS.today.toISOString().slice(0, 10)
    for (const c of data.clauses) if (c.nextReview) expect(c.nextReview > today).toBe(true)
    for (const e of data.evidence) if (e.expiryDate) expect(e.expiryDate > today).toBe(true)
  })
})
