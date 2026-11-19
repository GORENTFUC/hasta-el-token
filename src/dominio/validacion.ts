import { TIPOS_COFRE, type Apertura, type Estado, type Ronda, type TipoCofre } from './tipos'

/**
 * Resultado de validar: o bien un Estado correcto, o bien un mensaje de error
 * pensado para mostrarlo tal cual a la persona.
 * (Es una "unión discriminada": el campo `ok` dice cuál de las dos es.)
 */
export type ResultadoValidacion = { ok: true; estado: Estado } | { ok: false; error: string }

/** Error interno para cortar la validación en el primer problema. */
class ErrorValidacion extends Error {}

function fallar(mensaje: string): never {
  throw new ErrorValidacion(mensaje)
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function esTipoCofre(valor: unknown): valor is TipoCofre {
  return typeof valor === 'string' && (TIPOS_COFRE as readonly string[]).includes(valor)
}

function validarFecha(valor: unknown, donde: string): string {
  if (typeof valor !== 'string' || Number.isNaN(Date.parse(valor))) {
    fallar(`${donde}: la fecha no es válida.`)
  }
  return valor
}

function validarApertura(valor: unknown, donde: string): Apertura {
  if (!esObjeto(valor)) fallar(`${donde}: no tiene el formato de un cofre.`)
  if (!esTipoCofre(valor.tipo)) {
    fallar(`${donde}: tipo de cofre desconocido (${JSON.stringify(valor.tipo)}).`)
  }
  // Se construye un objeto nuevo solo con los campos conocidos (se descarta lo demás).
  return { tipo: valor.tipo, fecha: validarFecha(valor.fecha, donde) }
}

function validarAperturas(valor: unknown, donde: string): Apertura[] {
  if (!Array.isArray(valor)) fallar(`${donde}: falta la lista de cofres.`)
  return valor.map((a, i) => validarApertura(a, `${donde}, cofre ${i + 1}`))
}

function validarRonda(valor: unknown, numero: number): Ronda {
  const donde = `Historial, ronda ${numero}`
  if (!esObjeto(valor)) fallar(`${donde}: no tiene el formato de una ronda.`)
  if (typeof valor.id !== 'string' || valor.id === '') fallar(`${donde}: falta el id.`)
  const aperturas = validarAperturas(valor.aperturas, donde)
  if (aperturas.length === 0) fallar(`${donde}: una ronda cerrada debe tener al menos un cofre.`)
  return {
    id: valor.id,
    inicio: validarFecha(valor.inicio, `${donde} (inicio)`),
    fin: validarFecha(valor.fin, `${donde} (fin)`),
    aperturas,
  }
}

/**
 * Comprueba que un valor desconocido (por ejemplo, el resultado de JSON.parse)
 * tenga la forma de un Estado. Se usa al importar un archivo y al leer
 * localStorage, porque en ambos casos los datos vienen "de fuera".
 */
export function validarEstado(valor: unknown): ResultadoValidacion {
  try {
    if (!esObjeto(valor)) fallar('El archivo no contiene datos de Hasta el token.')
    if (valor.version !== 1) {
      fallar(`Versión de datos no compatible (${JSON.stringify(valor.version)}). Se esperaba 1.`)
    }

    const rondaActual = validarAperturas(valor.rondaActual, 'Ronda actual')

    if (!Array.isArray(valor.historial)) fallar('Falta el historial de rondas.')
    const historial = valor.historial.map((r, i) => validarRonda(r, i + 1))

    const ids = new Set(historial.map((r) => r.id))
    if (ids.size !== historial.length) fallar('Hay rondas repetidas (con el mismo id).')

    return { ok: true, estado: { version: 1, rondaActual, historial } }
  } catch (e) {
    if (e instanceof ErrorValidacion) return { ok: false, error: e.message }
    throw e
  }
}
