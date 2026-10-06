import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { definePiece, emitPieces, Piece } from '@/lib/motion/piece'
import { G } from '@/lib/motion/store'
import { Split } from '@/lib/motion/split'

/*
 * Index page (reference work index): "All Spaces (02)" title, Filters
 * button that drops the tiles and rolls in the terms, grid / list views, and
 * the mobile filters pill. The reference re-fetches the filtered grid from its
 * server; here the same tiles are filtered in place, with the same timelines.
 */

const isInViewport = (el: HTMLElement) => ScrollTrigger.isInViewport(el)
const maxWidth = (els: HTMLElement[]) => Math.max(0, ...els.map((el) => el.getBoundingClientRect().width))

class FiltersPill {
  currentIndex = 0
  isAnimating = false
  isOpen = false
  width = 0
  onFilter: (id: string, index: number) => void
  terms: { el: HTMLElement; id: string; active: HTMLElement }[] = []
  $overlay: HTMLElement
  $el: HTMLElement
  $top: HTMLElement
  $wrapper: HTMLElement
  $termsActiveWrapper: HTMLElement
  $icon: HTMLElement
  handlers: (() => void)[] = []

  constructor(view: HTMLElement, onFilter: (id: string, index: number) => void) {
    this.onFilter = onFilter
    this.onClick = this.onClick.bind(this)
    this.close = this.close.bind(this)
    this.$overlay = view.querySelector('.widget-works-overlay')!
    this.$el = view.querySelector('.widget-works')!
    this.$top = this.$el.querySelector('.widget-filters-top')!
    this.$wrapper = this.$el.querySelector('.widget-filters-wrapper')!
    this.$termsActiveWrapper = this.$el.querySelector('.widget-filters-terms-active')!
    this.$icon = this.$el.querySelector('.widget-icon')!
    const $active = Array.from(this.$el.querySelectorAll<HTMLElement>('.widget-filters-term-active'))
    this.$el.querySelectorAll<HTMLElement>('.widget-filters-term').forEach((el, i) => {
      if (i > 0) gsap.set($active[i], { yPercent: 100 })
      this.terms.push({ el, id: el.dataset.id || '-1', active: $active[i] })
    })
    this.$top.addEventListener('click', this.onClick)
    this.$overlay.addEventListener('click', this.close)
    this.terms.forEach((t, i) => {
      const handler = () => this.onTermClick(i)
      this.handlers.push(handler)
      t.el.addEventListener('click', handler)
    })
    this.setBounds()
  }

  destroy() {
    this.$top.removeEventListener('click', this.onClick)
    this.$overlay.removeEventListener('click', this.close)
    this.terms.forEach((t, i) => t.el.removeEventListener('click', this.handlers[i]))
  }

  onTermClick(index: number) {
    this.currentIndex = index
    this.terms.forEach((t, i) => t.el.classList.toggle('a', i === index))
    this.onFilter(this.terms[index].id, index)
    this.close()
  }

  onClick() {
    if (this.isOpen) this.close()
    else this.open()
  }

  open() {
    if (this.isAnimating) return
    this.isOpen = true
    this.$overlay.classList.add('pointer-events-auto')
    this.$icon.classList.add('a')
    const term = this.terms[this.currentIndex]
    gsap.killTweensOf(term.active)
    gsap
      .timeline()
      .to(this.$wrapper, { width: 1.1 * this.width, height: 'auto', ease: 'gl.fastInOut', duration: 0.9 }, 0)
      .to(term.active, { yPercent: -100, ease: 'expo.out', duration: 0.5 }, '<')
  }

  close() {
    if (!this.isOpen || this.isAnimating) return
    this.isOpen = false
    this.isAnimating = true
    this.$overlay.classList.remove('pointer-events-auto')
    this.$icon.classList.remove('a')
    const term = this.terms[this.currentIndex]
    gsap.killTweensOf(term.active)
    return gsap
      .timeline()
      .to(this.$wrapper, { width: 'auto', height: 0, ease: 'expo.out', duration: 0.5 })
      .fromTo(term.active, { yPercent: 110 }, { yPercent: 0, ease: 'expo.out', duration: 0.8 }, '<35%')
      .call(() => (this.isAnimating = false), [], '<90%')
  }

  setBounds() {
    gsap.set(this.$termsActiveWrapper, { width: maxWidth(this.terms.map((t) => t.active)) })
    this.width = this.$el.getBoundingClientRect().width
  }

