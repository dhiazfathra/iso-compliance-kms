'use client'

import { Suspense, use } from 'react'
import { useSearchParams } from 'next/navigation'
import { Deliver } from '../../../deliver'
import { PackGate } from '../../../pack-gate'

const MIME: Record<string, string> = {
  PDF: 'application/pdf',
  MD: 'text/plain',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

function EvidenceDownload({ id }: { id: string }) {
  const inline = useSearchParams().get('inline') === '1'

  return (
    <PackGate>
      {(pack) => {
        const item = pack.graph.evidence.find((e) => String(e.id) === id)
        if (!item) return <div className="block">No such record in this pack.</div>
        const path = pack.evidenceFiles.get(item.id)
        const bytes = path ? pack.files.get(path) : undefined
        if (!bytes) return <div className="block">This record has no file in the pack.</div>

        return (
          <Deliver
            bytes={bytes}
            filename={path?.split('/').pop() ?? `${item.title}`}
            type={MIME[item.fileType ?? ''] ?? 'application/octet-stream'}
            inline={inline}
          />
        )
      }}
    </PackGate>
  )
}

export default function LocalEvidenceDownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <Suspense>
      <EvidenceDownload id={id} />
    </Suspense>
  )
}
