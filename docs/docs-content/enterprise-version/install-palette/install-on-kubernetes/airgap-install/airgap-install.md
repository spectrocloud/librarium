---
sidebar_label: "Airgap Install"
title: "Airgap Install"
description: "Learn how to deploy self-hosted Palette to a Kubernetes cluster using a Helm Chart."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["self-hosted", "enterprise", "airgap"]
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

![An architecture diagram outlining the five different install phases](/enterprise-version_air-gap-repo_overview-order-diagram.webp)

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

Configure your Palette environment

## Get Started

To get started with an airgap Palette installation, begin by reviewing the
[Environment Setup](./kubernetes-airgap-instructions.md) guide.

## Resources

- [Environment Setup](./kubernetes-airgap-instructions.md)

- [Airgap Install Checklist](./checklist.md)

- [Airgap Install](./airgap-install.md)

- [Additional Packs](../../airgap/supplemental-packs.md)