  reset() {
    if (this.currentIndex <= 0) return
    gsap.set(this.terms[this.currentIndex].active, { yPercent: 100 })
    gsap.set(this.terms[0].active, { yPercent: 0 })
    this.currentIndex = 0
    this.terms.forEach((t, i) => t.el.classList.toggle('a', i === 0))
  }

  resizeX() {
    this.setBounds()
  }
}

class PageWorks extends Piece {
  currentIndex = 0
  oldIndex = 0
  currentHoverIndex = -1
  isFiltered = false
  isOpen = false
  isAnimating = false
  currentView: 'grid' | 'list' = 'grid'
  iconWidth = 0
  terms: { el: HTMLElement; wrapper: HTMLElement; highlight: HTMLElement; name: string; id: string }[] = []
  currentCards: HTMLElement[] = []
  hasFilters = false
  widget: FiltersPill | null = null
  splittedNumber!: Split
  onTermLeaveST = 0
  listeners: [EventTarget, string, EventListener][] = []

  $button!: HTMLElement
  $buttonIcon!: HTMLElement
  $buttonPlus!: HTMLElement
  $buttonOpen!: HTMLElement
  $buttonClose!: HTMLElement
  $termsWrapper!: HTMLElement
  $terms: HTMLElement[] = []
  $termsHighlight: HTMLElement[] = []
  $placeholder!: HTMLElement
  $termName!: HTMLElement
  $termNumber!: HTMLElement
  $bracketLeft!: HTMLElement
  $bracketRight!: HTMLElement
  $wrapper!: HTMLElement
  $grid!: HTMLElement
  $list!: HTMLElement
  $cards: HTMLElement[] = []
  $listItems: HTMLElement[] = []
  $buttonGrid!: HTMLElement
  $buttonList!: HTMLElement

  on(type: string, target: EventTarget | null, fn: EventListener) {
    if (!target) return
    target.addEventListener(type, fn)
    this.listeners.push([target, type, fn])
  }

  mount() {
    this.getElems()
    this.events()
    this.initAnimations()
    if (this.hasFilters && this.view.querySelector('.widget-works .widget-filters-top')) {
      this.widget = new FiltersPill(this.view, (id, i) => this.onWidgetFilter(id, i))
    }
  }

  unmount() {
    this.listeners.forEach(([t, type, fn]) => t.removeEventListener(type, fn))
    this.listeners = []
    this.widget?.destroy()
    clearTimeout(this.onTermLeaveST)
  }

  getElems() {
    this.$button = this.$('.works-filter-button')
    this.hasFilters = Boolean(this.$button)
    this.$buttonIcon = this.$('.works-filter-icon')
    this.$buttonPlus = this.$('.works-filter-plus')
    this.$buttonOpen = this.$('.works-filter-open')
    this.$buttonClose = this.$('.works-filter-close')
    this.$termsWrapper = this.$('.works-terms-wrapper')
    const $termWrapper = this.$All('.works-term-w')
    this.$terms = this.$All('.works-term')
    this.$termsHighlight = this.$All('.works-term-highlight')
    const $termsName = this.$All('.works-term-name')
    this.$placeholder = this.$('.works-term-placeholder')
    this.$termName = this.$('.works-term-title-name')
    this.$termNumber = this.$('.works-term-title-number')
    this.$bracketLeft = this.$('.works-term-title-bracket-left')
    this.$bracketRight = this.$('.works-term-title-bracket-right')
    this.$wrapper = this.$('.works-wrapper')
    this.$grid = this.$('.works-grid-wrapper')
    this.$list = this.$('.works-list')
    this.$cards = this.$All('.card-work')
    this.$listItems = this.$All('.list-works-item')
    this.$buttonGrid = this.$('.widget-works-grid', this.view)
    this.$buttonList = this.$('.widget-works-list', this.view)
    this.terms = this.$terms.map((el, i) => ({
      el,
      wrapper: $termWrapper[i],
      highlight: this.$termsHighlight[i],
      name: $termsName[i]?.dataset.name || '',
      id: el.dataset.id || '-1',
    }))
  }

  events() {
    this.on('click', this.$button, () => this.toggleFilters())
    this.on('mouseenter', this.$button, () => this.onButtonEnter())
    this.on('mouseleave', this.$button, () => this.onButtonLeave())
    this.on('click', this.$buttonGrid, () => this.onGridClick())
    this.on('click', this.$buttonList, () => this.onListClick())
    this.$All('.works-term-inner').forEach((el, i) => {
      this.on('click', el, () => this.onTermClick(i))
      this.on('mouseenter', el, () => this.onTermEnter(i))
      this.on('mouseleave', el, () => this.onTermLeave())
    })
  }

