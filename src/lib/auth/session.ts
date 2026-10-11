export const sessionStorageKey = 'sd-auth-session'
export const authSessionChangeEvent = 'sd-auth-session-change'

export interface AuthUser {
  id?: string
  email?: string
  mobile?: string
  [key: string]: unknown
}

function hasAdminRoleValue(value: unknown): boolean {
  if (typeof value === 'string') {
    const role = value.trim().toUpperCase()
    return role === 'ADMIN' || role === 'ROLE_ADMIN'
  }

  if (Array.isArray(value)) {
    return value.some(hasAdminRoleValue)
  }

  if (value && typeof value === 'object' && 'authority' in value) {
    return hasAdminRoleValue(value.authority)
  }

  return false
}

export function hasAdminRole(user: AuthUser | null): boolean {
  return Boolean(
    user &&
      (hasAdminRoleValue(user.role) ||
        hasAdminRoleValue(user.roles) ||
        hasAdminRoleValue(user.authorities))
  )
}

export interface AuthSession {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  expiresAt: string | null
  isAuthenticated: boolean
}

const emptySession: AuthSession = {
  accessToken: null,
  refreshToken: null,
  user: null,
  expiresAt: null,
  isAuthenticated: false,
}

export function saveSession(session: Partial<AuthSession> & { accessToken: string; refreshToken?: string | null; user?: AuthUser | null; expiresAt?: string |null }): void {
  const nextSession: AuthSession = {
    accessToken: session.accessToken ?? null,
    refreshToken: session.refreshToken ?? null,
    user: session.user ?? null,
    expiresAt: session.expiresAt ?? null,
    isAuthenticated: Boolean(session.accessToken),
  }

  window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(nextSession))
  window.dispatchEvent(new Event(authSessionChangeEvent))
}

export function getSession(): AuthSession {
  try {
    const raw = window.sessionStorage.getItem(sessionStorageKey)

    if (!raw) {
      return { ...emptySession }
    }

    const parsed = JSON.parse(raw) as Partial<AuthSession>
    const accessToken = typeof parsed.accessToken === 'string' ? parsed.accessToken : null
    const refreshToken = typeof parsed.refreshToken === 'string' ? parsed.refreshToken : null
    const user = parsed.user && typeof parsed.user === 'object' ? (parsed.user as AuthUser) : null
    const expiresAt = typeof parsed.expiresAt === 'string' ? parsed.expiresAt : null

    const isAuthenticated = Boolean(accessToken) && (!expiresAt || new Date(expiresAt).getTime() > Date.now())

    if (!isAuthenticated && raw) {
      window.sessionStorage.removeItem(sessionStorageKey)
    }

    return {
      accessToken,
      refreshToken,
      user,
      expiresAt,
      isAuthenticated,
    }
  } catch {
    window.sessionStorage.removeItem(sessionStorageKey)
    return { ...emptySession }
  }
}

export function getAccessToken(): string | null {
  const session = getSession()
  return session.isAuthenticated ? session.accessToken : null
}

export function clearSession(): void {
  window.sessionStorage.removeItem(sessionStorageKey)
  window.dispatchEvent(new Event(authSessionChangeEvent))
}
