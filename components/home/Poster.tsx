/*
 * Poster (ayman, 2026-10-05): the brand-book iced latte poster rebuilt as a
 * homepage section before Spaces. This is ayman's addition to the reference
 * homepage sequence. Motion is the site's existing set only: the image block
 * scrub (fullwidth-image), parallax (parallax-image) and line rise (text).
 * Handle and domain are set exactly as on the poster and not linked (TBD).
 */
export function Poster() {
  return (
    <section className="poster block bg-white pb-100 md:pb-150">
      <div className="grid-w">
        <div className="@container col-span-full md:col-start-3 md:col-end-11 xl:col-start-4 xl:col-end-10">
          <div className="bg-[#e3dbce] p-[2.4%] pb-[2.9%]">
            <div data-piece="fullwidth-image" className="block w-full">
              <div className="fullwidth-image-inner relative w-full h-0 pt-[110.86%] [clip-path:polygon(0_0,100%_0,100%_100%,17%_100%,0_93%)]">
                <div data-piece="parallax-image" className="absolute-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/poster-iced-latte.jpg"
                    alt="Iced latte on a concrete table in the sun"
                    width={1179}
                    height={1307}
                    loading="lazy"
                    className="block w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end pt-[22%] pr-[3.5%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/black/la-petite.png"
                alt="La Petite"
                width={3444}
                height={476}
                loading="lazy"
                className="block w-[32%] h-auto"
              />
              <div data-piece="text" className="text-[max(1.1rem,1.9cqw)] leading-[120%] uppercase">
                <p>(AT)LAPETITE.COFFEE</p>
                <p>EATLAPETITE.COM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
