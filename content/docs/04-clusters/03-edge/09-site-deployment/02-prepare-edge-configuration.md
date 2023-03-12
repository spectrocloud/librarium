---
title: "Prepare User Data"
metaTitle: "Prepare Edge Configuration as user data"
metaDescription: "Learn how prepare input for the installation process"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

The Edge Installer supports using a custom configuration file in the format of a YAML that you can use to customize the installation process. You can provide the customized configuration to the Edge Installer as a user-data file. 

You can also use the operating system (OS) pack to apply additional customization using cloud-init stages. Both the Edge Installer configuration file and the OS pack support the usage of cloud-init stages. Refer to the [Cloud-Init Stages](/clusters/edge/edge-configuration/cloud-init) to learn more.

# Prepare User Data

The user-data is prepared by creating a YAML file consisting of OS and Installation config. Create a file called **user-data**. Copy the sample configuration below into the **user-data** file. Update the cloud-init stages and installation configuration to suit your needs.

<br />

```yaml
  stylus:
    site:
      paletteEndpoint: your-tenant.palette.endpoint
      edgeHostToken: youredgehosttoken  
  stages:
    initramfs:
      - users:
          kairos:
            groups:
              - sudo
            passwd: kairos
  install:
    poweroff: true
```

<InfoBox>

Review the [Install Configuration](/clusters/edge/edge-configuration/installer-reference) resource to learn more about all the supported configuration parameters.

</InfoBox>


# Multiple User-Data Usecase

If you don't need to apply any unique configurations on the device once it arrives at the physical site, then your site deployment flow would look like the following.

![The flow of an install process not requiring additional customization](/clusters_site-deployment_prepare-edge-configuration_install-flow.png)

Should you need to apply different configurations once the device arrives at the physical site, you can use a secondary user-data to support this use case.

Use the additional user-data to override configurations from the previous user-data flashed into the device or to inject new configuration settings. Using a secondary user-data at the physical site is a common pattern for organizations that need to change setting once the Edge host is powered on at the physical location.

To use an additional user-data, create a bootable device, such as a USB stick, that contains the user-data in the form of an ISO image. The Edge Installer will consume the additional user-data during the installation process.

![The flow of an install process with an additional customization](/clusters_site-deployment_prepare-edge-configuration_install-flow-with-more-user-data.png)


# Build User Data ISO

Use the following steps to create an ISO file containing the additional user-data. You will load the newly created ISO to a bootable device, such as a USB stick.

## Prerequisites

- A bootable device, such as a USB drive, or a PXE server.

- mkisofs, or genisoimage, or similar ISO management software.

- cdrtools or wodim for Windows


## Create ISO

1. Create a file called **user-data** that contains the additional configurations you want to override or inject. 
  ```shell
  touch user-data
  ```

2. Create an empty **meta-data** file:
  ```shell
  touch meta-data
  ```

3. Create an ISO using the following command.

  MacOS/Linux:
  ```shell
  mkisofs -output site-user-data.iso -volid cidata -joliet -rock user-data meta-data
  ```

  Windows:
  ```shell
  genisoimage -output site-user-data.iso -volid cidata -joliet -rock user-data meta-data
  ```

  This generates an ISO file called site-user-data.iso in the current directory.


Copy the ISO to a bootable device such as a USB stick. Load the USB stick to the Edge host before powering it on once it arrives at the physical site. The Edge Installer will apply the new user-data during the installation process.

<br />

<InfoBox>

You can use several software tools to create a bootable USB drive, such as [balenaEtcher](https://www.balena.io/etcher). For a PXE server, there are open-source projects such as [Fog](https://fogproject.org/download) or [Windows Deployment Services](https://learn.microsoft.com/en-us/windows/deployment/wds-boot-support) for Windows.

</InfoBox>


## Validation

You can validate that the ISO image is not corrupted by attempting to flash a bootable device. Most software that creates a bootable device will validate the ISO image before the flash process. 


# Next Steps

Go ahead and continue to the [Prepare Content Bundle](/clusters/edge/site-deployment/prepare-content-bundle) step. The content bundle contains all the packages and artifacts required for Edge host installation.