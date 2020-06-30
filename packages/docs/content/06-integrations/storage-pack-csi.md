---
title: 'CSI'
metaTitle: 'CSI Integration with Spectro Cloud'
metaDescription: 'Integration of the Vault add on into Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['storage']
logoUrl: 'https://raw.githubusercontent.com/spectrocloud/pax/master/stable/storage/vsphere_volume/logo.png?token=APOFE6VELEWITIQKWD3A7EK7AR7NW'
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Setup

Spectro Storage Pack(s) helps provision StorageClasses on the Kubernetes infrastructure. StorageClasses in Kubernetes are essentially blueprints that abstract away the underlying storage provider, as well as other parameters, like disk-type (e.g.; solid-state vs standard disks).

Storage classes are cloud specific and are detailed below:

# AWS EBS

## Notable Parameters

| Name | Supported Values | Default Value | Description |
| --- | --- | --- | --- |
| storageType | gp2, sc1, st1, io1 | gp2 | AWS Volume type to be used |
| reclaimPolicy | Delete, Retain | Delete | Defines whether volumes will be retained or deleted |
| allowVolumeExpansion | true, false | true | Flag to allow resizing volume |
| isDefaultClass |  true, false | true | Flag to denote if this StorageClass will be the default |
| volumeBindingMode | WaitForFirstConsumer, Immediate | WaitForFirstConsumer | Controls when volumeBinding and dynamic provisioning should happen |

**References:**

https://kubernetes.io/docs/concepts/storage/storage-classes/#aws-ebs

# vSphere Volume

## Notable Parameters

| Name | Supported Values | Default Value | Description |
| --- | --- | --- | --- |
| diskformat | thin, zeroedthick and eagerzeroedthick | zeroedthick | The storage account type to use |
| datastore | Datastore Name | | If specified, the volume will be created on the datastore specified in the storage class |
| isDefaultClass | true, false | true | Flag to denote if this StorageClass will be the default |

**References:**

https://kubernetes.io/docs/concepts/storage/storage-classes/#vsphere

# Azure Disk

## Notable Parameters

| Name | Supported Values | Default Value | Description |
| --- | --- | --- | --- |
| storageaccounttype | Standard_LRS, Premium_LRS | Standard_LRS | The storage account type to use |
| kind | managed, shared, dedicated | managed | The disk kind |
| reclaimPolicy | Delete, Retain | Delete | Defines whether volumes will be retained or deleted |
| allowVolumeExpansion | true, false | true | Flag to allow resizing volume |
| isDefaultClass  | true, false | true | Flag to denote if this StorageClass will be the default |
| volumeBindingMode | WaitForFirstConsumer, Immediate | WaitForFirstConsumer | Controls when volumeBinding and dynamic provisioning should happen |

**References:**

https://kubernetes.io/docs/concepts/storage/storage-classes/#azure-disk-storage-class

# Further Info

More info about Storage classes can be found in the following links:

https://kubernetes.io/docs/concepts/storage/storage-classes/

# Troubleshooting

Storage classes created by Spectro will be with the name "spectro-storage-class" and can be fetched from kubectl using the following CLI command:
```
kubectl get storageclass
```
