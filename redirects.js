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
    to: `/registries-and-packs/registries/helm-charts/`,
  },
  {
    from: `/devx/registries/oci-registry/`,
    to: `/registries-and-packs/registries/oci-registry/`,
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
    to: `/tutorials/getting-started/palette/introduction-palette/`,
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
    from: [`/clusters/cluster-management/.ssh/`, `/clusters/cluster-management/ssh-keys/`],
    to: `/clusters/cluster-management/ssh/ssh-keys`,
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
    from: `/clusters/edge/edgeforge-workflow/build-kairos-os/`,
    to: `/clusters/edge/edgeforge-workflow/palette-canvos/`,
  },
  {
    from: `/clusters/edge/edgeforge-workflow/build-images/`,
    to: `/clusters/edge/edgeforge-workflow/palette-canvos/`,
  },
  {
    from: `/clusters/brownfield-clusters/`,
    to: `/clusters/imported-clusters/`,
  },
  {
    from: `/clusters/palette-virtual-clusters/add-virtual-cluster-to-host-cluster/`,
    to: `/clusters/palette-virtual-clusters/deploy-virtual-cluster/`,
  },
  {
    from: `/vm-management/vm-packs-profiles/enable-vm-dashboard/`,
    to: `/vm-management/rbac/add-roles-and-role-bindings/`,
  },
  {
    from: `/vm-management/vm-packs-profiles/vm-dashboard/`,
    to: `/vm-management/create-manage-vm`,
  },
  {
    from: `/vm-management/vm-packs-profiles/create-vm-dashboard-profile/`,
    to: `/vm-management/create-vmo-profile/`,
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
    from: `/clusters/cluster-management/palette-lock-cluster/`,
    to: `/clusters/cluster-management/platform-settings/`,
  },
  {
    from: `/registries-and-packs/helm-charts/`,
    to: `/registries-and-packs/registries/helm-charts/`,
  },
  {
    from: `/registries-and-packs/oci-registry/`,
    to: `/registries-and-packs/registries/oci-registry/`,
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
    from: "/user-management/saml-sso/palette-sso-azure-ad/",
    to: "/user-management/saml-sso/palette-sso-with-entra-id/",
  },
  {
    from: "/user-management/saml-sso/enable-saml/",
    to: "/user-management/saml-sso/",
  },
  {
    from: "/clusters/data-center/maas/install-manage-maas-pcg/",
    to: "/clusters/pcg/deploy-pcg/maas/",
  },
  {
    from: "/clusters/edge/networking/local-registry/",
    to: "/clusters/edge/site-deployment/deploy-custom-registries/local-registry/",
  },
  {
    from: "/clusters/edge/site-deployment/deploy-private-registry/",
    to: "/clusters/edge/site-deployment/deploy-custom-registries/deploy-private-registry/",
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
    from: "/clusters/public-cloud/azure/gateways/",
    to: "/clusters/pcg/",
  },
  {
    from: "/projects/",
    to: "/tenant-settings/projects/",
  },
  {
    from: "/enterprise-version/install-palette/airgap/checklist/",
    to: "/enterprise-version/install-palette/airgap/",
  },
  {
    from: "/enterprise-version/install-palette/airgap/kubernetes-airgap-instructions/",
    to: "/enterprise-version/install-palette/install-on-kubernetes/airgap-install/kubernetes-airgap-instructions/",
  },
  {
    from: "/enterprise-version/install-palette/airgap/vmware-vsphere-airgap-instructions/",
    to: "/enterprise-version/install-palette/install-on-vmware/airgap-install/environment-setup/vmware-vsphere-airgap-instructions/",
  },
  {
    from: "/vertex/install-palette-vertex/airgap/kubernetes-airgap-instructions/",
    to: "/vertex/install-palette-vertex/install-on-kubernetes/airgap-install/kubernetes-airgap-instructions/",
  },
  {
    from: "/vertex/install-palette-vertex/airgap/vmware-vsphere-airgap-instructions/",
    to: "/vertex/install-palette-vertex/install-on-vmware/airgap-install/environment-setup/vmware-vsphere-airgap-instructions/",
  },
  {
    from: "/vertex/install-palette-vertex/airgap/checklist/",
    to: "/vertex/install-palette-vertex/airgap/",
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
    from: "/palette-cli/commands/docs/",
    to: "/automation/palette-cli/commands/docs/",
  },

  {
    from: "/palette-cli/commands/ec/",
    to: "/automation/palette-cli/commands/ec/",
  },

  {
    from: "/palette-cli/commands/fips-validate/",
    to: "/automation/palette-cli/commands/fips-validate/",
  },

  {
    from: "/palette-cli/commands/login/",
    to: "/automation/palette-cli/commands/login/",
  },

  {
    from: "/palette-cli/commands/pcg/",
    to: "/automation/palette-cli/commands/pcg/",
  },

  {
    from: "/palette-cli/commands/pde/",
    to: "/automation/palette-cli/commands/pde/",
  },

  {
    from: "/palette-cli/commands/project/",
    to: "/automation/palette-cli/commands/project/",
  },

  {
    from: "/palette-cli/commands/validator/",
    to: "/automation/palette-cli/commands/ec/",
  },
  {
    from: "/user-management/palette-resource-limits/",
    to: "/tenant-settings/palette-resource-limits/",
  },
  {
    from: "/clusters/edge/edgeforge-workflow/build-content-bundle",
    to: "/clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle",
  },
  {
    from: "/clusters/edge/edgeforge-workflow/palette-canvos/build-artifacts",
    to: "/clusters/edge/edgeforge-workflow/palette-canvos/build-content-bundle",
  },
  // Redirects for tutorials that were removed from docs
  {
    from: "/registries-and-packs/deploy-pack",
    to: "/tutorials/profiles/deploy-pack",
  },
  {
    from: "/clusters/pcg/deploy-app-pcg",
    to: "/tutorials/cluster-deployment/pcg/deploy-app-pcg",
  },
  {
    from: "/devx/apps/deploy-app",
    to: "/tutorials/cluster-deployment/pde/deploy-app",
  },
  {
    from: "/clusters/cluster-management/update-k8s-cluster",
    to: "/tutorials/cluster-management/update-maintain/update-k8s-cluster",
  },
  {
    from: "/clusters/edge/site-deployment/deploy-cluster",
    to: "/tutorials/edge/deploy-cluster",
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
    from: "/byoos/usecases/",
    to: "/byoos/image-builder/build-image-vmware/",
  },
  {
    from: "/byoos/usecases/vmware/",
    to: "/byoos/image-builder/build-image-vmware/",
  },
  {
    from: "/byoos/usecases/vmware/konvoy/",
    to: "/byoos/image-builder/build-image-vmware/konvoy/",
  },
  {
    from: "/byoos/usecases/vmware/rhel-pxk/",
    to: "/byoos/image-builder/build-image-vmware/rhel-pxk/",
  },
  {
    from: "/byoos/capi-image-builder/build-image-vmware/rhel-capi/",
    to: "/byoos/capi-image-builder/build-image-vmware/non-airgap-build/rhel-capi/",
  },
  {
    from: "/byoos/capi-image-builder/build-image-vmware/rocky-capi/",
    to: "/byoos/capi-image-builder/build-image-vmware/non-airgap-build/rocky-capi/",
  },
  {
    from: "/automation/palette-cli/commands/validator/",
    to: "/automation/palette-cli/commands/ec/",
  },
  {
    from: "/enterprise-version/install-palette/install-on-vmware/airgap-install/vmware-vsphere-airgap-instructions/",
    to: "/enterprise-version/install-palette/install-on-vmware/airgap-install/environment-setup/vmware-vsphere-airgap-instructions/",
  },
  {
    from: "/vertex/install-palette-vertex/install-on-vmware/airgap-install/vmware-vsphere-airgap-instructions/",
    to: "/vertex/install-palette-vertex/install-on-vmware/airgap-install/environment-setup/vmware-vsphere-airgap-instructions/",
  },
  {
    from: "/legal-licenses/oss-licenses/",
    to: "/legal-licenses/oss-licenses-index/",
  },
  {
    from: "/clusters/cluster-management/noc-ui/",
    to: "/clusters/cluster-management/cluster-map-filters/",
  },
  {
    from: "/getting-started/introduction/",
    to: "/tutorials/getting-started/palette/introduction-palette/",
  },
  {
    from: "/getting-started/aws/",
    to: "/tutorials/getting-started/palette/aws/",
  },
  {
    from: "/getting-started/aws/setup/",
    to: "/tutorials/getting-started/palette/aws/setup/",
  },
  {
    from: "/getting-started/aws/create-cluster-profile/",
    to: "/tutorials/getting-started/palette/aws/create-cluster-profile/",
  },
  {
    from: "/getting-started/aws/deploy-k8s-cluster/",
    to: "/tutorials/getting-started/palette/aws/deploy-k8s-cluster/",
  },
  {
    from: "/getting-started/aws/update-k8s-cluster/",
    to: "/tutorials/getting-started/palette/aws/update-k8s-cluster/",
  },
  {
    from: "/getting-started/aws/deploy-manage-k8s-cluster-tf/",
    to: "/tutorials/getting-started/palette/aws/deploy-manage-k8s-cluster-tf/",
  },
  {
    from: "/getting-started/aws/scale-secure-cluster/",
    to: "/tutorials/getting-started/palette/aws/scale-secure-cluster/",
  },
  {
    from: "/getting-started/gcp/",
    to: "/tutorials/getting-started/palette/gcp/",
  },
  {
    from: "/getting-started/gcp/setup/",
    to: "/tutorials/getting-started/palette/gcp/setup/",
  },
  {
    from: "/getting-started/gcp/create-cluster-profile/",
    to: "/tutorials/getting-started/palette/gcp/create-cluster-profile/",
  },
  {
    from: "/getting-started/gcp/deploy-k8s-cluster/",
    to: "/tutorials/getting-started/palette/gcp/deploy-k8s-cluster/",
  },
  {
    from: "/getting-started/gcp/update-k8s-cluster/",
    to: "/tutorials/getting-started/palette/gcp/update-k8s-cluster/",
  },
  {
    from: "/getting-started/gcp/deploy-manage-k8s-cluster-tf/",
    to: "/tutorials/getting-started/palette/gcp/deploy-manage-k8s-cluster-tf/",
  },
  {
    from: "/getting-started/gcp/scale-secure-cluster/",
    to: "/tutorials/getting-started/palette/gcp/scale-secure-cluster/",
  },
  {
    from: "/getting-started/azure/",
    to: "/tutorials/getting-started/palette/azure/",
  },
  {
    from: "/getting-started/azure/setup/",
    to: "/tutorials/getting-started/palette/azure/setup/",
  },
  {
    from: "/getting-started/azure/create-cluster-profile/",
    to: "/tutorials/getting-started/palette/azure/create-cluster-profile/",
  },
  {
    from: "/getting-started/azure/deploy-k8s-cluster/",
    to: "/tutorials/getting-started/palette/azure/deploy-k8s-cluster/",
  },
  {
    from: "/getting-started/azure/update-k8s-cluster/",
    to: "/tutorials/getting-started/palette/azure/update-k8s-cluster/",
  },
  {
    from: "/getting-started/azure/deploy-manage-k8s-cluster-tf/",
    to: "/tutorials/getting-started/palette/azure/deploy-manage-k8s-cluster-tf/",
  },
  {
    from: "/getting-started/azure/scale-secure-cluster/",
    to: "/tutorials/getting-started/palette/azure/scale-secure-cluster/",
  },
  {
    from: "/getting-started/vmware/",
    to: "/tutorials/getting-started/palette/vmware/",
  },
  {
    from: "/getting-started/vmware/setup/",
    to: "/tutorials/getting-started/palette/vmware/setup/",
  },
  {
    from: "/getting-started/vmware/deploy-pcg/",
    to: "/tutorials/getting-started/palette/vmware/deploy-pcg/",
  },
  {
    from: "/getting-started/vmware/create-cluster-profile/",
    to: "/tutorials/getting-started/palette/vmware/create-cluster-profile/",
  },
  {
    from: "/getting-started/vmware/deploy-k8s-cluster/",
    to: "/tutorials/getting-started/palette/vmware/deploy-k8s-cluster/",
  },
  {
    from: "/getting-started/vmware/update-k8s-cluster/",
    to: "/tutorials/getting-started/palette/vmware/update-k8s-cluster/",
  },
  {
    from: "/getting-started/vmware/deploy-manage-k8s-cluster-tf/",
    to: "/tutorials/getting-started/palette/vmware/deploy-manage-k8s-cluster-tf/",
  },
  {
    from: "/getting-started/vmware/scale-secure-cluster/",
    to: "/tutorials/getting-started/palette/vmware/scale-secure-cluster/",
  },
  {
    from: "/getting-started/additional-capabilities/",
    to: "/tutorials/getting-started/additional-capabilities/",
  },
  {
    from: "/getting-started/additional-capabilities/edge/",
    to: "/tutorials/getting-started/additional-capabilities/",
  },
  {
    from: "/getting-started/additional-capabilities/self-hosted/",
    to: "/tutorials/getting-started/additional-capabilities/self-hosted/",
  },
  {
    from: "/getting-started/additional-capabilities/vmo/",
    to: "/tutorials/getting-started/additional-capabilities/vmo/",
  },
  {
    from: "/clusters/cluster-management/reconfigure/",
    to: "/clusters/cluster-management/node-pool/",
  },
  {
    from: "/security/lifecycle/secure-development/",
    to: "/security/lifecycle/",
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
  {
    from: [
      "/security-bulletins/reports/cve-2020-1971",
      "/security-bulletins/reports/cve-2021-3449",
      "/security-bulletins/reports/cve-2021-3711",
      "/security-bulletins/reports/cve-2021-45079",
      "/security-bulletins/reports/cve-2022-0778",
      "/security-bulletins/reports/cve-2023-52425",
      "/security-bulletins/reports/cve-2023-5528",
      "/security-bulletins/reports/prisma-2022-0227",
    ],
    to: "/security-bulletins/reports/",
  },
  {
    from: "/clusters/cluster-management/cluster-tag-filter/",
    to: "tenant-settings/filters/",
  },
  {
    from: "/clusters/cluster-management/cluster-tag-filter/create-add-filter/",
    to: "tenant-settings/filters/",
  },
  {
    from: "/user-management/new-user/",
    to: "/user-management/users-and-teams/create-user/",
  },
  {
    from: "/user-management/project-association/",
    to: "/user-management/palette-rbac/assign-a-role/",
  },
  {
    from: [
      "/security-bulletins/reports/cve-2005-2541",
      "/security-bulletins/reports/cve-2012-2663",
      "/security-bulletins/reports/cve-2015-20107",
      "/security-bulletins/reports/cve-2015-8855",
      "/security-bulletins/reports/cve-2016-1585",
      "/security-bulletins/reports/cve-2016-20013",
      "/security-bulletins/reports/cve-2017-11164",
      "/security-bulletins/reports/cve-2018-20225",
      "/security-bulletins/reports/cve-2018-20657",
      "/security-bulletins/reports/cve-2018-20796",
      "/security-bulletins/reports/cve-2018-20839",
      "/security-bulletins/reports/cve-2019-1010022",
      "/security-bulletins/reports/cve-2019-12900",
      "/security-bulletins/reports/cve-2019-17543",
      "/security-bulletins/reports/cve-2019-19244",
      "/security-bulletins/reports/cve-2019-9192",
      "/security-bulletins/reports/cve-2019-9674",
      "/security-bulletins/reports/cve-2019-9923",
      "/security-bulletins/reports/cve-2019-9936",
      "/security-bulletins/reports/cve-2019-9937",
      "/security-bulletins/reports/cve-2020-35512",
      "/security-bulletins/reports/cve-2020-36325",
      "/security-bulletins/reports/cve-2021-3737",
      "/security-bulletins/reports/cve-2021-39537",
      "/security-bulletins/reports/cve-2021-42694",
      "/security-bulletins/reports/cve-2021-46848",
      "/security-bulletins/reports/cve-2022-0391",
      "/security-bulletins/reports/cve-2022-23990",
      "/security-bulletins/reports/cve-2022-25883",
      "/security-bulletins/reports/cve-2022-28357",
      "/security-bulletins/reports/cve-2022-28948",
      "/security-bulletins/reports/cve-2022-41409",
      "/security-bulletins/reports/cve-2022-41723",
      "/security-bulletins/reports/cve-2022-41724",
      "/security-bulletins/reports/cve-2022-41725",
      "/security-bulletins/reports/cve-2022-45061",
      "/security-bulletins/reports/cve-2022-48560",
      "/security-bulletins/reports/cve-2022-48565",
      "/security-bulletins/reports/cve-2022-4899",
      "/security-bulletins/reports/cve-2023-0464",
      "/security-bulletins/reports/cve-2023-24329",
      "/security-bulletins/reports/cve-2023-24534",
      "/security-bulletins/reports/cve-2023-24536",
      "/security-bulletins/reports/cve-2023-24537",
      "/security-bulletins/reports/cve-2023-24538",
      "/security-bulletins/reports/cve-2023-24539",
      "/security-bulletins/reports/cve-2023-24540",
      "/security-bulletins/reports/cve-2023-26604",
      "/security-bulletins/reports/cve-2023-27534",
      "/security-bulletins/reports/cve-2023-29400",
      "/security-bulletins/reports/cve-2023-29403",
      "/security-bulletins/reports/cve-2023-29499",
      "/security-bulletins/reports/cve-2023-32636",
      "/security-bulletins/reports/cve-2023-37920",
      "/security-bulletins/reports/cve-2023-39325",
      "/security-bulletins/reports/cve-2023-4156",
      "/security-bulletins/reports/cve-2023-44487",
      "/security-bulletins/reports/cve-2023-45142",
      "/security-bulletins/reports/cve-2023-45287",
      "/security-bulletins/reports/cve-2023-47108",
      "/security-bulletins/reports/cve-2023-49569",
      "/security-bulletins/reports/cve-2023-52356",
      "/security-bulletins/reports/cve-2024-0743",
      "/security-bulletins/reports/cve-2024-0760",
      "/security-bulletins/reports/cve-2024-1737",
      "/security-bulletins/reports/cve-2024-1975",
      "/security-bulletins/reports/cve-2024-21626",
      "/security-bulletins/reports/cve-2024-24790",
      "/security-bulletins/reports/cve-2024-32002",
      "/security-bulletins/reports/cve-2024-35325",
      "/security-bulletins/reports/cve-2024-3651",
      "/security-bulletins/reports/cve-2024-37370",
      "/security-bulletins/reports/cve-2024-37371",
      "/security-bulletins/reports/cve-2024-38428",
      "/security-bulletins/reports/cve-2024-45490",
      "/security-bulletins/reports/cve-2024-45491",
      "/security-bulletins/reports/cve-2024-45492",
      "/security-bulletins/reports/cve-2024-6197",
      "/security-bulletins/reports/cve-2024-6232",
      "/security-bulletins/reports/cve-2024-7592",
    ],
    to: "/security-bulletins/reports/",
  },
  {
    from: "/tutorials/cluster-management/public-cloud/deploy-k8s-cluster/",
    to: "/getting-started/",
  },
  {
    from: "/clusters/public-cloud/deploy-k8s-cluster/",
    to: "/getting-started/",
  },
  {
    from: "/spectro-downloads",
    to: "/downloads/cli-tools/",
  },
  {
    from: "/component/",
    to: "/downloads/cli-tools/",
  },
  {
    from: "/enterprise-version/install-palette/airgap/supplemental-packs/",
    to: "/downloads/self-hosted-palette/additional-packs/",
  },
  {
    from: "/vertex/install-palette-vertex/airgap/supplemental-packs/",
    to: "/downloads/palette-vertex/additional-packs/",
  },
  {
    from: "/vertex/install-palette-vertex/airgap/offline-docs/",
    to: "/downloads/offline-docs/",
  },
];

if (packRedirects.length > 0) {
  redirects = redirects.concat(packRedirects);
}

module.exports = redirects;
