# Mercury.js

Mercury.js is a customizable headless storefront template for ecom stores. It is:
- Optimized for speed & performance and UX & DX with extended support for dynamic content (such as search and product recommendations)
- Under active development (using Shopify as testing ground), **not ready** for production yet
- Built on top of Next.js and React 18 (RC)
- Decoupled to prevent vendor lock-in
- Open source

We used [Next.js Commerce](https://github.com/vercel/commerce) as a starting point.


## Features & Roadmap

**In the works**:
- Client-side component prerendering
- A/B testing (dynamic)
- Personalized product recommendations (UI decoupled from engine)
- Smart search
- ...

For more info check out [our website][(**TODO**: link to our website)]

**Features of Next.js Commerce**

(from [Next.js Commerce README](https://github.com/vercel/commerce/blob/main/README.md))

- Performant by default
- SEO Ready
- Internationalization
- Responsive
- UI Components
- Theming
- Standardized Data Hooks
- Integrations - Integrate seamlessly with the most common ecommerce platforms.
- Dark Mode Support

<br><br>
<hr>
<br><br>


## Basic usage

The information below has been copied/adapted from [Next.js Commerce README](https://github.com/vercel/commerce/blob/main/README.md)


## Integrations

Mercury.js integrates out-of-the-box with BigCommerce, Shopify, Swell, Saleor, Vendure, Spree and Commerce.js. The plan is to support all major ecommerce backends.


## Configuration

### How to change providers

Open `site/.env.local` and change the value of `COMMERCE_PROVIDER` to the provider you would like to use, then set the environment variables for that provider (use `site/.env.template` as the base).

The setup for Shopify would look like this for example:

```
COMMERCE_PROVIDER=shopify
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=xxxxxxx.myshopify.com
```

### Features

Every provider defines the features that it supports under `packages/{provider}/src/commerce.config.json`

#### Features Available

The following features can be enabled or disabled. This means that the UI will remove all code related to the feature.
For example: Turning `cart` off will disable Cart capabilities.

- cart
- search
- wishlist
- customerAuth
- customCheckout

#### How to turn Features on and off

> NOTE: The selected provider should support the feature that you are toggling. (This means that you can't turn wishlist on if the provider doesn't support this functionality out the box)

- Open `site/commerce.config.json`
- You'll see a config file like this:
  ```json
  {
    "features": {
      "wishlist": false,
      "customCheckout": true
    }
  }
  ```
- Turn `wishlist` on by setting `wishlist` to `true`.
- Run the app and the wishlist functionality should be back on.

### Local development

1. ([Fork](https://help.github.com/articles/fork-a-repo/) and) [Clone](https://help.github.com/articles/cloning-a-repository/) this repo.
2. (Create a new branch `git checkout -b MY_BRANCH_NAME`)
3. Install the dependencies: `yarn`
4. Duplicate `site/.env.template` and rename it to `site/.env.local`
5. Add proper store values to `site/.env.local`
6. Run `cd site` and `yarn dev` to build and watch for code changes
7. Run `yarn turbo run build` to check the build after your changes
