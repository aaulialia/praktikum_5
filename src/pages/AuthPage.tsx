import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/AuthProvider'

type AuthMode = 'sign-in' | 'sign-up'

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Terjadi kesalahan. Silakan coba lagi.'
}

export function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSubmitting(true)

    try {
      const result =
        mode === 'sign-in'
          ? await signIn(email, password)
          : await signUp(email, password)

      if (result.error) {
        setErrorMessage(result.error)
      } else if (result.emailConfirmationRequired) {
        setSuccessMessage('Periksa email Anda untuk mengonfirmasi pendaftaran.')
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const isSigningIn = mode === 'sign-in'

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <h1 id="auth-title">{isSigningIn ? 'Masuk' : 'Buat akun'}</h1>
        <p>
          {isSigningIn
            ? 'Masuk untuk melanjutkan ke pengelola tugas.'
            : 'Daftar dengan email dan kata sandi.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            autoComplete="email"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />

          <label htmlFor="password">Kata sandi</label>
          <input
            autoComplete={isSigningIn ? 'current-password' : 'new-password'}
            id="password"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />

          {errorMessage && (
            <p className="form-message error-message" role="alert">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="form-message success-message" role="status">
              {successMessage}
            </p>
          )}

          <button disabled={isSubmitting} type="submit">
            {isSubmitting
              ? 'Memproses...'
              : isSigningIn
                ? 'Masuk'
                : 'Daftar'}
          </button>
        </form>

        <p className="auth-switch">
          {isSigningIn ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <button
            className="text-button"
            onClick={() => changeMode(isSigningIn ? 'sign-up' : 'sign-in')}
            type="button"
          >
            {isSigningIn ? 'Daftar' : 'Masuk'}
          </button>
        </p>
      </section>
    </main>
  )
}
