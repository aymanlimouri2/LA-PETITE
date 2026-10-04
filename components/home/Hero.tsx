import { OrganicMark } from '@/components/OrganicMark'
import { Placeholder } from '@/components/Placeholder'
import { site } from '@/content/site'

/*
 * Hero (reference cover-home). Film or still of a La Petite café is TBD;
 * with no film the loader proceeds exactly as the reference does without one.
 */
const heroFilm: string | null = null

export function Hero() {
  const line = site.brandLines.hero
  return (
    <div data-piece="cover-home" className="cover-home block relative w-full">
      <div className="relative w-full h-screen">
        <div className="cover-home-title-dark absolute top-[25vh] left-margin body-48 w-col-3 max-xl:hidden" aria-hidden="true" />
        <div className="cover-home-bottom-dark absolute left-0 bottom-180 grid-w w-full items-end max-xl:hidden">
          <div className="cover-home-scroll-dark col-span-2 body-16 flex items-center gap-x-4 max-md:hidden text-mist">
            <span className="cover-home-scroll-bracket inline-block">
              <OrganicMark side="left" />
            </span>
            <span className="inline-block overflow-hidden">
              <span className="cover-home-scroll-text inline-block">Scroll</span>
            </span>
            <span className="cover-home-scroll-bracket inline-block">
              <OrganicMark side="right" />
            </span>
          </div>
          <div
            className="cover-home-content-dark col-span-full md:col-start-10 md:col-end-13 body-16 md:body-20"
            aria-hidden="true"
          >
            {line}
          </div>
        </div>
        <div className="cover-home-image absolute-full flex items-end pb-margin" data-dark="true">
          <div className="cover-home-image-inner absolute-full overflow-hidden">
            <div data-piece="parallax-image" className="cover-home-image-prlx absolute-full">
              {heroFilm ? (
                <video
                  className="parallax-el cover-home-video w-full h-full object-cover"
                  data-src={heroFilm}
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <div className="parallax-el w-full h-full">
                  <Placeholder tone="cinnamon" label="Hero film or still TBD" />
                </div>
              )}
              <div className="absolute-full bg-black/24" />
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-screen-mobile xl:h-screen">
            <div className="cover-home-title-light absolute top-1/2 xl:top-[25vh] max-xl:-translate-y-1/2 left-margin max-xl:right-margin xl:w-col-3 body-48 md:body-72 xl:body-48 text-white" />
          </div>
          <div className="cover-home-bottom-light sticky left-0 bottom-margin w-full grid-w items-end text-white">
            <div className="col-span-2 body-16 max-xl:hidden opacity-52 flex items-center gap-x-4">
              <OrganicMark side="left" />
              <span>Scroll</span>
              <OrganicMark side="right" />
            </div>
            <h1 className="cover-home-content col-span-full md:col-start-7 lg:col-start-8 xl:col-start-10 md:col-end-13 body-16 md:body-20">
              {line}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
