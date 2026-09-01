import { describe, expect, test } from 'bun:test'
import { PACK_FORMAT_VERSION, packEntries, parsePack, type PackFile } from '../src/lib/pack'
import { buildSeedData } from '../src/seed/build'
import { seedGraph } from '../src/seed/graph'
import { evidenceEntryNames } from '../src/lib/pack'

const utf8 = new TextEncoder()

const { graph, files: bytes } = seedGraph(
  buildSeedData({
    today: new Date('2026-06-01T00:00:00.000Z'),
    adminEmail: 'admin@example.test',
    auditorEmail: 'auditor@example.test',
    auditorSessionHours: 8,
  }),
)

/** The pack as it lands on disk, evidence bytes included. */
function writtenPack(prefix = ''): PackFile[] {
  const at = new Date('2026-06-01T00:00:00.000Z')
  const out: PackFile[] = packEntries(graph, 'PACK-TEST', at).map((e) => ({
    path: prefix + e.path,
    bytes: typeof e.content === 'string' ? utf8.encode(e.content) : e.content,
  }))
  const names = evidenceEntryNames(graph)
  for (const item of graph.evidence) {
    out.push({
      path: `${prefix}evidence/${names.get(item.id)}`,
      bytes: bytes.get(item.id)!.bytes,
    })
  }
  return out
}

const ok = (input: PackFile[]) => {
  const result = parsePack(input)
  if (!result.ok) throw new Error(result.error)
  return result.pack
}

describe('parsePack', () => {
  test('reads back every row and every file the exporter wrote', () => {
    const pack = ok(writtenPack())
    expect(pack.packId).toBe('PACK-TEST')
    expect(pack.graph.clauses).toHaveLength(graph.clauses.length)
    expect(pack.graph.policies).toHaveLength(graph.policies.length)
    expect(pack.graph.evidence).toHaveLength(graph.evidence.length)

    // Every document and every record resolves to bytes that are actually here.
    expect(pack.policyFiles.size).toBe(graph.policies.length)
    expect(pack.evidenceFiles.size).toBe(graph.evidence.length)
    for (const path of [...pack.policyFiles.values(), ...pack.evidenceFiles.values()]) {
      expect(pack.files.get(path)!.length).toBeGreaterThan(0)
    }
  })

  test('the controlled text survives the round trip', () => {
    const pack = ok(writtenPack())
    const policy = pack.graph.policies[0]!
    const text = new TextDecoder().decode(pack.files.get(pack.policyFiles.get(policy.id)!)!)
    expect(text).toBe(policy.body!)
  })

  test('accepts the pack through a folder picker, which prefixes every path', () => {
    // `<input webkitdirectory>` reports `compliance-pack/graph.json`, not
    // `graph.json`; the same pack must read identically either way.
    const pack = ok(writtenPack('compliance-pack/'))
    expect(pack.graph.clauses).toHaveLength(graph.clauses.length)
    expect(pack.policyFiles.size).toBe(graph.policies.length)
  })

  test('refuses a folder that is not a pack', () => {
    const result = parsePack([{ path: 'notes.txt', bytes: utf8.encode('hello') }])
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain('graph.json')
  })

  test('refuses a pack written by a format it does not know', () => {
    const input = writtenPack()
    const manifest = JSON.parse(
      new TextDecoder().decode(input.find((f) => f.path === 'graph.json')!.bytes),
    )
    manifest.version = PACK_FORMAT_VERSION + 1
    const result = parsePack([
      ...input.filter((f) => f.path !== 'graph.json'),
      { path: 'graph.json', bytes: utf8.encode(JSON.stringify(manifest)) },
    ])
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain('version')
  })

  test('refuses a manifest whose paths escape the pack', () => {
    // A pack is something someone was sent. A path in it is a claim, not a
    // fact — writing `../../.ssh/id_rsa` to disk on the reader's machine is
    // exactly what must not happen.
    for (const nasty of ['../../.ssh/id_rsa', '/etc/passwd', 'C:\\Windows\\x', 'a/../../b']) {
      const input = writtenPack()
      const raw = input.find((f) => f.path === 'graph.json')!
      const manifest = JSON.parse(new TextDecoder().decode(raw.bytes))
      manifest.policyFiles[Object.keys(manifest.policyFiles)[0]!] = nasty
      const result = parsePack([
        ...input.filter((f) => f.path !== 'graph.json'),
        { path: 'graph.json', bytes: utf8.encode(JSON.stringify(manifest)) },
      ])
      expect(result.ok).toBe(false)
    }
  })

  test('refuses a manifest that names a file the pack does not carry', () => {
    const input = writtenPack()
    const raw = input.find((f) => f.path === 'graph.json')!
    const manifest = JSON.parse(new TextDecoder().decode(raw.bytes))
    manifest.evidenceFiles[Object.keys(manifest.evidenceFiles)[0]!] = 'evidence/not-here.pdf'
    const result = parsePack([
      ...input.filter((f) => f.path !== 'graph.json'),
      { path: 'graph.json', bytes: utf8.encode(JSON.stringify(manifest)) },
    ])
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain('does not contain')
  })

  test('refuses a truncated manifest rather than half-reading it', () => {
    const input = writtenPack()
    const result = parsePack([
      ...input.filter((f) => f.path !== 'graph.json'),
      { path: 'graph.json', bytes: utf8.encode('{"version": 1, "gra') },
    ])
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toContain('readable JSON')
  })
})
