---
title: "Downloads"
metaTitle: "Spectro Downloads Artifacts"
metaDescription: "Spectro Cloud Artifacts Downloads "
icon: "cloud-download-alt"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Overview


Use the following resources to support your on-prem and SaaS operations when using Palette. 


# Self-Hosted

You can deploy a self-hosted flavor of Palette to your own environment. The following resources are available for self-hosted environments.


## Self-Hosted Palette Installer 

To request the Palette Self-hosted installer image, please contact our support team by sending an email to support@spectrocloud.com. Kindly provide the following information in your email:

- Your full name
- Organization name (if applicable)
- Email address
- Phone number (optional)
- A brief description of your intended use for the Palette Self-host installer image.

Our dedicated support team will promptly get in touch with you to provide the necessary assistance and share the installer image. 

If you have any questions or concerns, please feel free to contact support@spectrocloud.com.

# Air-Gapped Installation

You can install Palette in a VMware environment with no internet connection. Use the following resources to support an air-gapped environment.

# SAAS - Private Cloud Gateway (PCG)


Palette supports on-prem environments through the Private Cloud Gateway (PCG) component. PCG provides support for isolated private cloud or data center environments. When installed on-prem, PCG registers itself with Palette, allowing for secure communication between the SaaS portal and the private cloud environment. The gateway also enables end-to-end lifecycle management of Kubernetes clusters in private cloud environments directly from the SaaS portal. 

## vSphere PCG Image

|Version|URL| Checksum (SHA256) |
|---|---|---|
|1.8.0|https://software.spectrocloud.com/pcg/installer/v1.8.0/gateway-installer-v1.8.0.ova| `c860682c8e7dc55c6873ff1c5a0f337f91a74215b8cae92e4fa739b6ddc62720` |
|1.6.0|https://software.spectrocloud.com/pcg/installer/v1.6.0/gateway-installer-v1.6.0.ova| `2cf85c974e00524a2051be514484695ae51065af861bf1eb2c69aeb76816b0ff` |
|1.4.0|https://software.spectrocloud.com/pcg/installer/v1.4.0/gateway-installer-v1.4.0.ova| `67973c6ada136f64d9316dc05cda81d419997487c8007b6d58802bec12fb80dd` |
------

## MAAS PCG Image

|Version|URL| Checksum (SHA256) |
|---|---|---|
|1.0.12|https://gcr.io/spectro-images-public/release/spectro-installer:1.0.12| `a229d2f7593d133a40c559aa0fb45feca8b0cd1b2fcebfe2379d76f60bfe038b`|
---------

## OpenStack PCG Image

|Version|URL| Checksum (SHA256) |
|---|---|---|
|1.0.12|https://gcr.io/spectro-images-public/release/spectro-installer:1.0.12| `a229d2f7593d133a40c559aa0fb45feca8b0cd1b2fcebfe2379d76f60bfe038b`|
-------


# Palette CLI

The Palette Command Line Interface (CLI) is a tool that you can use to interact with Palette programmatically. Check out the [Palette CLI](/palette-cli/install-palette-cli) document for installation guidance.  

|Version| Operating System |  Checksum (SHA256) |
|---|---|---|
|4.0.0| [Linux-amd64](https://software.spectrocloud.com/palette-cli/v4.0.0/linux/cli/palette)| ``
|3.4.0| [Linux-amd64](https://software.spectrocloud.com/palette-cli/v3.4.0/linux/cli/palette)| `9dd1e1c70b0b30c2a35b54d1cb54b230593842a114f8d7cbeebe4e882fa2795e`|
|3.4.0| [OSX-arm64](https://software.spectrocloud.com/palette-cli/v3.4.0/osx/cli/palette)| `88b9e74705a0d66f9b34481002a8d33889c94ef7788a590807b1538e8513c62a`|



# Palette Edge CLI

|Version| Operating System |  Checksum (SHA256) |
|-------|---| --- |
|4.0.0 |  [Linux-amd64](https://software.spectrocloud.com/stylus/v4.0.0/cli/linux/palette-edge) | ``|
|3.4.3 |  [Linux-amd64](https://software.spectrocloud.com/stylus/v3.4.3/cli/linux/palette-edge) | `b53ccd28ea2a36a6eda43e0e7884c97bebd7d78922374168e1819b768df54f16`|


