---
sidebar_label: "Airgap Environment"
title: "Airgap Environment"
description:
  "Prepare your environment for installing self-hosted Palette on a Kubernetes cluster in an airgapped environment using
  a Helm Chart."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["self-hosted", "airgap", "helm"]
keywords: ["self-hosted", "airgap", "helm"]
---

You can install self-hosted Palette in an airgap Kubernetes environment. An airgap environment lacks direct access to
the internet and is intended for environments with strict security requirements.

The installation process for an airgap environment is different due to the lack of internet access. Before the primary
Palette installation steps, you must download the following artifacts:

- Palette platform manifests and required platform packages.

- Container images for core platform components and third-party dependencies.

- Palette packs.

The other significant change is that Palette's default public OCI registry is not used. Instead, a private OCI registry
is utilized to store images and packs.

## Overview

Before you can install Palette in an airgap environment, you must first set up your environment as outlined in the
following diagram.

![An architecture diagram outlining the five different installation phases](/enterprise-version_air-gap-repo_k8s-points-overview-order-diagram.webp)

1. In an environment with internet access, download the airgap setup binary from the URL provided by our support team.
   The airgap setup binary is a self-extracting archive that contains the Palette platform manifests, images, and
   required packs. The airgap setup binary is a single-use binary for uploading Palette images and packs to your OCI
   registry. You will not use the airgap setup binary again after the initial installation.

2. Move the airgap setup binary to the airgap environment. The airgap setup binary is used to extract the manifest
   content and upload the required images and packs to your private OCI registry. Start the airgap setup binary in a
   Linux Virtual Machine (VM).

3. The airgap script will push the required images and packs to your private OCI registry.

4. Install Palette using the Kubernetes Helm chart.

## Supported Platforms

The following table outlines the platforms supported for airgap VerteX installation and the supported OCI registries.

| **Platform** | **OCI Registry** | **Supported** |
| ------------ | ---------------- | ------------- |
| Kubernetes   | Harbor           | ✅            |
| Kubernetes   | AWS ECR          | ✅            |

## Next Steps

To get started with the airgap Palette installation, review the [Environment Setup](./environment-setup.md) page. The
environment setup guide provides detailed instructions on how to prepare your airgap environment. After you have
completed the environment setup, you can proceed with the [Install Palette](../../install/airgap.md) guide.
