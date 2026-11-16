import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { AuthPage } from '../pages/AuthPage'
import { useAuth } from '../hooks/AuthProvider'

type RequireAuthProps = {
  children: (user: User) => ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const auth = useAuth()

  if (auth.status === 'loading') {
    return <main className="status-page">Memeriksa sesi...</main>
  }

  if (
    auth.status === 'configuration-error' ||
    auth.status === 'error'
  ) {
    return (
      <main className="status-page" role="alert">
        <h1>Supabase belum siap</h1>
        <p>{auth.errorMessage}</p>
      </main>
    )
  }

  if (auth.status === 'authenticated') {
    return children(auth.user)
  }

  return <AuthPage />
}
