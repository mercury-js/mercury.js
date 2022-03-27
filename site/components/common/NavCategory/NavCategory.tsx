import { FC, useState } from 'react'
import cn from 'clsx'
import Link from 'next/link'
import style from './NavCategory.module.css'
import Image, { ImageProps } from 'next/image'
import { Container } from '@components/ui'
import { NavSubcategory, NavSubcategoryProps } from '@components/common/'

interface Link {
  href: string
  label: string
  highlighted?: boolean
}

interface NavCategoryProps {
  mainLink: Link
  subcats?: NavSubcategoryProps[]
}

const NavCategory: FC<NavCategoryProps> = ({ mainLink, subcats }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            <div className={ cn(style.linkContainer, style.bottomPadding, visible ? style.underline : '') }>
                <Link 
                    href={mainLink.href} 
                    key={mainLink.href}
                >
                    <a className={style.mainLink}>{mainLink.label}</a>
                </Link>
            </div>

            {subcats && <Container className={ cn(style.sublinkContainerOuter, visible ? style.visible : style.invisible) }>
                <div className={style.navCatGrid}>

                    { subcats?.map(subcat => {
                        return (
                            <NavSubcategory 
                                type={subcat.type}
                                subcategoryHeader={subcat.subcategoryHeader}
                                links={subcat.links}
                                img={subcat.img}
                            />
                        )
                    })}
                
                </div>
            </Container>}
        </div>


    )
}

export default NavCategory
