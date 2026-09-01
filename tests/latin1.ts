/**
 * The ZIP and PDF writers return `Uint8Array` so the same code runs in the
 * browser (local mode). Tests still want to read the bytes as the Latin-1 text
 * the PDF format is written in, which is what Node's Buffer is for.
 */
export const latin1 = (bytes: Uint8Array): string => Buffer.from(bytes).toString('latin1')
