const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://docs.spectrocloud.com',
    gaTrackingId: null,
    trailingSlash: true,
  },
  header: {
    search: {
      enabled: true,
      indexName: process.env.NODE_ENV,
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  siteMetadata: {
    title: 'Spectro cloud documentation',
    description: 'Spectro cloud documentation, guides, API documentation, integrations and more',
    ogImage: null,
    docsLocation: 'https://github.com/spectrocloud/librarium/edit/master/packages/docs/content',
    favicon: 'shared/assets/icons/favicon.png',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'Spectro cloud documentation',
      short_name: 'Spectro cloud docs',
      start_url: '/',
      background_color: '#206cd1',
      theme_color: '#206cd1',
      display: 'standalone',
      crossOrigin: 'use-credentials',
      icons: [
        {
          src: 'src/pwa-512.png',
          sizes: `512x512`,
          type: `image/png`,
        },
      ],
    },
  },
};

module.exports = config;
