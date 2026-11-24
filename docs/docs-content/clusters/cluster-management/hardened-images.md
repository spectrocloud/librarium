---
sidebar_label: "Security-Hardened Images"
title: "Prepare Clusters for Security-Hardened Images"
description:
  "Learn which requirements your workload clusters must meet to use security-hardened images, and how to use
  security-hardened pack versions."
hide_table_of_contents: false
sidebar_position: 25
tags: ["clusters", "cluster management", "hardened images", "security"]
keywords: ["hardened images", "containerd", "palette agent", "image pull secret", "pack versions", "shi"]
---

Spectro Cloud is transitioning workload clusters to security-hardened images to reduce the attack surface of your
clusters. Security-hardened images contain only the components that an application needs at runtime.

To avoid disruption to existing clusters and new clusters that you deploy, verify that your workload clusters meet the
[requirements](#requirements) on this page. To identify and use security-hardened pack versions, refer to
[Security-Hardened Pack Versions](#security-hardened-pack-versions).

## Image Pull Secret

Clusters use an image pull secret to retrieve security-hardened images from Spectro Cloud registries. In Palette SaaS,
Spectro Cloud manages the image pull secret for you, and no action is required.

In self-hosted Palette and Palette VerteX, you configure the image pull secret yourself. Refer to Configure Image Pull
Secret for [Palette](../../enterprise-version/system-management/configure-image-pull-secret.md) or
[VerteX](../../vertex/system-management/configure-image-pull-secret.md) for more information.

## Requirements

Your workload clusters must meet the following requirements.

### Containerd Version

Cluster nodes must use containerd 2.0 or later. The containerd version depends on the Kubernetes version of your
cluster. The following table lists the earliest patch version of each Kubernetes minor version that includes containerd
2.0 or later. Use the listed patch version or a later one.

| **Kubernetes Distribution**                  | **Kubernetes Versions**                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| Palette eXtended Kubernetes (PXK)            | 1.30.11, 1.31.7, 1.32.3, or any version from 1.33 onward                  |
| Palette eXtended Kubernetes - Edge (PXK-E)   | 1.27.2, 1.28.2, 1.30.4, 1.31.6, 1.32.2, 1.33.1, 1.34.2, 1.35.2, or 1.36.2 |
| K3s                                          | 1.31.14, 1.32.13, 1.33.13, 1.34.9, 1.35.6, or 1.36.2                      |
| RKE2                                         | 1.31.14, 1.32.13, 1.33.13, 1.34.9, 1.35.6, or 1.36.2                      |
| Canonical Kubernetes                         | Any version from 1.32 onward                                              |
| Managed Kubernetes, such as EKS, AKS, or GKE | Select an OS image version that uses containerd 2.0 or later.             |

To change the Kubernetes version of a cluster, update the Kubernetes layer of its cluster profile. Refer to
[Update a Cluster](./cluster-updates.md) for more information.

### Palette Agent Version

The Palette agent on your clusters must be version 4.9.23 or later. The Palette agent upgrades automatically when your
Palette instance is upgraded, except in the following cases:

- You paused agent upgrades for the cluster, its project, or its tenant. Resume agent upgrades so that the agent can
  upgrade. Refer to [Pause Agent Upgrades](./platform-settings/pause-platform-upgrades.md) for more information.

- On an Edge cluster, you specified a Palette agent version in the OS pack of the cluster profile. Specify version
  4.9.23 or later, or remove the agent version from the OS pack. Refer to
  [Configure Palette Agent Version](../edge/cluster-management/agent-upgrade-airgap.md) for more information.

- The cluster is a local Edge cluster. The Palette agent upgrades only when you update the cluster with a cluster
  definition and content bundle built on the upgraded Palette instance. Refer to
  [Configure Palette Agent Version](../edge/cluster-management/agent-upgrade-airgap.md) for more information.

## Security-Hardened Pack Versions

Spectro Cloud publishes security-hardened versions of many packs. A security-hardened pack version uses
security-hardened images for the components that the pack deploys.

Security-hardened pack versions are optional. The standard versions of each pack remain available, and you choose which
version each cluster profile uses.

### Identify Security-Hardened Pack Versions

The version of a security-hardened pack includes `-shi` (for example, `42.4.0-shi`). Palette also displays a **Hardened
Images** indicator, or **HI** where space is limited, next to the pack versions that use security-hardened images. The
indicator appears in the following places:

- Pack search, when you add a pack to a cluster profile.

- The version drop-down menu in the **Edit Pack** panel.

- The layers of a cluster profile.

- The **Profile** tab of a cluster.

Hold the pointer over the indicator to display a link to the image pull secret instructions.

### Use a Security-Hardened Pack Version

1. Verify that the clusters that use the cluster profile meet the [requirements](#requirements) on this page. If your
   self-hosted Palette or Palette VerteX instance pulls images from Spectro Cloud registries, also verify that you
   configured the [image pull secret](#image-pull-secret).

2. In the cluster profile, select the security-hardened version of the pack. Refer to
   [Update the Pack Version](../../profiles/cluster-profiles/modify-cluster-profiles/update-cluster-profile.md#update-the-pack-version)
   for more information.

3. Apply the updated cluster profile to your clusters. Refer to [Update a Cluster](./cluster-updates.md) for more
   information.

### Download Security-Hardened Pack Versions

If your Palette instance cannot reach the Spectro Cloud registries, such as in an airgapped environment, download the
security-hardened pack versions from Artifact Studio. When you download the pack, choose a version that includes `-shi`
from **Select version**. Refer to [Download a Pack](../../downloads/artifact-studio-v2.md#download-a-pack) for more
information.
