import Link from 'next/link'
import type { ClauseNode } from '@/lib/data'
import { crossMapOf, evidenceCount } from '@/lib/graph'
import { STATUS_META, dueColor, expiresIn, fmtDate, type StatusKey } from '@/lib/format'
import { CrossMapChips } from '@/components/Badges'
import type { ViewProps } from './types'

/** The banner's slice of the audit session; `null` outside a live session. */
export type SessionBanner = {
  sessionId: string
  label: string
  downloads?: number | null
  expiresAt: string
  /** Clauses viewed so far, including this one. */
  viewed: number
} | null

/**
 * Presenting mode for a live audit: one requirement, large type, its whole
 * chain of evidence on screen, and no editing controls.
 */
export function AuditSessionView({
  graph,
  base,
  current,
  session,
}: Omit<ViewProps, 'canWrite'> & { current: ClauseNode; session: SessionBanner }) {
  const status = STATUS_META[current.status as StatusKey] ?? STATUS_META.progress
  const chain = current.policies.flatMap((p) => [
    {
      kind: 'Policy',
      name: `${p.name} ${p.version}`,
      cross: p.clauses,
      date: p.revisions[0]?.date,
      href: `${base}/policies/${p.id}`,
    },
    ...p.forms.flatMap((f) => [
      {
        kind: 'Form',
        name: `${f.code} · ${f.name}`,
        cross: [...f.alsoSatisfies, ...f.externalRefs],
        date: undefined,
        href: undefined,
      },
      ...f.evidence.map((e) => ({
        kind: 'Evidence',
        name: e.title,
        cross: e.satisfies.slice(1),
        date: e.uploadedAt,
        href: `${base}/evidence/${e.id}`,
      })),
    ]),
  ])

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 16,
          padding: '12px 26px',
          background: 'var(--ink-strong)',
          color: 'var(--bg)',
          flexWrap: 'wrap',
        }}
      >
        <span
          className="mono"
          style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' }}
        >
          {session ? `${session.sessionId} · ${session.label}` : 'Audit session · presenting'}
        </span>
        <span className="mono" style={{ fontSize: 11, opacity: 0.7 }}>
          {session
            ? `${session.viewed} clause${session.viewed === 1 ? '' : 's'} viewed · ${session.downloads ?? 0} download${
                (session.downloads ?? 0) === 1 ? '' : 's'
              } · expires in ${expiresIn(session.expiresAt)}`
            : 'read-only mirror · every view is written to the audit trail'}
        </span>
      </div>

      <div
        className="stack-mobile"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 1px minmax(0,1.05fr)',
          gap: 30,
          padding: '34px 30px 44px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="mono" style={{ fontSize: 13, color: 'var(--accent)' }}>
            {current.clauseId}
          </div>
          <div style={{ font: '500 46px/1.12 Inter, sans-serif', letterSpacing: '-0.025em' }}>
            {current.title}
          </div>
          <div className="eyebrow">
            {current.standard === '27001' ? 'ISO/IEC 27001:2022' : 'ISO 9001:2015'}
          </div>
          <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap', paddingTop: 10 }}>
            {[
              ['Status', status.label, status.color === '#fdfdfc' ? 'var(--warn)' : status.color],
              ['Owner', current.owner.name, undefined],
              ['Next review', fmtDate(current.nextReview), dueColor(current.nextReview)],
              ['Evidence', String(evidenceCount(current)), undefined],
            ].map(([label, value, color]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span className="eyebrow" style={{ fontSize: 9.5 }}>
                  {label}
                </span>
                <span className="mono" style={{ fontSize: 13, color: color ?? 'var(--ink)' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              flexWrap: 'wrap',
              paddingTop: 6,
            }}
          >
            <span className="eyebrow" style={{ fontSize: 9.5 }}>
              Also satisfies
            </span>
            <CrossMapChips refs={crossMapOf(current)} base={base} />
          </div>
        </div>

        <div style={{ background: 'var(--line)' }} />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="section-head">
            <span className="eyebrow">Chain of evidence</span>
          </div>
          {chain.map((c, i) => (
            <div
              key={`${c.kind}-${c.name}-${i}`}
              className="row responsive-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) 180px 96px',
                gap: 16,
                alignItems: 'center',
                padding: '12px 0',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 10, minWidth: 0 }}>
                <span className="eyebrow" style={{ fontSize: 9.5, flex: 'none' }}>
                  {c.kind}
                </span>
                {c.href ? (
                  <Link href={c.href} style={{ fontSize: 13, color: 'var(--ink)' }}>
                    {c.name}
                  </Link>
                ) : (
                  <span style={{ fontSize: 13 }}>{c.name}</span>
                )}
              </span>
              <span style={{ overflow: 'hidden' }}>
                <CrossMapChips refs={c.cross} max={2} base={base} />
              </span>
              <span
                className="mono"
                style={{ fontSize: 11, textAlign: 'right', color: 'var(--muted)' }}
              >
                {c.date ? fmtDate(c.date) : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 30px 40px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span className="eyebrow" style={{ width: '100%', paddingBottom: 8 }}>
          Jump to requirement
        </span>
        {graph.clauses
          .filter((c) => (c.criticality ?? 1) > 0)
          .map((c) => (
            <Link
              key={c.clauseId}
              href={`${base}/audit-session?clause=${encodeURIComponent(c.clauseId)}`}
              className="filter-chip"
              data-active={c.clauseId === current.clauseId}
            >
              {c.clauseId}
            </Link>
          ))}
      </div>
    </div>
  )
}
