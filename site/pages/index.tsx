import commerce from '@lib/api/commerce';
import { Layout } from '@components/common';
import { ProductCategoryCard, DisplayCard, CustomCard } from '@components/ui/CollectionCard';

import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Link from 'next/link';

import { suspend } from '@components/custom/wrappers';


const Grid = suspend(() => import('@components/ui/Grid'));
const HeroAlt = suspend(() => import('@components/ui/HeroAlt'));


// NOTE: SSG/ISR (`getStaticProps`) is not available on React 18 for now
export async function getServerSideProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales };
  const productsPromise = commerce.getAllProducts({
    variables: { first: 20 },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  });
  const pagesPromise = commerce.getAllPages({ config, preview });
  const siteInfoPromise = commerce.getSiteInfo({ config, preview });
  const { products } = await productsPromise;
  const { pages } = await pagesPromise;
  const { categories, brands } = await siteInfoPromise;

  return {
    props: {
      products,
      categories,
      brands,
      pages,
    },
  };
}

const getDataForDisplayGrid = () => {
  const data: DisplayCard[] = [
    {header: 'The Ethical T', copy: 'Ethically sourced with organic materials.', img: {src: '/assets/display1.avif'}},
    {header: 'Tactlenecks', copy: 'A tactleneck for every occasion.', img: {src: '/assets/display2.avif'}},
    {header: 'Performant Chinos', copy: 'When jeans will not cut it.', img: {src: '/assets/display3.avif'}},
  ];

  return data;
};

const getDataForCategoryGrid = () => {
  const data: ProductCategoryCard[] = [
    {category: 'Tops', subcategory: 'Women\'s', img: {src: '/assets/category1.avif'}, url: '/collections/womens'},
    {category: 'New Arrivals', subcategory: 'Women\'s', img: {src: '/assets/category2.avif'}, url: '/collections/womens'},
    {category: 'Sweaters', subcategory: 'Men\'s', img: {src: '/assets/category3.avif'}, url: '/collections/mens'},
    {category: 'Sweaters', subcategory: 'Women\'s', img: {src: '/assets/category4.avif'}, url: '/collections/womens'},
    {category: 'Jackets', subcategory: 'Men\'s', img: {src: '/assets/category5.avif'}, url: '/collections/mens'},
  ];

  return data;
};

const getDataForCustomGrid = () => {

  const bodyHeaderStyle = { fontSize: '24px', lineHeight: '30px', marginBottom: '30px'};

  const data: CustomCard[] = [
    {body: <div><h1 style={bodyHeaderStyle}>Check out our Environmental impact page to see how we control our carbon footprint.</h1><Link href='/' ><a style={{marginTop: '100px'}}>Learn more</a></Link></div>, img: {src: '/assets/custom1.avif'}},
    {body: <div><h1 style={bodyHeaderStyle}>Ethicalle sourced. Made to Last.</h1><a style={{marginTop: '100px'}}>Learn more</a></div>, img: {src: '/assets/custom2.avif'}},
  ];

  return data;
};

export default function Home({
  products,
}: InferGetStaticPropsType<typeof getServerSideProps>): JSX.Element {
  
  return (
    <>
      <HeroAlt
        headline="Outerwear for every season."
        subheader="Rain or shine, all the same."
        textColor="#FFF"
        buttonText="Shop"
        buttonUrl="/search"
        backgroundImageUrl="/assets/heroBg.avif"
      />


      <Grid 
        header="Welcome Spring, your way."
        type='productCategory' 
        items={getDataForCategoryGrid()} 
        totalItems={5} 
        imageHeightPx='300px' 
        itemsPerGridLine={{  
          'xxl': 6,
          'xl': 5,
          'lg': 4,
          'md': 3,
          'sm': 2,
          'xs': 1
        }}
      />
      
      <Grid 
        type='display' 
        items={getDataForDisplayGrid()}
        totalItems={3}
        imageHeightPx='400px'
        itemsPerGridLine={{  
          'xxl': 3,
          'xl': 3,
          'lg': 3,
          'md': 3,
          'sm': 2,
          'xs': 1
        }}
      />

      <Grid 
        header="This Month's Best Sellers" 
        type='product' 
        items={products} 
        totalItems={5}
        imageHeightPx='350px'
        itemsPerGridLine={{  
          'xxl': 3,
          'xl': 3,
          'lg': 3,
          'md': 3,
          'sm': 3,
          'xs': 2
        }}
      />

      <Grid 
        type='custom' 
        items={getDataForCustomGrid()} 
        totalItems={2} 
        imageHeightPx='500px'
        itemsPerGridLine={{  
          'xxl': 3,
          'xl': 3,
          'lg': 2,
          'md': 2,
          'sm': 2,
          'xs': 1
        }}
      />

    </>
  );
}

Home.Layout = Layout;
