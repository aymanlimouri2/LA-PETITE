import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { Split } from '@/lib/motion/split'
import { G } from '@/lib/motion/store'
import { AnimationContext } from './context'

interface Item {
  title: HTMLElement
  content: Split
  index: number
}

/*
 * 03 Farm to table (the reference's Vision chapter): image takeover over
 * the first 100vh (scrub 0.4), then each value owns offset × viewport height.
 */
class Vision extends Piece {
  currentIndex = 0
  offset = 0.75
  context = new AnimationContext()
  items: Item[] = []
  isTitleAppeared = false
  $header!: HTMLElement
  $gridImages!: HTMLElement[]
  $wrapper!: HTMLElement
  $titlesWrapper!: HTMLElement
  $contentsWrapper!: HTMLElement
  $titles!: HTMLElement[]
  $contents!: HTMLElement[]
  $image!: HTMLElement
  $imageWrapper!: HTMLElement
  $imageScroll!: HTMLElement
  $imageParallax!: HTMLElement
  $number!: HTMLElement
  $numberText!: HTMLElement
  $suptitle!: HTMLElement
  $suptitleText!: HTMLElement
  $line!: HTMLElement
  numberText!: Split
  imageTrigger?: ST
  showTitleTL?: gsap.core.Timeline
  hideTitleTL?: gsap.core.Timeline

  mount() {
    this.currentIndex = 0
    this.offset = Number(this.el.dataset.offset)
    this.getElems()
    this.initAnimations()
  }

  unmount() {
    this.context.kill()
    this.imageTrigger?.kill()
  }

  getElems() {
    this.$header = document.querySelector('.header')!
    this.$gridImages = this.$All('.works-grid-image', this.view)
    this.$wrapper = this.$('.vision-wrapper')
    this.$titlesWrapper = this.$('.vision-titles')
    this.$contentsWrapper = this.$('.vision-contents')
    this.$titles = this.$All('.vision-title')
    this.$contents = this.$All('.vision-content')
    this.$image = this.$('.vision-image')
    this.$imageWrapper = this.$('.vision-image-wrapper')
    this.$imageScroll = this.$('.vision-image-scroll')
    this.$imageParallax = this.$('.vision-image-parallax')
    this.$number = this.$('.vision-number')
    this.$numberText = this.$('.vision-number-text')
    this.$suptitle = this.$('.vision-suptitle')
    this.$suptitleText = this.$('.vision-suptitle-text')
    this.$line = this.$('.vision-line')
    this.items = this.$titles.map((title, i) => ({
      title,
      content: new Split({ target: this.$contents[i], by: 'lines', plugin: 'wrapLines', willChange: true }),
      index: i,
    }))
  }

  initAnimations() {
    this.items.forEach((item) => {
      gsap.set(item.title, { yPercent: 100 })
      gsap.set(item.content.instance.wrapLines, { yPercent: 100 })
    })
    this.numberText = new Split({ target: this.$numberText, by: 'chars' })
    gsap.set(this.$line, { opacity: 0 })
    gsap.set(this.$suptitleText, { yPercent: 100 })
    gsap.set(this.numberText.instance.chars, { yPercent: 100 })
  }

  ready() {
    gsap.set(this.$number, {
      x: -this.$number.getBoundingClientRect().left + G.w.w / 2 - this.$number.offsetWidth - G.remToPixel(0.8),
    })
    gsap.set(this.$suptitle, { x: -this.$suptitle.getBoundingClientRect().left + G.w.w / 2 + G.remToPixel(0.8) })
    gsap.set(this.$line, { scaleX: 0 })
    this.initImageTrigger()
    this.initTriggers()
    this.initHeaderTrigger()
  }

  initTriggers() {
    this.items.forEach((_, i) => {
      this.context.add(
        ScrollTrigger.create({
          trigger: this.$wrapper,
          start: () => `top+=${G.w.h + G.w.h * this.offset * i} top`,
          end: () => `top+=${G.w.h + G.w.h * this.offset * (i + 1)} top`,
          onEnter: () => this.animate(i),
          onEnterBack: () => this.animate(i),
        }),
      )
    })
  }

