---
sidebar_label: "Install Private Cloud Gateway"
title: "Install Private Cloud Gateway"
description: "Learn how to install a Nutanix Private Cloud Gateway in Palette."
hide_table_of_contents: false
sidebar_position: 10
toc_min_heading_level: 2
toc_max_heading_level: 3
tags: ["data center", "nutanix"]
---

A Private Cloud Gateway (PCG) is required to connect your Nutanix environment with Palette. The PCG enables Palette to
create and monitor Nutanix clusters in the deployed cloud environment.

To deploy a PCG, you can use an existing Kubernetes and follow the
[Deploy a PCG to an Existing Kubernetes Cluster](../../../pcg/deploy-pcg-k8s.md) guide. However, ensure that the
Kubernetes cluster has network connectivity with Nutanix Prism Central.

If you don't have an existing Kubernetes cluster, check out the
[Deploy a Kubernetes Cluster to Host the PCG](deploy-kubernetes-cluster-pcg.md) page. This section provides one possible
option and explains how to deploy a Kubernetes cluster within the Nutanix environment.

## Next Steps

When the PCG is in the **Running** state, you can create the Nutanix cloud account. For guidance, review the
[Add Nutanix Cloud Account](/docs/docs-content/clusters/data-center/nutanix/add-nutanix-cloud-account.md) guide.
