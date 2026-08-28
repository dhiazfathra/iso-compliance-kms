import Link from 'next/link'
import { loadGraph } from '@/lib/data'
import { daysUntil } from '@/lib/format'

export const dynamic = 'force-dynamic'

const COLS = 'minmax(0,1fr) 190px 88px 96px 104px 104px'

export default async function OwnersPage() {
  const graph = await loadGraph()

  const rows = graph.users
    .map((u) => {
      const owned = graph.clauses.filter((c) => c.owner.id === u.id)
      const evidence = graph.evidence.filter((e) => e.uploader.id === u.id).length
      const due = graph.clauses.filter((c) => {
        if (c.owner.id !== u.id) return false
        const d = daysUntil(c.nextReview)
        return d !== null && d <= 30
      }).length
      return {
        user: u,
        total: owned.length,
        gap: owned.filter((c) => c.status === 'gap').length,
        review: owned.filter((c) => c.status === 'review').length,
        compliant: owned.filter((c) => c.status === 'compliant').length,
        progress: owned.filter((c) => c.status === 'progress').length,
        evidence,
        due,
      }
    })
    .filter((r) => r.total)
    .sort((a, b) => b.total - a.total)

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
          <span style={{ textAlign: 'right' }}>Due ≤30d</span>
        </div>
        {rows.map((r) => (
          <Link
            key={r.user.id}
            href={`/clauses?q=${encodeURIComponent(r.user.name)}`}
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
              {[
                [r.compliant, '#21201c'],
                [r.progress, '#0073e6'],
                [r.review, 'rgba(168,86,42,.45)'],
                [r.gap, '#a8562a'],
              ]
                .filter(([n]) => n)
                .map(([n, bg], i) => (
                  <span key={i} style={{ flex: n as number, background: bg as string }} />
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
