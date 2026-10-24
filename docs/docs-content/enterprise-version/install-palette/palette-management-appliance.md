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

The Palette Management Appliance is a solution for installing self-hosted Palette on your infrastructure. The appliance
ships as a slim **Appliance ISO** and a separate **Content bundle**. You boot each host from the Appliance ISO, and then
upload the content bundle to the leader host after you link the hosts.

This guide refers to the machines that you install Palette on as hosts. When you create the management cluster, each
host that you add to a node pool becomes a node in the cluster. Because the appliance is often installed on Edge
devices, these machines are also known as Edge hosts.

After you install Palette, you upload pack bundles to the internal Zot registry or an external registry. You use these
packs to create cluster profiles and deploy workload clusters with Palette.

## Supported Platforms

The Palette Management Appliance can be used on the following infrastructure platforms:

- VMware vSphere
- Bare Metal
- Machine as a Service (MAAS)

## Limitations

- If you use an external registry for your pack bundles, only public image registries are supported.

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

- <PartialsComponent category="self-hosted" name="installation-steps-secure-boot" edition="Palette" />

### Install Palette {#install}

Installing Palette consists of the following tasks.

1. [Download the Artifacts](#download-the-artifacts)

2. [Boot Hosts from ISO and Run the Installer](#boot-hosts-from-iso-and-run-the-installer)

3. [Configure Hosts](#configure-hosts)

4. [Link Hosts](#link-hosts)

5. [Upload Content Bundle to the Leader Host](#upload-content-bundle-to-the-leader-host)

6. [Create the Management Cluster](#create-the-management-cluster)

7. [Log In to the System Console](#log-in-to-the-system-console)

#### Download the Artifacts

<PartialsComponent
  category="self-hosted"
  name="installation-steps-download"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

#### Boot Hosts from ISO and Run the Installer

<PartialsComponent
  category="self-hosted"
  name="installation-steps-boot"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

#### Configure Hosts

<PartialsComponent
  category="self-hosted"
  name="installation-steps-configure"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

#### Link Hosts

<PartialsComponent
  category="self-hosted"
  name="installation-steps-link"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

#### Upload Content Bundle to the Leader Host

<PartialsComponent
  category="self-hosted"
  name="installation-steps-upload-content"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>

#### Create the Management Cluster

<PartialsComponent
  category="self-hosted"
  name="installation-steps-create-cluster"
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

#### Log In to the System Console

<PartialsComponent
  category="self-hosted"
  name="installation-steps-login"
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

Follow the instructions to upload the Third Party packs to your Palette instance.

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

## Artifact Components

The **Appliance ISO** is a slim installer that contains the OS, Palette agent, and Kubernetes distribution needed to
install a host.

The **Content bundle** contains all the components of the Palette management cluster, including the OS, Kubernetes
distribution, Container Network Interface (CNI), Container Storage Interface (CSI), and a
[Zot registry](https://zotregistry.dev/). Zot is a lightweight, OCI-compliant container image registry that is used to
store the Palette packs needed to create cluster profiles. The content bundle also includes those packs.

The following table displays the components of the self-hosted Palette appliance and which artifact contains each
component.

| **Layer**      | **Component**                                 | **Appliance ISO**  | **Content Bundle** |
| -------------- | --------------------------------------------- | ------------------ | ------------------ |
| **OS**         | Ubuntu: Immutable [Kairos](https://kairos.io) | :white_check_mark: | :white_check_mark: |
| **Kubernetes** | Palette eXtended Kubernetes Edge (PXK-E)      | :white_check_mark: | :white_check_mark: |
| **CNI**        | Calico                                        | :x:                | :white_check_mark: |
| **CSI**        | Piraeus                                       | :x:                | :white_check_mark: |
| **Registry**   | Zot                                           | :x:                | :white_check_mark: |

Piraeus requires the Distributed Replicated Block Device (DRBD) kernel module on each node. For hosts with Secure Boot,
the DRBD Compile Mode option must be set to `shipped_modules`. For how the module is loaded, refer to
[Piraeus CSI](../../integrations/piraeus-csi.mdx#drbd-kernel-module-loading).

Check the **Component Updates** in the [Release Notes](../../release-notes/release-notes.md) for the specific versions
of each component as they might be updated between releases.

## Next Steps

<PartialsComponent
  category="self-hosted"
  name="next-steps"
  edition="Palette"
  version="Palette"
  iso="Palette Enterprise"
  app="Palette Management Appliance"
/>
