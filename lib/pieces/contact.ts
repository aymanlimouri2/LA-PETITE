import { gsap, timeline } from '@/lib/motion/gsap'
import { definePiece, Piece } from '@/lib/motion/piece'
import { G } from '@/lib/motion/store'
import { Split } from '@/lib/motion/split'

/*
 * Visit page (reference contact): title lines rise, the first city rises,
 * details reveal, cover image opens; then the city word loops forever
 * (current up −100%, next from +100%, gl.fastInOut 1s).
 */
class Contact extends Piece {
  $title!: HTMLElement
  $cities: HTMLElement[] = []
  $image!: HTMLElement
  $imageInner!: HTMLElement
  splittedTitle!: Split
  details: { label: HTMLElement; content: Split }[] = []
  tl?: gsap.core.Timeline

  mount() {
    this.$title = this.$('.contact-title')
    this.$cities = this.$All('.contact-city')
    this.$image = G.isMobile ? this.$('.contact-image-mobile') : this.$('.contact-image')
    this.$imageInner = this.$('.image', this.$image)
    this.splittedTitle = new Split({ target: this.$title, by: 'lines', plugin: 'wrapLines', willChange: true })
    this.details = this.$All('.contact-detail').map((d) => ({
      label: this.$('.contact-detail-label', d),
      content: new Split({
        target: this.$('.contact-detail-content', d),
        by: 'lines',
        plugin: 'wrapLines',
        willChange: true,
      }),
    }))
    gsap.set(this.$imageInner, { scale: 0.95 })
    gsap.set(this.$image, { clipPath: G.isMobile ? 'inset(90% 35% 0)' : 'inset(50% 35% 0)' })
    gsap.set(this.splittedTitle.instance.wrapLines, { yPercent: 100 })
    gsap.set(this.$cities, { yPercent: 100 })
    this.details.forEach((d) => {
      gsap.set(d.label, { yPercent: 100 })
      gsap.set(d.content.instance.wrapLines, { yPercent: 100 })
    })
  }

  unmount() {
    this.tl?.kill()
  }

  onTransitionStart() {
    gsap
      .timeline({
        defaults: { delay: G.isFirstLoaded && !G.isMobile ? 0.2 : 0, ease: 'gl.fastInOut', duration: 1.35 },
      })
      .to(this.$image, { clipPath: 'inset(0% 0% 0%)' })
      .to(this.$imageInner, { scale: 1 }, '<')
  }

  initCityAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'gl.fastInOut', duration: 1 }, repeat: -1 })
    this.$cities.forEach((city, i) => {
      const next = this.$cities[i + 1]
      if (next) tl.set(city, { yPercent: 0 }).to(city, { yPercent: -100 }).fromTo(next, { yPercent: 100 }, { yPercent: 0 }, '<')
    })
    tl.to(this.$cities[this.$cities.length - 1], { yPercent: -100 })
      .set(this.$cities[0], { yPercent: 100 }, '<')
      .to(this.$cities[0], { yPercent: 0 }, '<')
    this.tl = tl
  }

  appear() {
    const lines = this.splittedTitle.instance.wrapLines
    const tl = timeline({ onComplete: () => this.initCityAnimation() })
    tl.revealTitle(lines).to(this.$cities[0], { yPercent: 0, ease: 'expo.out', duration: 1.2 }, 0.1 * (lines.length - 1))
    this.details.forEach((d, i) => {
      tl.revealContent(d.label, {}, i === 0 ? '<20%' : '<10%').revealContent(d.content.instance.wrapLines, {}, '<')
    })
  }
}

definePiece('contact', Contact)
