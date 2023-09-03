---
sidebar_label: 'OpenStackCinder'
title: 'Open Stack Cinder'
description: 'OpenStackCinder storage pack in Spectro Cloud'
hide_table_of_contents: true
type: "integration"
category: ['storage', 'amd64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.dev.spectrocloud.com/v1/csi-openstack-cinder/blobs/sha256:ebb9650566d2cdfe9b0fc7d474a1cdcd562a9020807e49f891df199379ab8961?type=image/png'
tags: ['packs', 'openstack-cinder', 'storage']
---


Unlike the traditional storage drivers of Kubernetes and the implementation of the Container Storage Interface (CSI), we can deliver storage plug-ins using a standard interface without ever having to change the core Kubernetes code. Open Stack Cinder provides OpenShift Container Platform users with storage options, such as volume snapshots that are not possible with in-tree volume plug-ins.

## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.23.x" value="1.23.x">

**1.23**

</TabItem>

<TabItem label="1.22.x" value="1.22.x">

**1.22**

</TabItem>

<TabItem label="1.21.x" value="1.21.x">

**1.21**

</TabItem>

<TabItem label="1.20.x" value="1.20.x">

**1.20**

</TabItem>

<TabItem label="1.19.x" value="1.19.x">

**1.19**

</TabItem>

<TabItem label="1.18.x" value="1.18.x">

**1.18**

</TabItem>

</Tabs>

## References

- [OpenStack Cinder CSI Driver Operator](https://docs.openshift.com/container-platform/4.7/storage/container_storage_interface/persistent-storage-csi-cinder.html#csi-about_persistent-storage-csi-cinder)

- [CSI Cinder driver](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/cinder-csi-plugin/using-cinder-csi-plugin.md/)
