---
sidebar_label: "Create and Manage CloudStack Clusters"
title: "Create and Manage CloudStack Clusters"
description: "Learn how to create and managed CloudStack clusters in Palette."
hide_table_of_contents: false
sidebar_position: 20
tags: ["data center", "cloudstack"]
---

You can deploy Kubernetes clusters on Apache CloudStack using Palette. Use the following steps to create and manage
CloudStack clusters in Palette.

## Limitations

TBC

## Prerequisites

Before you begin, ensure that you have the following prerequisites:

- A CloudStack account registered in Palette. Refer to the
  [Add CloudStack Accounts to Palette](./add-cloudstack-accounts.md) guide to learn how to add CloudStack accounts.

- A cluster profile for the Cloudstack environment. You can learn how to create a cluster profile by following the steps
  in the
  [Create a Cluster Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)
  guide.

- Depending on the network type you select for the cluster, you may need to create an IP Address Management (IPAM) pool
  or define a search domain. Use the following guidelines to create an IPAM pool or define a search domain.

  - An IP Address Management (IPAM) pool is required to assign static IP addresses to the nodes in the cluster. You can
    learn how to create an IPAM pool by following the steps in the
    [Create and Manage IPAM Node Pools](../../pcg/manage-pcg/create-manage-node-pool.md) guide.

  - A search domain, also called DNS mapping, can be used to assign cluster nodes to a specific network, cluster, and
    data center. Check out the [Add DNS Mapping](../../pcg/manage-pcg/add-dns-mapping.md) guide to learn how to add
    multiple DNS mappings to a PCG.

## Create a CloudStack Cluster

TBC

## Validate

TBC

## Next Steps

Now that you have a Kubernetes cluster deployed, you can start developing and deploying applications to your clusters.
We recommend you review the Day-2 responsibilities and become familiar with the cluster management tasks. Check out the
[Manage Clusters](../../cluster-management/cluster-management.md) documentation to learn more about Day-2
responsibilities.
