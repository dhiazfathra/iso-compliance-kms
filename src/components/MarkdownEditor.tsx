'use client'

import { useState, useTransition } from 'react'
import { Markdown } from './Markdown'
import type { FormAction } from '@/views/types'

/**
 * Write Markdown on the left, read the rendered document on the right. The
 * preview runs through the same renderer as the saved page, so the editor
 * cannot show something the export would not produce.
 */
export function MarkdownEditor({
  id,
  body,
  onSave,
}: {
  id: number
  body: string
  onSave: FormAction
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(body)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  if (!open) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
        <Markdown source={body} />
        <button
          type="button"
          className="btn"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => setOpen(true)}
        >
          {body.trim() ? 'Edit document' : 'Write document'}
        </button>
      </div>
    )
  }

  return (
    <form
      action={(fd) =>
        start(async () => {
          const res = await onSave(fd)
          if (res?.ok) setOpen(false)
          else setError(res?.error ?? 'Save failed.')
        })
      }
      style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}
    >
      <input type="hidden" name="id" value={id} />
      <div
        className="stack-mobile"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'start' }}
      >
        <textarea
          name="body"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck
          aria-label="Document text, in Markdown"
          className="input mono"
          style={{
            minHeight: 420,
            width: '100%',
            fontSize: 12,
            lineHeight: 1.6,
            resize: 'vertical',
          }}
        />
        <div style={{ minHeight: 420 }}>
          <Markdown source={draft} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="submit" className="btn" disabled={pending}>
          {pending ? 'Saving…' : 'Save document'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setDraft(body)
            setOpen(false)
          }}
        >
          Cancel
        </button>
        <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
          Markdown · # heading · **bold** · - list · `code`
        </span>
        {error && (
          <span className="mono" style={{ fontSize: 11, color: 'var(--warn)' }}>
            {error}
          </span>
        )}
      </div>
    </form>
  )
}
