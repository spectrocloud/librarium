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

This is a Tech Preview feature and is subject to change. Upgrades from a Tech Preview deployment may not be available.
Do not use this feature in production workloads.

:::

The VerteX Management Appliance is downloadable as an ISO file and is a solution for installing Palette VerteX on your
infrastructure. The ISO file contains all the necessary components needed for Palette to function. The ISO file is used
to boot the nodes, which are then clustered to form a Palette management cluster.

Once Palette VerteX has been installed, you can download pack bundles and upload them to the internal Zot registry or an
external registry. These pack bundles are used to create your cluster profiles. You will then be able to deploy clusters
in your environment.

## Third Party Packs

There is an additional option to download and install the Third Party packs that provide complementary functionality to
Palette VerteX. These packs are not required for Palette VerteX to function, but they do provide additional features and
capabilities as described in the following table.

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

This solution is designed to be immutable, secure, and compliant with industry standards, such as the Federal
Information Processing Standards (FIPS). The following table displays the infrastructure profile for the Palette VerteX
appliance.

| **Layer**      | **Component**                                 | **FIPS-compliant** |
| -------------- | --------------------------------------------- | ------------------ |
| **OS**         | Ubuntu: Immutable [Kairos](https://kairos.io) | :white_check_mark: |
| **Kubernetes** | Palette eXtended Kubernetes Edge (PXK-E)      | :white_check_mark: |
| **CNI**        | Calico                                        | :white_check_mark: |
| **CSI**        | Piraeus                                       | :white_check_mark: |
| **Registry**   | Zot                                           | :white_check_mark: |

Check the **Component Updates** in the [Release Notes](../../release-notes/release-notes.md) for the specific versions
of each component as they may be updated between releases.

## Supported Platforms

The VerteX Management Appliance can be used on the following infrastructure platforms:

- VMware vSphere
- Bare Metal
- Machine as a Service (MAAS)

## Limitations

- Only public image registries are supported if you are choosing to use an external registry for your pack bundles.

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
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

## Upload Packs to Palette VerteX

Follow the instructions to upload packs to your Palette VerteX instance. Packs are used to create
[cluster profiles](../../profiles/cluster-profiles/cluster-profiles.md) and deploy workload clusters in your
environment.

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

## (Optional) Upload Third Party Packs

Follow the instructions to upload the Third Party packs to your Palette VerteX instance. The Third Party packs contain
additional functionality and capabilities that enhance the Palette VerteX experience, such as backup and restore,
configuration scanning, penetration scanning, SBOM scanning, and conformance scanning.

### Prerequisites

<PartialsComponent
  category="self-hosted"
  name="upload-third-party-packs-prereqs"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

### Upload Packs

<PartialsComponent
  category="self-hosted"
  name="upload-third-party-packs-enablement"
  edition="VerteX"
  version="Palette VerteX"
  iso="Palette VerteX"
  app="VerteX Management Appliance"
/>

### Validate

<PartialsComponent
  category="self-hosted"
  name="upload-third-party-packs-validate"
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
