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

You can also use an additional user-data file to customize the installation once the device is on the physical site. You can use the additional user-data to override configurations from the previous user-data flashed into the device or to inject new configuration settings. Using user-data at the physical site is a common pattern for organizations that need to change setting once the Edge host is powered on at the physical location.

To use an additional user-data, create a bootable device, such as a USB stick that contains the user-data in the form of an ISO image. The Edge Installer will consume the additional user-data during the installation process.


## Build User Data ISO

In order to supply user-data as input during install, we will build an ISO file from our user-data so that it can be trasferred onto a portable device such as a USB drive.

Run the following command to generate user-data ISO

(MacOS or Linux Machine):

```
touch meta-data
mkisofs -output site-user-data.iso -volid cidata -joliet -rock user-data meta-data
```

This command will generate the site-user-data.iso file. Tasnfer this over the a USB drive.
