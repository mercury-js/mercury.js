/**
 * React/Next.js (component) specific custom helpers.
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import { memo, useEffect } from 'react';

import type { MutableRefObject } from 'react';
import type { Router } from 'next/router';
import type {
  NextPageContext,
  NextComponentType,
} from 'next';

import {
  getQuery,
  isClient,
  escapeRegExp,
} from '@lib/custom/helpers';

/* TODO:
 - more docs necessary?
 - delete unused and/or ensure exhaustive
   tree-shaking by bundler
*/

/* Next */

const { // NOTE: client only & static (vs. `useRouter`)
  locales: LOCALES = [],
  buildId: BUILD_ID = '',
  defaultLocale: DEFAULT_LOCALE = ''
} = isClient() && window.__NEXT_DATA__ as any;

// NOTE: handles path to
// non-current locale too
const REGEXP_LOCALE = new RegExp(
  `^/(${LOCALES.map(escapeRegExp).join('|')})/`
); // NOTE: compile once since is static
const dropLocale: (path: string) => string = LOCALES.length
  ? path => path.replace(REGEXP_LOCALE, '/')
  : path => path;


// TODO: spin-off interface/type file?

type RouterSnapshot = {
  asPath: string;
  query: Record<string, string>;
} & Partial<Router>;

type NextPage = NextComponentType<NextPageContext, {}, any>;

type PageData = Record<string, {
  data?: (
    Object & // (pageProps)
    Partial<RouterSnapshot>
  ); 
  meta?: {};
}>

interface PageDataFetcher { (
  path: string,
  router: Router,
  pageDataRef: MutableRefObject<PageData>
): void | Promise<void> }


/**
 * Produces a static artificial "`Router`", to persist a
 * snapshot of the stateful router.
 * 
 * @param asPath - Path without slugs
 * @param router - Optional router, which will be spread
 *     in the return value (note: not cloned & so nested
 *     objects, if any, are assigned by (stateful) ref.)
 * @param custom - Optional additional properties to add
 *     (note: take highest precedence)
 */
const asRouter = (
  asPath: string,
  router: Router|{} = {},
  custom: {} = {},
): RouterSnapshot => ({
  ...router, asPath,
  query: getQuery(asPath),
  ...custom,
});


/* NOTE: vs.
 - `router.prefetch` (Next.js)
   - no prioritization by browser
     (resource hint heuristics)
   - can simply cache page data in
     component state for easy access
   - link prefetching by the router
     (if not disabled) would still
     offer the resources to fetches
     (if the URL and "as" match, as
     they should; whereas ServiceWorker
     caches live in separate context)
*/
/* TODO:
 - more SOC? (or, rethink altogether)
 - `router.basePath` support?
*/
/**
 * Default page data fetcher.
 * @see AppPagePrerenderer
 */
const getPageData: PageDataFetcher = async (
  path,
  router,
  pageDataRef,
  persistRouter=true,
) => {
  /* NOTE: (assumptionated) locale handling
   - save page data without locale (conform
     to `router.asPath`) in prop name
   - add locale to endpoint path (right API)
   - (`AppPagePrerenderer` drops data on locale
     change by default)
  */
  path = dropLocale(path);
  // TODO: need to handle query (search & slugs)? (`useRouter` has them)
  const apiPath = `/_next/data/${BUILD_ID}/${router.locale}${path}.json`;
  if (path in pageDataRef.current) return; // NOTE: static

  // TODO: make use of, too?
  // NOTE: prevents multiple (async) requests to same endpoint
  pageDataRef.current[path] = { meta: { time: new Date(), } };

  const resp = await fetch(apiPath);
  const { pageProps } = await resp.json();

  if (persistRouter)
    // NOTE: workaround for pages that used to use `useRouter`
    pageProps.router = asRouter(path, undefined, {
      locale: router.locale,
    });

  pageDataRef.current[path].data = pageProps;
  // return pageProps; // why not
};


/* React */

const propMemo = (propName: string, Component: Function) => memo( //@ts-ignore
  Component, (curr, next) => (curr[propName] === next[propName])
);
const properMemo = (propName: string) => propMemo.bind(null, propName);

const setStateKey = (setter: Function, key: any, val: any, freeze=true) => setter(
  (prev: Object) => (freeze && key in prev) ? prev : ({ ...prev, [key]: val, })
);

// TODO: remove? is component too
// @ts-ignore // for SOC (ad hoc)
const ContextHoister = ({set,use}) => {
  const value = use(); // eslint-disable-next-line
  useEffect(()=>{set(value)},[set,value]);
  return null;
};

export {
  asRouter,
  propMemo,
  dropLocale,
  properMemo,
  getPageData,
  setStateKey,
};

export type {
  Router,
  NextPage,
  PageData,
  RouterSnapshot,
  PageDataFetcher,
};
