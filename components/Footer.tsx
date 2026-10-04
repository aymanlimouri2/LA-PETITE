import { contactLink, email, legal, locations, site, sitemap, year } from '@/content/site'
import { Wordmark } from './Wordmark'

/* Visit block, sitemap, keyed details and the black band (piece "footer"). */
export function Footer() {
  return (
    <footer className="footer flex flex-col items-end xl:h-screen -mt-px">
      <div
        data-piece="footer"
        className="relative w-full flex-1 grid-w content-end pt-100 pb-margin bg-white z-1 overflow-hidden"
      >
        <div className="col-span-full xl:col-span-5 flex flex-col items-start justify-between gap-y-32 max-xl:mb-32">
          <div className="flex flex-col items-start gap-y-10 body-24 md:body-36 font-display">
            <div className="text-mist">Visit La Petite</div>
            <a href={contactLink.href} className="link-underline text-black">
              Find us
            </a>
          </div>
          <div className="w-full flex max-xl:flex-col max-xl:gap-y-6 justify-between">
            <div>Newsletter</div>
            <div className="text-mist">TBD</div>
          </div>
        </div>
        <div className="col-span-full xl:col-start-7 xl:col-end-9 flex flex-col items-start gap-y-100 max-xl:mb-32">
          <div className="w-full flex justify-between">
            <div className="flex flex-col gap-y-4 xl:gap-y-8 items-start">
              {sitemap.map((item) => (
                <a key={item.href} href={item.href} className="xl:hover:text-mist">
                  {item.label}
                </a>
              ))}
            </div>
            <div className="xl:hidden">N</div>
          </div>
          <div className="footer-scroll text-mist cursor-pointer flex gap-x-10 xl:hover:text-black max-xl:hidden">
            <div>Back to top</div>
          </div>
        </div>
        <div className="col-span-full xl:col-start-10 xl:col-end-13 flex flex-col justify-between xl:h-full max-xl:mb-32">
          <div className="flex flex-col gap-y-4 md:gap-y-12 xl:gap-y-20">
            {locations.map((l) => (
              <div key={l.slug} className="flex gap-x-30 max-xl:justify-between max-xl:flex-row-reverse">
                <div>L</div>
                <div>
                  <p>
                    {l.name}
                    <br />
                    {l.address}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex gap-x-30 max-xl:justify-between max-xl:flex-row-reverse">
              <div>P</div>
              <div>{locations[0].phone}</div>
            </div>
            <div className="flex gap-x-30 max-xl:justify-between max-xl:flex-row-reverse">
              <div>C</div>
              <div>{email}</div>
            </div>
          </div>
          <div className="flex justify-between gap-x-30 mt-4 md:mt-12 xl:mt-0">
            <div className="flex gap-x-6">
              <a href={site.instagram.url} target="_blank" rel="noopener" className="xl:hover:text-mist">
                {site.instagram.label}
              </a>
            </div>
            <div className="xl:hidden">S</div>
          </div>
        </div>
        <div className="col-span-3 md:col-span-6 xl:hidden">
          <div className="text-mist">
            All rights reserved
            <br />© La Petite {year}
          </div>
        </div>
        <div className="col-span-3 md:col-span-6 flex justify-end xl:hidden">
          <div className="flex flex-col md:items-end text-mist">
            {legal.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="col-span-6 md:col-span-12 xl:hidden flex justify-end text-mist mt-16">
          <div className="footer-scroll flex gap-x-25 cursor-pointer">
            <div>Back to top</div>
            <div className="w-16 h-16 flex-center -mt-1">
              <svg width="14" height="15" viewBox="0 0 14 15" fill="none" className="w-12" aria-hidden="true">
                <path d="M7 15V1M1 7l6-6 6 6" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 w-full bg-black z-0 overflow-hidden">
        <div className="footer-bottom p-margin">
          <div className="footer-bottom-inner flex flex-col gap-y-20">
            <div className="footer-bottom-overlay absolute-full pointer-events-none bg-black opacity-0 z-1" />
            <div className="w-full text-white">
              <Wordmark />
            </div>
            <div className="flex justify-between items-end text-white max-xl:hidden">
              <div className="no-br opacity-52">
                All rights reserved <br />© La Petite {year}
              </div>
              {legal.map((item) => (
                <a key={item.href} href={item.href} className="opacity-52 xl:hover:opacity-100">
                  {item.label}
                </a>
              ))}
              <div className="font-arabic body-24 opacity-52" lang="ar" dir="rtl">
                {site.arabicName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
