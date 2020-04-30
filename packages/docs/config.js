const config = {
  gatsby: {
    pathPrefix: '/',
    siteUrl: 'https://hasura.io',
    gaTrackingId: null,
    trailingSlash: false,
  },
  header: {
    logo: 'https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/brand.svg',
    logoLink: 'https://hasura.io/learn/',
    title:
      "<a href='https://hasura.io/learn/'><img class='img-responsive' src='https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/learn-logo.svg' alt='Learn logo' /></a>",
    githubUrl: 'https://github.com/spectrocloud/literarum',
    helpUrl: '',
    tweetText: 'Found this in the Spectro cloud documentation.',
    social: `<li>
		    <a href="https://twitter.com/spectrocloudinc" target="_blank" rel="noopener">
		      <div class="twitterBtn">
		        <img src='https://graphql-engine-cdn.hasura.io/learn-hasura/assets/homepage/twitter-brands-block.svg' alt="twitter"/>
		      </div>
		    </a>
		  </li>`,
    links: [{ text: 'API', link: process.env.GATSBY_API_DOCS_URL }],
    search: {
      enabled: false,
      indexName: '',
      algoliaAppId: process.env.GATSBY_ALGOLIA_APP_ID,
      algoliaSearchKey: process.env.GATSBY_ALGOLIA_SEARCH_KEY,
      algoliaAdminKey: process.env.ALGOLIA_ADMIN_KEY,
    },
  },
  sidebar: {
    forcedNavOrder: [
      '/home', // add trailing slash if enabled above
      '/introduction',
      '/getting-started',
      '/cluster-profiles',
      '/clusters',
      '/clouds',
      '/projects',
      '/user-management',
      '/registries',
      '/best-pracices',
      '/release-notes',
    ],
    collapsedNav: [
      '/home',
      '/introduction',
      '/getting-started',
      '/cluster-profiles',
      '/clusters',
      '/clouds',
      '/projects',
      '/user-management',
      '/registries',
      '/best-pracices',
      '/release-notes',
    ],
    links: [],
    frontline: false,
    ignoreIndex: true,
    title: false
  },
  siteMetadata: {
    title: 'Spectro cloud documentation',
    description: 'Spectro cloud documentation, guides, API documentation, integrations and more',
    ogImage: null,
    docsLocation: 'https://github.com/spectrocloud/librarium/tree/master/content',
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
