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

- Palette version 4.0.X or greater.

- A Palette API key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  page for guidance.

  :::warning

  The installation does not work with Single Sign-On (SSO) credentials. You must use an API key from a local tenant
  admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no
  longer used to keep the PCG connected to Palette, so you can disable the account if desired.

  :::

- Download the Palette CLI from the [Downloads](../../../spectro-downloads.md#palette-cli) page and install the CLI.
  Refer to the [Palette CLI Install](../../../palette-cli/install-palette-cli.md) guide to learn more.

The following system requirements must be met to install a PCG in MAAS:

- Private cloud gateway IP requirements:

  - 1 IP address for a single node PCG or 3 three IP addresses for a 3 node PCG
  - 1 IP address for the Kubernetes control-plane
  - DNS can resolve the domain `api.spectrocloud.com`.

- A Linux environment with a Docker daemon installed and a connection to Palette and the MAAS endpoint. The Palette CLI
  installation must be invoked on an up-to-date Linux system with an x86-64 architecture.

- PCG IP address requirements:

  - For a single-node gateway, one IP address must be available in the MAAS subnet for the PCG, or three available IP
    addresses for a three-node gateway.

  - One IP address must be available in the MAAS subnet for the Kubernetes API-server endpoint when deploying a
    three-node gateway.

- Sufficient available IPs within the configured MAAS subnets.

  :::warning

  By default, the MAAS Kubernetes pack uses a pod classless inter-domain routing (CIDR) range of 192.168.0.0/16. Ensure
  that the pod CIDR range for any clusters you deploy after setting up the PCG does not overlap with the network used by
  the bare metal machines that MAAS manages.

  :::

- Each node in the PCG cluster requires a machine from MAAS in a ready state with the following resources:

  - CPU: 4
  - Memory: 8192 MiB
  - Storage: 60 GiB

  For production environments, we recommend using three nodes, each with 100 GiB of storage, as nodes can exhaust the 60
  GiB storage with prolonged use. If you initially set up the gateway with one node, you can resize it at a later time.

- An active MAAS API key. Refer to the
  [Authenticating to the MAAS API](https://maas.io/docs/api-authentication-reference) guide to learn more about how to
  create an API key.

- The DNS server that the PCG installer will use, must be able to resolve the DNS names of machines that MAAS deploys so
  it can connect to them. The default setup is to use the MAAS server as the DNS server for any bare metal servers that
  it deploys. The default MAAS DNS zone is `.maas`. You can use `.maas` or you can use the MAAS web console to create a
  new DNS zone. When you deploy the PCG and clusters, you can select the desired DNS zone in which DNS name records
  should be created.

  In the MAAS subnets configuration, you can specify which DNS servers those servers in the MAAS subnet should use.

  :::warning

  If you configure a different DNS server than the MAAS DNS server, you must be sure to create a DNS delegation in the
  other DNS server, so that it can forward DNS requests for zones that are hosted by MAAS to the MAAS DNS server.

  :::

The installation process first requests machines from MAAS and then must connect to them. To connect, the install
process attempts to use the fully qualified domain name (FQDN) of the server. If you used `.maas` as the default DNS
zone, the FQDN would be `machine-hostname.maas`.

The diagram below shows an example of using an external DNS server for servers that MAAS deploys in addition to a DNS
delegation. This ensures all servers in the network can resolve the DNS names of servers deployed by MAAS. Note that it
is not required for the DNS records to be accessible from the internet.

![Image showing external DNS server machines that MAAS deploys in addition to a DNS delegation](/clusters_maas_maas-dns-setup.png)

## Deploy PCG

## Validation
