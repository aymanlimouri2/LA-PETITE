import { gsap } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { G } from '@/lib/motion/store'
import { Mousemove } from './mousemove'

/*
 * Cursor image trail on tiles: the image scales in at the cursor (expo.out 0.8s),
 * follows with quickTo 0.6s, and switches image every 7.5% of screen width travelled.
 */
class FollowMouse extends Piece {
  canAnimate = false
  currentIndex = 0
  mouse = { x: 0, y: 0, last: { x: 0, y: 0 } }
  threshold = 0
  offset = { x: 0, y: 0 }
  $content!: HTMLElement
  $image!: HTMLElement
  $imageInner!: HTMLElement
  $images: HTMLElement[] = []
  mm!: Mousemove
  enterTL?: gsap.core.Timeline
  leaveTL?: gsap.core.Timeline
  quickX?: gsap.QuickToFunc
  quickY?: gsap.QuickToFunc

  mount() {
    this.onEnter = this.onEnter.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.getBounds = this.getBounds.bind(this)
    this.$content = this.$('.follow-mouse-el')
    this.$image = this.$('.follow-mouse-image')
    this.$imageInner = this.$('.follow-mouse-image-inner')
    this.$images = this.$All('.follow-mouse-img')
    this.el.addEventListener('mouseenter', this.onEnter)
    this.el.addEventListener('mouseleave', this.onLeave)
    window.addEventListener('calculate-bounds', this.getBounds)
    this.getBounds()
    this.setThreshold()
    gsap.set(this.$image, { scale: 0, opacity: 0 })
    if (!G.isMobile) this.initQuickTo()
    this.mm = new Mousemove({ el: this.el, cb: (x, y) => this.move(x, y) })
    this.mm.on()
  }

  ready() {
    this.getBounds()
  }

  unmount() {
    this.mm.off()
    window.removeEventListener('calculate-bounds', this.getBounds)
    this.el.removeEventListener('mouseenter', this.onEnter)
    this.el.removeEventListener('mouseleave', this.onLeave)
  }

  onEnter(e: MouseEvent) {
    if (G.isMobile) return
    this.mouse.x = e.clientX
    this.mouse.y = e.clientY
    this.leaveTL?.kill()
    this.enterTL = gsap
      .timeline({ defaults: { ease: 'expo.out', duration: 0.8 } })
      .to(this.$image, { scale: 1 })
      .set(this.$image, { opacity: 1 }, '<10%')
      .fromTo(this.$imageInner, { scale: 1.8 }, { scale: 1 }, 0)
    this.initQuickTo()
    this.canAnimate = true
  }

  onLeave() {
    if (G.isMobile) return
    this.enterTL?.kill()
    this.leaveTL = gsap
      .timeline({ defaults: { ease: 'expo.out', duration: 0.6 } })
      .to(this.$image, { scale: 0 })
      .to(this.$imageInner, { scale: 1.8 }, 0)
      .set(this.$image, { opacity: 0 }, '<10%')
    this.canAnimate = false
  }

  initQuickTo() {
    const scroll = G.smoothScroll?.animatedScroll ?? 0
    gsap.set(this.$content, { x: this.mouse.x - this.offset.x, y: this.mouse.y - this.offset.y + scroll })
    this.quickX = gsap.quickTo(this.$content, 'x', { duration: 0.6, ease: 'expo.out' })
    this.quickY = gsap.quickTo(this.$content, 'y', { duration: 0.6, ease: 'expo.out' })
  }

  move(x: number, y: number) {
    this.mouse.x = x
    this.mouse.y = y
  }

  getBounds() {
    const bounds = this.el.getBoundingClientRect()
    const scroll = G.smoothScroll?.animatedScroll ?? 0
    this.offset = { x: bounds.left - G.remToPixel(2), y: bounds.top - G.remToPixel(2.5) + scroll }
  }

  resize() {
    this.setThreshold()
    if (G.isMobile) {
      gsap.killTweensOf(this.$content)
      gsap.set(this.$content, { clearProps: 'all' })
    } else this.getBounds()
  }

  setThreshold() {
    this.threshold = 0.075 * G.w.w
  }

  switchImage() {
    this.currentIndex = gsap.utils.wrap(0, this.$images.length, this.currentIndex + 1)
    this.$images.forEach((img, i) => img.classList.toggle('opacity-0', i !== this.currentIndex))
  }

  update() {
    if (!this.canAnimate) return
    if (G.distance(this.mouse.x, this.mouse.y, this.mouse.last.x, this.mouse.last.y) > this.threshold) {
      this.switchImage()
      this.mouse.last = { x: this.mouse.x, y: this.mouse.y }
    }
    const scroll = G.smoothScroll?.animatedScroll ?? 0
    this.quickX?.(this.mouse.x - this.offset.x)
    this.quickY?.(this.mouse.y - this.offset.y + scroll)
  }
}

definePiece('follow-mouse', FollowMouse)
