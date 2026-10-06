import { Corners } from '@/components/Corners'
import { Photo } from '@/components/Photo'
import { Subtitle } from '@/components/Subtitle'
import { cafePhotos, site, tbd } from '@/content/site'

/* 01 Story (reference 01 Studio block). Beige ground. */
export function Story() {
  const l = site.brandLines
  return (
    <div
      className="about relative grid-w pt-margin max-xl:mb-100 xl:pb-margin bg-beige"
      data-widget
      data-widget-title="Story"
      data-widget-url="/story"
    >
      <Corners corners={['tl', 'tr']} />
      <div className="col-span-full md:col-span-3 xl:col-span-2 max-md:mb-52">
        <div className="relative w-full h-0 pt-[120%]">
          <div className="absolute top-0 left-0 w-full h-[calc(100%_+_25rem)]">
            <div className="relative md:sticky md:top-62 md:left-0 w-full h-0 pt-[120%]">
              <div className="absolute-full">
                <Photo {...cafePhotos.facade} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-full md:col-start-5 xl:col-start-7 md:col-end-11 max-md:order-first max-md:mb-52 flex flex-col justify-between">
        <Subtitle number="01" label="Story" />
        <div data-piece="content" className="wysiwyg w-full max-md:mt-25">
          <p>{l.farm}</p>
        </div>
      </div>
      <div className="col-span-full mb-32 md:mt-250 md:mb-100">
        <div data-piece="title" className="block md:-mt-40 lg:-mt-50 xl:-mt-57">
          <span className="inline-block md:w-col-4 xl:w-col-offset-3 max-md:hidden" />
          <h2 className="offset-title inline w-full body-36 md:body-48 lg:body-60 xl:body-72 font-display">
            {l.space} {l.associations} {l.farmToTable}
          </h2>
        </div>
      </div>
      <div
        data-piece="content"
        className="col-span-full md:col-start-1 md:col-end-4 xl:col-start-4 xl:col-end-6 body-16 max-md:mb-32 max-md:no-br"
      >
        Speciality café
      </div>
      <h3 className="col-span-full md:col-start-5 xl:col-start-7 md:col-end-11 xl:pb-150 font-normal">
        <div data-piece="content" className="wysiwyg">
          <p>{tbd('01 Story paragraph')}</p>
        </div>
      </h3>
    </div>
  )
}
