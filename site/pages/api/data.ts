/**
 * Temporary workaround.
 * 
 * Problem:
 * - in production (only; with SSR streaming on; Vercel), an edge
 *   server(less) responds to requests to "/_next/data/<path>"
 *   (`getServerSideProps`) **with the data** but a status code 404
 *   (there is no "data" directory in the output directory and pages
 *   are not included in the manifest)
 * - the 404 causes client to reload a new page on `Link` navigation
 * 
 * Solution:
 * - monkey patch intercept `fetch`es to "/_next/data/<path>" on client
 *   (NOTE: remember to set in client-side code (`_app`) and try to
 *   detect if is needed) to send request here instead
 * - fetch data here (on server) and send to client
 *   (NOTE: can't just use 3xx redirect)
 * 
 * New problem / downsides:
 * - unnecessary additional roundtrip (unless cached)
 *   ("server side props do not live on the edge")
 * - (Vercel function logs still show "Edge Status" 404, but `Link`
 *   navigation is working as intended)
 *
 * New solution / mitigating factors:
 * - cache and reuse fetched data by path
 *   (NOTE: can't persist global object on serveless (edge), but
 *   the cloud platform may allow caching the responses; see
 *   `HEADER_CACHE_CONTROL` below)
 * - the data is (always) prefetched, so (likely) won't block
 * 
 * NOTE:
 * - assumes that the `fetch` API is available
 */

/**
 * @preserve
 * Copyright (c) 2022 Churn Out Labs Ltd. (FI32159032).
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// TODO:?
// - prepopulate?
// - Redis? (NOTE: temp & only on serverful)
// NOTE: (might) not persist (for long) on serverless (edge)
const _DATA: Record<
  string, // path
  { pageProps: {} }
> = {};

const getHostWithProtocol = (req: NextApiRequest) => (h => (
  `${h['x-forwarded-proto'] || 'http'}://` +
  `${h['x-forwarded-host'] || h.host}`
))(req.headers);

// TODO: expose a config API
const HEADER_CACHE_CONTROL = 'public, max-age=86400, s-maxage=86400';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let path = req?.query?.path;
  if (!path) {
    return res.status(404).json({
      message: 'query param "path" missing'
    });
  } else if (Array.isArray(path)) {
    path = path.join('/');
  }
  
  let data = _DATA[path];
  if (!data) {
    const host = getHostWithProtocol(req);
    const resp = await fetch(`${host}${path}`);
    data = await resp.json();
    _DATA[path] = data;
  } else {
    console.log(
      `data for "${path}" served from in-memory cache`
    );
  }

  res.setHeader('Cache-Control', HEADER_CACHE_CONTROL);
  res.send(data);
};
