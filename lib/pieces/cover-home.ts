import { gsap, timeline } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { Split } from '@/lib/motion/split'
import { G } from '@/lib/motion/store'

/* Homepage hero. First-load motion lives in the Loader; this handles later visits. */
class CoverHome extends Piece {
  $video!: HTMLVideoElement | null
  $titleLight!: HTMLElement
  $content!: HTMLElement
  splittedTitle?: Split
  splittedContent?: Split

  mount() {
    this.$video = this.el.querySelector('video')
    this.$titleLight = this.$('.cover-home-title-light')
    this.$content = this.$('.cover-home-content')
    if (this.$video && this.$video.readyState >= 2) this.$video.play()
    if (G.isFirstLoaded) {
      gsap.set(this.el, { paddingTop: 0 })
      this.initAnimations()
    }
  }

  unmount() {
    this.$video?.pause()
  }

  initAnimations() {
    this.splittedTitle = new Split({ target: this.$titleLight, by: 'lines', plugin: 'wrapLines', willChange: true })
    this.splittedContent = new Split({ target: this.$content, by: 'lines', plugin: 'wrapLines', willChange: true })
    gsap.set(this.splittedTitle.instance.wrapLines, { yPercent: 100 })
    gsap.set(this.splittedContent.instance.wrapLines, { yPercent: 100 })
  }

  appear() {
    if (!G.isFirstLoaded) return
    const tl = timeline()
    if (this.splittedTitle) tl.revealTitle(this.splittedTitle.instance.wrapLines)
    if (this.splittedContent) tl.revealContent(this.splittedContent.instance.wrapLines, {}, '<25%')
  }
}

definePiece('cover-home', CoverHome)
