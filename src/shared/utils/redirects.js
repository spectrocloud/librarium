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
    fromPath: `/clusters/sandbox-clusters/`,
    toPath: `/clusters/palette-virtual-clusters`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/clusters/sandbox-clusters/cluster-quickstart`,
    toPath: `/clusters/palette-virtual-clusters/virtual-cluster-quickstart`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/devx/sandbox-clusters`,
    toPath: `/devx/palette-virtual-clusters`,
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
  {
    fromPath: `/clusters/edge/virtualized`,
    toPath: `/clusters/edge`,
  },  
];

module.exports = redirects;
