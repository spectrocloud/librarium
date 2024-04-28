---
sidebar_label: "Airgap Installation"
title: "Airgap Installation"
description: "Learn how to deploy self-hosted Palette to a Kubernetes cluster using a Helm Chart."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["self-hosted", "enterprise", "airgap"]
keywords: ["self-hosted", "enterprise"]
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

![An architecture diagram outlining the five different installation phases](/enterprise-version_air-gap-repo_overview-order-diagram.webp)

1. In an environment with internet access, download the airgap setup binary from the URL provided by our support team.
   The airgap setup binary is a self-extracting archive that contains the Palette platform manifests, images, and
   required packs. The airgap setup binary is a single-use binary for uploading Palette images and packs to your OCI
   registry. You will not use the airgap setup binary again after the initial installation.

2. Move the airgap setup binary to the airgap environment. The airgap setup binary is used to extract the manifest
   content and upload the required images and packs to your private OCI registry. Start the airgap setup binary in a
   Linux Virtual Machine (VM).

3. The airgap script will push the required images and packs to your private OCI registry.

4. Extract the manifest content from the airgap setup binary. The manifest content must be hosted on a web server that
   is accessible from the airgap environment. You can use the same Linux VM from step two to host the manifest content
   or use a different web server.

5. Install Palette using the Kubernetes Helm chart.

## Get Started

To get started with the airgap Palette installation, review the [Environment Setup](./kubernetes-airgap-instructions.md)
page. The environment setup guide provides detailed instructions on how to prepare your airgap environment. After you
have completed the environment setup, you can proceed with the [Install Palette](./install.md) guide.

## Resources

- [Environment Setup](kubernetes-airgap-instructions.md)

- [Install Palette](./install.md)

- [Checklist](checklist.md)

- [Additional Packs](../../airgap/supplemental-packs.md)
