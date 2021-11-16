---
title: 'MetalLB'
metaTitle: 'MetalLB'
metaDescription: 'MetalLB Load Balancer pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['load balancers']
logoUrl: 'https://registry.spectrocloud.com/v1/lb-metallb/blobs/sha256:3d09a1eab856a03d5b821062dcd1da624256e8f1e2ede404d88cb088d3adb945?type=image/png'
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";


# MetalLB

MetalLB is a load-balancer implementation for bare metal [Kubernetes](https://kubernetes.io/) clusters, using standard routing protocols. This integration is recommended for the on-prem cloud(s) and will help external service(s) get an IP address when the service type is set as LoadBalancer.

## Versions Supported

<Tabs>
<Tabs.TabPane tab="0.9.x" key="0.9.x">

* **0.9.5** 

</Tabs.TabPane>
<Tabs.TabPane tab="0.8.x" key="0.8.x">

  * **0.8.3**

</Tabs.TabPane>
</Tabs>

## Components

* MetalLB controller.
* Speaker (runs on all nodes, deployed as DaemonSet).

## References

https://metallb.universe.tf/ <br />
https://github.com/metallb/metallb
