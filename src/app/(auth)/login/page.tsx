import { redirect } from 'next/navigation'
import { currentUser } from '@/lib/auth'
import { LoginForm } from '@/components/LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string; next?: string }>
}) {
  const { expired, next } = await searchParams
  if (await currentUser()) redirect(next || '/')

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: 'var(--bg)',
      }}
    >
      <div className="block" style={{ width: 'min(380px, 100%)', padding: 30 }}>
        <div className="eyebrow" style={{ paddingBottom: 6 }}>
          Dermaster ISMS
        </div>
        <div style={{ font: '500 22px/1.2 Inter, sans-serif', letterSpacing: '-0.02em' }}>
          Compliance repository
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--muted)', padding: '10px 0 18px' }}>
          {expired
            ? 'That audit session has expired. Ask your host for a new one.'
            : 'Sign in to read the repository. Every view is written to the audit trail.'}
        </p>
        <LoginForm next={next} />
      </div>
    </div>
  )
}
