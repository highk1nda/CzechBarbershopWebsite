import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { user, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email, password)
    } catch {
      setError('Nesprávný e-mail nebo heslo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-stone shadow-soft p-8 space-y-5">
        <div>
          <h1 className="font-heading text-2xl text-ink">MAISON beauty</h1>
          <p className="font-body text-sm text-warm mt-1">Přihlášení do administrace</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="font-body text-xs tracking-wide uppercase text-mauve">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-stone px-3 py-2.5 font-body text-sm text-charcoal focus:outline-none focus:border-mauve"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="font-body text-xs tracking-wide uppercase text-mauve">Heslo</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-stone px-3 py-2.5 font-body text-sm text-charcoal focus:outline-none focus:border-mauve"
          />
        </div>

        {error && <p className="font-body text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-mauve text-white font-body text-xs tracking-widest2 uppercase px-6 py-3 hover:bg-mauve-deep transition-colors disabled:opacity-50"
        >
          {submitting ? 'Přihlašování…' : 'Přihlásit se'}
        </button>
      </form>
    </div>
  )
}
