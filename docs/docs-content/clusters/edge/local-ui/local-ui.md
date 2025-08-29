---
sidebar_label: "Local UI"
title: "Local UI"
description: "Instructions for Edge Host Management Console."
hide_table_of_contents: false
sidebar_position: 32
tags: ["edge"]
---

Once Palette Edge has been installed on the Edge host and the Edge host has gone through initial configuration, you will
be able to access Local UI.

- In locally managed Edge hosts, Local UI allows you to manage Edge hosts in your network locally, upload content
  bundles containing images, Helm charts, and packs, and create Edge clusters locally in disconnected environments
  without connections to a Palette instance.
- In centrally managed Edge hosts, you cannot use the cluster-related functionalities because the cluster is managed by
  Palette, but you can still utilize Local UI to configure and manage the Edge host itself.

![A diagram illustrating how users and use EdgeForge and Local UI to deploy clusters without a Palette connection](/clusters_edge_emc_workflow.webp)

## Get Started

- Refer to [Access Local UI](./host-management/access-console.md) for guidance on how to access Local UI and update your
  credentials.

  :::info

  Local UI supports displaying all date and time values in Coordinated Universal Time (UTC), the browser’s local time
  zone, or both simultaneously. To configure the preferred date and time format, navigate to the **User Menu** in the
  upper-right corner and select **Time/Date Settings**.

  :::

- If you already included a content bundle and a cluster definition in your installer ISO, you can create a cluster in
  your locally managed Edge host using the resources in the ISO directly. Refer to
  [Create Local Cluster](./cluster-management/create-cluster.md) for guidance. Refer to
  [EdgeForge Workflow](../edgeforge-workflow/edgeforge-workflow.md) for guidance on how to include content bundles and
  cluster definitions in your ISO.

- If you did not provide a content bundle or cluster definition, or if you want to provide new content from which to
  build clusters, refer to the following guides to upload content bundles and export cluster definitions.

  - [Upload Content Bundles](./cluster-management/upload-content-bundle.md)

  - [Export Cluster Definition](./cluster-management/export-cluster-definition.md)

## Cluster Management

Cluster management features are only available to locally managed Edge hosts.

- [Link Hosts](./cluster-management/link-hosts.md)

- [Upload Content Bundles](./cluster-management/upload-content-bundle.md)

- [Export Cluster Definition](./cluster-management/export-cluster-definition.md)

- [Create Local Cluster](./cluster-management/create-cluster.md)

- [Scale a Cluster](./cluster-management/scale-cluster.md)

## Host Management

Most host management features, with the exception of reset, are available on both locally and centrally managed Edge
hosts.

- [Access Local UI](./host-management/access-console.md)

- [Edit User Data](./host-management/edit-user-data.md)

- [Configure HTTP Proxy in Local UI](./host-management/configure-proxy.md)

- [Reset Edge Host](./host-management/reset-reboot.md)

- [Customize Local UI Theme](./host-management/theming.md)

- [Add Custom Link to Sidebar](./host-management/custom-link.md)

- [Troubleshooting with Diagnostic Tools](./host-management/diagnostic-tools.md)

- [Configure Audit Logs](./host-management/audit-logs.md)

- [Download Files](./host-management/download-files.md)
