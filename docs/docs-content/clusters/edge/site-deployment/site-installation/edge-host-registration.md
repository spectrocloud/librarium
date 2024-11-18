---
sidebar_label: "Register Edge Host"
title: "Register Edge Host"
description: "Learn how to register your edge hosts with the Palette Management Console"
hide_table_of_contents: false
sidebar_position: 20
tags: ["edge"]
---

To use an Edge host with a host cluster, you must first register it with Palette. A registration token in the user data
is required to complete the registration process. Review the [Create Registration Token](create-registration-token.md)
guide for steps on how to create a tenant registration token.

You have the following options to register the Edge host with Palette.

:::warning

If you using an Edge host that was previously registered with Palette, ensure that you delete the Edge host from your
Palette account first before attempting Edge host registration. Otherwise, the registration will fail due to duplicate
Edge host IDs.

:::

| **Method**          | **Description**                                                                                                                                                                                                                               | **Set up Effort** |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Auto Registration   | Edge hosts can automatically register with Palette through a _Registration Token_. This method requires you to specify the registration token in the user data.                                                                               | Low               |
| Manual Registration | You can manually enter a unique Edge host ID in Palette.                                                                                                                                                                                      | Low               |
| QR Code             | Scan a QR code that takes you to a web application that registers the Edge host with Palette. This method is considered advanced with the benefit of simplifying the Edge host registration without needing a tenant token or a manual entry. | High              |

## Registration Method

To register the Edge host, you are required to use a registration token with all three registration options. Edge hosts
are registered under the default project chosen for the registration token. You can override the default project by
specifying the project in the Edge Installer [user data](../../edge-configuration/installer-reference.md) configuration
file.

By default, devices automatically register during the on-site deployment process when a tenant registration token value
is present. Set the parameter `disableAutoRegister` to `true` in the Edge Installer configuration to disable auto
registration and require manual device registration.

```yaml
stylus:
  site:
    edgeHostToken: MjBhNTQxYzZjZTViNGFhM2RlYTU3ZXXXXXXXXXX
    disableAutoRegister: true
```

Select the registration method that best fits your organizational needs and review the steps to get started.

