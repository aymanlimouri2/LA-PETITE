import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'
import { gsap, ScrollTrigger } from './gsap'
import { G } from './store'

interface Block {
  dom: HTMLElement
  title: string
  url: string
  offset: number
  sT: ST | null
  width?: number
  html?: { title: HTMLElement }
}

/*
 * Discover pill (the reference's contextual widget). Each [data-widget]
 * block registers at top 70% (offset by n × viewport height when set).
 */
export class Widget {
  currentIndex = 0
  blocks: Block[] = []
  $el!: HTMLAnchorElement
  $titleWrapper!: HTMLElement
  $title!: HTMLElement
  $cta!: HTMLElement
  $plus!: HTMLElement

  constructor(view: HTMLElement) {
    this.getElems(view)
    if (this.blocks[0]?.url) this.$el.href = this.blocks[0].url
  }

  getElems(view: HTMLElement) {
    this.$el = view.querySelector<HTMLAnchorElement>('.widget')!
    this.$titleWrapper = this.$el.querySelector('.widget-title-wrapper')!
    this.$title = this.$el.querySelector('.widget-title')!
    this.$cta = this.$el.querySelector('.widget-cta')!
    this.$plus = this.$el.querySelector('.widget-icon')!
    view.querySelectorAll<HTMLElement>('[data-widget]').forEach((dom) => {
      this.blocks.push({
        dom,
        title: dom.dataset.widgetTitle || '',
        url: dom.dataset.widgetUrl || '',
        offset: Number(dom.dataset.widgetOffset || 0),
        sT: null,
      })
    })
  }

  init() {
    if (this.blocks.length) this.initWidget()
    this.initAnimations()
  }

  destroy() {
    this.blocks.forEach((b) => b.sT?.kill())
  }

  initAnimations() {
    gsap.set(this.$el, { width: this.blocks[0]?.width })
    gsap.set(this.$el, { yPercent: 200, autoAlpha: 1 })
  }

  initWidget() {
    this.blocks.forEach((block, i) => {
      const title = document.createElement('div')
      title.innerHTML = block.title
      title.classList.add('widget-block-title')
      this.$title.appendChild(title)
      if (i !== 0) gsap.set(title, { yPercent: 100 })
      block.html = { title }
      block.width = title.getBoundingClientRect().width
      block.sT = ScrollTrigger.create({
        trigger: block.dom,
        start: block.offset ? `top+=${G.w.h * block.offset}px 70%` : 'top 70%',
        end: 'bottom 70%',
        onEnter: () => {
          if (i === 0) this.show()
          this.updateWidget(i)
        },
        onLeaveBack: () => {
          if (i === 0) this.hide()
        },
        onEnterBack: () => this.updateWidget(i),
      })
    })
  }

  updateWidget(index: number) {
    if (index === this.currentIndex) return
    gsap.killTweensOf(this.$title, 'width')
    const prev = this.blocks[this.currentIndex]
    const next = this.blocks[index]
    this.$el.href = next.url
    this.currentIndex = index
    gsap
      .timeline({ defaults: { ease: 'gl.fastInOut', duration: 0.9 } })
      .to(prev.html!.title, { yPercent: -100 })
      .fromTo(next.html!.title, { yPercent: 100 }, { yPercent: 0 }, '<')
      .to(this.$el, { scale: 0.95, duration: 0.6, ease: 'expo.out' }, '<10%')
      .to(this.$title, { width: next.width }, 0)
  }

  show() {
    gsap
      .timeline({ defaults: { ease: 'gl.fastInOut', duration: 1 } })
      .fromTo(this.$el, { scale: 0.8 }, { yPercent: 0, scale: 1 })
      .addLabel('expand', '<40%')
      .to(this.$el, { width: 'auto' }, 'expand')
      .fromTo(this.$plus, { rotate: -90 }, { rotate: 0 }, 'expand+=15%')
  }

  hide() {
    gsap
      .timeline({ defaults: { ease: 'gl.fastInOut', duration: 1 } })
      .to(this.$el, { width: this.blocks[0].width })
      .to(this.$el, { yPercent: 200, scale: 0.8 }, '<20%')
  }

  resize() {
    this.blocks.forEach((block, i) => {
      if (!block.html?.title) return
      block.width = block.html.title.getBoundingClientRect().width
      if (i === this.currentIndex) gsap.set(this.$title, { width: block.width })
    })
  }
}
