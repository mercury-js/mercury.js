import { FC } from 'react'
import cn from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { Page } from '@commerce/types/page'
import getSlug from '@lib/get-slug'
import { Github, Mercury } from '@components/icons'
import { Logo, Container } from '@components/ui'
import { I18nWidget } from '@components/common'
import s from './Footer.module.css'

interface Props {
  className?: string
  children?: any
  pages?: Page[]
}

const links = [
  {
    name: 'Home',
    url: '/',
  },
]

const Footer: FC<Props> = ({ className, pages }) => {
  const { sitePages } = usePages(pages)
  const rootClassName = cn(s.root, className)

  return (
    <footer className={rootClassName}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-accent-2 py-12 text-primary bg-primary transition-colors duration-150">
          <div className="col-span-1 lg:col-span-2">
            <Link href="/">
              <a className="flex flex-initial items-center font-bold md:mr-24">
                <span className="mr-2">
                  <Logo />
                </span>
              </a>
            </Link>
          </div>
          <div className="col-span-1 lg:col-span-8">
            <div className="grid md:grid-rows-4 md:grid-cols-3 md:grid-flow-col">
              {[...links, ...sitePages].map((page) => (
                <span key={page.url} className="py-3 md:py-0 md:pb-4">
                  <Link href={page.url!}>
                    <a className="text-accent-9 hover:text-accent-6 transition ease-in-out duration-150">
                      {page.name}
                    </a>
                  </Link>
                </span>
              ))}
            </div>
          </div>
          <div className="col-span-1 lg:col-span-2 flex items-start lg:justify-end text-primary">
            <div className="flex space-x-6 items-center h-10">
              <I18nWidget />
            </div>
          </div>
        </div>
        <div className="pt-6 pb-10 flex flex-col md:flex-row justify-between items-center text-accent-6 text-sm">
          <div className="mb-2 md:mb-0">
            <span>&copy; 2022 ACME, Inc. All rights reserved.</span>
          </div>
          <div className="flex flex-col items-center md:items-end content-center text-primary text-sm">
            <div className="flex mb-2 items-center">
              <span className="text-gray-700 mr-1">Powered by</span>
                <a
                  rel="noopener noreferrer"
                  href="https://github.com/mercury-js/mercury.js"
                  aria-label="Mercury.js Link"
                  target="_blank"
                  className="text-primary"
                >
                  <Mercury
                    className="inline-block h-6 ml-3 text-primary"
                    alt="MercuryJS Logo"
                    width="88px"
                    height="33px"
                  />
                  </a>
            </div>


              <div>
                <a
                  className={s.link}
                  aria-label="Mercury.js Github Repository"
                  href="https://github.com/mercury-js/mercury.js"
                >
                  <Github />
                </a>
              </div>
            
          </div>
        </div>
      </Container>
    </footer>
  )
}

function usePages(pages?: Page[]) {
  const { locale } = useRouter()
  const sitePages: Page[] = []

  if (pages) {
    pages.forEach((page) => {
      const slug = page.url && getSlug(page.url)
      if (!slug) return
      if (locale && !slug.startsWith(`${locale}/`)) return
      sitePages.push(page)
    })
  }

  return {
    sitePages: sitePages.sort(bySortOrder),
  }
}

// Sort pages by the sort order assigned in the BC dashboard
function bySortOrder(a: Page, b: Page) {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0)
}

export default Footer
