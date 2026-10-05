import { Footer } from '@/components/Footer'
import { Farm } from '@/components/home/Farm'
import { Hero } from '@/components/home/Hero'
import { Locations } from '@/components/home/Locations'
import { Menus } from '@/components/home/Menus'
import { Poster } from '@/components/home/Poster'
import { Spaces } from '@/components/home/Spaces'
import { Story } from '@/components/home/Story'
import { Widget } from '@/components/Widget'

/* Homepage: the reference's eight-part sequence with La Petite content, plus ayman's Poster before Spaces. */
export default function Home() {
  return (
    <>
      <div className="home">
        <div>
          <Hero />
          <Story />
          <Locations />
          <Poster />
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
