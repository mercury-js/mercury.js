import '@assets/main.css'
import '@assets/chrome-bug.css'
import 'keen-slider/keen-slider.min.css'

import { FC, useEffect, lazy } from 'react'
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
            pageComponents={[
              '/product/[slug]',
              '/search/designers/[name]'
            ].map(pagePath => (
              // NOTE:
              // - lazy for a smaller JS bundle on initial load
              // - webpack wants a template string and a "hint" for
              //   a dynamic import (file extension does the trick here)
              [ pagePath, lazy(() => import(`.${pagePath}.tsx`)) ]
            ))}

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
