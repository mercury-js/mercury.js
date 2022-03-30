/**
 * Product images component.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import cn from 'clsx';
import Image from 'next/image';
import style from './ProductImages.module.css';
import { FC, useState } from 'react';
import type { Product } from '@commerce/types/product';

interface ProductImagesProps {
  product: Product;
}

const ProductImages: FC<ProductImagesProps> = ({ product }) => {

  const [mainImageId, setMainImage] = useState(0);

  return (
    <>
      <div className={style.mainImageContainer}>
        <Image 
          src={product.images[mainImageId].url}
          alt="Product image"
          width="600px"
          height="600px"
          quality="100"
        />
      </div>
      <div className={style.thumbnailImagesContainer}>
        { product.images.map( (image, i) => (
          <div 
            key={i}
            className={ cn(style.thumbnailContainer, mainImageId === i ? style.selected : '')}
            onClick={() => setMainImage(i)}
          >
            <Image 
              src={image.url}
              alt="Thumbnail product image"
              width="100px"
              height="100px"
              quality="100"
            />
          </div>

        ))}
      </div>
    </>

  );
};

export default ProductImages;
