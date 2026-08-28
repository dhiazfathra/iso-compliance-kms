import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { loadGraph } from '@/lib/data'
import { requireUser } from '@/lib/auth'
import { hasLevel } from '@/lib/access'
import { fmtDate } from '@/lib/format'
import { RequestPack } from '@/components/RequestPack'
import { PACK_TTL_DAYS } from '@/lib/audit-pack'

export const dynamic = 'force-dynamic'

export default async function AuditPackPage() {
  const graph = await loadGraph()
  const user = await requireUser()
  const payload = await getPayload({ config })
  const packs = await payload.find({
    collection: 'audit-packs',
    sort: '-requestedAt',
    limit: 8,
    depth: 1,
    overrideAccess: false,
    user,
  })
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

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="section-head">
              <span className="eyebrow">Exports</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                kept {PACK_TTL_DAYS} days
              </span>
            </div>
            {packs.docs.length === 0 && (
              <div style={{ fontSize: 12.5, color: 'var(--muted)', padding: '12px 0' }}>
                No pack has been exported yet.
              </div>
            )}
            {packs.docs.map((p) => (
              <div
                key={p.packId}
                className="row responsive-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px minmax(0,1fr) 120px 110px 96px',
                  gap: 14,
                  alignItems: 'center',
                  padding: '12px 0',
                }}
              >
                <span className="mono" style={{ fontSize: 11.5 }}>
                  {p.packId}
                </span>
                <span style={{ fontSize: 12.5, color: 'var(--secondary)' }}>
                  {p.status === 'failed' ? (p.error ?? 'Export failed') : p.scope}
                </span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {fmtDate(p.requestedAt)}
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: p.status === 'ready' ? 'var(--ink)' : 'var(--muted)',
                  }}
                >
                  {p.status === 'ready'
                    ? `${Math.max(1, Math.round((p.size ?? 0) / 1024))} KB`
                    : p.status}
                </span>
                <span style={{ textAlign: 'right' }}>
                  {p.status === 'ready' ? (
                    <a
                      className="mono"
                      style={{ fontSize: 11.5 }}
                      href={`/audit-pack/${p.packId}/download`}
                    >
                      Download
                    </a>
                  ) : (
                    <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                      —
                    </span>
                  )}
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
          <RequestPack disabled={!hasLevel(user, 'write')} />
          <Link href="/evidence" className="btn btn-ghost" style={{ textAlign: 'center' }}>
            Browse source records
          </Link>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.5 }}>
            The ZIP is built after the request returns and kept for 14 days, then deleted from
            storage by the daily sweep.
          </span>
        </div>
      </div>
    </div>
  )
}
