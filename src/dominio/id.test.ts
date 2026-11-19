import { afterEach, describe, expect, it, vi } from 'vitest'
import { generarId } from './id'

describe('generarId', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('genera ids distintos', () => {
    expect(generarId()).not.toBe(generarId())
  })

  it('funciona sin crypto.randomUUID (red local sin HTTPS)', () => {
    vi.stubGlobal('crypto', {})
    const a = generarId()
    const b = generarId()
    expect(a).toMatch(/^[a-z0-9]+-[a-z0-9]+$/)
    expect(a).not.toBe(b)
  })
})
