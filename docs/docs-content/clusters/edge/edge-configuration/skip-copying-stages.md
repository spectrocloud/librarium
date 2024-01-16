---
sidebar_label: "Sensitive User Data Handling"
title: "Sensitive User Data Handling"
description: "Learn how to make the Edge installer skip copying the specific user data stages to the edge hosts so that you can use sensitive information in the user data stages."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

Suppose you must add sensitive information, such as credentials, in your user data configuration file. In the Edge deployment lifecycle, you have two opportunities to apply user data to edge hosts. The first is during the staging phase, where you add the Edge installer to the Edge host. The second opportunity is during the site installation phase, where you can provide supplementary user-data configurations if needed. The diagram below highlights the two mentioned phases in the Edge lifecycle.

![A diagram highlighting the two stages in the edge deployment lifecycle where you can apply user data.](/edge_edge-configuration_cloud-init_user-data.png)

- **Staging Phase** - In the staging phase, you prepare your edge hosts using the organization-level configurations. The configurations include the Edge Installer, the user data, and, optionally, a content bundle. You boot the edge hosts using the Edge Installer and apply the configurations. All the configurations, including the user data, are copied to the edge host during installation.

  Once the edge hosts are prepared with the initial installation, you ship your devices to the site for installation. This step is also called the _installer handoff_ step. Refer to the [Prepare Edge Host](../site-deployment/stage.md#prepare-edge-host) guide to learn more about driving the installer handoff step.

- **Site Installation Phase** - In the site installation phase, you use supplementary user data to apply site-specific configurations to the edge hosts. The user data is copied to the edge host during the installation unless you follow the specific naming convention for your user data stages as described below.

Refer to the [Multiple User Data Use Case](../edgeforge-workflow/prepare-user-data.md#multiple-user-data-use-case) guide to understand the use cases for applying supplementary user data. If you need to apply a supplementary user data, refer to the [Perform Site Install](../site-deployment/site-installation/site-installation.md) guide to learn the site installation process in detail.

In both steps mentioned above, the Edge Installer copies the user data configuration file provided to the **/run/stylus/userdata** file or the **/oem/userdata** file on the edge hosts. If you want to prevent some user data stages from getting copied to the edge host's storage, you can use a specific naming convention to disable the default copy behavior. However, be aware that different persistence behaviors apply depending on which stage of the Edge deployment life cycle you provide sensitive data in the user data configuration file. Refer to the [Sensitive Information in the Site Installation](#sensitive-information-in-the-site-installation) section below to learn more.
<br />

## Sensitive Information in the Installer Handoff

:::warning

We do not recommend inserting sensitive information in the user data configuration file provided in the installer handoff phase. Use a supplementary user data configuration file and apply it at the site installation phase.

:::

In the installer handoff step, the Edge Installer copies and persists _all_ your user data stages into the configuration files on the edge hosts. Copying sensitive information to the edge hosts may pose security risks. Therefore, we recommend you avoid inserting sensitive information in the user data configuration file provided in the installer handoff phase. Use a supplementary user data configuration file and apply it at the site installation phase.

<br />

## Sensitive Information in the Site Installation

If you want to use sensitive information, such as credentials for patching the OS on your edge hosts, in any user data stage during the site installation phase. In such scenarios, you must use the `skip-copy-[string]` naming convention for your user data stages. Replace the `[string]` placeholder with any meaningful string per your requirements. The Edge Installer will skip copying the stages whose name matches the regular expression `skip-copy-*` to the edge host. The stages will execute as long as the drive containing the user data configuration file is mounted to the edge hosts. In most cases, the drive will be a bootable USB flash drive.

For example, the `skip-copy-subscribe` stage below follows the `skip-copy-[string]` naming convention. Therefore, the Edge Installer will skip copying the stage to the **/run/stylus/userdata** file or the **/oem/userdata** file on the edge host. The stage and the sensitive information below are marked with the points of interest 1 and 2, respectively.
<br />

<PointsOfInterest
points={[
{
x: 300,
y: 95,
label: 2,
description: "This stage follows the `skip-copy-[string]` naming convention. Therefore, the Edge Installer will skip copying the stage to the edge host.",
tooltipPlacement: "rightTop",
},
{
x: 95,
y: 30,
label: 1,
description: "You can transmit a sensitive information, such as credentials, in the stages section.",
}
]}

>

```yaml
stages:
  network.after:
    - name: skip-copy-subscribe
      if: [-f "/usr/sbin/subscription-manager"]
      commands:
        - subscription-manager register --username "myname" --password 'mypassword'
```

</PointsOfInterest>

The stage will execute as long as you have mounted the drive containing the user data configuration file. You must unmount the drive from the edge host after the device registers with Palette and before you deploy a Kubernetes cluster on the device.
