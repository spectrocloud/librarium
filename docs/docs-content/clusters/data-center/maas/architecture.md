---
sidebar_label: "Architecture"
title: "Architecture"
description: "Learn about the architecture used to support MAAS using Palette"
hide_table_of_contents: false
sidebar_position: 0
tags: ["data center", "maas", "architecture"]
---

Canonical MAAS is an open-source tool that lets you discover, commission, deploy and re-deploy operating systems to
physical servers. The following are some architectural highlights of bare-metal Kubernetes clusters that Palette deploys
using Canonical MAAS. Refer to the PCG deployment options section below to learn more about PCG deployment.

- Palette integrates with MAAS through Spectro Cloud’s open-source Cloud Native Computing Foundation (CNCF)
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

  ![Network flow from an architectural perspective of how MAAS works with Palette](/maas_cluster_architecture.png)

  <br />

## PCG Deployment Options

Palette can communicate with MAAS using the following deployment options.

<br />

- **Private Cloud Gateway**

- **System Private Gateway**

### Private Cloud Gateway

When a user wants to deploy a new cluster on a bare metal cloud using MAAS with Palette, Palette needs connectivity to
MAAS. Often, MAAS is behind a firewall or a Network Address Translation (NAT) gateway, and Palette needs help to reach
MAAS directly.

To address these network challenges, you can deploy a PCG. The PCG will maintain a connection to Palette and directly
connect to MAAS. The direct communication channel allows Palette to create clusters using the PCG to facilitate
communication with MAAS. The PCG also supports using a proxy server to access the internet if needed.

Once Palette deploys clusters, the clusters require connectivity to Palette. The clusters communicate with Palette
directly via an internet gateway, or if a proxy has been configured on the PCG, the clusters will inherit the proxy
configuration. Deployed and active clusters maintain their connectivity with Palette. Any actions taken on these
clusters using Palette will not require PCG's participation. This means that if the PCG becomes unavailable, any
clusters that are currently deployed will remain operational and still be managed by Palette.

All Palette deployed clusters will use the PCG cluster during the creation and deletion phase. Once a host cluster is
available, the internal Palette agent will communicate with Palette directly. The Palette agent inside each cluster is
the originator of all communication, so the network requests are outbound toward Palette. The exception is a host
cluster creation or deletion request, where the PCG must be involved because it needs to acquire and release machines
provided by MAAS.

Typically, the PCG is used with Palette SaaS. However, a PCG is also required if you have a self-hosted Palette instance
and it does not have direct access to the MAAS environment. You can utilize the System Private Gateway if there is
direct network connectivity access with the MAAS environment. Refer to the
[System Private Gateway](#system-private-gateway) section to learn more.

<br />

### System Private Gateway

A System Private Gateway can be used if a self-hosted Palette instance can communicate directly with a MAAS
installation. A System Private Gateway is a PCG service that is enabled inside the self-hosted Palette instance.

<br />

:::warning

Only self-hosted Palette instances support the option of using the System Private Gateway. Use the default
[PCG deployment](#private-cloud-gateway) option if you have NAT gateways or network firewalls between Palette and MAAS.

:::

<br />

When registering a MAAS cloud account with Palette, toggle on **Use System Private Gateway** to enable direct
communication between Palette and MAAS. Refer to the
[Register and Manage MAAS Cloud Account](register-manage-maas-cloud-accounts.md) guide to learn more.

The following table explains the different use cases for when a PCG and System Private Gateway are eligible.

<br />

| Scenario                                                        | Use Private Cloud Gateway | Use System Private Gateway |
| --------------------------------------------------------------- | ------------------------- | -------------------------- |
| Firewall or NAT between MAAS and a self-hosted Palette instance | ✅                        | ❌                         |
| Direct connectivity between MAAS and a Palette instance         | ✅                        | ✅                         |
