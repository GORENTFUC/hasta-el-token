import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { estadoInicial, type Estado } from '../dominio/tipos'
import { CLAVE_ESTADO, CLAVE_ESTADO_DANADO, cargarEstado, guardarEstado } from './persistencia'

/** localStorage falso en memoria (las pruebas corren en Node, sin navegador). */
function crearAlmacenFalso() {
  const datos = new Map<string, string>()
  return {
    datos,
    getItem: (k: string) => datos.get(k) ?? null,
    setItem: (k: string, v: string) => void datos.set(k, v),
  }
}

const F = '2026-11-20T10:00:00.000Z'
const estado: Estado = {
  version: 1,
  rondaActual: [{ tipo: 'enterrado', fecha: F }],
  historial: [],
}

describe('persistencia', () => {
  let almacen: ReturnType<typeof crearAlmacenFalso>

  beforeEach(() => {
    almacen = crearAlmacenFalso()
    vi.stubGlobal('localStorage', almacen)
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('sin datos guardados, empieza con el estado inicial', () => {
    expect(cargarEstado()).toBe(estadoInicial)
  })

  it('guarda y vuelve a cargar el mismo estado', () => {
    expect(guardarEstado(estado)).toBe(true)
    expect(cargarEstado()).toEqual(estado)
  })

  it('si lo guardado está dañado, lo aparta y empieza de cero', () => {
    almacen.datos.set(CLAVE_ESTADO, '{"version": 99}')
    expect(cargarEstado()).toBe(estadoInicial)
    expect(almacen.datos.get(CLAVE_ESTADO_DANADO)).toBe('{"version": 99}')
  })

  it('si no es JSON, empieza de cero sin romperse', () => {
    almacen.datos.set(CLAVE_ESTADO, 'esto no es json')
    expect(cargarEstado()).toBe(estadoInicial)
  })

  it('si el navegador no deja guardar, devuelve false', () => {
    vi.stubGlobal('localStorage', {
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    })
    expect(guardarEstado(estado)).toBe(false)
  })
})
