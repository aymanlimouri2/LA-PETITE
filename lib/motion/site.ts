import Lenis from 'lenis'
import { gsap, registerMotion, ScrollTrigger } from './gsap'
import { Header } from './header'
import { Loader } from './loader'
import { emitPieces, mountPieces, unmountPieces } from './piece'
import { G } from './store'
import { Widget } from './widget'
import '@/lib/pieces'

type Push = (href: string) => void

function debounce<T extends (...args: never[]) => void>(wait: number, fn: T) {
  let t = 0
  return (...args: Parameters<T>) => {
    clearTimeout(t)
    t = window.setTimeout(() => fn(...args), wait)
  }
}

function throttle<T extends (...args: never[]) => void>(wait: number, fn: T) {
  let last = 0
  return (...args: Parameters<T>) => {
    const now = performance.now()
    if (now - last >= wait) {
      last = now
      fn(...args)
    }
  }
}

function getView() {
  return document.querySelector<HTMLElement>('[data-view]:not([data-view-clone])')!
}

/*
 * Runtime: smooth scroll, ScrollTrigger sync, one rAF loop, resize and
 * 1200px mode switch, page renderer events and page transitions.
 * The order of operations mirrors the reference's Site / Page /
 * GlobalTransition classes.
 */
export class Site {
  push: Push
  prefetch: Push
  header!: Header
  rafId = 0
  scrollTriggers: ScrollTrigger[] = []
  isTransitioning = false
  pending: { from: HTMLElement | null; trigger: 'click' | 'popstate' } | null = null
  lastHref = ''
  destroyed = false

  constructor({ push, prefetch }: { push: Push; prefetch: Push }) {
    this.push = push
    this.prefetch = prefetch
    this.resize = this.resize.bind(this)
    this.update = this.update.bind(this)
    this.onClick = this.onClick.bind(this)
    this.onPrefetch = this.onPrefetch.bind(this)
    this.onPopstate = this.onPopstate.bind(this)
    this.onAppearLoader = this.onAppearLoader.bind(this)
    this.onLoaderComplete = this.onLoaderComplete.bind(this)
    this.onTransitionStart = this.onTransitionStart.bind(this)
    this.onTransitionComplete = this.onTransitionComplete.bind(this)
    this.resizeDebounced = debounce(100, this.resize)
    this.scrollThrottled = throttle(30, () => this.scroll())
    this.scrollDebounced = debounce(100, () => this.scroll())

    registerMotion()
    G.w = { w: document.body.offsetWidth, h: window.innerHeight, pR: window.devicePixelRatio }
    G.remPx = parseFloat(getComputedStyle(document.documentElement).fontSize)
    G.detect.isMobile = window.matchMedia('(hover: none), (pointer: coarse)').matches
    this.start()
  }

  resizeDebounced: () => void
  scrollThrottled: () => void
  scrollDebounced: () => void

  start() {
    G.fade = document.querySelector('.fade')
    history.scrollRestoration = 'manual'
    const root = document.documentElement
    root.style.setProperty('--vw', `${document.body.offsetWidth}px`)
    root.style.setProperty('--vh-initial', `${G.w.h / 100}px`)
    root.style.setProperty('--vh-initial-dynamic', `${G.w.h / 100}px`)
    root.style.setProperty('--v-ratio', `${G.w.h / G.w.w}`)
    G.remPx = parseFloat(getComputedStyle(root).fontSize)
    G.navigate = (href) => this.navigateTo(href, 'click')
    this.initSmoothScroll()
    this.initScrollTrigger()
    this.lastHref = window.location.href
    G.view = getView()
    this.pageEnter()
    this.pageEnterCompleted()
    G.loader = new Loader(() => mountPieces(G.view!))
    this.header = new Header()
    G.header = this.header
    this.events()
    this.rafId = requestAnimationFrame(this.update)
  }

