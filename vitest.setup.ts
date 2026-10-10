import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './src/test/server'

beforeAll(() => {
  const originalFetch = globalThis.fetch.bind(globalThis)

  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const target = typeof input === 'string' && input.startsWith('/') ? `http://localhost${input}` : input
    return originalFetch(target as RequestInfo | URL, init)
  }) as typeof fetch

  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
