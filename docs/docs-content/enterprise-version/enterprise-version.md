---
sidebar_label: "Self-Hosted Installation"
title: "Self-Hosted Installation"
description: "Understanding, installing and operating Spectro Cloud's Enterprise Self-Hosted variant."
hide_table_of_contents: false
sidebar_custom_props: 
  icon: "warehouse"
tags: ["self-hosted", "enterprise"]
---


Palette is available as a self-hosted platform offering. You can install the self-hosted version of Palette in your data centers or public cloud providers to manage Kubernetes clusters. You can install Palette by using the following four methods:


:::caution


Starting with Palette 4.0.0, the Palette CLI, and the Helm Chart, are the only supported methods for installing Palette. The Palette OVA installation method is only available for versions 3.4 and earlier. Refer to the [Install Enterprise Cluster](/enterprise-version/deploying-an-enterprise-cluster), or the [Kubernetes Install Helm Chart](/enterprise-version#kubernetesinstallhelmchart)  guides for additional guidance on how to install Palette.

:::

- [VMware Quick Start](/enterprise-version#vmwarequickstart)


- [VMware Enterprise](/enterprise-version#vmwareenterprise)


- [Kubernetes Install Helm Chart](/enterprise-version#kubernetesinstallhelmchart)


- [AirGap Install](/enterprise-version#airgapinstall)

## VMware Quick Start

A single-node Palette installation that is ideal for Proof of Concept (PoC) environments. Refer to the [Quick Start Installation](/enterprise-version/deploying-the-platform-installer) guide for more details.

## VMware Enterprise

A highly available multi-node Palette installation that is typically used for production purposes. Check out the [Enterprise Mode](/enterprise-version/deploying-an-enterprise-cluster) guide to get started.

## Kubernetes Install Helm Chart

Install Palette onto a Kubernetes cluster using a Helm Chart. Review the [Helm Chart Mode](/enterprise-version/deploying-palette-with-helm) guide to learn more.


## Airgap Install

Palette can be installed in a VMware environment without internet access, known as an air gap installation, requiring pre-download of platform manifests, required platform packages, container images for core components, third-party dependencies, and Palette Packs, all sourced from a private rather than the default public Palette repository.

## Download Palette Installer

To request the Palette Self-hosted installer image, please contact our support team by sending an email to support@spectrocloud.com. Kindly provide the following information in your email:

- Your full name
- Organization name (if applicable)
- Email address
- Phone number (optional)
- A brief description of your intended use for the Palette Self-host installer image.

Our dedicated support team will promptly get in touch with you to provide the necessary assistance and share the installer image. 

If you have any questions or concerns, please feel free to contact support@spectrocloud.com.


## Upgrade Notes

Review the [Upgrade Notes](/enterprise-version/upgrade) before attempting to upgrade Palette.


<br />

## Resources 


* [System Requirements](/enterprise-version/on-prem-system-requirements)


* [Quick Start Mode](/enterprise-version/deploying-the-platform-installer)


* [Enterprise Mode](/enterprise-version/deploying-an-enterprise-cluster)


* [Helm Chart Mode](/enterprise-version/deploying-palette-with-helm)


* [System Console Dashboard](/enterprise-version/system-console-dashboard)


* [Creating a VMware Cloud Gateway](/clusters/data-center/vmware#creatingavmwarecloudgateway)


* [Create VMware Cloud Account](/clusters/data-center/vmware#creatingavmwarecloudaccount)


* [Deploy a VMware Cluster](/clusters/data-center/vmware#deployingavmwarecluster)


* [Troubleshooting](/clusters/data-center/vmware#troubleshooting)


* [Upgrade Notes](/enterprise-version/upgrade)


<br />

<br />

