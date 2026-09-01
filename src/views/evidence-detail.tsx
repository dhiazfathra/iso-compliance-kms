import Link from 'next/link'
import type { EvidenceItem } from '@/lib/data'
import { dueColor, fmtDate, relDue } from '@/lib/format'
import { CrossMapChips } from '@/components/Badges'
import { EvidencePreview } from '@/components/EvidencePreview'
import { UploadVersion } from '@/components/UploadVersion'
import type { FormAction, ViewProps } from './types'

function Meta({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div
      className="row"
      style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0' }}
    >
      <span className="eyebrow" style={{ fontSize: 9.5 }}>
        {label}
      </span>
      <span className="mono" style={{ fontSize: 11.5, color: color ?? 'var(--ink)' }}>
        {value}
      </span>
    </div>
  )
}

export function EvidenceDetailView({
  graph,
  base,
  item,
  onUpload,
}: Omit<ViewProps, 'canWrite'> & { item: EvidenceItem; onUpload: FormAction }) {
  const form = graph.forms.find((f) => f.id === item.form)
  const policy = form ? graph.policies.find((p) => p.id === form.policy) : undefined
  const size = item.filesize ? `${(item.filesize / 1024).toFixed(1)} KB` : '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '24px 30px 20px',
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 30,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              className="mono"
              style={{
                fontSize: 9.5,
                letterSpacing: '.1em',
                padding: '3px 6px',
                border: '1px solid var(--line-strong)',
                borderRadius: 2,
                color: 'var(--secondary)',
              }}
            >
              {item.fileType}
            </span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
              {size} · {item.sha ?? 'no digest'}
            </span>
          </div>
          <div
            className="mono"
            style={{ font: '500 21px/1.3 var(--mono)', overflowWrap: 'anywhere' }}
          >
            {item.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span className="eyebrow" style={{ fontSize: 9.5 }}>
              Satisfies
            </span>
            {item.satisfies[0] && (
              <Link
                href={`${base}/clauses?q=${encodeURIComponent(item.satisfies[0])}`}
                className="chip-cross"
              >
                {item.satisfies[0]}
              </Link>
            )}
            <CrossMapChips refs={item.satisfies.slice(1)} base={base} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flex: 'none', alignItems: 'flex-start' }}>
          {item.url && (
            <a href={`${base}/evidence/${item.id}/download`} className="btn btn-ghost">
              Download
            </a>
          )}
          <UploadVersion id={item.id} onUpload={onUpload} />
        </div>
      </div>

      <div
        className="stack-mobile"
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 336px' }}
      >
        <div
          style={{
            padding: '30px 34px 44px',
            display: 'flex',
            flexDirection: 'column',
            gap: 26,
            minWidth: 0,
          }}
        >
          <EvidencePreview item={item} base={base} />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="section-head">
              <span className="eyebrow">Version history</span>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                {item.revisions.length} versions
              </span>
            </div>
            {item.revisions.map((v, i) => (
              <div
                key={`${v.version}-${v.date}`}
                className="row responsive-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '58px 92px 128px minmax(0,1fr) 92px',
                  gap: 14,
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
                <span style={{ fontSize: 12, color: 'var(--secondary)', lineHeight: 1.45 }}>
                  {v.note}
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
          </div>
        </div>

        <div style={{ borderLeft: '1px solid var(--line)', padding: '30px 26px', minWidth: 0 }}>
          <div className="eyebrow" style={{ paddingBottom: 6 }}>
            Record
          </div>
          <Meta label="Uploaded" value={fmtDate(item.uploadedAt)} />
          <Meta label="Uploader" value={item.uploader.name} />
          <Meta
            label="Expiry"
            value={
              item.expiryDate ? `${fmtDate(item.expiryDate)} · ${relDue(item.expiryDate)}` : '—'
            }
            color={dueColor(item.expiryDate)}
          />
          <Meta label="Retention" value={item.retention ?? '—'} />
          <Meta label="Form" value={form ? `${form.code} · ${form.name}` : '—'} />
          <Meta label="Policy" value={policy ? `${policy.name} ${policy.version}` : '—'} />
          {policy && (
            <Link
              href={`${base}/policies/${policy.id}`}
              className="mono"
              style={{ fontSize: 11.5, display: 'inline-block', marginTop: 12 }}
            >
              Open policy record →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
