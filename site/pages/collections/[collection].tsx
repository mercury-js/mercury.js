/**
 * Collection page component.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import { getSearchStaticProps } from '@lib/search-props';
import type { GetStaticPropsContext } from 'next';
import { Grid, Container, ProductFilters } from '@components/ui';
import { Layout } from '@components/common';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import useSearch from '@framework/product/use-search';

import style from './Collection.module.css';

import { useSearchMeta } from '@lib/search';

import type { Product } from '@commerce/types/product';
import { useFilter } from '@lib/hooks/useFilter';

import type { Router } from 'next/router';
import type { RouterSnapshot } from '@components/custom/helpers';


export async function getServerSideProps(context: GetStaticPropsContext) {
  const props = await getSearchStaticProps(context);

  return { props: props.props };
}


const CollectionPage = ({
  categories, router
}: { categories: any[] } & { router: Router | RouterSnapshot }) => {

  const [productData, setProductData] = useState<Product[]>([]);

  const { asPath, locale } = router;

  const { category } = useSearchMeta(asPath);

  const currentCategory = categories.find((cat: any) => cat.slug === category);

  const { data } = useSearch({
    categoryId: currentCategory?.id,
    locale,
  });

  useEffect(() => {
    // console.log(data?.products)
    setProductData(data?.products as Product[]);
  }, [data]);

  const { filteredProducts, currentFilters, setCurrentFilters } = useFilter(productData);

  return (
    <Container className={style.root}>

      <div className={style.collectionSelectorOuter}>
        <div className={style.collectionSelectorInner}>
          {categories.map(category => {
            return (
              <Link key={category.name} href={`/collections/${category.slug}`}>
                <a className={category?.slug === currentCategory?.slug ? style.selectedCollection : ''}>{category.name}</a>  
              </Link>  
            );
          })}
        </div>
      </div>
      <Container className={style.resultsContainerOuter}>
        <p className={style.collectionHeader}>{currentCategory?.name}</p>
        <div>Found {filteredProducts?.length} results</div>

        <ProductFilters 
          filters={currentFilters}
          setter={setCurrentFilters} 
        />

        <Grid 
          type="product" 
          items={filteredProducts && filteredProducts}
          totalItems={filteredProducts?.length || 0} 
        />
      </Container>

    </Container>

  );
};

CollectionPage.Layout = Layout;

export default CollectionPage;
