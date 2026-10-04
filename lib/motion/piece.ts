/*
 * Section controllers ("pieces"), the equivalent of the reference's custom
 * elements. A piece is bound to an element carrying data-piece="name" and
 * receives the same lifecycle calls: mount, ready, appear, resize, resizeX,
 * screenChange, update (per frame), scroll and unmount.
 */
export class Piece {
  el: HTMLElement
  view: HTMLElement

  constructor(el: HTMLElement, view: HTMLElement) {
    this.el = el
    this.view = view
  }

  $<T extends Element = HTMLElement>(selector: string, root: ParentNode = this.el) {
    return root.querySelector<T>(selector) as T
  }

  $All<T extends Element = HTMLElement>(selector: string, root: ParentNode = this.el) {
    return Array.from(root.querySelectorAll<T>(selector))
  }

  mount() {}
  unmount() {}
}

type PieceMethod =
  | 'ready'
  | 'appear'
  | 'resize'
  | 'resizeX'
  | 'screenChange'
  | 'update'
  | 'scroll'
  | 'onTransitionStart'
  | 'refresh'

type PieceCtor = new (el: HTMLElement, view: HTMLElement) => Piece

const definitions = new Map<string, PieceCtor>()
const live = new Map<HTMLElement, Piece>()

export function definePiece(name: string, ctor: PieceCtor) {
  definitions.set(name, ctor)
}

export function mountPieces(view: HTMLElement) {
  view.querySelectorAll<HTMLElement>('[data-piece]').forEach((el) => {
    if (live.has(el)) return
    const Ctor = definitions.get(el.dataset.piece || '')
    if (!Ctor) return
    const piece = new Ctor(el, view)
    live.set(el, piece)
    piece.mount()
  })
}

export function unmountPieces(keep?: (el: HTMLElement) => boolean) {
  live.forEach((piece, el) => {
    if (keep && keep(el)) return
    live.delete(el)
    piece.unmount()
  })
}

export function emitPieces(method: PieceMethod, payload?: unknown) {
  live.forEach((piece) => {
    const fn = (piece as unknown as Record<string, unknown>)[method]
    if (typeof fn === 'function') fn.call(piece, payload)
  })
}
