import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  api,
  tokenStore,
} from '@/services/api'

import { mapUser } from '@/services/mappers'

import type {
  Role,
  User,
} from '@/types'

type UserRegisterInput = {
  name: string
  email: string
  dateOfBirth: string
  password: string
  college?: string
}

type OrganizerRegisterInput = {
  organizationName: string
  email: string
  password: string
}

type AuthContextValue = {
  user: User | null
  loading: boolean

  login: (
    email: string,
    password: string
  ) => Promise<User>

  registerUser: (
    data: UserRegisterInput
  ) => Promise<User>

  registerOrganizer: (
    data: OrganizerRegisterInput
  ) => Promise<User>

  refreshUser: () => Promise<User | null>

  logout: () => Promise<void>
}

const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined)

/* ============================================================
   ROLE HOME
============================================================ */

export const roleHome = (
  role: Role
) =>
  role === 'admin'
    ? '/admin'
    : role === 'organizer'
      ? '/organizer'
      : '/dashboard'

/* ============================================================
   AUTH PROVIDER
============================================================ */

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [
    user,
    setUser,
  ] = useState<User | null>(
    null
  )

  const [
    loading,
    setLoading,
  ] = useState(true)

  /* ==========================================================
     REFRESH CURRENT USER
  ========================================================== */

  async function refreshUser() {
    const accessToken =
      tokenStore.getAccess()

    const refreshToken =
      tokenStore.getRefresh()

    if (
      !accessToken &&
      !refreshToken
    ) {
      setUser(null)

      return null
    }

    try {
      const body: any =
        await api('/auth/me', {
          auth: true,
        })

      const next =
        mapUser(body.data)

      setUser(next)

      return next
    } catch {
      tokenStore.clear()

      setUser(null)

      return null
    }
  }

  /* ==========================================================
     INITIAL AUTH CHECK
  ========================================================== */

  useEffect(() => {
    let active = true

    refreshUser()
      .catch(() => null)
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  /* ==========================================================
     LOGIN
  ========================================================== */

  async function login(
    email: string,
    password: string
  ) {
    const body: any =
      await api(
        '/auth/login',
        {
          method:
            'POST',

          body:
            JSON.stringify({
              email,
              password,
            }),
        }
      )

    tokenStore.set(
      body.data.accessToken,
      body.data.refreshToken
    )

    const next =
      mapUser(
        body.data.user
      )

    setUser(next)

    return next
  }

  /* ==========================================================
     REGISTER USER
  ========================================================== */

  async function registerUser(
    data: UserRegisterInput
  ) {
    await api(
      '/auth/register/user',
      {
        method:
          'POST',

        body:
          JSON.stringify(
            data
          ),
      }
    )

    return login(
      data.email,
      data.password
    )
  }

  /* ==========================================================
     REGISTER ORGANIZER
  ========================================================== */

  async function registerOrganizer(
    data: OrganizerRegisterInput
  ) {
    await api(
      '/auth/register/organizer',
      {
        method:
          'POST',

        body:
          JSON.stringify(
            data
          ),
      }
    )

    return login(
      data.email,
      data.password
    )
  }

  /* ==========================================================
     LOGOUT

     IMPORTANT:
     Clear frontend session immediately.

     The backend refresh-token revocation continues in the
     background so the UI does not wait for Render/network.
  ========================================================== */

  async function logout() {
    const refreshToken =
      tokenStore.getRefresh()

    /*
     * Immediately log user out locally.
     */
    tokenStore.clear()

    setUser(null)

    /*
     * Backend logout is best-effort.
     *
     * Do not block the user interface waiting for it.
     */
    if (refreshToken) {
      void api(
        '/auth/logout',
        {
          method:
            'POST',

          retry:
            false,

          body:
            JSON.stringify({
              refreshToken,
            }),
        }
      ).catch((error) => {
        console.warn(
          'Backend logout request failed:',
          error
        )
      })
    }
  }

  /* ==========================================================
     CONTEXT VALUE
  ========================================================== */

  const value =
    useMemo(
      () => ({
        user,
        loading,
        login,
        registerUser,
        registerOrganizer,
        refreshUser,
        logout,
      }),
      [
        user,
        loading,
      ]
    )

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

/* ============================================================
   USE AUTH
============================================================ */

export function useAuth() {
  const context =
    useContext(
      AuthContext
    )

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    )
  }

  return context
}