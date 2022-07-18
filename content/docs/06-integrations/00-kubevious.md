---
title: 'Kubevious'
metaTitle: 'Kubevious'
metaDescription: 'Kubevious Monitoring pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
hideToC: false
category: ['monitoring']
logoUrl: 'https://registry.spectrocloud.com/v1/kubevious/blobs/sha256:5e33d7b51b1317a834b4552d96fc1cc8463000a7eedbcb4b784ea07236f3d7f7?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Kubevious

Kubevious integration provides a graphical interface that renders easy to understand, application-centric Kubernetes configurations.

## Versions Supported

<Tabs>
<Tabs.TabPane tab="1.0.x" key="1.0.x">

* **1.0.10**

</Tabs.TabPane>
<Tabs.TabPane tab="0.8.x" key="0.8.x">

* **0.8.15** 

</Tabs.TabPane>
<Tabs.TabPane tab="0.5.x" key="0.5.x">

 * **0.5.9**

</Tabs.TabPane>
</Tabs>

## Components

This integration deploys the following components:

* Deployment
* MySql DB
* UI
* Parser

# Ingress

Follow the steps below to configure Ingress on Kubevious:

1. Change kubevious.ui.svcType from "LoadBalancer" to "Cluster IP".

2. Ingress
   * Enable Ingress; change enabled from false to "true"
   * Set Ingress rules like annotations, path, hosts, etc.

With these config changes, you can access the Kubevious service on the Ingress Controller LoadBalancer hostname/IP.

## References

https://github.com/kubevious/kubevious
