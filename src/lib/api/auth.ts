import { apiPost } from './client'
import { auth } from './endpoints'
import { saveSession } from '../lib/auth/session'

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  user?: {
    id?: string
    email?: string
    mobile?: string
    [key: string]: unknown
  }
  expiresAt?: string
}

export async function loginUser(payload: LoginRequest): Promise<AuthTokens> {
  const response = await apiPost<AuthTokens>(auth.login, payload)

  const nextSession = {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken ?? null,
    user: response.user ?? null,
    expiresAt: response.expiresAt ?? null,
  }

  saveSession(nextSession)

  return response
}

export async function logoutUser(): Promise<void> {
  try {
    await apiPost(auth.logout, {})
  } finally {
    const session = window.sessionStorage.getItem('sd-auth-session')
    if (session) {
      window.sessionStorage.removeItem('sd-auth-session')
    }
  }
}

export async function refreshSession(): Promise<AuthTokens | null> {
  const response = await apiPost<AuthTokens | null>(auth.refresh, {})

  if (!response) {
    return null
  }

  const nextSession = {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken ?? null,
    user: response.user ?? null,
    expiresAt: response.expiresAt ?? null,
  }

  saveSession(nextSession)

  return response
}
