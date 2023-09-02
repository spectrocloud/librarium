---
sidebar_label: 'rook-ceph'
title: 'Rook Ceph'
description: 'Rook Ceph storage pack in Spectro Cloud'
hide_table_of_contents: true
type: "integration"
category: ['storage','amd64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: ' https://registry.dev.spectrocloud.com/v1/csi-rook-ceph/blobs/sha256:2817270f4eecbc2eea0740c55c7611d1a538a3e17da610a3487bb11b067076d1?type=image/png'
tags: ['packs', 'rook-ceph', 'storage']
---

Rook turns storage software into self-managing, self-scaling, and self-healing storage services. It automates deployment, bootstrapping, configuration, provisioning, scaling, upgrading, migration, disaster recovery, monitoring, and resource management. Rook uses the facilities provided by the underlying cloud-native container management, scheduling, and orchestration platform to perform its duties.

The pack provides the following two configurations:
* A three-node Ceph cluster (recommended).
* A single node Ceph cluster.

Please make sure that your worker node pool size satisfies the minimum nodes requirement for your Ceph cluster. Additional disks should be attached to your worker pool nodes to deploy a Ceph cluster. For example, suppose you are using existing appliances for your Kubernetes cluster (typical for edge clusters); you will need to ensure that additional disks (1 or 3 - based on your Ceph cluster settings) are attached to the appliance. The device filter needs to be configured in the pack settings for such cases. As an example, if the additional disks were sdd, sde, sdf, the following configuration would be required:

Example YAML

```yaml
 storage:
   useAllNodes: true
   useAllDevices: false
   deviceFilter: ^sd[d-f]
   config:
     osdsPerDevice: "1" # this value can be overridden at the node or device level
```
## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.9.x" value="1.9.x">

**1.9.2**

</TabItem>

<TabItem label="1.8.x" value="1.8.x">

**1.8.3**

</TabItem>


<TabItem label="1.5.x" value="1.5.x">

**1.5.9**

</TabItem>


</Tabs>

## References

- [Rook Cepth Documentation](https://rook.io/docs/rook/v1.10/Getting-Started/intro/)
