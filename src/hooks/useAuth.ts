import { useCallback, useEffect, useState } from 'react'
import { loginUser, logoutUser, refreshSession } from '../lib/api/auth'
import { AuthUser, getSession, clearSession, saveSession } from '../lib/auth/session'
import { useCartMerge } from './useCartMerge'

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  expiresAt: string | null
  login: (payload: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export function useAuth(): AuthState {
  const [session, setSession] = useState(() => getSession())
  const { mergeGuestCart } = useCartMerge()

  const syncSession = useCallback(() => {
    setSession(getSession())
  }, [])

  useEffect(() => {
    syncSession()
  }, [syncSession])

  const login = useCallback(async (payload: { email: string; password: string }) => {
    const result = await loginUser(payload)

    saveSession({
      accessToken: result.accessToken ?? null,
      refreshToken: result.refreshToken ?? null,
      user: result.user ?? null,
      expiresAt: result.expiresAt ?? null,
    })

    setSession({
      accessToken: result.accessToken ?? null,
      refreshToken: result.refreshToken ?? null,
      user: result.user ?? null,
      expiresAt: result.expiresAt ?? null,
      isAuthenticated: Boolean(result.accessToken),
    })

    await mergeGuestCart()
  }, [mergeGuestCart])

  const logout = useCallback(async () => {
    try {
      await logoutUser()
    } finally {
      clearSession()
      setSession({
        accessToken: null,
        refreshToken: null,
        user: null,
        expiresAt: null,
        isAuthenticated: false,
      })
    }
  }, [])

  const refresh = useCallback(async () => {
    const refreshed = await refreshSession()

    if (!refreshed) {
      clearSession()
      setSession({
        accessToken: null,
        refreshToken: null,
        user: null,
        expiresAt: null,
        isAuthenticated: false,
      })
      return
    }

    saveSession({
      accessToken: refreshed.accessToken ?? null,
      refreshToken: refreshed.refreshToken ?? null,
      user: refreshed.user ?? null,
      expiresAt: refreshed.expiresAt ?? null,
    })

    setSession({
      accessToken: refreshed.accessToken ?? null,
      refreshToken: refreshed.refreshToken ?? null,
      user: refreshed.user ?? null,
      expiresAt: refreshed.expiresAt ?? null,
      isAuthenticated: Boolean(refreshed.accessToken),
    })
  }, [])

  return {
    user: session.user,
    isAuthenticated: session.isAuthenticated,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
    login,
    logout,
    refresh,
  }
}
