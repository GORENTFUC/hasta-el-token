import { describe, expect, it } from 'vitest'
import type { Estado } from './tipos'
import { validarEstado } from './validacion'

const F = '2026-11-20T10:00:00.000Z'

function estadoValido(): Estado {
  return {
    version: 1,
    rondaActual: [{ tipo: 'normal', fecha: F }],
    historial: [{ id: 'r1', inicio: F, fin: F, aperturas: [{ tipo: 'espiritus', fecha: F }] }],
  }
}

/** Devuelve el mensaje de error, o falla la prueba si el dato era válido. */
function errorDe(valor: unknown): string {
  const r = validarEstado(valor)
  if (r.ok) throw new Error('Se esperaba un error de validación')
  return r.error
}

describe('validarEstado', () => {
  it('acepta un estado correcto', () => {
    expect(validarEstado(estadoValido())).toEqual({ ok: true, estado: estadoValido() })
  })

  it('acepta un estado vacío', () => {
    const vacio = { version: 1, rondaActual: [], historial: [] }
    expect(validarEstado(vacio)).toEqual({ ok: true, estado: vacio })
  })

  it('descarta campos desconocidos', () => {
    const conExtra = { ...estadoValido(), extra: 'x' }
    const r = validarEstado(conExtra)
    expect(r.ok && r.estado).toEqual(estadoValido())
  })

  it('rechaza lo que no es un objeto', () => {
    expect(errorDe(null)).toMatch(/no contiene datos/)
    expect(errorDe([])).toMatch(/no contiene datos/)
    expect(errorDe('hola')).toMatch(/no contiene datos/)
  })

  it('rechaza otra versión', () => {
    expect(errorDe({ ...estadoValido(), version: 2 })).toMatch(/Versión de datos no compatible/)
  })

  it('rechaza un tipo de cofre desconocido e indica dónde', () => {
    const e = estadoValido()
    const malo = { ...e, rondaActual: [...e.rondaActual, { tipo: 'dorado', fecha: F }] }
    expect(errorDe(malo)).toBe('Ronda actual, cofre 2: tipo de cofre desconocido ("dorado").')
  })

  it('rechaza fechas inválidas', () => {
    const malo = { ...estadoValido(), rondaActual: [{ tipo: 'normal', fecha: 'ayer' }] }
    expect(errorDe(malo)).toMatch(/la fecha no es válida/)
  })

  it('rechaza rondas sin cofres, sin id o repetidas', () => {
    const r = estadoValido().historial[0]
    expect(errorDe({ ...estadoValido(), historial: [{ ...r, aperturas: [] }] })).toMatch(/al menos un cofre/)
    expect(errorDe({ ...estadoValido(), historial: [{ ...r, id: '' }] })).toMatch(/falta el id/)
    expect(errorDe({ ...estadoValido(), historial: [r, r] })).toMatch(/repetidas/)
  })

  it('rechaza si falta el historial', () => {
    expect(errorDe({ version: 1, rondaActual: [] })).toMatch(/Falta el historial/)
  })
})
