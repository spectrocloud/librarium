---
sidebar_label: "Deploy to CloudStack"
title: "Deploy to CloudStack"
description: "Steps to deploy a PCG to an Apache CloudStack environment"
hide_table_of_contents: false
sidebar_position: 50
tags: ["pcg", "cloudstack"]
---

This guide provides you with the steps to deploy a PCG cluster to an Apache CloudStack environment. Before you begin the
installation, carefully review the [Prerequisites](#prerequisites) section.

## Prerequisites

- A Palette API key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  page for guidance.

  :::warning

  The installation does not work with Single Sign-On (SSO) credentials. You must use an API key from a local tenant
  admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no
  longer used to keep the PCG connected to Palette, so you can deactivate the account if desired.

  :::

- Download and install the Palette CLI from the [Downloads](../../../downloads/cli-tools.md#palette-cli) page. Refer to
  the [Palette CLI Install](../../../automation/palette-cli/install-palette-cli.md) guide to learn more.

  - You will need to provide the Palette CLI an encryption passphrase to secure sensitive data. The passphrase must be
    between 8 to 32 characters long and contain a capital letter, a lowercase letter, a digit, and a special character.
    Refer to the [Palette CLI Encryption](../../../automation/palette-cli/palette-cli.md#encryption) section for more
    information.

- PCG IP address requirements:

  - For a single-node deployment, one IP address must be available for the PCG, or three available IP addresses for a
    three-node deployment. Refer to the [PCG Sizing](./deploy-pcg.md#pcg-sizing) section for more information on sizing.
  - For three-node deployments, one IP address must be available for the Kubernetes API-server endpoint.
  - One IP address reserved for cluster repave operations.
  - One IP address for the Virtual IP (VIP).
  - DNS can resolve the domain `api.spectrocloud.com`.

- The PCG nodes must be deployed on an x86 Linux environment with a Docker daemon installed and a connection to Palette
  and the CloudStack endpoint. The Palette CLI installation must be invoked on an up-to-date Linux system with the
  x86-64 architecture.

- The CloudStack user account used to deploy the PCG must have the following permissions:

  - TBC

## Deploy the PCG

TBC

## Validate

TBC

## Next Steps

TBC
