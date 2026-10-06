import type { Metadata } from 'next'
import { Corners } from '@/components/Corners'
import { Footer } from '@/components/Footer'
import { ArrowRightIcon } from '@/components/Icons'
import { Placeholder } from '@/components/Placeholder'
import { Subtitle } from '@/components/Subtitle'
import { menus, site, tbd } from '@/content/site'

export const metadata: Metadata = { title: 'Our menus · LA PETITE' }

/*
 * Our menus, on the reference studio-page template: cover, quote, then the
 * hover / scroll-position list with a sticky image. Each entry opens its
 * official PDF once provided; no items, prices or categories are listed.
 */
export default function MenuPage() {
  return (
    <>
      <div className="about">
        <div className="block relative pb-120">
          <div className="sticky top-0 left-0 w-full h-screen-mobile xl:h-screen px-margin pb-margin flex justify-center items-end pointer-events-none z-widget">
            <div className="widget-about sticky bottom-margin flex justify-center items-end -mb-[calc(8rem_+_var(--margin))] body-16 md:body-14 text-white pointer-events-auto">
              <a href="/visit" className="widget-simple flex pt-11 pb-9 pl-10 pr-12">
                <div className="flex gap-x-6 items-center">
                  <div className="widget-left flex-center w-16 h-16 md:w-14 md:h-14">
                    <div className="widget-icon svg-wrapper w-13 md:w-12 -mt-2">
                      <ArrowRightIcon />
                    </div>
                  </div>
                  <div className="widget-right">Visit La Petite</div>
                </div>
              </a>
            </div>
          </div>

          <div className="relative -mt-screen">
            <Corners corners={['bl', 'br']} />
            <div data-piece="cover-about" className="cover-about block pt-250">
              <div className="grid-w md:mb-54">
                <div className="col-span-full md:col-span-8 lg:col-span-7">
                  <h1 className="cover-about-title body-36 md:body-48 lg:body-60 font-display font-normal">
                    Our menus. Al Ain and Abu Dhabi each have their own.
                  </h1>
                </div>
                <div className="col-start-11 col-end-13 flex justify-end items-end max-md:hidden">
                  <div className="text-mist">[Scroll down]</div>
                </div>
              </div>
              <div className="grid-w">
                <div className="col-span-full md:col-span-5 xl:col-span-4 flex items-end max-md:order-last">
                  <div className="cover-about-content sticky bottom-margin body-20">{tbd('Menus introduction')}</div>
                </div>
                <div data-piece="parallax-image" className="col-span-full md:col-start-7 md:col-end-13 max-md:my-32">
                  <div className="cover-about-image relative w-full h-0 pt-[115%]">
                    <div className="cover-about-image-inner absolute-full">
                      <div className="parallax-el w-full h-full">
                        <Placeholder tone="harvest" label="Menu photography TBD" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="quote px-margin my-100 md:my-150">
              <div className="w-full">
                <span className="inline-block md:w-[calc(var(--column)*2)]" />
                <div data-piece="title" className="inline">
                  <h2 className="offset-title inline body-48 lg:body-72 font-display font-normal">
                    {site.brandLines.farmToTable}
                  </h2>
                </div>
              </div>
            </section>

            <div data-piece="team" className="block relative mt-150 pb-150">
              <Corners corners={['bl', 'br']} />
              <div className="grid-w">
                <div className="col-span-full md:col-span-3">
                  <Subtitle number="01" label="The menus" as="h2" />
                </div>
              </div>
              {/* Two entries instead of the reference's long list: keep room for the sticky image. */}
              <div className="relative max-md:pt-100 -mt-17 md:-mt-25 md:min-h-screen">
                {menus.map((m, i) => {
                  const Tag = m.pdf ? 'a' : 'div'
                  return (
                    <Tag
                      key={m.label}
                      {...(m.pdf ? { href: m.pdf, target: '_blank', rel: 'noopener' } : {})}
                      className={`team-item ${i === 0 ? 'a' : ''} grid-w py-8 md:py-5 text-mist cursor-default [&.a]:text-black`}
                    >
                      <div className="col-span-3 md:col-start-5 md:col-end-9 flex flex-col body-24 md:body-36 lg:body-48 font-display">
                        {m.label}
                      </div>
                    </Tag>
                  )
                })}
                <div className="absolute-full grid-w pointer-events-none">
                  <div className="col-start-4 col-end-7 md:col-start-10 md:col-end-13">
                    <div className="team-sticky sticky top-0 flex flex-col gap-y-10">
                      <div className="relative w-full h-0 pt-[133%]">
                        {menus.map((m, i) => (
                          <div
                            key={m.label}
                            className={`team-image absolute-full [&.a]:opacity-100 ${i === 0 ? 'a' : 'opacity-0'}`}
                          >
                            <Placeholder tone={m.location.tone} label={`${m.location.short} menu image TBD`} />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <span className="max-xl:hidden">[</span>
                        <span className="relative max-xl:w-full">
                          {menus.map((m, i) => (
                            <div
                              key={m.label}
                              className={`team-job text-left xl:text-center xl:whitespace-nowrap opacity-0 [&.a]:opacity-100 ${
                                i === 0 ? 'a' : 'max-xl:absolute max-xl:top-0 max-xl:left-0 xl:absolute-center'
                              }`}
                            >
                              {m.pdf ? 'Open the PDF' : 'PDF TBD'}
                            </div>
                          ))}
                        </span>
                        <span className="max-xl:hidden">]</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
