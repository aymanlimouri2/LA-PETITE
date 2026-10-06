import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'
import { gsap, revealContent, revealTitle, ScrollTrigger } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { Split } from '@/lib/motion/split'

/* Scroll text reveals: lines rise once at top 90% (revealTitle / revealContent). */
class LineReveal extends Piece {
  isEntered = false
  splits: Split[] = []
  trigger?: ST
  effect = revealContent

  mount() {
    this.isEntered = false
    this.doSplit()
  }

  // Lines are split inside each block (the reference's line parents: h2, p, ...).
  targets() {
    const title = this.el.querySelector<HTMLElement>('.offset-title')
    if (title) return [title]
    const blocks = this.$All(':scope > p, :scope > h2, :scope > h3, :scope > ul, :scope > ol')
    return blocks.length ? blocks : [this.el]
  }

  get lines() {
    return this.splits.flatMap((s) => s.instance.wrapLines)
  }

  doSplit() {
    if (!this.splits.length) {
      this.splits = this.targets().map(
        (target) => new Split({ target, by: 'lines', plugin: 'wrapLines', willChange: true }),
      )
    } else if (this.isEntered) this.splits.forEach((s) => s.reset())
    else this.splits.forEach((s) => s.update())
    if (!this.isEntered) gsap.set(this.lines, { yPercent: 100 })
  }

  unmount() {
    this.trigger?.kill()
  }

  ready() {
    this.initTrigger()
  }

  initTrigger() {
    this.trigger?.kill()
    this.trigger = ScrollTrigger.create({
      trigger: this.el,
      start: 'top 90%',
      once: true,
      animation: this.effect(this.lines),
      onEnter: () => {
        this.isEntered = true
      },
    })
  }

  resize() {
    this.doSplit()
    if (!this.isEntered) this.initTrigger()
  }
}

class Title extends LineReveal {
  effect = revealTitle
}

class Content extends LineReveal {
  effect = revealContent
}

/* Index label ("01 STORY"): char roll, word slide, number slide. */
class Subtitle extends Piece {
  $number!: HTMLElement
  $text!: HTMLElement
  splittedNumber!: Split
  splittedText!: Split
  trigger?: ST

  mount() {
    this.$number = this.$('.subtitle-number')
    this.$text = this.$('.subtitle-text')
    this.splittedNumber = new Split({ target: this.$number, by: 'chars', plugin: 'wrapChars', willChange: true })
    this.splittedText = new Split({ target: this.$text, by: 'chars', plugin: 'wrapChars', willChange: true })
    gsap.set(this.splittedText.instance.wrapChars, { yPercent: 200 })
    gsap.set(this.splittedNumber.instance.wrapChars, { xPercent: -100 })
    gsap.set(this.$text, { x: -(this.$text.getBoundingClientRect().left - this.el.getBoundingClientRect().left) })
  }

  unmount() {
    this.trigger?.kill()
  }

  ready() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.2 } })
    tl.to(this.splittedText.instance.wrapChars, { yPercent: 0, stagger: 0.02 })
      .to(this.$text, { x: 0, ease: 'gl.fastInOut', duration: 1.3 }, '<40%')
      .to(this.splittedNumber.instance.wrapChars, { xPercent: 0, stagger: 0.1 }, '<10%')
    this.trigger = ScrollTrigger.create({ trigger: this.el, start: 'top 90%', once: true, animation: tl })
  }
}

definePiece('title', Title)
definePiece('content', Content)
definePiece('subtitle', Subtitle)
