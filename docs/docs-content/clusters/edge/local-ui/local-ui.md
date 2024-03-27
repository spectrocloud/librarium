---
sidebar_label: "Local UI"
title: "Local UI"
description: "Instructions for Edge Host Management Console."
hide_table_of_contents: false
sidebar_position: 32
tags: ["edge"]
---

Once Palette Edge has been installed on the Edge host and the Edge host has gone through initial configuration, you will
be able to access the local UI. Local UI allows you to manage Edge hosts in your network locally, upload content bundles
containing images, Helm charts, and packs, and create Edge clusters locally in disconnected environments without
connections to a Palette instance.

:::preview

:::

![A diagram illustrating how users and use EdgeForge and the local UI to deploy clusters without a Palette connection](/clusters_edge_emc_workflow.webp)

:::warning

Local UI on works for Edge deployment in disconnected environments. A disconnected environment means that the Edge host
does not have a connection to a Palette instance. Do not use the local UI if your cluster has a connection to a Palette
instance.

:::

Refer to the follow resources to learn how to use the local UI to manage your disconnected Edge deployment:

## Get Started

- Refer to [Access Local UI](./host-management/access-console.md) for guidance on how to access the local UI and update
  your credentials.

- If you already included a content bundle and a cluster definition in your installer ISO, you can create a cluster
  using the resources in the ISO directly. Refer to [Create Local Cluster](./cluster-management/create-cluster.md) for
  guidance. Refer to [EdgeForge Workflow](../edgeforge-workflow/edgeforge-workflow.md) for guidance on how to include
  content bundles and cluster definitions in your ISO.

- If you did not provide a content bundle or cluster definition, or if you want to provide new content from which to
  build clusters, refer to the following guides to upload content bundles and export cluster definitions.

  - [Upload Content Bundles](./cluster-management/upload-content-bundle.md)

  - [Export Cluster Definition](./cluster-management/export-cluster-definition.md)

## Cluster Management

- [Upload Content Bundles](./cluster-management/upload-content-bundle.md)

- [Export Cluster Definition](./cluster-management/export-cluster-definition.md)

- [Create Local Cluster](./cluster-management/create-cluster.md)

## Host Management

- [Access Local UI](./host-management/access-console.md)

- [Configure HTTP Proxy in Local UI](./host-management/configure-proxy.md)

- [Reset Edge Host to Factory Default](./host-management/reset-reboot.md)

- [Customize Local UI Theme](./host-management/theming.md)
