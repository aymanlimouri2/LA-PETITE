'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import type { Site } from '@/lib/motion/site'
import { fitWordmarks } from '@/lib/motion/fit'
import { Header } from './Header'
import { LoaderMarkup } from './LoaderMarkup'

/*
 * Persistent layers (loader, fade, frames, overlay) and the scroll
 * container. Starts the motion runtime once fonts are ready, and tells it
 * when Next.js has committed a new route so it can run the page transition.
 */
export function Shell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const site = useRef<Site | null>(null)

  useEffect(() => {
    let cancelled = false
    const onResize = () => fitWordmarks()
    window.addEventListener('resize', onResize)
    Promise.all([document.fonts.ready, import('@/lib/motion/site')]).then(([, mod]) => {
      if (cancelled) return
      fitWordmarks()
      site.current = new mod.Site({
        push: (href) => router.push(href, { scroll: false }),
        prefetch: (href) => router.prefetch(href),
      })
    })
    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
      site.current?.destroy()
      site.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    if (!site.current) return
    fitWordmarks()
    site.current.onRouteCommitted()
  }, [pathname])

  return (
    <>
      <LoaderMarkup />
      <div className="fade fixed top-0 left-0 w-full h-screen bg-white pointer-events-none z-10 opacity-0 invisible xl:z-transition" />
      <div className="frame fixed top-0 left-0 w-full h-screen-mobile xl:h-screen pointer-events-none z-1">
        <div className="frame-left absolute top-0 left-0 w-20 h-full bg-black origin-left scale-x-0" />
        <div className="frame-right absolute top-0 right-0 w-20 h-full bg-black origin-right scale-x-0" />
      </div>
      <div className="page-overlay fixed top-0 left-0 w-full h-screen-mobile xl:h-screen bg-black opacity-0 z-1 pointer-events-none" />
      <div id="app">
        <div id="wrapper">
          <Header />
          <main id="main" className="main">
            <div id="view-from" />
            <div data-view>{children}</div>
          </main>
        </div>
      </div>
    </>
  )
}
