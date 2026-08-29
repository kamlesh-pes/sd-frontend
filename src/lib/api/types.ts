/**
 * API error response format per API contract
 */
export interface ApiError {
  code: string
  message: string
  correlationId: string
}

/**
 * Standard API error response shape
 */
export interface ErrorResponse {
  error: ApiError
}

/**
 * Request options for API calls
 */
export interface RequestOptions extends RequestInit {
  /**
   * Custom idempotency key for requests that require it (e.g., order creation)
   */
  idempotencyKey?: string
  /**
   * Skip automatic error parsing if true
   */
  skipErrorParsing?: boolean
}

/**
 * Standard successful API response (may vary per endpoint)
 */
export interface ApiResponse<T> {
  data?: T
  [key: string]: unknown
}

/**
 * Thrown when API returns an error
 */
export class ApiClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public correlationId: string
  ) {
    super(message)
    this.name = 'ApiClientError'
    Object.setPrototypeOf(this, ApiClientError.prototype)
  }
}
