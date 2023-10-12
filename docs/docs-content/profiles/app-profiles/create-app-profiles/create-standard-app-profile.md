---
sidebar_label: "Create Standard App Profile"
title: "Create a Standard App Profile"
description: "Learn how to create a standard app profile for your Palette Virtual Clusters."
hide_table_of_contents: false
sidebar_position: 5
tags: ["devx", "app mode", "pde", "app profiles"]
---


Use the following steps to create a standard app profile that contains out-of-the-box services such as messaging system, object storage, database, and security services. Review the [Out-of-the-Box Service](/devx/app-profile/services/service-listings/) listing for available services.


:::info

A tutorial is available to help you learn how to use Palette Dev Engine by deploying an application. Check out [Deploy an Application using Palette Dev Engine](../../../devx/apps/deploy-app.md) to get started with Palette Dev Engine.

:::


## Prerequisites

* A Spectro Cloud [account](https://www.spectrocloud.com/get-started/).

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, select **Switch to App Mode**.

3. Select **App Profiles** from the left **Main Menu**.

4. Click the **New App Profile** button. 

5. Provide the following basic information for your app profile and click **Next**.

| **Parameter**           | **Description**  |
|-------------------------|---------------------|
|**App Profile Name** | A custom name for the app profile.|
|**Version** | An optional version number for the new app profile. You only need to specify a version if you create multiple versions of a profile using the same profile name. Default: `1.0.0`. |
|**Description**  | Use the description to provide context about the profile. | 
|**Tag** | Assign any desired profile tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when apps are created from this app profile. Example: `owner` or `region`.|

7. Select one of the available services to start configuring your app profile. Review the [Out-of-the-Box Service](/devx/app-profile/services/service-listings/) listing for available services.

  <!-- :::caution

  When adding a manifest-type layer to an app profile, make sure to specify a namespace. Otherwise, the manifest deployment will be deployed to the `Default` namespace.

  ```yaml
  namespace: <yourNameHere>
  ```
  ::: -->

8. Provide configuration information for the service. For steps to deploy a container service, refer to  

9. You can add more services to the app profile as needed. To do this, click `+` next to the **Configure tier** pane. To rearrange layers in the profile, select a service and drag it up or down in the pane. Each service becomes a layer in the profile stack in the order displayed in this pane.

10. When you have provided the required configuration information for services, click **Review**. 

Your app profile is now created using out-of-the-box servcies and can be deployed.  


## Validate

Use the following steps to validate that your app profile is available and ready for use.

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, switch to **App Mode**.

2. Navigate to the left **Main Menu** and click on **App Profiles**.

3. Select the app profile you created to review its details.

4. Hover your cursor over each app layer to learn more about the layers, including the pack name, version, and registry.

 ![A view of a cursor triggering the info box for each app profile layer.](/devx_app-profile_create-app-profile_app-layer-infoboxes.png)
 
 :::info
 
 Use the tool-tip that displays when you select a layer to gather information required for creating Terraform templates for app profiles. Check out our Terraform registry for [Application Profiles](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/application_profile).
 
 :::

5. Deploy your application to a virtual cluster to verify all the required configurations and dependencies are correct. Review [Create and Manage Apps](../../../devx/apps/create-app.md) to learn how to deploy an app to a virtual cluster. Check out the [Deploy an Application using Palette Dev Engine](../../../devx/apps/deploy-app.md) tutorial for a more in-depth guide.

## Next Steps

Start exploring the various out-of-the-box [services](../../../devx/app-profile/services/services.md) Palette exposes to application authors. Use these services to deploy applications without the overhead of managing and configuring the infrastructure required for common third-party services such as databases, message queues, and more.

## Resources

- [Service Listing](/devx/app-profile/services/service-listings/)

- [Create and Manage Apps](../../../devx/apps/create-app.md)

- [Deploy an Application using Palette Dev Engine](../../../devx/apps/deploy-app.md)