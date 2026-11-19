import type { Estadisticas as DatosEstadisticas } from '../dominio/estadisticas'
import { formatearNumero, formatearPorcentaje } from '../dominio/formato'
import { ETIQUETAS_COFRE, TIPOS_COFRE } from '../dominio/tipos'

type Props = {
  datos: DatosEstadisticas
}

/** Resumen de todas las rondas cerradas. */
export function Estadisticas({ datos }: Props) {
  const resumen = [
    { nombre: 'Rondas', valor: formatearNumero(datos.rondas) },
    { nombre: 'Promedio', valor: formatearNumero(datos.promedio) },
    { nombre: 'Mínimo', valor: formatearNumero(datos.minimo) },
    { nombre: 'Máximo', valor: formatearNumero(datos.maximo) },
  ]

  return (
    <section aria-labelledby="titulo-estadisticas" className="flex flex-col gap-3">
      <h2 id="titulo-estadisticas" className="text-xl font-semibold">
        Estadísticas
      </h2>
      <p className="text-sm text-neutral-400">Cofres abiertos hasta conseguir el token.</p>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {resumen.map(({ nombre, valor }) => (
          <div key={nombre} className="rounded-xl border border-neutral-800 p-3 text-center">
            <dt className="text-sm text-neutral-400">{nombre}</dt>
            <dd className="text-2xl font-bold tabular-nums">{valor}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-2 font-semibold">Reparto por tipo</h3>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
        {TIPOS_COFRE.map((tipo) => {
          const cantidad = datos.porTipo[tipo]
          const fraccion = datos.totalCofres > 0 ? cantidad / datos.totalCofres : 0
          return (
            <div key={tipo} className="flex justify-between gap-2 border-b border-neutral-800 py-1">
              <dt className="text-neutral-400">{ETIQUETAS_COFRE[tipo]}</dt>
              <dd className="tabular-nums">
                {cantidad}{' '}
                <span className="text-sm text-neutral-500">({formatearPorcentaje(fraccion)})</span>
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
