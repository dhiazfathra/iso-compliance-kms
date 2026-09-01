/**
 * The few `Buffer` operations the ZIP and PDF writers need, over plain
 * `Uint8Array`.
 *
 * `Buffer` is a Node global. Local mode runs the same writers in the browser,
 * where it does not exist, so the writers work in the type every runtime
 * already has. `Buffer` is a `Uint8Array` subclass, so callers that hand the
 * result to `Response`, Vercel Blob or a Payload upload are unaffected.
 */

/**
 * Bytes backed by a plain `ArrayBuffer`. `Uint8Array` on its own also admits a
 * `SharedArrayBuffer`, which `Blob` and the upload APIs refuse.
 */
export type Bytes = Uint8Array<ArrayBuffer>

const utf8 = new TextEncoder()

export const fromUtf8 = (s: string): Bytes => utf8.encode(s)

/**
 * Latin-1 is one byte per code point, so anything above U+00FF cannot be
 * represented. Callers sanitise their text first (`pdfString`); the mask here
 * matches what `Buffer.from(s, 'latin1')` does with whatever slips through.
 */
export function fromLatin1(s: string): Bytes {
  const out = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i) & 0xff
  return out
}

/** One byte per code point, so the length in bytes is the length in characters. */
export const latin1Length = (s: string): number => s.length

export function concat(parts: Uint8Array[]): Bytes {
  const total = parts.reduce((n, p) => n + p.length, 0)
  const out = new Uint8Array(total)
  let at = 0
  for (const p of parts) {
    out.set(p, at)
    at += p.length
  }
  return out
}

export const writeU16LE = (buf: Uint8Array, value: number, at: number): void => {
  buf[at] = value & 0xff
  buf[at + 1] = (value >>> 8) & 0xff
}

export const writeU32LE = (buf: Uint8Array, value: number, at: number): void => {
  buf[at] = value & 0xff
  buf[at + 1] = (value >>> 8) & 0xff
  buf[at + 2] = (value >>> 16) & 0xff
  buf[at + 3] = (value >>> 24) & 0xff
}
