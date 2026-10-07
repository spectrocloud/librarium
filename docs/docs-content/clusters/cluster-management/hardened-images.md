---
sidebar_label: "Prepare Clusters for Security-Hardened Images"
title: "Prepare Clusters for Security-Hardened Images"
description: "Learn which requirements your workload clusters must meet to use security-hardened images."
hide_table_of_contents: false
sidebar_position: 55
tags: ["clusters", "cluster management", "hardened images", "security"]
keywords: ["hardened images", "containerd", "palette agent", "image pull secret"]
---

Spectro Cloud is transitioning workload clusters to security-hardened images to reduce the attack surface of your
clusters. Security-hardened images contain only the components that an application needs at runtime.

To avoid disruption to existing clusters and new clusters that you deploy, verify that your workload clusters meet the
[requirements](#requirements) on this page. Refer to the
[Announcements](../../release-notes/announcements.md#upcoming-breaking-changes) page for the latest updates on the
transition.

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
cluster. The following table lists the Kubernetes versions that include containerd 2.0 or later. For each minor version,
use the listed patch version or a later one.

| Kubernetes Distribution                      | Kubernetes Versions                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| Palette eXtended Kubernetes (PXK)            | 1.30.11, 1.31.7, 1.32.3, or any 1.33 version                              |
| Palette eXtended Kubernetes - Edge (PXK-E)   | 1.27.2, 1.28.2, 1.30.4, 1.31.6, 1.32.2, 1.33.1, 1.34.2, 1.35.2, or 1.36.2 |
| K3s                                          | 1.31.14, 1.32.13, 1.33.13, 1.34.9, 1.35.6, or 1.36.2                      |
| RKE2                                         | 1.31.14, 1.32.13, 1.33.13, 1.34.9, 1.35.6, or 1.36.2                      |
| Canonical Kubernetes (CK8s)                  | Any 1.32 version                                                          |
| Managed Kubernetes, such as EKS, AKS, or GKE | Select an OS image version that uses containerd 2.0 or later.             |

To change the Kubernetes version of a cluster, update the Kubernetes layer of its cluster profile. Refer to
[Update a Cluster](./cluster-updates.md) for more information.

### Palette Agent Version

The Palette agent on your clusters must be version 4.9.23 or later. The Palette agent upgrades automatically when your
Palette instance is upgraded, except in the following cases:

- You paused agent upgrades for the cluster, its project, or its tenant. Resume agent upgrades so that the agent can
  upgrade. Refer to [Pause Agent Upgrades](./platform-settings/pause-platform-upgrades.md) for more information.

- You specified a Palette agent version in the OS pack of the cluster profile. Specify version 4.9.23 or later, or
  remove the agent version from the OS pack. Refer to
  [Configure Palette Agent Version](../edge/cluster-management/agent-upgrade-airgap.md) for more information.