  initAnimations() {
    gsap.set(this.$terms, { yPercent: 100 })
    if (this.hasFilters) {
      this.iconWidth = this.$buttonIcon.getBoundingClientRect().width
      gsap.set(this.$button, { x: this.iconWidth })
      gsap.set(this.$buttonPlus, { rotate: 55 })
      gsap.set(this.$buttonClose, { yPercent: 100 })
      gsap.set(this.$buttonOpen, { yPercent: 100 })
    }
    gsap.set([this.$bracketLeft, this.$bracketRight], { opacity: 0 })
    gsap.set(this.$bracketLeft, { x: G.remToPixel(1.5) })
    gsap.set(this.$bracketRight, { x: -G.remToPixel(1.5) })
    this.$termsHighlight.forEach((el, i) => i > 0 && gsap.set(el, { yPercent: 100 }))
    this.splittedNumber = new Split({ target: this.$termNumber, by: 'chars', willChange: true })
    gsap.set(this.splittedNumber.instance.chars, { yPercent: 100 })
    gsap.set(this.$termName, { yPercent: 100 })
    if (this.$cards[0]) {
      gsap.set(this.$cards[0], {
        clipPath: G.isMobile ? 'inset(90% 35% 0%)' : `inset(${G.remToPixel(25)}px 0% 0 50%)`,
      })
    }
    if (!G.isMobile && this.$cards[1]) gsap.set(this.$cards[1], { clipPath: `inset(${G.remToPixel(25)}px 50% 0 0%)` })
  }

  onTransitionStart() {
    const tl = gsap.timeline({
      delay: G.isFirstLoaded && !G.isMobile ? 0.2 : 0,
      defaults: { ease: 'gl.fastInOut', duration: 1.35 },
    })
    if (G.isMobile) tl.to(this.$cards[0] || [], { clipPath: 'inset(0% 0% 0%)' })
    else tl.to(this.$cards.slice(0, 2), { clipPath: 'inset(0px 0% 0% 0%)' })
  }

  appear() {
    const tl = gsap
      .timeline({ defaults: { ease: 'expo.out', duration: 1.2 } })
      .to(this.$termName, { yPercent: 0 })
      .addLabel('reveal-number', '<20%')
      .to(this.$bracketLeft, { x: 0 }, 'reveal-number')
      .to(this.splittedNumber.instance.chars, { yPercent: 0, ease: 'expo.out', duration: 1, stagger: 0.04 }, '<20%')
      .to(this.$bracketRight, { x: 0 }, 'reveal-number')
      .set([this.$bracketLeft, this.$bracketRight], { opacity: 1 }, '<15%')
    if (this.hasFilters) tl.to(this.$buttonOpen, { yPercent: 0 }, 0.1)
  }

  switchView(view: 'grid' | 'list') {
    this.isAnimating = true
    G.smoothScroll?.stop()
    this.$buttonGrid.classList.toggle('a', view === 'grid')
    this.$buttonList.classList.toggle('a', view === 'list')
    const from = view === 'grid' ? this.$list : this.$grid
    const to = view === 'grid' ? this.$grid : this.$list
    const tl = gsap.timeline({ paused: true })
    tl.to(from, { autoAlpha: 0, ease: 'power2.out', duration: 0.3 })
      .set(from, { display: 'none' })
      .set(to, { display: 'block' })
      .call(() => {
        G.smoothScroll?.resize()
        emitPieces('refresh')
        G.smoothScroll?.start()
        G.smoothScroll?.scrollTo(0, { force: true })
      })
      .to(to, { autoAlpha: 1, ease: 'alpha', duration: 0.35 }, '<')
      .call(() => (this.isAnimating = false), [], '<70%')
    if (this.isOpen) this.close(true).then(() => tl.play())
    else tl.play()
    this.currentView = view
  }

  onGridClick() {
    this.switchView('grid')
  }

  onListClick() {
    this.switchView('list')
  }

  onButtonEnter() {
    if (this.isOpen) return
    gsap.killTweensOf(this.$buttonPlus)
    gsap
      .timeline({ defaults: { ease: 'expo.out', duration: 0.8 } })
      .to(this.$button, { x: 0 })
      .to(this.$buttonPlus, { rotate: 0 }, '<')
  }

  onButtonLeave() {
    if (this.isOpen || !this.hasFilters) return
    gsap.killTweensOf(this.$buttonPlus)
    gsap
      .timeline({ defaults: { ease: 'expo.out', duration: 0.8 } })
      .to(this.$button, { x: this.iconWidth })
      .to(this.$buttonPlus, { rotate: 55 }, 0)
  }

