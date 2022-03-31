import { getSearchStaticProps } from '@lib/search-props'
import type { GetStaticPropsContext } from 'next'
import Search from '@components/search'

export async function getServerSideProps(context: GetStaticPropsContext) {
  const res = await getSearchStaticProps(context); // @ts-ignore
  delete res.revalidate; // static prop
  return res;
}

// NOTE: for now not available on "experimental" (React 18)
// export function getStaticPaths(): GetStaticPathsResult {
//   return {
//     paths: [],
//     fallback: 'blocking',
//   }
// }

export default Search
