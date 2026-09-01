'use client'

import { OwnersView } from '@/views/owners'
import { PackGate } from '../pack-gate'

export default function LocalOwnersPage() {
  return <PackGate>{(pack) => <OwnersView graph={pack.graph} base="/local" />}</PackGate>
}
