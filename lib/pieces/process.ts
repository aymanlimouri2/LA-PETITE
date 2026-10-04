import { definePiece, Piece } from '@/lib/motion/piece'

/* 04 Our menus list: hovering an entry activates it and its image (class "a"). */
class Process extends Piece {
  $items: HTMLElement[] = []
  $images: HTMLElement[] = []
  handlers: (() => void)[] = []

  mount() {
    this.$items = this.$All('.process-item')
    this.$images = this.$All('.process-image')
    this.$items.forEach((item, i) => {
      const handler = () => this.onEnter(i)
      this.handlers.push(handler)
      item.addEventListener('mouseenter', handler)
    })
  }

  unmount() {
    this.$items.forEach((item, i) => item.removeEventListener('mouseenter', this.handlers[i]))
  }

  onEnter(index: number) {
    this.$items.forEach((item, i) => {
      item.classList.remove('a')
      this.$images[i]?.classList.remove('a')
    })
    this.$items[index].classList.add('a')
    this.$images[index]?.classList.add('a')
  }
}

definePiece('process', Process)
