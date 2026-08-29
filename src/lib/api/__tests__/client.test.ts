import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiRequest, apiGet, apiPost, apiPatch, apiPut, apiDelete, ApiClientError } from '../client'

// Mock fetch globally
const mockFetch = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch)
  mockFetch.mockClear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('API Client', () => {
  describe('apiRequest', () => {
    it('makes a GET request to the correct URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: { id: 1 } }),
        headers: new Headers(),
      })

      await apiRequest('/products', { method: 'GET' })

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/products',
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('returns parsed JSON response on success', async () => {
      const mockData = { id: 1, name: 'Product' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
        headers: new Headers(),
      })

      const result = await apiRequest('/products/1')

      expect(result).toEqual(mockData)
    })

    it('throws ApiClientError on API error response', async () => {
      const errorResponse = {
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
          correlationId: 'req-123',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => errorResponse,
        headers: new Headers(),
      })

      await expect(apiRequest('/products/999')).rejects.toThrow(ApiClientError)
      await expect(apiRequest('/products/999')).rejects.toMatchObject({
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found',
        correlationId: 'req-123',
      })
    })

    it('throws ApiClientError on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failed'))

      await expect(apiRequest('/products')).rejects.toThrow(ApiClientError)
      await expect(apiRequest('/products')).rejects.toMatchObject({
        code: 'NETWORK_ERROR',
      })
    })

    it('handles malformed error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}), // No error field
        headers: new Headers(),
      })

      await expect(apiRequest('/products')).rejects.toThrow(ApiClientError)
      await expect(apiRequest('/products')).rejects.toMatchObject({
        code: 'UNKNOWN_ERROR',
      })
    })

    it('sets Content-Type header to application/json', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers(),
      })

      await apiRequest('/products')

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[1].headers.get('Content-Type')).toBe('application/json')
    })

    it('includes idempotency key in headers when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers(),
      })

      await apiRequest('/orders', { idempotencyKey: 'uuid-123' })

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[1].headers.get('Idempotency-Key')).toBe('uuid-123')
    })

    it('serializes request body to JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers(),
      })

      const payload = { name: 'Product', price: 100 }
      await apiRequest('/products', { method: 'POST', body: JSON.stringify(payload) })

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[1].body).toBe(JSON.stringify(payload))
    })

    it('handles responses with no JSON body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => {
          throw new Error('No content')
        },
        headers: new Headers(),
      })

      const result = await apiRequest('/products/1', { method: 'DELETE' })
      expect(result).toBeNull()
    })

    it('skips error parsing when skipErrorParsing option is true', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: { code: 'BAD_REQUEST' } }),
        headers: new Headers(),
      })

      await expect(apiRequest('/products', { skipErrorParsing: true })).rejects.toThrow(
        'HTTP 400'
      )
    })
  })

  describe('HTTP method helpers', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
        headers: new Headers(),
      })
    })

    it('apiGet sends GET request', async () => {
      await apiGet('/products')
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/products',
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('apiPost sends POST request with body', async () => {
      const body = { name: 'Product' }
      await apiPost('/products', body)

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[1].method).toBe('POST')
      expect(callArgs[1].body).toBe(JSON.stringify(body))
    })

    it('apiPatch sends PATCH request with body', async () => {
      const body = { name: 'Updated' }
      await apiPatch('/products/1', body)

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[1].method).toBe('PATCH')
      expect(callArgs[1].body).toBe(JSON.stringify(body))
    })

    it('apiPut sends PUT request with body', async () => {
      const body = { discount: 10 }
      await apiPut('/products/1', body)

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[1].method).toBe('PUT')
      expect(callArgs[1].body).toBe(JSON.stringify(body))
    })

    it('apiDelete sends DELETE request', async () => {
      await apiDelete('/products/1')
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/products/1',
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })

  describe('Error handling', () => {
    it('preserves API error code and message', async () => {
      const errorResponse = {
        error: {
          code: 'INVALID_AUTH',
          message: 'Invalid credentials',
          correlationId: 'req-456',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => errorResponse,
        headers: new Headers(),
      })

      try {
        await apiRequest('/auth/login')
        expect.fail('Should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(ApiClientError)
        expect((error as ApiClientError).code).toBe('INVALID_AUTH')
        expect(error).toHaveProperty('message', 'Invalid credentials')
        expect((error as ApiClientError).correlationId).toBe('req-456')
      }
    })

    it('uses X-Correlation-ID header as fallback for missing correlationId', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
        headers: new Headers([['X-Correlation-ID', 'fallback-id']]),
      })

      try {
        await apiRequest('/products')
        expect.fail('Should have thrown')
      } catch (error) {
        expect((error as ApiClientError).correlationId).toBe('fallback-id')
      }
    })
  })

  describe('Request options', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({}),
        headers: new Headers(),
      })
    })

    it('merges custom headers with default headers', async () => {
      const headers = new Headers({
        'Authorization': 'Bearer token',
        'X-Custom-Header': 'value',
      })

      await apiRequest('/products', { headers })

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[1].headers.get('Authorization')).toBe('Bearer token')
      expect(callArgs[1].headers.get('X-Custom-Header')).toBe('value')
      expect(callArgs[1].headers.get('Content-Type')).toBe('application/json')
    })

    it('passes through other fetch options', async () => {
      await apiRequest('/products', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-cache',
      })

      const callArgs = mockFetch.mock.calls[0]
      expect(callArgs[1]).toMatchObject({
        credentials: 'include',
        cache: 'no-cache',
      })
    })
  })
})
