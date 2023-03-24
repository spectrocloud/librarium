---
title: 'Cloudanix'
metaTitle: 'cloudanix'
metaDescription: 'The Cloudanix security pack provides a dashboard that displays threats and unusual behavior in Kubernetes containers in Palette'.
hiddenFromNav: true
isIntegration: true
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

- Write below binary directory, if an attempt was made to write to any file below a set of binary directories.
- SSH into a container, if an attempt was made to SSH into a container.
- Modifying shell configuration files, detect an attempt to modify shell configuration file.
- An attempt to read sensitive files like user/password/authentication information
- Detecting Cryptocurrency mining, monitors network traffic to identify and alert on any unauthorized cryptocurrency mining activity.

The Cloudanix dashboard also provides an interactive interface that displays the mapping between threat events and associated container, pod, and node workloads. Additionally, Cloudanix identifies the user who initiated an activity  identified as a threat and the command that was used, plus much more.

Users can start Jira workflows and target specific workloads from the Cloudanix dashboard.

This helm chart installs 4 Cloudanix services to enable container security capabilities:

- **inventory-service** : Inventory service watches for any new Kubernetes resources and displays them in Cloudanix dashboard.
- **threat-service** : Threat service exports threat events that are visible on the Cloudanix dashboard along with the affected Kubernetes resources.
- **config-cron** : Config Cron is a job meant to run periodically to maintain the configuration of Cloudanix services (viz. inventory-service and threat-service) running in a Kubernetes cluster.
- **misconfig-cron** : Captures Kubernetes misconfiguration. 

## Prerequisites

- CPUs: 0.5
- Memory: 256 MiB
- Kubernetes 1.19 and higher
- Kernel version 4.5 and higher

## Parameters

| Name | Description |
| --- | --- |
| userEmail | The system user email used for creating the cluster profile and cluster (eg. xyz@gmail.com) |
| partnerIdentifier | A Cloudanix unique identifier for the partner |
| organizationId | The organization tenant Id in the palette |
| userName | The palette system user name |
| accountName | The palette system cloud account name |
| accountType | The cloud account type (eg. AWS,GCP,Azure) |
| accountId | The cloud account uid |
| clusterName | The name of the cluster |
| clusterIdentifier | A unique identifier for cluster |
| clusterDomain | The palette cloud account type (eg. AWS,GCP,Azure) |

## Usage

- Login to Cloudanix Console.
- Select the Workloads page.
- Select Risks tab where you can see all the failed threat rules.

# Terraform

``` hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}
data "spectrocloud_pack_simple" "cloudanix" {
  name    = "cloudanix"
  version = "0.0.6"
  type = "operator-instance"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

# References

[Cloudanix](https://docs.cloudanix.com/introduction)