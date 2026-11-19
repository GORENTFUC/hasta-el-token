type Props = {
  desactivado: boolean
  onConseguido: () => void
}

/**
 * Cierra la ronda actual. Sin cofres no tiene sentido, por eso se desactiva.
 * La animación de pulso llega en la etapa de estilo final.
 */
export function BotonToken({ desactivado, onConseguido }: Props) {
  return (
    <button
      type="button"
      onClick={onConseguido}
      disabled={desactivado}
      className="min-h-16 w-full touch-manipulation rounded-2xl bg-amber-400 px-6 text-xl font-bold text-neutral-950 transition-colors hover:bg-amber-300 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-amber-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-amber-400"
    >
      ¡Conseguí el token!
    </button>
  )
}
