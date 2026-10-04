import type Lenis from 'lenis'

type Handler = (payload?: unknown) => void

export function createEmitter() {
  const all = new Map<string, Handler[]>()
  return {
    on(type: string, handler: Handler) {
      const list = all.get(type)
      if (list) list.push(handler)
      else all.set(type, [handler])
    },
    off(type: string, handler?: Handler) {
      const list = all.get(type)
      if (!list) return
      if (handler) list.splice(list.indexOf(handler) >>> 0, 1)
      else all.set(type, [])
    },
    emit(type: string, payload?: unknown) {
      const list = all.get(type)
      if (list) list.slice().forEach((h) => h(payload))
    },
  }
}

export type Emitter = ReturnType<typeof createEmitter>

export interface LoaderApi {
  onHomeScroll: () => gsap.core.Timeline
  resizeX: () => void
  screenChange: () => void
}

export interface HeaderApi {
  isOpen: boolean
  close: () => Promise<void>
  onPageChange: (location: Location) => void
}

export interface WidgetApi {
  init: () => void
  destroy: () => void
  resize: () => void
}

/*
 * Shared runtime state, the equivalent of the reference's global store.
 * Everything here is client-only and set by the Site runtime.
 */
export const G = {
  w: { w: 0, h: 0, pR: 1 },
  isMobile: false,
  isFirstLoaded: false,
  isFooterVisible: false,
  footerHeight: 0,
  pageHeight: 0,
  remPx: 10,
  smoothScroll: null as Lenis | null,
  emitter: createEmitter(),
  loader: null as LoaderApi | null,
  header: null as HeaderApi | null,
  widget: null as WidgetApi | null,
  fade: null as HTMLElement | null,
  view: null as HTMLElement | null,
  navigate: null as ((href: string) => void) | null,
  detect: { isMobile: false },
  remToPixel(rem: number) {
    return rem * G.remPx
  },
  lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
  },
  distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.hypot(x2 - x1, y2 - y1)
  },
}
