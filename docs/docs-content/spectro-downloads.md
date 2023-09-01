---
sidebar_label: "Downloads"
title: "Downloads"
description: "Overview of Palette downloads and their respective URL and checksums."
hide_table_of_contents: false
sidebar_position: 240
sidebar_custom_props: 
  icon: "cloud-arrow-down"
---


The following Palette downloads are available:


## Self-Hosted

You can deploy a self-hosted Palette to your environment. Refer to the [Self-Hosted Installation](/enterprise-version/) documentation for additional guidance on how to install Palette. Palette VerteX installation guide can be found in the [Palette VerteX install](/vertex/install-palette-vertex) document.

<br />

:::caution


Starting with Palette 4.0.0, the Palette CLI, and the Helm Chart, are the only supported methods for installing Palette. The Palette OVA installation method is only available for versions 3.4 and earlier. Refer to the [Install Enterprise Cluster](/enterprise-version/deploying-an-enterprise-cluster), or the [Kubernetes Install Helm Chart](/enterprise-version#kubernetesinstallhelmchart) guides for additional guidance on how to install Palette.

:::

<br />

## SAAS - Private Cloud Gateway (PCG)


Palette supports on-prem environments through the Private Cloud Gateway (PCG) component. PCG provides support for isolated private cloud or data center environments. When installed on-prem, PCG registers itself with Palette, allowing for secure communication between the SaaS portal and the private cloud environment. The gateway also enables end-to-end lifecycle management of Kubernetes clusters in private cloud environments directly from the SaaS portal. 

<br />

:::caution

Starting with Palette 4.0, the installation of PCG is done through the Palette CLI. Refer to the Palette CLI [PCG command](/palette-cli/commands/#pcg) document for installation guidance.

:::

<br />

### vSphere PCG Image

|Version|URL| Checksum (SHA256) |
|---|---|---|
|1.8.0|https://software.spectrocloud.com/pcg/installer/v1.8.0/gateway-installer-v1.8.0.ova| `c860682c8e7dc55c6873ff1c5a0f337f91a74215b8cae92e4fa739b6ddc62720` |
|1.6.0|https://software.spectrocloud.com/pcg/installer/v1.6.0/gateway-installer-v1.6.0.ova| `2cf85c974e00524a2051be514484695ae51065af861bf1eb2c69aeb76816b0ff` |
|1.4.0|https://software.spectrocloud.com/pcg/installer/v1.4.0/gateway-installer-v1.4.0.ova| `67973c6ada136f64d9316dc05cda81d419997487c8007b6d58802bec12fb80dd` |
------

### MAAS PCG Image

|Version|URL| Checksum (SHA256) |
|---|---|---|
|1.0.12|https://gcr.io/spectro-images-public/release/spectro-installer:1.0.12| `a229d2f7593d133a40c559aa0fb45feca8b0cd1b2fcebfe2379d76f60bfe038b`|
---------

### OpenStack PCG Image

|Version|URL| Checksum (SHA256) |
|---|---|---|
|1.0.12|https://gcr.io/spectro-images-public/release/spectro-installer:1.0.12| `a229d2f7593d133a40c559aa0fb45feca8b0cd1b2fcebfe2379d76f60bfe038b`|
-------


## Palette CLI

The Palette Command Line Interface (CLI) is a tool that you can use to interact with Palette programmatically. Check out the [Palette CLI](/palette-cli/install-palette-cli) document for installation guidance.  

|Version| Operating System |  Checksum (SHA256) |
|---|---|---|
|4.0.0| [Linux-amd64](https://software.spectrocloud.com/palette-cli/v4.0.0/linux/cli/palette)| `44fe237d2dc8bec04e45878542339cbb5f279ed7374b5dfe6118c4cbe94132b4` |
|3.4.0| [Linux-amd64](https://software.spectrocloud.com/palette-cli/v3.4.0/linux/cli/palette)| `9dd1e1c70b0b30c2a35b54d1cb54b230593842a114f8d7cbeebe4e882fa2795e`|
|3.4.0| [OSX-arm64](https://software.spectrocloud.com/palette-cli/v3.4.0/osx/cli/palette)| `88b9e74705a0d66f9b34481002a8d33889c94ef7788a590807b1538e8513c62a`|



## Palette Edge CLI

|Version| Operating System |  Checksum (SHA256) |
|-------|---| --- |
|4.0.2 |  [Linux-amd64](https://software.spectrocloud.com/stylus/v4.0.2/cli/linux/palette-edge) | `257d868b490979915619969815fd78aa5c7526faba374115f8d7c9d4987ba05d`|
|3.4.3 |  [Linux-amd64](https://software.spectrocloud.com/stylus/v3.4.3/cli/linux/palette-edge) | `b53ccd28ea2a36a6eda43e0e7884c97bebd7d78922374168e1819b768df54f16`|

