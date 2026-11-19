import { TIPOS_COFRE, type Apertura, type Ronda, type TipoCofre } from './tipos'

export type ConteoPorTipo = Record<TipoCofre, number>

export type Estadisticas = {
  /** Número de rondas cerradas (veces que se consiguió el token). */
  rondas: number
  /** Cofres sumando todas las rondas. */
  totalCofres: number
  /** Promedio de cofres hasta el token; `null` si aún no hay rondas. */
  promedio: number | null
  /** Ronda con menos cofres; `null` si aún no hay rondas. */
  minimo: number | null
  /** Ronda con más cofres; `null` si aún no hay rondas. */
  maximo: number | null
  /** Cofres de cada tipo sumando todas las rondas. */
  porTipo: ConteoPorTipo
}

/** Cuenta cuántos cofres de cada tipo hay en una lista de aperturas. */
export function contarPorTipo(aperturas: readonly Apertura[]): ConteoPorTipo {
  const conteo = Object.fromEntries(TIPOS_COFRE.map((t) => [t, 0])) as ConteoPorTipo
  for (const { tipo } of aperturas) conteo[tipo]++
  return conteo
}

/** Calcula las estadísticas del historial de rondas cerradas. */
export function calcularEstadisticas(historial: readonly Ronda[]): Estadisticas {
  const totales = historial.map((r) => r.aperturas.length)
  const totalCofres = totales.reduce((suma, n) => suma + n, 0)
  const hayRondas = totales.length > 0

  return {
    rondas: historial.length,
    totalCofres,
    promedio: hayRondas ? totalCofres / totales.length : null,
    minimo: hayRondas ? Math.min(...totales) : null,
    maximo: hayRondas ? Math.max(...totales) : null,
    porTipo: contarPorTipo(historial.flatMap((r) => r.aperturas)),
  }
}
