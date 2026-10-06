/*
 * La Petite café photography (ayman, 2026-10-06). Same box and class hooks as
 * Placeholder so every slot keeps its crop and motion; the photo covers it.
 */
export function Photo({
  src,
  alt,
  width,
  height,
  className = '',
}: {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}) {
  return (
    <div className={`image w-full h-full ${className}`}>
      <figure className="w-full h-full m-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          className="lazy loaded block w-full h-full object-cover"
        />
      </figure>
    </div>
  )
}
