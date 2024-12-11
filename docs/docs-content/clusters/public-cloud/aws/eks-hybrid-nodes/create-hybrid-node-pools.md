---
sidebar_label: "Create Hybrid Node Pools"
title: "Create Hybrid Node Pools"
description: "Learn how to create hybrid node pools and add your edge hosts to them."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 30
---

This section guides you on how to create a cluster profile to collectively manage your hybrid nodes. You can then create
hybrid node pools and add your edge hosts to them.

## Limitations

- Overall cluster health is determined by the Amazon EKS cluster's status. While unhealthy edge hosts will appear as
  unhealthy nodes in Palette, this does not change the Amazon EKS cluster's overall health status.

## Create Cluster Profile for Hybrid Nodes

### Prerequisites

- Edge hosts have been registered with Palette through
  [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md) or by using
  [Provider Images](../../../edge/edgeforge-workflow/palette-canvos/build-provider-images.md).

  :::warning

  If using Provider Images, you must include the following in your `.arg` file during the
  [build steps](../../../edge/edgeforge-workflow/palette-canvos/build-provider-images.md#build-provider-images).

  ```shell
  K8S_DISTRIBUTION=nodeadm
  K8S_VERSION=1.29.0  # supported versions: [ 1.29.0 | 1.30.0 ]
  ```

  :::

- Your Palette account role must have the `clusterProfile.create` permission to create a cluster profile. Refer to the
  [Cluster Profile](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  permissions for guidance.

### Create Profile

OS:

- Agent Mode = `byoi-agent-mode 1.0.0`
- Provider Images = `Kairos Edge OS Pack`

Kubernetes = `edge-nodeadm 1.29.x` or `edge-nodeadm 1.30.x`

Network = `cni-custom 0.1.0` (dummy)

### Validate

## Create Hybrid Node Pool

### Prerequisites

- TBA

### Create Node Pool

### Validate
