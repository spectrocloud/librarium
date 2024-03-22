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

MicroK8s is a Cloud Native Computing Foundation (CNCF) certified upstream Kubernetes deployment that runs entirely on
your workstation or edge device. It runs all Kubernetes services natively without virtual machines and packs all the
required libraries and binaries.

### Support Lifecycle

We support other Kubernetes distributions such as K3s, Microk8s, and RKE2 until their official EOL. The EOL is set by
the respective owner. Once we stop supporting the minor version, we initiate the deprecation process. Refer to the
[Kubernetes Support Lifecycle](kubernetes-support.md#palette-extended-kubernetes-support) guide to learn more.

## Prerequisites

- One of the following Ubuntu environments to run commands:

  - 22.04 LTS
  - 20.04 LTS
  - 18.04 LTS
  - 16.04 LTS

  Or another operating system that supports snapd.

- At least 20 GB of disk space and 4 GB of memory.
- An internet connection.

:::info

If your environment doesn't meet these requirements, there are alternative ways to install MicroK8s, including
additional OS support and an offline deployment.

:::

## Versions Supported

<Tabs queryString="versions">

<TabItem label="1.25.x" value="1.25.x">

- **1.25.0**

</TabItem>

<TabItem label="1.24.x" value="1.24.x">

- **1.24.0**

</TabItem>
</Tabs>

MicroK8s installs a minimal, lightweight Kubernetes you can run and use on almost any machine. When installing MicroK8s
you can specify a channel made up of two components:

- **Track**: denotes the upstream Kubernetes version.
- **Risk level**: indicates the maturity level of the release, such as stable and edge.

MicroK8s comes with its own packaged version of the `kubectl` command for operating Kubernetes. This avoids interfering
with any version that may already be on the host machine. You can run it in a terminal like this: <br />

```yaml
microk8s kubectl
```

If you are using or want to use a different kubectl command, you can configure it for your Linux, Mac, or Windows
operating system.

<br />

:::warning

When you deploy AWS EBS pack with MicroK8s, you need to change EBS CSI pack
`node.kubelet`` values from `/var/lib/kubelet`to`/var/snap/microk8s/common/var/lib/kubelet`.

```yaml
node:
  env: []
  kubeletPath: /var/lib/kubelet
```

```yaml
node:
  env: []
  kubeletPath: /var/snap/microk8s/common/var/lib/kubelet
```

:::

## References

- [MicroK8s ](https://microk8s.io/docs)
