import { GridIcon, ListIcon, PlusIcon, ArrowRightIcon } from '@/components/Icons'
import { Placeholder } from '@/components/Placeholder'
import type { Tone } from '@/content/site'

/*
 * Index page on the reference work-index template (Spaces, Shop).
 * Same markup hooks as the reference so lib/pieces/page-works.ts drives it.
 */

export interface IndexTerm {
  id: string
  name: string
}

export interface IndexItem {
  title: string
  href?: string
  terms: string[]
  termLabel: string
  hoverLabel: string
  date: string
  tone: Tone
  span: string
  ratio: string
  list: string[]
}

const pad = (n: number) => String(n).padStart(2, '0')

export function WorksIndex({
  allLabel,
  allTermLabel,
  terms,
  items,
  listColumns,
}: {
  allLabel: string
  allTermLabel: string
  terms: IndexTerm[]
  items: IndexItem[]
  listColumns: string[]
}) {
  const count = (id: string) => (id === '-1' ? items.length : items.filter((i) => i.terms.includes(id)).length)
  const allTerms = [{ id: '-1', name: allLabel }, ...terms]
  const hasFilters = terms.length > 0
  return (
    <div className="works">
      <div data-piece="page-works" className="block">
        <div className="sticky top-0 left-0 w-full h-screen-mobile xl:h-screen px-margin pb-margin flex justify-center items-end pointer-events-none z-widget">
          <div className="widget-works-overlay absolute-full" />
          <div className="widget-works sticky bottom-margin -mb-[calc(4rem_+_var(--margin))] body-16 md:body-14 text-white pointer-events-auto">
            <div className="widget-simple flex items-center pt-11 pb-9 px-12">
              <div className={`flex gap-x-12 items-center ${hasFilters ? 'max-xl:hidden' : ''}`}>
                <div className="widget-left">
                  <div className="widget-works-grid a flex gap-x-6 items-center cursor-pointer opacity-52 [&.a]:opacity-100 xl:hover:opacity-100 transition-opacity duration-normal ease-out">
                    <div className="svg-wrapper w-10 -mt-3">
                      <GridIcon />
                    </div>
                    <div>Grid view</div>
                  </div>
                </div>
                <div className="widget-right">
                  <div className="widget-works-list flex gap-x-6 items-center cursor-pointer opacity-52 [&.a]:opacity-100 xl:hover:opacity-100 transition-opacity duration-normal ease-out">
                    <div className="svg-wrapper w-11 -mt-2">
                      <ListIcon />
                    </div>
                    <div>List view</div>
                  </div>
                </div>
              </div>
              {hasFilters && (
                <div className="widget-filters xl:hidden">
                  <div className="widget-filters-top flex gap-x-16 justify-between items-center">
                    <div className="opacity-52">Filters</div>
                    <div className="flex items-center gap-x-7 overflow-hidden">
                      <div className="widget-filters-terms-active relative flex justify-end">
                        {allTerms.map((t, i) => (
                          <div
                            key={t.id}
                            className={`widget-filters-term-active whitespace-nowrap ${i > 0 ? 'absolute top-0 right-0' : ''}`}
                          >
                            {i === 0 ? allTermLabel : t.name}
                          </div>
                        ))}
                      </div>
                      <div className="widget-icon relative svg-wrapper w-12 text-white -mt-2">
                        <div className="widget-icon-plus">
                          <PlusIcon />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="widget-filters-wrapper h-0 overflow-hidden">
                    <div className="flex flex-col gap-y-8 pt-20">
                      {allTerms.map((t, i) => (
                        <div
                          key={t.id}
                          className={`widget-filters-term ${i === 0 ? 'a' : ''} opacity-52 [&.a]:opacity-100 transition-opacity duration-normal ease-out`}
                          data-id={t.id}
                        >
                          {i === 0 ? allTermLabel : t.name} <sup>({pad(count(t.id))})</sup>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="min-h-screen pt-250 pb-52 xl:pb-130 -mt-screen-mobile xl:-mt-screen">
          <div className="relative grid-w mb-24 md:mb-52 z-1">
            <div className="relative col-span-full md:col-span-9 body-48 lg:body-60 font-display">
              <div className="relative overflow-hidden">
                <div className="works-term-title works-term-highlight overflow-hidden">
                  <h1 className="works-term-title-name inline-block font-normal">{allLabel}</h1>
                  <sup className="inline-flex body-32 overflow-hidden">
                    <span className="works-term-title-bracket-left inline-block">(</span>
                    <span className="works-term-title-number inline-block">{pad(items.length)}</span>
                    <span className="works-term-title-bracket-right inline-block">)</span>
                  </sup>
                </div>
                {terms.map((t) => (
                  <div
                    key={t.id}
                    className="works-term-highlight flex items-end absolute top-0 left-0 h-full max-xl:body-36"
                  >
                    <div>
                      <span className="works-term-active-name">{t.name}</span>
                      <sup className="body-20 xl:body-32">({pad(count(t.id))})</sup>
                    </div>
                  </div>
                ))}
              </div>
              {hasFilters && (
                <div className="works-terms-wrapper absolute top-0 left-0 pointer-events-none max-xl:hidden">
                  <span className="invisible" data-id="-1" aria-hidden="true">
                    <span className="works-term-placeholder" data-name={allLabel}>
                      {allLabel}
                    </span>
                    <sup className="body-32">(00)</sup>
                  </span>
                  {allTerms.map((t, i) => (
                    <span
                      key={t.id}
                      className="works-term-w inline-flex overflow-hidden"
                      style={i === 0 ? { display: 'none' } : undefined}
                    >
                      <span className="works-term inline-block text-mist" data-id={t.id}>
                        <span>/</span>
                        <span className="works-term-inner xl:hover:text-black cursor-pointer">
                          <span className="works-term-name" data-name={t.name}>
                            {t.name}
                          </span>
                          <sup className="body-32">({pad(count(t.id))})</sup>
                        </span>
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {hasFilters && (
              <div className="col-span-3 flex justify-end text-mist body-60 font-display -mr-margin pr-margin overflow-hidden max-xl:hidden">
                <div className="works-filter-button flex cursor-pointer">
                  <div className="relative overflow-hidden">
                    <div className="works-filter-open">Filters</div>
                    <div className="works-filter-close absolute top-0 left-0">Close</div>
                  </div>
                  <div className="works-filter-icon flex-center w-78 pl-16">
                    <div className="works-filter-plus svg-wrapper w-40 text-black">
                      <PlusIcon />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="works-wrapper">
            <div className="works-grid-wrapper">
              <div className="works-grid grid-w gap-y-32 md:gap-y-68">
                {items.map((item) => {
                  const Tag = item.href ? 'a' : 'div'
                  return (
                    <div key={item.title} className={`col-span-full ${item.span}`}>
                      <Tag
                        {...(item.href ? { href: item.href } : {})}
                        className="card-work group/card-work flex flex-col gap-y-16"
                        data-terms={item.terms.join(',')}
                      >
                        <div
                          className="group relative w-full h-0 pt-[var(--ratio)] overflow-hidden"
                          style={{ '--ratio': item.ratio } as React.CSSProperties}
                        >
                          <div className="absolute-full scale-105 xl:group-hover:scale-100 transition-transform duration-smooth ease-out">
                            <Placeholder tone={item.tone} label={`${item.title} photography TBD`} />
                          </div>
                          <div data-piece="follow-mouse" className="group absolute-full max-xl:hidden">
                            <div className="absolute-full bg-black opacity-0 xl:group-hover:opacity-24 transition-opacity duration-smooth ease-out" />
                            <div className="follow-mouse-el absolute top-0 left-0 flex flex-col gap-y-10">
                              <div className="follow-mouse-image relative w-125 h-0 pt-[121%] overflow-hidden">
                                <div className="follow-mouse-image-inner absolute-full">
                                  {(['almond', 'rustic', 'harvest'] as Tone[]).map((tone, i) => (
                                    <div key={tone} className={`follow-mouse-img absolute-full ${i ? 'opacity-0' : ''}`}>
                                      <Placeholder tone={tone} label="TBD" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-x-gutter">
                          <h2 className="flex-1 font-normal">{item.title}</h2>
                          <div className="basis-col-3 md:basis-col-2 flex gap-x-gutter justify-between text-mist overflow-hidden">
                            <div className="card-work-term relative xl:group-hover/card-work:-translate-y-full transition-transform duration-smooth ease-out">
                              <span>{item.termLabel}</span>
                              <span className="block absolute top-full left-0 whitespace-nowrap">{item.hoverLabel}</span>
                            </div>
                            <div className="card-work-date relative xl:group-hover/card-work:-translate-y-full xl:group-hover/card-work:delay-75 delay-0 transition-transform duration-smooth ease-out">
                              <span>{item.date}</span>
                              <div className="svg-wrapper absolute top-full right-0 w-15 h-full flex items-center">
                                <ArrowRightIcon />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tag>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="works-list opacity-0 invisible hidden">
              <div className="w-full px-margin">
                <div className="grid grid-cols-12 gap-x-gutter pb-20 border-b-px border-mist mb-15">
                  {listColumns.map((c, i) => (
                    <div
                      key={c}
                      className={
                        i === listColumns.length - 1
                          ? 'col-span-1 flex justify-end whitespace-nowrap'
                          : i === listColumns.length - 2
                            ? 'col-span-2'
                            : 'col-span-3'
                      }
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </div>
              {items.map((item) => {
                const Tag = item.href ? 'a' : 'div'
                return (
                  <Tag
                    key={item.title}
                    {...(item.href ? { href: item.href } : {})}
                    className="list-works-item group relative block w-full [&.disabled]:text-mist xl:hover:bg-black xl:hover:text-white"
                    data-terms={item.terms.join(',')}
                  >
                    <div className="grid-w pt-8 pb-5">
                      {item.list.map((v, i) => (
                        <div
                          key={i}
                          className={
                            i === item.list.length - 1
                              ? 'col-span-1 flex justify-end whitespace-nowrap'
                              : i === item.list.length - 2
                                ? 'col-span-2 -mr-30'
                                : 'col-span-3'
                          }
                        >
                          {v}
                        </div>
                      ))}
                    </div>
                    <div className="absolute top-1/2 left-0 w-full grid-w -translate-y-1/2 opacity-0 xl:group-hover:opacity-100 pointer-events-none z-1 max-xl:hidden">
                      <div className="col-start-8 col-end-10">
                        <div className="relative w-full h-0 pt-[125%]">
                          <div className="absolute-full">
                            <Placeholder tone={item.tone} label="TBD" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tag>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
