import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { WorksIndex, type IndexItem } from '@/components/pages/WorksIndex'
import { locations, TBD } from '@/content/site'

export const metadata: Metadata = { title: 'Spaces · LA PETITE' }

/* Spaces: reference work index. Filters are the two confirmed cities. */
export default function SpacesPage() {
  const items: IndexItem[] = locations.map((l, i) => ({
    title: l.name,
    href: `/spaces/${l.slug}`,
    terms: [l.slug],
    termLabel: l.short,
    hoverLabel: 'Open space',
    date: TBD,
    tone: l.tone,
    span: 'md:col-span-6',
    ratio: i === 0 ? '100%' : '66%',
    list: [l.name, l.city, l.address, l.hours, TBD],
  }))
  return (
    <>
      <WorksIndex
        allLabel="All Spaces"
        allTermLabel="All spaces"
        terms={locations.map((l) => ({ id: l.slug, name: l.short }))}
        items={items}
        listColumns={['Space', 'City', 'Address', 'Hours', 'Opened']}
      />
      <Footer />
    </>
  )
}
