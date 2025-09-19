---
sidebar_label: "Import"
title: "Import"
description: "Learn how to import pre-existing clusters using a Palette CLI command."
hide_table_of_contents: false
sidebar_position: 15
tags: ["palette-cli"]
---

The `import` command imports a cluster into Palette in full permission mode based on local kubeconfig files. Refer to
the [Imported Clusters](../../../clusters/imported-clusters/cluster-import.md) reference page to learn more about
imported clusters.

## Prerequisites

- Kubernetes version 1.19.X or later on the cluster you are importing.

- Ensure your environment has network access to Palette SaaS or your self-hosted Palette instance.

- The kubectl CLI installed on your local machine.

- Access to your cluster environment through kubectl.

- Ensure you have `admin` or `cluster-admin` permissions on the cluster you are importing.

<br />

| **Long Flag**      | **Description**                                                                   | **Type** |
| ------------------ | --------------------------------------------------------------------------------- | -------- |
| `--kubeconfig`     | Path to the kubeconfig for the cluster you would like to import (optional)        | string   |
| `--kubeconfig-dir` | Path to directory containing kubeconfig files for one or more clusters (optional) | string   |
| `--uuid`           | If true, a partial UUID is appended to each cluster name (optional)               | boolean  |

:::info

If neither flag is provided, the `KUBECONFIG` environment variable and `~/.kube/config` will be checked and used
respectively.

:::

## Examples

### One Cluster with UUID

Import a cluster based on current `KUBECONFIG` found within `~/.kube/config` and append a partial UUID.

```shell
palette import --uuid
```

### One Cluster with Specified Kubeconfig

Import cluster with specified `KUBECONFIG`.

```shell
palette import --kubeconfig my-cluster.kubeconfig
```

```shell hideClipboard
Imported cluster my-cluster-b4430654
```

### Multiple Clusters

Import clusters from a directory containing multiple `KUBECONFIG` files.

```shell hideClipboard
configs
├── my-cluster-1.kubeconfig
├── my-cluster-2.kubeconfig
└── my-cluster-3.kubeconfig
```

```shell
palette import --kubeconfig-dir configs --uuid
```

```shell hideClipboard
Imported cluster my-cluster-1-e7c1ea5e
Imported cluster my-cluster-2-98669d7c
Imported cluster my-cluster-3d7cc792f
```
