'use client'

/**
 * Getting a pack in, and back out again.
 *
 * A pack arrives one of two ways: the folder `bun run export:pack` wrote,
 * picked whole, or the same tree as a zip. Both end as a list of
 * `{ path, bytes }` and go through the one parser, so a folder and a zip
 * cannot disagree about what is valid.
 */
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { parsePack, type PackFile } from '@/lib/pack'
import { clear, storePack } from '@/lib/opfs'
import { unzip } from '@/lib/zip'
import { packZip, saveBlob } from '../export-pack'
import { useLocalPack } from '../provider'

const bytesOf = async (file: File) => new Uint8Array(await file.arrayBuffer())

/** Folder pickers report `compliance-pack/graph.json`; a zip may too. */
async function readSelection(files: FileList): Promise<PackFile[]> {
  const picked = [...files]
  const single = picked.length === 1 && /\.zip$/i.test(picked[0]!.name)
  if (single) return (await unzip(await bytesOf(picked[0]!))).map((e) => ({ ...e }))
  return Promise.all(
    picked.map(async (f) => ({
      // `webkitRelativePath` is the path inside the chosen folder; plain file
      // pickers leave it empty.
      path: (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name,
      bytes: await bytesOf(f),
    })),
  )
}

export default function ImportPage() {
  const { pack, reload } = useLocalPack()
  const router = useRouter()
  const folder = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()

  const take = async (files: FileList | null) => {
    if (!files?.length) return
    setError(undefined)
    setBusy('Reading the pack…')
    try {
      const input = await readSelection(files)
      const result = parsePack(input)
      if (!result.ok) throw new Error(result.error)
      setBusy('Storing it in this browser…')
      await storePack(input)
      await reload()
      router.push('/local')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(undefined)
    }
  }

  const exportZip = async () => {
    if (!pack) return
    setBusy('Building the archive…')
    try {
      saveBlob(await packZip(pack), `${pack.packId}.zip`)
    } finally {
      setBusy(undefined)
    }
  }

  const wipe = async () => {
    if (!confirm('Delete the pack from this browser? Anything edited here is lost.')) return
    await clear()
    await reload()
  }

  return (
    <div className="block" style={{ maxWidth: 720 }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="eyebrow">Local mode</div>
        <div style={{ font: '500 27px/1.18 Inter, sans-serif', letterSpacing: '-0.02em' }}>
          {pack ? 'Replace the pack in this browser' : 'Open a compliance pack'}
        </div>
        <p style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.6 }}>
          Pick the <span className="mono">compliance-pack</span> folder, or the zip of it. It is
          read in this tab and stored in this browser&rsquo;s private file system. Nothing is
          uploaded, and no account is involved.
        </p>
      </section>

      <section style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          ref={folder}
          type="file"
          multiple
          // Not in the React DOM types; it is what makes the picker take a folder.
          {...({ webkitdirectory: '', directory: '' } as Record<string, string>)}
          style={{ display: 'none' }}
          onChange={(e) => take(e.target.files)}
        />
        <button type="button" className="btn" onClick={() => folder.current?.click()}>
          Choose pack folder
        </button>
        <label className="btn btn-ghost" style={{ cursor: 'pointer' }}>
          Choose pack zip
          <input
            type="file"
            accept=".zip,application/zip"
            style={{ display: 'none' }}
            onChange={(e) => take(e.target.files)}
          />
        </label>
        {busy && (
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>
            {busy}
          </span>
        )}
        {error && (
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--warn)' }}>
            {error}
          </span>
        )}
      </section>

      {pack && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="section-head">
            <span className="eyebrow">Pack in this browser</span>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
              {pack.packId} · generated {pack.generatedAt.slice(0, 10)}
            </span>
          </div>
          <div className="mono" style={{ fontSize: 11.5, color: 'var(--secondary)' }}>
            {pack.graph.clauses.length} requirements · {pack.graph.policies.length} documents ·{' '}
            {pack.graph.evidence.length} records
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn" onClick={exportZip}>
              Export as zip
            </button>
            <button type="button" className="btn btn-ghost" onClick={wipe}>
              Delete local pack
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
