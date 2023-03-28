---
title: 'Cloudanix'
metaTitle: 'cloudanix'
metaDescription: 'The Cloudanix security pack provides a dashboard that displays threats and unusual behavior in Kubernetes containers in Palette' 
hiddenFromNav: true
type: "integration"
hideToC: false
category: ['security']
logoUrl: 'https://cloudanix-assets.s3.amazonaws.com/static/cloudanix-logo-p.png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Cloudanix

The Cloudanix pack is an add-on security pack that provides a dashboard to help you detect threats and unusual behavior in your Kubernetes clusters. Some examples of Cloudanix detection capabilities are:

<br/>

- Detects files added or modified in sensitive directories.
- SSH into a container. 
- Modifications to shell configuration files.
- Attempts to read sensitive files that contain credential information.
- Crypto mining detection.

The Cloudanix dashboard also provides an interactive interface that displays the mapping between threat events and associated container, pod, and node workloads. Additionally, Cloudanix identifies the user who initiated an activity  identified as a threat and the command that was used, plus much more.

Additionally, you can start Jira workflows and target specific workloads from the Cloudanix dashboard. 

# Versions Supported

<Tabs>

<Tabs.TabPane tab="1.0.x" key="1.0.x">

## Prerequisites

- CPUs: 0.5
- Memory: 256 MiB
- Kubernetes 1.19.x and higher
- Kernel version 4.5 and higher

## Parameters

The Cloudanix pack has the following parameters, which are auto-filled based on Palette user information.

| Name | Description |
| --- | --- |
| ``userEmail`` | The email address of the user who created the cluster and cluster profile. |
| ``partnerIdentifier`` | A Cloudanix unique identifier for Spectro Cloud. |
| ``organizationId`` | The organization tenant ID in Palette. |
| ``userName`` | Palette user name. |
| ``accountName`` | Palette cloud account name. |
| ``accountType`` | Cloud account type such as AWS or GCP, Azure, or others. |
| ``accountId`` | The user's cloud account ID. |
| ``clusterName`` | The name of the cluster. |
| ``clusterIdentifier`` | The cluster's unique identifier. |
| ``clusterDomain`` | The Palette cloud account type such as AWS, GCP, Azure, or others. |

## Usage

This Helm Chart installs four Cloudanix services to enable container security capabilities:

<br/>

- **config-cron**: A job that runs periodically in a Kubernetes cluster to maintain the configuration of Cloudanix inventory and threat services.
- **misconfig-cron**: A job that captures Kubernetes misconfigurations and displays them on the Cloudanix dashboard.
- **inventory-service**: An inventory service that detects any new Kubernetes resources and displays them on the Cloudanix dashboard.
- **threat-service**: A threat service that exports threat events and affected Kubernetes resources which are visible on the Cloudanix dashboard.



From the **Workloads** page, click the **Risks** tab to view a list of failed threat rules. You can exclude resources, such as pods and containers, from the risk findings.

</Tabs.TabPane>

<Tabs.TabPane tab="0.0.x" key="0.0.x">

## Prerequisites

- CPUs: 0.5
- Memory: 256 MiB
- Kubernetes 1.19.x and higher
- Kernel version 4.5 and higher

## Parameters

The Cloudanix pack has the following parameters, which are auto-filled based on Palette user information.

| Name | Description |
| --- | --- |
| ``userEmail`` | The email address of the user who created the cluster and cluster profile. |
| ``partnerIdentifier`` | A Cloudanix unique identifier for Spectro Cloud. |
| ``organizationId`` | The organization tenant ID in Palette. |
| ``userName`` | Palette user name. |
| ``accountName`` | Palette cloud account name. |
| ``accountType`` | Cloud account type such as AWS or GCP, Azure, or others. |
| ``accountId`` | The user's cloud account ID. |
| ``clusterName`` | The name of the cluster. |
| ``clusterIdentifier`` | The cluster's unique identifier. |
| ``clusterDomain`` | The Palette cloud account type such as AWS, GCP, Azure, or others. |

## Usage

This Helm Chart installs four Cloudanix services to enable container security capabilities:

<br/>

- **config-cron**: A job that runs periodically in a Kubernetes cluster to maintain the configuration of Cloudanix inventory and threat services.
- **misconfig-cron**: A job that captures Kubernetes misconfigurations and displays them on the Cloudanix dashboard.
- **inventory-service**: An inventory service that detects any new Kubernetes resources and displays them on the Cloudanix dashboard.
- **threat-service**: A threat service that exports threat events and affected Kubernetes resources which are visible on the Cloudanix dashboard.

From the **Workloads** page, click the **Risks** tab to view a list of failed threat rules. You can exclude resources, such as pods and containers, from the risk findings.

</Tabs.TabPane>

</Tabs>

# Terraform

``` hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack_simple" "cloudanix" {
  name    = "cloudanix"
  version = "0.0.6"
  type = "helm"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

# References

[Cloudanix](https://docs.cloudanix.com/introduction)

<br/>

<br />

<br/>

<br />