- [Auto Registration](#auto-registration)

- [Manual Registration](#manual-registration)

### Auto Registration

When your Edge host powers up after installation, the Edge host will attempt to register itself with Palette
automatically.

If you selected a default project for the registration token, that is the project the Edge host will be registered
under. You can override the default project by providing a project name in the user data.

```yaml
stylus:
  site:
    paletteEndpoint: api.spectrocloud.com
    edgeHostToken: **********
    projectName: demo-project
```

#### Prerequisites

- An Edge host with Palette Edge installed. For more information, refer to [Installation](../stage.md).

- The Edge host has a connection to your Palette instance. If you are using Palette SaaS, this means the Edge host must
  have an internet connection.

- You have provided the registration token in one of the following ways. For more information about creating
  registration tokens, refer to the [Create a Registration Token](create-registration-token.md) guide.
  - In the **user-data** file used to build the Edge installer ISO during Edge. For more information, refer to
    [Build Edge Artifacts](../../edgeforge-workflow/palette-canvos/palette-canvos.md).
  - In the site user data. This is a second **user-data** file you can provide to complement or overwrite the initial
    user data. For more information, refer to [Apply Site User Data](./site-user-data.md).

#### Instructions

1. If you have already provided the registration token to your Edge host, skip this step.

   If you are providing the Edge registration token through site user data. Plug in the storage device that is flashed
   with the user data ISO.

2. Power on the Edge device. Let Palette Edge choose the boot option automatically from the GRand Unified Bootloader
   (GRUB) menu.

3. The Edge host will boot to the registration screen and register itself with Palette automatically.

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

- An Edge host with Palette Edge installed. For more information, refer to [Installation](../stage.md).

- The Edge host has a connection to your Palette instance. If you are using Palette SaaS, this means the Edge host must
  have an internet connection.

- You have provided the registration token in one of the following ways. For more information about creating
  registration tokens, refer to the [Create a Registration Token](create-registration-token.md) guide.

  - In the **user-data** file used to build the Edge installer ISO during Edge. For more information, refer to
    [Build Edge Artifacts](../../edgeforge-workflow/palette-canvos/palette-canvos.md).
  - In the site user data. This is a second **user-data** file you can provide to complement or overwrite the initial
    user data. For more information, refer to [Apply Site User Data](./site-user-data.md).

- Access to the Edge host's unique identifier. You can get the unique identifier or machine ID from the console output
  as the Edge host powers on. The Edge host unique identifier has the default prefix `edge-`. Example Output:

  ```shell
  time="2022-11-03T11:30:10Z" level=info Msg="starting stylus reset plugin"
  time="2022-11-03T11:30:102" level=info Msg="reset cached site name from uuid, cached: edge-03163342f7f0e6fe20de095ed8548c93"
  time="2022-11-03T11:30:102" level=info Msg="reset cached site name from unid, new: edge-9e8e3342bafa9eb6d45f81c1f6714ea2" MachineD: edge-9eBe3342bafaeb6d45f81c1fb714ea2
  time="2022-11-03T11:30:192" level=info Msg="MachineIP: 10.239.10.145"
  ```

:::info

You can also specify an Edge host's unique identifier in the user data by using the `stylus.site.Name` parameter. Refer
to the [Installer Configuration](../../edge-configuration/installer-reference.md) resource to learn more about available
configuration parameters.

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

### QR Code Registration

You can provide a QR case-based automated registration to simplify the registration process. Upon boot up, a QR code is
displayed on the Edge host's console if enabled during the installation phase.

Site operators scan the QR code to visit the registration page. This web page pre-populates the Edge host's unique ID in
the web app and provides a list of edge sites they can associate with this edge host.

Site operators can select a site and submit a registration request. The web application automatically creates the Edge
host entry in Palette and defines a cluster with that Edge host. This workflow also supports adding Edge hosts to an
existing host cluster.

#### Prerequisites

- Access to the Spectro Cloud GitHub repository that hosts the Palette Edge Registration App. Contact our sales team at
  [sales@spectrocloud.com](mailto:sales@spectrocloud.com) to gain access.

- Sufficient permissions to enable third-party integrations with a GitHub repository.

- A [Vercel](https://vercel.com/) account or a similar serverless website hosting service.

- Experience deploying and maintaining web applications to serverless website hosting services.

- git v2.39.0 or greater.

#### Enable Palette Edge Registration App

We provide you with a sample serverless application, the Palette Edge Registration App. The Palette Edge Registration
App is built on Next.js and deployed using the Vercel platform.

Use the following steps to enable this workflow.

1. Contact [Spectro Cloud Support](mailto:support@spectrocloud.com) for access to the Palette Edge Registration App
   repository. Clone the repository.

2. Configure Vercel or your hosting provider to [automatically deploy](https://vercel.com/docs/concepts/deployments/git)
   pull requests against the main branch.

3. Update the sample site provided with your site names and locations. Make the required changes in the
   **pages/index.js** file. The **readme** file provides additional details about the files to be changed and
   instructions on how to build and test the application locally.

4. Map the infrastructure and add-on cluster profiles to be used with each site. Refer to the
   [Model Edge Native Cluster Profile](../model-profile.md) to learn more about Edge Native cluster profiles.

5. Specify site-specific Virtual IP (VIP) addresses or DNS values for each site.

6. Compile and test the code locally.

7. Create GitHub pull request towards your main branch to automatically trigger the build process and deploy the app.

8. Provide the URL of the deployed app to the Edge Installer user data. Use the `stylus.site.registrationURL` parameter.

   ```yaml
   stylus:
     site:
       paletteEndpoint: api.spectrocloud.com
       registrationURL: https://example-url.com
   ```

9. Your next step is to decide how you want to provide the registration URL value. You can include the registration URL
   in the user data added to the device before shipping. Or you can create a user data ISO and have the registration URL
   in the secondary user data. Check out the [Perform Site Install](site-user-data.md) to learn more about creating site
   specific user data.

10. Power on the Edge host device and scan the QR code.

11. Fill out the required information in the web application and submit the registration request.

#### Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Select the **Edge Hosts** tab.

Your Edge host is displayed and marked as **Registered** in the Edge hosts list.

## Next Steps

The next step in the installation process is to add the Edge host to a cluster or to create an Edge Native host cluster.
Check out the [Create Cluster Definition](../cluster-deployment.md) guide to complete the last step of the installation
process.
