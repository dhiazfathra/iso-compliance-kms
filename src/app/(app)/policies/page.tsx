import Link from 'next/link'
import { loadGraph } from '@/lib/data'
import { CrossMapChips } from '@/components/Badges'

export const dynamic = 'force-dynamic'

const COLS = 'minmax(0,1fr) 90px 110px 240px 120px'

export default async function PoliciesPage() {
  const graph = await loadGraph()

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="grid-head" style={{ gridTemplateColumns: COLS }}>
        <span>Controlled document</span>
        <span>Version</span>
        <span>State</span>
        <span>Requirements covered</span>
        <span style={{ textAlign: 'right' }}>Forms · evidence</span>
      </div>
      {graph.policies.map((p) => {
        const evidence = p.forms.reduce((n, f) => n + f.evidence.length, 0)
        return (
          <Link
            key={p.id}
            href={`/policies/${p.id}`}
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
            <span style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {p.name}
            </span>
            <span className="mono" style={{ fontSize: 11.5 }}>
              {p.version}
            </span>
            <span
              className="mono"
              style={{
                fontSize: 10.5,
                color: p.status === 'Approved' ? 'var(--secondary)' : 'var(--warn)',
              }}
            >
              {p.status}
            </span>
            <span style={{ overflow: 'hidden' }}>
              <CrossMapChips refs={p.clauses} max={3} dashed={false} />
            </span>
            <span
              className="mono"
              style={{ fontSize: 11, textAlign: 'right', color: 'var(--secondary)' }}
            >
              {p.forms.length} · {evidence}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
