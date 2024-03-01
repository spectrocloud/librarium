---
sidebar_label: "Airgap"
title: "Airgap"
description: "Learn about Palette in an airgap environment and how to install Palette in an airgap environment."
icon: ""
sidebar_position: 10
hide_table_of_contents: false
tags: ["palette", "self-hosted", "airgap"]
keywords: ["self-hosted", "enterprise"]
---

You can install Palette in an airgapped environment. An airgap environment lacks direct access to the internet and is
intended for environments with strict security requirements.

The installation process for an airgap environment is different due to the lack of internet access. Before the primary
Palette installation steps, you must download the following artifacts.

- Palette platform manifests and required platform packages.

- Container images for core platform components and third-party dependencies.

- Palette packs.

The other significant change is that Palette's default public OCI registry is not used. Instead, a private OCI registry
is utilized for storing images and packs.

## Overview

Before you can install Palette in an airgap environment, you must complete all the required pre-install steps. The
following diagram outlines the major pre-install steps for an airgap installation.

![An architecture diagram outlining the five different install phases](/enterprise-version_air-gap-repo_overview-order-diagram.png)

1. Download the airgap setup binary from the URL provided by the support team. The airgap setup binary is a
   self-extracting archive that contains the Palette platform manifests, images, and required packs. The airgap setup
   binary is a one-time use binary for uploading Palette images and packs to your OCI registry. You will not use the
   airgap setup binary again after the initial installation. This step must be completed in an environment with internet
   access.

2. Move the airgap setup binary to the airgap environment. The airgap setup binary is used to extract the manifest
   content and upload the required images and packs to your private OCI registry. Start the airgap setup binary in a
   Linux Virtual Machine (VM).

3. The airgap script will push the required images and packs to your private OCI registry.

4. Extract the manifest content from the airgap setup binary. The manifest content must be hosted on a web server that
   is accessible from the airgap environment. You can use the same Linux VM from step 2 to host the manifest content or
   use a different web server.

5. Install Palette using the Palette CLI or the Kubernetes Helm chart.

6. Configure your Palette environment.

## Get Started

To get started with an airgap Palette installation, check out the respective platform guide.

- [Kubernetes Airgap Instructions](kubernetes-airgap-instructions.md)

- [VMware vSphere Airgap Instructions](vmware-vsphere-airgap-instructions.md)

Each platform guide provides detailed instructions on how to complete the pre-install steps. We also recommend you
review the [Checklist](checklist.md) to ensure you have completed all the required steps before deploying the airgap
Palette installation.

## Supported Platforms

The following table outlines the platforms supported for airgap VerteX installation and the supported OCI registries.

| **Platform**   | **OCI Registry** | **Supported** |
| -------------- | ---------------- | ------------- |
| Kubernetes     | Harbor           | ✅            |
| Kubernetes     | AWS ECR          | ✅            |
| VMware vSphere | Harbor           | ✅            |
| VMware vSphere | AWS ECR          | ✅            |

## Resources

- [Kubernetes Airgap Instructions](kubernetes-airgap-instructions.md)

- [VMware vSphere Airgap Instructions](vmware-vsphere-airgap-instructions.md)

- [Checklist](checklist.md)

- [Additional Packs](supplemental-packs.md)
