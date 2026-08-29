import { ApiClientError, ErrorResponse, RequestOptions } from './types'

const API_BASE_URL = '/api/v1'

/**
 * Parse error response according to API contract
 */
function parseErrorResponse(response: Response, body: unknown): ApiClientError {
  if (body && typeof body === 'object' && 'error' in body) {
    const errorBody = body as ErrorResponse
    const { code, message, correlationId } = errorBody.error
    return new ApiClientError(code, message, correlationId)
  }

  // Fallback for malformed errors
  const correlationId = response.headers.get('X-Correlation-ID') || 'unknown'
  return new ApiClientError('UNKNOWN_ERROR', `HTTP ${response.status}: ${response.statusText}`, correlationId)
}

/**
 * Make an API request with error handling and correlation tracking
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { idempotencyKey, skipErrorParsing, ...fetchOptions } = options

  // Build headers
  const headers = new Headers(fetchOptions.headers || {})
  headers.set('Content-Type', 'application/json')

  if (idempotencyKey) {
    headers.set('Idempotency-Key', idempotencyKey)
  }

  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    let body: unknown
    try {
      body = await response.json()
    } catch {
      body = null
    }

    // Handle non-2xx responses
    if (!response.ok) {
      if (!skipErrorParsing) {
        throw parseErrorResponse(response, body)
      }
      throw new Error(`HTTP ${response.status}`)
    }

    // Return parsed response
    return body as T
  } catch (error) {
    // Re-throw API client errors as-is
    if (error instanceof ApiClientError) {
      throw error
    }

    // Network or other errors
    throw new ApiClientError(
      'NETWORK_ERROR',
      error instanceof Error ? error.message : 'Network request failed',
      'unknown'
    )
  }
}

/**
 * GET request helper
 */
export async function apiGet<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'GET' })
}

/**
 * POST request helper
 */
export async function apiPost<T>(
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * PATCH request helper
 */
export async function apiPatch<T>(
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * PUT request helper
 */
export async function apiPut<T>(
  endpoint: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * DELETE request helper
 */
export async function apiDelete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'DELETE' })
}

export { ApiClientError }
