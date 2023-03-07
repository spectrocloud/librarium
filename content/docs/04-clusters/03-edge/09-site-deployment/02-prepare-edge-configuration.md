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

As previously described, edge configuration consisting of OS configuration as well as installtion configuration can be supplied during the installation process. This configruation can be combined together and provided as user-data.

# Prepare User Data

User Data is preapred by creating a YAML file consisting of OS and Installation config. Create an file called user-data as specfied below. Update the cloud-init stages and installation configuration to suit your needs.

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

If you will be customizing your installer, then you have the option of embedding the user-data into your custom installer. If that is the case, the next step is not required.

# Build User Data ISO

In order to supply user-data as input during install, we will build an ISO file from our user-data so that it can be trasferred onto a portable device such as a USB drive.

Run the following command to generate user-data ISO

(MacOS or Linux Machine):

```
touch meta-data
mkisofs -output site-user-data.iso -volid cidata -joliet -rock user-data meta-data
```

This command will generate the site-user-data.iso file. Tasnfer this over the a USB drive.
