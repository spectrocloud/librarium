const config = {
  gatsby: {
    pathPrefix: '/glossary',
    siteUrl: 'https://docs.spectrocloud.com',
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
    docsLocation: 'https://github.com/spectrocloud/librarium/edit/master/packages/docs/content',
    favicon: '@librarium/shared/src/assets/icons/favicon.png',
  },
};

module.exports = config;
