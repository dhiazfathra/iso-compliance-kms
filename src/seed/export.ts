/**
 * Writes the seeded register to a folder on disk.
 *
 * The result is the same pack the audit-pack export produces — `index.html`,
 * the CSV tables, `MANIFEST.txt`, `graph.json`, the controlled text under
 * `policies/` and the evidence files under `evidence/` — but unzipped, so the
 * documents can be read, edited and version-controlled as ordinary files, and
 * handed to local mode as a folder.
 *
 * Run: `bun run export:pack [--out ./compliance-pack]`
 */
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve, sep } from 'node:path'
import { buildSeedData } from './build'
import { seedGraph } from './graph'
import { evidenceEntryNames, packEntries } from '../lib/pack'

const arg = (name: string, fallback: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1]! : fallback
}

const run = async () => {
  const out = resolve(arg('out', './compliance-pack'))
  const at = new Date()
  const packId = `PACK-LOCAL-${at.toISOString().slice(0, 10)}`

  const data = buildSeedData({
    adminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@dermaster.local',
    auditorEmail: process.env.SEED_AUDITOR_EMAIL || 'k.halim@external.audit',
    auditorSessionHours: Number(process.env.SEED_AUDITOR_SESSION_HOURS || 8),
    today: at,
  })
  const { graph, files } = seedGraph(data)

  const entries = packEntries(graph, packId, at)
  const evidenceNames = evidenceEntryNames(graph)
  for (const item of graph.evidence) {
    const file = files.get(item.id)
    if (!file) throw new Error(`No bytes were generated for ${item.title}.`)
    entries.push({ path: `evidence/${evidenceNames.get(item.id)}`, content: file.bytes })
  }

  // Rewritten from scratch each run, so a document deleted from the seed does
  // not linger in the folder and get re-imported.
  await rm(out, { recursive: true, force: true })
  for (const entry of entries) {
    // `packEntries` and `evidenceEntryNames` already sanitise every segment;
    // this refuses to write anything that got past them regardless.
    const target = resolve(out, entry.path)
    if (target !== out && !target.startsWith(out + sep))
      throw new Error(`Refusing to write outside the pack: ${entry.path}`)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, entry.content)
  }

  const bytes = entries.reduce(
    (n, e) => n + (typeof e.content === 'string' ? Buffer.byteLength(e.content) : e.content.length),
    0,
  )
  console.log(
    `Wrote ${entries.length} files (${(bytes / 1e6).toFixed(1)} MB) to ${join(out, '')}\n` +
      `  ${graph.clauses.length} requirements · ${graph.policies.length} documents · ` +
      `${graph.evidence.length} records`,
  )
}

await run()
