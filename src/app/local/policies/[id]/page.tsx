'use client'

/**
 * The hosted twin of this screen posts to a server action; here the same form
 * is handled in the tab. The Markdown file that came with the pack is rewritten
 * alongside the register, so the folder stays the readable copy of record.
 */
import { use } from 'react'
import { withPolicyBody } from '@/lib/local-edit'
import { writeFile } from '@/lib/opfs'
import { PolicyDetailView } from '@/views/policy-detail'
import type { ActionResult } from '@/views/types'
import { PackGate } from '../../pack-gate'
import { useLocalPack } from '../../provider'

export default function LocalPolicyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { pack, save } = useLocalPack()

  const onSave = async (data: FormData): Promise<ActionResult> => {
    if (!pack) return { ok: false, error: 'No pack is open.' }
    const policyId = Number(data.get('id'))
    const body = String(data.get('body') ?? '')
    try {
      const path = pack.policyFiles.get(policyId)
      if (path) {
        await writeFile(path, body)
        pack.files.set(path, new TextEncoder().encode(body))
      }
      await save(withPolicyBody(pack.graph, policyId, body, new Date()))
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) }
    }
  }

  return (
    <PackGate>
      {(open) => {
        const policy = open.graph.policies.find((p) => String(p.id) === id)
        if (!policy) return <div className="block">No such document in this pack.</div>
        return (
          <PolicyDetailView
            graph={open.graph}
            base="/local"
            canWrite
            policy={policy}
            onSave={onSave}
          />
        )
      }}
    </PackGate>
  )
}
