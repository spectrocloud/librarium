---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used to support MAAS using Palette"
hide_table_of_contents: false
sidebar_position: 0
tags: ["data center", "maas", "architecture"]
---

Canonical MAAS is an open source tool that lets you discover, commission, deploy and re-deploy operating systems to
physical servers. The following are some architectural highlights of bare-metal Kubernetes clusters that Palette deploys
using Canonical MAAS. Refer to the PCG deployment options section below to learn more about PCG deployment.

- Palette integrates with MAAS through Spectro Cloud’s open source Cloud Native Computing Foundation (CNCF)
  [Cluster API provider](https://github.com/spectrocloud/cluster-api-provider-maas). Refer to the table below

- Palette provides a cloud-like experience for deploying clusters on bare metal servers. The result is increased
  performance at minimal cost and operational effort.

- A Private Cloud Gateway (PCG) that you install in a MAAS cloud using a local installer facilitates communication
  between Palette and MAAS. The PCG is necessary in MAAS environments where Palette does not have direct network access
  to the MAAS server. Since MAAS environments are typically in a private network without a central endpoint, the PCG
  provides this endpoint and also wraps the MAAS environment into a cloud account that you can target for cluster
  deployment in Palette. Refer to the section below to learn about the PCG deployment options you have.

- When the PCG is installed, it registers itself with a Palette instance and enables secure communication between the
  SaaS portal and the private cloud environment. The gateway enables installation and end-to-end lifecycle management of
  Kubernetes clusters in private cloud environments from Palette's SaaS portal.

  The diagram below illustrates how MAAS works with Palette using a PCG.

  ![Network flow from an architectural perspective of how MAAS works with Palette](/maas_cluster_architecture.webp)

Refer to the [PCG Architecture](../../pcg/architecture.md) section to learn more about the PCG architecture.

## Custom API server endpoint for MAAS clusters

By default, Palette will register a DNS record in MAAS for the deployed cluster, linking it to the IP address(es) of the
control plane node(s) of the cluster. However you may not want to depend on MAAS for your cluster DNS record. The
Kubernetes pack provides an option to configure a custom API server endpoint for your cluster instead.

This feature is only supported in Palette eXtended Kubernetes (PKX). For more information, refer to the
[Custom API server endpoint for MAAS clusters](../../../integrations/kubernetes.md#custom-api-server-endpoint-for-maas-clusters)
section of the PXK reference page.
