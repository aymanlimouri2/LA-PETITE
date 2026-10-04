import type { Metadata } from 'next'
import { Legal } from '@/components/pages/Legal'

export const metadata: Metadata = { title: 'Privacy policy · LA PETITE' }

export default function PrivacyPage() {
  return <Legal title="Privacy policy" />
}
