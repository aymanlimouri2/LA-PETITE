import { OrganicMark } from '@/components/OrganicMark'
import { Placeholder } from '@/components/Placeholder'
import { locations, TBD } from '@/content/site'

/* 02 Locations (reference 02 Selected Works). Off-white ground. */
export function Locations() {
  return (
    <div data-piece="works" className="works block pb-150 overflow-hidden bg-white">
      <div className="flex justify-between px-margin pb-52 md:pb-150 body-14 md:body-16 uppercase tracking-[0.04em]">
        <div className="flex gap-x-10 xl:flex-1">
          <div className="xl:hidden text-mist">02</div>
          <h2>Locations</h2>
        </div>
        <div className="text-mist max-xl:hidden">02</div>
        <div className="flex justify-end xl:flex-1">Al Ain · Abu Dhabi</div>
      </div>
      <div className="flex flex-col gap-y-32 md:gap-y-100 xl:gap-y-52">
        {locations.map((l) => (
          <a
            key={l.slug}
            href={`/spaces/${l.slug}`}
            className="works-item w-full"
            data-widget
            data-widget-title={l.name}
            data-widget-url={`/spaces/${l.slug}`}
          >
            <div className="works-item-wrapper flex flex-col gap-y-16 md:gap-y-52">
              <div className="relative w-full body-48 md:body-72 lg:body-100 flex justify-center px-margin font-display uppercase">
                <div className="absolute top-1/2 left-4 w-8 md:w-12 h-px bg-black -translate-y-4 md:-translate-y-12" />
                <div className="absolute top-1/2 right-4 w-8 md:w-12 h-px bg-black -translate-y-4 md:-translate-y-12" />
                <div className="works-item-bracket-left flex items-center xl:justify-end xl:flex-1">
                  <OrganicMark side="left" />
                </div>
                {/* Title size only: one line between the marks at every width (ayman, 2026-10-05). */}
                <h3 className="works-item-title text-center max-xl:flex-1 font-normal whitespace-nowrap text-[2.8rem] md:text-[6.1rem] lg:text-[8.3rem] xl:text-[10rem]">
                  {l.name}
                </h3>
                <div className="works-item-bracket-right flex items-center xl:flex-1">
                  <OrganicMark side="right" />
                </div>
              </div>
              <div className="works-item-image-wrapper grid-w md:-mt-30">
                <div className="col-span-full md:col-start-3 xl:col-start-4 md:col-end-11 xl:col-end-10">
                  <div className="works-item-image relative w-full h-0 max-xl:pt-[66%] xl:h-464 overflow-hidden">
                    <div className="absolute-full">
                      <Placeholder tone={l.tone} label={`${l.short} photography TBD`} />
                    </div>
                  </div>
                  <div className="flex justify-between body-16 gap-x-20 mt-20 overflow-hidden">
                    <div className="works-item-category">{l.city}</div>
                    <div className="works-item-date">{TBD}</div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
