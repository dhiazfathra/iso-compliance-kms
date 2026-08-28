import Link from 'next/link'
import { STATUS_META, type StatusKey } from '@/lib/format'

export function StatusChip({ status }: { status: string }) {
  const m = STATUS_META[status as StatusKey] ?? STATUS_META.progress
  return (
    <span className="chip" style={{ color: m.color, background: m.bg, borderColor: m.border }}>
      {m.label}
    </span>
  )
}

/**
 * Cross-mapping is a first-class signal: every artefact that satisfies more
 * than one requirement shows the other requirements wherever it appears.
 */
export function CrossMapChips({
  refs,
  dashed = true,
  max,
}: {
  refs: string[]
  dashed?: boolean
  max?: number
}) {
  if (!refs.length) return null
  const shown = max ? refs.slice(0, max) : refs
  const rest = refs.length - shown.length
  return (
    <span style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
      {shown.map((r) => {
        const known = /^[A-Za-z0-9.]+$/.test(r)
        const cls = `chip-cross${dashed ? ' chip-cross-dashed' : ''}`
        return known ? (
          <Link key={r} href={`/clauses?q=${encodeURIComponent(r)}`} className={cls}>
            {r}
          </Link>
        ) : (
          <span key={r} className={cls}>
            {r}
          </span>
        )
      })}
      {rest > 0 && (
        <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
          +{rest}
        </span>
      )}
    </span>
  )
}
