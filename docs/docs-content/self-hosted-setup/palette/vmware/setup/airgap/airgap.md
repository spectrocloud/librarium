---
sidebar_label: "Airgap Installation"
title: "Airgap Installation"
description: "Learn how to deploy self-hosted Palette in an airgapped environment."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["self-hosted", "enterprise", "airgap"]
keywords: ["self-hosted", "enterprise"]
---

You can install Palette in an airgap VMware vSphere environment. An airgap environment lacks direct access to the
internet and is intended for environments with strict security requirements.

The installation process for an airgap environment is different due to the lack of internet access. Before the primary
Palette installation steps, you must download the following artifacts.

- Palette platform manifests and required platform packages.

- Container images for core platform components and third-party dependencies.

- Palette packs.

The other significant change is that Palette's default public OCI registry is not used. Instead, a private OCI registry
is utilized for storing images and packs.

## Overview

Before you can install Palette in an airgap environment, you must complete all the required pre-installation steps. The
following diagram outlines the major pre-installation steps for an airgap installation.

![An architecture diagram outlining the five different installation phases](/enterprise-version_air-gap-repo_overview-order-diagram.webp)

1. Download the airgap setup binary from the URL provided by the support team. The airgap setup binary is a
   self-extracting archive that contains the Palette platform manifests, images, and required packs. The airgap setup
   binary is a one-time use binary for uploading Palette images and packs to your OCI registry. You will not use the
   airgap setup binary again after the initial installation. This step must be completed in an environment with internet
   access.

2. Move the airgap setup binary to the airgap environment. The airgap setup binary is used to extract the manifest
   content and upload the required images and packs to your private OCI registry. Start the airgap setup binary in a
   Linux Virtual Machine (VM).

3. The airgap script will push the required images and packs to your private OCI registry.

4. Install Palette using the Palette CLI or the Kubernetes Helm chart.

## Environment Setup

This section helps you prepare your VMware vSphere airgap environment for Palette installation. You can choose between
two methods to prepare your environment:

1. If you have a Red Hat Enterprise Linux (RHEL) VM deployed in your environment, follow the
   [Environment Setup with an Existing RHEL VM](./env-setup-vm.md) guide to learn how to prepare this VM for Palette
   installation.
2. If you do not have an RHEL VM, follow the [Environment Setup with OVA](./vmware-vsphere-airgap-instructions.md)
   guide. This guide will show you how to use an OVA to deploy an airgap support VM in your VMware vSphere environment,
   which will then assist with the Palette installation process.

## Supported Platforms

The following table outlines the platforms supported for airgap VerteX installation and the supported OCI registries.

| **Platform**   | **OCI Registry** | **Supported** |
| -------------- | ---------------- | ------------- |
| VMware vSphere | Harbor           | ✅            |
| VMware vSphere | AWS ECR          | ✅            |

## Get Started

To get started with an airgap Palette installation, begin by reviewing the
[Environment Setup](./environment-setup/vmware-vsphere-airgap-instructions.md) guide.

## Resources

- [Environment Setup](./environment-setup/vmware-vsphere-airgap-instructions.md)

- [Airgap Install Checklist](./checklist.md)

- [Airgap Install](./airgap-install.md)

- [Additional Packs](../../../../downloads/self-hosted-palette/additional-packs.md)
