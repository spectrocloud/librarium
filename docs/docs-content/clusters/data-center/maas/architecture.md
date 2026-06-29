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
  [Cluster API provider](https://github.com/spectrocloud/cluster-api-provider-maas). Refer to the table below.

- Palette provides a cloud-like experience for deploying clusters on MAAS-managed bare-metal servers or on LXD virtual
  machines created by MAAS. Bare metal typically provides near-native performance, while LXD VMs improve consolidation
  and resource utilization with minimal additional overhead.

  ![Network flow from an architectural perspective of how MAAS LXD works with Palette](/clusters_data-center_maas_arch-diagram-maas-lxd_mk.webp)

- A Private Cloud Gateway (PCG) that you install in a MAAS cloud using a local installer facilitates communication
  between Palette and MAAS. The PCG is necessary in MAAS environments where Palette does not have direct network access
  to the MAAS server. Since MAAS environments are typically in a private network without a central endpoint, the PCG
  provides this endpoint and also wraps the MAAS environment into a cloud account that you can target for cluster
  deployment in Palette. Refer to the section below to learn about the PCG deployment options you have.

- Support for static IP addresses is available through [IP Pools](../../pcg/manage-pcg/create-manage-node-pool.md)
  provisioned in the PCG.

- Dynamic Host Configuration Protocol (DHCP) is also supported. If you are using DHCP, dynamic DNS is required.

- When the PCG is installed, it registers itself with a Palette instance and enables secure communication between the
  SaaS portal and the private cloud environment. The gateway enables installation and end-to-end lifecycle management of
  Kubernetes clusters in private cloud environments from Palette's SaaS portal.

  The following diagram illustrates how MAAS works with Palette using a PCG.

  ![Network flow from an architectural perspective of how MAAS works with Palette](/clusters_data-center_maas_arch-diagram-new-4-7-b.webp)

  Refer to the [PCG Architecture](../../pcg/architecture.md) section to learn more about the PCG architecture.

- You can deploy OpenShift workload clusters on MAAS by using a HyperShift host cluster. The HyperShift host cluster is
  used to host control planes as pods for the OpenShift workload clusters. The following diagram illustrates how
  HyperShift and OpenShift work with Palette and MAAS.

  ![Illustration of HyperShift and OpenShift architecture with Palette and MAAS](/data-center-clusters_maas_architecture_hypershift-openshift-4-9.webp)

  Refer to the
  [Create and Manage MAAS OpenShift Clusters with HyperShift](./create-manage-maas-openshift-clusters-hypershift/create-manage-maas-openshift-clusters-hypershift.md)
  guide for more information.

## Limitations

<!-- prettier-ignore-start -->

The Canonical Kubernetes pack for deployments in MAAS environments does not support the following:

- OpenID Connect (OIDC)
- Network Time Protocol (NTP)
- SSH key management
- HashiCorp Cloud Platform (HCP) / Linux Container Daemon (LXD)
- The <VersionedLink
  text="Cilium" url="/integrations/packs/?pack=cni-cilium-oss" /> pack is available as a Container Network Interface
  (CNI) for Canonical Kubernetes 1.35 and later. For configuration steps, refer
  to <VersionedLink
  text="Configure Cilium for Canonical Kubernetes Clusters on MAAS" url="/integrations/packs/?pack=cni-cilium-oss&tab=custom" />.

<!-- prettier-ignore-end -->

## Palette MAAS Distribution

Palette provides the following distributions for MAAS environments.

| Name                              | Kubernetes Distribution      | OS                              | CNIs                                                                                                                         | CSIs                                                                                                                         |
| --------------------------------- | ---------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Palette eXtended Kubernetes (PXK) | CNCF                         | Ubuntu, BYOOS                   | Multiple. Refer to the <VersionedLink text="pack information" url="/integrations/packs/?pack=kubernetes" /> for the details. | Multiple. Refer to the <VersionedLink text="pack information" url="/integrations/packs/?pack=kubernetes" /> for the details. |
| Canonical Kubernetes              | Canonical Kubernetes         | Ubuntu for Canonical Kubernetes | Cilium CNI (Canonical Kubernetes)                                                                                            | Portworx                                                                                                                     |
| OpenShift                         | OpenShift Container Platform | BYOOS                           | OVN-Kubernetes CNI (passthrough)                                                                                             | Local Path Provisioner                                                                                                       |

:::preview

The **OpenShift** pack for deployment in MAAS environments is a Tech Preview feature and is subject to change. Do not
use this feature in production workloads.

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
