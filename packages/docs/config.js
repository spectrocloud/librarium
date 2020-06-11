const config = {
  gatsby: {
    pathPrefix: process.env.GATSBY_DOCS_URL,
    siteUrl: process.env.GATSBY_SITE_URL,
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  siteMetadata: {
    title: 'Spectro cloud documentation',
    description: 'Spectro cloud documentation, guides, API documentation, integrations and more',
    ogImage: null,
    docsLocation: 'https://github.com/spectrocloud/librarium/tree/master/packages/docs/content',
    favicon: '',
  },
  pwa: {
    enabled: false, // disabling this will also remove the existing service worker.
    manifest: {
      name: 'Spectro cloud documentation',
      short_name: 'Spectro cloud docs',
      start_url: '/',
      background_color: '#4432F5',
      theme_color: '#4432F5',
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
