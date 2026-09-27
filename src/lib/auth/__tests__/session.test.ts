import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  clearSession,
  getAccessToken,
  getSession,
  saveSession,
  sessionStorageKey,
} from '../session'

describe('auth session helpers', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  afterEach(() => {
    window.sessionStorage.clear()
  })

  it('stores an authenticated session in sessionStorage', () => {
    saveSession({
      accessToken: 'token-123',
      refreshToken: 'refresh-123',
      user: { id: 'user-1', email: 'user@example.com' },
      expiresAt: '2026-10-01T00:00:00.000Z',
    })

    const saved = getSession()

    expect(saved.accessToken).toBe('token-123')
    expect(saved.refreshToken).toBe('refresh-123')
    expect(saved.user).toEqual({ id: 'user-1', email: 'user@example.com' })
    expect(saved.isAuthenticated).toBe(true)
    expect(window.sessionStorage.getItem(sessionStorageKey)).toContain('token-123')
  })

  it('returns null for missing or invalid persisted session data', () => {
    window.sessionStorage.setItem(sessionStorageKey, '{invalid-json')

    expect(getSession()).toEqual({
      accessToken: null,
      refreshToken: null,
      user: null,
      expiresAt: null,
      isAuthenticated: false,
    })
    expect(getAccessToken()).toBeNull()
  })

  it('removes the session and clears auth tokens', () => {
    saveSession({
      accessToken: 'token-123',
      refreshToken: 'refresh-123',
      user: { id: 'user-1' },
      expiresAt: '2026-10-01T00:00:00.000Z',
    })

    clearSession()

    expect(getSession().isAuthenticated).toBe(false)
    expect(getAccessToken()).toBeNull()
    expect(window.sessionStorage.getItem(sessionStorageKey)).toBeNull()
  })
})
