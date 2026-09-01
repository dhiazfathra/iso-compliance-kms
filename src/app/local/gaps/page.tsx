'use client'

import { GapsView } from '@/views/gaps'
import { PackGate } from '../pack-gate'

export default function LocalGapsPage() {
  return <PackGate>{(pack) => <GapsView graph={pack.graph} base="/local" />}</PackGate>
}
