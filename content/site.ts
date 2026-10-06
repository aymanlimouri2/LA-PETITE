/*
 * La Petite content. Only confirmed content appears as copy; everything
 * else is marked TBD (blueprint section 10). Do not fill TBD slots with
 * invented addresses, hours, prices, products, menu items or claims.
 */

export const TBD = 'TBD'

export const tbd = (what: string) => `${what} TBD`

/*
 * Placeholder tones for neutral image blocks (photography TBD).
 * The brown tones are pure white at ayman's request (2026-10-04); their
 * brand book values were cinnamon #5f3f30, tawny #896447, harvest #ac947c,
 * rustic #b0a498.
 */
export const tones = {
  beans: '#221d19',
  cinnamon: '#ffffff',
  tawny: '#ffffff',
  harvest: '#ffffff',
  rustic: '#ffffff',
  almond: '#f0e3d2',
} as const

export type Tone = keyof typeof tones

export const site = {
  name: 'LA PETITE',
  // Arabic wordmark from the brand book; vector file TBD.
  arabicName: 'لابتيت',
  descriptor: 'A speciality café',
  region: 'Al Ain · Abu Dhabi, UAE',
  instagram: { label: 'Instagram', handle: '@lapetite.coffee', url: 'https://www.instagram.com/lapetite.coffee/' },
  brandLines: {
    space: 'A space.',
    associations: 'A speciality café with humble associations.',
    farmToTable: 'A modern take on farm-to-table.',
    farm: 'Produced in collaboration with Emirates Bio Farm, Al Ain.',
    hero: 'Contemporary eating. Humble associations.',
  },
  values: ['Simplicity', 'Authenticity', 'Connection to nature'],
}

export const nav = [
  { label: 'Spaces', href: '/spaces' },
  { label: 'Menu', href: '/menu' },
  { label: 'Shop', href: '/shop' },
  { label: 'Story', href: '/story' },
]

export const contactLink = { label: 'Visit', href: '/visit' }

export const mobileNav = [{ label: 'Home', href: '/' }, ...nav, contactLink]

export const sitemap = [{ label: 'Home', href: '/' }, ...nav, contactLink]

export const legal = [
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

export interface Location {
  slug: string
  name: string
  city: string
  short: string
  tone: Tone
  address: string
  hours: string
  phone: string
  menu: { label: string; pdf: string | null }
}

export const locations: Location[] = [
  {
    slug: 'al-ain',
    name: 'LA PETITE AL AIN',
    city: 'Al Ain, UAE',
    short: 'Al Ain',
    tone: 'tawny',
    address: tbd('Address'),
    hours: tbd('Opening hours'),
    phone: tbd('Phone'),
    menu: { label: 'Al Ain Menu', pdf: null },
  },
  {
    slug: 'abu-dhabi',
    name: 'LA PETITE ABU DHABI',
    city: 'Abu Dhabi, UAE',
    short: 'Abu Dhabi',
    tone: 'cinnamon',
    address: tbd('Address'),
    hours: tbd('Opening hours'),
    phone: tbd('Phone'),
    menu: { label: 'Abu Dhabi Menu', pdf: null },
  },
]

export const menus = locations.map((l) => ({ ...l.menu, location: l }))

export const email = tbd('Email')

export const year = 2026

/*
 * Shop: the product kinds shown in the brand book. Which ones are sold,
 * prices and online sales are TBD, so tiles carry no prices or links.
 */
export const shopItems: { name: string; tone: Tone }[] = [
  { name: 'Coffee bags', tone: 'cinnamon' },
  { name: 'Granola', tone: 'harvest' },
  { name: 'Bottled cold brew', tone: 'beans' },
  { name: 'Bottled Spanish latte', tone: 'rustic' },
  { name: 'Dessert boxes', tone: 'tawny' },
]

/* Story page commitment cards: titles from the brand book, copy TBD. */
export const commitments = [
  { title: 'Emirates Bio Farm', text: site.brandLines.farm },
  ...site.values.map((title) => ({ title, text: tbd('Card copy') })),
]

/*
 * Café photography supplied by ayman (2026-10-06). Which location each shows
 * is TBD, so none is tied to Al Ain or Abu Dhabi. `s` is the smaller copy
 * used in the Spaces cloud.
 */
type CafePhoto = { src: string; s: string; alt: string; width: number; height: number }
const cafe = (n: number, alt: string, portrait = false, w = 2000): CafePhoto => ({
  src: `/images/cafe/la-petite-${n}.jpg`,
  s: `/images/cafe/la-petite-${n}-s.jpg`,
  alt,
  width: portrait ? Math.round((w * 2) / 3) : w,
  height: portrait ? w : Math.round((w * 2) / 3),
})
export const cafePhotos = {
  facade: cafe(33, 'The La Petite sign above the open café front and terrace', true),
  terraceTall: cafe(24, 'The terrace and the lit café through its open glass front', true),
  lounge: cafe(43, 'Inside La Petite: low seats, a lamp and the long window', true),
  olive: cafe(28, 'An olive tree in the garden in front of the café at night', false, 2400),
  interior: cafe(7, 'Inside La Petite by day: the counter, flowers and stools'),
  stage: cafe(25, 'The café interior seen from the terrace at dusk'),
  night: cafe(27, 'The café at night through its folding glass doors'),
  courtyard: cafe(34, 'The terrace and counter in the evening'),
  terraceDay: cafe(48, 'The terrace by day with guests and greenery'),
}
