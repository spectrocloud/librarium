---
sidebar_label: "Edge Host Management"
title: "Edge Host Management"
description: "Instructions for Edge Host Management Console."
hide_table_of_contents: false
sidebar_position: 32
tags: ["edge"]
---

Once Palette Edge has been installed on the Edge host and the Edge host has gone through initial configuration, you will
be able to access the Edge Management Console (EMC). EMC allows you to manage Edge hosts in your network locally, upload
content bundles containing images, Helm charts, and packs, and create Edge clusters locally in disconnected environments
without connections to a Palette instance.

:::preview

:::

![A diagram illustrating how users and use EdgeForge and Edge Management Console to deploy clusters without a Palette connection](/clusters_edge_emc_workflow.png)

EMC is designed for Edge deployment in disconnected environments. A disconnected environment means that the Edge host
does not have a connection to a Palette instance. Do not use EMC if your cluster has a connection to a Palette instance.

Refer to the follow resources to learn how to use EMC to manage your disconnected Edge deployment:

## Get Started

- Refer to [Access Edge Management Console](./access-console.md) for guidance on how to access EMC and update your
  credentials.

- If you already included a content bundle and a cluster definition in your installer ISO, you can create a cluster
  using the resources in the ISO directly. Refer to [Create Local Cluster](./create-cluster.md) for guidance. Refer to
  [EdgeForge Workflow](../edgeforge-workflow/edgeforge-workflow.md) for guidance on how to include content bundles and
  cluster definitions in your ISO.

- If you did not provide a content bundle or cluster definition, or if you want to provide new content from which to
  build clusters, refer to the following guides to upload content bundles and export cluster definitions.

  - [Upload Content Bundles](./upload-content-bundle.md)

  - [Export Cluster Definition](./export-cluster-definition.md)

## Configure Edge Host

EMC also allows you to configure HTTP proxy for your Edge host.

- [Configure HTTP Proxy in Edge Management Console](./configure-proxy.md)

- [Reset Edge Host to Factory Default]

## Branding

During the EdgeForge process, you can use CSS to adjust the look and feel of the EMC console.

- [Customize Edge Management Console Theme](./theming.md)
