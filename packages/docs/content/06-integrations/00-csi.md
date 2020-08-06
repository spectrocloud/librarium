---
title: 'CSI'
metaTitle: 'CSI Integration with Spectro Cloud'
metaDescription: 'Integration of the Vault add on into Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['storage']
logoUrl: 'https://registry.spectrocloud.com/v1/csi-aws/blobs/sha256:f86813591b3b63b3afcf0a604a7c8c715660448585e89174908f3c6a421ad8d8?type=image/png'
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';

# Setup

Spectro Storage Pack(s) helps provision StorageClasses on the Kubernetes infrastructure. StorageClasses in Kubernetes are essentially blueprints that abstract away the underlying storage provider, as well as other parameters, like disk-type (e.g.; solid-state vs standard disks).

Storage classes are cloud-specific and are detailed below:

<Tabs>

<Tabs.TabPane tab="AWS EBS" key="csi_aws">

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

</Tabs.TabPane>

<Tabs.TabPane tab="Azure Disk" key="csi_azure">

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

</Tabs.TabPane>

<Tabs.TabPane tab="vSphere Volume" key="csi_vsphere">

# vSphere Volume

## Notable Parameters

| Name | Supported Values | Default Value | Description |
| --- | --- | --- | --- |
| diskformat | thin, zeroedthick and eagerzeroedthick | zeroedthick | The storage account type to use |
| datastore | Datastore Name | | If specified, the volume will be created on the datastore specified in the storage class |
| isDefaultClass | true, false | true | Flag to denote if this StorageClass will be the default |

**References:**

https://kubernetes.io/docs/concepts/storage/storage-classes/#vsphere

</Tabs.TabPane>

</Tabs>

# Further Info

More info about Storage classes can be found in the following links:

https://kubernetes.io/docs/concepts/storage/storage-classes/

# Troubleshooting

Storage classes created by Spectro will be with the name "spectro-storage-class" and can be fetched from kubectl using the following CLI command:

```bash
kubectl get storageclass
```
