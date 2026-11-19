/**
 * Tipos del dominio: describen los datos de la app sin depender de React
 * ni del navegador, para poder reutilizarlos (por ejemplo, con Tauri).
 */

/** Lista de tipos de cofre, en el orden en que se muestran. */
export const TIPOS_COFRE = ['normal', 'especial', 'enterrado', 'espiritus'] as const

/** 'normal' | 'especial' | 'enterrado' | 'espiritus', derivado de la lista. */
export type TipoCofre = (typeof TIPOS_COFRE)[number]

/** Nombre visible de cada tipo (pantalla, historial e imagen para compartir). */
export const ETIQUETAS_COFRE: Record<TipoCofre, string> = {
  normal: 'Normal',
  especial: 'Especial',
  enterrado: 'Enterrado',
  espiritus: 'De espíritus',
}

/** Un cofre abierto. `fecha` es una fecha ISO 8601. */
export type Apertura = {
  tipo: TipoCofre
  fecha: string
}

/** Una ronda cerrada: desde el primer cofre hasta conseguir el token. */
export type Ronda = {
  id: string
  inicio: string
  fin: string
  aperturas: Apertura[]
}

/** Todo lo que la app guarda. `version` permite migrar datos en el futuro. */
export type Estado = {
  version: 1
  rondaActual: Apertura[]
  historial: Ronda[]
}

/**
 * Acciones que entiende el reductor.
 * La fecha y el id llegan desde fuera para que el reductor sea una función
 * pura: con la misma entrada, siempre devuelve la misma salida.
 */
export type Accion =
  | { tipo: 'sumarCofre'; cofre: TipoCofre; fecha: string }
  | { tipo: 'deshacer' }
  | { tipo: 'cerrarRonda'; id: string; fecha: string }
  /** Sustituye todo el estado (al importar un respaldo ya validado). */
  | { tipo: 'reemplazar'; estado: Estado }

export const estadoInicial: Estado = {
  version: 1,
  rondaActual: [],
  historial: [],
}
