import { describe, expect, it } from 'vitest'
import { reductor } from './reductor'
import { estadoInicial, type Estado } from './tipos'

const F1 = '2026-11-20T10:00:00.000Z'
const F2 = '2026-11-20T10:05:00.000Z'
const F3 = '2026-11-20T10:10:00.000Z'

/** Estado con una ronda en curso de dos cofres. */
function conDosCofres(): Estado {
  let e = reductor(estadoInicial, { tipo: 'sumarCofre', cofre: 'normal', fecha: F1 })
  e = reductor(e, { tipo: 'sumarCofre', cofre: 'enterrado', fecha: F2 })
  return e
}

describe('sumarCofre', () => {
  it('agrega la apertura al final de la ronda actual', () => {
    const e = conDosCofres()
    expect(e.rondaActual).toEqual([
      { tipo: 'normal', fecha: F1 },
      { tipo: 'enterrado', fecha: F2 },
    ])
    expect(e.historial).toEqual([])
  })

  it('no modifica el estado original', () => {
    const antes = conDosCofres()
    const copia = structuredClone(antes)
    reductor(antes, { tipo: 'sumarCofre', cofre: 'especial', fecha: F3 })
    expect(antes).toEqual(copia)
  })
})

describe('deshacer', () => {
  it('quita el último cofre de la ronda actual, sea del tipo que sea', () => {
    const e = reductor(conDosCofres(), { tipo: 'deshacer' })
    expect(e.rondaActual).toEqual([{ tipo: 'normal', fecha: F1 }])
  })

  it('con la ronda vacía, reabre la última ronda cerrada', () => {
    const cerrado = reductor(conDosCofres(), { tipo: 'cerrarRonda', id: 'r1', fecha: F3 })
    const e = reductor(cerrado, { tipo: 'deshacer' })
    expect(e.historial).toEqual([])
    expect(e.rondaActual).toEqual(conDosCofres().rondaActual)
  })

  it('sin nada que deshacer, devuelve el mismo estado', () => {
    expect(reductor(estadoInicial, { tipo: 'deshacer' })).toBe(estadoInicial)
  })
})

describe('reemplazar', () => {
  it('sustituye todo el estado por el recibido', () => {
    const nuevo: Estado = { version: 1, rondaActual: [], historial: [] }
    expect(reductor(conDosCofres(), { tipo: 'reemplazar', estado: nuevo })).toBe(nuevo)
  })
})

describe('cerrarRonda', () => {
  it('guarda la ronda en el historial y empieza una nueva', () => {
    const e = reductor(conDosCofres(), { tipo: 'cerrarRonda', id: 'r1', fecha: F3 })
    expect(e.rondaActual).toEqual([])
    expect(e.historial).toEqual([
      {
        id: 'r1',
        inicio: F1,
        fin: F3,
        aperturas: [
          { tipo: 'normal', fecha: F1 },
          { tipo: 'enterrado', fecha: F2 },
        ],
      },
    ])
  })

  it('añade las rondas nuevas al final del historial', () => {
    let e = reductor(conDosCofres(), { tipo: 'cerrarRonda', id: 'r1', fecha: F3 })
    e = reductor(e, { tipo: 'sumarCofre', cofre: 'espiritus', fecha: F3 })
    e = reductor(e, { tipo: 'cerrarRonda', id: 'r2', fecha: F3 })
    expect(e.historial.map((r) => r.id)).toEqual(['r1', 'r2'])
  })

  it('sin cofres en la ronda, no hace nada', () => {
    const e = reductor(estadoInicial, { tipo: 'cerrarRonda', id: 'r1', fecha: F1 })
    expect(e).toBe(estadoInicial)
  })
})
