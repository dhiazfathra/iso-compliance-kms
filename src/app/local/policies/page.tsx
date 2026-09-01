'use client'

import { PoliciesView } from '@/views/policies'
import { PackGate } from '../pack-gate'

export default function LocalPoliciesPage() {
  return <PackGate>{(pack) => <PoliciesView graph={pack.graph} base="/local" />}</PackGate>
}
