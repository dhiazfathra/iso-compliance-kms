'use client'

/**
 * A local pack has no auditor session to log against — nobody is being given
 * timed access to anything, the files are already on this machine — so the
 * banner is passed `null` and the screen renders the walk-through alone.
 */
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuditSessionView } from '@/views/audit-session'
import { PackGate } from '../pack-gate'

function Session() {
  const clause = useSearchParams().get('clause') ?? undefined

  return (
    <PackGate>
      {(pack) => {
        const tracked = pack.graph.clauses.filter((c) => (c.criticality ?? 1) > 0)
        const current = pack.graph.clauses.find((c) => c.clauseId === clause) ?? tracked[0]
        if (!current) return <div className="block">No requirements in this pack.</div>
        return (
          <AuditSessionView graph={pack.graph} base="/local" current={current} session={null} />
        )
      }}
    </PackGate>
  )
}

export default function LocalAuditSessionPage() {
  return (
    <Suspense>
      <Session />
    </Suspense>
  )
}
