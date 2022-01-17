module.exports = {
  siteMetadata: {
    siteUrl: "https://docs.spectrocloud.com/",
    title: "librarium",
  },
  plugins: [
    "gatsby-plugin-styled-components",
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-force-trailing-slashes`,
    {
      resolve: `gatsby-plugin-react-helmet-canonical-urls`,
      options: {
        siteUrl: `https://docs.spectrocloud.com`,
        noQueryString: true,
      },
    },
  ],
}
