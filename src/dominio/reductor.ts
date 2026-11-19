import type { Accion, Estado } from './tipos'

/**
 * Reductor de la app: recibe el estado actual y una acción, y devuelve un
 * estado NUEVO. Nunca modifica el estado recibido (inmutabilidad), así React
 * detecta el cambio y se puede confiar en el historial de estados.
 */
export function reductor(estado: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case 'sumarCofre':
      return {
        ...estado,
        rondaActual: [...estado.rondaActual, { tipo: accion.cofre, fecha: accion.fecha }],
      }

    case 'deshacer': {
      // 1) Si la ronda actual tiene cofres, quita el último.
      if (estado.rondaActual.length > 0) {
        return { ...estado, rondaActual: estado.rondaActual.slice(0, -1) }
      }
      // 2) Si está vacía, reabre la última ronda cerrada (por si se pulsó
      //    el token por error) y la saca del historial.
      const ultima = estado.historial.at(-1)
      if (ultima) {
        return {
          ...estado,
          rondaActual: ultima.aperturas,
          historial: estado.historial.slice(0, -1),
        }
      }
      // 3) No hay nada que deshacer.
      return estado
    }

    case 'cerrarRonda': {
      // Sin cofres no hay ronda que cerrar.
      const primera = estado.rondaActual[0]
      if (!primera) return estado
      return {
        ...estado,
        rondaActual: [],
        historial: [
          ...estado.historial,
          {
            id: accion.id,
            inicio: primera.fecha,
            fin: accion.fecha,
            aperturas: estado.rondaActual,
          },
        ],
      }
    }

    default:
      return estado
  }
}
