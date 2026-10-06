import { Footer } from '@/components/Footer'
import { tbd } from '@/content/site'

/* Plain content page for legal text (copy TBD). */
export function Legal({ title }: { title: string }) {
  return (
    <>
      <div className="legal relative grid-w pt-250 pb-150 min-h-screen-mobile xl:min-h-screen">
        <div data-piece="title" className="block col-span-full md:col-span-9 mb-52 md:mb-100">
          <h1 className="body-48 md:body-60 font-display font-normal">{title}</h1>
        </div>
        <div data-piece="content" className="col-span-full md:col-start-7 md:col-end-13 wysiwyg body-20">
          <p>{tbd(`${title} text`)}</p>
        </div>
      </div>
      <Footer />
    </>
  )
}
