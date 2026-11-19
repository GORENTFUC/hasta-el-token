import { describe, expect, it } from 'vitest'
import { calcularEstadisticas, contarPorTipo } from './estadisticas'
import type { Apertura, Ronda, TipoCofre } from './tipos'

const F = '2026-11-20T10:00:00.000Z'

function aperturas(...tipos: TipoCofre[]): Apertura[] {
  return tipos.map((tipo) => ({ tipo, fecha: F }))
}

function ronda(id: string, ...tipos: TipoCofre[]): Ronda {
  return { id, inicio: F, fin: F, aperturas: aperturas(...tipos) }
}

describe('contarPorTipo', () => {
  it('cuenta cada tipo y deja en 0 los que no aparecen', () => {
    expect(contarPorTipo(aperturas('normal', 'normal', 'espiritus'))).toEqual({
      normal: 2,
      especial: 0,
      enterrado: 0,
      espiritus: 1,
    })
  })

  it('con una lista vacía, todo es 0', () => {
    expect(contarPorTipo([])).toEqual({ normal: 0, especial: 0, enterrado: 0, espiritus: 0 })
  })
})

describe('calcularEstadisticas', () => {
  it('sin rondas, promedio, mínimo y máximo son null', () => {
    expect(calcularEstadisticas([])).toEqual({
      rondas: 0,
      totalCofres: 0,
      promedio: null,
      minimo: null,
      maximo: null,
      porTipo: { normal: 0, especial: 0, enterrado: 0, espiritus: 0 },
    })
  })

  it('calcula promedio, mínimo, máximo y reparto por tipo', () => {
    const historial = [
      ronda('r1', 'normal', 'normal', 'especial'), // 3 cofres
      ronda('r2', 'enterrado'), // 1 cofre
      ronda('r3', 'normal', 'espiritus', 'espiritus', 'especial', 'normal'), // 5 cofres
    ]
    expect(calcularEstadisticas(historial)).toEqual({
      rondas: 3,
      totalCofres: 9,
      promedio: 3,
      minimo: 1,
      maximo: 5,
      porTipo: { normal: 4, especial: 2, enterrado: 1, espiritus: 2 },
    })
  })

  it('el promedio puede tener decimales', () => {
    const e = calcularEstadisticas([ronda('r1', 'normal'), ronda('r2', 'normal', 'normal')])
    expect(e.promedio).toBe(1.5)
  })
})
