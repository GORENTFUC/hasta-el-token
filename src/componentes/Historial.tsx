import { contarPorTipo } from '../dominio/estadisticas'
import { formatearFecha, textoCofres } from '../dominio/formato'
import { ETIQUETAS_COFRE, TIPOS_COFRE, type Ronda } from '../dominio/tipos'

type Props = {
  rondas: readonly Ronda[]
}

/** Lista de rondas cerradas, de la más reciente a la más antigua. */
export function Historial({ rondas }: Props) {
  return (
    <section aria-labelledby="titulo-historial" className="flex flex-col gap-3">
      <h2 id="titulo-historial" className="text-xl font-semibold">
        Historial
      </h2>

      {rondas.length === 0 ? (
        <p className="text-neutral-400">Aún no has conseguido ningún token. ¡A abrir cofres!</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {/* El historial se guarda en orden cronológico; aquí lo invertimos
              (con una copia: toReversed no modifica el original). */}
          {rondas
            .map((ronda, i) => ({ ronda, numero: i + 1 }))
            .toReversed()
            .map(({ ronda, numero }) => {
              const porTipo = contarPorTipo(ronda.aperturas)
              return (
                <li key={ronda.id} className="rounded-xl border border-neutral-800 p-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">Ronda {numero}</h3>
                    <time dateTime={ronda.fin} className="text-sm text-neutral-400">
                      {formatearFecha(ronda.fin)}
                    </time>
                  </div>
                  <p className="text-lg font-bold tabular-nums">
                    {textoCofres(ronda.aperturas.length)}
                  </p>
                  <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-400">
                    {TIPOS_COFRE.map((tipo) => (
                      <li key={tipo}>
                        {ETIQUETAS_COFRE[tipo]}:{' '}
                        <span className="text-neutral-200 tabular-nums">{porTipo[tipo]}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
        </ol>
      )}
    </section>
  )
}
