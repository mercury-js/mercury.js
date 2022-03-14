import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, useEffect } from 'react'
import type { AppProps } from 'next/app'
import { Head } from '@components/common'
import { ManagedUIContext } from '@components/ui/context'

const Noop: FC = ({ children }) => <>{children}</>

import AppPagePrerenderer from '@components/custom/AppPagePrerenderer'

import ProductSlug from './product/[slug]'
import DesignerCat from './search/designers/[name]'

export default function MyApp({
  Component, pageProps, router
}: AppProps) {
  const Layout = (Component as any).Layout || Noop

  useEffect(() => {
    document.body.classList?.remove('loading')
  }, [])

  return (
    <>
      <Head />
      <ManagedUIContext>
        <Layout pageProps={pageProps}>
          <AppPagePrerenderer
            // TODO: automatic resolving?
            // (with easy-to-understand opt-in)
            // (with glob/fs? hox func name mangling)
            pageComponents={[ // (also import lazily)
              // ... [ <path(-with-slugs)> , <component> ]
              [ '/product/[slug]'          , ProductSlug ],
              [ '/search/designers/[name]' , DesignerCat ],
            ]}

            {...{ // TODO: a more elegant solution?
              router, // NOTE: passed for fresh ref
              Component, pageProps // for fallbacks
            }}
          />
        </Layout>
      </ManagedUIContext>
    </>
  )
}
