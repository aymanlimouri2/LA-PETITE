import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'
import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'

/*
 * "Back to all spaces" pill that expands into the next-location card when the
 * page bottom reaches the viewport bottom (gl.fastInOut 0.9s), and folds back.
 */
class WidgetWork {
  isOpen = false
  $el: HTMLElement
  $parent: HTMLElement
  $back: HTMLElement
  $backText: HTMLElement
  $backIcon: HTMLElement
  $next: HTMLElement
  $nextImage: HTMLElement
  $nextTitle: HTMLElement
  $nextSubtitle: HTMLElement
  $image: HTMLElement
  nextBounds!: DOMRect
  showTL?: gsap.core.Timeline
  hideTL?: gsap.core.Timeline

  constructor(dom: HTMLElement) {
    this.$el = dom.querySelector('.widget-work')!
    this.$parent = this.$el.parentElement!
    this.$back = this.$el.querySelector('.widget-back')!
    this.$backText = this.$el.querySelector('.widget-back-text')!
    this.$backIcon = this.$el.querySelector('.widget-back-icon')!
    this.$next = this.$el.querySelector('.widget-next')!
    this.$nextImage = this.$el.querySelector('.widget-next-image')!
    this.$nextTitle = this.$el.querySelector('.widget-next-title')!
    this.$nextSubtitle = this.$el.querySelector('.widget-next-subtitle')!
    this.$image = this.$el.querySelector('.widget-next-image .image')!
    this.setBounds()
    gsap.set([this.$nextTitle, this.$nextSubtitle], { yPercent: 100 })
    gsap.set(this.$nextImage, { autoAlpha: 0 })
  }

  setBounds() {
    this.nextBounds = this.$next.getBoundingClientRect()
  }

  show() {
    this.isOpen = true
    this.hideTL?.kill()
    this.$parent.classList.add('a')
    gsap.killTweensOf([this.$el, this.$image, this.$nextImage])
    this.showTL = gsap
      .timeline({ defaults: { ease: 'gl.fastInOut', duration: 0.9 } })
      .to(this.$el, { width: this.nextBounds.width, height: this.nextBounds.height })
      .to(this.$back, { autoAlpha: 0, ease: 'power2.out', duration: 0.1 }, 0)
      .set(this.$nextImage, { autoAlpha: 0 }, 0)
      .set(this.$next, { autoAlpha: 1 }, '<')
      .fromTo(this.$image, { scale: 1.3 }, { scale: 1 }, '<')
      .fromTo(this.$nextImage, { xPercent: 40 }, { xPercent: 0 }, '<')
      .fromTo(this.$nextImage, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'power2.out', duration: 0.25 }, '<0.1')
      .fromTo(
        [this.$nextTitle, this.$nextSubtitle],
        { yPercent: 100, autoAlpha: 1 },
        { yPercent: 0, stagger: 0.075, ease: 'expo.out', duration: 1.1 },
        '<20%',
      )
  }

  hide() {
    this.isOpen = false
    this.showTL?.kill()
    this.$parent.classList.remove('a')
    gsap.killTweensOf([this.$el, this.$image, this.$nextImage])
    this.hideTL = gsap
      .timeline()
      .to(this.$el, { width: 'auto', height: 'auto', ease: 'expo.out', duration: 0.8 })
      .fromTo(this.$back, { yPercent: -150 }, { yPercent: 0, ease: 'expo.out', duration: 0.6 }, '<')
      .fromTo(this.$backText, { x: 10 }, { x: 0, ease: 'expo.out', duration: 0.6 }, '<')
      .fromTo(this.$backIcon, { x: -10 }, { x: 0, ease: 'expo.out', duration: 0.6 }, '<')
      .to(this.$next, { autoAlpha: 0, ease: 'power2.out', duration: 0.2 }, 0)
      .to(this.$back, { autoAlpha: 1, ease: 'power2.out', duration: 0.35 }, '<50%')
  }

  resize() {
    this.setBounds()
    if (this.isOpen) gsap.set(this.$el, { width: this.nextBounds.width, height: this.nextBounds.height })
  }
}

class SingleWork extends Piece {
  widget!: WidgetWork
  trigger?: ST

  mount() {
    this.widget = new WidgetWork(this.el.parentElement!)
  }

  unmount() {
    this.trigger?.kill()
  }

  ready() {
    this.trigger = ScrollTrigger.create({
      trigger: this.el,
      start: 'bottom bottom',
      onEnter: () => this.widget.show(),
      onLeaveBack: () => this.widget.hide(),
    })
  }

  resize() {
    this.widget?.resize()
  }
}

definePiece('single-work', SingleWork)
