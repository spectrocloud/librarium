---
sidebar_label: "MicroK8s"
title: "MicroK8s"
description: "MicroK8s pack in Palette"
hide_table_of_contents: true
type: "integration"
category: ["kubernetes", "amd64"]
sidebar_class_name: "hide-from-sidebar"
logoUrl: "https://registry.spectrocloud.com/v1/kubernetes-microk8s/blobs/sha256:b971b64f62e2e67b0a166316f96e6f4211aacea6e28459bb89275e8882ade985?type=image.webp"
tags: ["packs", "microk8s", "kubernetes"]
---

## Support Lifecycle

We support different Kubernetes distributions, such as MicroK8s, K3s, and RKE2, until their official End-of-Life (EOL).
The EOL is set by the respective owner. Once we stop supporting the minor version, we initiate the deprecation process.
Refer to the [Kubernetes Support Lifecycle](kubernetes-support.md#other-kubernetes-distributions) guide to learn more.

## Versions Supported

<Tabs queryString="parent">

<TabItem label="1.27.x" value="1.27.x">

## Container Network Interface (CNI)

MicroK8s clusters use the [Calico CNI](https://microk8s.io/docs/change-cidr) by default. However, this default
installation was disabled due to Palette's requirement for a CNI layer to be present in the cluster profiles. This way,
users can choose their preferred CNI layer during the cluster profile creation.

## Upgrade Strategy

The upgrade strategy describes how to replace existing control plane nodes with new ones during upgrades.

You can specify the upgrade strategy during cluster profile creation by editing the value of the `upgradeStrategy`
parameter in the MicroK8s pack YAML file displayed under the **Pack Details** section.

:::warning

Before upgrading your cluster, review the [Kubernetes Upgrades](kubernetes-support.md#kubernetes-upgrades) pages to
learn about the limitations associated with MicroK8s upgrades.

:::

The MicroK8s pack supports three types of upgrade strategies:

- `InPlaceUpgrade` - Performs an in-place upgrade of the control plane. For clusters with one control plane and one
  worker node, `InPlaceUpgrade` temporarily shuts down the API server.

- `RollingUpgrade` - The default upgrade strategy that deletes the current control plane node before creating a new one.

- `SmartUpgrade` - Performs an in-place upgrade of the control plane on clusters with fewer than three control plane
  nodes, and a rolling upgrade on clusters with three or more control plane nodes.

</TabItem>

<TabItem label="1.26.x" value="1.26.x">

## Container Network Interface (CNI)

MicroK8s clusters use the [Calico CNI](https://microk8s.io/docs/change-cidr) by default. However, this default
installation was disabled due to Palette's requirement for a CNI layer to be present in the cluster profiles. This way,
users can choose their preferred CNI layer during the cluster profile creation.

## Upgrade Strategy

The upgrade strategy describes how to replace existing control plane nodes with new ones during upgrades.

You can specify the upgrade strategy during cluster profile creation by editing the value of the `upgradeStrategy`
parameter in the MicroK8s pack YAML file displayed under the **Pack Details** section.

:::warning

Before upgrading your cluster, review the [Kubernetes Upgrades](kubernetes-support.md#kubernetes-upgrades) pages to
learn about the limitations associated with MicroK8s upgrades.

:::

The MicroK8s pack supports three types of upgrade strategies:

- `InPlaceUpgrade` - Performs an in-place upgrade of the control plane. For clusters with one control plane and one
  worker node, `InPlaceUpgrade` temporarily shuts down the API server.

- `RollingUpgrade` - The default upgrade strategy that deletes the current control plane node before creating a new one.

- `SmartUpgrade` - Performs an in-place upgrade of the control plane on clusters with fewer than three control plane
  nodes, and a rolling upgrade on clusters with three or more control plane nodes.

</TabItem>
</Tabs>

## Terraform

You can reference the MicroK8s pack in Terraform with the following data resource.

```hcl
data "spectrocloud_registry" "public_registry" {
  name = "Public Repo"
}

data "spectrocloud_pack" "k8s" {
  name    = "kubernetes-microk8s"
  version = "1.27"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```
