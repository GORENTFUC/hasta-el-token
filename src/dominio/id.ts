/**
 * Genera un identificador único para una ronda.
 *
 * `crypto.randomUUID` solo existe en contextos seguros (HTTPS o localhost).
 * Si abres la app desde el celular por la red local (http://192.168...),
 * no está disponible, así que usamos un respaldo con la hora y un aleatorio.
 * Para ids de rondas en un solo navegador es más que suficiente.
 */
export function generarId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
