import { estadoInicial, type Estado } from '../dominio/tipos'
import { validarEstado } from '../dominio/validacion'

/** Clave en localStorage. El prefijo evita choques con otras apps del mismo dominio. */
export const CLAVE_ESTADO = 'hasta-el-token:estado'
/** Si lo guardado está dañado, se aparta aquí en vez de perderlo. */
export const CLAVE_ESTADO_DANADO = 'hasta-el-token:estado-danado'

/**
 * Lee el estado guardado. Si no hay nada, o no se puede leer, empieza de cero.
 * localStorage puede lanzar errores (privacidad estricta, almacenamiento
 * bloqueado), por eso todo va dentro de try/catch.
 */
export function cargarEstado(): Estado {
  try {
    const texto = localStorage.getItem(CLAVE_ESTADO)
    if (texto === null) return estadoInicial

    const resultado = validarEstado(JSON.parse(texto))
    if (resultado.ok) return resultado.estado

    console.warn('Datos guardados no válidos:', resultado.error)
    localStorage.setItem(CLAVE_ESTADO_DANADO, texto)
  } catch (e) {
    console.warn('No se pudo leer el estado guardado:', e)
  }
  return estadoInicial
}

/** Guarda el estado. Devuelve `false` si el navegador no lo permitió. */
export function guardarEstado(estado: Estado): boolean {
  try {
    localStorage.setItem(CLAVE_ESTADO, JSON.stringify(estado))
    return true
  } catch (e) {
    console.warn('No se pudo guardar el estado:', e)
    return false
  }
}

/**
 * Pide al navegador que no borre nuestros datos cuando necesite espacio o
 * tras días sin uso (Safari lo hace con sitios no instalados). El navegador
 * puede decir que no; en ese caso, el respaldo en JSON es la red de seguridad.
 */
export async function pedirAlmacenamientoPersistente(): Promise<void> {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist()
    }
  } catch {
    // No es crítico: si falla, la app sigue funcionando igual.
  }
}
