import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { G } from '@/lib/motion/store'

/* Parallax image: travel = height / force × min(width, 1440) / 1440, scrubbed. Desktop only. */
class ParallaxImage extends Piece {
  force = 5
  $image!: HTMLElement
  sT?: ST
  animation?: gsap.core.Tween
  transformValue = 0

  mount() {
    this.force = Number(this.el.dataset.parallaxForce || 5)
    this.$image = this.$('img, .parallax-el')
    this.init()
  }

  unmount() {
    this.sT?.kill()
  }

  init() {
    if (G.w.w < 1200 || G.detect.isMobile) return
    this.el.style.overflow = 'hidden'
    this.updateTransformValue()
    this.animation = gsap.fromTo(
      this.$image,
      { y: () => -this.transformValue / 2 },
      { paused: true, y: () => this.transformValue / 2, ease: 'none' },
    )
  }

  initTrigger() {
    const top = this.el.getBoundingClientRect().top
    this.sT = ScrollTrigger.create({
      start: () => (top < G.w.h ? `clamp(top-=${top}px top)` : 'top bottom'),
      trigger: this.el,
      animation: this.animation,
      invalidateOnRefresh: true,
      scrub: true,
    })
  }

  ready() {
    this.initTrigger()
  }

  updateTransformValue() {
    const rect = this.el.getBoundingClientRect()
    this.transformValue = (rect.height / this.force) * (Math.min(G.w.w, 1440) / 1440)
    this.$image.style.height = `calc(100% + ${this.transformValue}px)`
    this.$image.style.marginTop = `-${this.transformValue / 2}px`
  }

  resizeX() {
    if (!G.isMobile) this.updateTransformValue()
  }

  screenChange() {
    this.updateTransformValue()
    if (G.isMobile) {
      this.sT?.kill()
      gsap.set(this.$image, { clearProps: 'all' })
    } else this.init()
  }
}

definePiece('parallax-image', ParallaxImage)
