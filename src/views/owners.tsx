import Link from 'next/link'
import { ownerLoad, SOON_DAYS } from '@/lib/graph'
import { STATUS_META } from '@/lib/format'
import type { ViewProps } from './types'

const COLS = 'minmax(0,1fr) 190px 88px 96px 104px 104px'

export function OwnersView({ graph, base }: Pick<ViewProps, 'graph' | 'base'>) {
  const rows = ownerLoad(graph)

  return (
    <div className="block">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: '70ch' }}>
        <div className="eyebrow">Accountability</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--secondary)' }}>
          Every requirement has one named owner. The bar shows their requirements split by state, so
          a reviewer can see where evidence work is concentrated before an audit window opens.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="grid-head" style={{ gridTemplateColumns: COLS, padding: '10px 0' }}>
          <span>Owner</span>
          <span>Requirement mix</span>
          <span style={{ textAlign: 'right' }}>Owned</span>
          <span style={{ textAlign: 'right' }}>Gaps</span>
          <span style={{ textAlign: 'right' }}>Needs review</span>
          <span style={{ textAlign: 'right' }}>Due ≤{SOON_DAYS}d</span>
        </div>
        {rows.map((r) => (
          <Link
            key={r.user.id}
            href={`${base}/clauses?q=${encodeURIComponent(r.user.name)}`}
            className="row responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: COLS,
              gap: 16,
              alignItems: 'center',
              padding: '13px 0',
              color: 'var(--ink)',
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{r.user.name}</span>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                {r.user.role} · {r.evidence} evidence items
              </span>
            </span>
            <span style={{ display: 'flex', height: 6, gap: 1 }}>
              {(['compliant', 'progress', 'review', 'gap'] as const)
                .map((s) => ({ s, n: r[s] }))
                .filter(({ n }) => n)
                .map(({ s, n }) => (
                  <span key={s} style={{ flex: n, background: STATUS_META[s].bar }} />
                ))}
            </span>
            <span className="mono" style={{ fontSize: 12, textAlign: 'right' }}>
              {r.total}
            </span>
            <span
              className="mono"
              style={{
                fontSize: 12,
                textAlign: 'right',
                color: r.gap ? 'var(--warn)' : 'var(--muted)',
              }}
            >
              {r.gap}
            </span>
            <span
              className="mono"
              style={{
                fontSize: 12,
                textAlign: 'right',
                color: r.review ? 'var(--warn)' : 'var(--muted)',
              }}
            >
              {r.review}
            </span>
            <span
              className="mono"
              style={{
                fontSize: 12,
                textAlign: 'right',
                color: r.due ? 'var(--accent)' : 'var(--muted)',
              }}
            >
              {r.due}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
