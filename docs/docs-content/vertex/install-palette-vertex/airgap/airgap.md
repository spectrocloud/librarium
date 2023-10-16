---
sidebar_label: "Airgap"
title: "Airgap"
description: "Learn how to install VerteX on VMware."
icon: ""
sidebar_position: 10
hide_table_of_contents: false
tags: ["vertex", "self-hosted", "airgap"]
---


You can install Palette VerteX in an airgapped environment. An airgap environment lacks direct access to the internet and is intended for environments with strict security requirements.

The installation process for an airgap install is different due to the lack of internet access. Before the primary Palette installation steps, you must download the following artifacts.

* Palette VerteX platform manifests and required platform packages.


* Container images for core platform components and third party dependencies.


* Palette VerteX Packs.


The other significant change is that VerteX's default public OCI registry is not used. Instead, a private OCI registry is utilized storing images and packs.



## Overview
Before you can install VerteX in an airgap environment, you must complete all the required pre-install steps. 
The following diagram outlines the major pre-install steps for an airgap installation.


![An architecture diagram outlining the five different install phases](/enterprise-version_air-gap-repo_overview-order-diagram.png)

1. Download the airgap setup binary from the support team. The airgap setup binary is a self-extracting archive that contains the VerteX platform manifests, images, and required packs. The airgap setup binary is used to upload the Palette images, and packs to your OCI registry.The airgap setup binary is a one-time use binary. You will not use the airgap setup binary again after the initial installation.

2. Extract the manifest content from the airgap setup binary. The manifest content is hosted on a file server.

3. Install VerteX using the Palette CLI. The Palette CLI is used to install VerteX into your vSphere environment. 

4. Configure your VerteX environment.


## Get Started

To get started with an airgap installation of VerteX, check out the respective platform guide. 

- [Kubernetes Airgap Instructions](kubernetes-airgap-instructions.md)

- [VMware vSphere Airgap Instructions](vmware-vsphere-airgap-instructions.md)


Each platform guide provides detailed instructions on how to complete the pre-install steps. We also recommend you review the [Checklist](checklist.md) to ensure you have completed all the required steps before deploying the airgap VerteX installation.


## Supported Platforms


| **Platform** | **OCI Registry**  | **Supported**|
| ------------- | ------------ | -----| 
| Kubernetes | Harbor | ✅ |
| Kubernetes | AWS ECR | ✅ |
| VMware vSphere | Harbor | ✅ |
| VMware vSphere | AWS ECR | ✅ |


## Resources

- [Kubernetes Airgap Instructions](kubernetes-airgap-instructions.md)

- [VMware vSphere Airgap Instructions](vmware-vsphere-airgap-instructions.md)

- [Checklist](checklist.md)

- [Additional Packs](supplemental-packs.md)