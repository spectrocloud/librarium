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

The Cloudanix pack is an add-on security pack that provides a dashboard to help you detect threats and unusual behavior in your Kubernetes clusters. The Cloudanix dashboard displays the following information in real time:
<br />

* Threats and anomalies.
* A mapping of threats to affected containers, pods, and nodes.
* Associated events for the threats
* The command that initiated or created the thread
* The user who initiated the activity that caused the threat.

Users can start Jira workflows and target specific workloads, excluding containers, pods, or nodes, from the Cloudanix Dashboard. The Cloudanix Helm Chart installs three Cloudanix services to enable container security capabilities:
<br />

* inventory-service
* threat-service
* config-cron

# Prerequisites

* CPUs: 1
* Memory: 25 MiB
* Kubernetes 1.15.x and higher
* Kernel version 4.5 or higher

## Versions Supported

Cloudanix Helm Chart supports the following versions with Palette.

<br />

<Tabs>

<Tabs.TabPane tab="1.0.x" key="1.0.x">

* **1.0.0**

</Tabs.TabPane>

<Tabs.TabPane tab="0.0.x" key="0.0.x">

* **0.0.5**
* **0.0.4**
* **0.0.3**

</Tabs.TabPane>
</Tabs>
<br />


