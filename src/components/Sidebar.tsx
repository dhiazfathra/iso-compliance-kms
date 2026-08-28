'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Counts = { clauses: number; evidence: number; gaps: number }

export function Sidebar({ counts }: { counts: Counts }) {
  const path = usePathname()
  const groups: { label: string; items: { href: string; label: string; count?: number; tone?: string }[] }[] = [
    {
      label: 'Workspace',
      items: [
        { href: '/', label: 'Dashboard' },
        { href: '/clauses', label: 'Clause tree', count: counts.clauses },
        { href: '/matrix', label: 'Cross-map matrix' },
      ],
    },
    {
      label: 'Records',
      items: [
        { href: '/evidence', label: 'Evidence', count: counts.evidence },
        { href: '/policies', label: 'Policy versions' },
      ],
    },
    {
      label: 'Operate',
      items: [
        { href: '/gaps', label: 'Gaps & remediation', count: counts.gaps, tone: 'var(--warn)' },
        { href: '/owners', label: 'Owner workload' },
        { href: '/audit-pack', label: 'Audit pack' },
      ],
    },
  ]

  const active = (href: string) => (href === '/' ? path === '/' : path.startsWith(href))

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div className="eyebrow">Dermaster · ISMS</div>
        <div style={{ marginTop: 9, font: '500 15.5px/1.25 Inter, sans-serif', letterSpacing: '-0.015em' }}>
          Compliance Repository
        </div>
        <div style={{ marginTop: 5, color: 'var(--muted)' }} className="mono">
          <span style={{ fontSize: 11.5 }}>ISO 27001:2022 · ISO 9001:2015</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {groups.map((g) => (
          <div className="nav-group" key={g.label}>
            <div className="eyebrow">{g.label}</div>
            {g.items.map((i) => (
              <Link key={i.href} href={i.href} className="nav-link" data-active={active(i.href)}>
                <span>{i.label}</span>
                {typeof i.count === 'number' && (
                  <span className="nav-count" style={i.tone ? { color: i.tone } : undefined}>
                    {i.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div style={{ fontSize: 12.5, fontWeight: 500 }}>Ratna Wijaya</div>
        <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
          Compliance Manager · write
        </div>
      </div>
    </aside>
  )
}
