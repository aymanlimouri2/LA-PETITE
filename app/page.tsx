import { Footer } from '@/components/Footer'
import { Farm } from '@/components/home/Farm'
import { Hero } from '@/components/home/Hero'
import { Locations } from '@/components/home/Locations'
import { Menus } from '@/components/home/Menus'
import { Spaces } from '@/components/home/Spaces'
import { Story } from '@/components/home/Story'
import { Widget } from '@/components/Widget'

/* Homepage: the reference's eight-part sequence with La Petite content. */
export default function Home() {
  return (
    <>
      <div className="home">
        <div>
          <Hero />
          <Story />
          <Locations />
          <Spaces />
          <Farm />
          <Menus />
          <Widget />
        </div>
      </div>
      <Footer />
    </>
  )
}
