---
sidebar_label: "Add a Helm Chart"
title: "Add a Helm Chart"
description: "REVISE: Learn how to create an add-on profile in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["profiles", "cluster profiles"]
---



You can extend the list of integrations by adding Helm charts from a public or private registries to your cluster profile. Use the following steps to create an add-on cluster profile that adds a Helm chart layer.

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a profile. Refer to the [Cluster Profile permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md) documentation for more information about roles and permissions.

## Add a Helm Chart to a Cluster Profile 

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button. 

4. Fill out the following input values and ensure you select **Add-on** for the type. Click on **Next** to continue.

  | **Field** | **Description** |
  |-----------|-----------------|
  |**Name**| A custom name for the cluster profile. |
  |**Version**| Assign a version to the profile. You only need to specify a version if you create multiple versions of a profile using the same profile name. Default: `1.0.0`. |
  |**Description**| Use the description to provide context about the profile. |
  |**Type**| **Add-on** |
  |**Tags**| Assign any desired profile tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when clusters are created from this cluster profile. Example: `owner` or `region`.  |

  To learn how to create multiple profile versions, check out [Version a Cluster Profile](../../modify-cluster-profiles/version-cluster-profile.md).

5. Select **Add Helm Chart** and use the **drop-down Menu** to choose public or private packs. 

<!-- For a description of the layers, review [Profile Layers](../../cluster-profiles.md#profile-layers). -->

6. For public packs, select a registry from the **drop-down Menu** and choose a Helm chart from the list. You can search charts by name. Pack details and the configuration file are displayed on the next page.

  For private packs, use the **drop-down Menu** to select the registry that contains your custom Helm chart. Provide the chart name and version and configure chart values as needed. Optionally, you can specify the layer install order. When multiple manifests are added to the layer, the install order determines the order in which Helm chart values and manifests in the profile are consumed. You can change the order as needed.

7. Configure parameters as needed, and include a namespace name in the `pack:namespace` parameter to identify the namespace on the target cluster to deploy the pack.

  ```yaml
  pack:
   namespace: "your_namespace_here"
  ```

  :::caution

  Palette requires a namespace name using the `pack:namespace` parameter in the configuration file to identify the namespace on the target cluster. For examples of pack file structure when building a custom pack, review [Build a Pack](../../../../registries-and-packs/deploy-pack.md#build-a-pack).

  <!-- If the `values.yaml` specifies a namespace value, then Palette first checks to see if the namespace has been created. If so, Palette uses the existing namespace. If the namespace has not been created, Palette creates a new one using the value specified in the YAML file. If the `values.yaml` does not specify a namespace value, Palette deploys the application to the default namespace.-->

  ::: 

7. If you want to add manifests, click **New Manifest** and create the manifest. Ensure you include the `pack:namespace` parameter and specify a namespace name. Otherwise, click on **Confirm & Create** to review the profile.

8. When you are done, click **Confirm & Create**, then click **Next** to review the profile.

  <!-- ![A view of the manifest create process and the YAML code in the text editior](/clusters_imported-clusters_attach-add-on-profile_manfest-view.png) -->

9. Click **Finish Configuration** to create the cluster profile.

You now have an add-on cluster profile. You can reuse the profile and apply it to several clusters. Refer to the [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md) guide for more information about update operations.


## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2.  Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes.


## Next Steps

Now you are ready to deploy a cluster using the add-on cluster profile you created.