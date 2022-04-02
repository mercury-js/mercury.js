/**
 * Collection card component.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import React, { FC, useCallback } from 'react';
import { ArrowRight } from '@components/icons';
import type { Product } from '@commerce/types/product';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import style from './CollectionCard.module.css';

const placeholderImg = '/product-img-placeholder.svg';

export const SIZES = {
  'XXS': 'XXS',
  'Extra Small': 'XS',
  'Small': 'S',
  'Medium': 'M',
  'Large': 'L',
  'Extra Large': 'XL',
  '2XL': '2XL',
  '3XL': '3XL',
};

export type SizeProp = keyof typeof SIZES;


export interface ProductCategoryCard {
  category?: string;
  subcategory?: string;
  img?: ImageProps;
  url?: string;
};

export interface DisplayCard {
  header?: string;
  copy?: string;
  img?: ImageProps;
  url?: string;
};

export interface CustomCard {
  body?: any;
  img?: ImageProps;
  url?: string;
  header?: string;
};

export interface ProductCard extends Product {
    //
};

type CardType = 'product'   | 'productCategory'   | 'display'   | 'custom';
type CardItem = ProductCard | ProductCategoryCard | DisplayCard | CustomCard;


interface CollectionCardProps {
    type: CardType;
    item: CardItem;
    imageHeight: string;
    imageProps?: ImageProps;
};

// TODO: infer from `item` props, if will distinguish?
const itemIs = <IT,>(item: CardItem, t1: CardType, t2: CardType): item is IT => t1 === t2;


const IMG_SIZES = {
  'xxl': '450px',
  'xl': '350px',
  'lg': '300px',
  'md': '250px',
  'sm': '220px',
  'xs': '200px'
};

const IMG_PROPS: Partial<ImageProps> = {
  objectFit: 'cover',
  loading: 'eager', // TODO: above-the-fold
  layout: 'fill',
};

/* eslint-disable-next-line jsx-a11y/alt-text */// @ts-ignore
const DRYImage = (props: ImageProps) => <Image {...IMG_PROPS} {...props}
  src={props.src || placeholderImg}
/>;

const CollectionCard: FC<CollectionCardProps> = ({ 
  type,
  item,
  imageHeight,
  imageProps={},
}) => {

  const _DRYImage = useCallback(
    props => <DRYImage {...imageProps} {...props} />,
    [imageProps]
  );

  let classes = 'relative w-full h-[100px]';

  for (const [size, value] of Object.entries(IMG_SIZES)) {
    classes = classes.concat(` ${size}:h-[${value}]`);
  }

  return (
    <div>
      {itemIs<ProductCard>(item, type, 'product') && (
        <>
          <Link href={`/product${(item).path}`} passHref={true}>
            <a>
              <div 
                className={style.imgContainer}
                style={{height: imageHeight}}
              >
                                
                <_DRYImage
                  src={(item).images[0].url}
                  alt={(item)?.name || 'Product Image'}
                />

              </div>
              <div className={style.priceContainer}>
                <p className={style.productName}>{item?.name}</p>
                <p className={style.productPrice}>{item?.price.currencyCode}{item?.price.value}</p>
              </div>
            </a>

          </Link>

          <div className={style.optionsContainer}>
            { item.options.map((option, i) => {
              // Retrieve 'color' and 'size' from a global object
              if (option.displayName === 'color') {
                return (
                  <div key={i} className={style.optionContainer}>
                    { option.values.map((value, j) => <div key={j} className={style.colorAlternative} style={{backgroundColor: (value.hexColors || [])[0]}}/>) }
                  </div>
                );
                                
              }

              if (option.displayName === 'size') {
                return (
                  <div key={i} className={style.optionContainer}>
                    { option.values.map((value, j) => <div key={j} className={style.sizeAlternative}>{SIZES[value.label as SizeProp]}</div>) }
                  </div>
                );
                                
                                
              }
            })}
          </div>

        </>

      )}

      {itemIs<ProductCategoryCard>(item, type, 'productCategory') && (
        <>
          <Link href={item.url!} passHref={true}>
            <a>
              <div 
                className={style.imgContainer}
                style={{height: imageHeight}}
              >
                <_DRYImage
                  src={item.img!.src}
                  alt={`${item.category} category image`}
                />
              </div>

              <div className={style.productCategoryCopyContainer}>
                <p className={style.subcategory}>{item?.subcategory}</p>
                <div className={style.mainCategoryContainer}>
                  <p className={style.category}>{item?.category}</p>
                  <ArrowRight />
                </div>
              </div>

            </a>
          </Link>

        </>
      )}


      {itemIs<DisplayCard>(item, type, 'display') && (
        <>
          <div 
            className={style.imgContainer}
            style={{height: imageHeight}}    
          >
            <_DRYImage
              quality="85"
              src={item.img!.src}
              alt={`${item.header} image`}

            />
          </div>

          <p className={style.displayHeader}>{item.header}</p>
          <p className={style.displayCopy}>{item.copy}</p>

        </>
      )}

      {itemIs<CustomCard>(item, type, 'custom') && (
        <>
          <div 
            className={style.imgContainer}
            style={{height: imageHeight}}    
          >
            <_DRYImage
              quality="85"
              src={item.img!.src}
              alt={`${item.header} image`}
            />

          </div>

          <div className={style.customBody}>{item.body}</div>
        </>
      )}

    </div>


        
  );
};
  
export default CollectionCard;
