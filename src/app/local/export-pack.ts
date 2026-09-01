/**
 * Writing the pack back out.
 *
 * Both ways out of local mode — "export as zip" on the import screen and
 * "generate audit pack" — produce the same archive from the same entries, so
 * whatever leaves this browser can be re-imported or handed to the hosted app
 * without a second format to keep in step.
 */
import { packEntries, type ParsedPack } from '@/lib/pack'
import { readFile } from '@/lib/opfs'
import { zip, type ZipEntry } from '@/lib/zip'

export async function packZip(pack: ParsedPack, at = new Date()): Promise<Blob> {
  const entries: ZipEntry[] = packEntries(pack.graph, pack.packId, at)
  for (const [, path] of pack.evidenceFiles) {
    const stored = pack.files.get(path) ?? (await readFile(path))
    if (stored) entries.push({ path, content: stored })
  }
  return new Blob([zip(entries) as BlobPart], { type: 'application/zip' })
}

export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
