'use client'

/**
 * Every local screen needs the same three answers before it can render:
 * still reading, nothing imported, or here is the register. This holds them
 * in one place so the screens themselves only ever see a loaded pack.
 */
import Link from 'next/link'
import type { ParsedPack } from '@/lib/pack'
import { useLocalPack } from './provider'

export function PackGate({ children }: { children: (pack: ParsedPack) => React.ReactNode }) {
  const { pack, loading, error } = useLocalPack()

  if (loading)
    return (
      <div className="mono" style={{ padding: 30, fontSize: 12, color: 'var(--muted)' }}>
        Reading the pack held in this browser…
      </div>
    )

  if (error)
    return (
      <div className="block" style={{ maxWidth: 560 }}>
        <div className="eyebrow">Local mode</div>
        <p style={{ fontSize: 13, color: 'var(--warn)', lineHeight: 1.6 }}>{error}</p>
        <Link href="/local/import" className="btn" style={{ alignSelf: 'flex-start' }}>
          Open a pack
        </Link>
      </div>
    )

  if (!pack)
    return (
      <div className="block" style={{ maxWidth: 560 }}>
        <div className="eyebrow">Local mode</div>
        <div style={{ font: '500 22px/1.2 Inter, sans-serif', letterSpacing: '-0.02em' }}>
          Nothing imported yet
        </div>
        <p style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.6 }}>
          Local mode reads a compliance pack — the folder{' '}
          <span className="mono">bun run export:pack</span> writes, or a zip of it — and keeps it in
          this browser. Nothing is uploaded.
        </p>
        <Link href="/local/import" className="btn" style={{ alignSelf: 'flex-start' }}>
          Open a pack
        </Link>
      </div>
    )

  return <>{children(pack)}</>
}
