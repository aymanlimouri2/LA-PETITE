import { site } from '@/content/site'

/*
 * LA PETITE wordmark, set in the placeholder display face until TB.D's
 * vector wordmark (with separate letter paths) is supplied. Each letter is
 * its own element so the loader roll and header rise can move them.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  const words = site.name.split(' ')
  return (
    <div className={`wordmark ${className}`} data-fit aria-hidden="true">
      {words.map((word, w) => (
        <span key={w} className="contents">
          {w > 0 && <span className="wordmark-space" />}
          {word.split('').map((letter, i) => (
            <span key={i} className="wordmark-letter">
              {letter}
            </span>
          ))}
        </span>
      ))}
    </div>
  )
}
