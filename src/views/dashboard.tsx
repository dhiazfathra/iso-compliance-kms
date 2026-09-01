import Link from 'next/link'
import type { ClauseNode } from '@/lib/data'
import {
  crossMapOf,
  expiryHorizon,
  readiness,
  statusCount,
  trackedClauses,
  SOON_DAYS,
} from '@/lib/graph'
import { STATUS_META, dueColor, fmtDate, relDue, type StatusKey } from '@/lib/format'
import { CrossMapChips } from '@/components/Badges'
import type { ViewProps } from './types'

const STATUS_ORDER: StatusKey[] = ['compliant', 'progress', 'review', 'gap']

function StandardCard({
  label,
  clauses,
  audit,
}: {
  label: string
  clauses: ClauseNode[]
  audit: string
}) {
  const score = readiness(clauses)
  const bar = STATUS_ORDER.map((s) => ({ s, n: statusCount(clauses, s) })).filter((x) => x.n)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="eyebrow">{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        <div style={{ font: '400 48px/0.92 Inter, sans-serif', letterSpacing: '-0.04em' }}>
          {score}%
        </div>
        <div
          className="mono"
          style={{ fontSize: 11.5, lineHeight: 1.4, color: 'var(--muted)', paddingBottom: 7 }}
        >
          {clauses.length} requirements
          <br />
          {audit}
        </div>
      </div>
      <div style={{ height: 6, display: 'flex', gap: 1, marginTop: 4 }}>
        {bar.map(({ s, n }) => (
          <div
            key={s}
            title={`${STATUS_META[s].label}: ${n}`}
            style={{ flex: n, background: STATUS_META[s].bar }}
          />
        ))}
      </div>
    </div>
  )
}

export function DashboardView({ graph, base }: Pick<ViewProps, 'graph' | 'base'>) {
  const { activity } = graph

  const tracked = trackedClauses(graph.clauses)
  const byStandard = (std: string) => tracked.filter((c) => c.standard === std)

  const { items: expiries, overdue, soon } = expiryHorizon(graph)

  const statusCells = STATUS_ORDER.flatMap((s) =>
    ['27001', '9001'].map((std) => ({ s, std, n: statusCount(tracked, s, std) })),
  )

  const crossMapped = tracked.filter((c) => crossMapOf(c).length).length

  return (
    <div className="block">
      <section
        className="stack-mobile"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.05fr) 1px minmax(0,1fr) 1px minmax(0,1fr)',
          gap: 34,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="eyebrow">Weighted readiness · all standards</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
            <div style={{ font: '400 68px/0.92 Inter, sans-serif', letterSpacing: '-0.045em' }}>
              {readiness(tracked)}%
            </div>
          </div>
          <div
            style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--secondary)', maxWidth: '34ch' }}
          >
            Evidence coverage across {tracked.length} tracked requirements, weighted by clause
            criticality. {crossMapped} are satisfied by cross-mapped artefacts.
          </div>
        </div>
        <div style={{ background: 'var(--line)', alignSelf: 'stretch' }} />
        <StandardCard
          label="ISO/IEC 27001:2022"
          clauses={byStandard('27001')}
          audit="Stage 2 · 14 Oct 2026"
        />
        <div style={{ background: 'var(--line)', alignSelf: 'stretch' }} />
        <StandardCard
          label="ISO 9001:2015"
          clauses={byStandard('9001')}
          audit="Surveillance · 06 Nov 2026"
        />
      </section>

      <div
        className="stack-mobile"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 372px',
          gap: 34,
          alignItems: 'start',
        }}
      >
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="section-head">
            <div className="eyebrow">Expiring &amp; due for review</div>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--warn)' }}>
              {overdue} overdue · {soon} within {SOON_DAYS} days
            </div>
          </div>
          {expiries.slice(0, 8).map((x) => (
            <Link
              key={`${x.href}-${x.name}`}
              href={`${base}${x.href}`}
              className="row responsive-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '88px minmax(0,1fr) 106px 118px 74px',
                gap: 14,
                alignItems: 'center',
                padding: '11px 2px',
                color: 'var(--ink)',
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 11.5, fontWeight: 500, color: dueColor(x.date) }}
              >
                {fmtDate(x.date)}
              </span>
              <span
                style={{
                  fontSize: 13,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {x.name}
              </span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>
                {x.clause}
              </span>
              <span style={{ fontSize: 12, color: 'var(--secondary)' }}>{x.owner}</span>
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  textAlign: 'right',
                  color: dueColor(x.date),
                }}
              >
                {relDue(x.date)}
              </span>
            </Link>
          ))}
        </section>

        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="section-head">
            <div className="eyebrow">Requirements by status</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {statusCells.map((cell) => (
              <Link
                key={`${cell.s}-${cell.std}`}
                href={`${base}/clauses?status=${cell.s}&std=${cell.std}`}
                className="row"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  padding: '15px 14px 15px 0',
                  color: 'var(--ink)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span
                    style={{
                      font: '400 30px/1 Inter, sans-serif',
                      letterSpacing: '-0.035em',
                      color: STATUS_META[cell.s].ink,
                    }}
                  >
                    {cell.n}
                  </span>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                    {cell.std}
                  </span>
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: '.09em',
                    textTransform: 'uppercase',
                    color: STATUS_META[cell.s].ink,
                  }}
                >
                  {STATUS_META[cell.s].label}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="section-head">
          <div className="eyebrow">Audit trail · most recent</div>
          <Link href={`${base}/evidence`} className="mono" style={{ fontSize: 11 }}>
            Full trail
          </Link>
        </div>
        {activity.slice(0, 8).map((a) => (
          <div
            key={a.id}
            className="row responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '96px 130px minmax(0,1fr) 132px',
              gap: 16,
              alignItems: 'baseline',
              padding: '10px 2px',
            }}
          >
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
              {fmtDate(a.at)}
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 500 }}>{a.actor}</span>
            <span
              style={{
                fontSize: 12.5,
                color: 'var(--secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {a.action}
            </span>
            <span style={{ textAlign: 'right' }}>
              <CrossMapChips refs={a.ref ? [a.ref] : []} dashed={false} base={base} />
            </span>
          </div>
        ))}
      </section>
    </div>
  )
}
