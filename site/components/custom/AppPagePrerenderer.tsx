/**
 * Custom app page component prerendering (client-side).
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import {
  memo,
  useRef,
  Suspense,
  useState,
  useEffect,
  useReducer,
  useCallback,
  // @ts-ignore (commented out / not declared)
  startTransition, useTransition, useDeferredValue, 
} from 'react';

import {
  useReRenderEffect,
  useIsomorphicLayoutEffect,
} from './hooks';

import { isOnTouchable } from '@lib/custom/device-detection';
import { trackLinksClosestToMouse } from '@lib/custom/mouse-heuristics';

import type {
  Router,
  NextPage,
  PageData,
  PageDataFetcher,
} from './helpers';
import { getPageData, dropLocale } from './helpers';

import {
  toArr,
  hrefToPath,
  addOnVisible,
  applyToNodes,
  getInboundAElemPath,
} from '@lib/custom/helpers';


/* TODO:
 - component-level prerendering for dynamic ("detached") content
   components (using Slot approach of earlier lib-react), e.g. reco
 - (maturely) optimize perf
 - extend functionality
 - others surely
*/


/* NOTE:on notation terminology
 - "page": pathname with slugs
 - "path": pathname without slugs
*/
/**
 * Intercepts Next.js app page navigation by revealing
 * DOM elements prerendered on the client-side instead
 * of rendering the components on-the-fly, for instant
 * page transitions.
 * 
 * The pages are prerendered in the user's browser and
 * initially hidden from view. Decisions on what pages
 * to prerender are based on pointer movement heuristics
 * (for now, todos below). Data (props) for said pages
 * is prefetched for all inbound links which enter the
 * user viewport.
 * 
 * To reap the most benefit from this, the pages to be
 * prerendered would contain client-side data fetching
 * logic or (relatively) heavy computation / hydration
 * (note that the UX effects are minimized with React 18
 * Concurrent Features and memoization).
 * 
 * @note
 * - To be used inside a custom `App`
 * - Each page ought to use `getServerSideProps` (check out Next.js docs;
 *   with React 18 Static Site Generation's not supported **for now**)
 * 
 * @example
 * // see `./pages/_app.js`
 * 
 * @todo
 * - sophisticated mouse movevement heuristics
 *   for prerendering decision-making, or ML
 */
