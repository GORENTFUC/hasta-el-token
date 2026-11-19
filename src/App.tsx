import { useEffect, useReducer } from 'react'
import {
  cargarEstado,
  guardarEstado,
  pedirAlmacenamientoPersistente,
} from './almacenamiento/persistencia'
import { BotonCofre } from './componentes/BotonCofre'
import { BotonToken } from './componentes/BotonToken'
import { Estadisticas } from './componentes/Estadisticas'
import { Historial } from './componentes/Historial'
import { Respaldo } from './componentes/Respaldo'
import { calcularEstadisticas, contarPorTipo } from './dominio/estadisticas'
import { textoCofres } from './dominio/formato'
import { generarId } from './dominio/id'
import { reductor } from './dominio/reductor'
import { ETIQUETAS_COFRE, TIPOS_COFRE } from './dominio/tipos'

function App() {
  // Tercer argumento = "inicialización perezosa": cargarEstado se ejecuta una
  // sola vez, al montar la app, y no en cada render.
  const [estado, despachar] = useReducer(reductor, undefined, cargarEstado)

  // Guardar en localStorage cada vez que el estado cambie.
  useEffect(() => {
    guardarEstado(estado)
  }, [estado])

  // Una sola vez al abrir: pedir que el navegador no borre los datos.
  useEffect(() => {
    void pedirAlmacenamientoPersistente()
  }, [])

  // Valores derivados: se calculan del estado en cada render, no se guardan aparte.
  const total = estado.rondaActual.length
  const porTipo = contarPorTipo(estado.rondaActual)
  const estadisticas = calcularEstadisticas(estado.historial)
  // Si la ronda está vacía y hay historial, "deshacer" reabre la última ronda.
  const ultimaRonda = total === 0 ? estado.historial.at(-1) : undefined
  const puedeDeshacer = total > 0 || ultimaRonda !== undefined

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

      <div className="flex flex-col gap-3">
        <BotonToken
          desactivado={total === 0}
          onConseguido={() =>
            despachar({ tipo: 'cerrarRonda', id: generarId(), fecha: new Date().toISOString() })
          }
        />

        <p aria-live="polite" className="min-h-6 text-center text-sm text-neutral-300">
          {ultimaRonda &&
            `¡Token conseguido en ${textoCofres(ultimaRonda.aperturas.length)}! ¿Fue por error? Puedes reabrir la ronda.`}
        </p>

        <button
          type="button"
          onClick={() => despachar({ tipo: 'deshacer' })}
          disabled={!puedeDeshacer}
          className="mx-auto min-h-12 touch-manipulation rounded-xl border border-neutral-600 px-6 text-base font-medium hover:bg-neutral-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {ultimaRonda ? 'Reabrir última ronda' : 'Deshacer último'}
        </button>
      </div>

      <Estadisticas datos={estadisticas} />
      <Historial rondas={estado.historial} />
      <Respaldo
        estado={estado}
        onImportar={(nuevo) => despachar({ tipo: 'reemplazar', estado: nuevo })}
      />
    </main>
  )
}

export default App