  destroy() {
    this.destroyed = true
    cancelAnimationFrame(this.rafId)
    window.removeEventListener('resize', this.resizeDebounced)
    window.removeEventListener('orientationchange', this.resize)
    window.removeEventListener('wheel', this.scrollThrottled)
    window.removeEventListener('wheel', this.scrollDebounced)
    window.removeEventListener('popstate', this.onPopstate)
    document.removeEventListener('click', this.onClick)
    document.removeEventListener('mouseover', this.onPrefetch)
    this.header?.destroy()
    unmountPieces()
    G.smoothScroll?.destroy()
  }

  initSmoothScroll() {
    G.smoothScroll?.destroy()
    G.smoothScroll = new Lenis({
      wrapper: document.querySelector<HTMLElement>('#app')!,
      content: document.querySelector<HTMLElement>('#wrapper')!,
      easing: (t: number) => 1 - Math.pow(1 - t, 5),
      wheelEventsTarget: document.body,
      // The standard experience is never altered by the reduced-motion setting.
      respectReducedMotion: false,
    } as ConstructorParameters<typeof Lenis>[0])
    G.smoothScroll.on('scroll', () => this.scroll())
  }

  initScrollTrigger() {
    ScrollTrigger.defaults({ scroller: '#app' })
  }

  events() {
    window.addEventListener('resize', this.resizeDebounced)
    window.addEventListener('orientationchange', this.resize)
    window.addEventListener('wheel', this.scrollThrottled)
    window.addEventListener('wheel', this.scrollDebounced)
    window.addEventListener('popstate', this.onPopstate)
    document.addEventListener('click', this.onClick)
    document.addEventListener('mouseover', this.onPrefetch)
  }

  update(t: number) {
    if (this.destroyed) return
    G.smoothScroll?.raf(t)
    ScrollTrigger.update()
    emitPieces('update', t)
    this.rafId = requestAnimationFrame(this.update)
  }

  scroll() {
    emitPieces('scroll')
  }

  resize() {
    const xChanged = window.innerWidth !== G.w.w
    G.w = { w: document.body.offsetWidth, h: window.innerHeight, pR: window.devicePixelRatio }
    const root = document.documentElement
    root.style.setProperty('--vh-initial-dynamic', `${G.w.h / 100}px`)
    root.style.setProperty('--v-ratio', `${G.w.h / G.w.w}`)
    if (xChanged) this.resizeX()
    G.remPx = parseFloat(getComputedStyle(root).fontSize)
    G.widget?.resize()
    emitPieces('resize')
  }

  resizeX() {
    const root = document.documentElement
    root.style.setProperty('--vw', `${document.body.offsetWidth}px`)
    root.style.setProperty('--vh-initial', `${G.w.h / 100}px`)
    G.remPx = parseFloat(getComputedStyle(root).fontSize)
    G.loader?.resizeX()
    this.screenChange()
    emitPieces('resizeX')
  }

  screenChange() {
    const isMobile = G.w.w < 1200
    if (isMobile !== G.isMobile) {
      G.isMobile = isMobile
      G.loader?.screenChange()
      emitPieces('screenChange')
    }
    if (!G.isMobile && this.header.isOpen) this.header.close()
  }

  /* ---------- Page renderer ---------- */

  pageEnter() {
    G.isMobile = G.w.w < 1200
    if (!G.isFirstLoaded) G.emitter.on('end-loader', this.onLoaderComplete)
    G.emitter.on('start-transition', this.onTransitionStart)
    G.emitter.on('end-transition', this.onTransitionComplete)
    const view = G.view!
    G.widget = view.querySelector('.widget') ? new Widget(view) : null
  }

  pageLeave() {
    G.emitter.off('start-transition', this.onTransitionStart)
    G.emitter.off('end-transition', this.onTransitionComplete)
    G.emitter.off('end-loader', this.onLoaderComplete)
  }

  pageLeaveCompleted() {
    G.widget?.destroy()
    this.scrollTriggers.forEach((t) => t.kill())
    this.scrollTriggers = []
  }

  pageEnterCompleted() {
    if (G.isFirstLoaded) this.appear()
    else G.emitter.on('appear-loader', this.onAppearLoader)
  }

  onAppearLoader() {
    G.emitter.off('appear-loader', this.onAppearLoader)
    this.appear()
  }

