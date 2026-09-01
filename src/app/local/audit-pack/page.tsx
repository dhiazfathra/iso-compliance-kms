'use client'

/**
 * Hosted, an audit pack is queued, built on the server and kept for a while so
 * an auditor can be sent a link. Locally there is nobody to send a link to and
 * nowhere to keep it: the archive is built in the tab and saved straight away,
 * so the history table stays empty by design and there is no expiry to explain.
 */
import { useState } from 'react'
import { AuditPackView } from '@/views/audit-pack'
import type { ActionResult } from '@/views/types'
import { packZip, saveBlob } from '../export-pack'
import { PackGate } from '../pack-gate'
import { useLocalPack } from '../provider'

export default function LocalAuditPackPage() {
  const { pack } = useLocalPack()
  const [error, setError] = useState<string | undefined>()

  const onRequest = async (): Promise<ActionResult> => {
    if (!pack) return { ok: false, error: 'No pack is open.' }
    try {
      const at = new Date()
      saveBlob(await packZip(pack, at), `${pack.packId}-${at.toISOString().slice(0, 10)}.zip`)
      setError(undefined)
      return { ok: true }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      setError(message)
      return { ok: false, error: message }
    }
  }

  return (
    <PackGate>
      {(open) => (
        <>
          <AuditPackView
            graph={open.graph}
            base="/local"
            canWrite
            packs={[]}
            // Nothing is stored anywhere to expire.
            ttlDays={0}
            onRequest={onRequest}
          />
          {error && (
            <div className="mono" style={{ fontSize: 11.5, color: 'var(--warn)' }}>
              {error}
            </div>
          )}
        </>
      )}
    </PackGate>
  )
}
