---
title: "Palette Management Appliance"
sidebar_label: "Palette Management Appliance"
description: "Learn how to deploy self-hosted Palette to your environment using the Palette Management Appliance"
hide_table_of_contents: false
# sidebar_custom_props:
#   icon: "chart-diagram"
tags: ["palette management appliance", "self-hosted", "enterprise"]
sidebar_position: 20
---

:::preview

:::

The Palette Management Appliance is downloadable as an ISO file and is a solution for installing self-hosted Palette on
your infrastructure. The ISO file contains all the necessary components needed for Palette to function. The ISO file is
used to boot the nodes, which are then clustered to form a Palette management cluster.

Once Palette has been installed, you can download pack bundles to create your cluster profiles. You will then be able to
deploy clusters in your environment.

## Architecture

The ISO file is built with the Operating System (OS), Kubernetes distribution, Container Network Interface (CNI), and
Container Storage Interface (CSI). A [Zot registry](https://zotregistry.dev/) is also included in the Appliance
Framework ISO. Zot is a lightweight, OCI-compliant container image registry that is used to store the Palette packs
needed to create cluster profiles.

This solution is designed to be immutable, secure, and compliant with industry standards, such as the Security Technical
Implementation Guides (STIG). The following table displays the infrastructure profile for the self-hosted Palette
appliance.

| **Layer**      | **Component**                                                   |
| -------------- | --------------------------------------------------------------- |
| **OS**         | Ubuntu: Immutable [Kairos](https://kairos.io) and STIG-hardened |
| **Kubernetes** | Palette Kubernetes (PXK): STIG-hardened                         |
| **CNI**        | Calico                                                          |
| **CSI**        | Piraeus                                                         |
| **Registry**   | Zot                                                             |

## Supported Platforms

The Palette Management Appliance can be used on the following infrastructure platforms:

- VMware vSphere
- Bare Metal
- Machine as a Service (MAAS)

## Installation Steps

Follow the instructions to install Palette using the Palette Management Appliance on your infrastructure platform.

### Prerequisites

<PartialsComponent
  category="self-hosted"
  name="installation-steps-prereqs"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

### Install Palette

<PartialsComponent
  category="self-hosted"
  name="installation-steps-enablement"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

### Validate

<PartialsComponent
  category="self-hosted"
  name="installation-steps-validate"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

## Upload Packs to Palette

Follow the instructions to upload packs to your Palette instance. Packs are used to create
[cluster profiles](../../profiles/cluster-profiles/cluster-profiles.md) and deploy workload clusters in your
environment.

:::info

If you are intending to upgrade Palette using a content bundle, you must upload the bundle to the internal Zot registry
using Local UI. This is regardless of whether you are using an external registry or the internal Zot registry for your
pack bundles.

:::

### Prerequisites

<PartialsComponent
  category="self-hosted"
  name="upload-packs-prereqs"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

### Upload Packs

<PartialsComponent
  category="self-hosted"
  name="upload-packs-enablement"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

### Validate

<PartialsComponent
  category="self-hosted"
  name="upload-packs-validate"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

## Next Steps

<PartialsComponent
  category="self-hosted"
  name="next-steps"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>
