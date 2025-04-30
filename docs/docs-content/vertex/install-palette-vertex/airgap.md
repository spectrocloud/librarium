---
sidebar_label: "Airgap Resources"
title: "Airgap Resources"
description: "Airgap installation resources for Palette VerteX."
icon: ""
sidebar_position: 10
hide_table_of_contents: false
tags: ["vertex", "self-hosted", "airgap"]
keywords: ["self-hosted", "vertex"]
---

You can install Palette VerteX in an airgapped environment. An airgap environment lacks direct access to the internet
and is intended for environments with strict security requirements.

The installation process for an airgap environment is different due to the lack of internet access. Before the primary
VerteX installation steps, you must download the following artifacts.

- Palette VerteX platform manifests and required platform packages.

- Container images for core platform components and third party dependencies.

- Palette VerteX packs.

The other significant change is that VerteX's default public OCI registry is not used. Instead, a private OCI registry
is utilized for storing images and packs.

## Overview

Before you can install VerteX in an airgap environment, you must complete all the required pre-install steps. The
following diagram outlines the major pre-install steps for an airgap installation.

![An architecture diagram outlining the five different install phases](/enterprise-version_air-gap-repo_overview-order-diagram.webp)

1. Download the airgap setup binary from the URL provided by the support team. The airgap setup binary is a
   self-extracting archive that contains the Palette platform manifests, images, and required packs. The airgap setup
   binary is a one-time use binary for uploading VerteX images and packs to your OCI registry. You will not use the
   airgap setup binary again after the initial installation. This step must be completed in an environment with internet
   access.

2. Move the airgap setup binary to the airgap environment. The airgap setup binary is used to extract the manifest
   content and upload the required images and packs to your private OCI registry. Start the airgap setup binary in a
   Linux Virtual Machine (VM).

3. The airgap script will push the required images, packs, and manifest to the built-in [Harbor](https://goharbor.io/)
   OCI registry.

4. Install Palette using the Palette CLI or the Kubernetes Helm chart.

5. Configure your VerteX environment.

## Get Started

To get started with an airgap VerteX installation, check out the respective platform guide.

- [Kubernetes Airgap Instructions](./install-on-kubernetes/airgap-install/airgap-install.md)

- [VMware vSphere Airgap Instructions](./install-on-vmware/airgap-install/airgap-install.md)

Each platform guide provides detailed instructions on how to complete the pre-install steps.

## Supported Platforms

The following table outlines the supported platforms for an airgap VerteX installation and the supported OCI registries.

| **Platform**   | **OCI Registry** | **Supported** |
| -------------- | ---------------- | ------------- |
| Kubernetes     | Harbor           | ✅            |
| Kubernetes     | AWS ECR          | ✅            |
| VMware vSphere | Harbor           | ✅            |
| VMware vSphere | AWS ECR          | ✅            |

## Resources

- [Additional Packs](../../downloads/palette-vertex/additional-packs.md)

- [Offline Documentation](../../downloads/offline-docs.md)
