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

[MicroK8s](https://microk8s.io) is a lightweight Cloud Native Computing Foundation (CNCF) certified Kubernetes
distribution developed by [Canonical](https://canonical.com). It deploys all Kubernetes services in a single, fully
contained package, while also offering out-of-the-box [add-ons](https://microk8s.io/docs/addons).

Palette offers MicroK8s as Kubernetes distribution available for creating clusters. You can use MicroK8s as the
Kubernetes layer when creating [cluster profiles](../profiles/profiles.md) and then use the cluster profiles to deploy
clusters.

### Support Lifecycle

We support different Kubernetes distributions, such as MicroK8s, K3s, and RKE2, until their official End-of-Life (EOL).
The EOL is set by the respective owner. Once we stop supporting the minor version, we initiate the deprecation process.
Refer to the [Kubernetes Support Lifecycle](kubernetes-support.md#other-kubernetes-distributions) guide to learn more.

## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.28.x" value="1.28.x">

### Prerequisites

- A minimum of 20 GB of disk space and 4 GB of memory.

- Operating System (OS) pack layer and infrastructure provider dependencies as listed in the table below.

  | Infrastructure Platform | OS     | Version | Supported?         |
  | ----------------------- | ------ | ------- | ------------------ |
  | AWS                     | Ubuntu | 22.04   | :white_check_mark: |
  | MAAS                    | Ubuntu | 22.04   | :white_check_mark: |

### Parameters

| Parameter                        | Description                                                                                                                                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `microk8sConfig.addons`          | A list of [MicroK8s addons](https://microk8s.io/docs/addons) you can set for your cluster. `Ingress` and `DNS` are mandatory and enabled by default.                                                                        |
| `microk8sConfig.upgradeStrategy` | It describes how to replace existing nodes of your cluster with new ones during upgrades. Values can be `RollingUpgrade` (default), `InPlaceUpgrade`, or `SmartUpgrade`. Refer to the [Usage](#usage) section for guidance. |
| `microk8sConfig.bootCommands`    | A list of commands you can set to be executed during boot.                                                                                                                                                                  |
| `microk8sConfig.preRunCommands`  | A list of commands you can set to be executed before installing MicroK8s in your cluster.                                                                                                                                   |
| `microk8sConfig.postRunCommands` | A list of commands you can set to be executed after installing MicroK8s in your cluster.                                                                                                                                    |

### Usage

To use MicroK8s, select it as the Kubernetes distribution when choosing the Kubernetes layer during the cluster profile
creation. Remember that the cloud type must be either AWS or MAAS, and the OS layer must be Ubuntu 22.04.

![A view of the cluster profile Kubernetes selection screen](/integrations_microk8s_cluster-profile-view.webp)

:::info

MicroK8s clusters use the [Calico CNI](https://microk8s.io/docs/change-cidr) by default. However, this default
installation was disabled due to Palette's requirement for a CNI layer to be present in the cluster profiles. This way,
users can choose their preferred CNI layer during the cluster profile creation.

:::

#### Upgrade Strategy

The upgrade strategy describes how to replace existing nodes with new ones during upgrades.

You can specify the upgrade strategy during cluster profile creation by editing the value of the `upgradeStrategy`
parameter in the MicroK8s pack YAML file displayed under the **Pack Details** section.

Three types of upgrade strategy are available:

- `RollingUpgrade` - The default upgrade strategy that deletes the current control plane node before creating a new one.

  :::warning

  When using the `RollingUpgrade` strategy, the cluster must have at least three control plane nodes. Otherwise, the API
  server will be down during the upgrade, and the cluster will not be accessible.

  :::

- `InPlaceUpgrade` - Performs an in-place upgrade of the control plane. For clusters with one control plane and one
  worker node, `InPlaceUpgrade` temporarily shuts down the API server.
- `SmartUpgrade` - Performs an in-place upgrade of the control plane on clusters with fewer than three control plane
  nodes, and a rolling upgrade on clusters with three or more control plane nodes.

#### Using MicroK8s with the AWS EBS Pack

When using the [AWS EBS pack](./aws-ebs.md) with MicroK8s, you need to change the EBS CSI pack `node.kubelet` parameter
from `/var/lib/kubelet` to `/var/snap/microk8s/common/var/lib/kubelet`.

```yaml {3}
node:
  env: []
  kubeletPath: /var/lib/kubelet
```

```yaml {3}
node:
  env: []
  kubeletPath: /var/snap/microk8s/common/var/lib/kubelet
```

</TabItem>

<TabItem label="1.27.x" value="1.27.x">

### Prerequisites

- A minimum of 20 GB of disk space and 4 GB of memory.

- Operating System (OS) pack layer and infrastructure provider dependencies as listed in the table below.

  | Infrastructure Platform | OS     | Version | Supported?         |
  | ----------------------- | ------ | ------- | ------------------ |
  | AWS                     | Ubuntu | 22.04   | :white_check_mark: |
  | MAAS                    | Ubuntu | 22.04   | :white_check_mark: |

### Parameters

| Parameter                        | Description                                                                                                                                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `microk8sConfig.addons`          | A list of [MicroK8s addons](https://microk8s.io/docs/addons) you can set for your cluster. `Ingress` and `DNS` are mandatory and enabled by default.                                                                        |
| `microk8sConfig.upgradeStrategy` | It describes how to replace existing nodes of your cluster with new ones during upgrades. Values can be `RollingUpgrade` (default), `InPlaceUpgrade`, or `SmartUpgrade`. Refer to the [Usage](#usage) section for guidance. |
| `microk8sConfig.bootCommands`    | A list of commands you can set to be executed during boot.                                                                                                                                                                  |
| `microk8sConfig.preRunCommands`  | A list of commands you can set to be executed before installing MicroK8s in your cluster.                                                                                                                                   |
| `microk8sConfig.postRunCommands` | A list of commands you can set to be executed after installing MicroK8s in your cluster.                                                                                                                                    |

### Usage

To use MicroK8s, select it as the Kubernetes distribution when choosing the Kubernetes layer during the cluster profile
creation. Remember that the cloud type must be either AWS or MAAS, and the OS layer must be Ubuntu 22.04.

![A view of the cluster profile Kubernetes selection screen](/integrations_microk8s_cluster-profile-view.webp)

:::info

MicroK8s clusters use the [Calico CNI](https://microk8s.io/docs/change-cidr) by default. However, this default
installation was disabled due to Palette's requirement for a CNI layer to be present in the cluster profiles. This way,
users can choose their preferred CNI layer during the cluster profile creation.

:::

#### Upgrade Strategy

The upgrade strategy describes how to replace existing nodes with new ones during upgrades.

You can specify the upgrade strategy during cluster profile creation by editing the value of the `upgradeStrategy`
parameter in the MicroK8s pack YAML file displayed under the **Pack Details** section.

Three types of upgrade strategy are available:

- `RollingUpgrade` - The default upgrade strategy that deletes the current control plane node before creating a new one.

  :::warning

  When using the `RollingUpgrade` strategy, the cluster must have at least three control plane nodes. Otherwise, the API
  server will be down during the upgrade, and the cluster will not be accessible.

  :::

- `InPlaceUpgrade` - Performs an in-place upgrade of the control plane. For clusters with one control plane and one
  worker node, `InPlaceUpgrade` temporarily shuts down the API server.
- `SmartUpgrade` - Performs an in-place upgrade of the control plane on clusters with fewer than three control plane
  nodes, and a rolling upgrade on clusters with three or more control plane nodes.

</TabItem>

<TabItem label="1.26.x" value="1.26.x">

### Prerequisites

- A minimum of 20 GB of disk space and 4 GB of memory.

- Operating System (OS) pack layer and infrastructure provider dependencies as listed in the table below.

  | Infrastructure Platform | OS     | Version | Supported?         |
  | ----------------------- | ------ | ------- | ------------------ |
  | AWS                     | Ubuntu | 22.04   | :white_check_mark: |
  | MAAS                    | Ubuntu | 22.04   | :white_check_mark: |

### Parameters

| Parameter                        | Description                                                                                                                                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `microk8sConfig.addons`          | A list of [MicroK8s addons](https://microk8s.io/docs/addons) you can set for your cluster. `Ingress` and `DNS` are mandatory and enabled by default.                                                                        |
| `microk8sConfig.upgradeStrategy` | It describes how to replace existing nodes of your cluster with new ones during upgrades. Values can be `RollingUpgrade` (default), `InPlaceUpgrade`, or `SmartUpgrade`. Refer to the [Usage](#usage) section for guidance. |
| `microk8sConfig.bootCommands`    | A list of commands you can set to be executed during boot.                                                                                                                                                                  |
| `microk8sConfig.preRunCommands`  | A list of commands you can set to be executed before installing MicroK8s in your cluster.                                                                                                                                   |
| `microk8sConfig.postRunCommands` | A list of commands you can set to be executed after installing MicroK8s in your cluster.                                                                                                                                    |

:::tip

Even though the `microk8sConfig.bootCommands`, `microk8sConfig.preRunCommands`, and `microk8sConfig.postRunCommands`
parameters are not visible in the YAML file displayed for the MicroK8s pack during cluster profile creation, you can
manually add them to the pack settings according to the example below.

```yaml
microk8sConfig:
  addons:
    - dns
    - ingress
  upgradeStrategy: RollingUpgrade
  bootCommands:
    - 'echo "===> bootCommands1" > /home/ubuntu/myfile1.txt'
  preRunCommands:
    - 'echo "===> preRunCommands1" > /home/ubuntu/myfile3.txt'
  postRunCommands:
    - 'echo "List of postRun commands to be executed"'
```

:::

### Usage

To use MicroK8s, select it as the Kubernetes distribution when choosing the Kubernetes layer during the cluster profile
creation. Remember that the cloud type must be either AWS or MAAS, and the OS layer must be Ubuntu 22.04.

![A view of the cluster profile Kubernetes selection screen](/integrations_microk8s_cluster-profile-view.webp)

:::info

MicroK8s clusters use the [Calico CNI](https://microk8s.io/docs/change-cidr) by default. However, this default
installation was disabled due to Palette's requirement for a CNI layer to be present in the cluster profiles. This way,
users can choose their preferred CNI layer during the cluster profile creation.

:::

#### Upgrade Strategy

The upgrade strategy describes how to replace existing nodes with new ones during upgrades.

You can specify the upgrade strategy during cluster profile creation by editing the value of the `upgradeStrategy`
parameter in the MicroK8s pack YAML file displayed under the **Pack Details** section.

Three types of upgrade strategy are available:

- `RollingUpgrade` - The default upgrade strategy that deletes the current control plane node before creating a new one.

  :::warning

  When using the `RollingUpgrade` strategy, the cluster must have at least three control plane nodes. Otherwise, the API
  server will be down during the upgrade, and the cluster will not be accessible.

  :::

- `InPlaceUpgrade` - Performs an in-place upgrade of the control plane. For clusters with one control plane and one
  worker node, `InPlaceUpgrade` temporarily shuts down the API server.
- `SmartUpgrade` - Performs an in-place upgrade of the control plane on clusters with fewer than three control plane
  nodes, and a rolling upgrade on clusters with three or more control plane nodes.

</TabItem>

<TabItem label="Deprecated" value="Deprecated">

:::warning

All versions less than version 1.26.x are considered deprecated. Upgrade to a newer version to take advantage of new
features.

:::

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
  version = "1.28"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

## References

- [MicroK8s Documentation](https://microk8s.io/docs)
- [MicroK8s GitHub Repository](https://github.com/canonical/microk8s)
