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

We follow a similar lifecycle as established by the Kubernetes community. You can learn more about the official supported Cloud Native Computing Foundation (CNCF) Kubernetes release cycle in the [Kubernetes Releases](https://kubernetes.io/releases/) page. This means we support three minor Kubernetes versions at any given time. We support the current release and the three previous minor version releases, also known as N-3. For example, if the current release is 1.29, we support 1.28, 1.27, and 1.26.

The table below lists the Kubernetes distributions we support and the duration of support.

| Kubernetes Distribution | Supported Minor Versions | Support Duration | Notes |
| ----------------------- | ------------------ | ---------------- | ----- |
| CNCF Kubernetes     | N-3                | 14 months        |  The official open-source version of [Kubernetes](https://kubernetes.io/).    |
| Palette eXtended Kubernetes (PXK) | N-3                | 14 months   | Additional support may be extended. Discuss this with our support team if you need additional support. |
| Palette eXtended Kubernetes - Edge (PXK-E) | N-3                | 14 months        | Additional support may be extended. Discuss this with our support team if you need additional support. |
| Other       | N-3                | EOL       | Other distributions available in Palette such as K3s, Microk8s, and RKE2, we only support until their official EOL. The EOL is set by the respective owner. |


:::info

Kubernetes follows the [semantic version schema](https://semver.org/). Versions are annotated as x.y.z, where x is the major version, y is the minor version, and z is the patch version.
:::

We support N-3 Kubernetes minor versions until the official End-Of-Life (EOL). Once we stop supporting the minor version, we initiate the deprecation process. You can learn more about our deprecation process in the [Pack Deprecation](./maintenance-policy.md#packs-deprecation) section. 


## Palette eXtended Kubernetes Support

We support CNCF Kubernetes, [Palette eXtended Kubernetes (PXK)](./kubernetes.md) and [Palette eXtended Kubernetes Edge (PXK-E)](./kubernetes-edge.md) for N-3 Kubernetes minor versions for a duration of 14 months. The duration exceeds the official EOL by four months. Once we stop supporting the minor version, we initiate the deprecation process. 

The diagram below illustrates the support lifecycle of a Kubernetes version. A deprecated Kubernetes version will no longer receive updates.

![Diagram of the Kubernetes Support Lifecycle. PXK and CNCF is supported for 14 months. After that, normal deprecation flow is initiated.](/integrations_kubernetes-support_support-cycle.png)
 
Additional support may be extended for PXK and PXK-E. Discuss this with our support team if you need extended support. You can contact our support team at [support@spectrocloud.com](mailto:support@spectrocloud.com).

## Other Kubernetes Distributions

We support other Kubernetes distributions such as K3s, Microk8s, and RKE2 until their official EOL. The EOL is set by the respective owner. Once we stop supporting the minor version, we initiate the deprecation process. You can learn more about our deprecation process in the [Pack Deprecation](./maintenance-policy.md#packs-deprecation) section.


![Diagram of other Kubernetes Support Lifecycle. Other distros are supported until their EOL. After that, normal deprecation flow is initiated.](/integrations_kubernetes-support_support-cycle_other.png)


## Kubernetes Upgrades 

The official guidelines for Kubernetes upgrades recommend upgrading one minor version at a time. For example, if you are using Kubernetes version 1.26, you should upgrade to 1.27, before upgrading to version 1.28. You can learn more about the official Kubernetes upgrade guidelines in the [Version Skew Policy](https://kubernetes.io/releases/version-skew-policy/) page. We 
recommend following the official guidelines for all Kubernetes upgrades, including PXK and PXK-E.

:::tip

Use cluster profile versions to manage your Kubernetes upgrades. Create a new cluster profile version for each Kubernetes upgrade. You can then use the new cluster profile version to upgrade your cluster.

:::

To learn more about upgrading your cluster and cluster profiles, check out the resources below:

- [Update a Cluster](../clusters/cluster-management/cluster-updates.md)
- [Version a Cluster Profile](../profiles/cluster-profiles/modify-cluster-profiles/version-cluster-profile.md)
