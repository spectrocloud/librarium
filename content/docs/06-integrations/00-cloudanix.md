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

The Cloudanix pack is an add-on security pack that provides a dashboard to help you detect threats and unusual behavior in your Kubernetes clusters.

Cloudanix Dashboard also provides an Interactive interface to present the mapping of the threats to Workloads (container, pod, node, etc), associated events for the Threat, raw command executed, which user has initiated the threat, and much more.

Users can start Jira workflows and target specific workloads, excluding containers, pods, or nodes, from the Cloudanix Dashboard. The Cloudanix Helm Chart installs three Cloudanix services to enable container security capabilities.

This helm chart installs 4 Cloudanix services to enable container security capabilities. The services are listed below:

- **inventory-service**
- **threat-service**
- **config-cron**
- **misconfig-cron**

## Prerequisites

- CPUs: 0.5
- Memory: 256 MiB
- Kubernetes 1.19 and higher
- Kernel version 4.5 and higher