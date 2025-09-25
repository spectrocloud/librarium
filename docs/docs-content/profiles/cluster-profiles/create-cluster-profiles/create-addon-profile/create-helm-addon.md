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

## Create an Add-on Profile with Helm Charts

<PartialsComponent category="profiles" name="create-profile-enablement" edition="Add-on" />

5. Select the **Add Helm Chart** drop-down menu and to choose **Public packs** or **Private packs**.

<Tabs>

<TabItem value="public" label="Public Packs">

6. To add a chart from a _public_ registry, make a selection from the **Registry** drop-down menu, and locate your
   desired pack. When selected, the **Profile Layers** page appears, which displays the pack's details and configuration
   file. Change the **Pack Version** if needed.

7. (Optional) If desired, specify the layer [install order](./create-addon-profile.md#install-order).

</TabItem>

<TabItem value="private" label="Private Packs">

6. To add a chart from a _private_ registry, on the **Profile Layers** page, select a **Registry** from the drop-down
   menu. Next, select **Chart name** and **Chart version**.

7. (Optional) If desired, add configurable **Chart Values** and specify the layer
   [install order](./create-addon-profile.md#install-order).

</TabItem>

</Tabs>

8. Configure parameters as needed. Ensure you specify a namespace; otherwise, the manifest will be deployed to the
   `Default` namespace. For examples of Helm-based pack structures, review our
   [Deploy a Pack](../../../../tutorials/packs-registries/deploy-pack.md#build-a-pack) guide, and select the appropriate
   tab.

   ```yaml
   namespace: <your-namespace-here>
   ```

   :::warning

   The `namespace` parameter in the configuration file identifies the namespace on the target cluster. The namespace
   must use the regex pattern `[a-z0-9]([-a-z0-9]*[a-z0-9])?`; only lowercase alphanumeric characters and hyphens are
   allowed, and the namespace must start and end with an alphanumeric character. For more information about customizing
   with namespaces, refer to [Profile Customization](../../../profile-customization.md).

   :::

9. When finished, select **Confirm & Create**.

10. Repeat steps 5 - 9 to add additional Helm charts. When finished, select **Next** to review your cluster profile.

11. Select **Finish Configuration** to create your cluster profile.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

You now have an add-on cluster profile that contains one or more Helm charts, which you can reuse and apply to multiple
clusters. Refer to the [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md) guide for more
information about update operations.

## Resources

- [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../../modify-cluster-profiles/version-cluster-profile.md)

- [Profile Customization](../../../profile-customization.md)
