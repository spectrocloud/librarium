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

# July 3, 2020 - Release 1.0.2

* Minor bug fixes for release 1.0.1.
* Updates to the [orchestration engine](https://www.spectrocloud.com/webinars/cluster-api-and-the-spectro-cloud-orchestration-engine/) for the new regions.
* Minor updates to the Istio integration.

# July 3, 2020 - Release 1.0.1

* New Regions for AWS -> Spectro Cloud is now available for deploying AWS clusters in the European regions.
* Changes to the pricing structures -> more usage = lesser price per [kCh](https://www.spectrocloud.com/pricing/).

# June 23, 2020 - Release 1.0

The following features are included as part of Spectro Cloud 1.0:

* Multi cluster deployment and lifecycle management of Kubernetes clusters across multiple cloud environments - AWS, Azure and VMWare.
* Security hardened, compliant and conformant Kubernetes clusters out of the box.
* Cluster construction templates called Cluster Profiles.
* Platform extensibility through custom integration packs.
* Grouping of clusters logically into Projects for governance and control.
* Rich set of enterprise features such as granular RBAC, Single Sign-on, detailed Audit logs etc.

## Known Issues

* **BET-403:** Spectro Cloud does not validate dependencies in cloud configuration. For example, for Azure cloud, not all instance types support every available storage type. Choosing an incompatible combination does not result in a validation error. Runtime failures might result from such configuration, which would then need to be corrected by the users.
* **BET-768:** On Azure cloud, the choice of Availability Zones (AZ) may be ignored if the selected AZs do not support the requested VM size. Non-Zoned VMs are created in such cases without a warning to the user.
* **BET-806:** For accounts configured with Single Sign-On, a session timeout on the UI console does not redirect to the login screen of the Single sign-on provider. Instead the Spectro Cloud login screen is shown to the user. As a work around, the user would need to change the browser link manually to their tenant root address. This will ensure they are directed to the single sign-on provider's login screen.

<InfoBox>
Spectro Cloud adopts relevant security best practices for operating systems, Kubernetes components, and cloud environments. All Spectro Cloud container images are scanned for CVEs before a release. While Spectro Cloud takes ownership of securing the cluster infrastructure, there maybe additional 3rd party integrations installed on the Kubernetes clusters provisioned. Security of such 3rd party integrations, including their container images and associated configurations, is the responsibility of the provider.
</InfoBox>
