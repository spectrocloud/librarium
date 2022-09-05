---
title: 'Cloudanix'
metaTitle: 'cloudanix'
metaDescription: 'Cloudanix container security helm chart for Spectro Cloud Palette'
hiddenFromNav: true
isIntegration: true
category: ['security']
logoUrl: 'cloudanix-logo-p.png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Cloudanix

Cloudanix Container Security helm chart leverages Falco for to detect anamolous behaviours on kubernetes cluster and provides an interactive interface in Cloudanix Dashboard to view on which resources like pods, containers and nodes the activiy is occuring in real-time.

This Helm chart helps to install multiple Cloudanix services for container protection. The following services are installed

- inventory-service
- threat-service
- config-cron

## Falco Chart

The chart installs the Falco community chart which is a dependency in Chart.yaml.

# Versions Supported

The following Cloudanix Container Security Helm Chart versions are supported to work with Palette.

<br />

<Tabs>
<Tabs.TabPane tab="0.0.3" key="0.0.3">

* **0.0.3**

<br />

The following Falco Charts Version is supported to work with Cloudanix Charts.

<br />

<Tabs>
<Tabs.TabPane tab="0.32.0" key="0.32.0">

* **0.32.0**

<br />

# Notable Parameters

| Name | Supported Values | Default value | Description |
| --- | --- | --- | --- |
| authToken | provided by Cloudanix | NA | Authorization token is required for Cloudanix helm charts. |
| accountId | provided by Cloudanix | NA | AccountID created by Cloudanix for the customer |
| clusterName | Customer cluster name | NA | The name of the cluster on which the Cloudanix Container Securities Worloads should run. |
| falco.ebpf.enabled | `true`, `false` | NA | If installed with ebpf probe enabled the value should be `true`. |

## Prerequisites

- Minumum CPU Cores: 1
- Minimum Memory Required: 20 MiB
- The minimum kubernetes version supported for falco is 1.15
- Kernel version 4.5 or higher