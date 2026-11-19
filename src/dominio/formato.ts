/**
 * Formatos para mostrar números y fechas en español de Colombia.
 * Se crean una sola vez porque construir un Intl.*Format es costoso.
 */

const formatoNumero = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 })
const formatoPorcentaje = new Intl.NumberFormat('es-CO', {
  style: 'percent',
  maximumFractionDigits: 0,
})
const formatoFecha = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

/** 12.345 → "12,3". `null` → "—". */
export function formatearNumero(n: number | null): string {
  return n === null ? '—' : formatoNumero.format(n)
}

/** 1 → "1 cofre", 3 → "3 cofres". */
export function textoCofres(n: number): string {
  return `${formatearNumero(n)} ${n === 1 ? 'cofre' : 'cofres'}`
}

/** 0.25 → "25 %". */
export function formatearPorcentaje(fraccion: number): string {
  return formatoPorcentaje.format(fraccion)
}

/** Fecha ISO → "20 nov 2026, 10:05 a. m." (hora local del navegador). */
export function formatearFecha(iso: string): string {
  return formatoFecha.format(new Date(iso))
}
