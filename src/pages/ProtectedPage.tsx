import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useAuth } from '../hooks/AuthProvider'

type ProtectedPageProps = {
  user: User
}

export function ProtectedPage({ user }: ProtectedPageProps) {
  const { signOut } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setErrorMessage(null)
    setIsSigningOut(true)

    try {
      const result = await signOut()
      if (result.error) {
        setErrorMessage(result.error)
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Tidak dapat keluar. Silakan coba lagi.',
      )
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <main className="status-page">
      <h1>Sesi aktif</h1>
      <p>Anda masuk sebagai {user.email}.</p>
      {errorMessage && (
        <p className="form-message error-message" role="alert">
          {errorMessage}
        </p>
      )}
      <button disabled={isSigningOut} onClick={handleSignOut} type="button">
        {isSigningOut ? 'Memproses...' : 'Keluar'}
      </button>
    </main>
  )
}
