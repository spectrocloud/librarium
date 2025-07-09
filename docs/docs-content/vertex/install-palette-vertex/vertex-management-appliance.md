---
title: "VerteX Management Appliance"
sidebar_label: "VerteX Management Appliance"
description: "Learn how to deploy Palette VerteX to your environment using the VerteX Management Appliance"
hide_table_of_contents: false
# sidebar_custom_props:
#   icon: "chart-diagram"
tags: ["verteX management appliance", "self-hosted", "vertex"]
sidebar_position: 20
---

:::preview

:::

The VerteX Management Appliance is downloadable as an ISO file and is a solution for installing Palette VerteX on your
infrastructure. The ISO file contains all the necessary components needed for Palette to function. The ISO file is used
to boot the nodes, which are then clustered to form a Palette management cluster.

Once Palette VerteX has been installed, you can download pack bundles to create your cluster profiles. You will then be
able to deploy clusters in your environment.

## Architecture

The ISO file is built with the Operating System (OS), Kubernetes distribution, Container Network Interface (CNI), and
Container Storage Interface (CSI). A [Zot registry](https://zotregistry.dev/) is also included in the Appliance
Framework ISO. Zot is a lightweight, OCI-compliant container image registry that is used to store the Palette packs
needed to create cluster profiles.

This solution is designed to be immutable, secure, and compliant with industry standards, such as the Federal
Information Processing Standards (FIPS) and Security Technical Implementation Guides (STIG). The following table
displays the infrastructure profile for the Palette VerteX appliance.

| **Layer**      | **Component**                                                                   |
| -------------- | ------------------------------------------------------------------------------- |
| **OS**         | Ubuntu: Immutable [Kairos](https://kairos.io), STIG-hardened and FIPS compiled. |
| **Kubernetes** | Palette Kubernetes (PXK): STIG-hardened and FIPS compiled.                      |
| **CNI**        | Calico: FIPS compiled.                                                          |
| **CSI**        | Piraeus                                                                         |
| **Registry**   | Zot: FIPS compiled.                                                             |

## Supported Platforms

The VerteX Management Appliance can be used on the following infrastructure platforms:

- VMware vSphere
- Bare Metal
- Machine as a Service (MAAS)

## Installation Steps

Follow the instructions to install Palette VerteX using the VerteX Management Appliance on your infrastructure platform.

### Prerequisites

<PartialsComponent
  category="self-hosted"
  name="installation-steps-prereqs"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

### Install Palette VerteX

<PartialsComponent
  category="self-hosted"
  name="installation-steps-enablement"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

### Validate

<PartialsComponent
  category="self-hosted"
  name="installation-steps-validate"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

## Upload Packs to Palette VerteX

Follow the instructions to upload packs to your Palette VerteX instance. Packs are used to create
[cluster profiles](../../profiles/cluster-profiles/cluster-profiles.md) and deploy workload clusters in your
environment.

:::info

If you are intending to upgrade Palette VerteX using a content bundle, you must upload the bundle to the internal Zot
registry using Local UI. This is regardless of whether you are using an external registry or the internal Zot registry
for your pack bundles.

:::

### Prerequisites

<PartialsComponent
  category="self-hosted"
  name="upload-packs-prereqs"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

### Upload Packs

<PartialsComponent
  category="self-hosted"
  name="upload-packs-enablement"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

### Validate

<PartialsComponent
  category="self-hosted"
  name="upload-packs-validate"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

## Next Steps

<PartialsComponent
  category="self-hosted"
  name="next-steps"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>
