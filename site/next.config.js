const commerce = require('./commerce.config.json')
const { withCommerceConfig, getProviderName } = require('./commerce-config')

const provider = commerce.provider || getProviderName()
const isBC = provider === '@vercel/commerce-bigcommerce'
const isShopify = provider === '@vercel/commerce-shopify'
const isSaleor = provider === '@vercel/commerce-saleor'
const isSwell = provider === '@vercel/commerce-swell'
const isVendure = provider === '@vercel/commerce-vendure'

module.exports = withCommerceConfig({
  commerce,
  i18n: {
    locales: ['en-US', 'es'],
    defaultLocale: 'en-US',
  },
  rewrites() {
    return [
      (isBC || isShopify || isSwell || isVendure || isSaleor) && {
        source: '/checkout',
        destination: '/api/checkout',
      },
      // The logout is also an action so this route is not required, but it's also another way
      // you can allow a logout!
      isBC && {
        source: '/logout',
        destination: '/api/logout?redirect_to=/',
      },
      // For Vendure, rewrite the local api url to the remote (external) api url. This is required
      // to make the session cookies work.
      isVendure &&
        process.env.NEXT_PUBLIC_VENDURE_LOCAL_URL && {
          source: `${process.env.NEXT_PUBLIC_VENDURE_LOCAL_URL}/:path*`,
          destination: `${process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL}/:path*`,
        },
    ].filter(Boolean)
  },
  experimental: {
    
    // NOTE:
    // - can't use SSG with React 18 ("experimental" HTTP
    //   streaming or Sever Components), for now. Follow:
    //   - https://github.com/vercel/next.js/issues/35023 
    //   - https://github.com/vercel/next.js/issues/34247
    //   - https://github.com/vercel/next.js/discussions/34179

    reactRoot: true,
    // TODO: try edge
    runtime: 'nodejs',
    // serverComponents: true,

  },

  // NOTE:
  // - identifies unsafe lifecycles (w.r.t concurrent features)
  // - renders components (and runs effects) twice in dev
  reactStrictMode: true,
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
