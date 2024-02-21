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
content bundles containing images, helm charts, and packs, and create Edge clusters locally in disconnected environments
without connections to a central Palette instance.

:::preview

:::

![A diagram illustrating how users and use EdgeForge and Edge Management Console to deploy Edge hosts without a Palette connection](/clusters_edge_emc_workflow.png)

EMC is designed for Edge deployment in disconnected environments. A disconnected environment means that the Edge host
does not have a connection to a central Palette instance. EMC's functionalities are not available if your cluster has a
connection to a central Palette instance.

Refer to the follow resources to learn how to use EMC to manage your disconnected Edge deployment:

- [Access Edge Management Console](./access-console.md)

- [Upload Content Bundles](./upload-content-bundle.md)

- [Export Cluster Definition](./export-cluster-definition.md)

- [Create Local Cluster](./create-cluster.md)

- [Customize Edge Management Console Theme](./theming.md)
