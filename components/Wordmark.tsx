/*
 * LA PETITE wordmark from the official logo files (black and white PNGs,
 * public/logo). Each letter is its own element, cut from the same file and
 * placed at its exact position, so the loader roll and header rise can move
 * letters one by one. A vector file from TB.D would keep it sharp at any size.
 *
 * tone "auto" stacks both files; CSS shows white under .header-light.
 */
const WIDTH = 3444
const HEIGHT = 476
// The reference logotype's SVG leaves 7.64 units above and below its 135.2-unit
// letters (viewBox height 150.48). The same inset keeps letter rolls clipping
// at the same point.
const INSET = 7.64 / 135.2
const BOX = 1 + 2 * INSET
const LETTERS: [number, number][] = [
  [0, 334],
  [383, 826],
  [1070, 1428],
  [1480, 1814],
  [1874, 2363],
  [2415, 2514],
  [2567, 3056],
  [3110, 3444],
]

export type WordmarkTone = 'black' | 'white' | 'auto'

export function Wordmark({ tone = 'black', className = '' }: { tone?: WordmarkTone; className?: string }) {
  const files = tone === 'auto' ? (['black', 'white'] as const) : ([tone] as const)
  return (
    <div
      className={`wordmark wordmark-${tone} ${className}`}
      style={{ aspectRatio: `${WIDTH} / ${HEIGHT * BOX}` }}
      aria-hidden="true"
    >
      {LETTERS.map(([x0, x1], i) => (
        <span
          key={i}
          className="wordmark-letter"
          style={{
            left: `${(x0 / WIDTH) * 100}%`,
            width: `${((x1 - x0) / WIDTH) * 100}%`,
            top: `${(INSET / BOX) * 100}%`,
            height: `${(1 / BOX) * 100}%`,
          }}
        >
          {files.map((file) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={file}
              src={`/logo/${file}/${i + 1}.png`}
              alt=""
              width={x1 - x0}
              height={HEIGHT}
              draggable={false}
              className={`wordmark-img wordmark-img-${file}`}
            />
          ))}
        </span>
      ))}
    </div>
  )
}
