---
sidebar_label: "Register Edge Host"
title: "Register Edge Host"
description: "Learn how to register your edge hosts with the Palette Management Console"
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

To use an Edge host with a host cluster, you must first register it with Palette. A registration token in the user data
is required to complete the registration process. You have the following options to register the Edge host with Palette.

| **Method**          | **Description**                                                                                                                                                 | **Set up Effort** |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Auto Registration   | Edge hosts can automatically register with Palette through a _Registration Token_. This method requires you to specify the registration token in the user data. | Low               |
| Manual Registration | You can manually enter a unique Edge host ID in Palette.                                                                                                        | Low               |

:::warning

A registration token is required for the Edge host registration process. Without the registration token, the
registration process will be unable to complete. Review the [Create Registration Token](create-registration-token.md)
guide for steps on how to create a tenant registration token.

:::

## Registration Method

To register the Edge host, you are required to use a registration token with all three registration options. Edge hosts
are registered under the default project chosen for the registration token. You can override the default project by
specifying the project in the Edge Installer [user data](../../edge-configuration/installer-reference.md) configuration
file.

By default, devices automatically register during the site installation process when a tenant registration token value
is present. Set the parameter `disableAutoRegister` to `true` in the Edge Installer configuration to disable auto
registration and require manual device registration.

<br />

```yaml
stylus:
  site:
    edgeHostToken: MjBhNTQxYzZjZTViNGFhM2RlYTU3ZXXXXXXXXXX
    disableAutoRegister: true
```

<br />

Select the registration method that best fits your organizational needs and review the steps to get started.

- [Auto Registration](#auto-registration)

- [Manual Registration](#manual-registration)

- [QR Code Registration](#qr-code-registration)

### Auto Registration

You can automate the registration process by using registration tokens.

If you selected a default project for the registration token, that is the project the Edge host will be registered
under. You can override the default project by providing a project name in the user data.

<br />

```yaml
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    edgeHostToken: yourEdgeRegistrationTokenHere
```

#### Prerequisites

- Tenant admin access.

- A tenant registration token is required. Refer to the [Create a Registration Token](create-registration-token.md)
  guide for more information.

#### Create Registration Token

To create a registration token, use the following steps.

<br />

1. Log into [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Switch to the tenant scope.

3. Navigate to the left **Main Menu** and select **Settings**.

4. Select **Registration Tokens** in the **Tenant Settings Menu**.

5. Click **Add New Registration Token**.

6. Fill out the input fields and **Confirm** your changes.

7. Save the **Token** value.

Your next step is to decide how you want to provide the registration token. You can include the registration token in
the user data added to the device before shipping. Or you can create a user data ISO and have the registration token in
the secondary user data. Check out the [Apply Site User Data](site-user-data.md) resource to learn more about creating
site-specific user data.

#### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the **Edge Hosts** tab.

Your Edge host is displayed and marked as **Registered** in the Edge hosts list.

### Manual Registration

In this mode, you must manually register the Edge host in Palette by providing the Edge host's unique identifier.
Optionally, you can specify a project name to associate the Edge host with a particular project.

Use the following steps to manually register an Edge host in Palette.

#### Prerequisites

- Tenant admin access

- A tenant registration token is required. Refer to the [Create a Registration Token](create-registration-token.md)
  guide for more information.

- Access to the Edge host's unique identifier. You can get the unique identifier or machine ID from the console output
  as the Edge host powers on. The Edge host unique identifier has the default prefix `edge-`. Example Output:
  ```shell
  time="2022-11-03T11:30:10Z" level=info Msg="starting stylus reset plugin"
  time="2022-11-03T11:30:102" level=info Msg="reset cached site name from uuid, cached: edge-03163342f7f0e6fe20de095ed8548c93"
  time="2022-11-03T11:30:102" level=info Msg="reset cached site name from unid, new: edge-9e8e3342bafa9eb6d45f81c1f6714ea2" MachineD: edge-9eBe3342bafaeb6d45f81c1fb714ea2
  time="2022-11-03T11:30:192" level=info Msg="MachineIP: 10.239.10.145"
  ```

:::info

     You can also specify an Edge host's unique identifier in the user data by using the `stylus.site.Name` parameter. Refer to the [Installer Configuration](../../edge-configuration/installer-reference.md) resource to learn more about available configuration parameters.

:::

#### Register the Edge Host in Palette

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the **Edge Hosts** tab.

4. Click on **Add Edge Hosts**.

5. Paste the Edge host's unique identifier in the **Edge Host IDs** input box.

6. Specify any tags or pairing keys if you desire.

7. Confirm your changes to register the Edge host.

#### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the **Edge Hosts** tab.

Your Edge host is displayed and marked as **Registered** in the Edge hosts list.

## Next Steps

The next step in the installation process is to add the Edge host to a cluster or to create an Edge Native host cluster.
Check out the [Create Cluster Definition](cluster-deployment.md) guide to complete the last step of the installation
process.
