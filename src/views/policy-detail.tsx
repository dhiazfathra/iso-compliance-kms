import Link from 'next/link'
import type { PolicyNode } from '@/lib/data'
import { fmtDate } from '@/lib/format'
import { CrossMapChips } from '@/components/Badges'
import { Markdown } from '@/components/Markdown'
import { MarkdownEditor } from '@/components/MarkdownEditor'
import type { FormAction, ViewProps } from './types'

export function PolicyDetailView({
  graph,
  base,
  canWrite,
  policy,
  onSave,
}: ViewProps & { policy: PolicyNode; onSave: FormAction }) {
  const clause = graph.clauses.find((c) => c.clauseId === policy.primaryClause)
  const body = policy.body ?? ''

  return (
    <div className="block">
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="eyebrow">
          Policy · {policy.version} · {policy.status}
        </div>
        <div style={{ font: '500 27px/1.18 Inter, sans-serif', letterSpacing: '-0.02em' }}>
          {policy.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span className="eyebrow" style={{ fontSize: 9.5 }}>
            Requirements covered
          </span>
          <CrossMapChips refs={policy.clauses} dashed={false} base={base} />
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--secondary)' }}>
          Owner {policy.owner?.name ?? '—'} · primary clause{' '}
          <Link href={`${base}/clauses?q=${encodeURIComponent(policy.primaryClause)}`}>
            {policy.primaryClause}
          </Link>{' '}
          {clause?.title}
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="section-head">
          <span className="eyebrow">Document text</span>
          <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a className="btn btn-ghost" href={`${base}/policies/${policy.id}/download`}>
              Download PDF
            </a>
          </span>
        </div>
        {canWrite ? (
          <MarkdownEditor id={policy.id} body={body} onSave={onSave} />
        ) : (
          <Markdown source={body} />
        )}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="section-head">
          <span className="eyebrow">Forms issued under this policy</span>
        </div>
        {policy.forms.map((f) => (
          <div
            key={f.id}
            className="row responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '110px minmax(0,1fr) 240px 92px',
              gap: 16,
              alignItems: 'center',
              padding: '11px 0',
            }}
          >
            <span className="mono" style={{ fontSize: 11.5, color: 'var(--accent)' }}>
              {f.code}
            </span>
            <span style={{ fontSize: 12.5 }}>{f.name}</span>
            <span style={{ overflow: 'hidden' }}>
              <CrossMapChips refs={[...f.alsoSatisfies, ...f.externalRefs]} max={3} base={base} />
            </span>
            <span
              className="mono"
              style={{ fontSize: 11, textAlign: 'right', color: 'var(--secondary)' }}
            >
              {f.evidence.length} items
            </span>
          </div>
        ))}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="section-head">
          <span className="eyebrow">Revision history</span>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
            {policy.revisions.length} revisions
          </span>
        </div>
        {policy.revisions.map((v, i) => (
          <div
            key={`${v.version}-${v.date}`}
            className="row responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '76px 92px 132px minmax(0,1fr) 132px',
              gap: 16,
              alignItems: 'baseline',
              padding: '11px 0',
            }}
          >
            <span className="mono" style={{ fontSize: 11.5, fontWeight: 500 }}>
              {v.version}
            </span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
              {fmtDate(v.date)}
            </span>
            <span style={{ fontSize: 12 }}>{v.author ?? '—'}</span>
            <span
              style={{
                fontSize: 12,
                color: 'var(--secondary)',
                lineHeight: 1.45,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <span>{v.note}</span>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                {v.approval}
              </span>
            </span>
            <span
              className="mono"
              style={{
                fontSize: 9.5,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                textAlign: 'right',
                color: i === 0 ? 'var(--accent)' : 'var(--muted)',
              }}
            >
              {i === 0 ? 'current' : 'superseded'}
            </span>
          </div>
        ))}
      </section>
    </div>
  )
}
