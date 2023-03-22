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

The Edge Installer supports using a custom configuration file in the format of a YAML that you can use to customize the installation process. You can provide the customized configuration to the Edge Installer as a user data file. 

<br />


<InfoBox>

Review the Edge [Install Configuration](/clusters/edge/edge-configuration/installer-reference) resource to learn more about all the supported configuration parameters you can use in the configuration user data.

</InfoBox>

You can also use the Operating System (OS) pack to apply additional customization using cloud-init stages. Both the Edge Installer configuration file and the OS pack support the usage of cloud-init stages. Refer to the [Cloud-Init Stages](/clusters/edge/edge-configuration/cloud-init) to learn more.


# Multiple User Data Use Case

If you don't need to apply any unique configurations on the device once it arrives at the physical site, then your site deployment flow would look like the following.

![The flow of an install process not requiring additional customization](/clusters_site-deployment_prepare-edge-configuration_install-flow.png)

Should you need to apply different configurations once the device arrives at the physical site, you can use a secondary user data to support this use case.

Use the additional user data to override configurations from the previous user data that was flashed into the device or to inject new configuration settings. Using secondary user data at the physical site is a common pattern for organizations that need to change settings after powering on the Edge host at the physical location.

To use additional user data, create a bootable device, such as a USB stick, that contains the user data in the form of an ISO image. The Edge Installer will consume the additional user data during the installation process.

![The flow of an install process with an additional customization occurring at the physical site. The additional customization is using a USB stick to upload the new user data.](/clusters_site-deployment_prepare-edge-configuration_install-flow-with-more-user-data.png)

When creating your Edge Installer, you can embed the user data into the installer image to eliminate providing it via a USB drive.

In the staging phase, you may identify user data parameter values that apply uniformly to all your edge sites. But you may also have some edge locations that require different configurations such as site network proxy, site certs, users and groups, etc. 
Site-specific configurations are typically not included in the Edge installer image. For the latter scenario, you can use a secondary user data configuration. Refer to the  [Apply Site User Data](/clusters/edge/site-deployment/site-installation/site-user-data) guide to learn more about applying secondary site-specific user data.

<br />

<InfoBox>

For your initial testing, your user data may include global settings and site-specific properties in a single user data. As you gain more experience, you should evaluate whether secondary site-specific user data is a better design for your use case.

</InfoBox>


# User Data Samples

You may encounter the following scenarios when creating an Edge Installer configuration user data file. Use these examples as a starting point to help you create user data configurations that fit your needs. 

## Connected Sites - Multiple User Data Configuration

In this example, two configuration user user data files are used. The first one is used in the staging phase and is included with the Edge Installer image. Note how the first user data contains the registration information and creates a user group. A bootable USB stick applies the second user data at the physical site. The secondary user data includes network configurations specific to the edge location.

**Staging** - included with the Edge Installer.

```yaml
stylus:
  site:
      paletteEndpoint: api.spectrocloud.com
      edgeHostToken: <yourRegistrationToken>
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

**Site** - supplied at the edge location through a bootable USB drive.

```yaml
stylus:
  site:
      projectName: edge-sites
      tags:
          zip-code: 95135
  stages:
    network:
        httpProxy: http://proxy.example.com
        httpsProxy: https://proxy.example.com
        noProxy: 10.10.128.10,10.0.0.0/8    
        nameserver: 1.1.1.1
        interfaces:
            enp0s3:
                type: static
                ipAddress: 10.0.10.25/24
                gateway: 10.0.10.1
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

## Connected Sites - Single User Data

This example configuration is for a *connected site*. Therefore there is no need to specify a network proxy or network certificates.
In this scenario, only a single Edge Installer configuration user data is used for the entire deployment process.

<br />

```yaml
stylus:
  site:
      paletteEndpoint: api.spectrocloud.com
      edgeHostToken: <yourRegistrationToken>
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

## Apply Proxy & Certificate Settings 

This example showcases how you can include network settings in a user data configuration.

```yaml
stylus:
  site:
      paletteEndpoint: api.spectrocloud.com
      edgeHostToken: <yourRegistrationToken>
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

## Load Content From External Registry

In this example, content is downloaded from an external registry.

```yaml
stylus:
  registryCredentials:
    domain: 10.10.254.254:8000/spectro-images
    username: ubuntu
    password: <yourPassword>
    insecure: true
  site:
    debug: true
    insecureSkipVerify: false
    paletteEndpoint: api.console.spectrocloud.com
    name: edge-appliance-1
    caCerts:
      - |
        -----BEGIN CERTIFICATE-----
        
        -----END CERTIFICATE-----
stages:
  initramfs:
    - users:
        kairos:
          groups:
            - sudo
          passwd: kairos
install:
  poweroff: false
```

# Next Steps

The last step of the EdgeForce workflow is to build the Edge artifact. Check out the [Build Images](/clusters/edge/edgeforge-workflow/build-images) guide to learn how to build your images with the Edge Installer Builder CLI and create an Edge artifact.