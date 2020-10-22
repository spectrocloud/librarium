---
title: "Release Notes"
metaTitle: "Release Notes"
metaDescription: "Spectro Cloud recommendations for the best manner of operations"
icon: "audits"
hideToC: false
fullWidth: false
---

import InfoBox from '@librarium/shared/src/components/InfoBox';

import WarningBox from '@librarium/shared/src/components/WarningBox';

# October 23, 2020 - Release 1.5.0

The 1.5.0 release of the Spectro Cloud platform consists of the following features and enhancements

* On-Premise version of the Spectro Cloud platform for deployment into private VMWare environments.
* Cloud accounts can now be created at the tenant scope, to allow accounts to be shared across all projects in the tenant.
* Cross compute cluster deployment of Private Cloud Gateway cluster for high availability purposes.
* SSH Public Key management to easily select the desired keys and share them across kubernetes clusters within a project. 
* Improvements to cloud settings interface to simplify creation of multiple failure domains during cluster provisioning. 

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

## Known Issues

* **BET-768:** On the Azure cloud, the choice of Availability Zones (AZ) may be ignored if the selected AZs do not support the requested VM size. Non-Zoned VMs are created in such cases without a warning to the user.

<InfoBox>
Spectro Cloud adopts relevant security best practices for operating systems, Kubernetes components, and cloud environments. All Spectro Cloud container images are scanned for CVEs before a release. While Spectro Cloud takes ownership of securing the cluster infrastructure, there may be additional 3rd party integrations installed on the Kubernetes clusters provisioned. Security of such 3rd party integrations, including their container images and associated configurations, is the responsibility of the provider.
</InfoBox>
