---
sidebar_label: "CloudStack"
title: "Apache CloudStack"
description: "Learn how to configure Apache CloudStack and create CloudStack clusters in Palette"
hide_table_of_contents: false
tags: ["data center", "cloudstack"]
---

Palette supports using [Apache CloudStack](https://cloudstack.apache.org/) as a data center provider. You can deploy
Kubernetes clusters to your CloudStack environment using Palette.

For this to work, Palette uses a [Private Cloud Gateway (PCG)](../../pcg/pcg.md), which creates a secure connection from
the internal network to the Palette instance, ultimately bypassing the need to create firewall rules or other network
configurations allowing external connections to the internal network.

## Get Started

TBC

## Supported Versions

The following versions of Apache CloudStack are supported in Palette.

| **Version** | **Supported**             |
| ----------- | ------------------------- |
| TBC         | :white_check_mark: or :x: |

## Next Steps

- [Architecture](architecture.md)

- [Deploy a PCG in Apache CloudStack](../../pcg/deploy-pcg/cloudstack.md)

- [Required Permissions](required-permissions.md)

- [Create and Manage CloudStack Clusters](create-manage-cloudstack-clusters.md)
