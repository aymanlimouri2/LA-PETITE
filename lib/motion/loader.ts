import { gsap, timeline } from './gsap'
import { Split } from './split'
import { G } from './store'

/*
 * Loader and homepage scroll gate. Locked to the reference sequence
 * (blueprint section 4): letter roll, meta lines, counter, sheet rise,
 * then the first wheel / touch plays the entry instead of scrolling.
 * No timeout or fallback: if a hero film is present the loader waits for
 * its first frame (runtime risk R1).
 */
export class Loader {
  hasScrolled = false
  isHome = false

  $el!: HTMLElement
  $panel!: HTMLElement
  $logo!: HTMLElement
  $overlay!: HTMLElement
  $title!: HTMLElement | null
  $location!: HTMLElement | null
  $loading!: HTMLElement
  $counter!: HTMLElement
  $lettersTop!: HTMLElement[]
  $lettersBottom!: HTMLElement[]
  $app!: HTMLElement
  $image!: HTMLElement | null
  $imageInner!: HTMLElement | null
  $imageParallax!: HTMLElement | null
  $titleLight!: HTMLElement | null
  $titleDark!: HTMLElement | null
  $contentDark!: HTMLElement | null
  $bottomDark!: HTMLElement | null
  $content!: HTMLElement | null
  $video!: HTMLVideoElement | null
  $bottomBrackets!: HTMLElement[]
  $bottomText!: HTMLElement[]
  $bottomLight!: HTMLElement | null
  $header!: HTMLElement
  $headerLogo!: HTMLElement[]
  $headerLinks!: HTMLElement
  $headerToggler!: HTMLElement
  $headerItems!: HTMLElement[]
  $headerTime!: HTMLElement
  $headerLocation!: HTMLElement
  $headerContact!: HTMLElement

  splittedContent: Split | null = null
  splittedTitle: Split | null = null
  splittedDarkTitle: Split | null = null
  splittedDarkContent: Split | null = null
  splittedLoaderTitle: Split | null = null
  splittedLocation: Split | null = null

  constructor(mountPieces: () => void) {
    this.getElems()
    G.smoothScroll?.scrollTo(0, { immediate: true, force: true })
    this.isHome = Boolean(G.view?.querySelector('.home'))
    if (this.isHome) this.initAnimations()
    G.smoothScroll?.stop()
    mountPieces()
    if (this.isHome) this.loadHome()
    else this.load()
  }

