import { useRef, useState, type ChangeEvent } from 'react'
import { exportarJSON, importarJSON } from '../almacenamiento/exportar-importar'
import type { Estado } from '../dominio/tipos'

type Props = {
  estado: Estado
  onImportar: (estado: Estado) => void
}

type Mensaje = { tipo: 'exito' | 'error'; texto: string }

const claseBoton =
  'min-h-12 touch-manipulation rounded-xl border border-neutral-600 px-5 font-medium hover:bg-neutral-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-amber-400'

/** Exportar e importar un archivo JSON (respaldo y paso entre dispositivos). */
export function Respaldo({ estado, onImportar }: Props) {
  const [mensaje, setMensaje] = useState<Mensaje | null>(null)
  // Referencia al <input type="file"> oculto, para abrirlo desde un botón normal.
  const inputArchivo = useRef<HTMLInputElement>(null)

  function exportar() {
    exportarJSON(estado)
    setMensaje({ tipo: 'exito', texto: 'Respaldo descargado.' })
  }

  async function alElegirArchivo(evento: ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0]
    // Vaciar el input permite elegir de nuevo el mismo archivo más tarde.
    evento.target.value = ''
    if (!archivo) return

    const resultado = await importarJSON(archivo)
    if (!resultado.ok) {
      setMensaje({ tipo: 'error', texto: `No se pudo importar: ${resultado.error}` })
      return
    }

    const hayDatos = estado.rondaActual.length > 0 || estado.historial.length > 0
    if (
      hayDatos &&
      !window.confirm(
        'Importar reemplazará todos tus datos actuales (ronda en curso e historial). ¿Continuar?',
      )
    ) {
      setMensaje(null)
      return
    }

    onImportar(resultado.estado)
    const n = resultado.estado.historial.length
    setMensaje({
      tipo: 'exito',
      texto: `Respaldo importado: ${n} ${n === 1 ? 'ronda' : 'rondas'}.`,
    })
  }

  return (
    <section aria-labelledby="titulo-respaldo" className="flex flex-col gap-3">
      <h2 id="titulo-respaldo" className="text-xl font-semibold">
        Respaldo
      </h2>
      <p className="text-sm text-neutral-400">
        Tus datos se guardan solo en este navegador. Exporta un archivo para tener una copia o
        pasarlos a otro dispositivo.
      </p>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={exportar} className={claseBoton}>
          Exportar respaldo
        </button>
        <button type="button" onClick={() => inputArchivo.current?.click()} className={claseBoton}>
          Importar respaldo
        </button>
        <input
          ref={inputArchivo}
          type="file"
          accept=".json,application/json"
          onChange={alElegirArchivo}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* role="alert" anuncia los errores de inmediato; role="status", con calma. */}
      <p
        role={mensaje?.tipo === 'error' ? 'alert' : 'status'}
        className={`min-h-6 text-sm ${mensaje?.tipo === 'error' ? 'text-red-400' : 'text-emerald-400'}`}
      >
        {mensaje?.texto}
      </p>
    </section>
  )
}