  initImageTrigger() {
    const { left, right } = this.splitNodesByScreenCenter(this.$gridImages)
    const scale =
      G.w.w > G.w.h ? (G.w.w + 4) / this.$image.offsetWidth : (G.w.h + 4) / this.$image.offsetHeight
    const tl = gsap.timeline({ defaults: { ease: 'none' } })
    tl.to(
      this.$image,
      { scale, y: -(G.w.h - this.$imageWrapper.offsetHeight) / 2, transformOrigin: 'top' },
      0,
    )
      .fromTo(this.$imageScroll, { scale: 1.45 }, { scale: 1 }, 0)
      .fromTo(this.$gridImages, { opacity: 1 }, { opacity: 0.1, duration: G.isMobile ? 0.1 : 0.4 }, 0)
      .to([this.$number, this.$suptitle], { x: 0 }, 0)
      .to(this.$line, { scaleX: 1 }, 0)
      .to(this.$line, { opacity: 1, duration: 0.2 }, 0.2)
    if (!G.isMobile) {
      tl.fromTo(left, { x: 0 }, { x: -G.remToPixel(20), duration: 0.5 }, 0).fromTo(
        right,
        { x: 0 },
        { x: G.remToPixel(20), duration: 0.5 },
        0,
      )
    }
    this.imageTrigger?.kill()
    this.imageTrigger = ScrollTrigger.create({
      trigger: this.el,
      start: 'top top',
      end: () => `top+=${G.w.h}px top`,
      scrub: 0.4,
      onUpdate: (self) => {
        if (self.progress > 0.5 && self.direction > 0 && !this.isTitleAppeared) {
          this.isTitleAppeared = true
          this.showTitle()
        } else if (self.progress < 0.5 && self.direction < 0 && this.isTitleAppeared) {
          this.isTitleAppeared = false
          this.hideTitle()
        }
      },
      onLeave: () => this.show(),
      onEnterBack: () => this.hide(),
      animation: tl,
    })
    this.context.add(
      ScrollTrigger.create({
        trigger: this.el,
        start: () => `top+=${G.w.h}px top`,
        end: 'bottom bottom',
        scrub: true,
        animation: gsap.to(this.$imageScroll, { yPercent: -25, ease: 'none' }),
      }),
    )
    this.context.add(
      ScrollTrigger.create({
        trigger: this.el,
        start: 'bottom bottom',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to(this.$imageParallax, { yPercent: 10, ease: 'none' }),
      }),
    )
  }

  initHeaderTrigger() {
    const toggle = (on: boolean) => () => this.$header.classList.toggle('header-light', on)
    this.context.add(
      ScrollTrigger.create({
        trigger: this.el,
        start: () => `top+=${G.w.h - G.remToPixel(3)}px top`,
        end: `bottom-=${G.remToPixel(3)} top`,
        onEnter: toggle(true),
        onEnterBack: toggle(true),
        onLeave: toggle(false),
        onLeaveBack: toggle(false),
      }),
    )
  }

  animate(index: number) {
    if (index === this.currentIndex) return
    const prev = this.items[this.currentIndex]
    const next = this.items[index]
    this.currentIndex = index
    gsap.killTweensOf([this.$titlesWrapper, next.content.instance.wrapLines])
    gsap.killTweensOf(next.content.target, 'autoAlpha')
    const tl = gsap.timeline()
    this.items.forEach((item, i) => {
      tl.to(item.title, { opacity: i === index ? 1 : 0.32, ease: 'alpha', duration: 0.35 }, 0)
    })
    const offset = this.items
      .filter((_, i) => i < index)
      .reduce((sum, item) => sum + item.title.offsetWidth, 0)
    tl.to(this.$titlesWrapper, { x: -offset, ease: 'gl.fastInOut', duration: 1.2 }, 0)
      .to(prev.content.target, { autoAlpha: 0, ease: 'alpha', duration: 0.25 }, 0)
      .set(next.content.instance.wrapLines, { yPercent: 100 }, '<50%')
      .set(next.content.target, { autoAlpha: 1 }, '<')
      .fromTo(
        next.content.instance.wrapLines,
        { yPercent: 100 },
        { yPercent: 0, ease: 'expo.out', duration: 1.1, stagger: 0.075 },
        '<',
      )
  }

  showTitle() {
    this.hideTitleTL?.kill()
    this.showTitleTL = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.1 } })
    this.showTitleTL
      .to(this.$suptitleText, { yPercent: 0 })
      .to(this.numberText.instance.chars, { yPercent: 0, stagger: 0.065 }, '<')
  }

  hideTitle() {
    this.showTitleTL?.kill()
    this.hideTitleTL = gsap.timeline({ defaults: { ease: 'expo.out', duration: 0.6 } })
    this.hideTitleTL
      .to(this.$suptitleText, { yPercent: 100 })
      .to(this.numberText.instance.chars, { yPercent: 100 }, '<')
  }

  show() {
    const titles = this.items.map((item) => item.title)
    gsap.killTweensOf([this.$titlesWrapper, this.$contentsWrapper, titles, this.items[0].content.instance.wrapLines])
    gsap
      .timeline()
      .set(titles, { yPercent: 100 })
      .set([this.$titlesWrapper, this.$contentsWrapper], { autoAlpha: 1 })
      .to(titles, { yPercent: 0, ease: 'expo.out', duration: 1.2, stagger: 0.1 })
      .fromTo(
        this.items[0].content.instance.wrapLines,
        { yPercent: 100 },
        { yPercent: 0, ease: 'expo.out', duration: 1.1, stagger: 0.075 },
        '<20%',
      )
  }

  hide() {
    gsap.killTweensOf([this.$titlesWrapper, this.$contentsWrapper])
    gsap.timeline().to([this.$titlesWrapper, this.$contentsWrapper], { autoAlpha: 0, ease: 'power2.out', duration: 0.25 })
  }

  splitNodesByScreenCenter(nodes: HTMLElement[]) {
    const center = window.innerWidth / 2
    const left: HTMLElement[] = []
    const right: HTMLElement[] = []
    nodes.forEach((node) => {
      const r = node.getBoundingClientRect()
      if (r.left + r.width / 2 < center) left.push(node)
      else right.push(node)
    })
    return { left, right }
  }

  resize() {
    this.context.kill()
    this.initTriggers()
    this.initHeaderTrigger()
    this.initImageTrigger()
  }
}

definePiece('vision', Vision)
