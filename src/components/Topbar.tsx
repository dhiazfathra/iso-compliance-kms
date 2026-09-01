'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const TITLES: [RegExp, string, string][] = [
  [/^\/$/, 'Dashboard', 'Readiness, expiries and the last 24 hours of the audit trail'],
  [/^\/clauses/, 'Clause tree', 'Clause → policy → form → evidence, with cross-mapping'],
  [/^\/matrix/, 'Cross-map matrix', 'Forms and policies that satisfy more than one requirement'],
  [/^\/evidence\//, 'Evidence record', 'Metadata, version history and clause satisfaction'],
  [/^\/evidence/, 'Evidence register', 'Every uploaded record with expiry and owner'],
  [/^\/policies/, 'Policy versions', 'Controlled documents and their revision history'],
  [/^\/gaps/, 'Gaps & remediation', 'Open findings, owners and due dates'],
  [/^\/owners/, 'Owner workload', 'Requirement mix by accountable owner'],
  [/^\/audit-pack/, 'Audit pack', 'Hyperlinked export for the certification body'],
  [/^\/audit-session/, 'Audit session', 'Read-only presenting mirror'],
]

export function Topbar({
  user,
  base = '',
}: {
  user: { name: string; access?: string | null }
  /** `''` hosted, `'/local'` in local mode; stripped before the title lookup. */
  base?: string
}) {
  const path = usePathname()
  const router = useRouter()
  const [now, setNow] = useState<string>('')

  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Jakarta',
        }).format(new Date()) + ' WIB',
      )
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  const here = base && path.startsWith(base) ? path.slice(base.length) || '/' : path
  const match = TITLES.find(([re]) => re.test(here))
  const title = match ? match[1] : 'Compliance Repository'
  const sub = match ? match[2] : ''

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, minWidth: 0 }}>
        <span style={{ font: '500 14.5px Inter, sans-serif', letterSpacing: '-0.01em' }}>
          {title}
        </span>
        <span
          className="mono"
          style={{
            fontSize: 11,
            color: 'var(--muted)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {sub}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
        {/* suppressHydrationWarning: the clock is client-only by design. */}
        <div
          className="mono"
          style={{ fontSize: 11, color: 'var(--muted)' }}
          suppressHydrationWarning
        >
          {now}
        </div>
        <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
          {user.name}
          {user.access === 'read' ? ' · read-only' : ''}
        </span>
        <Link href={`${base}/audit-session`} className="btn">
          Audit session
        </Link>
        {base ? (
          // Local mode has no account to sign out of; the way out is the pack.
          <Link href={`${base}/import`} className="btn btn-ghost">
            Manage pack
          </Link>
        ) : (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={async () => {
              await fetch('/api/users/logout', { method: 'POST' })
              router.replace('/login')
              router.refresh()
            }}
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  )
}
