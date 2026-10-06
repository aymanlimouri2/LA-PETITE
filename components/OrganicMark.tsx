/*
 * Small organic mark replacing the reference's square brackets.
 * Placeholder drawing until TB.D supplies the shape library (TBD).
 * Same box as the bracket glyph it replaces; side flips the shape.
 */
export function OrganicMark({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 40 100"
      className="inline-block h-[0.72em] w-auto align-baseline"
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}
      aria-hidden="true"
    >
      <path d="M40 0C17.9 0 0 22.4 0 50s17.9 50 40 50z" fill="currentColor" />
    </svg>
  )
}
