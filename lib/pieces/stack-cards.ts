import { ScrollTrigger } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { G } from '@/lib/motion/store'
import { AnimationContext } from './context'

interface Card {
  el: HTMLElement
  inner: HTMLElement
  height?: number
}

/*
 * Stacked cards: each card sticks at 6rem + 8rem × index (6.6rem steps on
 * mobile values), driven by CSS custom properties from scroll progress. Desktop only.
 */
class StackCards extends Piece {
  context = new AnimationContext()
  cards: Card[] = []
  $container!: HTMLElement
  totalHeight = 0
  scrollOffset = 0

  mount() {
    this.context = new AnimationContext()
    this.$container = this.$('.stack-cards-wrapper')
    this.cards = this.$All('.stack-cards-card').map((el) => ({
      el,
      inner: el.querySelector<HTMLElement>('.stack-cards-card-inner')!,
    }))
    if (!G.isMobile) {
      this.getBounds()
      this.updateCustomCSSProperties()
    }
  }

  unmount() {
    this.context.kill()
  }

  ready() {
    this.initTriggers()
  }

  getBounds() {
    this.totalHeight = this.cards.reduce((sum, c) => sum + c.el.offsetHeight, 0)
  }

  updateCustomCSSProperties() {
    let offset = 0
    const step = G.isMobile ? G.remToPixel(6.6) : G.remToPixel(8)
    this.cards.forEach((card, i) => {
      const height = card.el.offsetHeight
      card.height = height
      card.inner.style.setProperty('--top-offset', `${G.remToPixel(6) + step * i}px`)
      card.el.style.setProperty('--card-height', `${this.totalHeight - offset}px`)
      offset += height
    })
    this.$container.style.setProperty('--container-height', `${this.totalHeight}px`)
    const last = this.cards[this.cards.length - 1]
    this.scrollOffset = G.w.h - (G.remToPixel(6) + step * (this.cards.length - 1) + (last.height || 0))
    if (this.scrollOffset < 0) this.$container.style.setProperty('--scroll-offset', `${this.scrollOffset}px`)
    G.smoothScroll?.resize()
  }

  initTriggers() {
    if (G.isMobile) return
    const h = G.w.h
    this.context.add(
      ScrollTrigger.create({
        trigger: this.$container,
        start: this.scrollOffset < 0 ? 'bottom bottom' : `bottom ${h - this.scrollOffset}px`,
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const value =
            this.scrollOffset < 0
              ? h - h * (1 - self.progress)
              : h - this.scrollOffset - (h - this.scrollOffset) * (1 - self.progress)
          this.$container.style.setProperty('--final-offset', `${value}px`)
        },
      }),
    )
    if (this.scrollOffset < 0) {
      this.context.add(
        ScrollTrigger.create({
          trigger: this.$container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => this.$container.style.setProperty('--scroll-progress', `${self.progress}`),
        }),
      )
    }
  }

  resetCustomCSSProperties() {
    this.cards.forEach((c) => c.el.style.removeProperty('--card-height'))
    ;['--scroll-offset', '--scroll-progress', '--final-offset', '--container-height'].forEach((p) =>
      this.$container.style.removeProperty(p),
    )
  }

  resizeX() {
    this.context.kill()
    this.resetCustomCSSProperties()
    if (G.isMobile) return
    this.getBounds()
    this.updateCustomCSSProperties()
    this.initTriggers()
  }
}

definePiece('stack-cards', StackCards)
