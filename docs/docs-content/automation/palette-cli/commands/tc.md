---
sidebar_label: "TC"
title: "TC"
description: "Reference resource for the target cluster command."
hide_table_of_contents: false
sidebar_position: 60
tags: ["palette-cli"]
---

The Palette CLI's `tc` command interacts with Kubernetes clusters and deploys new target clusters. Refer to the
subcommands section for more information on the available subcommands.

## Subcommands

The `tc` command has the following subcommands:

<br />

- `install` - Install and deploy a target cluster.

### Prerequisites

- You must provide an encryption passphrase to secure sensitive data. The passphrase must be between 8 to 32 characters
  long and contain a capital letter, a lowercase letter, a digit, and a special character. You can provide the
  passphrase through the `PALETTE_ENCRYPTION_PASSWORD` environment variable or the `-k` or `--encryption-passphrase`
  flag. Refer to the [Encryption](./../palette-cli.md#encryption) section for more information on encryption.

- You need network connectivity to the cloud provider and the environment where the cluster is deployed. The deployed
  cluster must have network access to the Palette management plane. Deploy a
  [Private Cloud Gateway](../../../clusters/pcg/pcg.md) in your infrastructure environment if operating in a private
  network where inbound network access is restricted from external networks.

## Install

You can use the `tc` command to deploy a new workload cluster, also referred to as a _target cluster_. The target
cluster can be deployed on the cloud provider of your choice as long as it is supported by the Palette CLI. Refer to
[Limitations](#install-limitations) for more information on the supported cloud providers.

The `tc` command uses the same workflow Palette uses to deploy a Kubernetes cluster, the difference is that the
orchestration and Cluster API pivot occur locally in a kind cluster instead of in the Palette management plane.

:::further

You can learn more about the cluster deployment
[Order of Operations](../../../architecture/orchestration-spectrocloud.md) in the Architecture section. Palette uses
[Cluster API](https://cluster-api.sigs.k8s.io/) to orchestrate the deployment of Kubernetes clusters and manage their
lifecycle with the help of the Palette agent. If you are unfamiliar with the traditional cluster deployment workflow,
check out the tutorial [Deploy a Cluster](../../../tutorials/cluster-deployment/public-cloud/deploy-k8s-cluster.md) to
get a better understanding of the process.

:::

A local [kind](https://kind.sigs.k8s.io/) cluster is used to orchestrate the deployment of the target cluster. From the
local kind cluster, the Palette CLI interacts with the cloud provider to start the orchestration of the target cluster.
Once the control plane nodes are active and available, a pivot is made to the target cluster, and the remained of the
deployment orchestrations is done in the target cluster. Upon completion, the local kind cluster is deleted.

The following flags are available for the `install` subcommand:

| **Short Flag** | **Long Flag**             | **Description**                                                                                                                                                                                                                                                                                                                                                             | **Type** |
| -------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `-d`           | `--cloud-config-file`     | The path to the _CloudConfig_ file you want to use to install the cluster. The `--spc-file` flag must also be provided if this flag is used.                                                                                                                                                                                                                                | string   |
| `-f`           | `--config-file`           | Deploy a target cluster using a tc configuration file created in a previous invocation. A tc configuration file is automatically created when you issue the `tc install` and complete the install wizard. The default location for tc configuration files are **~/.palette/tc/**.                                                                                           | string   |
| `-o`           | `--config-only`           | Only generate the tc configuration file and do not deploy the target cluster. The configuration file is saved in the default location **~/.palette/tc/**.                                                                                                                                                                                                                   | boolean  |
| `-k`           | `--encryption-passphrase` | Encryption passphrase to secure sensitive data. The passphrase must be between 8 to 32 characters long and contain a capital letter, a lowercase letter, a digit, and a special character. Can be set through the environment variable `PALETTE_ENCRYPTION_PASSWORD`. Refer to the [Encryption](./../palette-cli.md#encryption) section for more information on encryption. | string   |
| `-h`           | `--help`                  | Help for the `install` subcommand.                                                                                                                                                                                                                                                                                                                                          | -        |
| `-s`           | `--spec-file`             | The path the _SpectroCluster_ file used to install the cluster. The `--cloud-config-file` flag must also be provided if this flag is used.                                                                                                                                                                                                                                  | string   |
| -              | `--ubuntu-pro-token`      | Specify the Ubuntu Pro token to use for the target cluster.                                                                                                                                                                                                                                                                                                                 | string   |
| `-p`           | `--update-passwords`      | Update the encrypted credentials stored in the tc configuration file. The `--config-file` flag must also be provided if this flag is used.                                                                                                                                                                                                                                  | boolean  |

### Limitations {#install-limitations}

The following cloud providers are supported by the Palette CLI's `tc` command:

- AWS IaaS
- VMWare vSphere
