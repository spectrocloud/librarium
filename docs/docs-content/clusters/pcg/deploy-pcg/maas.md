---
sidebar_label: "Deploy to MAAS"
title: "Deploy to MAAS"
description: "Steps to deploy a PCG cluster to MAAS"
hide_table_of_contents: false
sidebar_position: 20
tags: ["pcg"]
---

This guide provides you with the steps to deploy a PCG cluster to a MAAS environment. Before you begin the installation,
carefully review the [Prerequisites](#prerequisites) section.

## Prerequisites

- A Palette API key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  page for guidance.

  :::warning

  The installation does not work with Single Sign-On (SSO) credentials. You must use an API key from a local tenant
  admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no
  longer used to keep the PCG connected to Palette, so you can deactivate the account if desired.

  :::

- Download and install the Palette CLI from the [Downloads](../../../spectro-downloads.md#palette-cli) page. Refer to
  the [Palette CLI Install](../../../automation/palette-cli/install-palette-cli.md) guide to learn more.

The following system requirements must be met to install a PCG in MAAS:

- PCG IP address requirements:

  - For a single-node gateway, one IP address must be available in the MAAS subnet for the PCG, or three available IP
    addresses for a three-node gateway. Refer to the [PCG Sizing](./deploy-pcg.md#pcg-sizing) section for more
    information on sizing.
  - One IP address must be available in the MAAS subnet for the Kubernetes API-server endpoint when deploying a
    three-node gateway.
  - One IP address reserved for cluster repave operations.
  - One IP address for the Virtual IP (VIP).
  - DNS can resolve the domain `api.spectrocloud.com`.

- An x86 Linux environment with a Docker daemon installed and a connection to Palette and the MAAS endpoint. The Palette
  CLI installation must be invoked on an up-to-date Linux system with the x86-64 architecture.

- Sufficient IP range available within the configured MAAS subnets.

  :::warning

  By default, the MAAS Kubernetes pack uses a pod Classless Inter-Domain Routing (CIDR) range of 192.168.0.0/16. Ensure
  that the pod CIDR range for any clusters you deploy after setting up the PCG does not overlap with the network used by
  the bare metal machines that MAAS manages.

  :::

- Each node in the PCG cluster requires a machine from MAAS in a ready state with the following resources:

  - CPU: 4
  - Memory: 8192 MiB
  - Storage: 60 GiB

  For production environments, we recommend using three nodes, each with 100 GiB of storage, as nodes can exhaust the 60
  GiB storage with prolonged use. If you initially set up the gateway with one node, you can resize it later.

- An active MAAS API key. Refer to the [Authenticating to the MAAS API](https://maas.io/docs/api) guide to learn more
  about how to create an API key.

- The DNS server that the PCG installer will use must be able to resolve the DNS names of machines that MAAS deploys so
  it can connect to them. The default setup is to use the MAAS server as the DNS server for any bare metal servers that
  it deploys. The default MAAS DNS zone is `.maas`. You can use `.maas` or the MAAS web console to create a new DNS
  zone. When you deploy the PCG and clusters, you can select the desired DNS zone in which DNS name records should be
  created.

  In the MAAS subnet configuration, you can specify which DNS servers those servers in the MAAS subnet should use.

  :::warning

  If you configure a DNS server other than the MAAS DNS server, you must create a DNS delegation so that it can forward
  DNS requests for zones that are hosted by MAAS to the MAAS DNS server.

  :::

The installation process first requests machines from MAAS and then must connect to them. To connect, the installation
process attempts to use the Fully Qualified Domain Name (FQDN) of the server. If you used `.maas` as the default DNS
zone, the FQDN would be `machine-hostname.maas`.

The diagram below shows an example of using an external DNS server for servers that MAAS deploys in addition to a DNS
delegation. This ensures all servers in the network can resolve the DNS names of servers deployed by MAAS. Note that it
is not required for the DNS records to be accessible from the internet.

![Image showing external DNS server machines that MAAS deploys in addition to a DNS delegation](/clusters_maas_maas-dns-setup.webp)

## Deploy PCG

<PartialsComponent category="pcg" name="pcg-initial-installation" edition="MAAS" />

8. Provide the MAAS API key and the MAAS server URL.

   | **Parameter**       | **Description**                                                  |
   | ------------------- | ---------------------------------------------------------------- |
   | **MAAS API Key**    | Enter the MAAS API key.                                          |
   | **MAAS Server URL** | Enter the MAAS server URL. Example: `http://10.1.1.1:5240/MAAS`. |

9. Configure the PCG cluster. The values provided determine which machines should be selected in MAAS for the PCG
   deployment.

   | **Parameter**                             | **Description**                                                                                                                                                                 |
   | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Domain**                                | Enter the MAAS domain.                                                                                                                                                          |
   | **Patch OS on boot**                      | Indicate whether to patch the OS of the PCG hosts on the first boot.                                                                                                            |
   | **Reboot nodes once OS patch is applied** | Indicate whether to reboot PCG nodes after OS patches are applied. This applies only if **Patch OS on boot** is enabled.                                                        |
   | **Availability Zone**                     | Enter the availability zones for the PCG cluster.                                                                                                                               |
   | **Number of Nodes**                       | Enter the number of nodes for the PCG cluster. Available options are **1** or **3**. We recommend three nodes for a High Availability (HA) cluster in a production environment. |
   | **Node Affinity**                         | Select `y` to allow all Palette pods to be scheduled on control plane nodes.                                                                                                    |

:::warning

Ensure the MAAS server has one or more machines in the **Ready** state for the chosen availability zone and resource
pool combination.

:::

10. <PartialsComponent category="pcg" name="pcg-cluster-provisioning" edition="MAAS" />

11. <PartialsComponent category="pcg" name="pcg-kind-cleanup" />

## Validate

<PartialsComponent category="pcg" name="pcg-validate" edition="MAAS" />

## Next Steps

After you have successfully deployed the PCG in your MAAS environment, you can deploy Kubernetes clusters in your MAAS
environment through Palette. Check out the
[Create and Manage MAAS Clusters](../../data-center/maas/create-manage-maas-clusters.md) guide to learn how to deploy a
Kubernetes cluster in MAAS that is managed by Palette.
