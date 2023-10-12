---
sidebar_label: "Add a Manifest"
title: "Add a Manifest"
description: "REVISE: Learn how to create an add-on profile in Palette."
hide_table_of_contents: false
sidebar_position: 5
tags: ["profiles", "cluster profiles"]
---



You can extend the list of integrations by adding custom manifests to your cluster profile. Use the following steps to create a cluster profile that adds a custom manifest layer.

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a profile. Refer to the [Cluster Profile permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md) documentation for more information about roles and permissions.

## Add a Manifest to a Cluster Profile 

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button. 

4. Fill out the following input values and ensure you select **Add-on** for the type. Click on **Next** to continue.

  | **Field** | **Description** |
  |-----------|-----------------|
  |**Name**| The name of the profile. |
  |**Version**| Assign a version to the profile. You only need to specify a version if you create multiple versions of a profile using the same profile name. Default: `1.0.0`. |
  |**Description**| Use the description to provide context about the profile. |
  |**Type**| **Add-on** |
  |**Tags**| Assign any desired profile tags. Tags propagate to the Virtual Machines (VMs) deployed in the cloud or data center environment when clusters are created from this cluster profile. Example: `owner` or `region`.  |

  To learn how to create multiple profile versions, check out [Version a Cluster Profile](../../modify-cluster-profiles/version-cluster-profile.md).

5. Select **Add Manifest** and provide a display name for this layer. Optionally, you can add configurable layer values and specify the layer install order. When multiple manifests are added to the layer, the install order determines the order in which manifests in the profile are consumed. You can change the order as needed.

<!-- The pack configuration file is displayed on the next page. -->

6. Click on **New manifest** and provide a name for your custom manifest. Click on the blue check. to open the editor. 

7. Create your manifest, and include the `pack:namespace` parameter to identify the namespace on the target cluster to deploy the pack.

  ```yaml
  pack:
   namespace: "your_namespace_here"
  ```

  :::caution

  Palette requires a namespace name using the `pack:namespace` parameter in the configuration file to identify the namespace on the target cluster. For examples of pack file structure when building a custom pack, review [Build a Pack](../../../../registries-and-packs/deploy-pack.md#build-a-pack).

  <!-- If the `values.yaml` specifies a namespace value, then Palette first checks to see if the namespace has been created. If so, Palette uses the existing namespace. If the namespace has not been created, Palette creates a new one using the value specified in the YAML file. If the `values.yaml` does not specify a namespace value, Palette deploys the application to the default namespace.-->

  ::: 

8. If you want to add more manifests, repeat steps 6 and 7. Otherwise, click **Confirm & Create**, then click **Next** to review the profile.

9. Click **Finish Configuration** to create the cluster profile.

You now have an add-on cluster profile that contains one or more manifests. You can reuse the profile and apply it to several clusters. Refer to the [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md) guide for more information about update operations.