  detectDarkSections() {
    const header = document.querySelector('.header')!
    G.view!.querySelectorAll<HTMLElement>('[data-dark]').forEach((el) => {
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: () => `top-=${G.remToPixel(3)} top`,
        end: () => `bottom-=${G.remToPixel(3)}px top`,
        onEnter: () => header.classList.add('header-light'),
        onEnterBack: () => header.classList.add('header-light'),
        onLeave: () => header.classList.remove('header-light'),
        onLeaveBack: () => header.classList.remove('header-light'),
      })
      this.scrollTriggers.push(trigger)
    })
  }

  appear() {
    const isHome = Boolean(G.view!.querySelector('.home'))
    const header = document.querySelector('.header')!
    if (G.isFirstLoaded) {
      if (isHome) header.classList.add('header-light')
      else header.classList.remove('header-light')
    }
    emitPieces('appear')
  }

  onTransitionComplete() {
    G.pageHeight = G.smoothScroll!.dimensions.scrollHeight
    G.widget?.init()
    this.detectDarkSections()
    emitPieces('ready')
  }

  onTransitionStart() {
    emitPieces('onTransitionStart')
  }

  onLoaderComplete() {
    G.emitter.off('end-loader', this.onLoaderComplete)
    this.detectDarkSections()
    G.widget?.init()
    G.pageHeight = G.smoothScroll!.dimensions.scrollHeight
    emitPieces('ready')
  }

  /* ---------- Router and transitions (limitation L3) ---------- */

  linkFromEvent(e: MouseEvent) {
    const a = (e.target as Element | null)?.closest?.('a')
    if (!a || !a.getAttribute('href')) return null
    if (a.target || a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return null
    if (a.getAttribute('href')!.startsWith('#')) return null
    const url = new URL(a.href, window.location.href)
    if (url.origin !== window.location.origin) return null
    return { a, url }
  }

  onClick(e: MouseEvent) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    const link = this.linkFromEvent(e)
    if (!link) return
    const current = new URL(window.location.href)
    if (current.pathname === link.url.pathname && current.search === link.url.search) {
      if (!link.url.hash && !current.hash) e.preventDefault()
      return
    }
    e.preventDefault()
    this.navigateTo(link.url.href, 'click')
  }

  onPrefetch(e: MouseEvent) {
    const link = this.linkFromEvent(e)
    if (link) this.prefetch(link.url.pathname + link.url.search)
  }

  onPopstate() {
    if (this.isTransitioning) return
    const url = new URL(window.location.href)
    if (url.href === this.lastHref) return
    // Next has already moved the URL; hold the outgoing page before it re-renders.
    this.isTransitioning = true
    this.leave('popstate').then(() => {
      this.pending = { from: this.holdOutgoingPage(), trigger: 'popstate' }
    })
  }

  navigateTo(href: string, trigger: 'click' | 'popstate') {
    if (this.isTransitioning) return
    this.isTransitioning = true
    const url = new URL(href, window.location.href)
    this.leave(trigger).then(async () => {
      if (!G.isMobile && G.isFooterVisible) {
        await new Promise<void>((resolve) =>
          G.smoothScroll!.scrollTo(G.pageHeight - G.w.h - G.footerHeight - 10, {
            force: true,
            lock: true,
            duration: 0.7,
            onComplete: () => resolve(),
          }),
        )
      }
      this.pending = { from: G.isMobile ? null : this.holdOutgoingPage(), trigger }
      this.push(url.pathname + url.search + url.hash)
    })
  }

  // Outgoing page hold: a static copy stays in place while the new page rises over it.
  holdOutgoingPage() {
    const view = getView()
    const clone = view.cloneNode(true) as HTMLElement
    clone.setAttribute('data-view-clone', '')
    clone.setAttribute('aria-hidden', 'true')
    clone.querySelectorAll('[data-piece]').forEach((el) => el.removeAttribute('data-piece'))
    clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'))
    clone.querySelectorAll('video').forEach((v) => v.pause())
    document.querySelector('#view-from')!.appendChild(clone)
    view.style.visibility = 'hidden'
    return clone
  }

  leave(trigger: 'click' | 'popstate') {
    this.pageLeave()
    G.isFirstLoaded = true
    G.smoothScroll?.stop()
    return new Promise<void>((resolve) => {
      if (G.isMobile && trigger === 'click') {
        gsap.fromTo(
          G.fade,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              G.smoothScroll?.scrollTo(0, { immediate: true, force: true })
              resolve()
            },
          },
        )
      } else resolve()
    })
  }

  // Called by the shell after Next.js has committed a new route.
  onRouteCommitted() {
    const href = window.location.href
    if (href === this.lastHref && !this.pending) return
    this.lastHref = href
    const pending = this.pending ?? { from: null, trigger: 'popstate' as const }
    if (!this.pending) {
      // Route changed without a click we handled (e.g. back button before we saw popstate).
      this.isTransitioning = true
      this.pageLeave()
      G.isFirstLoaded = true
      G.smoothScroll?.stop()
    }
    this.pending = null

    // The outgoing page's controllers belong to DOM React has just removed.
    this.pageLeaveCompleted()
    unmountPieces((el) => el.isConnected)
    G.view = getView()
    this.header.onPageChange(window.location)
    this.pageEnter()

    const to = G.view
    const done = () => this.pageEnterCompleted()
    const video = to.querySelector<HTMLVideoElement>('.cover-home-video')
    const ready = video
      ? new Promise<void>((resolve) => {
          video.onloadeddata = () => resolve()
          video.src = video.dataset.src || ''
          video.load()
        })
      : Promise.resolve()

    ready.then(() => {
      if (G.isMobile || !pending.from) this.fade(to, pending.from, done)
      else this.translate(to, pending.from, done)
    })
  }

  fade(to: HTMLElement, from: HTMLElement | null, done: () => void) {
    from?.remove()
    to.style.visibility = ''
    if (G.fade && gsap.getProperty(G.fade, 'opacity') === 0) gsap.set(G.fade, { autoAlpha: 1 })
    G.smoothScroll?.scrollTo(0, { immediate: true, force: true })
    G.smoothScroll?.start()
    const tl = gsap.timeline({
      delay: 0.05,
      paused: true,
      onStart: () => G.emitter.emit('start-transition'),
      onComplete: () => {
        this.isTransitioning = false
        G.emitter.emit('end-transition')
      },
    })
    tl.to(G.fade, { autoAlpha: 0, duration: 0.35, ease: 'alpha' }, 0).call(done, [], 0.1)
    mountPieces(to)
    tl.play()
  }

  translate(to: HTMLElement, from: HTMLElement, done: () => void) {
    const header = document.querySelector('.header')
    const overlay = document.querySelector('.page-overlay')
    gsap.set(to, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1,
      marginTop: 0,
      autoAlpha: 0,
      y: 1.1 * G.w.h,
    })
    const tl = gsap.timeline({
      delay: 0.05,
      paused: true,
      defaults: { ease: 'gl.fastInOut', duration: 1.35 },
      onStart: () => G.emitter.emit('start-transition'),
      onComplete: () => {
        from.remove()
        gsap.set(overlay, { autoAlpha: 0 })
        gsap.set(to, { clearProps: 'all' })
        to.style.visibility = ''
        G.smoothScroll!.scrollTo(0, { immediate: true, force: true })
        G.smoothScroll!.resize()
        this.isTransitioning = false
        G.emitter.emit('end-transition')
        G.smoothScroll!.start()
      },
    })
    tl.set(to, { autoAlpha: 1 })
      .to(header, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, 0)
      .to(from, { transformOrigin: 'top', y: G.remToPixel(2), scale: 1 - G.remToPixel(4) / G.w.w, duration: 1.4 }, 0)
      .to(header, { autoAlpha: 1, duration: 0.3, ease: 'alpha' }, '<60%')
      .fromTo(to, { clipPath: 'inset(30% 40% 0%)' }, { y: 0, clipPath: 'inset(0% 0% 0%)' }, 0)
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.6, ease: 'alpha' }, '<10%')
      .call(done, [], '<60%')
    mountPieces(to)
    tl.play()
  }
}
