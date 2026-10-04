/* Collects triggers and tweens so a piece can kill them together. */
export class AnimationContext {
  items: { kill: () => unknown }[] = []

  add<T extends { kill: () => unknown }>(item: T) {
    this.items.push(item)
    return item
  }

  kill() {
    this.items.forEach((item) => item.kill())
    this.items = []
  }
}
