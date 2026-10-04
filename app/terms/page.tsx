import type { Metadata } from 'next'
import { Legal } from '@/components/pages/Legal'

export const metadata: Metadata = { title: 'Terms · LA PETITE' }

export default function TermsPage() {
  return <Legal title="Terms" />
}
