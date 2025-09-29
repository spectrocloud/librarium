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

<PartialsComponent category="profiles" name="create-profile-prerequisites" />

## Create an Add-On Profile with Manifests

<PartialsComponent category="profiles" name="create-profile-enablement" edition="Add-on" />

5. Select **Add Manifest**, and provide a **Layer name** for this layer. This is the display name.

6. (Optional) If desired, add configurable **Layer values** and specify the layer
   [install order](./create-addon-profile.md#install-order).

7. Select **New manifest** and provide a name for your custom manifest. When finished, select the check mark or press
   **ENTER** to open the editor.

8. <PartialsComponent category="profiles" name="add-on-namespace" />

9. Repeat steps 7 - 8 to create additional manifests. When finished, select **Confirm & Create** to return to the
   cluster profile overview page. If you need to make changes, select the applicable layer, and update your manifest
   values; otherwise, select **Next** to review your cluster profile.

10. Select **Finish Configuration** to create your cluster profile.

## Add Manifests to an Existing Profile

<PartialsComponent category="profiles" name="add-on-existing-intro" edition="manifests" />

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Profiles**.

3. Select an existing full or add-on cluster profile. Use the **Profile Types** drop-down menu to help you locate
   compatible **Full** and **Add-on** profiles.

4. From the cluster profile menu, select **Add Manifest**, and provide a **Layer name** for this layer. This is the
   display name.

5. (Optional) If desired, add configurable **Layer values** and specify the layer
   [install order](./create-addon-profile.md#install-order).

6. Select **New manifest** and provide a name for your custom manifest. When finished, select the check mark or press
   **ENTER** to open the editor.

7. <PartialsComponent category="profiles" name="add-on-namespace" />

8. Repeat steps 4 - 8 to create additional layers with manifests; repeat steps 6 - 7 to add additional manifests to the
   same layer of your cluster profile. When finished, select **Confirm & Create**, then select **Next** to review your
   cluster profile.

9. Select **Finish Configuration** to save your updated cluster profile.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

You now have an add-on cluster profile that contains one or more Helm charts, which you can reuse and apply to multiple
clusters in tandem with an [infrastructure](../create-infrastructure-profile.md) or
[full cluster profile](../create-full-profile.md).

<PartialsComponent category="profiles" name="create-profile-next-steps" />

## Resources

- [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../../modify-cluster-profiles/version-cluster-profile.md)

- [Profile Customization](../../../profile-customization.md)
