---
title: 'vSphere-Volume'
metaTitle: 'vSphere volume  Integration with Spectro Cloud'
metaDescription: 'vSphere volume storage add on into Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['storage']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/csi-vsphere-volume/blobs/sha256:2cd106b353cb492d4647a1562fe59db6a1aeb792333900fe4e15237f899298b5?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# vSphere Volume

vSphere volume virtualizes SAN/NAS arrays, enabling an efficient operational model optimized for virtualized environments and centered on the application instead of the infrastructure There are two types of provisioners for vSphere storage classes:

* CSI provisioner: csi.vsphere.vmware.com
* vCP provisioner: kubernetes.io/vsphere-volume

## Versions Supported

<Tabs>
<Tabs.TabPane tab="1.0.x" key="1.0.x">

* **1.0.0**
 
</Tabs.TabPane>
</Tabs>

## Notable Parameters

| Name | Supported Values | Default Value | Description |
| --- | --- | --- | --- |
| diskformat | thin, zeroedthick and eagerzeroedthick | zeroedthick | The storage account type to use |
| datastore | Datastore Name | | If specified, the volume will be created on the datastore specified in the storage class |
| isDefaultClass | true, false | true | Flag to denote if this StorageClass will be the default |

**References:**

https://kubernetes.io/docs/concepts/storage/storage-classes/#vsphere


# Further Info

More info about Storage classes can be found in the following links:

https://kubernetes.io/docs/concepts/storage/storage-classes/

# Troubleshooting

Storage classes created by Spectro will be with the name "spectro-storage-class" and can be fetched from kubectl using the following CLI command:

```bash
kubectl get storageclass
```
