import { gsap, timeline } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { G } from '@/lib/motion/store'
import { Split } from '@/lib/motion/split'

/* Cover title and image: image opens from inset(50% 35% 0) (mobile 90%), inner 0.95 → 1, 1.35s. */
class CoverAbout extends Piece {
  $title!: HTMLElement
  $content!: HTMLElement | null
  $image!: HTMLElement
  $imageInner!: HTMLElement
  splittedTitle!: Split
  splittedContent?: Split

  mount() {
    this.$title = this.$('.cover-about-title')
    this.$content = this.$<HTMLElement>('.cover-about-content')
    this.$image = this.$('.cover-about-image')
    this.$imageInner = this.$('.cover-about-image-inner')
    this.splittedTitle = new Split({ target: this.$title, by: 'lines', plugin: 'wrapLines', willChange: true })
    gsap.set(this.splittedTitle.instance.wrapLines, { yPercent: 100 })
    if (this.$content) {
      this.splittedContent = new Split({ target: this.$content, by: 'lines', plugin: 'wrapLines', willChange: true })
      gsap.set(this.splittedContent.instance.wrapLines, { yPercent: 100 })
    }
    gsap.set(this.$imageInner, { scale: 0.95 })
    gsap.set(this.$image, { clipPath: G.isMobile ? 'inset(90% 35% 0)' : 'inset(50% 35% 0)' })
  }

  onTransitionStart() {
    gsap
      .timeline({
        defaults: { delay: G.isFirstLoaded && !G.isMobile ? 0.2 : 0, ease: 'gl.fastInOut', duration: 1.35 },
      })
      .to(this.$image, { clipPath: 'inset(0% 0% 0%)' })
      .to(this.$imageInner, { scale: 1 }, '<')
  }

  appear() {
    const tl = timeline()
    tl.revealTitle(this.splittedTitle.instance.wrapLines)
    if (this.splittedContent) tl.revealContent(this.splittedContent.instance.wrapLines, {}, '<25%')
  }
}

definePiece('cover-about', CoverAbout)
