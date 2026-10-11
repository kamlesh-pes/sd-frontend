import { apiGet, apiPost } from './client'
import { auth } from './endpoints'
import { hasAdminRole, saveSession, type AuthUser } from '../auth/session'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  firstName: string
  lastName: string
  password: string
  phone?: string
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function verifyAdminAccess(): Promise<boolean> {
  const response = await apiGet<unknown>(auth.me)
  const payload = isRecord(response) && 'data' in response ? response.data : response
  const user =
    isRecord(payload) && isRecord(payload.user)
      ? payload.user
      : isRecord(payload)
        ? payload
        : null

  return hasAdminRole(user as AuthUser | null)
}

export async function registerUser(payload: RegisterRequest): Promise<void> {
  await apiPost<unknown>(auth.register, payload)
}

export async function loginUser(payload: LoginRequest): Promise<AuthTokens> {
  const payloadResponse = await apiPost<AuthTokens | { data?: AuthTokens }>(auth.login, payload)
  const response =
    payloadResponse && typeof payloadResponse === 'object' && 'data' in payloadResponse
      ? payloadResponse.data
      : payloadResponse

  if (!response || typeof response.accessToken !== 'string' || !response.accessToken) {
    throw new Error('Login response did not include an access token.')
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
