---
sidebar_label: "Azure Disk"
title: "Azure Disk"
description: "Azure Disk storage add on into Spectro Cloud"
hide_table_of_contents: true
type: "integration"
category: ["storage", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.dev.spectrocloud.com/v1/csi-azure/blobs/sha256:0787b7943741181181823079533cd363884a28aa0651715ea43408bdc77a5c51?type=image.webp"
tags: ["packs", "azure-disk", "storage"]
---

Azure Disk storage is designed to be used with Azure virtual machines for the tenant workloads. It offers
high-performance, durable block storage with sub-millisecond latency and throughput for transaction-intensive workloads.

## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.20.x" value="1.20.x">

</TabItem>
<TabItem label="1.0.x" value="1.0.x">

</TabItem>
</Tabs>

## Notable Parameters

| Name                 | Supported Values                | Default Value        | Description                                                        |
| -------------------- | ------------------------------- | -------------------- | ------------------------------------------------------------------ |
| storageaccounttype   | Standard_LRS, Premium_LRS       | Standard_LRS         | The storage account type to use                                    |
| kind                 | managed, shared, dedicated      | managed              | The disk kind                                                      |
| reclaimPolicy        | Delete, Retain                  | Delete               | Defines whether volumes will be retained or deleted                |
| allowVolumeExpansion | true, false                     | true                 | Flag to allow resizing volume                                      |
| isDefaultClass       | true, false                     | true                 | Flag to denote if this StorageClass will be the default            |
| volumeBindingMode    | WaitForFirstConsumer, Immediate | WaitForFirstConsumer | Controls when volumeBinding and dynamic provisioning should happen |

## Troubleshooting

Storage classes created by Palette are named `spectro-storage-class` and can be fetched from kubectl using the following
CLI command:

```bash
kubectl get storageclass --all-namespaces
```

## References

- [Azure Disk Storage Class](https://kubernetes.io/docs/concepts/storage/storage-classes/#azure-disk-storage-class)

- [Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes)
