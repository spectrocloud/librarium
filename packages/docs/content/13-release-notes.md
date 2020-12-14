---
title: "Release Notes"
metaTitle: "Release Notes"
metaDescription: "Dates and descriptions of Spectro Cloud releases"
icon: "audits"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# December 13, 2020 - Release 1.6.0

Our on-prem version gets attention to finer details with this release:

* The Spectro Cloud database can now be backed up and restored.
* Whereas previous on-prem versions allowed upgrading only to major versions, this release allows <Tooltip trigger={<u>upgrading</u>}> <a href="/enterprise-version/system-console-dashboard/#updatemanagement">Upgrades</a> to the Spectro Cloud platform are published to the Spectro Cloud repository and a notification is displayed on the console when new versions are available. </Tooltip> to minor versions of the Spectro Cloud platform.
* Monitoring the installation using the dedicated <Tooltip trigger={<u>UI</u>}>The platform installer contains a web application called the <a href="/enterprise-version/deploying-the-platform-installer/#monitorinstallation">Supervisor</a>, to provide detailed progress of the installation. </Tooltip> now provides more details when [migrating](/enterprise-version/deploying-an-enterprise-cluster/#migratequickstartmodeclustertoenterprise) from the quick start version to the enterprise version.
* AWS and GCP clusters can now be provisioned from an on-prem Specto Cloud system.

On the VMware front, we have:

* removed the dependency on the HA Proxy Load balancer for creating clusters via DHCP.
* introduced dynamic folder creation in vCenter. This applies to every cluster, in all of the cluster virtual machines.
* enabled support for DNS mapping in search domains on vSphere.

Other new features:

* New customers can now sign up for free trials of Spectro Cloud. When ready, it is easy to upgrade plans and set up automatic payments using credit/debit cards.
* <Tooltip trigger={<u>Pack constraints</u>}>Default pack values can be overridden. If the cluster is configured incorrectly (values, instance types, etc.), cluster deployment may fail. These failures can occur at any point during the cluster deployment process.</Tooltip> have been enabled to reduce the chances of cluster deployment failures that might occur due to incorrect values being set.
* Compatibility for Portworx version 2.6.x, Calico version 3.16.x, and for newer versions for [Kubernetes](/integrations/kubernetes/).

# December 03, 2020 - Hotfix 1.5.7

In this hotfix, we added:

* Compatibility for [Calico 3.16](https://www.projectcalico.org/whats-new-in-calico-3-16/).
* The on-prem version now allows specifying [CIDR for pods](/enterprise-version/deploying-the-platform-installer/#deployplatforminstaller) to allocate them an exclusive IP range.
* It also allows allocating an IP range in the CIDR format exclusive to the service clusters.

The IP ranges for the pods, service clusters, and your IP network must not overlap with one another. This hotfix provides options to prevent node creation errors due to IP conflicts.

# November 05, 2020 - Hotfixes 1.5.1 through 1.5.6

A host of hotfixes were applied for a smoother on-premise operation:

| Version | Feature |
| --- | --- |
| 1.5.6 | Added improvements for faster [kCh](https://www.spectrocloud.com/pricing/) usage calculation. |
| 1.5.5 | Patched the `govc vm.info` command to allow spaces in datacenter names. |
| 1.5.4 | Changes to use client updates instead of patches for *vendorcrd* installations. |
| 1.5.3 | Improved resource utilization by deleting a machine when a node is not available. |
| 1.5.2 | Updates to keep sessions alive for SOAP and REST clients using the `keepalive` command. |
| 1.5.1 | Fixed a bug that caused a trailing line to be added in the `vsphere.conf` file. |

# October 23, 2020 - Release 1.5.0

The 1.5.0 release of the Spectro Cloud platform consists of the following features and enhancements:

* On-Premise version of the Spectro Cloud platform for deployment into private VMWare environments.
* Cloud accounts can now be created at the tenant scope, to allow accounts to be shared across all projects in the tenant.
* Cross-compute cluster deployment of Private Cloud Gateway clusters for high-availability purposes.
* SSH Public Key management to easily select the desired keys and share them across Kubernetes clusters within a project.
* Improvements to cloud settings interface to simplify the creation of multiple failure domains during cluster provisioning.

# September 10, 2020 - Release 1.2.0

With release 1.2.0, users get more control and added support:

* Users can now access Kubernetes cluster certificates and renew them.
* For VMware, multi-domain support for private gateways is now available.
* Also for VMware, layout changes have been made to improve usability.

# August 21, 2020 - Release 1.1.0

Release 1.1.0 is all about enhancing the user experience, providing tighter controls on clusters, and important bug fixes.

* On the UI side, the login has been made faster. Additionally, users can now set up alerts to monitor cluster health. A `Revert to default values` button for cluster profiles is added.
* Clusters are easier to launch with the `Copy from Master` button; bad deployments are now prevented for certain instances; scaling is easier with the `Scale Strategy`.
* Private gateways can now be provisioned on static IPs with greater control on IP allocation using [IP pools](/clusters?clusterType=vmware_cluster#ipaddressmanagement).
* Updates to the CLI tool include more [flags](/registries-and-packs/spectro-cli-reference?cliCommands=cli_push#flags) to the `PUSH` command for forcibly overwriting registry packs.
* Bug Fixes: BET-806 related to SSO login and BET-403 related to validation of dependencies for availability zones have been resolved.

# July 3, 2020 - Release 1.0.2

* Minor bug fixes for release 1.0.1.
* Updates to the [orchestration engine](https://www.spectrocloud.com/webinars/cluster-api-and-the-spectro-cloud-orchestration-engine/) for the new regions.
* Minor updates to the Istio integration.

# July 3, 2020 - Release 1.0.1

* New Regions for AWS -> Spectro Cloud is now available for deploying AWS clusters in the European regions.
* Changes to the pricing structures -> more usage = lesser price per [kCh](https://www.spectrocloud.com/pricing/).

# June 23, 2020 - Release 1.0

The following features are included as part of Spectro Cloud 1.0:

* Multi cluster deployment and lifecycle management of Kubernetes clusters across multiple cloud environments - AWS, Azure, and VMWare.
* Security-hardened, compliant, and conformant Kubernetes clusters out of the box.
* Cluster construction templates called Cluster Profiles.
* Platform extensibility through custom integration packs.
* Grouping of clusters logically into Projects for governance and control.
* Rich set of enterprise features such as granular RBAC, Single Sign-on, detailed Audit logs, etc.

# Known Issues

* **BET-1491:** Portworx currently does not [support](https://docs.portworx.com/portworx-install-with-kubernetes/) Kubernetes version 1.19. This results in a failure to bring up the Stork scheduler pod.
* **BET-1472:** In the [Enterprise Mode](/enterprise-version/deploying-an-enterprise-cluster/#enterprisemode), deleting a node in an Enterprise cluster renders the cluster unusable due to an [in-tree limitation](https://github.com/vmware/vsphere-storage-for-kubernetes/issues/55).
    * *Recommendations:*
        * To prevent VMDK deletion with the in-tree provider, drain the node, let all pods re-schedule on another node, let all volumes detach from the node, and then finally delete the node VM.
        * This issue is resolved with [vSphere 67u3](https://docs.vmware.com/en/VMware-vSphere/6.7/Cloud-Native-Storage/GUID-51D308C7-ECFE-4C04-AD56-64B6E00A6548.html) and a [new CSI driver](https://github.com/kubernetes-sigs/vsphere-csi-driver).
        * A [related issue](https://github.com/kubernetes-sigs/vsphere-csi-driver/issues/359) might occur where a persistent volume might not attach to a new node.
* **BET-1461:** For AWS clusters, when the Static VPC option is used, clusters might not complete provisioning. This bug will be patched in subsequent releases.
* **BET-768:** On the Azure cloud, the choice of Availability Zones (AZ) may be ignored if the selected AZs do not support the requested VM size. Non-Zoned VMs are created in such cases without a warning to the user.

<InfoBox>
Spectro Cloud adopts relevant security best practices for operating systems, Kubernetes components, and cloud environments. All Spectro Cloud container images are scanned for CVEs before a release. While Spectro Cloud takes ownership of securing the cluster infrastructure, there may be additional 3rd party integrations installed on the Kubernetes clusters provisioned. Security of such 3rd party integrations, including their container images and associated configurations, is the responsibility of the provider.
</InfoBox>
