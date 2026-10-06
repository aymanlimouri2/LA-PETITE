import { contactLink, mobileNav, nav, site } from '@/content/site'
import { Wordmark } from './Wordmark'

/* Header zones as the reference: wordmark · links · clock + location · contact. */
export function Header() {
  return (
    <header className="header sticky top-0 left-0 grid-w content-end w-full h-header text-black z-header">
      <div className="col-span-3 md:col-span-2">
        <a href="/" aria-label="Home" className="header-logo flex w-145 overflow-hidden">
          <Wordmark tone="auto" />
        </a>
      </div>
      <div className="col-span-3 md:col-span-10 flex justify-end xl:hidden overflow-hidden">
        <div className="header-toggler relative overflow-hidden cursor-pointer">
          <span className="header-toggler-menu inline-block">Menu</span>
        </div>
      </div>
      <div className="col-span-7 flex justify-start -mb-4 max-xl:hidden">
        <div className="header-links list-o flex items-end overflow-hidden">
          {nav.map((item, i) => (
            <a key={item.href} href={item.href} className="header-link list-o-item">
              {item.label}
              {i < nav.length - 1 ? ',' : ''}
            </a>
          ))}
        </div>
      </div>
      {/* Each item has its own mask so the longer La Petite location label can run past the zone. */}
      <div className="col-span-2 flex gap-x-12 items-end -mb-4 max-xl:hidden whitespace-nowrap">
        <span className="flex overflow-hidden">
          <span className="header-time flex gap-x-1 uppercase opacity-24">
            <span id="hour" />
            <span id="semicolon">:</span>
            <span id="minute" />
            <span id="ampm" className="ml-2" />
          </span>
        </span>
        <span className="flex overflow-hidden">
          <span className="header-location inline-block">{site.region}</span>
        </span>
      </div>
      <div className="col-span-1 flex items-end justify-end -mb-4 max-xl:hidden overflow-hidden">
        <a href={contactLink.href} className="header-contact block xl:hover:opacity-24">
          {contactLink.label}
        </a>
      </div>
      <div className="header-overlay fixed top-0 left-0 w-full h-screen-mobile bg-black opacity-0 pointer-events-none xl:hidden" />
      <div className="header-menu fixed top-0 left-0 w-full h-screen-mobile bg-beige text-black overflow-hidden xl:hidden">
        <div className="header-menu-inner absolute-full flex flex-col justify-center px-margin">
          <div className="absolute top-0 left-0 w-full h-header grid-w content-end">
            <div className="col-span-3 md:col-span-2">
              <a href="/" aria-label="Home" className="flex w-145 overflow-hidden">
                <Wordmark tone="black" />
              </a>
            </div>
            <div className="col-span-3 md:col-span-10 flex justify-end xl:hidden overflow-hidden">
              <div className="header-toggler-close cursor-pointer">Close</div>
            </div>
          </div>
          <div className="flex flex-col gap-y-16 items-start body-36 md:body-60 font-display">
            {mobileNav.map((item) => (
              <a key={item.href} href={item.href} className="overflow-hidden">
                <span className="header-link-mobile inline-block">{item.label}</span>
              </a>
            ))}
          </div>
          <div className="absolute left-margin right-margin bottom-20 flex gap-x-2 overflow-hidden">
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener"
              className="header-social-link xl:hover:text-black/40 transition-colors duration-[.45s] ease-out"
            >
              {site.instagram.label}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
