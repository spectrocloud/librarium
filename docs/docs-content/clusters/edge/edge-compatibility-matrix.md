---
sidebar_label: "Edge Compatibility Matrix"
title: "Edge Compatibility Matrix"
description: "Review Palette Edge component versions by Palette release."
hide_table_of_contents: false
sidebar_position: 11
tags: ["edge", "compatibility", "canvos", "palette-cli"]
---

Use the Edge Compatibility Matrix to identify the CanvOS, Stylus, Edge host, and CLI versions associated with a Palette
release.

Palette, CanvOS, Stylus, and CLI components use the same major and minor version for a release train, but patch versions
can differ. For example, a Palette `4.8.x` release can use a different `4.8.x` CanvOS or CLI patch version.

:::info

CanvOS, Stylus, and the Edge host version refer to the same Edge host software release for the purpose of this matrix.

:::

## Compatibility Matrix

| Palette Release | CanvOS / Stylus / Edge Host Version | Palette CLI Version | Palette Edge CLI Status                              |
| --------------- | ----------------------------------- | ------------------- | ---------------------------------------------------- |
| 4.9.14          | 4.9.10                              | 4.9.5               | Deprecated. Use Palette CLI for supported workflows. |
| 4.9.5           | 4.9.4                               | 4.9.2               | 4.9.4                                                |
| 4.8.47          | 4.8.18                              | 4.8.10              | 4.8.18                                               |
| 4.8.33          | 4.8.10                              | 4.8.7               | 4.8.10                                               |
| 4.8.21          | 4.8.8                               | 4.8.5               | 4.8.8                                                |
| 4.8.6           | 4.8.1                               | 4.8.2               | 4.8.1                                                |
| 4.7.27          | 4.7.16                              | 4.7.4               | 4.7.16                                               |
| 4.7.20          | 4.7.13                              | 4.7.2               | 4.7.13                                               |
| 4.7.13          | 4.7.9                               | 4.7.1               | 4.7.9                                                |
| 4.7.3           | 4.7.2                               | 4.7.0               | 4.7.2                                                |
| 4.6.40          | 4.6.24                              | 4.6.8               | 4.6.24                                               |
| 4.6.32          | 4.6.21                              | 4.6.6               | 4.6.21                                               |

## Palette Edge CLI Deprecation

The Palette Edge CLI is deprecated starting with Palette `4.9.14`. There will be no further Palette Edge CLI releases.
Use the Palette CLI for supported content bundle and cluster definition workflows.

For CLI download links and checksums, refer to [CLI Tools](../../downloads/cli-tools.md).

## Version Skew

It is expected for component patch versions to differ within the same major and minor release. If Palette shows
different patch versions for the management plane, Edge host, or agent, use this matrix to identify the component
version associated with the Palette release.

For upgrade behavior, refer to [Edge Cluster Upgrade Behavior](./cluster-management/upgrade-behavior.md).
