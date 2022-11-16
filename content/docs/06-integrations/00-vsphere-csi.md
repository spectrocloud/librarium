---
title: 'vSphere-csi'
metaTitle: 'vSphere CSI Integration with Spectro Cloud'
metaDescription: 'vSphere CSI storage add on into Spectro Cloud'
hiddenFromNav: true
isIntegration: true
category: ['storage']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/csi-vsphere-volume/blobs/sha256:2cd106b353cb492d4647a1562fe59db6a1aeb792333900fe4e15237f899298b5?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# vSphere CSI

The main goal of vSphere CSI is to expose vSphere storage and features to Kubernetes users. It offers an in-tree volume driver that has been actively used by various Kubernetes as a service providers including on-prem. Cloud Native Storage (CNS) is a result of evolution and productization of vSphere Storage for Kubernetes and is also enterprise ready. 

## vSphere CSI Driver Components

The vSphere CSI driver includes the following components:

* vSphere CSI Controller
* vSphere CSI Node
* Syncer

    * Metadata Syncer
    * Full Sync

## vSphere CSI Compatibility Matrix

|Palette Release| CSI-Driver Version| Kubernetes Versions |
|---------------|-------------------|---------------------|
|      2.2      |  2.3.0            | 1.20.x to 1.23.x    |
|      2.8      |  2.5.2            | 1.20.x to 1.23.x    |


## Versions Supported

<Tabs>

<Tabs.TabPane tab="2.5.x" key="2.5.x">

* **2.5.2**
 
</Tabs.TabPane>
<Tabs.TabPane tab="2.3.x" key="2.3.x">

* **2.3.0**
 
</Tabs.TabPane>
</Tabs>

**References:**

https://vsphere-csi-driver.sigs.k8s.io/

https://github.com/kubernetes-sigs/vsphere-csi-driver


# Further Info

More info about Storage classes can be found in the following links:

https://kubernetes.io/docs/concepts/storage/storage-classes/

# Troubleshooting

Storage classes created by Spectro will be with the name "spectro-storage-class" and can be fetched from kubectl using the following CLI command:

```bash
kubectl get storageclass
```
