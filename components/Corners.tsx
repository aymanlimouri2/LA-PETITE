/* Crop-mark hairlines at the corners of a section (kept from the reference, colour only). */
type Corner = 'tl' | 'tr' | 'bl' | 'br'

export function Corners({ corners = ['tl', 'tr'] }: { corners?: Corner[] }) {
  return (
    <>
      {corners.map((c) => {
        const top = c[0] === 't'
        const left = c[1] === 'l'
        return (
          <div
            key={c}
            className={`absolute w-16 h-16 md:w-20 md:h-20 ${left ? 'left-0' : 'right-0'} ${top ? 'top-0' : 'bottom-0'}`}
          >
            <div
              className={`absolute w-8 md:w-12 h-px bg-black ${left ? 'left-4' : 'right-4'} ${top ? 'bottom-0' : 'top-0'}`}
            />
            <div
              className={`absolute w-px h-8 md:h-12 bg-black ${left ? 'right-0' : 'left-0'} ${top ? 'top-4' : 'bottom-4'}`}
            />
          </div>
        )
      })}
    </>
  )
}
