import Link from 'next/link'
import { CrossMapChips } from '@/components/Badges'
import { dueColor, fmtDate, relDue } from '@/lib/format'
import type { ViewProps } from './types'

const COLS = '92px minmax(0,1fr) 150px 210px 130px 128px'

export function EvidenceView({
  graph,
  base,
  filter,
}: Pick<ViewProps, 'graph' | 'base'> & { filter: { q: string } }) {
  const needle = filter.q.trim().toLowerCase()
  const items = graph.evidence.filter(
    (e) =>
      !needle ||
      e.title.toLowerCase().includes(needle) ||
      e.satisfies.some((s) => s.toLowerCase().includes(needle)) ||
      e.uploader.name.toLowerCase().includes(needle),
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="grid-head" style={{ gridTemplateColumns: COLS }}>
        <span>Type</span>
        <span>File</span>
        <span>Primary clause</span>
        <span>Also satisfies</span>
        <span>Uploader</span>
        <span style={{ textAlign: 'right' }}>Expires</span>
      </div>
      {items.map((e) => (
        <Link
          key={e.id}
          href={`${base}/evidence/${e.id}`}
          className="row responsive-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: COLS,
            gap: 16,
            alignItems: 'center',
            padding: '12px 26px',
            color: 'var(--ink)',
          }}
        >
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
            {e.fileType}
          </span>
          <span
            className="mono"
            style={{
              fontSize: 12.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {e.title}
          </span>
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--accent)' }}>
            {e.satisfies[0] ?? '—'}
          </span>
          <span style={{ overflow: 'hidden' }}>
            <CrossMapChips refs={e.satisfies.slice(1)} max={2} base={base} />
          </span>
          <span style={{ fontSize: 12, color: 'var(--secondary)' }}>{e.uploader.name}</span>
          <span
            className="mono"
            style={{ fontSize: 11, textAlign: 'right', color: dueColor(e.expiryDate) }}
          >
            {e.expiryDate ? `${fmtDate(e.expiryDate)} · ${relDue(e.expiryDate)}` : '—'}
          </span>
        </Link>
      ))}
      {!items.length && (
        <div style={{ padding: '40px 26px', color: 'var(--muted)', fontSize: 13 }}>
          No evidence matches this filter.
        </div>
      )}
    </div>
  )
}
