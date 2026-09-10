/**
 * Getting a pack into local mode.
 *
 * Both routes in — the folder picker and the zip — end at the same parser, so
 * the failures worth guarding are the ones that happen before it: an archive a
 * Windows tool wrote with backslashes, the junk a folder picker hands over, and
 * a pack that carries a second `graph.json` inside its own evidence.
 */
import { describe, expect, test } from 'bun:test'
import { packPrefix, parsePack, type PackFile } from '../src/lib/pack'
import { unzip, zip } from '../src/lib/zip'
import { readSelection } from '../src/app/local/import/page'

const enc = (s: string) => new TextEncoder().encode(s)

const MANIFEST = {
  version: 1,
  packId: 'PACK-2026-01',
  generatedAt: '2026-01-04T00:00:00.000Z',
  graph: { clauses: [], policies: [], evidence: [] },
  policyFiles: {},
  evidenceFiles: { 1: 'evidence/calibration-2026.pdf' },
}

const PACK: PackFile[] = [
  { path: 'compliance-pack/graph.json', bytes: enc(JSON.stringify(MANIFEST)) },
  { path: 'compliance-pack/evidence/calibration-2026.pdf', bytes: enc('%PDF-1.4') },
  { path: 'compliance-pack/index.html', bytes: enc('<!doctype html>') },
]

/** A `FileList` is not constructible outside a browser; an array is enough. */
const fileList = (files: File[]) => files as unknown as FileList

const asFolderPick = (files: PackFile[]) =>
  fileList(
    files.map((f) => {
      const file = new File([f.bytes as BlobPart], f.path.split('/').pop()!)
      Object.defineProperty(file, 'webkitRelativePath', { value: f.path })
      return file
    }),
  )

describe('reading a picked pack', () => {
  test('takes a folder the picker reported, dropping the operating system junk', async () => {
    const picked = await readSelection(
      asFolderPick([
        ...PACK,
        { path: 'compliance-pack/.DS_Store', bytes: enc('junk') },
        { path: 'compliance-pack/evidence/.DS_Store', bytes: enc('junk') },
      ]),
    )
    expect(picked.map((f) => f.path).sort()).toEqual(PACK.map((f) => f.path).sort())
    expect(parsePack(picked).ok).toBe(true)
  })

  test('takes a zip, whether it is picked alone or is the one file in a folder', async () => {
    const archive = zip(PACK.map((f) => ({ path: f.path, content: f.bytes })))
    const asZip = new File([archive as BlobPart], 'compliance-pack.zip')
    const alone = await readSelection(fileList([asZip]))
    expect(parsePack(alone).ok).toBe(true)

    const junk = new File([enc('junk') as BlobPart], '.DS_Store')
    const inFolder = await readSelection(fileList([junk, asZip]))
    expect(inFolder.map((f) => f.path).sort()).toEqual(alone.map((f) => f.path).sort())
  })

  test('leaves the archive out of a folder that holds other files too', async () => {
    const archive = new File([zip([{ path: 'a.txt', content: 'a' }]) as BlobPart], 'old.zip')
    const picked = await readSelection(asFolderPick(PACK))
    expect(picked).toHaveLength(3)
    const mixed = await readSelection(fileList([...asFolderPick(PACK), archive]))
    expect(mixed.map((f) => f.path)).toContain('old.zip')
  })
})

describe('an archive another tool wrote', () => {
  test('reads a zip whose names use backslashes, which the parser would refuse', async () => {
    const archive = zip(PACK.map((f) => ({ path: f.path.replace(/\//g, '\\'), content: f.bytes })))
    const entries = await unzip(archive)
    expect(entries.every((e) => !e.path.includes('\\'))).toBe(true)
    expect(parsePack(entries).ok).toBe(true)
  })

  test('roots the pack at the shallowest manifest, not at one inside its evidence', () => {
    const nested: PackFile[] = [
      { path: 'compliance-pack/evidence/last-pack/graph.json', bytes: enc('{}') },
      ...PACK,
    ]
    expect(packPrefix(nested)).toBe('compliance-pack/')
    expect(parsePack(nested).ok).toBe(true)
  })
})
