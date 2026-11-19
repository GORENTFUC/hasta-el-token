import { describe, expect, it } from 'vitest'
import { formatearNumero, textoCofres } from './formato'

describe('formato', () => {
  it('usa singular y plural de "cofre"', () => {
    expect(textoCofres(1)).toBe('1 cofre')
    expect(textoCofres(0)).toBe('0 cofres')
    expect(textoCofres(3)).toBe('3 cofres')
  })

  it('formatea números con coma decimal y null como guion', () => {
    expect(formatearNumero(2.25)).toBe('2,3')
    expect(formatearNumero(null)).toBe('—')
  })
})
