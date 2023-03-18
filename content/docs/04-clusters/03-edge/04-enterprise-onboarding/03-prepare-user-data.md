---
title: "Prepare User Data"
metaTitle: "Prepare User Data - Stage user data"
metaDescription: "Learn about building your staging user data"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

 You can provide the customized configuration to the Edge Installer as a user data file.

<InfoBox>

Review the Edge [Install Configuration](/clusters/edge/edge-configuration/installer-reference) resource to learn more about all the supported configuration parameters you can use in the configuration user data.

</InfoBox>

# Multiple User Data Use Case

If you don't need to apply any unique configurations on the device once it arrives at the physical site, then your site deployment flow would look like the following.

![The flow of an install process not requiring additional customization](/clusters_site-deployment_prepare-edge-configuration_install-flow.png)

Should you need to apply different configurations once the device arrives at the physical site, you can use a secondary user data to support this use case.

Use the additional user data to override configurations from the previous user data that was flashed into the device or to inject new configuration settings. Using secondary user data at the physical site is a common pattern for organizations that need to change settings after powering on the Edge host at the physical location.

To use additional user data, create a bootable device, such as a USB stick, that contains the user data in the form of an ISO image. The Edge Installer will consume the additional user data during the installation process.

![The flow of an install process with an additional customization occurring at the physical site. The additional customization is using a USB stick to upload the new user data.](/clusters_site-deployment_prepare-edge-configuration_install-flow-with-more-user-data.png)

When building enterprise installer, you can choose to embedd the user-data into the installer itself, to eliminate having to provide it via a USB drive. Typically at this step, you are preparing Staging User data, that uniformly applies to all your edge sites. Site specific User data that includes properties such as site proxy, site certs, etc. is typically not included in the installer. However, you needs may vary based on use cases. For initial test, as an example, you might be biulding user-data that includes general as well as site specific properties.

User Data is prepared as YAML files. Following are a few samples for various scenarios.

# Connected Sites (no proxy, certs) - Staging and Site

Staging

```yaml
    #cloud-config
    stylus:
    site:
        paletteEndpoint: api.spectrocloud.com
        edgeHostToken: aUAxxxxxxxxx0ChYCrO
        tags:
        city: chicago
        building: building-1
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

Site

```yaml
    stylus:
    site:
        projectName: edge-sites
        tags:
        zip-code: 95135
```

# Connected Sites (no proxy, certs) - Combined

```yaml
    #cloud-config
    stylus:
    site:
        paletteEndpoint: api.spectrocloud.com
        edgeHostToken: aUAxxxxxxxxx0ChYCrO
        projectName: edge-sites
        tags:
        city: chicago
        building: building-1
        zip-code: 95135
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

# Connected via proxy & certs; Static IP

```yaml
    #cloud-config
    stylus:
    site:
        paletteEndpoint: api.spectrocloud.com
        edgeHostToken: aUAxxxxxxxxx0ChYCrO
        projectName: edge-sites
        tags:
        city: chicago
        building: building-1
        zip-code: 95135
    stages:
    initramfs:
        - users:
            kairos:
            groups:
                - sudo
            passwd: kairos
    install:
    poweroff: true

    network:
        httpProxy: http://proxy.example.com
        httpsProxy: https://proxy.example.com
        noProxy: 10.10.128.10,10.0.0.0/8    
        nameserver: 1.1.1.1
        # configure interface specific info. If omitted all interfaces will default to dhcp
        interfaces:
            enp0s3:
                # type of network dhcp or static
                type: static
                # Ip address including the mask bits
                ipAddress: 10.0.10.25/24
                # Gateway for the static ip.
                gateway: 10.0.10.1
                # interface specific nameserver
                nameserver: 10.10.128.8
            enp0s4:
                type: dhcp 
        caCerts:
        - |
            ------BEGIN CERTIFICATE------
            *****************************
            *****************************
            ------END CERTIFICATE------
        - |
            ------BEGIN CERTIFICATE------
            *****************************
            *****************************
            ------END CERTIFICATE-----
```
