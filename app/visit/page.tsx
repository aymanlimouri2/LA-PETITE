import type { Metadata } from 'next'
import { Placeholder } from '@/components/Placeholder'
import { email, locations, site, tbd } from '@/content/site'

export const metadata: Metadata = { title: 'Visit · LA PETITE' }

/* Visit, on the reference contact template (no footer, as the reference). */
export default function VisitPage() {
  // The last city sizes the mask (as the reference); the first shows first.
  const ordered = locations
  return (
    <div className="contact">
      <div className="block">
        <div
          data-piece="contact"
          className="contact grid-w content-end pt-200 md:pt-100 pb-100 md:pb-margin min-h-screen-mobile xl:min-h-screen bg-beige"
        >
          <div className="col-span-full md:col-span-8 xl:col-span-6 flex flex-col justify-between gap-y-52 mb-32 md:mb-100 xl:mb-0">
            <h1 className="body-36 md:body-48 lg:body-60 font-display font-normal">
              <span className="contact-title">Visit us in</span>{' '}
              <span className="relative inline-flex overflow-hidden">
                {ordered.map((l, i) => (
                  <span
                    key={l.slug}
                    className={`contact-city inline-block ${i === ordered.length - 1 ? 'relative' : 'absolute top-0 left-0'}`}
                  >
                    {l.short}
                  </span>
                ))}
              </span>
            </h1>
            <div className="flex gap-x-2 max-xl:hidden">
              <a href={site.instagram.url} target="_blank" rel="noopener" className="xl:hover:text-white">
                {site.instagram.label}
              </a>
            </div>
          </div>
          <div className="col-span-full mb-52 md:hidden">
            <div className="relative w-full h-0 pt-[110%]">
              <div className="contact-image-mobile absolute-full">
                <Placeholder tone="tawny" />
              </div>
            </div>
          </div>
          <div className="col-span-full xl:col-start-8 xl:col-end-13">
            {locations.map((l, i) => (
              <div
                key={l.slug}
                className={`contact-detail grid grid-cols-12 xl:grid-cols-5 gap-x-gutter items-baseline ${i ? 'mt-32 md:mt-20' : ''}`}
              >
                <div className="col-span-full md:col-span-5 xl:col-span-2 uppercase body-14 overflow-hidden">
                  <span className="contact-detail-label inline-block">{l.short}</span>
                </div>
                <div className="contact-detail-content col-span-full md:col-span-7 xl:col-span-3 body-20 max-md:mt-12">
                  {l.address}. {l.hours}. {l.phone}.
                </div>
              </div>
            ))}
            <div className="contact-detail grid grid-cols-12 xl:grid-cols-5 gap-x-gutter items-baseline mt-32 md:mt-20">
              <div className="col-span-full md:col-span-5 xl:col-span-2 uppercase body-14 overflow-hidden">
                <span className="contact-detail-label inline-block">Email</span>
              </div>
              <div className="contact-detail-content col-span-full md:col-span-7 xl:col-span-3 body-20 max-md:mt-12">
                {email}
              </div>
            </div>
            <div className="contact-detail grid grid-cols-12 xl:grid-cols-5 gap-x-gutter mt-32 md:mt-68">
              <div className="col-span-full md:col-span-5 xl:col-span-2 flex flex-col justify-between">
                <div className="body-14 uppercase overflow-hidden">
                  <span className="contact-detail-label inline-block">Directions</span>
                </div>
                <div className="contact-detail-content body-20 mt-12">
                  <p>{tbd('Directions')}</p>
                </div>
              </div>
              <div className="col-span-full md:col-span-7 xl:col-span-3 max-md:hidden">
                <div className="relative w-full h-0 pt-[110%]">
                  <div className="contact-image absolute-full">
                    <Placeholder tone="tawny" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-32 md:hidden">
              <div className="uppercase body-14 mb-12">Socials</div>
              <div className="flex gap-x-2 body-20">
                <a href={site.instagram.url} target="_blank" rel="noopener">
                  {site.instagram.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
