import { Placeholder } from '@/components/Placeholder'
import type { Tone } from '@/content/site'
import { locations } from '@/content/site'

type Size = 'large' | 'medium' | 'small'

interface Cell {
  col: string
  item: string
  size: Size
  tone: Tone
}

/*
 * Cloud placements copied from the reference so the parallax depths,
 * fades and the takeover split land the same. Photography TBD (about 20
 * café, coffee, food and atmosphere images needed).
 */
const rows: { className: string; cells: Cell[] }[] = [
  {
    className: 'grid grid-cols-6 xl:grid-cols-12 gap-x-gutter px-margin',
    cells: [
      { col: 'col-span-3', item: '-ml-col-2 xl:-ml-col-1', size: 'large', tone: 'harvest' },
      { col: 'col-span-1 flex items-end', item: 'max-xl:-ml-col-1 translate-y-1/2', size: 'small', tone: 'tawny' },
      { col: 'col-start-5 col-end-7 xl:col-start-6 xl:col-end-8 flex items-center', item: 'opacity-40', size: 'medium', tone: 'rustic' },
      { col: 'col-span-2 xl:col-start-9 xl:col-end-11 max-xl:mt-150', item: 'max-xl:-ml-col-1 xl:-translate-y-1/2', size: 'medium', tone: 'cinnamon' },
      { col: 'col-start-6 col-end-7 xl:col-start-12 xl:col-end-13 flex items-center max-xl:mt-65', item: 'opacity-20 -translate-y-1/2', size: 'small', tone: 'almond' },
    ],
  },
  {
    className: 'grid grid-cols-6 xl:grid-cols-12 gap-x-gutter px-margin',
    cells: [
      { col: 'col-span-2 flex items-end xl:items-center', item: 'translate-y-1/2 xl:-ml-col-1 xl:-translate-y-1/4', size: 'medium', tone: 'tawny' },
      { col: 'col-span-1 xl:col-start-3 xl:col-end-4 flex xl:items-end', item: 'opacity-20 -translate-y-1/2 xl:translate-y-1/2', size: 'small', tone: 'beans' },
      { col: 'col-span-3 xl:col-start-5 xl:col-end-7 flex items-center max-xl:translate-x-col-1', item: '', size: 'medium', tone: 'harvest' },
      { col: 'col-start-6 col-end-7 xl:col-start-8 xl:col-end-9 max-xl:hidden', item: 'opacity-20 max-xl:mt-180 xl:-translate-y-1/2', size: 'small', tone: 'rustic' },
      { col: 'col-start-4 col-end-5 xl:col-start-10 xl:col-end-13 flex xl:items-center pb-64 max-xl:hidden', item: '', size: 'large', tone: 'cinnamon' },
    ],
  },
  {
    className:
      'grid grid-cols-6 xl:grid-cols-12 gap-x-gutter px-margin pt-[calc(var(--vh)_*_0.6)] pb-[calc(var(--vh)_*_0.5)] md:pt-[calc(var(--vh)_*_0.8)] xl:py-0',
    cells: [
      { col: 'col-span-3 max-xl:order-last max-xl:translate-x-col-2', item: 'xl:-ml-col-1', size: 'large', tone: 'rustic' },
      { col: 'col-span-1 flex xl:items-end', item: 'opacity-20 -translate-y-1/2 xl:translate-y-1/2', size: 'small', tone: 'harvest' },
      { col: 'col-start-2 col-end-4 xl:col-start-9 xl:col-end-11 flex items-end xl:items-center', item: 'max-xl:translate-y-1/2', size: 'medium', tone: 'almond' },
      { col: 'col-start-12 col-end-13 max-xl:hidden', item: 'opacity-20', size: 'small', tone: 'tawny' },
    ],
  },
  {
    className: 'grid-w max-xl:hidden',
    cells: [
      { col: 'col-span-2 flex items-end', item: '-ml-col-1', size: 'medium', tone: 'beans' },
      { col: 'col-start-3 col-end-4 flex items-end', item: 'translate-y-1/2 opacity-20', size: 'small', tone: 'rustic' },
      { col: 'col-start-5 col-end-7 flex items-center', item: '', size: 'medium', tone: 'tawny' },
      { col: 'col-start-8 col-end-9', item: '', size: 'small', tone: 'harvest' },
      { col: 'col-start-10 col-end-13 flex items-center pb-64', item: '', size: 'large', tone: 'almond' },
    ],
  },
]

export function Spaces() {
  const count = String(locations.length).padStart(2, '0')
  return (
    <div
      data-piece="works-grid"
      className="flex flex-col -mt-[40vh]"
      data-widget
      data-widget-title="Spaces"
      data-widget-url="/spaces"
      data-widget-offset="0.5"
    >
      <div className="works-grid-button sticky top-0 w-full h-screen-mobile xl:h-screen flex-center -mb-screen-mobile z-1">
        <a href="/spaces" className="link-underline-hover relative body-48 md:body-72 lg:body-100 flex gap-x-5 md:gap-x-10 items-center font-display">
          <div>Spaces</div>
          <sup className="body-16 md:body-32 lg:body-60">({count})</sup>
        </a>
      </div>
      <div className="flex flex-col xl:gap-y-140 w-full pt-[20vh] xl:pt-[30vh] mt-[60vh] xl:mt-[60vh] xl:-mb-[55rem] overflow-hidden">
        {rows.map((row, r) => (
          <div key={r} className={row.className}>
            {row.cells.map((cell, c) => (
              <div key={c} className={cell.col}>
                <div className={`works-grid-item relative w-full h-0 pt-[130%] ${cell.item}`} data-size={cell.size}>
                  <div className="works-grid-image will-change-transform absolute-full">
                    <Placeholder tone={cell.tone} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
