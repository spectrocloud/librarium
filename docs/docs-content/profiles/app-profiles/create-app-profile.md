---
sidebar_label: "Create an App Profile"
title: "Create an App Profile"
description: "Learn how to create an app profile in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["profiles", "app profiles"]
---


You can create as many app profiles as needed for your Palette Virtual Cluster workloads. Each app profile can contain multiple services, also called layers, in the app profile stack. You can also create multiple versions of an App Profile. Refer to [Version an App Profile](version-app-profile.md) for more information. 

Create an infrastructure profile by adding core infrastructure layers (OS, Kubernetes, Network, and Storage).

Use the following steps to create an App Profile.

:::info

A tutorial is available to help you learn how to use Palette Dev Engine by deploying an application. Check out [Deploy an Application using Palette Dev Engine](../../devx/apps/deploy-app.md) to get started with Palette Dev Engine.

:::


## Prerequisites

* A Spectro Cloud [account](https://www.spectrocloud.com/get-started/).

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. On the right side of the window, click on the **User Menu**.

3. Select **Switch to App Mode** from the **drop-down Menu**.

4. From the **Main Menu**, click on **App Profiles**.

5. Click the **New App Profile** button. 

6. Provide the following basic information for your App Profile and click **Next**.

| **Parameter**           | **Description**  |
|-------------------------|---------------------|
|Application Profile Name | A custom name for the app profile.|
|Version (optional) | The default value is 1.0.0. You can create multiple versions of an App Profile using the format **`major.minor.patch`**.  |
|Description (optional)   | Description of the app profile. | 
|Tag (optional)           | Assign tags to the app profile.|

7. Select one of the available services to start configuring your app profile. Refer to the [Service Listings](/devx/app-profile/services/service-listings/) reference for a list of available services. <<< or is it /devx/app-profile/services ? >>> 

  :::caution

  When adding a manifest-type layer to an app profile, make sure to specify a namespace. Otherwise, the manifest deployment will be deployed to the `Default` namespace.

  ```yaml
  namespace: <yourNameHere>
  ```
  :::

8. Provide configuration information for the service.

9. You can add more services to the App Profile as needed. To do this, click the **Actions** button next to the **Configure tier** pane. To rearrange layers in the profile, select a service and drag it up or down in the pane. Each service becomes a layer in the app profile stack in the order displayed in this pane.

10. When you've provided the required configuration information for services, click **Review**. Your app profile is now created and can be deployed.  


## Validate

Use the following steps to validate that your app profile is available and ready for use.

1. Log in to [Palette](https://console.spectrocloud.com) and switch to **App Mode**.

2. Navigate to the left **Main Menu** and click on **App Profiles**.

3. Select the app profile you created to review its details.

4. To learn more about the layers, you can hover your cursor over each layer to learn details such as the pack name, its version, and the registry it belongs to.

 ![A view of a cursor triggering the info box for each app profile layer.](/devx_app-profile_create-app-profile_app-layer-infoboxes.png)
 
 :::info
 
 Use the tool-tip that displays when you select a layer to gather information required for creating Terraform templates for app profiles. Check out our Terraform registry for [Application Profiles](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/application_profile).
 
 :::

5. Deploy your application to a virtual cluster to verify all the required configurations and dependencies are correct. Review [Create and Manage Apps](../../devx/apps/create-app.md) to learn how to deploy an app to a virtual cluster. Check out the [Deploy an Application using Palette Dev Engine](../../devx/apps/deploy-app.md) tutorial for a more in-depth guide.

## Next Steps

Start exploring the various [out-of-the-box](../../devx/app-profile/services/services.md) services Palette exposes to application authors. Use these services to quickly deploy applications without the overhead of managing and configuring the infrastructure required for common third-party services such as databases, message queues, and more.



