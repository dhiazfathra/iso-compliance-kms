'use client'

import { use } from 'react'
import { withEvidenceVersion } from '@/lib/local-edit'
import { writeFile } from '@/lib/opfs'
import { safeEntryName } from '@/lib/pack'
import { EvidenceDetailView } from '@/views/evidence-detail'
import type { ActionResult } from '@/views/types'
import { PackGate } from '../../pack-gate'
import { useLocalPack } from '../../provider'

export default function LocalEvidenceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { pack, save } = useLocalPack()

  const onUpload = async (data: FormData): Promise<ActionResult> => {
    if (!pack) return { ok: false, error: 'No pack is open.' }
    const recordId = Number(data.get('id'))
    const file = data.get('file')
    if (!(file instanceof File) || !file.size) return { ok: false, error: 'Choose a file first.' }

    try {
      const bytes = new Uint8Array(await file.arrayBuffer())
      // A record filed for the first time has no path in the pack yet; name it
      // the way the exporter would, so a re-export puts it where it belongs.
      const path =
        pack.evidenceFiles.get(recordId) ??
        `evidence/${safeEntryName(file.name, new Set(pack.evidenceFiles.values()), 'evidence')}`
      await writeFile(path, bytes)
      pack.files.set(path, bytes)
      pack.evidenceFiles.set(recordId, path)
      await save(
        withEvidenceVersion(pack.graph, recordId, {
          note: String(data.get('note') ?? ''),
          filesize: bytes.byteLength,
          at: new Date(),
        }),
      )
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) }
    }
  }

  return (
    <PackGate>
      {(open) => {
        const item = open.graph.evidence.find((e) => String(e.id) === id)
        if (!item) return <div className="block">No such record in this pack.</div>
        return (
          <EvidenceDetailView graph={open.graph} base="/local" item={item} onUpload={onUpload} />
        )
      }}
    </PackGate>
  )
}
