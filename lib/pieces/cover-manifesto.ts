import { gsap, timeline } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { Split } from '@/lib/motion/split'

/* Manifesto statement: lines rise, then at 40% the plain phrases turn grey and the strong ones stay black. */
class CoverManifesto extends Piece {
  $title!: HTMLElement
  splittedTitle!: Split

  mount() {
    this.$title = this.$('.cover-manifesto-title')
    this.splittedTitle = new Split({ target: this.$title, by: 'lines', plugin: 'wrapLines', willChange: true })
    gsap.set(this.splittedTitle.instance.wrapLines, { yPercent: 100 })
  }

  appear() {
    timeline()
      .revealTitle(this.splittedTitle.instance.wrapLines)
      .call(() => this.$title.classList.add('a'), [], '<40%')
  }

  resize() {
    this.splittedTitle?.update()
  }
}

definePiece('cover-manifesto', CoverManifesto)
