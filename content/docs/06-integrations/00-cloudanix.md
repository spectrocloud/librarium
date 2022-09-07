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

Cloudanix container security helm chart detects threats and anomalous behaviors on kubernetes cluster and provides an interactive interface in Cloudanix dashboard to view on which resources like pods, containers and nodes the activiy is occurring, in real-time.

This helm chart installs 3 Cloudanix services to enable container security capabilities. The services are listed below:

- inventory-service
- threat-service
- config-cron

## Versions Supported

Cloudanix helm chart supports the following versions with Palette.

<br />

<Tabs>
<Tabs.TabPane tab="1.0.0" key="1.0.0">

* **1.0.0**

<br />

## Prerequisites

- Minumum CPU Cores: 1
- Minimum Memory Required: 20 MiB
- The minimum Kubernetes version supported is 1.15
- Kernel version 4.5 or higher