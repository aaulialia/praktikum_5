import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseClient } from '../lib/supabase'

type AuthState =
  | { status: 'loading'; user: null; errorMessage: null }
  | { status: 'unauthenticated'; user: null; errorMessage: null }
  | { status: 'authenticated'; user: User; errorMessage: null }
  | {
      status: 'configuration-error' | 'error'
      user: null
      errorMessage: string
    }

type AuthActionResult = {
  error: string | null
  emailConfirmationRequired?: boolean
}

type AuthContextValue = AuthState & {
  signUp: (email: string, password: string) => Promise<AuthActionResult>
  signIn: (email: string, password: string) => Promise<AuthActionResult>
  signOut: () => Promise<AuthActionResult>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Terjadi kesalahan saat memeriksa sesi Supabase.'
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({
    status: 'loading',
    user: null,
    errorMessage: null,
  })

  useEffect(() => {
    let supabase: ReturnType<typeof getSupabaseClient>

    try {
      supabase = getSupabaseClient()
    } catch (error) {
      setState({
        status: 'configuration-error',
        user: null,
        errorMessage: getErrorMessage(error),
      })
      return
    }

    let isActive = true
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isActive) {
        return
      }

      setState(
        session?.user
          ? { status: 'authenticated', user: session.user, errorMessage: null }
          : { status: 'unauthenticated', user: null, errorMessage: null },
      )
    })

    void supabase.auth
      .getSession()
      .then(({ data: sessionData, error }) => {
        if (!isActive) {
          return
        }

        if (error) {
          setState({
            status: 'error',
            user: null,
            errorMessage: error.message,
          })
          return
        }

        setState(
          sessionData.session?.user
            ? {
                status: 'authenticated',
                user: sessionData.session.user,
                errorMessage: null,
              }
            : { status: 'unauthenticated', user: null, errorMessage: null },
        )
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({
            status: 'error',
            user: null,
            errorMessage: getErrorMessage(error),
          })
        }
      })

    return () => {
      isActive = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function signUp(
    email: string,
    password: string,
  ): Promise<AuthActionResult> {
    const { data, error } = await getSupabaseClient().auth.signUp({
      email,
      password,
    })

    return {
      error: error?.message ?? null,
      emailConfirmationRequired: !error && !data.session,
    }
  }

  async function signIn(
    email: string,
    password: string,
  ): Promise<AuthActionResult> {
    const { error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    })

    return { error: error?.message ?? null }
  }

  async function signOut(): Promise<AuthActionResult> {
    const { error } = await getSupabaseClient().auth.signOut()
    return { error: error?.message ?? null }
  }

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider.')
  }

  return context
}
