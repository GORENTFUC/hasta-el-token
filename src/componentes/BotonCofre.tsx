type Props = {
  etiqueta: string
  cantidad: number
  onSumar: () => void
}

/** Botón grande para registrar un cofre de un tipo. Muestra cuántos lleva la ronda. */
export function BotonCofre({ etiqueta, cantidad, onSumar }: Props) {
  return (
    <button
      type="button"
      onClick={onSumar}
      aria-label={`${etiqueta}: ${cantidad}. Sumar un cofre`}
      className="flex min-h-32 touch-manipulation flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-700 bg-neutral-900 p-4 text-neutral-100 transition-colors select-none hover:bg-neutral-800 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-amber-400 active:bg-neutral-700"
    >
      <span className="text-lg font-semibold">{etiqueta}</span>
      <span className="text-4xl font-bold tabular-nums">{cantidad}</span>
    </button>
  )
}
