/*
 * La Petite content. Only confirmed content appears as copy; everything
 * else is marked TBD (blueprint section 10). Do not fill TBD slots with
 * invented addresses, hours, prices, products, menu items or claims.
 */

export const TBD = 'TBD'

export const tbd = (what: string) => `${what} TBD`

/* Brand book placeholder tones for neutral image blocks (photography TBD). */
export const tones = {
  beans: '#221d19',
  cinnamon: '#5f3f30',
  tawny: '#896447',
  harvest: '#ac947c',
  rustic: '#b0a498',
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
