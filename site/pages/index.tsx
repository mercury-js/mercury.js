import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'

// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

import { suspend } from '@components/custom/wrappers'

const Grid    = suspend(() => import(`@components/ui/Grid`))
const Hero    = suspend(() => import(`@components/ui/Hero`))
const Marquee = suspend(() => import(`@components/ui/Marquee`))


// NOTE: SSG/ISR (`getStaticProps`) is not available on React 18 for now
export async function getServerSideProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    variables: { first: 6 },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  return {
    props: {
      products,
      categories,
      brands,
      pages,
    },
  }
}

export default function Home({
  products,
}: InferGetStaticPropsType<typeof getServerSideProps>) { return <>
  <Grid variant="filled">
    {products.slice(0, 3).map((product: any, i: number) => (
      <ProductCard
        key={product.id}
        product={product}
        imgProps={{
          width: i === 0 ? 1080 : 540,
          height: i === 0 ? 1080 : 540,
          priority: true,
        }}
      />
    ))}
  </Grid>
  <Marquee variant="secondary">
    {products.slice(0, 3).map((product: any, i: number) => (
      <ProductCard key={product.id} product={product} variant="slim" />
    ))}
  </Marquee>
  <Hero
    headline=" Dessert dragée halvah croissant."
    description="Cupcake ipsum dolor sit amet lemon drops pastry cotton candy. Sweet carrot cake macaroon bonbon croissant fruitcake jujubes macaroon oat cake. Soufflé bonbon caramels jelly beans. Tiramisu sweet roll cheesecake pie carrot cake. "
  />
  <Grid layout="B" variant="filled">
    {products.slice(0, 3).map((product: any, i: number) => (
      <ProductCard
        key={product.id}
        product={product}
        imgProps={{
          width: i === 0 ? 1080 : 540,
          height: i === 0 ? 1080 : 540,
        }}
      />
    ))}
  </Grid>
  <Marquee>
    {products.slice(3).map((product: any, i: number) => (
      <ProductCard key={product.id} product={product} variant="slim" />
    ))}
  </Marquee>
  {/* <HomeAllProductsGrid
    newestProducts={products}
    categories={categories}
    brands={brands}
  /> */}
</>}

Home.Layout = Layout
