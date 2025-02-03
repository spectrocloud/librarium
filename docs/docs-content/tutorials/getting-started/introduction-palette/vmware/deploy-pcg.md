---
sidebar_label: "Deploy a PCG"
title: "Deploy a PCG with Palette CLI"
description: "Learn to deploy a PCG with Palette CLI."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["getting-started", "vmware", "tutorial"]
---

Palette Private Cloud Gateway (PCG) is a crucial infrastructure support component that acts as a bridge between your
private cloud environment or data center and Palette.

A PCG is required in environments lacking direct network access to Palette. For example, many infrastructure
environments reside within private networks that restrict external connections, preventing internal devices and
resources from reaching Palette directly.

Upon installation, the PCG initiates a connection from inside the private network to Palette, serving as an endpoint for
Palette to communicate with the infrastructure environment. The PCG continuously polls Palette for instructions to
either deploy or delete Kubernetes clusters within the environment. This connection uses a secure communication channel
that is encrypted using the Transport Layer Security (TLS) protocol. Once a cluster is deployed, the PCG is no longer
involved in the communication between Palette and the deployed cluster. The cluster then communicates directly with
Palette through the Palette agent available within each cluster, which originates all network requests outbound toward
Palette. Refer to the [PCG Architecture](../../../../clusters/pcg/architecture.md) section for more information.

In this tutorial, you will deploy a VMware PCG using Palette CLI.

### Prerequisites

Follow the steps described in the [Set up Palette with VMware](./setup.md) guide to authenticate Palette for use with
your VMware user account.

You will need a Linux x86-64 machine with access to a terminal and Internet, as well as connection to both Palette and
VMware vSphere.

    - The following IP address requirements must be met in your VMware vSphere environment:
        - One IP address available for the single-node PCG deployment. Refer to the [PCG Sizing](../../../../clusters/pcg/manage-pcg/scale-pcg-nodes.md) section for more information on sizing.
        - One IP address reserved for cluster repave operations.
        - One IP address for the Virtual IP (VIP).
        - DNS must be able to resolve the domain `api.spectrocloud.com`.
        - NTP server must be reachable from the PCG.
    - The following minimum resources must be available in your VMware vSphere environment:
        - CPU: 4 cores.
        - Memory: 4 GiB.
        - Storage: 60 GiB.

        <br />

        :::info

        In production environments, we recommend deploying a three-node PCG, each node with 8 cores of CPU, 8 GiB of memory, and 100 GiB of storage.

        :::

    - Ensure the following software is installed and available on your Linux machine.
        - [Palette CLI](../../../../automation/palette-cli/install-palette-cli.md).
        - [Docker](https://docs.docker.com/desktop).
        - [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation).
        - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Authenticate with Palette

<PartialsComponent category="pcg-vmware" name="authenticate-palette-cli" />

## Deploy a PCG

<PartialsComponent category="pcg-vmware" name="deploy-pcg-palette-cli" />

## Next Steps

In this tutorial, you deployed a PCG to connect Palette to your VMware vSphere environment. To learn how to get started
with deploying Kubernetes clusters to VMware, we recommend that you continue to the
[Create a Cluster Profile](./create-cluster-profile.md) tutorial to create a full cluster profile for your host cluster.
