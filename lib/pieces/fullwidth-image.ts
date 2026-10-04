import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { G } from '@/lib/motion/store'

/*
 * Full-width image. As a page cover (data-appear) it opens on page entry from
 * inset(50% 40vw 0) (mobile 90%), then on desktop the side inset of 2rem is
 * scrubbed away from clamp(top bottom) to bottom bottom, inner 1.015 → 1.
 */
class FullwidthImage extends Piece {
  hasAppear = false
  firstHit = true
  $imageInner!: HTMLElement
  scrollTrigger?: ST
  appearTL?: gsap.core.Timeline

  mount() {
    this.hasAppear = Boolean(this.el.dataset.appear)
    this.firstHit = true
    this.$imageInner = this.$('.fullwidth-image-inner')
    this.initAnimations()
  }

  unmount() {
    this.scrollTrigger?.kill()
  }

  initAnimations() {
    if (this.hasAppear) {
      gsap.set(this.$imageInner, { scale: 1 })
      gsap.set(this.el, {
        clipPath: G.isMobile ? `inset(90% ${0.4 * G.w.w}px 0%)` : `inset(50% ${0.4 * G.w.w}px 0%)`,
      })
    } else {
      gsap.set(this.$imageInner, { scale: 1.015 })
      gsap.set(this.el, { clipPath: `inset(0% ${G.remToPixel(2)}px)` })
    }
  }

  initTrigger() {
    if (G.isMobile) return
    this.scrollTrigger?.kill()
    const tl = gsap.timeline({ defaults: { ease: 'none' } })
    tl.fromTo(this.el, { clipPath: `inset(0% ${G.remToPixel(2)}px)` }, { clipPath: 'inset(0% 0px)' }).fromTo(
      this.$imageInner,
      { scale: 1.015 },
      { scale: 1 },
      '<',
    )
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.el,
      start: 'clamp(top bottom)',
      end: 'bottom bottom',
      scrub: true,
      animation: tl,
      onUpdate: () => {
        if (this.firstHit) {
          this.appearTL?.kill()
          this.firstHit = false
        }
      },
    })
  }

  onTransitionStart() {
    if (!this.hasAppear) return
    this.appearTL = gsap
      .timeline({
        defaults: { delay: G.isFirstLoaded && !G.isMobile ? 0.2 : 0, ease: 'gl.fastInOut', duration: 1.35 },
      })
      .to(this.el, { clipPath: G.isMobile ? 'inset(0% 0px 0%)' : `inset(0% ${G.remToPixel(2)}px 0%)` })
      .to(this.$imageInner, { scale: 1.015 }, '<')
  }

  ready() {
    this.initTrigger()
  }

  screenChange() {
    if (G.isMobile) {
      this.scrollTrigger?.kill()
      gsap.set(this.el, { clearProps: 'all' })
      gsap.set(this.$imageInner, { clearProps: 'all' })
    } else {
      this.initAnimations()
      this.initTrigger()
    }
  }
}

definePiece('fullwidth-image', FullwidthImage)
