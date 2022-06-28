---
title: 'OpenStackCinder'
metaTitle: 'OpenStackCinder'
metaDescription: 'OpenStackCinder storage pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['storage']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/csi-openstack-cinder/blobs/sha256:ebb9650566d2cdfe9b0fc7d474a1cdcd562a9020807e49f891df199379ab8961?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Open Stack Cinder

Unlike the traditional storage drivers of Kubernetes and the implementation of the Container Storage Interface (CSI), we can deliver storage plug-ins using a standard interface without ever having to change the core Kubernetes code. Open Stack Cinder provides OpenShift Container Platform users with storage options, such as volume snapshots that are not possible with in-tree volume plug-ins.

# Versions Supported

<Tabs>

<Tabs.TabPane tab="1.23.x" key="1.23.x">

**1.23**

</Tabs.TabPane>

<Tabs.TabPane tab="1.22.x" key="1.22.x">

**1.22**

</Tabs.TabPane>

<Tabs.TabPane tab="1.21.x" key="1.21.x">

**1.21**

</Tabs.TabPane>

<Tabs.TabPane tab="1.20.x" key="1.20.x">

**1.20**

</Tabs.TabPane>

<Tabs.TabPane tab="1.19.x" key="1.19.x">

**1.19**

</Tabs.TabPane>

<Tabs.TabPane tab="1.18.x" key="1.18.x">

**1.18**

</Tabs.TabPane>

</Tabs>

# References

[OpenStack Cinder CSI Driver Operator](https://docs.openshift.com/container-platform/4.7/storage/container_storage_interface/persistent-storage-csi-cinder.html#csi-about_persistent-storage-csi-cinder)

[CSI Cinder driver](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md/)