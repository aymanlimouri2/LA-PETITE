import { gsap } from './gsap'
import { G } from './store'

/*
 * Header: current-page emphasis, live UAE clock, mobile menu.
 * Menu timings are locked (open 1.1s gl.fastInOut, close 0.7s).
 */
export class Header {
  isOpen = false
  activeIndex = -1
  clockTimeout = 0
  clockInterval = 0

  $el!: HTMLElement
  $items!: HTMLAnchorElement[]
  $itemsWrapper!: HTMLElement
  $toggler!: HTMLElement | null
  $togglerClose!: HTMLElement | null
  $links!: HTMLAnchorElement[]
  $menu!: HTMLElement
  $menuInner!: HTMLElement
  $menuClose!: HTMLElement
  $menuItems!: HTMLElement[]
  $menuSocials!: HTMLElement[]
  $overlay!: HTMLElement
  $hour!: HTMLElement
  $minute!: HTMLElement
  $ampm!: HTMLElement

  constructor() {
    this.toggle = this.toggle.bind(this)
    this.onLinkClick = this.onLinkClick.bind(this)
    this.getElems()
    this.events()
    this.initAnimations()
    this.onPageChange(window.location)
    this.startClock()
  }

  getElems() {
    this.$el = document.body.querySelector('header')!
    this.$items = Array.from(this.$el.querySelectorAll('.header-link'))
    this.$toggler = this.$el.querySelector('.header-toggler')
    this.$togglerClose = this.$el.querySelector('.header-toggler-close')
    this.$itemsWrapper = this.$el.querySelector('.header-links')!
    this.$links = Array.from(this.$el.querySelectorAll('a'))
    this.$menu = this.$el.querySelector('.header-menu')!
    this.$menuInner = this.$el.querySelector('.header-menu-inner')!
    this.$menuClose = this.$el.querySelector('.header-toggler-close')!
    this.$menuItems = Array.from(this.$el.querySelectorAll('.header-link-mobile'))
    this.$menuSocials = Array.from(this.$el.querySelectorAll('.header-social-link'))
    this.$overlay = this.$el.querySelector('.header-overlay')!
    this.$hour = this.$el.querySelector('#hour')!
    this.$minute = this.$el.querySelector('#minute')!
    this.$ampm = this.$el.querySelector('#ampm')!
  }

  events() {
    this.$toggler?.addEventListener('click', this.toggle)
    this.$togglerClose?.addEventListener('click', this.toggle)
    this.$links.forEach((link) => link.addEventListener('click', this.onLinkClick, true))
  }

  destroy() {
    this.$toggler?.removeEventListener('click', this.toggle)
    this.$togglerClose?.removeEventListener('click', this.toggle)
    this.$links.forEach((link) => link.removeEventListener('click', this.onLinkClick, true))
    clearTimeout(this.clockTimeout)
    clearInterval(this.clockInterval)
  }

  initAnimations() {
    gsap.set(this.$menu, { yPercent: -100 })
    gsap.set(this.$menuInner, { yPercent: 100 })
    gsap.set([this.$menuItems, this.$menuSocials], { yPercent: 100 })
    gsap.set(this.$menuClose, { yPercent: 100 })
  }

  // Links clicked before the first scroll play the homepage entry first.
  onLinkClick(e: MouseEvent) {
    if (G.isFirstLoaded || !G.loader) return
    const link = e.currentTarget as HTMLAnchorElement
    if (link.target) return
    e.preventDefault()
    e.stopPropagation()
    G.loader.onHomeScroll().then(() => G.navigate?.(link.href))
  }

  onPageChange(location: Location) {
    if (this.activeIndex > -1) this.$items[this.activeIndex].classList.remove('a')
    this.activeIndex = -1
    for (let i = 0; i < this.$items.length; i++) {
      if (this.$items[i].href === location.href) this.activeIndex = i
    }
    if (this.activeIndex > -1) {
      this.$itemsWrapper.classList.add('a')
      this.$items[this.activeIndex].classList.add('a')
    } else {
      this.$itemsWrapper.classList.remove('a')
    }
    if (this.isOpen) this.close()
  }

  toggle() {
    if (this.isOpen) this.close()
    else this.open()
  }

  open() {
    return new Promise<void>((resolve) => {
      this.isOpen = true
      G.smoothScroll?.stop()
      gsap.killTweensOf([this.$menuItems, this.$menuSocials, this.$overlay, this.$menu, this.$menuInner])
      gsap
        .timeline({ defaults: { ease: 'gl.fastInOut', duration: 1.1 } })
        .to(this.$overlay, { opacity: 0.8, ease: 'alpha', duration: 0.6 }, 0)
        .fromTo(this.$menuClose, { yPercent: 100 }, { yPercent: 0, ease: 'expo.out' }, 0.2)
        .to([this.$menu, this.$menuInner], { yPercent: 0 }, 0)
        .to(this.$menuItems, { yPercent: 0, stagger: 0.1, ease: 'expo.out' }, '<10%')
        .to(this.$menuSocials, { yPercent: 0, stagger: 0.1, ease: 'expo.out' }, '<30%')
      resolve()
    })
  }

  close() {
    return new Promise<void>((resolve) => {
      this.isOpen = false
      G.smoothScroll?.start()
      gsap.killTweensOf([this.$menuItems, this.$menuSocials, this.$overlay, this.$menu, this.$menuInner])
      gsap
        .timeline({ defaults: { ease: 'gl.fastInOut', duration: 0.7 } })
        .to(this.$overlay, { opacity: 0, ease: 'alpha', duration: 0.35 }, 0)
        .to(this.$menu, { yPercent: -100 }, 0)
        .to(this.$menuInner, { yPercent: 100 }, '<')
        .to(this.$menuItems, { yPercent: 100, stagger: -0.02, ease: 'expo.out' }, '<')
        .to(this.$menuSocials, { yPercent: 100, stagger: -0.02, ease: 'expo.out' }, '<')
      resolve()
    })
  }

  startClock() {
    this.updateTime()
    const now = new Date()
    const delay = 1000 * (60 - now.getSeconds()) - now.getMilliseconds()
    this.clockTimeout = window.setTimeout(() => {
      this.updateTime()
      this.clockInterval = window.setInterval(() => this.updateTime(), 60000)
    }, delay)
  }

  updateTime() {
    const parts = new Intl.DateTimeFormat('en-AU', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Dubai',
    }).formatToParts(new Date())
    const hour = parts.find((p) => p.type === 'hour')?.value ?? ''
    const minute = parts.find((p) => p.type === 'minute')?.value ?? ''
    const period = parts.find((p) => p.type === 'dayPeriod')?.value ?? ''
    this.$hour.textContent = hour.padStart(2, '0')
    this.$minute.textContent = minute.padStart(2, '0')
    this.$ampm.textContent = period
  }
}
