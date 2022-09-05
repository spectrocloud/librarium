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

Cloudanix container security helm chart detects anamolous behaviours on kubernetes cluster and provides an interactive interface in Cloudanix dashboard to view on which resources like pods, containers and nodes the activiy is occuring in real-time.

This helm chart installs 3 Cloudanix services to enable container security capabilities. The services are listed below:

- inventory-service
- threat-service
- config-cron

## Versions Supported

Cloudanix helm chart supports the following versions with Palette..

<br />

<Tabs>
<Tabs.TabPane tab="0.0.3" key="0.0.3">

* **0.0.3**

<br />

## Prerequisites

- Minumum CPU Cores: 1
- Minimum Memory Required: 20 MiB
- The minimum kubernetes version supported is 1.15
- Kernel version 4.5 or higher