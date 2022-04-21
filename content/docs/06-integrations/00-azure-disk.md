---
title: 'Azure-Disk'
metaTitle: 'Azure Disk Integration with Spectro Cloud'
metaDescription: 'Azure Disk storage add on into Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['storage']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/csi-azure/blobs/sha256:0787b7943741181181823079533cd363884a28aa0651715ea43408bdc77a5c51?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';




# Azure Disk

Azure Disk storage is designed to be used with Azure virtual machines for the tenant workloads. It offers high-performance, durable block storage with sub-millisecond latency and throughput for transaction-intensive workloads.


## Versions Supported

<Tabs>
<Tabs.TabPane tab="1.0.x" key="1.0.x">

* **1.0.0** 

</Tabs.TabPane>
</Tabs>

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

```bash
kubectl get storageclass
```
