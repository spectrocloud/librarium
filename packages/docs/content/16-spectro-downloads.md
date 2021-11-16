---
title: "Downloads"
metaTitle: "Spectro Downloads Artifacts"
metaDescription: "Spectro Cloud Artifacts Downloads "
icon: "cloud-download-alt"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";



# PALETTE DYNAMIC ARTIFACTS


# ON-PREM ARTIFACTS

Spectro Cloud Palette allows its deployment to be done in-house within the customer’s enterprise IT infrastructure. As of now, we support customers’ on-prem VMware vSphere. Therefore, the palette artifacts for the On-Prem installation are included in this section.

# Hubble Installer 

The Palette Quickstart and Enterprise Mode on-prem installations are highly available installations of the Spectro Cloud platform. Installation of these modes involves instantiating the on-prem platform installer VM and invoking the "Enterprise Cluster Migration" wizard. As a prerequisite, download the platform installer OVA given below:

|Version|URL|Info|
|--|---|--|
|2.0.2|Hubble-installer-202-10152021.ova|Oct 15 2021|
------


# Air Gapped Installation

We support the installation of our management platform on VMware environments that have no direct or indirect connectivity to the outside world. The following artifacts and binaries are typically downloaded for the installation and subsequent tenant cluster deployment.

## Latest Air Gapped OVA

|Version|URL|Info|
|---|---|--|
|2.0.1|airgap-v1.14.27.bin|Sep 21, 2021|
------

## Air Gapped Binaries
Download and execute the version-specific binary

```json
export VERSION=1.14.3
curl --user spectro:sTMZiXqJumMU2J  https://scar.console.spectrocloud.com/airgap/packs/airgap-v${VERSION}.bin -o airgap-v${VERSION}.bin
chmod 755 ./airgap-v${VERSION}.bin
./airgap-v${VERSION}.bin
```

# SAAS - Private Cloud Gateway(PCG)
 PCG is Palette's on-prem component to enable support for isolated private cloud or datacenter environments. Spectro Cloud Gateway, once installed on-prem, registers itself with Spectro Cloud's SaaS portal and enables secure communication between the SaaS portal and the private cloud environment. In addition, the gateway enables installation and end-to-end lifecycle management of Kubernetes clusters in private cloud environments from our SaaS portal. Currently, PCG installation is required for the following platforms:


## vSphere PCG Image

|Version|URL|Info|
|---|---|--|
|2.0.2|hubble-installer-202-10152021.ova|Oct 15 2021|
------

## MaaS PCG Image

|Version|URL|Info|
|---|---|--|
|1.0.9|gcr.io/spectro-images-public/release/spectro-installer:1.0.9|Oct 15 2021|
---------

## OpenStack PCG Image

|Version|URL|Info|
|---|---|--|
|1.0.9|gcr.io/spectro-images-public/release/spectro-installer:1.0.9|Oct 15 2021|
-------


