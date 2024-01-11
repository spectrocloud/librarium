---
sidebar_label: "Kubernetes Support Lifecycle"
title: "Kubernetes Support Lifecycle"
description: "Learn about the Kubernetes versions we support and how we manage Kubernetes support."
icon: ""
hide_table_of_contents: false
sidebar_position: 10
tags: ["packs", "support", "kubernetes", "lifecycle"]
---

We follow a similar lifecycle as established by the Kubernetes community. You can learn more about the supported Kubernetes release in the [Kubernetes Releases](https://kubernetes.io/releases/) page. This means we support three minor Kubernetes versions at any given time. We support the current release and the three previous minir version releases, also known as N-3. For example, if the current release is 1.29, we support 1.28, 1.27, and 1.26.



:::info

Kubernetes follows the [semantic version schema](https://semver.org/). Versions are annotated as x.y.z, where x is the major version, y is the minor version, and z is the patch version.
:::

We support N-3 Kubernetes minor versions for 14 months. The duration exceeds the offical End-Of-Life (EOL) by four months. Once we stop supporting the minor version, we initiate the deprecation process. You can learn more about our deprecation process in the [Pack Deprecation](./maintenance-policy.md#pack-deprecations) section. 

The diagram below illustrates the support lifecycle of a Kubernetes version. A deprecated Kubernetes version will no longer receive updates.

![Kubernetes Support Lifecycle](/integrations_kubernetes-support_support-cycle.png)