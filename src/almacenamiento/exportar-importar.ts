import type { Estado } from '../dominio/tipos'
import { validarEstado, type ResultadoValidacion } from '../dominio/validacion'

/** Límite razonable: miles de rondas ocupan bastante menos que esto. */
const TAMANO_MAXIMO = 5 * 1024 * 1024 // 5 MB

/** Nombre del archivo con la fecha local: hasta-el-token-2026-11-20.json */
export function nombreArchivoRespaldo(fecha = new Date()): string {
  const dos = (n: number) => String(n).padStart(2, '0')
  const dia = `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`
  return `hasta-el-token-${dia}.json`
}

/** Descarga el estado como archivo JSON. */
export function exportarJSON(estado: Estado): void {
  const texto = JSON.stringify(estado, null, 2)
  const blob = new Blob([texto], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  // Un enlace temporal con `download` hace que el navegador guarde el archivo.
  const enlace = document.createElement('a')
  enlace.href = url
  enlace.download = nombreArchivoRespaldo()
  enlace.click()

  // Liberar la memoria del Blob cuando el navegador ya empezó la descarga.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Interpreta el texto de un respaldo: JSON válido + forma correcta. */
export function interpretarRespaldo(texto: string): ResultadoValidacion {
  let datos: unknown
  try {
    datos = JSON.parse(texto)
  } catch {
    return { ok: false, error: 'El archivo no es un JSON válido.' }
  }
  return validarEstado(datos)
}

/** Lee un archivo elegido por la persona y lo valida. */
export async function importarJSON(archivo: File): Promise<ResultadoValidacion> {
  if (archivo.size > TAMANO_MAXIMO) {
    return { ok: false, error: 'El archivo es demasiado grande para ser un respaldo.' }
  }
  try {
    return interpretarRespaldo(await archivo.text())
  } catch {
    return { ok: false, error: 'No se pudo leer el archivo.' }
  }
}
