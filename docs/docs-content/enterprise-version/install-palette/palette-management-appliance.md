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

This is a Tech Preview feature and is subject to change. Upgrades from a Tech Preview deployment may not be available.
Do not use this feature in production workloads.

:::

The Palette Management Appliance is downloadable as an ISO file and is a solution for installing self-hosted Palette on
your infrastructure. The ISO file contains all the necessary components needed for Palette to function. The ISO file is
used to boot the nodes, which are then clustered to form a Palette management cluster.

Once Palette has been installed, you can download pack bundles and upload them to the internal Zot registry or an
external registry. These pack bundles are used to create your cluster profiles. You will then be able to deploy clusters
in your environment.

## Third Party Packs

There is an additional option to download and install the Third Party packs that provide complementary functionality to
Palette. These packs are not required for Palette to function, but they do provide additional features and capabilities
as described in the following table.

| **Feature**                                                                                                                           | **Included with Palette Third Party Pack** | **Included with Palette Third Party Conformance Pack** |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------ |
| [Backup and Restore](../../clusters/cluster-management/backup-restore/backup-restore.md)                                              | :white_check_mark:                         | :x:                                                    |
| [Configuration Security](../../clusters/cluster-management/compliance-scan.md#configuration-security)                                 | :white_check_mark:                         | :x:                                                    |
| [Penetration Testing](../../clusters/cluster-management/compliance-scan.md#penetration-testing)                                       | :white_check_mark:                         | :x:                                                    |
| [Software Bill Of Materials (SBOM) scanning](../../clusters/cluster-management/compliance-scan.md#sbom-dependencies--vulnerabilities) | :white_check_mark:                         | :x:                                                    |
| [Conformance Testing](../../clusters/cluster-management/compliance-scan.md#conformance-testing)                                       | :x:                                        | :white_check_mark:                                     |

## Architecture

The ISO file is built with the Operating System (OS), Kubernetes distribution, Container Network Interface (CNI), and
Container Storage Interface (CSI). A [Zot registry](https://zotregistry.dev/) is also included in the Appliance
Framework ISO. Zot is a lightweight, OCI-compliant container image registry that is used to store the Palette packs
needed to create cluster profiles.

The following table displays the infrastructure profile for the self-hosted Palette appliance.

| **Layer**      | **Component**                                 |
| -------------- | --------------------------------------------- |
| **OS**         | Ubuntu: Immutable [Kairos](https://kairos.io) |
| **Kubernetes** | Palette eXtended Kubernetes Edge (PXK-E)      |
| **CNI**        | Calico                                        |
| **CSI**        | Piraeus                                       |
| **Registry**   | Zot                                           |

Check the **Component Updates** in the [Release Notes](../../release-notes/release-notes.md) for the specific versions
of each component as they may be updated between releases.

## Supported Platforms

The Palette Management Appliance can be used on the following infrastructure platforms:

- VMware vSphere
- Bare Metal
- Machine as a Service (MAAS)

## Limitations

- Only public image registries are supported if you are choosing to use an external registry for your pack bundles.

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

:::warning

If your installation is not successful, verify that the `piraeus-operator` pack was correctly installed. For more
information, refer to the
[Self-Hosted Installation - Troubleshooting](../../troubleshooting/enterprise-install.md#scenario---palettevertex-management-appliance-installation-stalled-due-to-piraeus-operator-pack-in-error-state)
guide.

:::

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

## (Optional) Upload Third Party Packs

Follow the instructions to upload the Third Party packs to your Palette instance. The Third Party packs contain
additional functionality and capabilities that enhance the Palette experience.

### Prerequisites

<PartialsComponent
  category="self-hosted"
  name="upload-third-party-packs-prereqs"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

### Upload Packs

<PartialsComponent
  category="self-hosted"
  name="upload-third-party-packs-enablement"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

### Validate

<PartialsComponent
  category="self-hosted"
  name="upload-third-party-packs-validate"
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
