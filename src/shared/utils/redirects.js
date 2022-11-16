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
  {
    fromPath: `/terraform/resources`,
    toPath: `https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/terraform/datasources`,
    toPath: `https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs`,
    redirectInBrowser: true,
    isPermanent: true,
  },
];

module.exports = redirects;
