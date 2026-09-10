/**
 * Minimal stored (uncompressed) ZIP writer.
 *
 * The seed needs genuinely valid OOXML files — Payload sniffs uploaded bytes
 * and rejects a stub with the wrong content — and an Office file is a ZIP.
 * A dozen lines of ZIP writing beats pulling in an archiver dependency for
 * three files that only ever exist in seed data.
 */
import { concat, fromUtf8, writeU16LE, writeU32LE, type Bytes } from './bytes'

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[i] = c >>> 0
  }
  return table
})()

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff]! ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

/** Text for generated files, raw bytes for evidence copied into an audit pack. */
export type ZipEntry = { path: string; content: string | Uint8Array }

export function zip(entries: ZipEntry[]): Bytes {
  const locals: Uint8Array[] = []
  const centrals: Uint8Array[] = []
  let offset = 0

  for (const e of entries) {
    const name = fromUtf8(e.path)
    const data = typeof e.content === 'string' ? fromUtf8(e.content) : e.content
    const crc = crc32(data)

    const local = new Uint8Array(30 + name.length)
    writeU32LE(local, 0x04034b50, 0)
    writeU16LE(local, 20, 4) // version needed
    writeU16LE(local, 0, 6) // flags
    writeU16LE(local, 0, 8) // stored
    writeU16LE(local, 0, 10) // time
    writeU16LE(local, 0x21, 12) // date (1980-01-01)
    writeU32LE(local, crc, 14)
    writeU32LE(local, data.length, 18)
    writeU32LE(local, data.length, 22)
    writeU16LE(local, name.length, 26)
    writeU16LE(local, 0, 28)
    local.set(name, 30)
    locals.push(local, data)

    const central = new Uint8Array(46 + name.length)
    writeU32LE(central, 0x02014b50, 0)
    writeU16LE(central, 20, 4)
    writeU16LE(central, 20, 6)
    writeU16LE(central, 0, 8)
    writeU16LE(central, 0, 10)
    writeU16LE(central, 0, 12)
    writeU16LE(central, 0x21, 14)
    writeU32LE(central, crc, 16)
    writeU32LE(central, data.length, 20)
    writeU32LE(central, data.length, 24)
    writeU16LE(central, name.length, 28)
    writeU32LE(central, offset, 42)
    central.set(name, 46)
    centrals.push(central)

    offset += local.length + data.length
  }

  const centralBuf = concat(centrals)
  const end = new Uint8Array(22)
  writeU32LE(end, 0x06054b50, 0)
  writeU16LE(end, entries.length, 8)
  writeU16LE(end, entries.length, 10)
  writeU32LE(end, centralBuf.length, 12)
  writeU32LE(end, offset, 16)

  return concat([...locals, centralBuf, end])
}

/** One entry read back out of an archive. */
export type ZipRead = { path: string; bytes: Uint8Array }

const readU16 = (b: Uint8Array, at: number) => b[at]! | (b[at + 1]! << 8)
const readU32 = (b: Uint8Array, at: number) =>
  (b[at]! | (b[at + 1]! << 8) | (b[at + 2]! << 16) | (b[at + 3]! << 24)) >>> 0

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  // `DecompressionStream` is the platform's own inflate — present in every
  // current browser and in Node — so an archiver dependency buys nothing here.
  const stream = new Blob([data as BlobPart])
    .stream()
    .pipeThrough(new DecompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

/**
 * Reads an archive back, via its central directory.
 *
 * The directory is the authority on what an archive contains: reading forward
 * through local headers instead would follow sizes that a crafted archive can
 * disagree with. Only the two methods this application writes and that Office
 * files use are supported — stored and deflate.
 */
export async function unzip(archive: Uint8Array): Promise<ZipRead[]> {
  // The end-of-central-directory record is last, after a comment of unknown
  // length, so it is found by scanning back for its signature.
  let end = -1
  for (let i = archive.length - 22; i >= 0; i--) {
    if (readU32(archive, i) === 0x06054b50) {
      end = i
      break
    }
  }
  if (end < 0) throw new Error('Not a ZIP archive: no end-of-central-directory record.')

  const count = readU16(archive, end + 10)
  let at = readU32(archive, end + 16)
  const out: ZipRead[] = []

  for (let n = 0; n < count; n++) {
    if (readU32(archive, at) !== 0x02014b50)
      throw new Error('This ZIP archive’s directory is damaged.')
    const method = readU16(archive, at + 10)
    const compressedSize = readU32(archive, at + 20)
    const nameLength = readU16(archive, at + 28)
    const extraLength = readU16(archive, at + 30)
    const commentLength = readU16(archive, at + 32)
    const localAt = readU32(archive, at + 42)
    // ZIP names are defined to use `/`. Some Windows tools write `\\` anyway,
    // and the pack parser rejects a backslash outright as a traversal risk, so
    // the separator is normalised here where the archive is decoded rather than
    // loosening the check that guards the manifest.
    const path = new TextDecoder()
      .decode(archive.subarray(at + 46, at + 46 + nameLength))
      .replace(/\\/g, '/')
    at += 46 + nameLength + extraLength + commentLength

    // The local header repeats the name and extra fields, and its extra field
    // length may differ from the directory's, so it is read again here.
    const localNameLength = readU16(archive, localAt + 26)
    const localExtraLength = readU16(archive, localAt + 28)
    const from = localAt + 30 + localNameLength + localExtraLength
    const raw = archive.subarray(from, from + compressedSize)

    // A directory entry, not a file.
    if (path.endsWith('/')) continue
    if (method === 0) out.push({ path, bytes: raw })
    else if (method === 8) out.push({ path, bytes: await inflateRaw(raw) })
    else throw new Error(`${path} uses an unsupported compression method (${method}).`)
  }

  return out
}
