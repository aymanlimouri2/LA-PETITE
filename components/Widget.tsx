/* Discover pill markup; behaviour in lib/motion/widget.ts. */
export function Widget() {
  return (
    <div className="sticky bottom-margin left-0 -mt-20 w-full px-margin flex-center pointer-events-none z-widget">
      <a href="/" className="widget body-16 md:body-14 text-white pointer-events-auto opacity-0 invisible">
        <div className="widget-wrapper flex items-center pt-11 pb-9 rounded-4 overflow-hidden">
          <div className="widget-title-wrapper opacity-52">
            <div className="widget-title relative overflow-hidden" />
          </div>
          <div className="widget-cta flex items-center gap-x-6 pl-8 pr-12 whitespace-nowrap">
            <div className="widget-cta-label block">Discover</div>
            <div className="widget-icon svg-wrapper w-11 text-white -mt-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </div>
  )
}
