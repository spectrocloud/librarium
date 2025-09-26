---
sidebar_label: "Add a Manifest"
title: "Add a Manifest"
description: "Learn how to create an add-on profile in Palette that adds a manifest layer."
hide_table_of_contents: false
sidebar_position: 5
tags: ["profiles", "cluster profiles", "manifest", "add-on"]
---

You can extend the list of integrations by adding custom manifests to your cluster profile. Use the following steps to
create a cluster profile by adding layers using manifests.

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a profile. Refer to the
  [Roles and Permissions](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  documentation for more information.

## Create an Add-on Profile with Manifests

<PartialsComponent category="profiles" name="create-profile-enablement" edition="Add-on" />

5. Select **Add Manifest**, and provide a **Layer name** for this layer. This is the display name.

6. (Optional) If desired, add configurable **Layer values** and specify the layer
   [install order](./create-addon-profile.md#install-order).

7. Select **New manifest** and provide a name for your custom manifest. When finished, select the check mark or press
   **ENTER** to open the editor.

8. Create your manifest. Ensure you specify a namespace; otherwise, the manifest will be deployed to the `Default`
   namespace. For examples of manifest-based pack structures, review our
   [Deploy a Pack](../../../../tutorials/packs-registries/deploy-pack.md#build-a-pack) guide, and select the appropriate
   tab.

   ```yaml
   namespace: "<your-namespace-here>"
   ```

   :::warning

   The `namespace` parameter in the configuration file identifies the namespace on the target cluster. The namespace
   must use the regex pattern `[a-z0-9]([-a-z0-9]*[a-z0-9])?`; only lowercase alphanumeric characters and hyphens are
   allowed, and the namespace must start and end with an alphanumeric character. For more information about customizing
   with namespaces, refer to [Profile Customization](../../../profile-customization.md).

   :::

9. Repeat steps 7 - 8 to create additional manifests. When finished, select **Confirm & Create** to return to the
   cluster profile overview page. If you need to make changes, select the applicable layer, and update your manifest
   values; otherwise, select **Next** to review your cluster profile.

10. Select **Finish Configuration** to create your cluster profile.

## Add a Manifest to an Existing Profile

Instead of creating a cluster profile from scratch, you can also add a manifest to an existing
[full](../create-full-profile.md) or add-on cluster profile.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Profiles**.

3. Select an existing full or add-on cluster profile. Use the **Profile Types** drop-down menu to help you locate
   compatible profiles.

4. From the cluster profile menu, select **Add Manifest**, and provide a **Layer name** for this layer. This is the
   display name.

5. (Optional) If desired, add configurable **Layer values** and specify the layer
   [install order](./create-addon-profile.md#install-order).

6. Select **New manifest** and provide a name for your custom manifest. When finished, select the check mark or press
   **ENTER** to open the editor.

7. Create your manifest. Ensure you specify a namespace; otherwise, the manifest will be deployed to the `Default`
   namespace. For examples of manifest-based pack structures, review our
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

8. Repeat steps 4 - 8 to create additional layers with manifests; repeat steps 6 - 7 to add additional manifests to the
   same layer of your cluster profile. When finished, select **Confirm & Create**, then select **Next** to review your
   cluster profile.

9. Select **Finish Configuration** to save your updated cluster profile.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

You now have an add-on cluster profile that contains one or more manifests, which you can reuse and apply to multiple
clusters. Refer to the [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md) guide for more
information about update operations.

## Resources

- [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../../modify-cluster-profiles/version-cluster-profile.md)

- [Profile Customization](../../../profile-customization.md)
