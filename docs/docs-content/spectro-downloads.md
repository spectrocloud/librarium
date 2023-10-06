---
sidebar_label: "Downloads"
title: "Downloads"
description: "Overview of Palette downloads and their respective URL and checksums."
hide_table_of_contents: false
sidebar_position: 240
sidebar_custom_props: 
  icon: "cloud-arrow-down"
tags: ["downloads"]
---


The following Palette downloads are available:


## Self-Hosted

You can deploy a self-hosted Palette to your environment. Refer to the [Self-Hosted Installation](enterprise-version/install-palette/install-palette.md) documentation for additional guidance on how to install Palette. Palette VerteX installation guide can be found in the [Palette VerteX install](vertex/install-palette-vertex) document.

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
|4.0.4| [Linux-amd64](https://software.spectrocloud.com/palette-cli/v4.0.4/linux/palette)    | `4c3885b6498a1d0015afca3d1a1761bca9ec8811caae6047bf3d0790f2aa5b5a` | 
|4.0.3| [Linux-amd64](https://software.spectrocloud.com/palette-cli/v4.0.3/linux/palette)    | `55c8a0b181857e824e12d08ab9786c7b8b171a018c23228a1abd0167cb3788ca` | 
|4.0.2| [Linux-amd64](https://software.spectrocloud.com/palette-cli/v4.0.2/linux/cli/palette)| `01e6b9c73368319fe2855aedcf073526ab73b4ff635997257f8c10a11efd8f0c` |
|4.0.1| [Linux-amd64](https://software.spectrocloud.com/palette-cli/v4.0.1/linux/cli/palette)| `cd6b8fe35ded298fb5bdd0adcaea05774fcdcb62230430c6c8f915fa8464c49a` |
|4.0.0| [Linux-amd64](https://software.spectrocloud.com/palette-cli/v4.0.0/linux/cli/palette)| `44fe237d2dc8bec04e45878542339cbb5f279ed7374b5dfe6118c4cbe94132b4` |



## Palette Edge CLI

|Version| Operating System |  Checksum (SHA256) |
|-------|---| --- |
|4.0.2 |  [Linux-amd64](https://software.spectrocloud.com/stylus/v4.0.2/cli/linux/palette-edge) | `257d868b490979915619969815fd78aa5c7526faba374115f8d7c9d4987ba05d`|

