import { loadGraph } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function MatrixPage() {
  const graph = await loadGraph()

  // Only requirements that an artefact actually points at become columns:
  // a matrix of every clause would be mostly empty and unreadable.
  const rows = graph.forms
    .map((f) => {
      const policy = graph.policies.find((p) => p.id === f.policy)
      const hits = new Map<string, 'primary' | 'cross'>()
      hits.set(f.primaryClause, 'primary')
      for (const x of f.alsoSatisfies) if (!hits.has(x)) hits.set(x, 'cross')
      return { form: f, policy, hits }
    })
    .filter((r) => r.hits.size > 1)

  const columns = graph.clauses.filter((c) => rows.some((r) => r.hits.has(c.clauseId)))
  const cols = `300px repeat(${columns.length}, 34px) 180px`

  return (
    <div className="block">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: '62ch' }}>
          <div className="eyebrow">Cross-mapping · {rows.length} shared artefacts</div>
          <div style={{ font: '500 22px/1.25 Inter, sans-serif', letterSpacing: '-0.02em' }}>
            Forms and policies that satisfy more than one requirement
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--secondary)' }}>
            One filled mark is the requirement the artefact was written for. Open marks are the
            requirements it also satisfies, so an auditor asking about either standard is shown the
            same record.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 22, flex: 'none', paddingBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 9, height: 9, background: 'var(--ink)', display: 'block' }} />
            <span className="mono" style={{ fontSize: 11, color: 'var(--secondary)' }}>
              primary
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{ width: 9, height: 9, border: '1px solid var(--accent)', display: 'block' }}
            />
            <span className="mono" style={{ fontSize: 11, color: 'var(--secondary)' }}>
              also satisfies
            </span>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ minWidth: 'max-content' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: cols,
              alignItems: 'end',
              borderBottom: '1px solid var(--line-strong)',
              paddingBottom: 10,
            }}
          >
            <span className="eyebrow" style={{ fontSize: 9.5, alignSelf: 'end' }}>
              Form · policy
            </span>
            {columns.map((c) => (
              <span key={c.clauseId} className="mx-colhead">
                <span className="mono mx-colhead-id">{c.clauseId}</span>
                <span className="mono mx-colhead-std">{c.standard}</span>
              </span>
            ))}
            <span className="eyebrow" style={{ fontSize: 9.5, paddingLeft: 14, alignSelf: 'end' }}>
              Outside tracked scope
            </span>
          </div>

          {rows.map(({ form, policy, hits }) => (
            <div
              key={form.id}
              className="row"
              style={{ display: 'grid', gridTemplateColumns: cols, alignItems: 'center' }}
            >
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  padding: '9px 12px 9px 0',
                  minWidth: 0,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--accent)' }}>
                    {form.code}
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {form.name}
                  </span>
                </span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
                  {policy?.name}
                </span>
              </span>
              {columns.map((c) => {
                const mark = hits.get(c.clauseId)
                return (
                  <span
                    key={c.clauseId}
                    className="mx-cell"
                    {...(mark && { title: `${form.code} → ${c.clauseId} (${mark})` })}
                  >
                    {mark && (
                      <span className={mark === 'primary' ? 'mx-mark' : 'mx-mark mx-mark-cross'} />
                    )}
                  </span>
                )
              })}
              <span
                className="mono"
                style={{
                  fontSize: 10.5,
                  color: 'var(--muted)',
                  paddingLeft: 14,
                  borderLeft: '1px solid var(--line)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {form.externalRefs.join(' · ') || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
