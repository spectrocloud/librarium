const fetchAndFilterUrls = require("./utils/xml/packExtracter");

/*
The logigc below is all related to the event that the environment variable DISABLE_PACKS_INTEGRATIONS is set to true.
The function fetchAndFilterUrls is used to fetch the sitemap.xml file from production. 
The assumption is that the sitemap.xml file is up to date and contains all the URLs for the packs integrations.
We then filter the URLs that start with the prefix "https://docs.spectrocloud.com/integrations/packs/" and store them in the packRedirects array.
The redirects array is then updated with the packRedirects array.
This allows to prevent broken links when the packs integrations are disabled.
*/

let packRedirects = [];

if (process.env.DISABLE_PACKS_INTEGRATIONS === "true") {
  const sitemapUrl = "https://docs.spectrocloud.com/sitemap.xml";
  const urlPrefix = "https://docs.spectrocloud.com/integrations/packs/";

  fetchAndFilterUrls(sitemapUrl, urlPrefix).then((paths) => {
    packRedirects = paths.map((path) => ({
      from: path,
      to: "/integrations/",
    }));
  });
}

let redirects = [
  {
    from: `/api/`,
    to: `/api/introduction/`,
  },
  {
    from: `/clusters/nested-clusters/`,
    to: `/clusters/palette-virtual-clusters/`,
  },
  {
    from: `/clusters/sandbox-clusters/`,
    to: `/clusters/palette-virtual-clusters/`,
  },
  {
    from: `/clusters/sandbox-clusters/cluster-quickstart/`,
    to: `/clusters/palette-virtual-clusters/`,
  },
  {
    from: `/devx/sandbox-clusters/`,
    to: `/devx/palette-virtual-clusters/`,
  },
  {
    from: `/clusters/edge/virtualized/`,
    to: `/clusters/edge/`,
  },
  {
    from: `/troubleshooting/palette-namespaces-podes/`,
    to: `/architecture/palette-namespaces-podes/`,
  },
  {
    from: `/troubleshooting/Network-Communications-and-Ports/`,
    to: `/architecture/networking-ports/`,
  },
  {
    from: `/troubleshooting/SAAS-Network-Communications-and-Ports/`,
    to: `/architecture/networking-ports/`,
  },
  {
    from: `/troubleshooting/orchestration-spectrocloud/`,
    to: `/architecture/orchestration-spectrocloud/`,
  },
  {
    from: `/devx/registries/helm-registry/`,
    to: `/registries-and-packs/helm-charts/`,
  },
  {
    from: `/devx/registries/oci-registry/`,
    to: `/registries-and-packs/oci-registry/`,
  },
  {
    from: `/clusters/palette-virtual-clusters/virtual-cluster-quickstart/`,
    to: `/clusters/palette-virtual-clusters/`,
  },
  {
    from: `/introduction/architecture-overview/`,
    to: `/architecture/architecture-overview/`,
  },
  {
    from: `/introduction/`,
    to: `/`,
  },
  {
    from: `/introduction/what-is/`,
    to: `/`,
  },
  {
    from: `/getting-started/free-cloud-credit/`,
    to: `/getting-started/`,
  },
  {
    from: `/getting-started/palette-freemium/`,
    to: `/getting-started/`,
  },
  {
    from: `/getting-started/onboarding-workflow/`,
    to: `/getting-started/`,
  },
  {
    from: `/getting-started/dashboard`,
    to: `/introduction/dashboard`,
  },
  {
    from: `/getting-started/cluster-profiles`,
    to: `/getting-started/introduction`,
  },
  {
    from: `/clusters/public-cloud/eks`,
    to: `/clusters/public-cloud/aws/eks`,
  },
  {
    from: `/clusters/public-cloud/aks/`,
    to: `/clusters/public-cloud/azure/aks/`,
  },
  {
    from: `/knowledgebase/how-to/reverse-proxy-dashboard/`,
    to: `/clusters/cluster-management/kubernetes-dashboard/`,
  },
  {
    from: `/devx/cluster-groups/`,
    to: `/clusters/cluster-groups/`,
  },
  {
    from: `/devx/cluster-groups/ingress-cluster-group/`,
    to: `/clusters/cluster-groups/ingress-cluster-group/`,
  },
  {
    from: `/devx/dev-land-explore/`,
    to: `/devx/`,
  },
  {
    from: `/clusters/cluster-management/.ssh/`,
    to: `/clusters/cluster-management/ssh-keys/`,
  },
  {
    from: `/clusters/edge/install/installer-image/`,
    to: `/clusters/edge/site-deployment/site-installation/`,
  },
  {
    from: `/clusters/edge/native/`,
    to: `/clusters/edge/site-deployment/`,
  },
  {
    from: `/clusters/edge/installer-image/`,
    to: `/clusters/edge/site-deployment/site-installation/`,
  },
  {
    from: `/clusters/edge/site-deployment/installer/`,
    to: `/clusters/edge/site-deployment/site-installation/`,
  },
  {
    from: `/knowledgebase/tutorials/terraform-tutorial/`,
    to: `/tags/tutorial/`,
  },
  {
    from: `/knowledgebase/tutorials/cks-tutorial/`,
    to: `/tags/tutorial/`,
  },
  {
    from: `/knowledgebase/tutorials/dev-engine/`,
    to: `/tags/tutorial/`,
  },
  {
    from: `/knowledgebase/tutorials/dev-engine/deploy-app/`,
    to: `/tags/tutorial/`,
  },
  {
    from: `/kubernetes-knowlege-hub/how-to/deploy-stateless-frontend-app/`,
    to: `/kubernetes-knowlege-hub/tutorials/deploy-stateless-frontend-app/`,
  },
  {
    from: `/devx/resource-quota/`,
    to: `/devx/manage-dev-engine/resource-quota/`,
  },
  {
    from: `/devx/registries/`,
    to: `/devx/manage-dev-engine/registries/`,
  },
  {
    from: `/devx/virtual-clusters/`,
    to: `/devx/palette-virtual-clusters/`,
  },
  {
    from: `/clusters/palette-virtual-clusters/add-virtual-cluster-to-host-cluster/`,
    to: `/clusters/palette-virtual-clusters/deploy-virtual-cluster/`,
  },
  {
    from: `/vm-management/vm-packs-profiles/enable-vm-dashboard/`,
    to: `/vm-management/vm-packs-profiles/add-roles-and-role-bindings/`,
  },
  {
    from: `/vm-management/vm-packs-profiles/vm-dashboard/`,
    to: `/vm-management/create-manage-vm/standard-vm-operations/`,
  },
  {
    from: `/vm-management/vm-packs-profiles/create-vm-dashboard-profile/`,
    to: `/vm-management/vm-packs-profiles/create-vmo-profile/`,
  },
  {
    from: `/knowledgebase/`,
    to: `/tags/`,
  },
  {
    from: `/knowledgebase/tutorials/`,
    to: `/tags/tutorial/`,
  },
  {
    from: `/knowledgebase/how-to/`,
    to: `/tags/how-to/`,
  },
  {
    from: `/clusters/brownfield-clusters/`,
    to: `/clusters/imported-clusters/`,
  },
  {
    from: `/cluster-profiles/`,
    to: `/profiles/cluster-profiles/`,
  },
  {
    from: `/cluster-profiles/task-define-profile/`,
    to: `/profiles/cluster-profiles/create-cluster-profiles/`,
  },
  {
    from: `/cluster-profiles/create-add-on-profile/`,
    to: `/profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/`,
  },
  {
    from: `/cluster-profiles/task-update-profile/`,
    to: `/profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile/`,
  },
  {
    from: `/cluster-profiles/cluster-profile-import-export/`,
    to: `/profiles/cluster-profiles/export-import-cluster-profile/`,
  },
  {
    from: `/cluster-profiles/examples/`,
    to: `/profiles/cluster-profiles/`,
  },
  {
    from: `/cluster-profiles/byoos/`,
    to: `/byoos/`,
  },
  {
    from: `/cluster-profiles/byoos/image-builder/`,
    to: `/byoos/image-builder/`,
  },
  {
    from: `/system-profile/`,
    to: `/profiles/`,
  },
  {
    from: `/devx/app-profile/create-app-profile/`,
    to: `/profiles/app-profiles/create-app-profiles/`,
  },
  {
    from: `/devx/app-profile/container-deployment/`,
    to: `/profiles/app-profiles/create-app-profiles/container-deployment/`,
  },
  {
    from: `/devx/app-profile/app-profile-macros/`,
    to: `/profiles/app-profiles/app-profile-output-vars/`,
  },
  {
    from: `/devx/app-profile/app-profile-cloning/`,
    to: `/profiles/app-profiles/clone-app-profile/`,
  },
  {
    from: `/devx/app-profile/app-profile-versioning/`,
    to: `/profiles/app-profiles/modify-app-profiles/version-app-profile/`,
  },
  {
    from: `/devx/app-profile/services/`,
    to: `/devx/services/`,
  },
  {
    from: `/devx/app-profile/services/connectivity/`,
    to: `/devx/services/connectivity/`,
  },
  {
    from: `/devx/app-profile/services/db-services/`,
    to: `/devx/services/db-services/`,
  },
  {
    from: `/devx/app-profile/services/service-listings/`,
    to: `/devx/services/service-listings/`,
  },
  {
    from: `/devx/app-profile/services/service-listings/mongo-db/`,
    to: `/devx/services/service-listings/mongo-db/`,
  },
  {
    from: `/devx/app-profile/services/service-listings/mysql/`,
    to: `/devx/services/service-listings/mysql/`,
  },
  {
    from: `/devx/app-profile/services/service-listings/postgresql-db/`,
    to: `/devx/services/service-listings/postgresql-db/`,
  },
  {
    from: `/devx/app-profile/services/service-listings/redis-db/`,
    to: `/devx/services/service-listings/redis-db/`,
  },
  {
    from: `/devx/app-profile/services/service-listings/vault/`,
    to: `/devx/services/service-listings/vault/`,
  },
  {
    from: `/devx/app-profile/services/service-listings/cockroach-db/`,
    to: `/devx/services/service-listings/cockroach-db/`,
  },
  {
    from: `/enterprise-version/on-prem-system-requirements/`,
    to: `/enterprise-version/install-palette/`,
  },
  {
    from: `/enterprise-version/deploying-the-platform-installer/`,
    to: `/enterprise-version/install-palette/`,
  },
  {
    from: `/enterprise-version/deploying-an-enterprise-cluster/`,
    to: `/enterprise-version/install-palette/`,
  },
  {
    from: `/enterprise-version/deploying-palette-with-helm/`,
    to: `/enterprise-version/install-palette/install-on-kubernetes/install/`,
  },
  {
    from: `/enterprise-version/helm-chart-install-reference/`,
    to: `/enterprise-version/install-palette/install-on-kubernetes/palette-helm-ref/`,
  },
  {
    from: `/enterprise-version/system-console-dashboard/`,
    to: `/enterprise-version/system-management/`,
  },
  {
    from: `/enterprise-version/enterprise-cluster-management/`,
    to: `/enterprise-version/system-management/`,
  },
  {
    from: `/enterprise-version/monitoring/`,
    to: `/enterprise-version/system-management/`,
  },
  {
    from: `/enterprise-version/air-gap-repo/`,
    to: `/enterprise-version/install-palette/`,
  },
  {
    from: `/enterprise-version/reverse-proxy/`,
    to: `/enterprise-version/system-management/reverse-proxy/`,
  },
  {
    from: `/enterprise-version/ssl-certificate-management/`,
    to: `/enterprise-version/system-management/ssl-certificate-management/`,
  },
  {
    from: `/compliance/`,
    to: `/legal-licenses/compliance/`,
  },
  {
    from: [
      `/clusters/public-cloud/cox-edge/`,
      `/clusters/public-cloud/cox-edge/add-cox-edge-accounts/`,
      `/clusters/public-cloud/cox-edge/create-cox-cluster/`,
      `/clusters/public-cloud/cox-edge/network-rules/`,
    ],
    to: `/unlisted/cox-edge-eol/`,
  },
  {
    from: "/user-management/saml-sso/palette-sso-azure-ad",
    to: "/user-management/saml-sso/",
  },
  {
    from: "/user-management/saml-sso/enable-saml/",
    to: "/user-management/saml-sso/",
  },
  {
    from: [
      "/security/security-bulletins/",
      "/security/security-bulletins/cve-reports/",
      "/security/security-bulletins/index/",
    ],
    to: "/security-bulletins/",
  },
  {
    from: "/projects/",
    to: "/tenant-settings/projects/",
  },
  {
    from: "/terraform/",
    to: "/automation/terraform/",
  },

  {
    from: "/palette-cli/",
    to: "/automation/palette-cli/",
  },

  {
    from: "/palette-cli/install-palette-cli/",
    to: "/automation/palette-cli/install-palette-cli/",
  },

  {
    from: "/palette-cli/commands/",
    to: "/automation/palette-cli/commands/",
  },

  {
    from: "/user-management/palette-resource-limits/",
    to: "/tenant-settings/palette-resource-limits/",
  },
  // Redirects for tutorials that were removed from docs
  {
    from: "/registries-and-packs/deploy-pack",
    to: "/tutorials/profiles/deploy-pack",
  },
  {
    from: "/devx/apps/deploy-app",
    to: "/tutorials/cluster-deployment/pde/deploy-app",
  },
  {
    from: "/security-bulletins/index/",
    to: "/unlisted/index/",
  },
  {
    from: "/security-bulletins/cve-reports/",
    to: "/security-bulletins/reports/",
  },
  {
    from: [
      "/integrations/antrea-cni",
      "/integrations/aws-autoscaler",
      "/integrations/aws-ebs",
      "/integrations/aws-efs",
      "/integrations/azure-cni",
      "/integrations/azure-disk",
      "/integrations/byoos",
      "/integrations/calico",
      "/integrations/centos",
      "/integrations/certmanager",
      "/integrations/cilium",
      "/integrations/citrix-ipam",
      "/integrations/collectord",
      "/integrations/flannel-cni",
      "/integrations/fluentbit",
      "/integrations/frp",
      "/integrations/gce",
      "/integrations/grafana-spectrocloud-dashboards",
      "/integrations/harbor-edge",
      "/integrations/k3s",
      "/integrations/konvoy",
      "/integrations/kubernetes-dashboard",
      "/integrations/kubernetes-edge",
      "/integrations/kubernetes-generic",
      "/integrations/longhorn",
      "/integrations/metallb",
      "/integrations/microk8s",
      "/integrations/nfs-subdir-external",
      "/integrations/opa-gatekeeper",
      "/integrations/portworx",
      "/integrations/portworx_operator",
      "/integrations/prometheus-cluster-metrics",
      "/integrations/rke2",
      "/integrations/rook-ceph",
      "/integrations/trident",
      "/integrations/ubuntu",
      "/integrations/vsphere-csi",
      "/integrations/ngrok",
    ],
    to: "/integrations/",
  },
];

if (packRedirects.length > 0) {
  redirects = redirects.concat(packRedirects);
}

module.exports = redirects;
