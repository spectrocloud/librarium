---
title: 'MetalLB'
metaTitle: 'MetalLB'
metaDescription: 'MetalLB Load Balancer pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['load balancers']
logoUrl: 'https://registry.spectrocloud.com/v1/lb-metallb/blobs/sha256:3d09a1eab856a03d5b821062dcd1da624256e8f1e2ede404d88cb088d3adb945?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# MetalLB

MetalLB is a load-balancer implementation for bare metal [Kubernetes](https://kubernetes.io/) clusters, using standard routing protocols. This integration is recommended for the on-prem cloud(s) and will help external service(s) get an IP address when the service type is set as LoadBalancer.

## MetalLB Pack Working Details:

* The address set in pack values goes into a configMap **`config`** in **`metallb-system`** namespace. This configMap is used by the MetalLB controller and speakers as volume mounts.

* Any changes to the address will get updated in the configMap. Our users may confirm this with this command:
		
		kubectl describe cm config -n metallb-system. 

* However, the controller and speaker pods are already running with a previous copy of the configMap and these deployments are not aware of the new changes made to configMap. To ensure the address change are reflected, we need to restart the controller and speaker pods so that they will fetch the new configMap and start assigning new addresses correctly.

* Run the following commands, which will help restart the controller and speaker:

		  kubectl rollout restart deploy controller -n metallb-system
		  kubectl rollout restart ds speaker -n metallb-system

## Versions Supported

<Tabs>

<Tabs.TabPane tab="0.13.x" key="0.13.x">

* **0.13.5**

</Tabs.TabPane>

<Tabs.TabPane tab="0.11.x" key="0.11.x">

* **0.11.0**

</Tabs.TabPane>

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
