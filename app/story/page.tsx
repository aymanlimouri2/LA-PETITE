import type { Metadata } from 'next'
import { Corners } from '@/components/Corners'
import { Footer } from '@/components/Footer'
import { Placeholder } from '@/components/Placeholder'
import { Subtitle } from '@/components/Subtitle'
import { commitments, site, tbd, type Tone } from '@/content/site'

export const metadata: Metadata = { title: 'Story · LA PETITE' }

/* Story · Farm to table, on the reference process-page template. */
export default function StoryPage() {
  const l = site.brandLines
  const cardTones: Tone[] = ['tawny', 'almond', 'harvest', 'rustic']
  return (
    <>
      <div className="manifesto">
        <div className="block">
          <div data-piece="cover-manifesto" className="cover-manifesto block pt-200 md:pt-250">
            <div className="w-full px-margin mb-32 md:mb-margin">
              <span className="inline-block md:w-[calc(var(--column)*2)]" />
              <h1 className="cover-manifesto-title inline body-36 md:body-48 lg:body-60 font-display font-normal text-black [&.a]:text-mist transition-colors duration-normal ease-alpha">
                <p className="inline">
                  {l.space} A speciality café with <strong>humble associations</strong>. A modern take on{' '}
                  <strong>farm-to-table</strong>.
                </p>
              </h1>
            </div>
            <div data-piece="fullwidth-image" className="block w-full max-xl:px-margin" data-appear="true">
              <div className="fullwidth-image-inner relative w-full h-0 pt-[115%] md:pt-[54.7%]">
                <div data-piece="parallax-image" className="absolute-full">
                  <div className="parallax-el w-full h-full">
                    <Placeholder tone="tawny" label="Farm photography TBD" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="philosophy relative grid-w pt-100 lg:pt-150 mb-100 lg:mb-150">
            <Corners corners={['tl', 'tr']} />
            <div data-piece="title" className="block col-span-full mb-32 md:mb-100">
              <h2 className="body-36 md:body-48 lg:body-72 font-display font-normal">“{l.hero}”</h2>
            </div>
            <div className="col-span-full md:col-span-3 max-md:order-first max-md:mb-32">
              <Subtitle number="01" label="Our philosophy" />
            </div>
            <div data-piece="content" className="col-span-full md:col-start-7 md:col-end-13 block body-20 mb-52 md:mb-100 lg:mb-150">
              <p>{tbd('Philosophy copy')}</p>
            </div>
            <div className="col-span-full md:col-span-6 max-md:mb-gutter">
              <div className="relative w-full h-0 pt-[100%]">
                <div className="absolute-full">
                  <Placeholder tone="harvest" />
                </div>
              </div>
            </div>
            <div className="col-span-full md:col-span-6">
              <div className="relative w-full h-0 pt-[100%]">
                <div className="absolute-full">
                  <Placeholder tone="almond" />
                </div>
              </div>
            </div>
          </section>

          <div data-piece="stack-cards" className="initiatives block relative pt-margin pb-100 md:pb-150">
            <div className="grid-w">
              <div className="col-span-full md:col-span-3 max-xl:mb-52">
                <Subtitle number="02" label="Our commitments" as="h2" />
              </div>
              <div
                data-piece="title"
                className="block col-span-full md:max-xl:col-start-1 md:max-lg:col-end-10 lg:max-xl:col-end-8 xl:col-span-5 max-md:mb-24"
              >
                <h3 className="body-36 md:body-48 font-display font-normal">{l.farm}</h3>
              </div>
            </div>
            <div className="grid-w md:max-xl:mt-52">
              <div data-piece="content" className="col-span-full md:col-start-8 xl:col-start-10 md:col-end-13 block body-20">
                <p>{tbd('Commitments introduction')}</p>
              </div>
            </div>
            <div className="stack-cards-wrapper relative mt-52 md:mt-margin">
              {commitments.map((c, i) => (
                <div key={c.title} className="stack-cards-card px-margin" style={{ '--index': i } as React.CSSProperties}>
                  <div className="stack-cards-card-inner grid grid-cols-12 gap-x-gutter border-t-px border-mist py-margin bg-white">
                    <h4 className="col-span-full lg:col-span-7 body-24 md:body-36 lg:max-xl:mb-52 font-display font-normal">
                      {c.title}
                    </h4>
                    <div className="col-span-full lg:col-start-9 lg:col-end-13 row-span-2 max-lg:my-32">
                      <div className="relative w-full h-0 pt-[60%] lg:pt-[87%]">
                        <div className="absolute-full">
                          <Placeholder tone={cardTones[i % cardTones.length]} />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-full lg:col-span-7 flex items-end">
                      <div className="grid grid-cols-2 gap-x-40">
                        <div className="col-span-full md:col-span-1">{c.text}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
