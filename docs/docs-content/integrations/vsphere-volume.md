---
sidebar_label: "vSphere-Volume"
title: "vSphere Volume"
description: "vSphere volume storage add on into Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/csi-vsphere-volume/blobs/sha256:2cd106b353cb492d4647a1562fe59db6a1aeb792333900fe4e15237f899298b5?type=image.webp"
tags: ["packs", "vSphere-Volume", "storage"]
---

vSphere volume virtualizes SAN/NAS arrays, enabling an efficient operational model optimized for virtualized
environments and centered on the application instead of the infrastructure There are two types of provisioners for
vSphere storage classes:

- CSI provisioner: csi.vsphere.vmware.com
- vCP provisioner: kubernetes.io/vsphere-volume

## Versions Supported

<Tabs queryString="versions">
<TabItem label="1.0.x" value="1.0.x">

- **1.0.0**

</TabItem>
</Tabs>

## Parameters

| Name           | Supported Values                       | Default Value | Description                                                                              |
| -------------- | -------------------------------------- | ------------- | ---------------------------------------------------------------------------------------- |
| diskformat     | thin, zeroedthick and eagerzeroedthick | zeroedthick   | The storage account type to use                                                          |
| datastore      | Datastore Name                         |               | If specified, the volume will be created on the datastore specified in the storage class |
| isDefaultClass | true, false                            | true          | Flag to denote if this StorageClass will be the default                                  |

## Troubleshooting

Storage classes created by Spectro will be with the name "spectro-storage-class" and can be fetched from kubectl using
the following CLI command:

```bash
kubectl get storageclass
```

## References

- [vSphere Storage Class](https://kubernetes.io/docs/concepts/storage/storage-classes/#vsphere)
