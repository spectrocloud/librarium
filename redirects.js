const redirects = [
  {
    from: `/api/`,
    to: `/api/introduction`,
  },
  {
    from: `/clusters/nested-clusters`,
    to: `/clusters/palette-virtual-clusters`,
  },
  {
    from: `/clusters/sandbox-clusters`,
    to: `/clusters/palette-virtual-clusters`,
  },
  {
    from: `/clusters/sandbox-clusters/cluster-quickstart`,
    to: `/clusters/palette-virtual-clusters`,
  },
  {
    from: `/devx/sandbox-clusters`,
    to: `/devx/palette-virtual-clusters`,
  },
  {
    from: `/clusters/edge/virtualized`,
    to: `/clusters/edge`,
  },
  {
    from: `/troubleshooting/palette-namespaces-podes`,
    to: `/architecture/palette-namespaces-podes`,
  },
  {
    from: `/troubleshooting/Network-Communications-and-Ports`,
    to: `/architecture/networking-ports`,
  },
  {
    from: `/troubleshooting/SAAS-Network-Communications-and-Ports`,
    to: `/architecture/networking-ports`,
  },
  {
    from: `/troubleshooting/orchestration-spectrocloud`,
    to: `/architecture/orchestration-spectrocloud`,
  },
  {
    from: `/devx/registries/helm-registry`,
    to: `/registries-and-packs/helm-charts`,
  },
  {
    from: `/devx/registries/oci-registry`,
    to: `/registries-and-packs/oci-registry`,
  },
  {
    from: `/clusters/palette-virtual-clusters/virtual-cluster-quickstart`,
    to: `/clusters/palette-virtual-clusters`,
  },
  {
    from: `/introduction/architecture-overview`,
    to: `/architecture/architecture-overview`,
  },
  {
    from: `/introduction`,
    to: `/`,
  },
  {
    from: `/introduction/what-is`,
    to: `/`,
  },
  {
    from: `/getting-started/free-cloud-credit`,
    to: `/getting-started/palette-freemium`,
  },
  {
    from: `/clusters/public-cloud/eks`,
    to: `/clusters/public-cloud/aws/eks`,
  },
  {
    from: `/clusters/public-cloud/aks`,
    to: `/clusters/public-cloud/azure/aks`,
  },
  {
    from: `/integrations/minio-operator`,
    to: `/integrations`,
  },
  {
    from: `/knowledgebase/how-to/reverse-proxy-dashboard`,
    to: `/clusters/cluster-management/kubernetes-dashboard`,
  },
  {
    from: `/devx/cluster-groups`,
    to: `/clusters/cluster-groups`,
  },
  {
    from: `/devx/cluster-groups/ingress-cluster-group`,
    to: `/clusters/cluster-groups/ingress-cluster-group`,
  },
  {
    from: `/devx/dev-land-explore`,
    to: `/devx`,
  },
  {
    from: `/clusters/cluster-management/.ssh`,
    to: `/clusters/cluster-management/ssh-keys`,
  },
  {
    from: `/clusters/edge/install/installer-image`,
    to: `/clusters/edge/site-deployment/site-installation`,
  },
  {
    from: `/clusters/edge/native`,
    to: `/clusters/edge/site-deployment`,
  },
  {
    from: `/clusters/edge/installer-image`,
    to: `/clusters/edge/site-deployment/site-installation`,
  },
  {
    from: `/clusters/edge/site-deployment/installer`,
    to: `/clusters/edge/site-deployment/site-installation`,
  },
  {
    from: `/knowledgebase/tutorials/terraform-tutorial`,
    to: `/tags/tutorial`,
  },
  {
    from: `/knowledgebase/tutorials/cks-tutorial`,
    to: `/tags/tutorial`,
  },
  {
    from: `/knowledgebase/tutorials/dev-engine`,
    to: `/tags/tutorial`,
  },
  {
    from: `/knowledgebase/tutorials/dev-engine/deploy-app`,
    to: `/tags/tutorial`,
  },
  {
    from: `/kubernetes-knowlege-hub/how-to/deploy-stateless-frontend-app`,
    to: `/kubernetes-knowlege-hub/tutorials/deploy-stateless-frontend-app`,
  },
  {
    from: `/devx/resource-quota`,
    to: `/devx/manage-dev-engine/resource-quota`,
  },
  {
    from: `/devx/registries`,
    to: `/devx/manage-dev-engine/registries`,
  },
  {
    from: `/devx/virtual-clusters`,
    to: `/devx/palette-virtual-clusters`,
  },
  {
    from: `/clusters/edge/edgeforge-workflow/build-kairos-os`,
    to: `/clusters/edge/edgeforge-workflow/palette-canvos`,
  },
  {
    from: `/clusters/edge/edgeforge-workflow/build-images`,
    to: `/clusters/edge/edgeforge-workflow/palette-canvos`,
  },
  {
    from: `/integrations/ubuntu-k3s`,
    to: `/integrations/ubuntu`,
  },
  {
    from: `/clusters/brownfield-clusters`,
    to: `/clusters/imported-clusters`,
  },
  {
    from: `/integrations/oidc-eks`,
    to: `/integrations/kubernetes`,
  },
  {
    from: `/clusters/palette-virtual-clusters/add-virtual-cluster-to-host-cluster`,
    to: `/clusters/palette-virtual-clusters/deploy-virtual-cluster`,
  },
  {
    from: `/vm-management/vm-packs-profiles/enable-vm-dashboard`,
    to: `/vm-management/vm-packs-profiles/add-roles-and-role-bindings`,
  },
  {
    from: `/vm-management/vm-packs-profiles/vm-dashboard`,
    to: `/vm-management/create-manage-vm/standard-vm-operations`,
  },
  {
    from: `/vm-management/vm-packs-profiles/create-vm-dashboard-profile`,
    to: `/vm-management/vm-packs-profiles/create-vmo-profile`,
  },
  {
    from: `/knowledgebase`,
    to: `/tags`,
  },
  {
    from: `/knowledgebase/tutorials`,
    to: `/tags/tutorial`,
  },
  {
    from: `/knowledgebase/how-to`,
    to: `/tags/how-to`,
  },
  {
    from: `/integrations/EKS-D`,
    to: `/integrations`,
  },
  {
    from: `/enterprise-version/on-prem-system-requirements`,
    to: `/enterprise-version/install-palette`,
  },
  {
    from: `/enterprise-version/deploying-the-platform-installer`,
    to: `/enterprise-version/install-palette`,
  },
  {
    from: `/enterprise-version/deploying-an-enterprise-cluster`,
    to: `/enterprise-version/install-palette`,
  },
  {
    from: `/enterprise-version/deploying-palette-with-helm`,
    to: `/enterprise-version/install-palette/install-on-kubernetes/install`
  },
  {
   from: `/enterprise-version/helm-chart-install-reference`,
    to: `/enterprise-version/install-palette/install-on-kubernetes/palette-helm-ref` 
  },
  {
    from: `/enterprise-version/system-console-dashboard`,
    to: `/enterprise-version/system-management`
  },
  {
    from: `/enterprise-version/enterprise-cluster-management`,
    to: `/enterprise-version/system-management`
  },
  {
    from: `/enterprise-version/monitoring`,
    to: `/enterprise-version/system-management`
  },
  {
    from: `/enterprise-version/air-gap-repo`,
    to: `/enterprise-version/install-palette`
  },
  {
    from: `/enterprise-version/reverse-proxy`,
    to: `/enterprise-version/system-management/reverse-proxy`
  },
  {
    from: `/enterprise-version/ssl-certificate-management`,
    to: `/enterprise-version/system-management/ssl-certificate-management`
  }
];

module.exports = redirects;
