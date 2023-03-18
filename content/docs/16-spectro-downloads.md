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


# On-Prem

You can deploy a self-hosted flavor of Palette to your own environment. The following resources are available for self-hosted environments.

## On-Prem Installer 

This is the Palette installer for a self-host flavor of Palette. Refer to the [On-Premise Installation](/enterprise-version) to learn more.

|Version|URL|
|--|---|
|2.6.0|[Link](https://vmwaregoldenimage-console.s3.amazonaws.com/hubble-installer-260.ova)|
|2.5.0|[Link](https://vmwaregoldenimage-console.s3.amazonaws.com/hubble-installer-250.ova)|
------


## Air-Gapped Installation

You can install Palette in a VMware environment with no internet connection. Use the following resources to support an air-gapped environment.

## Latest Air-Gapped OVA

|Version|URL|
|---|---|
|2.2.0|[Link](https://vmwaregoldenimage-console.s3.amazonaws.com/spectro-airgap-v2.2.0.ova)|
------

## Air-Gapped Binaries

Download and execute the version-specific binary

<br />


```shell
export VERSION=1.14.3
curl --user spectro:PASSWORD  https://scar.console.spectrocloud.com/airgap/packs/airgap-v${VERSION}.bin -o airgap-v${VERSION}.bin
chmod 755 ./airgap-v${VERSION}.bin
./airgap-v${VERSION}.bin
```

# SAAS - Private Cloud Gateway(PCG)


Palette support on-prem environments through the Private Cloud Gateway (PCG) component. PCG provides support for isolated private cloud or data center environments. When installed on-prem, PCG registers itself with Palette, allowing for secure communication between the SaaS portal and the private cloud environment. The gateway also enables end-to-end lifecycle management of Kubernetes clusters in private cloud environments directly from the SaaS portal. 

## vSphere PCG Image

|Version|URL|
|---|---|
|1.6.0|https://vmwaregoldenimage.s3.amazonaws.com/gateway-installer-160.ova|
|1.4.0|https://vmwaregoldenimage.s3.amazonaws.com/gateway-installer-140.ova|
------

## MAAS PCG Image

|Version|URL|
|---|---|
|1.0.12|https://gcr.io/spectro-images-public/release/spectro-installer:1.0.12|
---------

## OpenStack PCG Image

|Version|URL|Info|
|---|---|
|1.0.12|https://gcr.io/spectro-images-public/release/spectro-installer:1.0.12|
-------


