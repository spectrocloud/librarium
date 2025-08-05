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

  ![Network flow from an architectural perspective of how MAAS works with Palette](/clusters_data-center_maas_arch-diagram-new.webp)

Refer to the [PCG Architecture](../../pcg/architecture.md) section to learn more about the PCG architecture.

## Palette MAAS Distribution
Palette provides the following distributions for MAAS environments.

| Name | OS | Kubernetes Distribution | CNIs | CSIs |
| ---- | -- | ----------------------- | ---- | ---- |
| Palette eXtended Kubernetes (PXK) | Ubuntu, BYOOS | CNCF | Multiple. Refer to the <VersionedLink text="pack information" url="/integrations/packs/?pack=kubernetes" /> for the details. |
| Canonical Kubernetes | Ubuntu | Canonical Kubernetes | Cilium.  Due to a [known issue](../../../release-notes/known-issues.md) in controller-mode deployments, Cilium is automatically installed by the Canonical Kubernetes bootstrap process and cannot be disabled. Since Palette requires a CNI to be specified in the cluster profile, select Custom CNI and set a placeholder value in `the manifests.byo-cni.contents.data.custom-cni` parameter. | Portworx |

:::preview

The **Canonical Kubernetes** distribution is a Tech Preview feature and is subject to change. Do not use this feature in production workloads.

:::

## Custom API Server Endpoint for MAAS Clusters

By default, Palette registers a DNS record in MAAS for the deployed cluster and links it to the IP addresses of the
control plane nodes of the cluster. However, you may choose not to depend on MAAS for your cluster DNS record. The
Kubernetes pack allows you to configure a custom API server endpoint for your cluster instead.

<!-- prettier-ignore-start -->

This feature is only supported in Palette eXtended Kubernetes (PXK). Refer to the <VersionedLink
  text="Custom API Server Endpoint for MAAS Clusters"
  url="/integrations/packs/?pack=kubernetes"
/>
section of the pack Additional Guidance for further information.

<!-- prettier-ignore-end -->
