---
title: 'kube-bench'
metaTitle: 'kube-bench'
metaDescription: 'kube-bench security pack in Spectro Cloud'
hiddenFromNav: false
isIntegration: true
category: ['security']
logoUrl: https://registry-addon.spectrocloud.com/v1/kube-bench/blobs/sha256:28c233e5ad884d5356a183c37f323263eb4acca860c28b326ecd99094b500c31?type=image/png
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# kube-bench

Palette executes kube-bench, a CIS Benchmark scanner by Aqua Security, for every Kubernetes pack to ensure the master and worker nodes are configured in a secure manner. It is available as and Add-on layer within Palette.

kube-bench runs against a series of checks specified in a `controls` YAML file. For more information on how to write tests and config files, refer to the [controls](https://github.com/aquasecurity/kube-bench/blob/main/docs/controls.md).


## Versions Supported

<Tabs>

<Tabs.TabPane tab="v0.6.x" key="0.6.x">


**v.0.6.8**

</Tabs.TabPane>
</Tabs>

## References

https://github.com/aquasecurity/kube-bench/blob/main/docs/running.md#running-kube-bench


