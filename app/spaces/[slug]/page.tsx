import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Corners } from '@/components/Corners'
import { Footer } from '@/components/Footer'
import { ArrowLeftIcon } from '@/components/Icons'
import { Placeholder } from '@/components/Placeholder'
import { Subtitle } from '@/components/Subtitle'
import { locations, site, tbd, TBD } from '@/content/site'

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const location = locations.find((l) => l.slug === slug)
  return { title: location ? `${location.name} · LA PETITE` : 'LA PETITE' }
}

/* One page per location, on the reference project-page template. */
export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const index = locations.findIndex((l) => l.slug === slug)
  if (index < 0) notFound()
  const l = locations[index]
  const next = locations[(index + 1) % locations.length]

  const tags = [
    { label: 'City', value: l.city, className: 'lg:col-span-3' },
    { label: 'Café', value: site.descriptor, className: 'lg:col-span-4 xl:col-span-3' },
    { label: 'Hours', value: TBD, className: 'lg:col-span-2' },
    { label: 'Menu', value: l.menu.pdf ? l.menu.label : TBD, className: 'lg:col-start-10 lg:col-end-13', end: true },
  ]
  const details = [
    { label: 'Address', value: l.address },
    { label: 'Opening hours', value: l.hours },
    { label: 'Phone', value: l.phone },
    { label: 'Menu', value: l.menu.pdf ? l.menu.label : tbd(`${l.menu.label} PDF`) },
  ]

  return (
    <>
      <div className="single">
        <div className="single-work relative pb-100">
          <div className="sticky top-0 left-0 w-full h-screen-mobile xl:h-screen pb-margin flex justify-center items-end pointer-events-none z-widget">
            <div className="widget-simple !sticky bottom-margin -mb-[calc(8rem_+_var(--margin))] body-16 md:body-14 text-white pointer-events-auto">
              <div className="widget-work relative flex justify-center items-end overflow-hidden">
                <a href="/spaces" className="widget-back flex gap-x-12 items-center pt-11 pb-9 pl-10 pr-12">
                  <div className="flex gap-x-6 items-center">
                    <div className="widget-left w-16 h-16 md:w-14 md:h-14 flex-center">
                      <div className="widget-back-icon svg-wrapper w-7 md:w-6 -mt-2">
                        <ArrowLeftIcon />
                      </div>
                    </div>
                    <div className="widget-right">
                      <div className="widget-back-text">Back to all spaces</div>
                    </div>
                  </div>
                </a>
                <a
                  href={`/spaces/${next.slug}`}
                  className="widget-next group absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-x-22 pl-5 py-5 pr-40 opacity-0 invisible bg-white/0 xl:hover:bg-white/12 transition-colors duration-smooth ease-out"
                >
                  <div className="widget-next-image relative w-87 shrink-0">
                    <div className="relative w-full h-0 pt-[80%] rounded-2 overflow-hidden">
                      <div className="absolute-full scale-105 xl:group-hover:scale-100 transition-transform duration-smooth ease-out">
                        <Placeholder tone={next.tone} label="TBD" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-5 whitespace-nowrap">
                    <div className="text-white overflow-hidden">
                      <span className="widget-next-title inline-block">{next.name}</span>
                    </div>
                    <div className="text-white/52 overflow-hidden">
                      <span className="widget-next-subtitle inline-block">Go to next space</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div data-piece="single-work" className="relative block -mt-screen pb-margin">
            <Corners corners={['bl', 'br']} />
            <div data-piece="cover-work" className="cover-work block pt-250 mb-68 md:mb-100">
              <div className="grid-w">
                <div className="col-span-full md:col-span-9 mb-48 lg:mb-52 overflow-hidden">
                  <h1 className="cover-work-title body-48 md:body-60 font-display font-normal uppercase">{l.name}</h1>
                </div>
                <div className="col-span-full grid grid-cols-12 lg:flex lg:justify-between gap-x-gutter gap-y-8 mb-52 md:mb-20">
                  {tags.map((t) => (
                    <div key={t.label} className={`col-span-full ${t.className} overflow-hidden`}>
                      <div className={`cover-work-tag flex ${t.end ? 'lg:justify-end' : ''} gap-x-gutter md:gap-x-10`}>
                        <div className="max-lg:w-col-2 text-mist">{t.label}</div>
                        <div>{t.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="max-xl:px-margin overflow-hidden">
                <div data-piece="fullwidth-image" className="fullwidth-image-image block overflow-hidden" data-appear="true">
                  <div className="fullwidth-image-inner relative w-full h-0 pt-[100%] md:pt-[54.7%]">
                    <div data-piece="parallax-image" className="absolute-full">
                      <div className="parallax-el w-full h-full">
                        <Placeholder tone={l.tone} label={`${l.short} cover photography TBD`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative grid-w pt-margin">
                <Corners corners={['tl', 'tr']} />
                <div className="col-span-full md:col-span-4 max-lg:mb-52">
                  <Subtitle number="01" label="Space details" />
                </div>
                <div className="col-span-full lg:col-start-6 xl:col-start-7 lg:col-end-13">
                  <div data-piece="content" className="block">
                    <h2 className="body-16 md:body-20 font-normal">{tbd('Space introduction')}</h2>
                  </div>
                  <div className="cover-work-details flex flex-col gap-y-20 mt-40">
                    {details.map((d) => (
                      <div key={d.label} className="cover-work-detail relative grid grid-cols-6 gap-x-gutter pt-20">
                        <div className="cover-work-detail-line absolute top-0 left-0 w-full h-px bg-mist" />
                        <div className="col-span-2 md:col-span-3">
                          <div className="overflow-hidden">
                            <span className="cover-work-detail-label inline-block">{d.label}</span>
                          </div>
                        </div>
                        <div className="cover-work-detail-content col-span-4 md:col-span-3">{d.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <section className="sticky-images grid-w gap-y-10">
              <div className="col-span-full md:col-span-3 flex items-end">
                <div className="relative md:sticky md:bottom-margin w-full h-0 pt-[100%] md:pt-[126%]">
                  <div className="absolute-full">
                    <Placeholder tone="almond" />
                  </div>
                </div>
              </div>
              <div className="col-span-full md:col-start-7 md:col-end-13">
                <div className="relative w-full h-0 pt-[100%] md:pt-[122%]">
                  <div className="absolute-full">
                    <Placeholder tone="rustic" />
                  </div>
                </div>
              </div>
            </section>

            <section className="content grid-w my-68 md:my-100 lg:my-150">
              <div data-piece="title" className="block col-span-full md:col-span-8 xl:col-span-9 max-md:mt-32 mb-32 md:mb-100">
                <h2 className="body-36 md:body-48 xl:body-60 font-display font-normal">{tbd('Quote')}</h2>
              </div>
              <div className="col-span-full md:col-start-1 md:col-end-5 max-md:order-first">
                <Subtitle number="02" label="About the space" />
              </div>
              <div className="col-span-full md:col-start-7 md:col-end-13">
                <div data-piece="content" className="body-16 md:body-20">
                  <p>{tbd('About the space copy')}</p>
                </div>
              </div>
            </section>

            <section className="three-columns-images grid grid-cols-1 md:grid-cols-3 gap-gutter my-gutter px-margin">
              {(['harvest', 'tawny', 'almond'] as const).map((tone) => (
                <div key={tone} className="col-span-1">
                  <div className="relative w-full h-0 pt-[100%]">
                    <div className="absolute-full">
                      <Placeholder tone={tone} />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="fullwidth-image px-margin my-gutter">
              <div className="relative w-full h-0 pt-[100%] md:pt-[54.7%]">
                <div className="absolute-full">
                  <Placeholder tone={l.tone} />
                </div>
              </div>
            </section>

            <section className="content flex flex-col max-md:justify-between max-md:gap-y-36 px-margin md:grid-w my-margin max-md:min-h-[calc(100vw_-_var(--margin)_*_2)] md:my-100 lg:my-150">
              <div className="col-span-full md:col-start-1 md:col-end-5 max-md:order-first">
                <Subtitle number="03" label="Visit" />
              </div>
              <div className="col-span-full md:col-start-7 md:col-end-13">
                <div data-piece="content" className="body-16 md:body-20">
                  <p>{tbd('Visit copy')}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
