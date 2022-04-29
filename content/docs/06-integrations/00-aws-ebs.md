---
title: 'AWS-EBS'
metaTitle: 'AWS EBS Integration with Spectro Cloud'
metaDescription: 'AWS EBS storage add on into Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['storage']
logoUrl: 'https://registry.spectrocloud.com/v1/csi-aws/blobs/sha256:f86813591b3b63b3afcf0a604a7c8c715660448585e89174908f3c6a421ad8d8?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';




# AWS EBS

AWS Elastic Block Store is an easy to use, high performance block storage at any scale. It helps in the easy deployment, management and scaling of the most demanding and high performance tenant workloads. AWS EBS also ensures availability with replication and durability.



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
https://aws.amazon.com/ebs/


# Further Info

More info about Storage classes can be found in the following links:

https://kubernetes.io/docs/concepts/storage/storage-classes/

# Troubleshooting

Storage classes created by Spectro will be with the name "spectro-storage-class" and can be fetched from kubectl using the following CLI command:

```bash
kubectl get storageclass
```
