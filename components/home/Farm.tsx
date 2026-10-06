import { Photo } from '@/components/Photo'
import { cafePhotos, site, tbd } from '@/content/site'

/* 03 Farm to table (reference 03 Vision chapter). Pinned takeover, then value steps. */
export function Farm() {
  const values = site.values
  // Reference column bases; the last is one column wider for the longer La Petite value.
  const basis = ['xl:basis-col-5', 'xl:basis-col-4', 'xl:basis-col-6']
  return (
    <div
      data-piece="vision"
      className="block relative text-white"
      data-offset="0.75"
      data-widget
      data-widget-title="Farm to table"
      data-widget-url="/story"
      data-widget-offset="1"
    >
      <div className="sticky top-0 grid grid-cols-6 xl:grid-cols-12 gap-x-gutter px-margin h-screen-mobile xl:h-screen items-center -mt-[calc(var(--vh)*1.5)] md:-mt-[calc(var(--vh)*1.8)] xl:-mt-[100vh] overflow-hidden z-1">
        <div className="vision-image-wrapper col-start-4 col-end-7 xl:col-start-6 xl:col-end-8 max-xl:-ml-[calc(var(--gutter)_/_2)] max-xl:-translate-x-1/2">
          <div className="vision-image relative w-full h-0 pt-[130%] body-60 text-white overflow-hidden">
            <div className="vision-image-scroll absolute-full">
              <div className="vision-image-parallax absolute top-0 left-0 w-full h-[130%] xl:h-full">
                <Photo {...cafePhotos.terraceTall} />
                <div className="absolute-full bg-black/24" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative w-full h-[calc(var(--vh)_*_var(--height-multiplier))] -mt-[var(--vh)] z-1"
        style={{ ['--height-multiplier' as string]: 4.25 }}
      >
        <div className="vision-wrapper sticky top-0 grid-w content-center w-full h-screen-mobile xl:h-screen overflow-hidden">
          <div className="vision-titles col-span-full xl:col-start-3 xl:col-end-13 flex flex-nowrap body-36 lg:body-60 opacity-0 invisible font-display">
            {values.map((value, i) => (
              <div key={value} className={`${basis[i]} whitespace-nowrap shrink-0 overflow-hidden`}>
                <h3
                  className={`vision-title inline-block w-full max-xl:pr-32 will-change-transform font-normal ${i > 0 ? 'opacity-32' : ''}`}
                >
                  {value}
                </h3>
              </div>
            ))}
          </div>
          <div className="col-span-full flex gap-x-32 items-center my-52 md:my-60 body-14 md:body-16 uppercase tracking-[0.04em]">
            <div className="vision-number text-white/52 overflow-hidden">
              <span className="vision-number-text inline-block">03</span>
            </div>
            <div className="vision-line flex-1 h-px bg-white/32" />
            <h2 className="vision-suptitle overflow-hidden font-normal">
              <span className="vision-suptitle-text inline-block">Farm to table</span>
            </h2>
          </div>
          <div className="vision-contents relative col-span-full md:col-span-5 xl:col-start-8 xl:col-end-11 opacity-0 invisible">
            {values.map((value, i) => (
              <div key={value} className={`vision-content w-full ${i > 0 ? 'absolute top-0 left-0' : 'relative'}`}>
                {tbd(`${value} paragraph`)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
