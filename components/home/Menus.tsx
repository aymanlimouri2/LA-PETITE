import { Corners } from '@/components/Corners'
import { Placeholder } from '@/components/Placeholder'
import { Subtitle } from '@/components/Subtitle'
import { menus, tbd } from '@/content/site'

/*
 * 04 Our menus (reference 04 Method list). Two official menus; each opens
 * its PDF once supplied (TBD). No items, prices or categories.
 */
export function Menus() {
  return (
    <div data-piece="process" className="grid-w relative justify-between pt-margin pb-150 md:pt-150 bg-beige">
      <Corners corners={['tl', 'tr', 'bl', 'br']} />
      <div className="col-span-full xl:col-span-8 body-36 md:body-48 text-black xl:text-mist xl:mb-100 font-display">
        {menus.map((menu, i) => {
          const label = (
            <span>
              {menu.label} <sup className="body-20 md:body-32">({String(i + 1).padStart(2, '0')})</sup>
            </span>
          )
          return (
            <span key={menu.label} className="leading-[120%]">
              <span className={`process-item cursor-pointer [&.a]:text-black ${i === 0 ? 'a' : ''}`}>
                {menu.pdf ? (
                  <a href={menu.pdf} target="_blank" rel="noopener">
                    {label}
                  </a>
                ) : (
                  label
                )}
              </span>
              {i < menus.length - 1 && <span> / </span>}
            </span>
          )
        })}
      </div>
      <div className="col-span-full xl:col-start-10 xl:col-end-13 xl:row-span-2 max-xl:mt-52 max-xl:mb-32">
        <div className="relative w-full h-0 max-xl:pt-[72%] xl:h-full">
          {menus.map((menu, i) => (
            <div
              key={menu.label}
              className={`process-image absolute-full opacity-0 [&.a]:opacity-100 ${i === 0 ? 'a' : ''}`}
            >
              <Placeholder tone={menu.location.tone} label={`${menu.label} image TBD`} />
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-full md:col-span-2 max-md:order-first max-md:mb-52">
        <Subtitle number="04" label="Our menus" as="h2" />
      </div>
      <h3 className="col-span-full md:col-start-7 md:col-end-13 xl:col-start-4 xl:col-end-7 font-normal">
        <div data-piece="content">
          <p>{tbd('Our menus paragraph; menu PDFs')}</p>
        </div>
      </h3>
    </div>
  )
}
