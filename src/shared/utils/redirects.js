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
    fromPath: `/clusters/nested-clusters`,
    toPath: `/clusters/palette-virtual-clusters`,
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
    toPath: `/clusters/palette-virtual-clusters/add-virtual-cluster-to-host-cluster/`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/introduction/architecture-overview`,
    toPath: `/architecture/architecture-overview`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/introduction/what-is`,
    toPath: `/introduction`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {

    fromPath: `/getting-started/free-cloud-credit`,
    toPath: `/getting-started/palette-freemium`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/clusters/public-cloud/eks`,
    toPath: `/clusters/public-cloud/aws/eks`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/clusters/public-cloud/aks`,
    toPath: `/clusters/public-cloud/azure/eks`,
    redirectInBrowser: true,
    isPermanent: true,
  },
  {
    fromPath: `/integrations/minio-operator`,
    toPath: `/integrations/minio`,
    redirectInBrowser: true,
    isPermanent: true,
  }
];

module.exports = redirects;
