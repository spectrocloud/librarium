---
sidebar_label: "Install Configuration"
title: "Install Configuration"
description: "Learn about the possible Palette Edge install configurations available."
hide_table_of_contents: false
tags: ["edge"]
---

The Edge Installer is responsible for preparing the Edge host to be ready for assignment to cluster workloads. The Edge
Installer supports the ability to specify a configuration file named `user-data`. You can use this configuration file
to customize the installation and ensure your Edge host has all the required dependencies and settings to work properly
in your environment. For more information about all the available parameters in the installer configuration, refer to
[Installer Reference](./installer-reference.md).

To better understand the Edge installation process, review the order of operations from installation to Edge host
registration.

### Order of Operations

1. Boot device with Edge Installer.

2. Edge Installer installs Palette Edge onto the Edge host.

3. Device powers off or reboots to registration mode based on the user data configuration.

4. Upon boot up or reboot, cloud-init stages that are specified in the `user-data` file take effect.

5. Edge Host Registers with Palette and is ready to be part of a cluster.

![The boot order sequence, listing steps that flow in a sequential order.](/clusters_edge_cloud-init_boot-order-squence.webp)

Palette Edge allows you to use cloud-init stages to declaratively configure your Operating System (OS) of your Edge host
both using the installer configuration `user-data` file and in the OS pack. For more information about cloud-init stages, refer
to [Cloud-init Stages](./cloud-init.md).

## Edge Installer Configuration

The Edge installation process expects you to specify installation parameters. You can supply the install parameters in
multiple stages. You can provide common installation configurations during EdgeForge for all your sites during the
manufacturing or provide site-specific configuration during on-site deployment. For more information, refer to
[Prepare User Data](../edgeforge-workflow/prepare-user-data.md) and
[Apply Site User Data](../site-deployment/site-installation/site-user-data.md). The install configurations provided in
various stages are merged to create the Edge host's final configuration.

## Installer Example Configuration

The following example shows how the `user-data` file is used to customize the Edge host installation process.

```yaml
#cloud-config
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    edgeHostToken: yourEdgeRegistrationTokenHere
    projectUid: 12345677788
    tags:
      env: east
      terraform_managed: true
      os: ubuntu
    name: edge-59d3f182-35fe-4e10-b0a0-d7f761f1a142

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
        ------END CERTIFICATE------
```

:::info

Check out the [Prepare User Data](../edgeforge-workflow/prepare-user-data.md) resource for more examples.

:::

## Additional Configurations

The Edge Installer will honor other Kairos parameters, such as `install`, and `options`. To learn more about Kairos
parameters, refer to the [Kairos configuration](https://kairos.io/docs/reference/configuration/) page.

The following is an example Edge installer configuration that is using the `install` parameter block to power off the
device upon completion of the installation process.

```yaml
#cloud-config
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    registrationURL: https://edge-registration.vercel.app
    projectUid: yourProjectIdHere
    edgeHostToken: yourEdgeRegistrationTokenHere
    tags:
      myTag: myValue
      myOtherTag: myOtherValue
    tagsFromScript:
      scriptName: /etc/palette/tags.sh
      timeout: 30
  reboot: false

stages:
  initramfs:
    - users:
        palette:
          groups:
            - sudo
          passwd: palette
      name: Create Palette user

install:
  poweroff: true
```

## Resources

- [Cloud-Init Stages](cloud-init.md)

- [Edge Install Configuration](installer-reference.md)
