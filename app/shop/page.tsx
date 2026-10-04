import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { WorksIndex, type IndexItem } from '@/components/pages/WorksIndex'
import { shopItems, TBD } from '@/content/site'

export const metadata: Metadata = { title: 'Shop · LA PETITE' }

/*
 * Shop: reference work index. Product kinds from the brand book; which are
 * sold, prices, categories and online sales are TBD, so there are no filters,
 * prices or product links yet.
 */
export default function ShopPage() {
  const spans = ['md:col-span-6', 'md:col-span-6', 'md:col-span-4', 'md:col-span-4', 'md:col-span-4']
  const ratios = ['100%', '66%', '100%', '125%', '100%']
  const items: IndexItem[] = shopItems.map((p, i) => ({
    title: p.name,
    terms: [],
    termLabel: 'Availability TBD',
    hoverLabel: 'Details TBD',
    date: TBD,
    tone: p.tone,
    span: spans[i % spans.length],
    ratio: ratios[i % ratios.length],
    list: [p.name, TBD, TBD, TBD, TBD],
  }))
  return (
    <>
      <WorksIndex
        allLabel="Shop"
        allTermLabel="All products"
        terms={[]}
        items={items}
        listColumns={['Product', 'Category', 'Size', 'Availability', 'Price']}
      />
      <Footer />
    </>
  )
}
