---
title: 'Cloudanix'
metaTitle: 'cloudanix'
metaDescription: 'Cloudanix container security helm chart for Spectro Cloud Palette'
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

Cloudanix container security add-on detects threats and abnormal behaviors in the Kubernetes clusters. Cloudanix Dashboard visualizes:
<br />

* Threats and anomalies in real-time
* Mapping the threats to Workloads (container, pod, node, etc.)
* Associated events for the threats
* The raw command executed
* The user who initiated the threat, and much more..

Users can initiate workflows (Jira integration) and target specific workloads (excluding container, pod, or node while performing an anti-pattern) right from the Cloudanix Dashboard. This helm chart installs 3 Cloudanix services to enable container security capabilities. The services are listed below:
<br />

* inventory-service
* threat-service
* config-cron


## Versions Supported

Cloudanix helm chart supports the following versions with Palette.

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

## Prerequisites

* Minumum CPU Cores: 1
* Minimum Memory Required: 25 MiB
* The Kubernetes version 1.15.x and above
* Kernel version 4.5 or higher

