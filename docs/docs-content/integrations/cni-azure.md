---
sidebar_label: "Azure CNI"
title: "Azure CNI"
description: "Azure CNI network pack for Palette AKS Clusters"
hide_table_of_contents: true
type: "integration"
category: ["network", "amd64"]
sidebar_class_name: "hide-from-sidebar"
tags: ["packs", "azure-cni", "cni", "network"]
---

## Versions Supported

<Tabs queryString="parent">

<TabItem label="1.4.x" value="1.4.x">

:::warning

Make sure to use Azure CNI with the Windows operating system as the kubenet is not available for the Windows
environment.

:::

### Azure CNI Policy Support

Network Policy is a Kubernetes specification that defines access policies for communication between pods. By default,
AKS cluster pods can send and receive traffic without limitations. However, to ensure security, rules to control traffic
flow can be defined. Network Policies define an ordered set of rules to send and receive traffic and applies them to a
collection of pods that match one or more label selectors. Palette enables Network Policies to be included as part of a
wider manifest that also creates a deployment or service. Palette leverages two (2) Network Policies from Azure CNI:

- **azure**: Azure's own implementation, called
  [Azure Network Policy](https://learn.microsoft.com/en-us/azure/virtual-network/kubernetes-network-policies).

- **calico**: An open-source network and network security solution founded by [Tigera](https://www.tigera.io/).

- **none**: No network policy is applied. Use this option if you do not want to apply any network policy.

Palette users can choose any one of the above Network Policies and provide it to the pack YAML file as `networkPolicy`
as given below.

```yaml
pack:
  networkPolicy: "none"
```

:::tip

If you are comparing Azure Network Policy with other Network Policy engines, refer to the
[Differences between Network Policy engines: Cilium, Azure NPM, and Calico](https://learn.microsoft.com/en-us/azure/aks/use-network-policies#differences-between-network-policy-engines-cilium-azure-npm-and-calico).

:::

</TabItem>

</Tabs>
