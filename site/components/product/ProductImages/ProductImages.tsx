import cn from 'clsx'
import Image from 'next/image'
import style from './ProductImages.module.css'
import { FC, useState } from 'react'
import type { Product } from '@commerce/types/product'
import usePrice from '@framework/product/use-price'
import { WishlistButton } from '@components/wishlist'
import { ProductSlider, ProductCard } from '@components/product'
import { Container, Text } from '@components/ui'
import SIZES from '@components/ui/CollectionCard'
import { SEO } from '@components/common'
import ProductSidebar from '../ProductSidebar'
import ProductTag from '../ProductTag'

interface ProductImagesProps {
  product: Product
}

const ProductImages: FC<ProductImagesProps> = ({ product }) => {
    console.log(product)

    const [mainImageId, setMainImage] = useState(0)

    return (
        <>
            <div className={style.mainImageContainer}>
                <Image 
                    src={product.images[mainImageId].url}
                    width="600px"
                    height="600px"
                    quality="100"
                />
            </div>
            <div className={style.thumbnailImagesContainer}>
                { product.images.map( (image, i) => (
                    <div 
                        className={ cn(style.thumbnailContainer, mainImageId === i ? style.selected : '')}
                        onClick={() => setMainImage(i)}
                    >
                        <Image 
                            src={image.url}
                            width="100px"
                            height="100px"
                            quality="100"
                        />
                    </div>

                ))}
            </div>
        </>

    )
}

export default ProductImages
