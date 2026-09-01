'use client'

import { useState, useTransition } from 'react'
import type { FormAction } from '@/views/types'

export function UploadVersion({ id, onUpload }: { id: number; onUpload: FormAction }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  if (!open) {
    return (
      <button type="button" className="btn" onClick={() => setOpen(true)}>
        Upload new version
      </button>
    )
  }

  return (
    <form
      action={(fd) =>
        start(async () => {
          const res = await onUpload(fd)
          if (res?.ok) setOpen(false)
          else setError(res?.error ?? 'Upload failed.')
        })
      }
      style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 260 }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="file" name="file" required style={{ fontSize: 12 }} />
      <input className="input" name="note" placeholder="What changed?" style={{ width: '100%' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn" disabled={pending}>
          {pending ? 'Uploading…' : 'Save version'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
      {error && (
        <span className="mono" style={{ fontSize: 11, color: 'var(--warn)' }}>
          {error}
        </span>
      )}
    </form>
  )
}
