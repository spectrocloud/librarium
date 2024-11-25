---
sidebar_label: "Create a VM Migration Assistant Profile"
title: "Create a VM Migration Assistant Profile"
description: "Learn how to create a Virtual Machine Migration Assistant cluster profile and add it your VMO cluster"
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo", "vm migration assistant"]
---

Follow these steps to create a new add-on profile that will be applied to your existing VMO cluster.

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a cluster profile. Refer to the
  [Permissions](../../user-management/palette-rbac/permissions.md#operations) documentation for more information.
- A healthy VMO cluster. Refer to the [Create a VMO Profile](../create-vmo-profile.md) for further guidance.
  - The VMO cluster must have access to VMware and the VMs you want to migrate.

## Create the Profile

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button.

4. Fill out the basic information and ensure you select **Add-on** for the type. Click on **Next** to continue.

5. Select **Add New Pack**. In the next window that displays, enter **Virtual Machine Migration Assistant** in the
   **Filter by name** search bar. The pack is in the **Spectro Addon Repo** registry. Select the pack when it appears.

6. Palette displays the YAML file in the editor at right. You can edit the YAML as needed. Review the following
   parameters and adjust to your requirements if needed.

   | **Parameter**                                                      | **Description**                                                                                                                    | **Default Value**            |
   | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
   | `vm-migration-assistant-ui.console.service.console.type`           | Choose whether to use a `NodePort`, `LoadBalancer`, or an `Ingress` to expose the service console.                                 | `"LoadBalancer"`             |
   | `vm-migration-assistant-ui.console.service.console.ingress.domain` | If using Ingress, specify the domain name that the Ingress resource will use to expose the VM Migration Assistant service console. | `console.127.0.0.1.sslip.io` |

7. Click on **Confirm & Create**.

8. In the following screen, click **Next**.

9. Click **Finish Configuration**.

10. From the **Main Menu**, choose **Clusters** and select your VMO cluster.

11. In the **Profile** tab, click **Add add-on profile (+)** and select the newly created profile. Click **Confirm**.

12. Click **Save** to deploy the VM Migration Assistant to your cluster.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to **Profiles** from the left **Main Menu**.

3. Locate the newly created profile in the list.

4. From the left **Main Menu**, click **Clusters** and select your cluster.

5. In the **Overview** tab, ensure that the cluster status and health is **Running** and **Healthy**.

6. In the **Overview** tab, the **Services** list displays a clickable port to access the VM Migration Assistant service
   console. The port number is based on your service console configuration.

## Next Steps

You can now use the VM Migration Assistant to migrate your VMs. Refer to the
[Create Source Providers](./create-source-providers.md) guide to start creating your source providers.
