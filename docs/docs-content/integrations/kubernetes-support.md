---
sidebar_label: "Kubernetes Support Lifecycle"
title: "Kubernetes Support Lifecycle"
description: "Learn about the Kubernetes versions we support and how we manage Kubernetes support."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["packs", "support", "kubernetes", "lifecycle"]
---

## Overview

We follow a similar lifecycle as established by the Kubernetes community. You can learn more about the official
supported Cloud Native Computing Foundation (CNCF) Kubernetes release cycle in the
[Kubernetes Releases](https://kubernetes.io/releases/) page. This means we support three minor Kubernetes versions at
any given time. We support the current release and the three previous minor version releases, also known as N-3. For
example, if the current release is 1.29, we support 1.28, 1.27, and 1.26.

The table below lists the Kubernetes distributions we support and the duration of support.

| Kubernetes Distribution                    | Supported Minor Versions | Support Duration | Notes                                                                                                                                                       |
| ------------------------------------------ | ------------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CNCF Kubernetes                            | N-3                      | 14 months        | The official open source version of [Kubernetes](https://kubernetes.io/).                                                                                   |
| Palette eXtended Kubernetes (PXK)          | N-3                      | 14 months        | Additional support may be extended. Discuss this with our support team if you need additional support.                                                      |
| Palette eXtended Kubernetes - Edge (PXK-E) | N-3                      | 14 months        | Additional support may be extended. Discuss this with our support team if you need additional support.                                                      |
| Other                                      | N-3                      | EOL              | Other distributions available in Palette such as K3s, Microk8s, and RKE2, we only support until their official EOL. The EOL is set by the respective owner. |

:::info

Kubernetes follows the [semantic version schema](https://semver.org/). Versions are annotated as x.y.z, where x is the
major version, y is the minor version, and z is the patch version.

:::

We support N-3 Kubernetes minor versions until the official End-Of-Life (EOL). Once we stop supporting the minor
version, we initiate the deprecation process. You can learn more about our deprecation process in the
[Pack Deprecation](./maintenance-policy.md#pack-deprecations) section.

## Palette eXtended Kubernetes Support

<!-- prettier-ignore-start -->
We support CNCF Kubernetes, <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" />  and <VersionedLink text="Palette eXtended Kubernetes Edge (PXK-E)" url="/integrations/packs/?pack=edge-k8s"/> for N-3 Kubernetes minor versions for a duration of 14
months. The duration exceeds the official EOL by four months. Once we stop supporting the minor version, we initiate the
deprecation process.
<!-- prettier-ignore-end -->

The diagram below illustrates the support lifecycle of a Kubernetes version. A deprecated Kubernetes version will no
longer receive updates.

![Diagram of the Kubernetes Support Lifecycle. PXK and CNCF is supported for 14 months. After that, normal deprecation flow is initiated.](/integrations_kubernetes-support_support-cycle.webp)

Additional support may be extended for PXK and PXK-E. Discuss this with our support team if you need extended support.
You can contact our support team at [support@spectrocloud.com](mailto:support@spectrocloud.com).

## Other Kubernetes Distributions

We support other Kubernetes distributions such as K3s, Microk8s, and RKE2 until their official EOL. The EOL is set by
the respective owner. Once we stop supporting the minor version, we initiate the deprecation process. You can learn more
about our deprecation process in the [Pack Deprecation](./maintenance-policy.md#pack-deprecations) section.

![Diagram of other Kubernetes Support Lifecycle. Other distributions are supported until their EOL. After that, normal deprecation flow is initiated.](/integrations_kubernetes-support_support-cycle_other.webp)

## Kubernetes Upgrades

Kubernetes supports sequential minor version upgrades only, one minor version at a time. For example, if you are using
Kubernetes version 1.30, you upgrade to 1.31 before upgrading to 1.32. Skipping a minor version leaves control-plane
components in an inconsistent, often unrecoverable state. You can learn more about the official Kubernetes upgrade
guidelines on the [Version Skew Policy](https://kubernetes.io/releases/version-skew-policy/) page.

To protect your clusters, Palette enforces this sequential upgrade path. The restrictions described in this section
apply uniformly to all Kubernetes distributions, including CNCF Kubernetes, PXK, PXK-E, K3s, RKE2, MicroK8s, and
cloud-managed distributions such as Amazon EKS, Azure AKS, and Google GKE, with no per-distribution exceptions. The
restrictions apply to both management-plane clusters, which you manage through the Palette UI, API, or Terraform, and
Edge clusters, which you manage through the Edge Local UI in both connected and air-gapped modes.

### Palette Blocks Multi-Minor Upgrades

Palette blocks any Kubernetes upgrade that skips one or more minor versions. For example, an upgrade from 1.30 to 1.32
is not allowed. To reach 1.32 from 1.30, upgrade one minor version at a time, first to 1.31 and then to 1.32. Changes
within the same minor version, such as a patch upgrade from 1.30.4 to 1.30.8, remain allowed.

When you attempt a multi-minor upgrade, Palette disables the update action in the review editor and displays the
following message.

> Kubernetes upgrades across multiple minor versions are not supported. Please update your cluster profile to
> sequentially upgrade the Kubernetes pack across each minor version.

Palette enforces this restriction on the server, so it applies across every upgrade path, including the Palette UI, the
API, Terraform and Crossplane (where the block surfaces as a plan or apply diagnostic), and scheduled or
cluster-template updates. Palette refuses a scheduled or template-driven update that skips a minor version and does not
advance the cluster.

### Palette Blocks Downgrades After an Upgrade

After a cluster successfully upgrades to a new Kubernetes minor version, Palette blocks any attempt to downgrade it to a
minor version lower than the one it is currently running. When you attempt such a downgrade, Palette displays the
following message.

> Kubernetes downgrades are not supported after a successful upgrade. Please update your cluster profile to a Kubernetes
> version equal to or newer than the currently running version.

This block applies only to reverting a Kubernetes version that the cluster has already successfully reached. Deploying a
lower Kubernetes minor version to a cluster that has not already upgraded to a higher one is not affected.

:::info

A Kubernetes downgrade that occurs as part of a cluster profile rollback, such as restoring an earlier cluster profile
version or revision, is exempt from this block. The block applies to a user-initiated downgrade, not to a profile
rollback or revision restore.

:::

### Imported Clusters

The multi-minor upgrade block and the downgrade block do not apply to imported (brownfield) clusters. Palette does not
manage the Kubernetes lifecycle of imported clusters, so it does not enforce these restrictions on them.

:::tip

Use cluster profile versions to manage your Kubernetes upgrades. Create a new cluster profile version for each
Kubernetes upgrade. You can then use the new cluster profile version to upgrade your cluster.

:::

To learn more about upgrading your cluster and cluster profiles, check out the resources below:

- [Update a Cluster](../clusters/cluster-management/cluster-updates.md)
- [Version a Cluster Profile](../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md)

We also recommend you check out [Deploy Cluster Profile Updates](../tutorials/profiles/update-k8s-cluster.md) tutorial
to learn how to update your cluster profile.
