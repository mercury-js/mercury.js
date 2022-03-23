/**
 * (Temporary) monkey patches for:
 * - deployment problems (local dev and
 *   production environment mistmatches)
 * - ...
 * 
 * NOTE:
 * - try to detect (within each function) whether
 *   the workaround is needed and bail if it's not
 * 
 * @module
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import { isProductionClient } from './helpers';

/* TODO:?
 - build-time opt-in flag system
 - (and/or) platform detection
*/

/** @note must implement the API endpoint */
export function reroutePageDataFetchesInProd(
  apiPath='/api/data?path=',
) {
  // TODO: conditional on cloud platform (edge config)
  if (!isProductionClient()) return;
  
  // @ts-ignore ("origFetch" doesn't exist yet)
  const origFetch = window.origFetch = window.origFetch || fetch;
  const dataRegex = /^\/_next\/data\//;
  window.fetch = (...args) => {
    const path = args[0] as string;
    if (dataRegex.test(path)) {
      args[0] = apiPath + path;
    };
    return origFetch(...args);
  };
}
