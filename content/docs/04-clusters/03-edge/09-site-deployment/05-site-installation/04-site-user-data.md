---
title: "Apply Site User Data"
metaTitle: "Site User Data"
metaDescription: "Learn how to create a secondary Edge Installer configuration user data."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

You can provide site-specific Edge Installer configuration user data if you need to apply new values or override default values from the Edge Installer user data you created in the [Prepare Edge Hosts for Installation](/clusters/edge/site-deployment/stage) step or, as often referenced, the *Installer Handoff* phase.

Use the following steps to create an ISO file containing the additional user data. You will load the newly created ISO to a bootable device, such as a USB stick.

## Prerequisites

- A bootable device such as a USB drive, or a Preboot Execution Environment (PXE) server.

- `mkisofs`, or `genisoimage`, or similar ISO management software.

- `cdrtools` or `wodim` for Windows.

## Create ISO

1. Create a file called **user-data** that contains the additional configurations you want to override or inject.

    <br />

  ```shell
  touch user data
  ```

2. Create an empty **meta-data** file:

  <br />

  ```shell
  touch meta-data
  ```

3. Create an ISO using the following command.

  MacOS/Linux:

  ```shell
  mkisofs -output site-user data.iso -volid cidata -joliet -rock user data meta-data
  ```

  Windows:

  ```shell
  genisoimage -output site-user data.iso -volid cidata -joliet -rock user data meta-data
  ```

  This generates an ISO file called site-user data.iso in the current directory.
  <br />

4. Copy the ISO to a bootable device such as a USB drive. 
   
   <br />

   <InfoBox>

    You can use several software tools to create a bootable USB drive, such as [balenaEtcher](https://www.balena.io/etcher). For a PXE server, there are open-source projects such as [Fog](https://fogproject.org/download) or [Windows Deployment Services](https://learn.microsoft.com/en-us/windows/deployment/wds-boot-support) for Windows.

   </InfoBox>


5. Once the Edge host arrives at the physical site. Load the USB drive to the Edge host before powering it on. The Edge Installer will apply the new user data during the installation process.

<br />



## Validation

You can validate that the ISO image is not corrupted by attempting to flash a bootable device. Most software that creates a bootable device will validate the ISO image before the flash process.

# Next Steps

The next stage in the Edge host site installation process is registering the Edge host. Go ahead and review the instructions in the [Register Edge Host](/clusters/edge/site-deployment/site-installation/edge-host-registration) guide.