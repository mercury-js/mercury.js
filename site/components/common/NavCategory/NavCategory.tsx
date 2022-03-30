/**
 * Nav category component.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import { FC, useState } from 'react';
import cn from 'clsx';
import Link from 'next/link';
import style from './NavCategory.module.css';
import { Container } from '@components/ui';
import { NavSubcategory, NavSubcategoryProps } from '@components/common/';

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

          { subcats?.map((subcat, i) => {
            return (
              <NavSubcategory
                key={i}
                type={subcat.type}
                subcategoryHeader={subcat.subcategoryHeader}
                links={subcat.links}
                img={subcat.img}
              />
            );
          })}
          
        </div>
      </Container>}
    </div>

  );
};

export default NavCategory;
