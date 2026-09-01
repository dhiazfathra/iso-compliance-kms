'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { EvidenceView } from '@/views/evidence'
import { PackGate } from '../pack-gate'

function Evidence() {
  const q = useSearchParams().get('q') ?? ''
  return (
    <PackGate>
      {(pack) => <EvidenceView graph={pack.graph} base="/local" filter={{ q }} />}
    </PackGate>
  )
}

export default function LocalEvidencePage() {
  return (
    <Suspense>
      <Evidence />
    </Suspense>
  )
}
