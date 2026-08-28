import Link from 'next/link'
import { loadGraph } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function AuditPackPage() {
  const graph = await loadGraph()
  const crossMapped = graph.forms.filter((f) => f.alsoSatisfies.length).length
  const bytes = graph.evidence.reduce((n, e) => n + (e.filesize ?? 0), 0)

  const contents = [
    {
      label: 'Clause index with status and owner',
      meta: `${graph.clauses.length} rows`,
      on: true,
    },
    {
      label: 'Approved policies at current version',
      meta: `${graph.policies.filter((p) => p.status === 'Approved').length} documents`,
      on: true,
    },
    {
      label: 'Blank form templates referenced by the index',
      meta: `${graph.forms.length} forms`,
      on: true,
    },
    { label: 'Evidence for in-scope clauses', meta: `${graph.evidence.length} items`, on: true },
    {
      label: 'Version history and audit trail export',
      meta: `${graph.evidence.reduce((n, e) => n + e.revisions.length, 0)} versions`,
      on: false,
    },
    { label: 'Open gaps with remediation plans', meta: `${graph.gaps.length} rows`, on: false },
    { label: 'Cross-mapping matrix (27001 ⇄ 9001)', meta: `${crossMapped} forms`, on: true },
  ]

  return (
    <div className="block">
      <div
        className="stack-mobile"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 372px',
          gap: 34,
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: '66ch' }}>
            <div className="eyebrow">Scope</div>
            <div style={{ font: '500 22px/1.25 Inter, sans-serif', letterSpacing: '-0.02em' }}>
              Stage 2 certification audit · ISO/IEC 27001:2022
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--secondary)' }}>
              The pack is a hyperlinked index: every clause row links to the policy, the form and
              the evidence file that satisfies it, with the version that was current on the day of
              export.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="section-head">
              <span className="eyebrow">Contents</span>
            </div>
            {contents.map((row) => (
              <div
                key={row.label}
                className="row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px minmax(0,1fr) 180px',
                  gap: 14,
                  alignItems: 'center',
                  padding: '12px 0',
                }}
              >
                <span
                  style={{
                    width: 11,
                    height: 11,
                    border: '1px solid var(--ink)',
                    background: row.on ? 'var(--ink)' : 'transparent',
                  }}
                />
                <span style={{ fontSize: 12.5 }}>{row.label}</span>
                <span
                  className="mono"
                  style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}
                >
                  {row.meta}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            border: '1px solid var(--line)',
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="eyebrow">Estimated pack</span>
            <span style={{ font: '400 34px/1 Inter, sans-serif', letterSpacing: '-0.035em' }}>
              {(bytes / 1024).toFixed(0)} KB
            </span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
              {graph.clauses.length} index rows · {graph.evidence.length} files · {crossMapped}{' '}
              cross-mapped
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span className="eyebrow" style={{ fontSize: 9.5 }}>
                Format
              </span>
              <span className="mono" style={{ fontSize: 11.5 }}>
                ZIP + hyperlinked PDF index
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span className="eyebrow" style={{ fontSize: 9.5 }}>
                Access
              </span>
              <span className="mono" style={{ fontSize: 11.5 }}>
                Read-only link, 14 days
              </span>
            </div>
          </div>
          <Link href="/evidence" className="btn" style={{ textAlign: 'center' }}>
            Browse source records
          </Link>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.5 }}>
            Pack generation runs against the evidence store; wire it to a background job before the
            first live audit.
          </span>
        </div>
      </div>
    </div>
  )
}
