import { site } from '@/content/site'
import { Wordmark } from './Wordmark'

/* Loader layers; behaviour in lib/motion/loader.ts. */
export function LoaderMarkup() {
  return (
    <>
      <div className="loader-panel absolute-full bg-white z-loader" />
      <div className="loader fixed top-0 left-0 flex justify-center items-center px-margin w-screen h-screen-mobile xl:h-screen pointer-events-none">
        <div className="loader-logo relative w-full text-white py-margin overflow-hidden">
          {/* Clipped at the logo's own box: the official logo is taller for its width than the
              reference logotype, so the margin alone no longer hides letters that have rolled out. */}
          <div className="relative w-full overflow-hidden">
            <div className="loader-logo-top w-full">
              <Wordmark tone="white" />
            </div>
            <div className="loader-logo-bottom absolute top-0 left-0 w-full">
              <Wordmark tone="white" />
            </div>
          </div>
        </div>
        <div className="loader-overlay absolute-full bg-black opacity-0" />
        <div className="grid-w absolute top-margin left-0 w-full text-white uppercase tracking-[0.04em]">
          <div className="col-span-full md:col-span-4">
            <div className="loader-title">{site.descriptor}</div>
          </div>
        </div>
        <div className="grid-w absolute max-xl:bottom-margin xl:top-margin left-0 w-full text-white uppercase tracking-[0.04em]">
          <div className="col-span-3 md:col-span-6 xl:col-start-5 xl:col-end-9">
            <div className="loader-location">{site.region}</div>
          </div>
          <div className="col-span-3 md:col-span-6 xl:col-start-10 xl:col-end-13 flex justify-end">
            <div className="flex flex-col items-start">
              <div className="overflow-hidden">
                <div className="loader-loading">Loading</div>
              </div>
              <div className="overflow-hidden">
                <div className="loader-counter">0%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
