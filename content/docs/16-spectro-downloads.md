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

|Version|URL|
|---|---|
|1.6.0|https://software.spectrocloud.com/pcg/installer/v1.6.0/gateway-installer-v1.6.0.ova|
|1.4.0|https://software.spectrocloud.com/pcg/installer/v1.4.0/gateway-installer-v1.4.0.ova|
------

## MAAS PCG Image

|Version|URL|
|---|---|
|1.0.12|https://gcr.io/spectro-images-public/release/spectro-installer:1.0.12|
---------

## OpenStack PCG Image

|Version|URL|
|---|---|
|1.0.12|https://gcr.io/spectro-images-public/release/spectro-installer:1.0.12|
-------

# Palette CLI

The Palette Command Line Interface (CLI) is a tool that you can use to interact with Palette programmatically. Check out the [Palette CLI](/palette-cli/install-palette-cli) document for installation guidance.  

|Version|Operating System | 
|---|---|
|3.4| TBD|


# Edge CLIs

The following Edge CLIs and Edge Installer images are available to help you deploy an Edge host. Check out the [Edge](/clusters/edge) page to learn more about deploying an Edge Host


## Palette Edge CLI

CLI Version| Operating System |  
-------|---|
v3.3.3 |  [Linux-amd64](https://software.spectrocloud.com/stylus/v3.3.3/cli/linux/palette-edge-installer) |


## Edge Installer Image


|Version|Docker Image| Optical Disk Image (ISO) |
|---|---|--|
|3.3.3     | `gcr.io/spectro-images-public/stylus:v3.3.3`| [ISO](https://software.spectrocloud.com/stylus/v3.3.3/stylus-v3.3.3-amd64.iso) |


## Edge Content CLI

CLI Version| Operating System |
-------|---|
v3.3.3 | [Linux-amd64](https://software.spectrocloud.com/stylus/v3.3.3/cli/linux/palette-edge-content) |
