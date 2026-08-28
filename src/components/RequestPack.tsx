'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { requestAuditPack } from '@/app/(app)/audit-pack/actions'

export function RequestPack({ disabled }: { disabled?: boolean }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  if (disabled) {
    return (
      <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.5 }}>
        Read-only session — ask a maintainer to generate the pack.
      </span>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        type="button"
        className="btn"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await requestAuditPack()
            if (!res?.ok) setError(res?.error ?? 'Could not start the export.')
            // The build finishes after the response; refreshing shows it land.
            setTimeout(() => router.refresh(), 1500)
            router.refresh()
          })
        }
      >
        {pending ? 'Starting export…' : 'Generate pack'}
      </button>
      {error && (
        <span className="mono" style={{ fontSize: 11, color: 'var(--warn)' }}>
          {error}
        </span>
      )}
    </div>
  )
}
