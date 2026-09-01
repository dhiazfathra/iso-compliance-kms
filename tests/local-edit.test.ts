import { describe, expect, test } from 'bun:test'
import { withEvidenceVersion, withPolicyBody } from '../src/lib/local-edit'
import { buildSeedData } from '../src/seed/build'
import { seedGraph } from '../src/seed/graph'

const { graph } = seedGraph(
  buildSeedData({
    today: new Date('2026-06-01T00:00:00.000Z'),
    adminEmail: 'admin@example.test',
    auditorEmail: 'auditor@example.test',
    auditorSessionHours: 8,
  }),
)
const at = new Date('2026-06-02T09:00:00.000Z')

describe('withPolicyBody', () => {
  test('rewrites the text everywhere the document appears', () => {
    const policy = graph.policies[0]!
    const next = withPolicyBody(graph, policy.id, '# Rewritten', at)

    expect(next.policies.find((p) => p.id === policy.id)!.body).toBe('# Rewritten')
    // The clause tree carries its own copy; a screen reached from there must
    // not still show the old text.
    for (const c of next.clauses) {
      for (const p of c.policies) {
        if (p.id === policy.id) expect(p.body).toBe('# Rewritten')
      }
    }
    expect(graph.policies.find((p) => p.id === policy.id)!.body).not.toBe('# Rewritten')
  })

  test('files the edit in the audit trail', () => {
    const policy = graph.policies[0]!
    const next = withPolicyBody(graph, policy.id, 'text', at)
    expect(next.activity[0]).toMatchObject({
      actor: 'Local pack',
      action: 'Edited document text',
      ref: policy.name,
    })
    expect(next.activity).toHaveLength(graph.activity.length + 1)
    expect(new Set(next.activity.map((a) => a.id)).size).toBe(next.activity.length)
  })

  test('refuses an id the pack does not carry', () => {
    expect(() => withPolicyBody(graph, -1, 'text', at)).toThrow('No document')
  })
})

describe('withEvidenceVersion', () => {
  test('prepends the version to every copy of the record', () => {
    const item = graph.evidence[0]!
    const before = item.revisions.length
    const next = withEvidenceVersion(graph, item.id, { note: 'Re-signed', filesize: 42, at })

    const updated = next.evidence.find((e) => e.id === item.id)!
    expect(updated.revisions).toHaveLength(before + 1)
    expect(updated.revisions[0]).toMatchObject({
      version: `v${before + 1}`,
      author: 'Local pack',
      note: 'Re-signed',
    })
    expect(updated.filesize).toBe(42)

    const nested = next.forms.flatMap((f) => f.evidence).find((e) => e.id === item.id)!
    expect(nested.revisions).toHaveLength(before + 1)
  })

  test('an empty note still says something', () => {
    const item = graph.evidence[0]!
    const next = withEvidenceVersion(graph, item.id, { note: '   ', filesize: 1, at })
    expect(next.evidence.find((e) => e.id === item.id)!.revisions[0]!.note).toBe(
      'New version uploaded.',
    )
  })

  test('refuses an id the pack does not carry', () => {
    expect(() => withEvidenceVersion(graph, -1, { note: '', filesize: 1, at })).toThrow('No record')
  })
})
