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
    {header: 'The Ethical T', copy: 'Ethically sourced with organic materials.', img: {src: '/assets/display1.jpg'}},
    {header: 'Tactlenecks', copy: 'A tactleneck for every occasion.', img: {src: '/assets/display2.jpg'}},
    {header: 'Performant Chinos', copy: 'When jeans will not cut it.', img: {src: '/assets/display3.jpg'}},
  ];

  return data;
};

const getDataForCategoryGrid = () => {
  const data: ProductCategoryCard[] = [
    {category: 'Tops', subcategory: 'Women\'s', img: {src: '/assets/category1.jpg'}, url: '/collections/womens'},
    {category: 'New Arrivals', subcategory: 'Women\'s', img: {src: '/assets/category2.jpg'}, url: '/collections/womens'},
    {category: 'Sweaters', subcategory: 'Men\'s', img: {src: '/assets/category3.jpg'}, url: '/collections/mens'},
    {category: 'Sweaters', subcategory: 'Women\'s', img: {src: '/assets/category4.jpg'}, url: '/collections/womens'},
    {category: 'Jackets', subcategory: 'Men\'s', img: {src: '/assets/category5.jpg'}, url: '/collections/mens'},
  ];

  return data;
};

const getDataForCustomGrid = () => {

  const bodyHeaderStyle = { fontSize: '24px', lineHeight: '30px', marginBottom: '30px'};

  const data: CustomCard[] = [
    {body: <div><h1 style={bodyHeaderStyle}>Check out our Environmental impact page to see how we control our carbon footprint.</h1><Link href='/' ><a style={{marginTop: '100px'}}>Learn more</a></Link></div>, img: {src: '/assets/custom1.jpg'}},
    {body: <div><h1 style={bodyHeaderStyle}>Ethically sourced. Made to Last.</h1><a style={{marginTop: '100px'}}>Learn more</a></div>, img: {src: '/assets/custom2.jpg'}},
  ];

  return data;
};


const IMG_PROPS = {
  loading: 'lazy'
};

const GRID_PROPS = {
  imageProps: IMG_PROPS,
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
        backgroundImageUrl="/assets/heroBg.jpg"
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
        {...GRID_PROPS}
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
        {...GRID_PROPS}
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
        {...GRID_PROPS}
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
        {...GRID_PROPS}
      />

    </>
  );
}

Home.Layout = Layout;
