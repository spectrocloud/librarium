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

- Writes below a binary directory.
- SSH into a container. 
- Modifications to shell configuration files.
- Attempts to read sensitive files that contain credential information.
- Crypto mining detection.

The Cloudanix dashboard also provides an interactive interface that displays the mapping between threat events and associated container, pod, and node workloads. Additionally, Cloudanix identifies the user who initiated an activity  identified as a threat and the command that was used, plus much more.

Users can start Jira workflows and target specific workloads from the Cloudanix Dashboard. 

# Versions Supported

<Tabs>

<Tabs.TabPane tab="1.0.x" key="1.0.x">

## Prerequisites

- CPUs: 0.5
- Memory: 256 MiB
- Kubernetes 1.19.x and higher
- Kernel version 4.5 and higher

## Parameters

There are no parameters to configure in this Helm Chart.

## Usage

This Helm Chart installs four Cloudanix services to enable container security capabilities:

<br/>

- **config-cron**
- **misconfig-cron**
- **inventory-service**
- **threat-service**

</Tabs.TabPane>

<Tabs.TabPane tab="0.0.x" key="0.0.x">

## Prerequisites

- CPUs: 0.5
- Memory: 256 MiB
- Kubernetes 1.19.x and higher
- Kernel version 4.5 and higher

## Parameters

There are no parameters to configure in this Helm Chart.

## Usage

This Helm Chart installs four Cloudanix services to enable container security capabilities:

<br/>

- **config-cron**
- **misconfig-cron**
- **inventory-service**
- **threat-service**

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
  type = "operator-instance"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

# References

[Cloudanix](https://docs.cloudanix.com/introduction)

<br/>

<br />

<br/>

<br />




