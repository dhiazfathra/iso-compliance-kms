import { redirect } from 'next/navigation'
import { sessionState } from '@/lib/auth'
import { safeNext } from '@/lib/access'
import { LoginForm } from '@/components/LoginForm'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string; next?: string }>
}) {
  const { expired, next: rawNext } = await searchParams
  // Sanitised once, here, so the client form only ever receives a safe path.
  const next = safeNext(rawNext)
  // A user whose audit session has expired still holds a valid cookie; they
  // belong on this page, not bounced back into the app.
  const { user, live } = await sessionState()
  if (user && live) redirect(next)

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
