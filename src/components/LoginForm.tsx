'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

/** `next` is already validated as a same-site path by the login page. */
export function LoginForm({ next }: { next: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
    })
    setBusy(false)
    if (!res.ok) return setError('Those credentials were not accepted.')
    router.replace(next)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input
        className="input"
        style={{ width: '100%' }}
        name="email"
        type="email"
        required
        placeholder="you@dermaster.local"
        autoFocus
      />
      <input
        className="input"
        style={{ width: '100%' }}
        name="password"
        type="password"
        required
        placeholder="Password"
      />
      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
      {error && (
        <span className="mono" style={{ fontSize: 11, color: 'var(--warn)' }}>
          {error}
        </span>
      )}
    </form>
  )
}
