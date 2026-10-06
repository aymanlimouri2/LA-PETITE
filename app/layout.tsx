import type { Metadata, Viewport } from 'next'
import { Hanken_Grotesk, Marcellus } from 'next/font/google'
import { Shell } from '@/components/Shell'
import './globals.css'

/*
 * TEMPORARY development placeholders only. Final faces are Romano / Netto
 * (display), Garnett Regular (body) and 29LT Zeyn Medium (Arabic); licences
 * and files TBD. Replace before any section is signed off.
 */
const romanoPlaceholder = Marcellus({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-romano-placeholder',
  display: 'block',
})

const garnettPlaceholder = Hanken_Grotesk({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-garnett-placeholder',
  display: 'block',
})

export const metadata: Metadata = {
  title: 'LA PETITE',
  description: 'A speciality café in Al Ain and Abu Dhabi, UAE.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${romanoPlaceholder.variable} ${garnettPlaceholder.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
