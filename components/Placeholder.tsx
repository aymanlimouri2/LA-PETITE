import { tones, type Tone } from '@/content/site'

/*
 * Neutral image block standing in for La Petite photography (TBD).
 * Same box, ratio and class hooks as a real image so motion is unchanged.
 */
export function Placeholder({
  tone = 'harvest',
  label = 'Photography TBD',
  className = '',
  innerClassName = '',
}: {
  tone?: Tone
  label?: string
  className?: string
  innerClassName?: string
}) {
  const dark = tone === 'beans'
  return (
    <div className={`image w-full h-full ${className}`}>
      <figure className="w-full h-full m-0">
        <div
          className={`lazy loaded relative w-full h-full flex-center ${innerClassName}`}
          style={{ backgroundColor: tones[tone] }}
        >
          <span
            className={`body-12 uppercase tracking-[0.08em] ${dark ? 'text-white/60' : 'text-black/50'}`}
          >
            {label}
          </span>
        </div>
      </figure>
    </div>
  )
}
