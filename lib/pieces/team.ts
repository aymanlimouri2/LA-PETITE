import { gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { G } from '@/lib/motion/store'
import { AnimationContext } from './context'

interface Item {
  el: HTMLElement
  job: HTMLElement
  image: HTMLElement
}

/*
 * Hover list with a sticky image (reference team list, used for the menus).
 * Desktop: hover activates an entry. Mobile: the entry crossing 60% of the viewport.
 */
class Team extends Piece {
  context = new AnimationContext()
  items: Item[] = []
  $sticky!: HTMLElement
  handlers: (() => void)[] = []

  mount() {
    this.context = new AnimationContext()
    const $items = this.$All('.team-item')
    const $jobs = this.$All('.team-job')
    const $images = this.$All('.team-image')
    this.$sticky = this.$('.team-sticky')
    this.items = $items.map((el, i) => ({ el, job: $jobs[i], image: $images[i] }))
    $items.forEach((el, i) => {
      const handler = () => this.activate(i)
      this.handlers.push(handler)
      el.addEventListener('mouseenter', handler)
    })
    this.setSticky()
  }

  unmount() {
    this.items.forEach((item, i) => item.el.removeEventListener('mouseenter', this.handlers[i]))
    this.context.kill()
  }

  ready() {
    if (G.isMobile) this.initTriggers()
  }

  initTriggers() {
    this.items.forEach((item, i) => {
      this.context.add(
        ScrollTrigger.create({
          trigger: item.el,
          start: 'top 60%',
          end: 'bottom 60%',
          onEnter: () => this.activate(i),
          onEnterBack: () => this.activate(i),
        }),
      )
    })
  }

  activate(index: number) {
    this.items.forEach((item, i) => {
      item.el.classList.toggle('a', i === index)
      item.job?.classList.toggle('a', i === index)
      item.image?.classList.toggle('a', i === index)
    })
  }

  setSticky() {
    gsap.set(this.$sticky, { top: (G.w.h - this.$sticky.getBoundingClientRect().height) / 2 })
  }

  resize() {
    this.setSticky()
    this.context.items.forEach((t) => (t as unknown as ScrollTrigger).refresh?.())
  }

  screenChange() {
    if (G.isMobile) this.initTriggers()
    else this.context.kill()
  }
}

definePiece('team', Team)