  getElems() {
    const q = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)
    const qa = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s))
    this.$el = q('.loader')!
    this.$panel = q('.loader-panel')!
    this.$logo = this.$el.querySelector('.loader-logo')!
    this.$overlay = this.$el.querySelector('.loader-overlay')!
    this.$title = q('.loader-title')
    this.$location = q('.loader-location')
    this.$loading = q('.loader-loading')!
    this.$counter = q('.loader-counter')!
    this.$lettersTop = qa('.loader-logo-top .wordmark-letter')
    this.$lettersBottom = qa('.loader-logo-bottom .wordmark-letter')
    this.$app = q('#wrapper')!
    this.$image = q('.cover-home-image')
    this.$imageInner = q('.cover-home-image-inner')
    this.$imageParallax = q('.cover-home-image-prlx')
    this.$titleLight = q('.cover-home-title-light')
    this.$titleDark = q('.cover-home-title-dark')
    this.$contentDark = q('.cover-home-content-dark')
    this.$bottomDark = q('.cover-home-bottom-dark')
    this.$content = q('.cover-home-content')
    this.$video = q<HTMLVideoElement>('.cover-home-video')
    this.$bottomBrackets = qa('.cover-home-scroll-bracket')
    this.$bottomText = qa('.cover-home-scroll-text')
    this.$bottomLight = q('.cover-home-bottom-light')
    this.$header = q('.header')!
    this.$headerLogo = qa('.header-logo .wordmark-letter')
    this.$headerLinks = q('.header-links')!
    this.$headerToggler = q('.header-toggler')!
    this.$headerItems = qa('.header-link')
    this.$headerTime = q('.header-time')!
    this.$headerLocation = q('.header-location')!
    this.$headerContact = q('.header-contact')!
  }

  initAnimations() {
    gsap.set(this.$headerLinks, { x: -this.$headerLinks.getBoundingClientRect().left + G.remToPixel(2) })
    this.splittedContent = new Split({ target: this.$content!, by: 'lines', plugin: 'wrapLines', willChange: true })

    if (G.isMobile) {
      this.splittedTitle = new Split({ target: this.$titleLight!, by: 'lines', plugin: 'wrapLines', willChange: true })
      gsap.set(this.splittedTitle.instance.wrapLines, { yPercent: 100 })
      gsap.set(this.splittedContent.instance.wrapLines, { yPercent: 100 })
      gsap.set(this.$imageParallax, { scale: 1.1 })
      this.$header.classList.add('header-light')
    } else {
      gsap.set(this.$imageInner, { scale: 0.75 })
      gsap.set(this.$image, { clipPath: `inset(${G.w.h}px ${0.5 * G.w.w}px)` })
      gsap.set(this.$bottomLight, { y: -G.remToPixel(16) })
      if (this.$titleDark) {
        this.splittedDarkTitle = new Split({ target: this.$titleDark, by: 'lines', plugin: 'wrapLines', willChange: true })
        gsap.set(this.splittedDarkTitle.instance.wrapLines, { yPercent: 100 })
      }
      if (this.$contentDark) {
        this.splittedDarkContent = new Split({
          target: this.$contentDark,
          by: 'lines',
          plugin: 'wrapLines',
          willChange: true,
        })
        gsap.set(this.splittedDarkContent.instance.wrapLines, { yPercent: 100 })
      }
      gsap.set(this.$bottomText, { yPercent: 100 })
      gsap.set(this.$bottomBrackets, { opacity: 0 })
      gsap.set(this.$bottomBrackets[0], { x: 20 })
      gsap.set(this.$bottomBrackets[1], { x: -20 })
      gsap.set([this.$headerItems, this.$headerTime, this.$headerLocation, this.$headerContact], { yPercent: 100 })
    }

    gsap.set(this.$app, {
      scale: 1 - G.remToPixel(4) / G.w.w,
      clipPath: G.isMobile ? `inset(${1.1 * G.w.h}px ${0.1 * G.w.w}px 0px)` : `inset(${G.w.h}px ${0.3 * G.w.w}px 0px)`,
    })
    gsap.set(this.$app, { y: this.$logo.offsetHeight - this.$app.getBoundingClientRect().top })
    gsap.set(this.$lettersTop, { yPercent: 120 })
    gsap.set(this.$lettersBottom, { yPercent: 240 })
    if (this.$title) {
      this.splittedLoaderTitle = new Split({ target: this.$title, by: 'lines', plugin: 'wrapLines', willChange: true })
      gsap.set(this.splittedLoaderTitle.instance.wrapLines, { yPercent: 100 })
    }
    if (this.$location) {
      this.splittedLocation = new Split({ target: this.$location, by: 'lines', plugin: 'wrapLines', willChange: true })
      gsap.set(this.splittedLocation.instance.wrapLines, { yPercent: 100 })
    }
    gsap.set([this.$loading, this.$counter], { yPercent: 100 })
    gsap.set(this.$headerLogo, { yPercent: 120 })
    gsap.set(this.$headerToggler, { yPercent: 100 })
  }

  loadVideo(): Promise<void> | false {
    const video = this.$video
    if (!video) return false
    return new Promise((resolve) => {
      video.onloadeddata = () => resolve()
      video.src = video.dataset.src || ''
      video.load()
    })
  }

  loadHome() {
    const videoReady = this.loadVideo()
    const intro = gsap.timeline({ delay: 0.25 })
    const reveal = timeline({
      paused: true,
      onComplete: () => {
        window.addEventListener('touchmove', () => !this.hasScrolled && this.onHomeScroll(), { once: true })
        window.addEventListener('wheel', () => !this.hasScrolled && this.onHomeScroll(), { once: true })
      },
    })

    intro
      .to(this.$panel, { autoAlpha: 0, ease: 'alpha', duration: 0.35 })
      .to(this.$lettersTop, { yPercent: -120, ease: 'expo.out', duration: 2, stagger: 0.0475 }, '<30%')
      .to(this.$lettersBottom, { yPercent: 0, ease: 'expo.out', duration: 2, stagger: 0.0475 }, '<')
    if (this.splittedLoaderTitle) {
      intro.to(
        this.splittedLoaderTitle.instance.wrapLines,
        { yPercent: 0, ease: 'expo.out', duration: 1.2, stagger: 0.075 },
        '<',
      )
    }
    if (this.splittedLocation) {
      intro.to(
        this.splittedLocation.instance.wrapLines,
        { yPercent: 0, ease: 'expo.out', duration: 1.2, stagger: 0.075 },
        '<=+0.1',
      )
    }
    intro
      .to([this.$loading, this.$counter], { yPercent: 0, ease: 'expo.out', duration: 1.2, stagger: 0.075 }, '<=+0.1')
      .to(this.$counter, { textContent: '100%', snap: { textContent: 1 }, ease: 'gl.fastInOut', duration: 3 }, '<')
      .call(
        () => {
          if (videoReady) Promise.all([videoReady]).then(() => reveal.play())
          else reveal.play()
        },
        [],
        G.isMobile ? '<20%' : '<70%',
      )
    intro.call(() => G.emitter.emit('appear-loader'), [], 0.2)

    if (this.splittedLoaderTitle) {
      reveal.to(
        this.splittedLoaderTitle.instance.wrapLines,
        { yPercent: -100, ease: 'gl.fastInOut', duration: 1.2, stagger: 0.05 },
        0,
      )
    }
    if (this.splittedLocation) {
      reveal.to(
        this.splittedLocation.instance.wrapLines,
        { yPercent: -100, ease: 'gl.fastInOut', duration: 1.2, stagger: 0.05 },
        '<=+0.1',
      )
    }
    reveal
      .to([this.$loading, this.$counter], { yPercent: -100, ease: 'gl.fastInOut', duration: 1.2, stagger: 0.05 }, '<=+0.1')
      .to(
        this.$logo,
        { y: -this.$logo.getBoundingClientRect().top, ease: 'gl.fastInOut', duration: 1.7 },
        G.isMobile ? '<25%' : 0.1,
      )
      .to(this.$app, { clipPath: 'inset(0px 0px 0px)', ease: 'gl.fastInOut', duration: 1.7 }, '<')

    if (G.isMobile) {
      if (this.splittedTitle) {
        const lines = this.splittedTitle.instance.wrapLines
        reveal.call(() => {
          gsap.to(lines, { yPercent: 0, ease: 'expo.out', duration: 1.2, stagger: 0.08 })
        }, [], '<30%')
      }
    } else {
      reveal
        .to(
          this.$image,
          { clipPath: `inset(${0.25 * G.w.h}px ${0.3 * G.w.w}px 0px)`, ease: 'gl.fastInOut', duration: 1.2 },
          '<0.1',
        )
        .to(this.$imageInner, { scale: 0.8, ease: 'gl.fastInOut', duration: 1.2 }, '<')
        .addLabel('reveal-content', this.splittedDarkTitle ? '<45%' : '<60%')
      if (this.splittedDarkTitle) reveal.revealTitle(this.splittedDarkTitle.instance.wrapLines, {}, 'reveal-content')
      if (this.splittedDarkContent) reveal.revealContent(this.splittedDarkContent.instance.wrapLines, {}, '<5%')
      reveal
        .to(
          [this.$headerItems, this.$headerTime, this.$headerLocation, this.$headerContact],
          { yPercent: 0, ease: 'expo.out', duration: 1.2, stagger: 0.05 },
          this.splittedDarkTitle ? '<10%' : 'reveal-content',
        )
        .to(this.$bottomBrackets, { x: 0, ease: 'expo.out', duration: 1.2 }, '<')
        .set(this.$bottomBrackets, { opacity: 1 }, '<10%')
        .to(this.$bottomText, { yPercent: 0, ease: 'expo.out', duration: 1, stagger: 0.06 }, '<0.14')
    }
  }

  onHomeScroll() {
    this.hasScrolled = true
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(this.$app, { clearProps: 'all' })
        gsap.set(this.$image, { clearProps: 'all' })
        G.isFirstLoaded = true
        G.emitter.emit('end-loader')
        G.smoothScroll?.start()
        gsap.set(this.$el, { autoAlpha: 0 })
      },
    })

    tl.to(this.$headerToggler, { yPercent: 0, ease: 'gl.fastInOut', duration: 1.2 }, 0.25)
      .to(this.$logo, { y: '-=' + (G.isMobile ? 0.06 * G.w.h : 0.12 * G.w.h), ease: 'gl.fastInOut', duration: 1.2 }, 0)
      .to(this.$overlay, { opacity: 0.9, ease: 'alpha', duration: 0.6 }, '<')
      .to(this.$app, { scale: 1, y: 0, ease: 'gl.fastInOut', duration: 1.2 }, '<')
      .to(this.$headerLogo, { yPercent: 0, ease: 'gl.fastInOut', duration: 1, stagger: 0.02 }, '<')
      .to(this.$headerLinks, { x: 0, ease: 'gl.fastInOut', duration: 1.2 }, '<')

    if (G.isMobile) {
      tl.to(this.$imageParallax, { scale: 1, ease: 'gl.fastInOut', duration: 1.2 }, '<')
      const lines = this.splittedContent?.instance.wrapLines
      tl.call(() => {
        if (lines) gsap.to(lines, { yPercent: 0, ease: 'expo.out', duration: 1.2, stagger: 0.08 })
      }, [], '<30%')
    } else {
      tl.to(this.$imageInner, { scale: 1, ease: 'gl.fastInOut', duration: 1.2 }, '<')
        .to(this.$image, { clipPath: 'inset(0px 0px 0px)', y: 0, ease: 'gl.fastInOut', duration: 1.2 }, '<')
        .to(this.$titleDark, { y: G.remToPixel(15), ease: 'gl.fastInOut', duration: 1.2 }, '<')
        .to(this.$titleLight, { y: G.remToPixel(15), ease: 'gl.fastInOut', duration: 1.2 }, '<')
        .to(this.$bottomDark, { y: G.remToPixel(16), ease: 'gl.fastInOut', duration: 1.2 }, '<')
        .to(this.$bottomLight, { y: 0, ease: 'gl.fastInOut', duration: 1.2 }, '<')
        .call(() => this.$header.classList.add('header-light'), [], '<28%')
    }
    return tl
  }

  load() {
    gsap
      .timeline({
        delay: 0.1,
        onComplete: () => {
          G.isFirstLoaded = true
          G.emitter.emit('end-loader')
          gsap.set(this.$el, { autoAlpha: 0 })
          setTimeout(() => G.smoothScroll?.start(), 300)
        },
      })
      .to(this.$panel, { autoAlpha: 0, ease: 'alpha', duration: 0.42 })
      .call(() => G.emitter.emit('start-transition'), [], 0)
      .call(() => G.emitter.emit('appear-loader'), [], 0.2)
  }

  resizeX() {
    this.splittedContent?.update()
    this.splittedTitle?.update()
  }

  screenChange() {
    if (!G.isFirstLoaded && this.isHome && !this.hasScrolled) {
      this.onHomeScroll()
      gsap.set(this.$imageInner, { clearProps: 'all' })
      if (!G.isMobile) this.$header.classList.remove('header-light')
    }
    if (G.isMobile) {
      if (this.$titleLight) gsap.set(this.$titleLight, { clearProps: 'all' })
    } else {
      if (this.splittedContent) {
        this.splittedContent.reset()
        this.splittedContent = null
      }
      if (this.splittedTitle) {
        this.splittedTitle.reset()
        this.splittedTitle = null
      }
    }
  }
}
