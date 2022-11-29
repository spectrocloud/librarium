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
    fromPath: `/introduction/architecture-overview`,
    toPath: `/architecture/architecture-overview`,
  },
  {
    fromPath: `/getting-started/palette-freemium`,
    toPath: `/introduction/palette-freemium`,
  },
  {
    fromPath: `/getting-started/free-cloud-credit`,
    toPath: `/introduction/palette-freemium`,
  },
  {
    fromPath: `/getting-started/dashboard`,
    toPath: `/introduction/dashboard`,
  },
  {
    fromPath: `/getting-started/onboarding-workflow`,
    toPath: `/introduction/onboarding-workflow`,
  },
  {
    fromPath: `/troubleshooting/palette-namespaces-podes`,
    toPath: `/architecture/palette-namespaces-podes`,
  },
  {
    fromPath: `/troubleshooting/Network-Communications-and-Ports`,
    toPath: `/architecture/networking-ports`,
  },
  {
    fromPath: `/troubleshooting/SAAS-Network-Communications-and-Ports`,
    toPath: `/architecture/networking-ports`,
  },
  {
    fromPath: `/troubleshooting/orchestration-spectrocloud`,
    toPath: `/architecture/orchestration-spectrocloud`,
  }
];

module.exports = redirects;
