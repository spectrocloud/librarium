---
sidebar_label: 'Azure CNI'
title: 'Azure CNI'
description: 'Azure CNI network pack for Palette AKS Clusters'
hide_table_of_contents: true
type: "integration"
category: ['network', 'amd64']
sidebar_class_name: "hide-from-sidebar"
logoUrl: 'https://registry.dev.spectrocloud.com/v1/csi-azure/blobs/sha256:0787b7943741181181823079533cd363884a28aa0651715ea43408bdc77a5c51?type=image/png'
tags: ["packs", "azure-cni", "cni", "network"]
---


Palette supports Azure Container Network Interface (CNI) networking for Azure Kubernetes Service (AKS) clusters. Azure CNI enables each pod to have exclusive IP addresses from the subnet with direct accessibility.

To allocate unique IP addresses to individual pods, advanced forethought needs to be put in. As per the maximum pods supported by a node, [IP addresses need to be reserved](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni#plan-ip-addressing-for-your-cluster) in advance. The default [maximum number](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni#maximum-pods-per-node) of pods per node varies between kubenet and Azure CNI networking and based on the method of cluster deployment.


## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.4.x" value="1.4.x">

**1.4.0**

</TabItem>

</Tabs>


# Azure CNI Policy Support

Network Policy is a Kubernetes specification that defines access policies for communication between pods. By default, AKS cluster pods can send and receive traffic without limitations. However, to ensure security, rules to control traffic flow can be defined. Network Policies define an ordered set of rules to send and receive traffic and applies them to a collection of pods that match one or more label selectors. Palette enables Network Policies to be included as part of a wider manifest that also creates a deployment or service. Palette leverages two (2) Network Policies from Azure CNI:

<br />

* **azure**: Azure's own implementation, called Azure Network Policy.

* **calico**: An open-source network and network security solution founded by [Tigera](https://www.tigera.io/).


Palette users can choose any one of the above Network Policies and provide it to the pack YAML file as `networkPolicy` as given below:

<br />
<br />

```yaml
pack:
  # The Network policy for ingress and egress traffic between pods in a cluster. Supported values are none, azure, calico
  networkPolicy: "none"
```
<br />

:::info
 Provide the networkPolicy value as none if no policy to be applied.
:::


<br />


## Azure and Calico Policies and their Capabilities

|Capability |Azure  |Calico|
|-----------|-------|------|
|Supported platforms|Linux|Linux, Windows Server 2019 and 2022|
|Supported networking options|Azure CNI|Azure CNI (Linux, Windows Server 2019 and 2022) and kubenet (Linux)|
|Compliance with Kubernetes specification|All policy types supported|	All policy types supported|
|Additional features|	None	|Extended policy model consisting of Global Network Policy, Global Network Set, and Host Endpoint. For more information on using the calicoctl CLI to manage these extended features, see calicoctl user reference guide.|
|Support|Supported by Azure Support and Engineering team|Calico community support.|
|Logging|Rules added or deleted in IP Tables are logged on every host under `/var/log/azure-npm.log`|For more information, see [Calico component logs](https://projectcalico.docs.tigera.io/maintenance/troubleshoot/component-logs)|

:::caution

Make sure to use Azure CNI with the Windows operating system as the kubenet is not available for the Windows environment.

:::

<br />

## References

- [Azure CNI Git](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md)


- [Azure CNI](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni)
