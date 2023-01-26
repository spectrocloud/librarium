---
title: 'Kong'
metaTitle: 'Kong'
metaDescription: 'Kong Ingress pack in Spectro Cloud'
hiddenFromNav: true
type: "integration"
category: ['ingress']
logoUrl: 'https://registry.spectrocloud.com/v1/kong/blobs/sha256:600f20583f85ccad4c515e51542f74aa9acb851d5b03ecb0e7b3435eb51ecf56?type=image/png'
---

import WarningBox from 'shared/components/WarningBox';
import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Kong Ingress Controller

The Kong integration is an Ingress Controller for Kubernetes that configures ingress with a load balancer. Kong can also configure your edge router or additional frontends to help handle incoming requests.

## Version Supported

<Tabs>

<Tabs.TabPane tab="2.13.x" key="2.13.x">

* **2.13.1**

</Tabs.TabPane>

<Tabs.TabPane tab="1.4.x" key="1.4.x">

* **1.4.0**

</Tabs.TabPane>

</Tabs>

## Components

The integration adds the Kong Ingress Controller, which exposes a service of type LoadBalancer.

## References

[Kong Ingress Controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers) <br />
https://github.com/Kong/kubernetes-ingress-controller
