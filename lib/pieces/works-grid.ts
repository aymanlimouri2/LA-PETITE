import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { G } from '@/lib/motion/store'
import { Mousemove } from './mousemove'

interface Item {
  el: HTMLElement
  size: string
  image: HTMLElement
  sT?: ST
  enterST?: ST
}

/* Spaces cloud: fades, two parallax depths, cursor drift, heading recede. */
class WorksGrid extends Piece {
  mouse = { target: { x: 0, y: 0 }, current: { x: 0, y: 0 } }
  mm!: Mousemove
  isInView = false
  items: Item[] = []
  $button!: HTMLElement
  $vision!: HTMLElement
  $largeImages!: HTMLElement[]
  $mediumImages!: HTMLElement[]
  $smallImages!: HTMLElement[]
  buttonTrigger?: ST
  inViewTrigger?: ST
  leaveTrigger?: ST

  mount() {
    this.move = this.move.bind(this)
    this.$button = this.$('.works-grid-button')
    const els = this.$All('.works-grid-item')
    const images = this.$All('.works-grid-image')
    this.$largeImages = this.$All('.works-grid-item[data-size="large"] .image')
    this.$mediumImages = this.$All('.works-grid-item[data-size="medium"] .image')
    this.$smallImages = this.$All('.works-grid-item[data-size="small"] .image')
    this.$vision = this.view.querySelector<HTMLElement>('[data-piece="vision"]')!
    this.items = els.map((el, i) => ({ el, size: el.dataset.size || '', image: images[i] }))
    this.mm = new Mousemove({ cb: this.move })
  }

  unmount() {
    this.mm.off()
    this.buttonTrigger?.kill()
    this.inViewTrigger?.kill()
    this.leaveTrigger?.kill()
    this.items.forEach((item) => {
      item.sT?.kill()
      item.enterST?.kill()
    })
  }

  ready() {
    this.mm.on()
    this.initTriggers()
    this.initEnterTrigger()
    this.initLeaveTrigger()
    this.initButtonTrigger()
  }

  initLeaveTrigger() {
    this.leaveTrigger?.kill()
    this.leaveTrigger = ScrollTrigger.create({
      trigger: this.$vision,
      start: () => `top-=${0.35 * G.w.h}px top`,
      end: () => `top-=${0.2 * G.w.h}px top`,
      scrub: 0.4,
      animation: gsap.fromTo(this.$button, { autoAlpha: 1 }, { autoAlpha: 0 }),
    })
  }

  initButtonTrigger() {
    this.buttonTrigger?.kill()
    let scale = 0.6
    if (G.w.w <= 1024 && G.w.w >= 768) scale = 0.66
    else if (G.w.w < 768) scale = 0.5
    const tl = gsap.timeline()
    tl.to(this.$button, { scale })
    this.buttonTrigger = ScrollTrigger.create({
      trigger: this.el,
      start: () => `top-=${0.35 * G.w.h}px top`,
      end: () => `top+=${0.1 * G.w.h}px top`,
      scrub: 0.4,
      animation: tl,
    })
  }

  initEnterTrigger() {
    this.items.forEach((item, i) => {
      if (i >= 5) return
      const st = ScrollTrigger.create({
        trigger: item.el,
        start: () => `top-=${gsap.utils.random(10, 50)}% bottom`,
        end: () => `top+=${gsap.utils.random(0, 5)}% top`,
        scrub: 0.4,
        animation: gsap.fromTo(item.image, { opacity: 0 }, { opacity: 1, ease: 'none' }),
      })
      setTimeout(() => gsap.set(item.image, { opacity: 0 }), 100)
      item.enterST = st
    })
  }

  initTriggers() {
    this.inViewTrigger?.kill()
    this.inViewTrigger = ScrollTrigger.create({
      trigger: this.el,
      onEnter: () => (this.isInView = true),
      onEnterBack: () => (this.isInView = true),
      onLeave: () => (this.isInView = false),
      onLeaveBack: () => (this.isInView = false),
    })
    this.items.forEach((item) => {
      item.sT?.kill()
      gsap.set(item.el, { clearProps: 'all' })
    })
    const depth = (size: string, amount: number) => {
      this.items
        .filter((item) => item.size === size)
        .forEach((item) => {
          item.sT = ScrollTrigger.create({
            trigger: item.el,
            start: () => `top-=${G.w.h * amount}px bottom`,
            end: () => `bottom+=${G.w.h * amount}px top`,
            scrub: true,
            animation: gsap.fromTo(item.image, { y: -G.w.h * amount }, { y: G.w.h * amount, ease: 'none' }),
          })
        })
    }
    depth('small', 0.25)
    depth('medium', 0.15)
  }

  resizeX() {
    this.initTriggers()
    this.initEnterTrigger()
    this.initLeaveTrigger()
    this.initButtonTrigger()
  }

  move(x: number, y: number) {
    this.mouse.target = {
      x: gsap.utils.mapRange(0, G.w.w, 1, -1, x),
      y: gsap.utils.mapRange(0, G.w.h, 1, -1, y),
    }
  }

  update() {
    if (!this.isInView) return
    const m = this.mouse
    m.current.x = G.lerp(m.current.x, m.target.x, 0.09)
    m.current.y = G.lerp(m.current.y, m.target.y, 0.09)
    const apply = (els: HTMLElement[], px: number) =>
      els.forEach((el) => (el.style.transform = `translate(${px * m.current.x}px, ${px * m.current.y}px)`))
    apply(this.$largeImages, 60)
    apply(this.$mediumImages, 30)
    apply(this.$smallImages, 20)
  }
}

definePiece('works-grid', WorksGrid)
