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
- Modifying shell configuration files.
- Attempts to read sensitive files, such as user, password, and authentication information.
- Crypto mining detection.

The Cloudanix dashboard also provides an interactive interface that displays the mapping of threat events to container, pod, and node workloads, the command that a user invoked, the user who initiated the activity that caused the threat, and more.

Users can start Jira workflows and target specific workloads from the Cloudanix Dashboard. 

# Versions Supported

<Tabs>

<Tabs.TabPane tab="1.0.x" key="1.0.x">

## Prerequisites

- CPUs: 0.5
- Memory: 256 MiB
- Kubernetes 1.19.x and higher
- Kernel version 4.5 and higher

## Usage

This Helm Chart installs four Cloudanix services to enable container security capabilities:

<br/>

- **inventory-service**
- **threat-service**
- **config-cron**
- **misconfig-cron**

</Tabs.TabPane>

<Tabs.TabPane tab="0.0.x" key="0.0.x">

## Prerequisites

- CPUs: 0.5
- Memory: 256 MiB
- Kubernetes 1.19.x and higher
- Kernel version 4.5 and higher

## Usage

This Helm Chart installs four Cloudanix services to enable container security capabilities:

<br/>

- **inventory-service**
- **threat-service**
- **config-cron**
- **misconfig-cron**

</Tabs.TabPane>

</Tabs>

# Terraform


# References

<br/>

<br />

<br/>

<br />




