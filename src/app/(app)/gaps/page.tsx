import Link from 'next/link'
import { loadGraph } from '@/lib/data'
import { daysUntil, dueColor, fmtDate, relDue } from '@/lib/format'

export const dynamic = 'force-dynamic'

const COLS = '96px minmax(0,1.1fr) minmax(0,1fr) 122px 104px 128px'

function Stat({ n, label, tone }: { n: string | number; label: string; tone?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          font: '400 34px/1 Inter, sans-serif',
          letterSpacing: '-0.035em',
          color: tone ?? 'var(--ink)',
        }}
      >
        {n}
      </span>
      <span className="eyebrow" style={{ fontSize: 9.5 }}>
        {label}
      </span>
    </div>
  )
}

export default async function GapsPage() {
  const graph = await loadGraph()
  const gaps = graph.gaps
  const ages = gaps.map((g) => Math.abs(daysUntil(g.due) ?? 0)).sort((a, b) => a - b)
  const median = ages.length ? ages[Math.floor(ages.length / 2)] : 0

  return (
    <div className="block">
      <div
        className="stack-mobile"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 26 }}
      >
        <Stat n={gaps.length} label="Open gaps" />
        <Stat
          n={gaps.filter((g) => g.blocking).length}
          label="Blocking certification"
          tone="var(--warn)"
        />
        <Stat
          n={Math.round(gaps.reduce((n, g) => n + g.progress, 0) / (gaps.length || 1))}
          label="Mean progress %"
        />
        <Stat n={median} label="Median days to due" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="grid-head" style={{ gridTemplateColumns: COLS, padding: '10px 0' }}>
          <span>Clause</span>
          <span>Finding</span>
          <span>Remediation task</span>
          <span>Owner</span>
          <span>Progress</span>
          <span style={{ textAlign: 'right' }}>Due</span>
        </div>
        {gaps.map((g) => (
          <Link
            key={g.id}
            href={`/clauses?q=${encodeURIComponent(g.clause.clauseId)}`}
            className="row responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: COLS,
              gap: 16,
              alignItems: 'center',
              padding: '14px 0',
              color: 'var(--ink)',
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span className="mono" style={{ fontSize: 12, fontWeight: 500 }}>
                {g.clause.clauseId}
              </span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
                {g.clause.standard}
                {g.blocking ? ' · blocking' : ''}
              </span>
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <span style={{ fontSize: 12.5, fontWeight: 500 }}>{g.clause.title}</span>
              <span style={{ fontSize: 12, color: 'var(--secondary)', lineHeight: 1.45 }}>
                {g.finding}
              </span>
            </span>
            <span style={{ fontSize: 12.5, color: 'var(--secondary)', lineHeight: 1.45 }}>
              {g.task}
            </span>
            <span style={{ fontSize: 12 }}>{g.owner.name}</span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span className="mono" style={{ fontSize: 11 }}>
                {g.progress}%
              </span>
              <span style={{ height: 4, background: 'var(--line)', display: 'block' }}>
                <span
                  style={{
                    display: 'block',
                    height: 4,
                    width: `${g.progress}%`,
                    background: g.blocking ? 'var(--warn)' : 'var(--accent)',
                  }}
                />
              </span>
            </span>
            <span
              className="mono"
              style={{ fontSize: 11, textAlign: 'right', color: dueColor(g.due) }}
            >
              {fmtDate(g.due)}
              <br />
              {relDue(g.due)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
