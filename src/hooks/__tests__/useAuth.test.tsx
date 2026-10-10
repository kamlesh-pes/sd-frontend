import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuth } from '../useAuth'
import { guestCartStore } from '../../state/guestCart'

const mockLoginUser = vi.fn()
const mockLogoutUser = vi.fn()
const mockRefreshSession = vi.fn()
const mockMergeGuestCartIntoServerCart = vi.fn()

vi.mock('../../lib/api/auth', () => ({
  loginUser: (...args: unknown[]) => mockLoginUser(...args),
  logoutUser: (...args: unknown[]) => mockLogoutUser(...args),
  refreshSession: (...args: unknown[]) => mockRefreshSession(...args),
}))

vi.mock('../../lib/api/cart', () => ({
  mergeGuestCartIntoServerCart: (...args: unknown[]) => mockMergeGuestCartIntoServerCart(...args),
}))

describe('useAuth', () => {
  const futureExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString()

  beforeEach(() => {
    window.sessionStorage.clear()
    window.localStorage.clear()
    guestCartStore.getState().clear()
    mockLoginUser.mockReset()
    mockLogoutUser.mockReset()
    mockRefreshSession.mockReset()
    mockMergeGuestCartIntoServerCart.mockReset()
  })

  it('logs user in and stores the session', async () => {
    mockLoginUser.mockResolvedValue({
      accessToken: 'token-123',
      refreshToken: 'refresh-123',
      user: { id: 'user-1', email: 'user@example.com' },
      expiresAt: futureExpiry,
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login({ email: 'user@example.com', password: 'secret' })
    })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })

    expect(result.current.user).toMatchObject({ email: 'user@example.com' })
    expect(window.sessionStorage.length).toBeGreaterThan(0)
  })

  it('merges guest cart items into the server cart after successful login', async () => {
    mockLoginUser.mockResolvedValue({
      accessToken: 'token-123',
      refreshToken: 'refresh-123',
      user: { id: 'user-1', email: 'user@example.com' },
      expiresAt: futureExpiry,
    })
    mockMergeGuestCartIntoServerCart.mockResolvedValue(undefined)
    guestCartStore.getState().addItem({
      productId: 'product-1',
      name: 'Mechanical Keyboard',
      quantity: 1,
      unitPrice: '79.00',
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login({ email: 'user@example.com', password: 'secret' })
    })

    expect(mockMergeGuestCartIntoServerCart).toHaveBeenCalledTimes(1)
    expect(mockMergeGuestCartIntoServerCart).toHaveBeenCalledWith([
      {
        productId: 'product-1',
        name: 'Mechanical Keyboard',
        quantity: 1,
        unitPrice: '79.00',
      },
    ])
    expect(guestCartStore.getState().items).toHaveLength(0)
  })

  it('clears the session when logging out', async () => {
    mockLogoutUser.mockResolvedValue(undefined)
    window.sessionStorage.setItem(
      'sd-auth-session',
      JSON.stringify({
        accessToken: 'token-123',
        refreshToken: 'refresh-123',
        user: { id: 'user-1', email: 'user@example.com' },
        expiresAt: futureExpiry,
      })
    )

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(mockLogoutUser).toHaveBeenCalledTimes(1)
  })
})
