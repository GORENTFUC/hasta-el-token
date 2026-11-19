import { describe, expect, it } from 'vitest'
import type { Estado } from '../dominio/tipos'
import { interpretarRespaldo, nombreArchivoRespaldo } from './exportar-importar'

describe('exportar e importar', () => {
  it('el nombre del archivo lleva la fecha local', () => {
    expect(nombreArchivoRespaldo(new Date(2026, 10, 5))).toBe('hasta-el-token-2026-11-05.json')
  })

  it('lo exportado se puede volver a importar igual (ida y vuelta)', () => {
    const estado: Estado = {
      version: 1,
      rondaActual: [],
      historial: [
        {
          id: 'r1',
          inicio: '2026-11-20T10:00:00.000Z',
          fin: '2026-11-20T11:00:00.000Z',
          aperturas: [{ tipo: 'especial', fecha: '2026-11-20T10:00:00.000Z' }],
        },
      ],
    }
    expect(interpretarRespaldo(JSON.stringify(estado, null, 2))).toEqual({ ok: true, estado })
  })

  it('un archivo que no es JSON da un error claro', () => {
    expect(interpretarRespaldo('<html>')).toEqual({
      ok: false,
      error: 'El archivo no es un JSON válido.',
    })
  })
})
