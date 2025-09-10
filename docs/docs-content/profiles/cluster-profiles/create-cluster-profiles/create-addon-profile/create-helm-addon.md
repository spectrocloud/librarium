---
sidebar_label: "Add a Helm Chart"
title: "Add a Helm Chart"
description: "Learn how to create an add-on profile in Palette that adds a Helm chart layer."
hide_table_of_contents: false
sidebar_position: 10
tags: ["profiles", "cluster profiles", "helm", "add-on"]
---

You can extend the list of integrations by adding Helm charts from a public or private registry to your cluster profile.
Use the following steps to create a cluster profile by adding layers using Helm charts.

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a profile. Refer to the
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  documentation for more information.

## Add Helm Chart to Add-on Profile

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button.

4. Fill out the following input values and ensure you select **Add-on** for the type. Click on **Next** to continue.

   | **Field**       | **Description**                                                                                                                                                                                                   |
   | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Name**        | A custom name for the cluster profile.                                                                                                                                                                            |
   | **Version**     | Assign a version to the profile. You only need to specify a version if you create multiple versions of a profile using the same profile name. Default: `1.0.0`.                                                   |
   | **Description** | Use the description to provide context about the profile.                                                                                                                                                         |
   | **Type**        | **Add-on**                                                                                                                                                                                                        |
   | **Tags**        | Assign any desired profile tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when clusters are created from this cluster profile. Example: `owner` or `region`. |

   To learn how to create multiple profile versions, check out
   [Version a Cluster Profile](../../modify-cluster-profiles/version-cluster-profile.md).

5. Select **Add Helm Chart** and use the **drop-down Menu** to choose public or private packs.

6. To add a chart from a public registry, choose a Helm chart from the list displayed on the next page. You can search
   charts by name. Pack details and the configuration file are displayed on the next page.

   To add a chart from a private registry, select a registry from the **drop-down Menu** and provide the chart name and
   version.

7. Configure parameters as needed. In the configuration file, ensure you specify a namespace. Otherwise, the chart will
   deploy to the `Default` namespace.

   ```yaml
   pack:
     namespace: your_namespace_here
   ```

   Optionally, you can add configurable layer values and specify the layer
   [install order](./create-addon-profile.md#install-order).

   :::warning

   Palette requires a namespace using the `namespace` parameter in the configuration file to identify the namespace on
   the target cluster. For more information about customizing with namespaces, refer to
   [Profile Customization](../../../profile-customization.md).

   For examples of pack structure for a Helm chart-based pack, review
   [Build a Pack](../../../../tutorials/packs-registries/deploy-pack.md#build-a-pack), and select the appropriate tab.

   :::

8. When you are done, click **Confirm & Create**, then click **Next** to review the profile.

  <!-- ![A view of the manifest create process and the YAML code in the text editior](/clusters_imported-clusters_attach-add-on-profile_manfest-view.webp) -->

9. Click **Finish Configuration** to create the cluster profile.

You now have an add-on cluster profile that contains a Helm chart. You can reuse the profile and apply it to several
clusters. Refer to the [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md) guide for more
information about update operations.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

Now you can use the add-on profile you created with other profiles.

## Resources

- [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../../modify-cluster-profiles/version-cluster-profile.md)

- [Profile Customization](../../../profile-customization.md)
