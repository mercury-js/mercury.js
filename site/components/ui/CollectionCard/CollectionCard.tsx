import React, { FC } from 'react'
import { Container } from '@components/ui'
import { ArrowRight } from '@components/icons'
import type { Product } from '@commerce/types/product'
import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import style from './CollectionCard.module.css'

const placeholderImg = '/product-img-placeholder.svg'

export const SIZES = {
    'XXS': 'XXS',
    'Extra Small': 'XS',
    'Small': 'S',
    'Medium': 'M',
    'Large': 'L',
    'Extra Large': 'XL',
    '2XL': '2XL',
    '3XL': '3XL',
}

export interface ProductCategoryCard {
    category?: string
    subcategory?: string
    img?: ImageProps
    url?: string
}

export interface DisplayCard {
    header?: string
    copy?: string
    img?: ImageProps
    url?: string
}

export interface CustomCard {
    body?: any
    img?: ImageProps
    url?: string
}

export interface ProductCard extends Product {
    //
}

interface CollectionCardProps {
    type: 'product' | 'productCategory' | 'display' | 'custom'
    item: ProductCard | ProductCategoryCard | DisplayCard | CustomCard
    imageHeight: string
  }

  const IMG_SIZES = {
    'xxl': '450px',
    'xl': '350px',
    'lg': '300px',
    'md': '250px',
    'sm': '220px',
    'xs': '200px'
  }

const CollectionCard: FC<CollectionCardProps> = ({ 
    type,
    item,
    imageHeight,
}) => {

    let classes = `relative w-full h-[100px]`

    for (const [size, value] of Object.entries(IMG_SIZES)) {
        classes = classes.concat(` ${size}:h-[${value}]`)
      }

    return (
        <div>
            {type === 'product' && (
                <>
                    <Link href={`/product${item.path}`} passHref={true}>
                        <a>
                            <div 
                                className={style.imgContainer}
                                style={{height: imageHeight}}
                            >
                                
                                    <Image
                                        src={(item as ProductCard).images[0].url || placeholderImg}
                                        alt={(item as ProductCard)?.name || 'Product Image'}
                                        layout="fill"
                                        objectFit="cover"
                                    />

                            </div>
                            <div className={style.priceContainer}>
                                <p className={style.productName}>{(item as ProductCard)?.name}</p>
                                <p className={style.productPrice}>{(item as ProductCard)?.price.currencyCode}{(item as ProductCard)?.price.value}</p>
                            </div>
                        </a>

                    </Link>

                    <div className={style.optionsContainer}>
                        { (item as Product).options.map(option => {
                            // Retrieve 'color' and 'size' from a global object
                            if (option.displayName === 'color') {
                                return (
                                    <div className={style.optionContainer}>
                                        { option.values.map(value => <div className={style.colorAlternative} style={{backgroundColor: value.hexColors[0]}}/>) }
                                    </div>
                                )
                                
                            }

                            if (option.displayName === 'size') {
                                return (
                                    <div className={style.optionContainer}>
                                        { option.values.map(value => <div className={style.sizeAlternative}>{SIZES[value.label]}</div>) }
                                    </div>
                                )
                                
                                
                            }
                        })}
                    </div>

                </>

            )}

            {type === 'productCategory' && (
                <>
                    <Link href={item.url} passHref={true}>
                        <a>
                            <div 
                                className={style.imgContainer}
                                style={{height: imageHeight}}
                            >
                                <Image
                                    src={item.img.src || placeholderImg}
                                    alt={`${item.category} category image`}
                                    layout="fill"
                                    objectFit="cover"
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


            {type === 'display' && (
                <>
                    <div 
                        className={style.imgContainer}
                        style={{height: imageHeight}}    
                    >
                        <Image
                            quality="85"
                            src={item.img.src || placeholderImg}
                            alt={`${item.header} image`}
                            objectFit="cover"
                            layout="fill"
                        />
                    </div>

                    <p className={style.displayHeader}>{item.header}</p>
                    <p className={style.displayCopy}>{item.copy}</p>

                </>
            )}

            {type === 'custom' && (
                <>
                    <div 
                        className={style.imgContainer}
                        style={{height: imageHeight}}    
                    >
                        <Image
                            quality="85"
                            src={item.img.src || placeholderImg}
                            alt={`${item.header} image`}
                            objectFit="cover"
                            layout="fill"
                        />

                    </div>

                    <div className={style.customBody}>{item.body}</div>
                </>
            )}

        </div>


        
    )
  }
  
  export default CollectionCard