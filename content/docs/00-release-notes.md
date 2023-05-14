---
title: "Release Notes"
metaTitle: "Release Notes"
metaDescription: "Spectro Cloud release notes for Palette and its sub-components."
icon: "audits"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# March 19, 2023 - Release 3.3.0

This release contains several security fixes and new features for Edge. The Edge installation process has been improved to allow users greater flexibility and more control over the installation process.

## Palette

### Enhancements:

* Users can now download all the clusters listed when applying a filter to the clusters list. 

## Edge

### Features:

* Edge now supports the ability to load images from an external OCI registry.
* The Edge Installer can now include preloaded content bundles containing packages and artifacts. This is useful for scenarios where you work with limited internet bandwidth or want to optimize the installation process.
* Users can now create custom Edge Installer images to support advanced scenarios such as Bring Your Own Operating System (BYOOS), installing additional OS packages, preloading content into the installer, and more.
* Support for creating Virtual Machine Disks (VMDK) from the Edge installer ISO is now available. Use this to simplify deployments into VMware-based environments.
* Support for generating random UUID values for the Edge host is now available. This addresses the issue of some devices having the same Universal Unique Identifier (UUID) due to identical device identifiers.

## Packs

* CNI Packs:
  * Calico CNI 3.25.0
* CSI Packs:
  * EBS CSI 1.16.0
  * vSphere CSI 2.7.0
* Add-on Packs:
  * Flux v2 2.6.0
  * Prometheus Operator 45.4.0
  * MetalLB 0.13.9
  * Spectro Proxy 1.3.0

# February 28, 2023 - Release 3.2.0

Release 3.2 introduces support for a new public cloud provider, Cox Edge. Other highlights include a streamlined experience for installing the Kubernetes Dashboard in a cluster, a new security scan, auto registration capabilities for edge devices, new [out-of-the-box services](/devx/app-profile/services/service-listings), and many other product enhancements. 

## Palette

### Features:

