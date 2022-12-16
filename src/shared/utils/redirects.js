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
    redirectInBrowser: true,
    isPermanent: true,
  },  
  {
    fromPath: `/troubleshooting/palette-namespaces-podes`,
    toPath: `/architecture/palette-namespaces-podes`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/troubleshooting/Network-Communications-and-Ports`,
    toPath: `/architecture/networking-ports`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/troubleshooting/SAAS-Network-Communications-and-Ports`,
    toPath: `/architecture/networking-ports`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/troubleshooting/orchestration-spectrocloud`,
    toPath: `/architecture/orchestration-spectrocloud`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/devx/registries/helm-registry`,
    toPath: `/registries-and-packs/helm-charts`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/devx/registries/oci-registry`,
    toPath: `/registries-and-packs/oci-registry`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/clusters/palette-virtual-clusters/virtual-cluster-quickstart`,
    toPath: `/devx/palette-virtual-clusters/pause-restore-virtual-clusters`,
    redirectInBrowser: true,
    isPermanent: true,
  },
];

module.exports = redirects;
