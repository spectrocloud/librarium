---
title: 'kube-bench'
metaTitle: 'kube-bench'
metaDescription: 'kube-bench security pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['monitoring']
# logoUrl: 'https://registry.dev.spectrocloud.com/v1/kubehbench/blobs/'  Logo needs to be added
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# kube-bench

Palette executes kube-bench, a CIS Benchmark scanner by Aqua Security, for every Kubernetes pack to ensure the master and worker nodes are configured in a secure manner.

kube-bench runs against series of checks specified in a `controls` YAML file. For more information on how to write tests and config files, refer to the [controls]
(https://github.com/aquasecurity/kube-bench/blob/main/docs/controls.md).


## Versions Supported

<Tabs>

<Tabs.TabPane tab="v0.6.x" key="0.6.x">


v0.6.8
v0.6.7-rc1
v0.6.7
v0.6.6
v0.6.5
v0.6.4
v0.6.3
v0.6.2
v0.6.0
v0.6.1 

</Tabs.TabPane>
</Tabs>

## References

https://github.com/aquasecurity/kube-bench/blob/main/docs/running.md#running-kube-bench

