import React, { FC } from 'react'
import { Container } from '@components/ui'
import type { Product } from '@commerce/types/product'
import Image, { ImageProps } from 'next/image'
import Link from 'next/link'
import style from './NavSubcategory.module.css'
import cn from 'clsx'

interface Link {
    href: string
    label: string
    highlighted?: boolean
  }

export interface NavSubcategoryProps {
    type: string
    subcategoryHeader?: string
    links: Link[]
    img?: ImageProps
  }

const NavSubcategory: FC<NavSubcategoryProps> = ({ type, subcategoryHeader, links, img }) => {
    return (
        type === 'links' ?
            <div className={style.sublinkContainerInner}>
                <p className={style.sublinkHeader}>{subcategoryHeader}</p>
                {links.map(link => (
                    <Link href={link.href} key={link.href}>
                        <a className={ cn(style.sublink, link.highlighted ? style.highlighted : '') }>{link.label}</a>
                    </Link>
                ))}
            </div>
        :
        <div className={style.subNavImgContainerOuter}>
            <div className={style.subNavImgContainerInner}>
                <Image
                    quality="85"
                    src={img?.src}
                    alt={img?.alt || 'Navigational Image'}
                    objectFit="cover"
                    layout="fill"
                />
            </div>

                <Link href={links[0].href}>
                    <a className={style.sublink}>{links[0].label}</a>
                </Link>
        </div>
    )
  }
  
  export default NavSubcategory