import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { G } from '@/lib/motion/store'

/* Footer lift: scrubbed from bottom bottom over the band's height (mobile scrub 0.6). */
class Footer extends Piece {
  $app!: HTMLElement
  $frameLeft!: HTMLElement
  $frameRight!: HTMLElement
  $header!: HTMLElement
  $parent!: HTMLElement
  $footerBottom!: HTMLElement
  $footerOverlay!: HTMLElement
  $footerInner!: HTMLElement
  $scrollButtons: HTMLElement[] = []
  scrollTrigger?: ST
  headerTrigger?: ST

  mount() {
    this.onScrollClick = this.onScrollClick.bind(this)
    this.$app = document.querySelector('#wrapper')!
    this.$frameLeft = document.querySelector('.frame-left')!
    this.$frameRight = document.querySelector('.frame-right')!
    this.$header = document.querySelector('.header')!
    this.$parent = this.el.parentElement!
    this.$footerBottom = this.$('.footer-bottom', this.$parent)
    this.$footerOverlay = this.$('.footer-bottom-overlay', this.$parent)
    this.$footerInner = this.$('.footer-bottom-inner', this.$parent)
    this.$scrollButtons = this.$All('.footer-scroll', this.$parent)
    this.$scrollButtons.forEach((b) => b.addEventListener('click', this.onScrollClick))
    this.initAnimations()
  }

  unmount() {
    this.scrollTrigger?.kill()
    this.headerTrigger?.kill()
    this.$scrollButtons.forEach((b) => b.removeEventListener('click', this.onScrollClick))
    gsap.killTweensOf(this.$header, 'autoAlpha')
    gsap.set(this.$header, { autoAlpha: 1 })
  }

  initAnimations() {
    gsap.set(this.$footerInner, { yPercent: 40 })
    gsap.set(this.$footerOverlay, { opacity: 0.85 })
  }

  ready() {
    this.initAnimations()
    this.initTrigger()
    this.initHeaderTrigger()
  }

  initTrigger() {
    G.footerHeight = this.$footerBottom.offsetHeight
    this.scrollTrigger?.kill()
    const tl = gsap.timeline({ defaults: { ease: 'none' } })
    tl.to(this.$frameLeft, { scaleX: 1 })
      .to(this.$frameRight, { scaleX: 1 }, '<')
      .to(this.$app, { scale: 1 - G.remToPixel(3) / G.w.w, transformOrigin: 'bottom' }, '<')
      .to(this.$footerBottom, { scale: 1 + G.remToPixel(3) / G.w.w }, '<')
      .to(this.$footerOverlay, { opacity: 0 }, 0)
      .to(this.$footerInner, { yPercent: 0 }, 0)
      .to(this.$header, { y: G.isMobile ? 2 * -G.remToPixel(1.6) - G.remToPixel(3.8) : -G.remToPixel(2) }, 0)
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.el,
      start: 'bottom bottom',
      end: () => `bottom bottom-=${this.$footerBottom.offsetHeight}px`,
      scrub: G.isMobile ? 0.6 : true,
      onEnter: () => {
        G.isFooterVisible = true
      },
      onLeaveBack: () => {
        gsap.set(this.$app, { clearProps: 'all' })
        gsap.set(this.$header, { clearProps: 'y' })
        G.isFooterVisible = false
      },
      animation: tl,
    })
    gsap.set(this.$app, { clearProps: 'all' })
  }

  initHeaderTrigger() {
    this.headerTrigger?.kill()
    if (!G.isMobile) return
    this.headerTrigger = ScrollTrigger.create({
      trigger: this.el,
      start: 'bottom bottom',
      onEnter: () => {
        gsap.killTweensOf(this.$header, 'autoAlpha')
        gsap.to(this.$header, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' })
      },
      onLeaveBack: () => {
        gsap.killTweensOf(this.$header, 'autoAlpha')
        gsap.to(this.$header, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' })
      },
    })
  }

  onScrollClick() {
    G.smoothScroll?.scrollTo(0, { force: true })
  }

  resize() {
    this.initTrigger()
    this.initHeaderTrigger()
  }

  refresh() {
    this.scrollTrigger?.refresh()
  }
}

definePiece('footer', Footer)
