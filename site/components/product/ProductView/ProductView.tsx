import cn from 'clsx'
import s from './ProductView.module.css'
import { FC, Suspense, lazy } from 'react'
import type { Product } from '@commerce/types/product'
import usePrice from '@framework/product/use-price'
import { WishlistButton } from '@components/wishlist'
import { ProductImages } from '@components/product'
import { Container, Grid } from '@components/ui'
import { SEO } from '@components/common'
import { suspend } from '@components/custom/wrappers';
interface ProductViewProps {
  product: Product
  relatedProducts: Product[]
}


const ProductSidebar = suspend(() => import('../ProductSidebar'));

const ProductView: FC<ProductViewProps> = ({ product, relatedProducts }) => {
  const { price } = usePrice({
    amount: product.price.value,
    baseAmount: product.price.retailPrice,
    currencyCode: product.price.currencyCode!,
  })

  return (
    <>
      <Container className="max-w-none w-full" clean>
        <div className={cn(s.root, 'fit')}>
          <div className={cn(s.main, 'fit')}>

            <div>
              <ProductImages product={product}/>
            </div>
            {process.env.COMMERCE_WISHLIST_ENABLED && (
              <WishlistButton
                className={s.wishlistButton}
                productId={product.id}
                variant={product.variants[0]}
              />
            )}
          </div>
          <ProductSidebar
            key={product.id}
            product={product}
            className={s.sidebar}
          />
        </div>
        <hr className="mt-7 border-accent-2" />
        <div className="py-12 px-6 mb-10">
          <Grid
            header="Others also wieved"
            items={relatedProducts}
            type='product'
            imageHeightPx="400px"
            totalItems={3}
            itemsPerGridLine={{
              'xxl': 6,
              'xl': 6,
              'lg': 3,
              'md': 3,
              'sm': 2,
              'xs': 1
            }}
          />
        </div>

        <hr className="mt-7 border-accent-2" />
        <div className="py-12 px-6 mb-10">
          <Grid
            header="You might also be interested in"
            items={relatedProducts}
            type='product'
            imageHeightPx="400px"
            totalItems={3}
            itemsPerGridLine={{
              'xxl': 6,
              'xl': 6,
              'lg': 3,
              'md': 3,
              'sm': 2,
              'xs': 1
            }}
          />
        </div>

      </Container>
      <SEO
        title={product.name}
        description={product.description}
        openGraph={{
          type: 'website',
          title: product.name,
          description: product.description,
          images: [
            {
              url: product.images[0]?.url!,
              width: '800',
              height: '600',
              alt: product.name,
            },
          ],
        }}
      />
    </>
  )
}

export default ProductView