  toggleFilters() {
    if (this.isOpen) this.close()
    else this.open()
  }

  dropY() {
    return G.w.h - this.$wrapper.getBoundingClientRect().top + 10
  }

  onTermClick(index: number) {
    if (index === this.currentIndex || this.isAnimating) return
    this.isOpen = false
    this.isFiltered = true
    this.isAnimating = true
    this.oldIndex = this.currentIndex
    this.currentIndex = index
    const term = this.terms[this.currentIndex]
    const old = this.terms[this.oldIndex]
    this.filter(term.id, false).then(() => {
      this.currentCards = this.visibleCards().filter(isInViewport)
      const tl = gsap.timeline({ defaults: { ease: 'gl.fastInOut', duration: 1.2 } })
      tl.set(
        this.$listItems,
        {
          display: (_: number, el: HTMLElement) =>
            term.id === '-1' || (el.dataset.terms || '').split(',').includes(term.id) ? 'block' : 'none',
          stagger: { each: 0.03, from: 'random' },
        },
        0,
      )
      if (this.currentView === 'grid') {
        tl.fromTo(this.currentCards, { y: this.dropY() }, { y: 0, stagger: 0.03 }, 0.2).set(
          this.$wrapper,
          { autoAlpha: 1 },
          '<',
        )
      }
      tl.to(this.$buttonClose, { yPercent: -100 }, 0)
        .fromTo(this.$buttonOpen, { yPercent: 100 }, { yPercent: 0 }, '<')
        .to(this.$buttonPlus, { rotate: 0 }, '<')
        .to(this.$button, { x: this.iconWidth }, '<35%')
        .to(this.$buttonPlus, { rotate: 55 }, '<')
        .to(this.$list, { y: 0 }, 0.2)
        .to(this.$terms, { yPercent: -100, stagger: 0.015 }, 0)
        .fromTo(term.highlight, { yPercent: 100 }, { yPercent: 0 }, '<22%')
        .to(old.highlight, { yPercent: -100 }, '<')
        .call(
          () => {
            this.$termsWrapper.classList.add('pointer-events-none')
            this.isAnimating = false
          },
          [],
          0.75,
        )
      G.smoothScroll?.start()
    })
  }

  onTermEnter(index: number) {
    if (this.currentView === 'grid' || this.currentIndex !== 0) return
    clearTimeout(this.onTermLeaveST)
    this.currentHoverIndex = index
    const id = this.terms[index].id
    this.$listItems.forEach((item) =>
      item.classList.toggle('disabled', !(item.dataset.terms || '').split(',').includes(id)),
    )
  }

  onTermLeave() {
    if (this.currentView === 'grid') return
    this.currentHoverIndex = -1
    this.onTermLeaveST = window.setTimeout(() => {
      this.$listItems.forEach((item) => item.classList.remove('disabled'))
    }, 200)
  }

  open() {
    if (this.isAnimating) return
    this.isAnimating = true
    this.isOpen = true
    this.$termsWrapper.classList.remove('pointer-events-none')
    G.smoothScroll?.stop()
    this.currentCards = this.visibleCards().filter(isInViewport)
    this.$placeholder.innerText = this.terms[this.currentIndex].name
    this.terms.forEach((t, i) => {
      if (i === this.currentIndex) gsap.set(t.wrapper, { display: 'none' })
      else gsap.set(t.wrapper, { clearProps: 'all' })
    })
    const tl = gsap.timeline({ defaults: { ease: 'gl.fastInOut', duration: 1.2 } })
    if (this.currentView === 'grid') tl.to(this.currentCards, { y: this.dropY(), stagger: -0.03 })
    else tl.to(this.$list, { y: this.$termsWrapper.offsetHeight - this.$termsHighlight[0].offsetHeight })
    tl.fromTo(this.$terms, { yPercent: 100 }, { yPercent: 0, stagger: 0.06 }, '<')
      .to(this.$buttonPlus, { rotate: -45 }, '<')
      .to(this.$buttonOpen, { yPercent: -100 }, '<')
      .fromTo(this.$buttonClose, { yPercent: 100 }, { yPercent: 0 }, '<')
      .call(() => (this.isAnimating = false), [], '<70%')
  }

