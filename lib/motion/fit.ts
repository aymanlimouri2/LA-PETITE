/*
 * Sizes each placeholder wordmark so its letters span the width of its box,
 * as the reference's vector logotype does. Becomes unnecessary once the
 * vector wordmark from TB.D is in place.
 */
export function fitWordmarks(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
    const box = el.parentElement
    if (!box) return
    const width = box.clientWidth
    if (!width) return
    el.style.fontSize = '100px'
    el.style.display = 'inline-flex'
    el.style.width = 'auto'
    const natural = el.getBoundingClientRect().width
    el.style.display = ''
    el.style.width = ''
    el.style.fontSize = `${(100 * width) / (natural * 1.04)}px`
  })
}
