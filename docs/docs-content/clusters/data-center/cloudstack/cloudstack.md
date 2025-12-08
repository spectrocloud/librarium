---
sidebar_label: "CloudStack"
title: "Apache CloudStack"
description: "Learn how to configure Apache CloudStack and create CloudStack clusters in Palette"
hide_table_of_contents: false
tags: ["data center", "cloudstack"]
---

Palette supports using [Apache CloudStack](https://cloudstack.apache.org/) as a data center provider. You can deploy
Kubernetes clusters to your CloudStack environment using Palette.

To make this work, Palette will need a [Private Cloud Gateway (PCG)](../../pcg/pcg.md), which creates a secure
connection from the internal network to the Palette instance, ultimately bypassing the need to create firewall rules or
other network configurations allowing external connections to the internal network.

## Get Started

To get started with CloudStack as your target platform for deploying Kubernetes clusters, you need to deploy a PCG in
your CloudStack environment. The PCG acts as a bridge between your CloudStack environment and Palette, enabling secure
communication between the two. Start by reviewing the [Deploy a PCG in CloudStack](../../pcg/deploy-pcg/cloudstack.md)
guide.

:::info

If you are using a self-hosted Palette or VerteX instance, you can skip the PCG deployment and use the System PCG that
is already available in the instance. Review the [System PCG](../../pcg/architecture.md#system-private-gateway) section
of the PCG architecture page for more information.

:::

After you have deployed the PCG, you can proceed to create and manage CloudStack clusters in Palette. Refer to the
[Create and Manage CloudStack Clusters](create-manage-cloudstack-clusters.md) guide for detailed instructions.

## Supported Versions

The following versions of Apache CloudStack are supported in Palette.

| **Version** | **Supported**      |
| ----------- | ------------------ |
| 4.19.3.0        | :white_check_mark: |

The following versions of Apache Cloud API are supported in Palette.

| **Version** | **Supported**      |
| ----------- | ------------------ |
| 0.6.1       | :white_check_mark: |

## Next Steps

- [Review architecture for CloudStack](architecture.md)

- [Review required permissions for CloudStack](required-permissions.md)

- [Deploy a PCG in CloudStack](../../pcg/deploy-pcg/cloudstack.md) or use a
  [System Private Gateway](../../pcg/architecture.md#system-private-gateway) if you have a self-hosted Palette or VerteX
  instance with network connectivity to the CloudStack environment.

- [Add CloudStack accounts to Palette](./add-cloudstack-accounts.md)

- [Create and manage CloudStack clusters](create-manage-cloudstack-clusters.md)
