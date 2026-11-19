import { useReducer } from 'react'
import { BotonCofre } from './componentes/BotonCofre'
import { contarPorTipo } from './dominio/estadisticas'
import { reductor } from './dominio/reductor'
import { ETIQUETAS_COFRE, TIPOS_COFRE, estadoInicial } from './dominio/tipos'

function App() {
  const [estado, despachar] = useReducer(reductor, estadoInicial)

  // Valores derivados: se calculan del estado en cada render, no se guardan aparte.
  const total = estado.rondaActual.length
  const porTipo = contarPorTipo(estado.rondaActual)
  const puedeDeshacer = total > 0 || estado.historial.length > 0

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-4 py-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold">Hasta el token</h1>
      </header>

      <section aria-labelledby="titulo-ronda" className="text-center">
        <h2 id="titulo-ronda" className="text-sm tracking-widest text-neutral-400 uppercase">
          Cofres en esta ronda
        </h2>
        {/* aria-live: los lectores de pantalla anuncian el total cuando cambia. */}
        <p aria-live="polite" className="text-7xl font-bold tabular-nums">
          {total}
        </p>
      </section>

      <section aria-label="Sumar cofres" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TIPOS_COFRE.map((tipo) => (
          <BotonCofre
            key={tipo}
            etiqueta={ETIQUETAS_COFRE[tipo]}
            cantidad={porTipo[tipo]}
            onSumar={() =>
              despachar({ tipo: 'sumarCofre', cofre: tipo, fecha: new Date().toISOString() })
            }
          />
        ))}
      </section>

      <button
        type="button"
        onClick={() => despachar({ tipo: 'deshacer' })}
        disabled={!puedeDeshacer}
        className="mx-auto min-h-12 touch-manipulation rounded-xl border border-neutral-600 px-6 text-base font-medium hover:bg-neutral-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Deshacer último
      </button>
    </main>
  )
}

export default App
