---
sidebar_label: "Sensitive User Data Handling"
title: "Sensitive User Data Handling"
description:
  "Learn how to make the Edge installer skip copying the specific user data stages to the edge hosts so that you can use
  sensitive information in the user data stages."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

Suppose you must add sensitive information, such as credentials, in your `user-data` file. In the Edge deployment
lifecycle, you have two opportunities to apply user data to Edge hosts. The first is during the EdgeForge phase, where
you create the Edge Installer ISO which contains the `user-data` file; the Edge installer will apply the user data
to the Edge host during installation. The second opportunity is during the on-site deployment phase, where you can
provide supplementary user data configurations if needed. The diagram below highlights the two mentioned phases in the
Edge lifecycle.

![A diagram highlighting the two stages in the edge deployment lifecycle where you can apply user data.](/edge_edge-configuration_cloud-init_user-data.webp)

- **EdgeForge Phase** - In the EdgeForge phase, you build the Edge Installer ISO using organization-level
  configurations. The configurations include the installer itself, the user data, and, optionally, a content bundle. You
  boot the Edge hosts using the Edge Installer and apply the configurations. All the configurations, including the user
  data, are copied to the Edge host during installation.

  Once the Edge hosts are prepared with installation, you ship your devices to the site for on-site deployment. Refer to
  the [Installation](../site-deployment/stage.md) guide for more information.

- **On-site Deployment Phase** - In the on-site deployment phase, you use supplementary user data to apply site-specific
  configurations to the Edge hosts. The user data is copied to the Edge host during the installation unless you follow
  the specific naming convention for your user data stages as described below.

Refer to the [Multiple User Data Use Case](../edgeforge-workflow/prepare-user-data.md#multiple-user-data-use-case) guide
to understand the use cases for applying supplementary user data. If you need to apply a supplementary user data, refer
to the [Deploy Edge Hosts On-site](../site-deployment/site-installation/site-installation.md) guide to learn the on-site
deployment process in detail.

In both steps mentioned above, the Edge Installer copies the `user-data` file provided to the `/run/stylus/userdata`
file or the `/oem/userdata` file on the Edge hosts. If you want to prevent some user data stages from getting copied to
the Edge host's storage, you can use a specific naming convention to disable the default copy behavior. However, be
aware that different persistence behaviors apply depending on in which stage of the Edge deployment lifecycle you
provide sensitive data in the `user-data` file. Refer to the
[Sensitive Information in the Site Installation](#sensitive-information-in-the-site-installation) section below to learn
more.

## Sensitive Information During Installation

In the installation step, the Edge Installer copies and persists _all_ your user data stages into the configuration
files on the Edge hosts. Copying sensitive information to the Edge hosts may pose security risks. Therefore, we
recommend you avoid inserting sensitive information in the `user-data` file provided in the installation phase. Use a
supplementary `user-data` file and apply it at the on-site deployment phase.

:::tip

Alternatively, you can use take advantage of our Trusted Boot feature. Trusted Boot ensures that your user data remains
encrypted and cannot be decrypted if the boot process is tempered with. For more information about Trusted Boot, refer
to [Trusted Boot](../trusted-boot/trusted-boot.md).

:::

## Sensitive Information in the Site Installation

If you want to use sensitive information, such as credentials for patching the OS on your Edge hosts, in any user data
stage during the on-site deployment phase, you must use the `skip-copy-[string]` naming convention for your user data
stages. Replace the `[string]` placeholder with any meaningful string per your requirements. The Edge Installer will
skip copying the stages whose name matches the regular expression `skip-copy-*` to the Edge host. The stages will
execute as long as the drive containing the `user-data` file is mounted to the Edge hosts. In most cases, the drive will
be a bootable USB flash drive.

For example, the `skip-copy-subscribe` stage below follows the `skip-copy-[string]` naming convention. Therefore, the
Edge Installer will skip copying the stage to the `/run/stylus/userdata` file or the `/oem/userdata file` on the Edge
host.

```yaml {2, 6}
stages:
  network.after:
    - name: skip-copy-subscribe
      if: [-f "/usr/sbin/subscription-manager"]
      commands:
        - subscription-manager register --username "myname" --password 'mypassword'
```

The stage will execute as long as you have mounted the drive containing the `user-data` file. You must unmount the drive
from the edge host after the device registers with Palette and before you deploy a Kubernetes cluster on the device.
