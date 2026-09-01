'use client'

import { DashboardView } from '@/views/dashboard'
import { PackGate } from './pack-gate'

export default function LocalDashboardPage() {
  return <PackGate>{(pack) => <DashboardView graph={pack.graph} base="/local" />}</PackGate>
}
