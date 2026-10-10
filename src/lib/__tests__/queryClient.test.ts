import { describe, it, expect } from 'vitest'
import { queryClient } from '../queryClient'

describe('query client', () => {
  it('creates a shared cache instance', () => {
    expect(queryClient).toBeDefined()
    expect(typeof queryClient.invalidateQueries).toBe('function')
    expect(typeof queryClient.getQueryData).toBe('function')
  })
})
