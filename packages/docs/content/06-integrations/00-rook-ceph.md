---
title: 'rook-ceph'
metaTitle: 'rook-ceph'
metaDescription: 'Rook Ceph storage pack in Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['storage']
logoUrl: ' https://registry.dev.spectrocloud.com/v1/csi-rook-ceph/blobs/sha256:2817270f4eecbc2eea0740c55c7611d1a538a3e17da610a3487bb11b067076d1?type=image/png'
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";


# Rook Ceph

Rook Ceph is an open source cloud-native storage orchestration providing the platform, framework, and support for a diverse set of storage solutions to natively integrate with cloud-native environments.

Rook turns storage software into self-managing, self-scaling, and self-healing storage services. It does this by automating deployment, bootstrapping, configuration, provisioning, scaling, upgrading, migration, disaster recovery, monitoring, and resource management. Rook uses the facilities provided by the underlying cloud-native container management, scheduling and orchestration platform to perform its duties.

This pack provides configurations for setting up a three-node Ceph cluster (recommended) and a single node Ceph cluster. Please make sure your worker node pool size satisfies the minimum nodes requirement for your Ceph cluster. Additional disks should be attached to your worker pool nodes to deploy a Ceph cluster. Suppose you use existing appliances for your Kubernetes cluster (typical for edge clusters). In that case, you will need to ensure additional disks (1 or 3 - based on your Ceph cluster settings) are attached to the appliance. The device filter needs to be configured in the pack settings for such cases. As an example, if the additional disks were sdd, sde, sdf, the following configuration would be required:

**Example:**		
```json
 storage: 
   useAllNodes: true
   useAllDevices: false
   deviceFilter: ^sd[d-f]
   config:
      osdsPerDevice: "1" # this value can be overridden at the node or device level

```
## Versions Supported

<Tabs>

<Tabs.TabPane tab="1.5.x" key="1.5.x">

**1.5.9**

</Tabs.TabPane>


</Tabs>

## References

https://github.com/rook/rook/blob/master/Documentation/ceph-quickstart.md