export default function AppPagePrerenderer({
  pageComponents: _pageComponents=[],
  // TODO: `useRouter`? (`router` is "there", though)
  router, // NOTE: is fresh ("free ref" to listeners)
  // NOTE: for fallback (incl. non-opt-in components)
  Component: CurrentComponent,
  pageProps: currentPageProps,
  // TODO: override per page (with `pageComponents`)?
  nMaxPrerender=8,
  resetDataOnLocaleChange=true,
  resizeOnPathChange=true,
  pageDataFetcher=getPageData,
}: {
  /**
   * Page paths (incl. slugs) to (page) components
   * to **opt-in** to the client-side prerendering.
   * @example [ [ '/product/[slug]', ProductSlug ], ]
   * @note
   * - supports lazily (dynamically) imported components
   * - see also above notes on component description
   */
  pageComponents: Array<[ string, NextPage ]>;
  /**
   * Next.js router. Available in custom `App`
   * (or with `useRouter`).
   */
  router: Router;
  /**
   * Current component, received as prop by custom
   * `App`. Needed as fallback if a page navigated
   * to has not been prerendered.
   */
  Component: NextPage;
  /** Current page props (rest as on `Component`). */
  pageProps: Object;
  /**
   * Max. number of page components to have
   * prerendered at any given time. Default
   * is 8.
   */
  nMaxPrerender?: number;
  /**
   * Fire a (no-op) "resize" `Event` on `window` when
   * the current path changes (a navigation happens).
   * Namely useful to ensure that responsive (image)
   * containers are resized before the repaint.
   * Default is `true`.
   */
  resizeOnPathChange?: boolean;
  /**
   * Reset the data (props) prefetched for page prendering
   * when the locale is changed. Will ensure that the user
   * sees locale-appropriate data on pages which have been
   * prerendered. Default is `true`.
   */
  resetDataOnLocaleChange?: boolean;
  /**
   * Handles page data (props) prefetching and storage.
   *
   * Is passed:
   * - each (page) path (slugs replaced with the appropriate
   *   values and excluding locale) for which the data should
   *   be prefetched (for now this means that the link entered
   *   the viewport) and stored
   * - the `Router` (stateful)
   * - the currently stored page data (ref)
   * 
   * Resposible for (handled by the default argument):
   * - fetching the data (incl. mutating the path for API)
   * - storing  the data (in the `current` property of the
   *   current page data)(incl. any meta data which it can
   *   then use on subsequent prefetches, for some reason)
   *   - note that the path used as key to the `data` prop
   *     must match the paths of inbound links **without**
   *     locale prepended
   * - (preventing the extraneous fetching of the data for
   *   any given page multiple times simultaneously, which
   *   can happen as fetching is async, and the status of
   *   any given page is determined by the ab/presence of
   *   the page's path in the current page data object by
   *   this component.
   * - (persisting the router (in the stored props data),
   *   to conform to pages that `useRouter` which exposes
   *   the stateful router, and so mutates on navigation)
   * 
   * @see getPageData - the default
   * @note the types live next to the default helper
   *     (same file)
   */
  pageDataFetcher?: PageDataFetcher;
}) {

  const [pageComponents] = useState<Record<string, NextPage>>(Object
    .fromEntries(_pageComponents.map(([ page, Component ]) => [
      page.replaceAll(/\[.*?\]/g, '.*?'), // to match paths w/ slugs
      memo(Component), // to prevent excess rendering of prerendered
    ]))
  );

  const asPage = useCallback(path => Object
    .keys(pageComponents)
    .find(page => path.match(page)),
  [pageComponents]);

  
  // NOTE: need by ref for listener(s)
  const fetchedPathProps = useRef<PageData>({});

  // TODO: outline? (think SOC & mutability, if needs other states)
  const [prerenderedPaths, dispatchPrerenderedPaths] = useReducer((
    state: Array<string>,
    action:
      // TODO: others (+ better replacement logic)?
      { type: 'add'; payload: { paths: string | string[] }; } |
      { type: 'clear' }
  ): Array<string> => {
    switch (action.type) {
      case 'add': {
        const { payload: { paths } } = action;
        const newState = [...state]; // copy
        toArr(paths).forEach(path => {
          if (newState.includes(path))
            return; // already prerendered
          // TODO: smarter replacement logic?
          if (newState.length >= nMaxPrerender) {
            const replaceAt = newState.findIndex(
              path => (path !== router.asPath)
            ); // any path but current one
            newState.splice(replaceAt, 1);
          } // always append for fresh
          newState.push(path);
        });
        return newState;
      };
      case 'clear':
        return [];
      default:
        throw new Error('unknown action type');
    }
  }, []);


  // TODO: `useDeferredValue` instead?
  // NOTE: do not use this hook in production, since it comes with
  // additional overhead (vs. separate function `startTransition`)
  // and `isPending` indicator is not needed (for background work)
  // const [isPending, startTransition] = useTransition();

  const prerenderPathsNonUrgently = useCallback((
    paths: string | string[]
  ) => startTransition(() => {
    // NOTE: reducer ensures that
    // current path is not replaced
    dispatchPrerenderedPaths({
      type: 'add',
      payload: { paths }
    });
  }), []);

  useEffect(() => {

    applyToNodes(aElem => { // @ts-ignore
      let path = getInboundAElemPath(aElem) as string;
      if (!path) return;
      path = dropLocale(path);
      const page = asPage(path);
      if (!(page)) return; // no shell
      
      // @ts-ignore
      // prefetch page props for a
      // link that enters viewport
      addOnVisible(aElem, () => {
        pageDataFetcher(
          // NOTE: `router` by reference,
          // (`fetchedPathProps` as well)
          path, router, fetchedPathProps,
        );
      });

      // TODO: (pointer) heuristic (smart too)
      // have page props injected to component
      aElem.addEventListener(
        'pointerover',
        () => prerenderPathsNonUrgently(path)
      );
    }, 'A'); // eslint-disable-next-line
    
  }, []);

  /* TODO: ?
   - rethink logic
   - limit prerendered paths by page ("shell" idea)
     - note: trade-off between prerendering "too many"
       (**memoized**) page components vs. rerendering on
       shell prop changes (redo some work, but keep DOM cleaner)
   - queue path addition (delay between)
     - note: non-urgent rendering, so no problem?
   - parameterize (props) hard-coded arguments below
    - enabling
    - intervalMs
    - n closest (by path)
    - etc
   - optimize
  */
  useEffect(() => { // prerendering based on mouse heuristics
    if (isOnTouchable()) return;
    trackLinksClosestToMouse(grouped => {
      const newPaths = [] as string[];
      Object.values(grouped).forEach(pageAElems => {
        // TODO: filter currently hovered links?
        pageAElems.slice(0, 2).forEach(aElem => {
          const path = hrefToPath(aElem.href);
          // TODO: only check once (also checked in JSX)
          // NOTE: fallback condition disallows pushing non-prerenderable
          if (!asPage(path)) return;
          newPaths.push(path);
        });
      });
      prerenderPathsNonUrgently(newPaths);
    }, 1000);
  }, []);


  // NOTE:
  // - resizes responsive (image)
  //   containers before repaints
  // - isomorphic just to supress
  //   warning (doesn't mismatch)
  //   (nor runs for SSR, anyway)
  useIsomorphicLayoutEffect(() => { // no-op
    if (resizeOnPathChange && !router.isSsr)
      window.dispatchEvent(new Event('resize'));
  }, [router.asPath, router.isSsr, resizeOnPathChange]);
  

  // TODO: expose a custom API for granular
  // control? (probably overkill and -head)
  // const prevRouter = usePrev(router, true);
  // NOTE: runs twice in React strictMode dev
  useReRenderEffect(() => { // after 1st render
    if (resetDataOnLocaleChange) {
      fetchedPathProps.current = {};
      dispatchPrerenderedPaths({ type: 'clear' });
    }
  }, [router.locale, resetDataOnLocaleChange]);

  return <>
    {prerenderedPaths.map(path => {
      const page = asPage(path);
      if (!(page)) return null; // no shell
      const props = fetchedPathProps.current[path]?.data;
      if (!(props)) return null; // (async)

      const ShellComponent = pageComponents[page];
      return (
        <span
          key={path} // ensures stability of memo component props
          id={'__prerendered_' + path}
          style={path === router.asPath ? {} : { display: 'none' }}
        >
          <Suspense fallback="Loading...">
            <ShellComponent {...props} />
          </Suspense>
        </span>
      );
    })}
    {/* fallback (no shell; non-opt-in?) */}
    {(prerenderedPaths.includes(router.asPath)) ? null : (
      <span id="__component">
        <CurrentComponent {...currentPageProps} router={router} />
      </span>
    )}
  </>;
};