  close(force = false, fromScroll = false) {
    return new Promise<void>((resolve) => {
      if (this.isAnimating && !force) return
      this.isAnimating = true
      this.isOpen = false
      this.isFiltered = false
      if (force) this.onButtonLeave()
      G.smoothScroll?.start()
      const tl = gsap.timeline({ defaults: { ease: 'gl.fastInOut', duration: 1.2 } })
      tl.call(
        () => {
          this.$termsWrapper.classList.add('pointer-events-none')
          this.isAnimating = false
        },
        [],
        0.9,
      )
        .to(this.$buttonClose, { yPercent: -100 }, 0)
        .fromTo(this.$buttonOpen, { yPercent: 100 }, { yPercent: 0 }, '<')
        .to(this.$buttonPlus, { rotate: 55 }, '<')
      if (fromScroll) tl.to(this.$button, { x: this.iconWidth }, '<')
      if (this.currentView === 'grid') {
        if (this.currentCards.length) tl.to(this.currentCards, { y: 0, duration: 1.2, stagger: 0.03 }, 0.1)
      } else tl.to(this.$list, { y: 0 }, 0.1)
      tl.to(this.$terms, { yPercent: -100, stagger: 0.03, duration: 0.8 }, '<').call(() => resolve(), [], '<50%')
    })
  }

  onWidgetFilter(id: string, index: number) {
    this.oldIndex = this.currentIndex
    this.currentIndex = index
    G.smoothScroll?.scrollTo(0)
    this.filter(id, this.currentView === 'grid').then(() => {
      this.filterList()
      if (this.currentView === 'grid') this.filterGrid()
    })
  }

  visibleCards() {
    return this.$cards.filter((c) => c.parentElement!.style.display !== 'none')
  }

  // In-place equivalent of the reference's fetch + updateContent.
  updateContent(id: string) {
    return new Promise<void>((resolve) => {
      if (this.currentView === 'grid') gsap.set(this.$wrapper, { autoAlpha: 0 })
      requestAnimationFrame(() => {
        this.$cards.forEach((card) => {
          const match = id === '-1' || (card.dataset.terms || '').split(',').includes(id)
          card.parentElement!.style.display = match ? '' : 'none'
          // Fresh tiles, as the reference's re-rendered grid: no clip or drop offset.
          gsap.set(card, { clearProps: 'clipPath', y: 0 })
        })
        G.smoothScroll?.resize()
        emitPieces('refresh')
        resolve()
      })
    })
  }

  filter(id: string, fade = true) {
    const pending: Promise<unknown>[] = []
    if (fade) {
      pending.push(new Promise<void>((r) => gsap.to(this.$wrapper, { autoAlpha: 0, duration: 0.3, ease: 'power2.out', onComplete: r })))
    }
    return Promise.all(pending).then(() => this.updateContent(id))
  }

  filterGrid() {
    const term = this.terms[this.currentIndex]
    const old = this.terms[this.oldIndex]
    this.currentCards = this.visibleCards().filter(isInViewport)
    gsap
      .timeline({ defaults: { ease: 'gl.fastInOut', duration: 1.2 } })
      .set(this.$wrapper, { autoAlpha: 1 }, 0)
      .fromTo(this.currentCards, { y: this.dropY() }, { y: 0, stagger: 0.03 }, 0.2)
      .to(old.highlight, { yPercent: -100 }, '<')
      .fromTo(term.highlight, { yPercent: 110 }, { yPercent: 0 }, '<')
  }

  filterList() {
    const id = this.terms[this.currentIndex]?.id ?? '-1'
    gsap.timeline({ defaults: { ease: 'gl.fastInOut', duration: 1.2 } }).set(this.$listItems, {
      display: (_: number, el: HTMLElement) =>
        id === '-1' || (el.dataset.terms || '').split(',').includes(id) ? 'block' : 'none',
      stagger: { each: 0.03, from: 'random' },
    })
  }

  scroll() {
    if (this.isOpen && !this.isFiltered) this.close(false, true)
  }

  resizeX() {
    if (!this.hasFilters) return
    this.iconWidth = this.$buttonIcon.getBoundingClientRect().width
    this.widget?.resizeX()
    if (!this.isOpen) gsap.set(this.$button, { x: this.iconWidth })
  }

  screenChange() {
    if (this.isOpen || this.currentIndex > 0) this.close()
    if (!G.isMobile) return
    this.widget?.reset()
    this.onButtonLeave()
    if (this.currentView === 'list') {
      this.currentView = 'grid'
      gsap.set(this.$list, { display: 'none', autoAlpha: 0 })
      gsap.set(this.$grid, { display: 'block', autoAlpha: 1 })
      this.$buttonList.classList.remove('a')
      this.$buttonGrid.classList.add('a')
      G.smoothScroll?.resize()
      emitPieces('refresh')
    }
  }
}

definePiece('page-works', PageWorks)
