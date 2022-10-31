const redirects = [
  {
    fromPath: `/api/`,
    toPath: `/api/introduction`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/api`,
    toPath: `/api/introduction`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/clusters/nested-clusters/`,
    toPath: `/clusters/sandbox-clusters`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/clusters/nested-clusters`,
    toPath: `/clusters/sandbox-clusters`,
    redirectInBrowser: true,
    isPermanent: true,
  },
];

module.exports = redirects;
