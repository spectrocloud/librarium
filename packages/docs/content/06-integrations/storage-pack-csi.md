---
title: "CSI Storage Pack"
metaTitle: "CSI Storage Pack"
metaDescription: "Creating a Storage Pack in Spectro Cloud using CSI"
icon: ""
---

# Overviews

## CSI - Container Storage Interface

The goal of [CSI](https://kubernetes.io/blog/2018/01/introducing-container-storage-interface/#what-is-csi) is to establish a standardized mechanism for Container Orchestration Systems (COs) to expose arbitrary storage systems to their containerized workloads.

## Spectro Storage Packs

Spectro Storage Pack(s) helps provision StorageClasses on the kubernetes infrastructure. StorageClasses in kubernetes are essentially blueprints that abstract away the underlying storage provider, as well as other parameters, like disk-type (e.g.; solid-state vs standard disks).

# Setup

Storage classes are cloud specific and are detailed below:

## Parameters

| Name | Supported Values | Default Value | Description |
| --- | --- | --- | --- |
| `aws_ebs.storageType` | gp2, sc1, st1, io1 | gp2 | AWS Volume type to be used |
| `aws_ebs.reclaimPolicy` | Delete, Retain | Delete | Defines whether volumes will be retained or deleted |
| `aws_ebs.allowVolumeExpansion` | true, false | true | Flag to allow resizing volume |
| `aws_ebs.isDefaultClass` |  true, false | true | Flag to denote if this StorageClass will be the default |
| `aws_ebs.volumeBindingMode` | WaitForFirstConsumer, Immediate | WaitForFirstConsumer | Controls when volumeBinding and dynamic provisioning should happen |
| `azure_disk.storageaccounttype` | Standard_LRS, Premium_LRS | Standard_LRS | |
| `azure_disk.kind` | managed, shared, dedicated | managed | |
| `azure_disk.reclaimPolicy` | Delete, Retain | Delete | |
| `azure_disk.allowVolumeExpansion` | true, false | true | |
| `azure_disk.isDefaultClass`  | true, false | true | |
| `azure_disk.volumeBindingMode` | WaitForFirstConsumer, Immediate | WaitForFirstConsumer | |
| `vsphere.diskformat` | thin, zeroedthick and eagerzeroedthick | zeroedthick | |
| `vsphere.isDefaultClass` | true, false | true |  |
| `vsphere.datastore` | Datastore Name | | |

More info about Storage classes can be found in the following links:

https://kubernetes.io/docs/concepts/storage/storage-classes/
https://kubernetes.io/docs/concepts/storage/storage-classes/#aws-ebs
https://kubernetes.io/docs/concepts/storage/storage-classes/#azure-disk-storage-class
https://kubernetes.io/docs/concepts/storage/storage-classes/#vsphere

# Troubleshooting

Storage classes created by Spectro will be with the name "spectro-storage-class" and can be fetched from kubectl using the following CLI command:

`kubectl get storageclass`