* Support for the [Cox Edge](/clusters/public-cloud/cox-edge/) cloud provider is now available in Palette.
* Palette introduces a new user sign-in flow for users who previously created an account through SSO and who are a member of different organizations. Palette prompts you to select the organization to log in to. If you need help remembering, you can retrieve it using “Forgot your organization name?”.
* Palette now provides a streamlined experience for users when installing [Kubernetes dashboard](/integrations/spectro-k8s-dashboard). When adding Kubernetes dashboard as a pack, Palette displays relevant configuration items directly in the pack UI.
* Palette now auto-cleans deleted clusters, deployments, cluster profiles, cloud accounts, edge hosts, and other resources. Users can expect auto cleanup to take approximately 15 minutes.
* Additional filtering options are available to apply to clusters. Users can filter by region and country with pre-populated values based on cluster information and by ‘Unknown’ state.
* Palette now provides a way to search and filter private cloud gateways (PCGs) by resource tag. 
* Palette provides the ability to schedule OS patching for enterprise clusters and PCGs. OS patching applies to clusters that have a master pool with multiple nodes.
* Palette provides a **tag.update** permission that can be assigned to user roles that allows modifying resource tags. 
* Palette introduces a Software Bill of Materials [(SBOM) scan](/clusters/cluster-management/compliance-scan/#sbom:dependencies&vulnerabilities) capability that can be invoked manually or scheduled to run on tenant clusters. Multiple output formats are available.
* Palette offers two new app services: CockroachDB and HashiCorp Vault.
* Palette provides access to configuration and status [logs for each application](/devx/apps/logs/). 
* Palette now allows you to revise the order of layers as you create an app profile.
* Virtual clusters now support the ability to [back up all disk volumes](/clusters/cluster-groups/cluster-group-backups) within the cluster.
* A system cluster profile named **nginx-ingress** is now available to help users [set up ingress endpoints](/clusters/cluster-groups/ingress-cluster-group) for cluster groups.

### Enhancements:

* [Cluster groups](/clusters/cluster-groups) that were previously supported only at the tenant scope are now supported at the project scope.
* Palette has improved the launch time for virtual clusters.
* [Virtual clusters can be resized](/devx/palette-virtual-clusters/resize-virtual-clusters) from the default to a size that does not exceed the system-level quota for a cluster group like Beehive or the user quota for tenant-level cluster groups.
* Virtual clusters now display a progress status during the creation phase.
* The App profile container service layer contains additional [output variables](/devx/app-profile/app-profile-macros#containerserviceoutputvariables) to help services connect. Refer to the [service connectivity](/devx/app-profile/services/connectivity) document for additional guidance.
* We optimized the Spectro Cloud Postman [collection](/api/postman-collection) to circumvent a nested levels [bug](https://github.com/postmanlabs/postman-app-support/issues/10928) in Postman.

### Deprecations

* Enabling virtual clusters on host clusters is deprecated. Use [cluster groups](/clusters/cluster-groups) to enable virtual clusters moving forward. Cluster groups are also now supported at the [project](/projects) scope.

## Edge

### Features:

* Palette provides the ability to automatically register edge hosts for a specific project when a host authentication token is specified in **Tenant Settings > Registration Tokens**. 

* Bring Your Own OS (BYOS) support.

## Packs
* OS packs:
  * Ubuntu 22.04 on AWS, Azure, GCP
* K8s packs:
  * Support for K8s 1.26.1
  * Support for K8s 1.25.6
  * Support for K8s 1.24.10
  * Support for K8s 1.23.16
  * Support for Tencent TKE 1.0.0 on VMware
* CNI Packs:
  * Calico CNI 3.24.5
  * Cilium CNI 1.12.6
  * Antrea CNI for VMware 1.9.0
* CSI Packs:
  * EFS CSI 1.4.9
  * Azure Disk CSI 1.25.0
  * GCE Persistent Disk CSI 1.8.2
  * Rook-Ceph CSI 1.10.0
* Add-on Packs:
  * Kong Ingress 2.13.1
  * K8S Dashboard 2.7.0
  * External DNS 0.13.1
  * Open Policy Agent 3.11.0
  * Reloader 0.0.129
  * External 0.7.1
  * Vault 0.23.0
  * Nginx Ingress 1.5.1 
  * AWS Application Load Balancer 2.4.6
  * Prometheus Operator 44.3.0
  * Bring Your Own OS (BYOS) pack 1.1.0
  * Spectro Proxy 1.2.0

<br />




# December 28, 2022 - Release 3.1.0

Palette 3.1 is released with support for AWS GovCloud, FIPS compliant PXK, and PXK-E Kubernetes versions. This release also features Autoscalers for IaaS clusters, FIPS enablement at the scope level, cluster tagging, and the ability to use tags for resource filtering and access control. The Palette Developer Experience (PDE) product also contains several enhancements that improve the user experience, such as the ability to pause and resume clusters, new services for app profiles, and more. 

## Palette

### Upgrade Notes:

* MaaS cluster's initialization configuration has been updated to disable memory swap. This will result in MaaS cluster nodes becoming repaved when applying the new configuration.

### Features: 

* Palette supports integration with [AWS GovCloud services](/clusters/public-cloud/aws/add-aws-accounts#prerequisites) to meet the compliance mandates for safeguarding sensitive data by strengthening identity management, improving cloud visibility, and protecting accounts and workloads to support mission-critical workloads for government customers.
* [Autoscaling](/clusters/cluster-management/node-pool#workerpool) capabilities for Palette IaaS clusters to ensure better availability and cost management for dynamic workloads.
* Palette is now compliant with FIPS compliance and provides a [FIPS-compliant](/compliance#fips140-2) version of Kubernetes (PXK and PXK-E).  Palette FIPS support is extended at the platform Level with the tenant and project Scope and cluster level with FIPS compliant infrastructure layer cluster profiles.
* Palette supports tagging and the ability to filter user [access](/clusters/cluster-management/cluster-tag-filter) and [visibility](/clusters/cluster-management/noc-ui#monitoryourclusterlocation) to clusters using tags. You can filter geographically dispersed clusters in the Palette map view and list view using [flexible filters](/clusters/cluster-management/noc-ui#mapfilters) to have a granular view of cluster information.
* Palette supports app profile versioning. Versioning enables users to create multiple [versions of an App Profile](/devx/app-profile/versioning-app-profile#appprofileversioning) within the scope of a single profile name. 
* Palette supports the [cloning](/devx/app-profile/app-profile-cloning#cloneappprofiles) of App Profiles across multiple projects. For example, you can clone an app profile created under a specific project to another project within the same tenant. 
* Palette Dev Engine supports the manual and system update of an [App Profile](/devx/app-profile/versioning-app-profile#appprofileversioning). You can verify the update notification and apply the changes to the Apps.
* Palette app mode now supports the use of [containers](/devx/app-profile#services). You can specify containers when creating an app profile.
* Palette leverages [Helm and OCI registries](/devx/registries#custompackregistry) for custom pack management. 
* Palette provides [out-of-the-box](/devx/app-profile#messagingsystemservices) support for application services such as Kafka, MySQL, NATS, and more for Palette Dev Engine. These services can be specified when creating an App Profile.
* Palette allows you to [pause and resume](/devx/palette-virtual-clusters/pause-restore-virtual-clusters#overview) virtual clusters that are not in use. This adds significant flexibility in managing the operating costs and optimizing resource management for virtual clusters.

### Enhancements:

* [OS patch reboot](/clusters/cluster-management/os-patching#rebootifrequired) allows clusters to reboot to apply system updates if required.

* Palette Tencent clusters now support using [security groups](/clusters/public-cloud/tke#deployatencentcluster) for network isolation and improved security.

* Reduced launch time when creating Palette Virtual Clusters.

* Palette Virtual Clusters now support ephemeral storage.

### Deprecations:

* Deprecated API : GET/v1/dashboard/projects , new API: POST /v1/dashboard/projects

* Deprecated API: POST /v1/dashboard/spectroclusters , new API: POST /v1/dashboard/spectroclusters/search

### Known Issues:

* Palette does not allow scaling of control plane nodes for the Microk8s pack. The workaround is to remove the scaling limit of the control plane.

* Currently, Microk8s does not support an out-of-box service load balancer.
  * Work Around: To avoid this, you can install the [AWS Application Load Balancer](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.4/guide/service/nlb/) pack. The packs containing service type as a load balancer will require annotation and `loadBalancerClass` changes.

## Edge

### Features:

* Palette supports the provision of [MicroK8s clusters](/integrations/microk8s#microk8soverview). Microk8s deployments are quick and ideal when creating disposal Kubernetes clusters. The MicroK8s pack supports automatic updates, security configuration, and the ability to self-update Kubernetes dependencies.

## [Spectro Image Updates](/spectro-downloads#on-premartifacts):

* Private Cloud Gateway Installer updated to version 1.4.0.
* On-Prem Installer updated to version 2.4.0.
* Air Gap Repo Appliance updated to version 2.1.0.
* EDGE Installer version 2.2.23.

## [Packs and Integrations](/integrations):

* csi-longhorn version 1.3.1 
* csi-longhorn-addon version 1.3.1 
* kafka-operator version 0.32.0 
* mysql-operator version 0.6.2 
* nats-operator version 0.18.2 
* palette-upgrader version 3.0.70 
* palette-upgrader version 3.0.51 
* spectro-k8s-dashboard version 2.6.0 


# October 24, 2022 - Release 3.0.0

Spectro Cloud Palette 3.0.0 is released with [Native Edge](/clusters/edge), [Palette Dev Engine](/devx), [NOC-UI](/clusters/cluster-management/noc-ui), and many more exciting capabilities.

**Features**

* A new set of capabilities that improve the [developer experience](/devx) are introduced in this release:
  * Rapid Application deployment with a smooth onboarding experience.
  * RBAC with a developer-centric view.
  * System scope resource quota.
  * System Scope Cluster groups to host [Palette Virtual Clusters](/clusters/palette-virtual-clusters).
  * Out-of-the-box application profiles and applications deployment with Palette Virtual Clusters. 
  * Application profiles can consists of Helm charts, Manifests, and Database services such as MongoDB, Redis, PostgreSQL 

* The Palette [Native Edge](/clusters/edge#edgenative) architecture is an instance of Palette Edge Distribution. The Palette Edge instance is based on the desired version of Operating System-Kubernetes installed natively onto the edge devices. All the Day 1 and Day 2 Operations starting from Installation to Scaling, Upgrades, and Reconfigurations, will be managed by the Palette Console.

* Palette provides intuitive, location-based UI that monitors clusters with [NOC-UI](/clusters/cluster-management/noc-ui). 

* Palette enterprise mode production clusters can be backed up to [Azure Blob storage](/clusters/cluster-management/backup-restore#forazureblobbackup) for convenient restoration.

* Palette provisions cluster monitoring with [Kubernetes Dashboard](/integrations/spectro-k8s-dashboard) exposed to external traffic using [Spectro Proxy](/integrations/frp) pack with RBAC authentication.

**Enhancements**

* Palette enables the provisioning of private Azure Kubernetes Clusters (AKS) clusters within Azure Virtual networks (VNet) for enhanced security by offloading the orchestration to a [Private Cloud Gateway](/clusters/public-cloud/azure/gateways) deployed within the same account as the private AKS clusters.

* Operators can now customize the [pod limit](https://learn.microsoft.com/en-us/azure/aks/) for AKS clusters. Customize the pod limit value from the Kubernetes configuration [file](/clusters/cluster-management/node-pool) at any time by editing the `maxPodPerNode` value.

* The Kubernetes Packs for [Edge Native](/clusters/edge/architecture#kubernetesdefaults) deployments disable a few items by default to allow users to install those items independently or to avoid duplication.

* The latest Palette Terraform releases, [Module 0.4.1 and Module 0.10.1](/terraform), support:
  * Native Edge clusters
  * Palette Virtual Clusters
  * Fixes towards [Enhancements](/terraform#changes)

**Packs and Integrations**

* Dex version 2.35.1
* Harbor version 1.9.3
* Istio version 1.14.3
* Image Swap version 1.5.1
* Generic-VM Libvirt version 1.0.1
* Generic VM vSphere version 1.0.3
* Tekton-chains version 0.12.0
* Tekton-operator version 0.61.0
* K3s version 1.24.4
* Spectro Proxy version 1.1.0
* External DNS version 0.12.2
* MetalLB-version version 0.13.5
* Reloader version version 0.0.118
* AWS Cluster Autoscaler version 1.22.2
* Fluentbit version 1.9.6
* Kubernetes dashboard version 2.6.1
* Calico version 3.24
* Cert-Manager version 1.9.1
* Open Policy Agent version 3.9.0
* AWS EBS  CSI version 1.10.0

**Known Issues**

* While deploying multiple apps in a Palette Virtual Cluster, if the deployment of one of the apps is blocked due to errors, then subsequent apps deployed to the same virtual cluster might also be stuck in deploying state.  Apply the following workarounds if you encounter the issue.

  * Delete the stuck App.
  * Fix the App with the error.
  * Redeploy the App again.  
# September 10, 2022 - Release 2.8.0
Spectro Cloud Palette 2.8.0 is now available with the support of Palette Virtual Clusters, Web-Based Kubectl, Import and Export of Profiles, Terraform Releases, and many exciting enhancements. 

**Features**
* Palette now supports lightweight, cost-effective, secure, and resource-efficient [Palette Virtual Clusters](/clusters/palette-virtual-clusters) to rapidly create securely-isolated environments for applications without the infrastructure and operational overhead of additional Kubernetes clusters.
* Palette leverages web-based [Kubectl](/clusters/cluster-management/palette-webctl#overview) for the users to deploy applications, inspect and manage cluster resources, and view logs via the Palette terminal without an external terminal. 
* Palette enables the reuse and sharing of large profiles with many add-ons and integrations to be [exported and imported](/cluster-profiles/cluster-profile-import-export#overview) across multiple environments, projects, and tenants. 
* Palette customers can now provision the fully conformant Kubernetes distribution [RKE2](/integrations/rke2#rke2overview) focusing on security and compliance.
* The latest Palette Terraform releases, [Module 0.2.3 and Module 0.3.0](/terraform#moduletoprovidercompatibilitymatrix), focus on:
  * Cluster resource tagging
  * Static placement of AKS clusters
  * VMware cloud-type support of Terraform modules 
  * Image template support

**Enhancements**
* Palette upgrades the vSphere Private Cloud Gateways and On-Prem cluster specifications to newer versions:

   * K8s version has been upgraded from 1.21 to 1.22.12 [ the latest version in 1.22 ]
   
   * The storage layer has been upgraded from 2.3 to 2.5.2 to fix volume attachment issues
   
   * Ubuntu OS has been upgraded from LTS 18.04 to LTS 20.04
   
   * The PCG and On-Premise images now have all the latest OS patches updated

* Palette enables [Cluster(s) Lock](/clusters/cluster-management/palette-lock-cluster#overview) to restrict the cluster(s) under the Tenant, Project, or single cluster from being upgraded from cluster management services upgrade on the upgrade of the Palette.
* Palette feeds observability of [OS patching details](/clusters/cluster-management/os-patching#monitoring) such as `Last Applied Patch Time` and `The date and time of the last OS Patch.`
* Palette boards the mapping between cluster profiles and clusters in cluster profiles details UI page listing the clusters created using a specific cluster profile.
* Palette promotes VNet Resource Group filtering for AKS clusters, allowing the VNet to be a part of a different resource group than the AKS resource group.
* Palette enables the users to override the [custom folder](/clusters/data-center/vmware#deployingavmwarecluster) for vSphere templates, in addition to the default image template folder, `spectro-templates` for the vSphere environment.
* [Regex Expression](/workspace#regexfornamespaces) for mass selection of workspace names for role binding. 
* Palette also leverages the single sign-on, using SAML/OIDC integration with [Google Identity](/user-management/saml-sso#oidcbasedsso).
* Palette enables the customers to optionally disable the [OIDC associate provider](/clusters/public-cloud/aws/eks) for EKS clusters if the service provider restricts the cluster deployment in OIDC enabled state.
* Tenant administrators can now set the [Palette resource limits](/user-management/palette-resource-limits#setresourcelimit) though the Palette console.
* Palette provisions user's [infrastructure privacy](/clusters/public-cloud/azure#deployinganazurecluster) for the Azure cloud account.

**Deprecations**

* **API Deprecations**

   * Deprecated API: `GET /v1/clusterprofiles` <br />
     New API       : `POST /v1/dashboard/clusterprofiles` with better filter support 
   * Deprecated API: `GET /v1/projects` <br />
     New API       : `POST /v1/dashboard/projects` with better filter support
   * Deprecated API: `GET /v1/spectroclusters` <br />
     New API       : `POST /v1/dashboard/spectroclusters` with better filter support
   * Deprecated API: `GET /v1/spectroclusters/{uid}/packs/{packName}/config`. <br />
     New API       : `GET /v1/spectroclusters/{uid}/profiles/{profileUid}/packs/{packName}/config` with multiple cluster profiles support within cluster, the profileUid is required to locate a uniquely within the cluster


* **Pack Deprecations:**

  * Azure Kubernetes Services (AKS) 1.21
  
**Packs and Integrations** 

* Nginx 1.3.0
* Thanos - 10.5.3
* EFK - 7.17.3
* Kubernetes Dashboard - 2.6.0
* Vault - 0.20.1
* Calico - 3.23
* Calico for Azure - 3.23
* AWS EBS CSI - 1.8.0
* AWS EFS - 1.4.0
* AWS EFS -addon - 1.4.0
* gce-pd-csi-driver-v1.7.1
* Portworx-generic-addon-v2.11.2
* Portworx-generic-v2.11.2
* vSphere_csi_2.5.2

**Known Issues**

* AKS Clusters in v1beta1 environment gives an empty report for Kubernetes Conformance Testing (Sonobuoy scan). 
* OS Patch information not getting displayed for clusters with os patch scheduled on boot.



# July 17, 2022 - Release 2.7.0
Spectro Cloud Palette 2.7 is released with advanced features supporting Windows Worker Node Pools, Canonical Ubuntu Advantage, Cluster Migration from Private Cloud Gateway, enhanced Workspace, and more.

**Features:**
* Spectro Cloud Palette has enhanced the import cluster functionality with ["minimal permission"](/clusters/brownfield-clusters#importingabrownfieldcluster) mode and the "full permission" mode. Users can start exploring Palette by importing a cluster in a minimal model without granting the full administrative set of permissions. Over time, users can grant additional permissions to manage Day 2 operations.
* Palette now supports [Windows worker nodes](/clusters/public-cloud/azure) in addition to the  Linux worker nodes for Azure Kubernetes Services (AKS) clusters.
* Palette ensures Security and OS patching benefits with [Canonical's Ubuntu Advantage](/integrations/ubuntu#ubuntuadvantage) for Infrastructure subscription with Ubuntu as an OS layer for multiple operating environments.
* Automatically scale the workload resources of your Azure Kubernetes Services (AKS) clusters with [AKS Autoscaler](/clusters/public-cloud/azure) to meet the dynamic user workloads.
* Palette leverages the Container Storage Interface (CSI) and Container Network Interface (CNI) layers using Helm Chart  in addition to manifest-based deployment.
* Palette introduces a well-defined [color scheme to monitor](/clusters/cluster-management/pack-monitoring#packmonitoring) the different stages of pack deployment during cluster creation.
* Palette [Edge Clusters](/clusters/edge) deployed on remote bare metal or virtual machines appliances providing end-to-end support on deployment, scaling, upgrades and reconfiguration.
 
**Enhancements:**

* Palette [Azure CNI Pack](/integrations/azure-cni#azurecni) ensures advanced traffic flow control using Calico Policies for AKS clusters.
* Palette supports the [migration of Private Cloud Gateway (PCG)](/enterprise-version/enterprise-cluster-management#palettepcgmigration) traffic from unhealthy to healthy PCG without compromising service availability. 
* Palette Workspace upgraded with
  * [Resource Quota](/workspace/workload-features#workspacequota) allocation for Workspaces, Namespaces, and Clusters.
  * [Restricted Container Images](/workspace/workload-features#restrictedcontainerimages) feature to restrict the accidental deployment of a delisted or unwanted container to a specific namespace.
  * Enable the collective role binding of namespaces using [regular expressions for namespaces](/workspace#regexfornamespaces) selection.
  * Selective [Resource Restore](/workspace/workload-features#restoreyourbackup) from Workspace Backup across Cluster resources, Node Ports, and Persistent Volumes. 
* Palette provides visibility into [Role Binding and Cluster Role Binding](/clusters/cluster-management/workloads#overview) resources running inside our workload clusters.

# May 30, 2022 - Release 2.6.0

Spectro Cloud Palette 2.6 is released to support Cluster Profile Version, EKS Secret Encryption, CSI Storageclass, and added Parameters capabilities.

**Features:**

* Palette supports multiple [versions](/cluster-profiles/task-define-profile#clusterprofileversioning) of a single-cluster profile under a unique name to allow backward compatibility. 

* Palette leverages AWS Key Management Service (KMS) to provide envelope [encryption](/clusters/public-cloud/aws/eks#eksclustersecretsencryption) of Kubernetes Secrets stored in Amazon Elastic Kubernetes Service (EKS) clusters.

* Palette covers a long list of [parameters](https://github.com/kubernetes-sigs/aws-ebs-csi-driver#createvolume-parameters) and customization capabilities for the [csi-aws-1.0.0](/integrations/aws-ebs#parametersupportcsi-aws-1.0.0packmanifest) pack manifest. 

**Enhancement:**

* Palette allows reconciliation of the CSI layer Storageclass for managed clusters of Amazon Elastic Kubernetes Service (EKS).

**Bug Fixes**

* We request our users to add the `ec2:ReplaceRoute` permission to the [AWS](/clusters/public-cloud/aws/required-iam-policies) and [EKS-AWS](/clusters/public-cloud/aws/required-iam-policies) cloud account Controller Policy to replace an existing route, within a route table in a Virtual Private Cloud, to facilitate the cluster deletion process.


# April 26, 2022 - Release 2.5.0

Spectro Cloud Palette 2.5.0 was released with support for Tencent Kubernetes Engine (TKE), Palette free service offerings, many enhancements, and bug fixes.

**Features:**

- Palette now supports [Tencent Kubernetes Engine (TKE)](/clusters/public-cloud/tke#overview)—a fully-managed Kubernetes service from Tencent Cloud. Deploy and manage the end-to-end life cycle of TKS clusters, effortlessly.
- Palette introduces **Placeholder Variables** as [Macros](/clusters/cluster-management/macros#overview) in our Cluster Profile layers for advanced regression and easier update of variables, across multiple running clusters.
- Palette displays a well-organized [Product Onboarding](/getting-started/onboarding-workflow#paletteonboardingworkflow) process to streamline user-product adoption, with an assured unfailing user experience, to jump-start our product journey.
- Palette helps out new users in their purchase decision by offering free tier services.
  - [Palette Freemium](/getting-started/palette-freemium#trypaletteforfree) to explore Palette's capabilities with free and fixed kilo-Core-hour usage for finite cluster deployments.
  - [Free Cloud Credit](/getting-started/palette-freemium) offers access to a free cloud account, with sufficient permissions and credentials, to have a first impression on our product journey.

**Enhancements:**

- Palette users can now manually [Force Delete a Cluster](/clusters/public-cloud/aws#forcedeleteacluster), stuck in the **Deletion** state for more than **15 minutes**, through the User Interface.
- Palette production clusters can be backed up to object storage of [GCP Buckets](/clusters/cluster-management/backup-restore#configureyourbackupingcpbucket) for convenient restoration.

**Bug Fixes:**

- We request our users to please add the `ec2:DeleteNetworkInterface` permission to their AWS cloud account Controller Policy Permissions to detach and delete the network interface for [AWS](/clusters/public-cloud/aws#awscloudaccountpermissions) and [EKS](/clusters/public-cloud/aws/eks) clusters.

**Packs and Integrations:**

- [Ubuntu 20.04](/integrations/ubuntu)- A long term support release of highly popular Ubuntu Linux Operating System.
- Imageswap-webhook—a mutating webhook integration that intercepts pod requests and changes to the container image location.

# February 26, 2022 - Release 2.3.0

Palette 2.3.0 includes the following enhancements:

- Added support for cluster-centric detailed [**Namespace Management** and granular **RBAC**](/clusters/cluster-management/cluster-rbac). Previously this capability was only available via workspaces.
- Enabled secure and straightforward user authentication with [**API Keys**](/user-management/user-authentication/#apikey) to access the APIs without referring to user credentials.
- Tenant administrators can now get an [**aggregated view**](/clusters/#scope) of clusters across all the projects under their tenant.
- Added support for [**Taints**](/clusters/cluster-management/taints/#overviewontaints) that can be applied to a node pool to restrict a set of intolerant pods getting scheduled to an inadequate node.
- Added support for [**Labels**](/clusters/cluster-management/taints/#overviewonlabels) to constrain pods so that they can run on a particular set of nodes.
- Enable multi-cluster [**backup and restore from workspaces**](/clusters/cluster-management/backup-restore/#workspacebackupandrestore).
- New [**workspace user roles**](/clusters/cluster-management/backup-restore#workspaceoperator) that provide granular control to specific actions within a workspace:
  - _Workspace Operator_ - Allows only backup and restore capabilities within a workspace
  - _Workspace Admin_ - Administrative privileges within a workspace
- Palette will now perform a [**rolling upgrade**](/clusters/#rollingupgrade) on the nodes for any fundamental changes to the cluster config. Palette will keep track of the reason that triggered the rolling upgrade on the nodes in the cluster and is made accessible under **Cluster Overview** > **Upgrade details**.
- Enable deployment of the single pack across [**multiple layers**](https://docs-latest.spectrocloud.com/cluster-profiles/task-define-profile/#creatingclusterprofiles) cluster profile layers.
- Palette introduces a VM operator to allow Virtual Machine based applications to be modeled as Cluster Profile layers.

# January 20, 2022 - Hotfix 2.2.26

- Palette Hotfix 2.2.26 supports custom Helm chart registry in Private Networks.
- [Helm registries](/registries-and-packs/helm-charts) can now be set up in **Protected** mode also. In protected mode, charts are configured in cluster profiles without being synchronized into the management console.
- For the tenant clusters deployed in a private network, these charts from the protected Helm registries are downloaded and deployed by the Palette orchestrator.

# December 24, 2021 - Release 2.2.0

Palette 2.2.0 is released with the beta version of Edge Clusters along with upgraded Cluster API support.

The 2.2.0 Palette enhancements are:

- Palette users can now provision and manage their [Kubernetes clusters using edge appliances](/clusters/edge/) in addition to usual data centers or cloud environments.
- Palette has been upgraded to use a newer version of the CNCF Cluster API for better automation, integration, and efficiency.
- The upgraded Cluster API version used by Palette mandates the following pack updates:
  - Kubernetes 1.18.x and below are no longer supported. Please use Kubernetes version 1.19.x or above in the Cluster Profile.
  - vSphere CSI storage driver 1.0.x version is no longer supported for new Cluster Provisioning. Please upgrade your CSI Pack to 2.3.x for enhanced performance.
- As part of Palette upgrade to 2.2.0, control plane node(s) of any existing vSphere cluster will be replaced.

# November 20, 2021 - Release 2.1.0

Palette 2.1.0 is released with the following key improvements:

- Added support for replicated, cross-region Amazon Elastic Container Registries (ECR) whereby a single OCI registry within Spectro Cloud Palette can serve multiple deployment regions.
- Spectro Cloud users can now join more than one tenant. Users belonging to multiple organizations must choose the desired tenant to log in to. This feature is also supported for SSO-enabled tenants.
- Improved the UI of the Cluster Overview page. Visibility into basic cluster properties as well as cluster management actions such as configuration overrides, machine management, scan and backup policies, cluster deletion are now arranged under the **Settings** menu on the top right-hand side.

# November 1, 2021 - Release 2.0.0

We are excited to announce the Spectro Cloud platform's new name - "PALETTE". In addition, version 2.0 of our platform brings additional cost visibility, optimization features, enhanced governance, and control with **Workspaces**.

Our latest list of features includes:

- **Workspaces** enable the association of relevant namespaces across clusters to manage access, obtain cost visibility, and get workload visibility by applications or teams.
- Cluster health alert can be integrated with IT service management (ITSM) and collaboration tools such as Slack, ServiceNow, Microsoft Teams, etc.
- Our built-in Spectro Proxy can be leveraged to establish seamless and secured access to the Kubernetes clusters in public and private data center environments.
- Cluster cloud cost calculation for public and private clouds.
- Granular usage cost break down by namespaces, workspaces, and projects based on actual resource utilization by pods, jobs, stateful sets, PVCs, etc.
- Detailed visibility of resource utilization by cluster, namespaces, projects, and workspaces.

# September 14, 2021 - Release 1.14.0

Spectro Cloud 1.14 is released with additional health alert conveyances, secured log storage, transparent cost features, and scalable enterprise cluster backup.

- Spectro Cloud users can now push their audit logs to the AWS Cloudtrail to enhance continuous monitoring and troubleshooting of the workload clusters.
- Spectro Cloud layouts instantaneous and effortless monitoring of the cluster cloud cost.
- Now Spectro Cloud users can receive real-time alerts on cluster health at hooked external applications.
- Spectro Cloud enterprise mode production clusters can be backed up to object storage of S3 buckets for convenient restoration.
- Spectro Proxy authentication pack to provision reverse proxy aided communication for clusters deployed in a private network belonging to local data centers.
- Spectro Cloud has stepped up to an upgraded and stable API version for better automation, integration, and efficiency.

# August 14, 2021 - Release 1.13.0

Spectro Cloud users can now convert their bare-metal servers into flexible, cohesive, and distributed instances of virtual machines with the slightest efforts utilizing Metal as a Service (MAAS).

# July 23, 2021 - Release 1.12.0

Spectro Cloud 1.12 is released with generic cluster import, OpenID Connect (OIDC) support to handle identify management securely and seamlessly, and support for AKS—a managed Kubernetes Service offering from Azure cloud.

- Now import existing non-Spectro clusters from any cloud platform using our Generic cluster import feature. We support broad operations like scans, backups, etc. on these imported clusters as well as provisioning and lifecycle management of add-ons.
- Spectro Cloud now supports AKS, a fully-managed Kubernetes service from Azure. Deploy and manage end-to-end lifecycle of AKS clusters.
- Spectro Cloud extends its SSO support by providing integration with OpenID Connect (OIDC). OIDC is the de facto standard to handling application authentication in the modern world. Through this integration, Spectro Cloud enables users to integrate single sign on, using various identify providers such as Amazon Cognito, Keycloak etc.
- Kubernetes upgraded to version 1.19 for enterprise clusters.

# June 28, 2021 - Release 1.11.0

Spectro Cloud 1.11 is released with the support of OpenStack cloud and support for OIDC based authentication into Kubernetes clusters.

- Spectro now supports deployment and management of Kubernetes clusters in OpenStack based private data centers.
- Support for OIDC based authentication into Kubernetes clusters and preconfigured kubeconfig file to easily authenticate when using kubectl.

# June 1, 2021 - Release 1.10.0

Spectro Cloud 1.10 released with support for Amazon Elastic Kubernetes Service (EKS), cluster management policies to measure cluster compliance and perform backups and restores.

- Provision and manage Kubernetes clusters using Amazon EKS service including support for advanced configurations like Fargate profiles, OIDC Authentication etc.
- Scan your Kubernetes clusters to ensure they are conformant and compliant.
- Consensus-driven security scan for the Kubernetes deployment with CIS Kubernetes Benchmarks.
- Perform penetration tests to check for configuration issues that can leave the tenant clusters exposed to attackers.
- Backup your Kubernetes clusters including any persistent volumes. Restore these backups as required on any cluster.

**Note**:

The following permissions are additionally required to be granted to the cloud accounts used to launch clusters on AWS. Please update your account to ensure that you have these new permissions included.

Add the following permissions to the IAM policy called NodePolicy if it was created as documented in Spectro Cloud documentation.

```json
{
  "Effect": "Allow",
  "Action": ["secretsmanager:DeleteSecret", "secretsmanager:GetSecretValue"],
  "Resource": ["arn:*:secretsmanager:*:*:secret:aws.cluster.x-k8s.io/*"]
},
{
  "Effect": "Allow",
  "Action": [
    "ssm:UpdateInstanceInformation",
    "ssmmessages:CreateControlChannel",
    "ssmmessages:CreateDataChannel",
    "ssmmessages:OpenControlChannel",
    "ssmmessages:OpenDataChannel",
    "s3:GetEncryptionConfiguration"
  ],
  "Resource": ["*"]
}
```

Add the following permissions to the IAM policy called ControllerPolicy if it was created as documented in Spectro Cloud documentation.

```json
{
  "Effect": "Allow",
  "Action": ["eks:AssociateIdentityProviderConfig", "eks:ListIdentityProviderConfigs"],
  "Resource": ["arn:aws:eks:*:*:cluster/*"]
},
{
  "Effect": "Allow",
  "Action": ["eks:DisassociateIdentityProviderConfig", "eks:DescribeIdentityProviderConfig"],
  "Resource": ["*"]
}
```

# May 4, 2021 - Release 1.9.0

Spectro Cloud 1.9.0 released with advanced support of security, availability and updates.

- Spectro Cloud ensures users to start, run and scale highly-available and secure clusters with automated key tasks such as patching, node provisioning and updates with EKS support.
- Now create and gain permission to your AWS cloud account by just using role ARN, without sharing long-term credentials.

# March 29, 2021 - Release 1.8.0

Spectro Cloud 1.8.0 released with advanced support for deploying & discovering Helm Charts and several usability enhancements!

Featuring

- Set up public and private helm chart registries to leverage the vast database of integrations and add-ons.
- Deploy reliable and secure Kubernetes clusters, without worrying about Kubernetes updates, dependencies and security patches using the EKS Distro (EKS-D).
- Accumulate container logs across all cluster nodes to create a support bundle to enable faster troubleshooting.
- Attach multiple supporting manifests to your cluster profile layers in order to deploy integrations end to end without having to use command line client.
- Add additional BYOM (Bring Your Own Manifest) layers to your cluster profiles to perform ad-hoc customized deployments on the cluster.
- You can now import and manage existing clusters running in your private VMware environment behind a proxy.
- Discover charts deployed on your existing clusters and convert them into a cluster profile to use it as a template for future cluster deployments.
- Enhanced cluster profile builder experience with several usability enhancements.

# February 07, 2021 - Release 1.7.0

The following features and enhancements were released as part of 1.7.0

- Support for existing Kubernetes clusters that were not deployed by Spectro Cloud to be imported into the Spectro Cloud platform for visibility, management and additional capabilities such as application lifecycle management
- Automated as well as on-demand OS updates to keep cluster nodes up-to-date with the latest security fixes and enhancements.
- Modularize cluster profiles as Core Infra, Add-on, and Full profiles; Apply multiple add-on profiles to a cluster.
- Optimize AWS cloud cost utilizing spot instance pricing for cluster worker node pools.
- Selectively upgrade on-premises Spectro Cloud instance to a desired version, as opposed to always having to upgrade to the latest version.

# December 23, 2020 - Hotfix 1.6.4

This release adds a fix for the permissions of vSphere GET folders.

# December 13, 2020 - Release 1.6.0

Our on-premises version gets attention to finer details with this release:

- The Spectro Cloud database can now be backed up and restored.
- Whereas previous on-premises versions allowed upgrading only to major versions, this release allows <Tooltip trigger={<u>upgrading</u>}> <a href="/enterprise-version/system-console-dashboard/#updatemanagement">Upgrades</a> to the Spectro Cloud platform are published to the Spectro Cloud repository and a notification is displayed on the console when new versions are available. </Tooltip> to minor versions of the Spectro Cloud platform.
- Monitoring the installation using the dedicated <Tooltip trigger={<u>UI</u>}>The platform installer contains a web application called the <a href="/enterprise-version/deploying-the-platform-installer/#monitorinstallation">Supervisor</a>, to provide detailed progress of the installation. </Tooltip> now provides more details when [migrating](/enterprise-version/deploying-an-enterprise-cluster/#migratequickstartmodeclustertoenterprise) from the quick start version to the enterprise version.
- AWS and GCP clusters can now be provisioned from an on-premises Spectro Cloud system.

On the VMware front, we have:

- removed the dependency on the HA Proxy Load balancer for creating clusters via DHCP.
- introduced dynamic folder creation in vCenter. This applies to every cluster, in all of the cluster virtual machines.
- enabled support for DNS mapping in search domains on vSphere.

Other new features:

- New customers can now sign up for free trials of Spectro Cloud. When ready, it is easy to upgrade plans and set up automatic payments using credit/debit cards.
- <Tooltip trigger={<u>Pack constraints</u>}> <a href="/integrations/pack-constraints/">Pack constraints</a> are a set of rules defined at the pack level to validate the packs for a Profile or a Cluster before it gets created or updated. Packs must be validated before the cluster is submitted to ensure a successful deployment.</Tooltip> have been enabled to reduce the chances of cluster deployment failures that might occur due to incorrect values being set.
- Compatibility for Portworx version 2.6.1, Calico version 3.16, and for newer versions for [Kubernetes](/integrations/kubernetes/).

# December 03, 2020 - Hotfix 1.5.7

In this hotfix, we added:

- Compatibility for [Calico 3.16](https://www.projectcalico.org/whats-new-in-calico-3-16/).
- The on-premises version now allows specifying [CIDR for pods](/enterprise-version/deploying-the-platform-installer/#deployplatforminstaller) to allocate them an exclusive IP range.
- It also allows allocating an IP range in the CIDR format exclusive to the service clusters.

The IP ranges for the pods, service clusters, and your IP network must not overlap with one another. This hotfix provides options to prevent node creation errors due to IP conflicts.

# November 05, 2020 - Hotfixes 1.5.1 through 1.5.6

A host of hotfixes were applied for a smoother on-premises operation:

| Version | Feature                                                                                       |
| ------- | --------------------------------------------------------------------------------------------- |
| 1.5.6   | Added improvements for faster [kCh](https://www.spectrocloud.com/pricing/) usage calculation. |
| 1.5.5   | Patched the `govc vm.info` command to allow spaces in datacenter names.                       |
| 1.5.4   | Changes to use client updates instead of patches for _vendorcrd_ installations.               |
| 1.5.3   | Improved resource utilization by deleting a machine when a node is not available.             |
| 1.5.2   | Updates to keep sessions alive for SOAP and REST clients using the `keepalive` command.       |
| 1.5.1   | Fixed a bug that caused a trailing line to be added in the `vsphere.conf` file.               |

# October 23, 2020 - Release 1.5.0

The 1.5.0 release of the Spectro Cloud platform consists of the following features and enhancements:

- On-Premise version of the Spectro Cloud platform for deployment into private VMWare environments.
- Cloud accounts can now be created at the tenant scope, to allow accounts to be shared across all projects in the tenant.
- Cross-compute cluster deployment of Private Cloud Gateway clusters for high-availability purposes.
- SSH Public Key management to easily select the desired keys and share them across Kubernetes clusters within a project.
- Improvements to cloud settings interface to simplify the creation of multiple failure domains during cluster provisioning.

# September 10, 2020 - Release 1.2.0

With release 1.2.0, users get more control and added support:

- Users can now access Kubernetes cluster certificates and renew them.
- For VMware, multi-domain support for private gateways is now available.
- Also for VMware, layout changes have been made to improve usability.

# August 21, 2020 - Release 1.1.0

Release 1.1.0 is all about enhancing the user experience, providing tighter controls on clusters, and important bug fixes.

- On the UI side, the login has been made faster. Additionally, users can now set up alerts to monitor cluster health. A `Revert to default values` button for cluster profiles is added.
- Clusters are easier to launch with the `Copy from Master` button; bad deployments are now prevented for certain instances; scaling is easier with the `Scale Strategy`.
- Private gateways can now be provisioned on static IPs with greater control on IP allocation using [IP pools](/clusters?clusterType=vmware_cluster#ipaddressmanagement).
- Updates to the CLI tool include more [flags](/registries-and-packs/spectro-cli-reference?cliCommands=cli_push#flags) to the `PUSH` command for forcibly overwriting registry packs.
- Bug Fixes: BET-806 related to SSO login and BET-403 related to validation of dependencies for availability zones have been resolved.

# July 3, 2020 - Release 1.0.2

- Minor bug fixes for release 1.0.1.
- Updates to the [orchestration engine](https://www.spectrocloud.com/webinars/cluster-api-and-the-spectro-cloud-orchestration-engine/) for the new regions.
- Minor updates to the Istio integration.

# July 3, 2020 - Release 1.0.1

- New Regions for AWS > Spectro Cloud is now available for deploying AWS clusters in the European regions.
- Changes to the pricing structures > more usage = lesser price per [kCh](https://www.spectrocloud.com/pricing/).

# June 23, 2020 - Release 1.0

The following features are included as part of Spectro Cloud 1.0:

- Multi cluster deployment and lifecycle management of Kubernetes clusters across multiple cloud environments—AWS, Azure, and VMWare.
- Security-hardened, compliant, and conformant Kubernetes clusters out of the box.
- Cluster construction templates called Cluster Profiles.
- Platform extensibility through custom integration packs.
- Grouping of clusters logically into Projects for governance and control.
- Rich set of enterprise features such as granular RBAC, Single Sign-on, detailed Audit logs, etc.


<InfoBox>
Spectro Cloud adopts relevant security best practices for operating systems, Kubernetes components, and cloud environments. All Spectro Cloud container images are scanned for CVEs before a release. While Spectro Cloud takes ownership of securing the cluster infrastructure, there may be additional 3rd party integrations installed on the Kubernetes clusters provisioned. Security of such 3rd party integrations, including their container images and associated configurations, is the responsibility of the provider.
</InfoBox>
