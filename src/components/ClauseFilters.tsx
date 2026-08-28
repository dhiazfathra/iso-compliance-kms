'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const STANDARDS = [
  ['all', 'All standards'],
  ['27001', '27001'],
  ['9001', '9001'],
] as const

const STATUSES = [
  ['all', 'All'],
  ['compliant', 'Compliant'],
  ['progress', 'In progress'],
  ['review', 'Needs review'],
  ['gap', 'Gap'],
] as const

export function ClauseFilters({ resultLabel }: { resultLabel: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')

  const std = params.get('std') ?? 'all'
  const status = params.get('status') ?? 'all'

  const push = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(patch)) {
      if (!v || v === 'all') next.delete(k)
      else next.set(k, v)
    }
    router.replace(`/clauses?${next.toString()}`, { scroll: false })
  }

  // Debounced so typing a clause number does not fire a request per keystroke.
  useEffect(() => {
    const id = setTimeout(() => {
      if ((params.get('q') ?? '') !== q) push({ q })
    }, 200)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  return (
    <div className="toolbar">
      <input
        className="input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Clause number, title, owner…"
        aria-label="Search requirements"
      />
      {STANDARDS.map(([value, label]) => (
        <button
          key={value}
          type="button"
          className="filter-chip"
          data-active={std === value}
          onClick={() => push({ std: value })}
        >
          {label}
        </button>
      ))}
      <div style={{ width: 1, height: 22, background: 'var(--line)', margin: '0 4px' }} />
      {STATUSES.map(([value, label]) => (
        <button
          key={value}
          type="button"
          className="filter-chip"
          data-active={status === value}
          onClick={() => push({ status: value })}
        >
          {label}
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
        {resultLabel}
      </div>
    </div>
  )
}
