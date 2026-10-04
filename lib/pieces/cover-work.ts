import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'
import { gsap, ScrollTrigger, timeline } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { Split } from '@/lib/motion/split'

interface Detail {
  line: HTMLElement
  label: HTMLElement
  content: Split
}

/*
 * Location cover (reference project cover): title and tags rise; fact rows draw
 * their rule (scaleX, gl.fastInOut 1s, each 25% after the previous) and reveal.
 */
class CoverWork extends Piece {
  isEntered = false
  $title!: HTMLElement
  $tags: HTMLElement[] = []
  $detailsWrapper!: HTMLElement
  details: Detail[] = []
  trigger?: ST

  mount() {
    this.$title = this.$('.cover-work-title')
    this.$tags = this.$All('.cover-work-tag')
    this.$detailsWrapper = this.$('.cover-work-details')
    this.details = this.$All('.cover-work-detail').map((d) => ({
      line: this.$('.cover-work-detail-line', d),
      label: this.$('.cover-work-detail-label', d),
      content: new Split({
        target: this.$('.cover-work-detail-content', d),
        by: 'lines',
        plugin: 'wrapLines',
        willChange: true,
      }),
    }))
    gsap.set(this.$title, { yPercent: 100 })
    gsap.set(this.$tags, { yPercent: 100 })
    this.details.forEach((d) => {
      gsap.set(d.line, { scaleX: 0 })
      gsap.set(d.label, { yPercent: 100 })
      gsap.set(d.content.instance.wrapLines, { yPercent: 100 })
    })
  }

  unmount() {
    this.trigger?.kill()
  }

  ready() {
    this.trigger = ScrollTrigger.create({
      trigger: this.$detailsWrapper,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        this.isEntered = true
        const tl = timeline()
        this.details.forEach((d, i) => {
          tl.to(d.line, { scaleX: 1, transformOrigin: 'left', ease: 'gl.fastInOut', duration: 1 }, i === 0 ? 0 : '<25%')
            .revealContent(d.label, {}, '<')
            .revealContent(d.content.instance.wrapLines, {}, '<')
        })
      },
    })
  }

  appear() {
    gsap
      .timeline({ defaults: { ease: 'expo.out', duration: 1.2 } })
      .to(this.$title, { yPercent: 0 })
      .to(this.$tags, { yPercent: 0, stagger: 0.1 }, '<20%')
  }

  resizeX() {
    this.details.forEach((d) => {
      d.content.update()
      if (!this.isEntered) gsap.set(d.content.instance.wrapLines, { yPercent: 100 })
    })
  }
}

definePiece('cover-work', CoverWork)
