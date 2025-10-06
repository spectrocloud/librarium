---
sidebar_label: "Edit User Data"
title: "Edit User Data"
description: "Instructions for editing user data in Local UI."
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

The **user-data** file is a YAML file that contains installer configuration for the Palette agent. This file is usually
prepared before the EdgeForge process and is written into the installer ISO in appliance mode deployments. In agent mode
deployments, the user data is provided directly to the agent mode installation script. For more information about
EdgeForge, refer to [EdgeForge Workflow](../../edgeforge-workflow/edgeforge-workflow.md). For more information about
deployment modes, refer to [Deployment Modes](../../../../deployment-modes/deployment-modes.md).

In Local UI, you can interact with your user-data configuration and make updates to it. This is useful for situations in
which you want to modify the user-data before forming a cluster with the Edge hosts. All fields exposed in the form in
Local UI have corresponding parameters in the installer reference. For more information about the fields available in
the installer user data, refer to [Installer Reference](../../edge-configuration/installer-reference.md).

After an edit has been made, the new settings will apply after the host reboots.

## Limitations

- The following fields cannot be edited in Local UI. If you want to specify the values for these parameters, you must
  set them correctly during EdgeForge or provide them to the installation script if you are using agent mode.
  - `stylus.site.deviceUIDPaths`
  - `stylus.site.tagsFromFile`
  - `stylus.site.tagsFromScript`
  - `stylus.site.remoteShell.disable`
  - `stylus.localUI.port`
  - `stylus.includeTui`
  - `stylus.debug`
  - `stylus.featureGate`
  - `stylus.trace`
  - `stylus.disablePasswordUpdate`
  - `stylus.imageRedirectWebhook`
  - `install.bind_mounts`

## Prerequisites

- Set the user-data parameter `stylus.featureGate` to the value `UserDataForm`. This applies to both appliance mode, and
  agent mode. You must set this correctly during EdgeForge or provide them to the installation script if you are using
  agent mode.

  ```yaml {6}
  #cloud-config
  install:
    reboot: false
    poweroff: false
  stylus:
    featureGate: UserDataForm
    managementMode: local
  ```

- Access to [Local UI](./access-console.md).

- Ensure the Local UI host is not assigned to any cluster.

## Edit User Data

1. Log in to Local UI. Refer to [Access Local UI](./access-console.md) for guidance on accessing Local UI.

2. In the upper-right corner of the page, click **Actions** to open the **drop-down Menu**.

3. Click **Configure**.

4. In the pop-up box, you can configure most host settings that are configurable in the installer ISO user data,
   starting with **Basic Information**. You can enter the host's name, which corresponds to `stylus.site.name` in the
   user data file. You may also configure tags for your host, corresponding to `stylus.site.tags`.

5. In the **Network** section, you can configure network interfaces that the host will use to communicate with the
   network environment. Refer to
   [Site Network Parameters](../../edge-configuration/installer-reference.md#site-network-parameters) for more
   information about the network parameters.

   | Field         | Description                                                                                                                                                                                                                         |
   | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Interface     | The name of the network interface that the host will use to communicate with the cluster. You can add multiple network interfaces. This corresponds to the `stylus.site.network.<Interface Name>` field in the installer user data. |
   | Use Static IP | Toggle this switch to specify that your network interface will use static IP. If this field is turned off, your network interface will use Dynamic Host Configuration Protocol (DHCP) to obtain dynamic IPs.                        |
   | IP address    | The IP address of your network interface. This field is only available if you use static IP.                                                                                                                                        |
   | DNS Server    | The IP address of your DNS server. This field is only available if you use static IP.                                                                                                                                               |
   | Gateway       | The IP address of the internet gateway for your network. This field is only available if you use static IP.                                                                                                                         |

6. In the **Palette** section, you can specify the following settings.

   | Field                   | Description                                                                                                                                                                                                                                             |
   | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Cluster Management Mode | This parameter decides whether the cluster is managed centrally by Palette or locally via Local UI. This corresponds to the `stylus.managementMode` parameter. All other fields in this section are only available if you choose **Centrally Managed**. |
   | Endpoint                | The Palette API endpoint that the host will communicate with. This corresponds to the `stylus.site.paletteEndpoint` parameter.                                                                                                                          |
   | Insecure                | Whether a client verifies the server's certificate chain and hostname. This corresponds to the `stylus.site.insecureSkipVerify` parameter.                                                                                                              |
   | Registration Token      | This parameter contains the registration token the host will use to register itself with Palette. This corresponds to the `stylus.site.edgeHostToken` parameter.                                                                                        |
   | Project Name            | This parameter specifies the name of the project that the host is registered in. This corresponds to the `stylus.site.projectName` parameter.                                                                                                           |

7. In the **Advanced Configurations** section, you can configure external registry settings and cloud-init stages for
   your host. If you choose to enable external registries, you will need to provide the domain name of the registry as
   well as the credentials needed to access the registry. For more information about external registries, refer to
   [Deploy Cluster with a Private External Registry](../../site-deployment/deploy-custom-registries/deploy-external-registry.md).

8. You can modify cloud-init configurations in **Advanced Configurations** section. Make any required changes directly
   in the YAML editor. For more information about cloud-init stages, refer to
   [Cloud-init Stages](../../edge-configuration/cloud-init.md).

9. When you are finished, click **Confirm**. The host will need 10 to 15 minutes to reboot and apply your changes.

## Validate

1. Log in to Local UI.

2. Click **Configure**.

3. Confirm that the pre-populated values have been updated to the new values you configured.
