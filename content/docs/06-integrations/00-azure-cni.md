---
title: 'Azure CNI'
metaTitle: 'Azure CNI'
metaDescription: 'Azure CNI network pack for Palette AKS Clusters'
hiddenFromNav: true
isIntegration: true
category: ['network']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/csi-azure/blobs/sha256:0787b7943741181181823079533cd363884a28aa0651715ea43408bdc77a5c51?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Azure CNI

Palette supports Azure Container Network Interface (CNI) networking for AKS clusters. Azure CNI enables each pod to have exclusive IP addresses from the subnet with direct accessibility. To allocate unique IP addresses to individual pods advanced forethought needs to be put in. As per the maximum pods supported by a node [IP addresses need to be reserved](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni#plan-ip-addressing-for-your-cluster) in advance. The default [maximum number](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni#maximum-pods-per-node) of pods per node varies between kubenet and Azure CNI networking, and based on the method of cluster deployment. 



## Versions Supported

<Tabs>

<Tabs.TabPane tab="1.4.x" key="1.4.x">

**1.4.0**

</Tabs.TabPane>

</Tabs>


# Azure CNI Policy Support

Palette supports 3 policies for Azure CNI:

* none

* azure

* calico

Palette users can choose any one of the above network policies and provide it to the pack YAML file as `networkPolicy` as given below:

<br />
<br />

```yaml
pack:
  # The Network policy for ingress and egress traffic between pods in a cluster. Supported values are none, azure, calico
  networkPolicy: "none"
```
<br />
<br />

<WarningBox>
Make sure to use Azure CNI with Windows operating system as the 
kubenet is not available for Windows environment
</WarningBox>

<br />
<br />

## References
* https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md
* https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni

