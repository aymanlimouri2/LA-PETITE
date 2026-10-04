/* Index label: number + word, with the reference's char roll (piece "subtitle"). */
export function Subtitle({ number, label, as: Tag = 'div' }: { number: string; label: string; as?: 'div' | 'h2' }) {
  return (
    <div data-piece="subtitle" className="flex gap-x-10 uppercase body-14 tracking-[0.04em]">
      <div className="subtitle-number text-mist overflow-hidden">{number}</div>
      <Tag aria-label={label} className="subtitle-text text-black">
        {label}
      </Tag>
    </div>
  )
}
