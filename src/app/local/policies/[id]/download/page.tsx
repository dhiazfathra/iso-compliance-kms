'use client'

/** Same rule as the hosted route: the PDF is generated from the stored text on
 *  every download, so it can never be a stale copy of an approved document. */
import { Suspense, use } from 'react'
import { useSearchParams } from 'next/navigation'
import { fmtDate } from '@/lib/format'
import { markdownPdf } from '@/lib/pdf'
import { Deliver } from '../../../deliver'
import { PackGate } from '../../../pack-gate'

function PolicyDownload({ id }: { id: string }) {
  const inline = useSearchParams().get('inline') === '1'

  return (
    <PackGate>
      {(pack) => {
        const policy = pack.graph.policies.find((p) => String(p.id) === id)
        if (!policy) return <div className="block">No such document in this pack.</div>
        const current = policy.revisions?.[0]
        const subtitle = [
          policy.version,
          policy.status,
          current?.date ? `approved ${fmtDate(current.date)}` : null,
        ]
          .filter(Boolean)
          .join(' · ')

        return (
          <Deliver
            bytes={markdownPdf(policy.body ?? '', { title: policy.name, subtitle })}
            filename={`${policy.name} ${policy.version}.pdf`.replace(/[^\w.\-() ]+/g, '_')}
            type="application/pdf"
            inline={inline}
          />
        )
      }}
    </PackGate>
  )
}

export default function LocalPolicyDownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <Suspense>
      <PolicyDownload id={id} />
    </Suspense>
  )
}
