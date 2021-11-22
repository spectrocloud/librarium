require('dotenv').config();
const queries = require('./src/utils/algolia');
const path = require('path');

const config = require('./config');

const plugins = [
  {
    resolve: 'gatsby-plugin-sitemap',
    options: {
      exclude: [`/glossary/`, `/glossary/*`],
    },
  },
  'gatsby-plugin-styled-components',
  'gatsby-plugin-react-helmet',
  {
    resolve: `gatsby-plugin-react-helmet-canonical-urls`,
    options: {
      siteUrl: config.gatsby.siteUrl,
      noQueryString: true,
    },
  },
  'gatsby-plugin-antd',
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      name: `images`,
      path: path.resolve(__dirname, '../shared/src/assets/'),
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'glossary',
      path: path.resolve(__dirname, '../glossary/content/'),
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'docs',
      path: path.resolve(__dirname, '../docs/content/'),
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'api',
      path: path.resolve(__dirname, '../api/content/'),
    },
  },
  `gatsby-transformer-sharp`,
  'gatsby-plugin-sharp',
  {
    resolve: `gatsby-plugin-webfonts`,
    options: {
      fonts: {
        google: [
          {
            family: `Poppins`,
            variants: [`300`, `400`, `500`, `600`, `700`, 'latin'],
          },
        ],
      },
    },
  },
  {
    resolve: 'gatsby-plugin-mdx',
    options: {
      plugins: [
        `gatsby-remark-local-videos`,
        `gatsby-remark-images`,
        `gatsby-remark-images-medium-zoom`,
        'gatsby-remark-image-attributes',
      ],
      gatsbyRemarkPlugins: [
        {
          resolve: `gatsby-remark-local-videos`,
        },
        {
          resolve: 'gatsby-remark-images',
          options: {
            maxWidth: 1035,
            quality: 100,
            linkImagesToOriginal: false,
          },
        },
        {
          resolve: 'gatsby-remark-copy-linked-files',
        },
        {
          resolve: 'gatsby-remark-images-medium-zoom',
        },
        {
          resolve: 'gatsby-remark-image-attributes',
        },
      ],
      extensions: ['.mdx', '.md'],
    },
  },
  {
    resolve: "gatsby-plugin-google-tagmanager",
    options: {
      id: "GTM-T2F9ZMS",
      includeInDevelopment: false,
    },
  },
  {
    resolve: 'gatsby-plugin-react-svg',
    options: {
      rule: {
        include: /icons/,
      },
    },
  },
];

// check and add algolia
if (
  config.header.search &&
  config.header.search.enabled &&
  config.header.search.algoliaAppId &&
  config.header.search.algoliaAdminKey
) {
  plugins.push({
    resolve: `gatsby-plugin-algolia`,
    options: {
      appId: config.header.search.algoliaAppId, // algolia application id
      apiKey: config.header.search.algoliaAdminKey, // algolia admin key to index
      queries,
      chunkSize: 10000, // default: 1000
      enablePartialUpdates: true,
      matchFields: ['slug', 'modifiedTime'],
    },
  });
}
// check and add pwa functionality
if (config.pwa && config.pwa.enabled && config.pwa.manifest) {
  plugins.push({
    resolve: `gatsby-plugin-manifest`,
    options: { ...config.pwa.manifest },
  });
  plugins.push({
    resolve: 'gatsby-plugin-offline',
    options: {
      appendScript: require.resolve(`./src/custom-sw-code.js`),
    },
  });
} else {
  plugins.push('gatsby-plugin-remove-serviceworker');
}

// check and remove trailing slash
if (config.gatsby && !config.gatsby.trailingSlash) {
  plugins.push('gatsby-plugin-remove-trailing-slashes');
}

module.exports = {
  pathPrefix: config.gatsby.pathPrefix,
  siteMetadata: {
    title: config.siteMetadata.title,
    description: config.siteMetadata.description,
    docsLocation: config.siteMetadata.docsLocation,
    ogImage: config.siteMetadata.ogImage,
    favicon: config.siteMetadata.favicon,
    logo: {
      link: config.header.logoLink ? config.header.logoLink : '/',
      image: config.header.logo,
    }, // backwards compatible
    headerTitle: config.header.title,
    githubUrl: config.header.githubUrl,
    helpUrl: config.header.helpUrl,
    tweetText: config.header.tweetText,
    headerLinks: config.header.links,
    siteUrl: config.gatsby.siteUrl,
  },
  plugins: plugins,
};
