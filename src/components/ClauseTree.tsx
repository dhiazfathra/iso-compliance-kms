'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { ClauseNode } from '@/lib/data'
import { STATUS_META, dueColor, fmtDate, relDue, type StatusKey } from '@/lib/format'
import { CrossMapChips } from './Badges'

const COLS = 'minmax(0,1fr) 190px 132px 112px 128px'

type Row = {
  key: string
  depth: number
  kind: 'clause' | 'policy' | 'form' | 'evidence'
  code: string
  label: string
  meta?: string
  cross: string[]
  status?: string
  owner?: string
  review?: string | null
  href?: string
  expandable?: boolean
}

function buildRows(clauses: ClauseNode[], open: Set<string>, base: string): Row[] {
  const rows: Row[] = []
  for (const c of clauses) {
    const clauseCross = new Set<string>()
    for (const p of c.policies) {
      for (const f of p.forms) {
        f.alsoSatisfies.forEach((x) => clauseCross.add(x))
        f.externalRefs.forEach((x) => clauseCross.add(x))
      }
    }
    rows.push({
      key: c.clauseId,
      depth: 0,
      kind: 'clause',
      code: c.clauseId,
      label: c.title,
      meta: c.standard,
      cross: [...clauseCross].filter((x) => x !== c.clauseId),
      status: c.status,
      owner: c.owner.name,
      review: c.nextReview,
      expandable: c.policies.length > 0,
    })
    if (!open.has(c.clauseId)) continue

    for (const p of c.policies) {
      const pk = `${c.clauseId}|${p.name}`
      rows.push({
        key: pk,
        depth: 1,
        kind: 'policy',
        code: p.version,
        label: p.name,
        meta: p.status,
        cross: p.clauses.filter((x) => x !== c.clauseId),
        href: `${base}/policies/${p.id}`,
        expandable: p.forms.length > 0,
      })
      if (!open.has(pk)) continue

      for (const f of p.forms) {
        const fk = `${pk}|${f.code}`
        rows.push({
          key: fk,
          depth: 2,
          kind: 'form',
          code: f.code,
          label: f.name,
          meta: `${f.evidence.length} items`,
          cross: [...f.alsoSatisfies, ...f.externalRefs],
          expandable: f.evidence.length > 0,
        })
        if (!open.has(fk)) continue

        for (const e of f.evidence) {
          rows.push({
            key: `${fk}|${e.id}`,
            depth: 3,
            kind: 'evidence',
            code: e.fileType,
            label: e.title,
            meta: fmtDate(e.uploadedAt),
            cross: e.satisfies.filter((x) => x !== c.clauseId),
            review: e.expiryDate,
            owner: e.uploader.name,
            href: `${base}/evidence/${e.id}`,
          })
        }
      }
    }
  }
  return rows
}

export function ClauseTree({
  clauses,
  initialOpen,
  base = '',
}: {
  clauses: ClauseNode[]
  initialOpen: string[]
  /** `''` hosted, `'/local'` in local mode. */
  base?: string
}) {
  const [open, setOpen] = useState<Set<string>>(new Set(initialOpen))
  const rows = buildRows(clauses, open, base)

  const allKeys = () => {
    const keys: string[] = []
    for (const c of clauses) {
      keys.push(c.clauseId)
      for (const p of c.policies) {
        keys.push(`${c.clauseId}|${p.name}`)
        for (const f of p.forms) keys.push(`${c.clauseId}|${p.name}|${f.code}`)
      }
    }
    return keys
  }

  const expanded = open.size > 0
  const toggle = (k: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 26px 0' }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
          {clauses.length} requirements
        </span>
        <button
          type="button"
          className="mono"
          onClick={() => setOpen(expanded ? new Set() : new Set(allKeys()))}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          {expanded ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <div className="grid-head" style={{ gridTemplateColumns: COLS }}>
        <span>Clause · policy · form · evidence</span>
        <span>Also satisfies</span>
        <span>Status</span>
        <span>Owner</span>
        <span style={{ textAlign: 'right' }}>Next review / expiry</span>
      </div>

      {rows.map((r) => {
        const meta = r.status ? STATUS_META[r.status as StatusKey] : undefined
        const label = (
          <span
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 10,
              padding: `11px 0 11px ${r.depth * 22}px`,
              minWidth: 0,
            }}
          >
            <span
              className="mono"
              style={{ fontSize: 10, color: 'var(--muted)', width: 9, flex: 'none' }}
            >
              {r.expandable ? (open.has(r.key) ? '−' : '+') : ''}
            </span>
            <span
              className="mono"
              style={{
                fontSize: 12,
                fontWeight: 500,
                flex: 'none',
                color: r.kind === 'clause' ? 'var(--ink)' : 'var(--muted)',
              }}
            >
              {r.code}
            </span>
            <span
              style={{
                fontSize: r.depth === 0 ? 13 : 12.5,
                fontWeight: r.depth === 0 ? 500 : 400,
                color: r.depth === 0 ? 'var(--ink)' : 'var(--secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {r.label}
            </span>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', flex: 'none' }}>
              {r.meta}
            </span>
          </span>
        )

        return (
          <div
            key={r.key}
            className="row responsive-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: COLS,
              gap: 18,
              alignItems: 'center',
              padding: '0 26px',
              background: r.depth ? 'var(--panel)' : 'transparent',
            }}
          >
            {r.expandable ? (
              <button
                type="button"
                onClick={() => toggle(r.key)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  cursor: 'pointer',
                  minWidth: 0,
                  color: 'inherit',
                  font: 'inherit',
                }}
              >
                {label}
              </button>
            ) : r.href ? (
              <Link href={r.href} style={{ color: 'var(--ink)', minWidth: 0 }}>
                {label}
              </Link>
            ) : (
              label
            )}

            <span style={{ overflow: 'hidden' }}>
              <CrossMapChips refs={r.cross} max={3} />
            </span>
            <span>
              {meta && (
                <span
                  className="chip"
                  style={{ color: meta.color, background: meta.bg, borderColor: meta.border }}
                >
                  {meta.label}
                </span>
              )}
            </span>
            <span style={{ fontSize: 12, color: 'var(--secondary)' }}>{r.owner ?? ''}</span>
            <span
              className="mono"
              style={{ fontSize: 11, textAlign: 'right', color: dueColor(r.review) }}
              title={relDue(r.review)}
            >
              {r.review ? `${fmtDate(r.review)} · ${relDue(r.review)}` : ''}
            </span>
          </div>
        )
      })}

      {!rows.length && (
        <div style={{ padding: '40px 26px', color: 'var(--muted)', fontSize: 13 }}>
          No requirement matches this filter.
        </div>
      )}
    </div>
  )
}
