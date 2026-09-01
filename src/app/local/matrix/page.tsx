'use client'

import { MatrixView } from '@/views/matrix'
import { PackGate } from '../pack-gate'

export default function LocalMatrixPage() {
  return <PackGate>{(pack) => <MatrixView graph={pack.graph} />}</PackGate>
}
