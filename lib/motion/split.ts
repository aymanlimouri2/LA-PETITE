import { gsap } from './gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

type By = 'lines' | 'chars' | 'words'
type Plugin = 'wrapLines' | 'wrapChars' | null

/*
 * Line / character splitter with the reference's two wrappers:
 * wrapLines puts each line in an overflow-hidden .line-w box,
 * wrapChars puts each character in an overflow-hidden .char-w box.
 * Animations then move the inner element with yPercent.
 */
export class Split {
  target: HTMLElement
  by: By
  plugin: Plugin
  willChange: boolean
  instance!: SplitText & { wrapLines: HTMLElement[]; wrapChars: HTMLElement[] }

  constructor({
    target,
    by = 'chars',
    plugin = null,
    willChange = false,
  }: {
    target: HTMLElement
    by?: By
    plugin?: Plugin
    willChange?: boolean
  }) {
    this.target = target
    this.by = by
    this.plugin = plugin
    this.willChange = willChange
    this.split()
  }

  split() {
    const type = this.by === 'chars' ? 'words,chars' : this.by
    const instance = new SplitText(this.target, {
      type,
      linesClass: 'line',
      wordsClass: 'word',
      charsClass: 'char',
      aria: 'auto',
    }) as Split['instance']
    instance.wrapLines = []
    instance.wrapChars = []
    this.instance = instance
    if (this.by === 'lines' && this.willChange) {
      instance.lines.forEach((line) => ((line as HTMLElement).style.willChange = 'transform'))
    }
    if (this.plugin === 'wrapLines') this.wrapLines()
    if (this.plugin === 'wrapChars') this.wrapChars()
    return instance
  }

  wrapLines() {
    const wrapped: HTMLElement[] = []
    this.instance.lines.forEach((line) => {
      const w = document.createElement('div')
      w.classList.add('line-w')
      line.replaceWith(w)
      w.appendChild(line)
      wrapped.push(line as HTMLElement)
    })
    this.instance.wrapLines = wrapped
  }

  wrapChars() {
    const wrapped: HTMLElement[] = []
    this.instance.chars.forEach((char) => {
      const w = document.createElement('div')
      ;(char as HTMLElement).dataset.char = (char as HTMLElement).innerText
      w.classList.add('char-w')
      char.replaceWith(w)
      w.appendChild(char)
      wrapped.push(char as HTMLElement)
    })
    this.instance.wrapChars = wrapped
  }

  update() {
    this.instance.revert()
    this.split()
  }

  reset() {
    this.instance.revert()
  }
}
