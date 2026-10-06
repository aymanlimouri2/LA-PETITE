/* Pointer position listener used by the cloud drift and the cursor image trail. */
export class Mousemove {
  cb: (x: number, y: number) => void
  el: HTMLElement | Window

  constructor({ el = window, cb }: { el?: HTMLElement | Window; cb: (x: number, y: number) => void }) {
    this.el = el
    this.cb = cb
    this.onMove = this.onMove.bind(this)
  }

  onMove(e: Event) {
    const m = e as MouseEvent
    this.cb(m.clientX, m.clientY)
  }

  on() {
    this.el.addEventListener('mousemove', this.onMove)
  }

  off() {
    this.el.removeEventListener('mousemove', this.onMove)
  }
}
