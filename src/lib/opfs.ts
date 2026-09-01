/**
 * Where local mode keeps the pack: the browser's origin-private file system.
 *
 * OPFS is a real filesystem the page owns and no server can see, which is the
 * whole point of local mode — the register never leaves the machine. It also
 * survives a reload, which `sessionStorage` would not and which a compliance
 * repository plainly needs.
 *
 * Deliberately thin: paths in, bytes out, no decisions. Everything that could
 * be wrong about a pack is decided in `pack.ts`, which is pure and tested.
 * There is nothing here worth a test that a browser would not have to run.
 */
import type { Graph } from './data'
import { parsePack, type PackFile, type ParsedPack } from './pack'

const ROOT = 'compliance-pack'
const MANIFEST = 'graph.json'

export const opfsAvailable = () =>
  typeof navigator !== 'undefined' && !!navigator.storage?.getDirectory

async function root(): Promise<FileSystemDirectoryHandle> {
  const opfs = await navigator.storage.getDirectory()
  return opfs.getDirectoryHandle(ROOT, { create: true })
}

/** Walks `a/b/c.txt` to the handle for `c.txt`, creating directories on write. */
async function fileHandle(
  path: string,
  create: boolean,
): Promise<FileSystemFileHandle | undefined> {
  const parts = path.split('/')
  const name = parts.pop()!
  let dir = await root()
  for (const part of parts) {
    try {
      dir = await dir.getDirectoryHandle(part, { create })
    } catch {
      return undefined
    }
  }
  try {
    return await dir.getFileHandle(name, { create })
  } catch {
    return undefined
  }
}

export async function writeFile(path: string, bytes: Uint8Array | string): Promise<void> {
  const handle = await fileHandle(path, true)
  if (!handle) throw new Error(`Could not write ${path} to local storage.`)
  const writable = await handle.createWritable()
  await writable.write(typeof bytes === 'string' ? bytes : (bytes as BlobPart))
  await writable.close()
}

export async function readFile(path: string): Promise<Uint8Array | undefined> {
  const handle = await fileHandle(path, false)
  if (!handle) return undefined
  return new Uint8Array(await (await handle.getFile()).arrayBuffer())
}

/** Every file in the stored pack, as `parsePack` wants them. */
async function readAll(dir: FileSystemDirectoryHandle, prefix = ''): Promise<PackFile[]> {
  const out: PackFile[] = []
  for await (const [name, handle] of dir as unknown as AsyncIterable<[string, FileSystemHandle]>) {
    const path = prefix ? `${prefix}/${name}` : name
    if (handle.kind === 'directory') {
      out.push(...(await readAll(handle as FileSystemDirectoryHandle, path)))
    } else {
      const file = await (handle as FileSystemFileHandle).getFile()
      out.push({ path, bytes: new Uint8Array(await file.arrayBuffer()) })
    }
  }
  return out
}

/** The stored pack, or `undefined` when nothing has been imported yet. */
export async function loadStoredPack(): Promise<ParsedPack | undefined> {
  if (!opfsAvailable()) return undefined
  if (!(await fileHandle(MANIFEST, false))) return undefined
  const result = parsePack(await readAll(await root()))
  if (!result.ok) throw new Error(result.error)
  return result.pack
}

/** Replaces whatever is stored with this pack. */
export async function storePack(files: PackFile[]): Promise<void> {
  await clear()
  for (const f of files) await writeFile(f.path, f.bytes)
}

/**
 * Saves the register after an edit. Only `graph.json` is rewritten: the
 * documents and records themselves are untouched unless they were the thing
 * that changed, and those write their own file.
 */
export async function saveGraph(pack: ParsedPack, graph: Graph): Promise<void> {
  await writeFile(
    MANIFEST,
    JSON.stringify(
      {
        version: 1,
        packId: pack.packId,
        generatedAt: pack.generatedAt,
        graph,
        policyFiles: Object.fromEntries(pack.policyFiles),
        evidenceFiles: Object.fromEntries(pack.evidenceFiles),
      },
      null,
      2,
    ),
  )
}

export async function clear(): Promise<void> {
  const opfs = await navigator.storage.getDirectory()
  await opfs.removeEntry(ROOT, { recursive: true }).catch(() => {})
}
