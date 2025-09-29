---
sidebar_label: "Add a Pack"
title: "Add a Pack"
description: "Learn how to create an add-on profile in Palette that adds a pack layer."
hide_table_of_contents: false
sidebar_position: 0
tags: ["profiles", "cluster profiles", "pack", "add-on"]
---

Take the following steps to create or edit a cluster profile by adding one or more layers using add-on packs.

## Prerequisites

<PartialsComponent category="profiles" name="create-profile-prerequisites" />

## Create an Add-On Profile with Packs

<PartialsComponent category="profiles" name="create-profile-enablement" edition="Add-on" />

5. Select **Add New Pack**.

6. Use the search, **Registry**, **Type**, and **Verified** fields to locate and select your desired pack.

7. Select your **Pack Version** and modify the pack **Values** as necessary. Modify the
   [install order](./create-addon-profile.md#install-order) if applicable.

8. Select **Confirm & Create** to return to the cluster profile overview page.

9. Repeat steps 5 - 8 to add additional layers. If you need to make changes to an existing pack, select the applicable
   layer, and update your pack's configuration. When finished, select select **Next** to review your cluster profile.

10. Select **Finish Configuration** to create your cluster profile.

## Add Packs to an Existing Profile

<PartialsComponent category="profiles" name="add-on-existing-intro" edition="packs" />

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Profiles**.

3. Select an existing full or add-on cluster profile. Use the **Profile Types** drop-down menu to help you locate
   compatible **Full** and **Add-on** profiles.

4. From the cluster profile menu, select **Add New Pack**.

5. Use the search, **Registry**, **Type**, and **Verified** fields to locate and select your desired pack.

6. Select your **Pack Version** and modify the pack **Values** as necessary. Modify the
   [install order](create-addon-profile.md#install-order) if applicable.

7. Select **Confirm & Create** to return to the cluster profile overview page.

8. Repeat steps 4 - 7 to add additional packs to your cluster profile. When finished, select **Next** to review your
   cluster profile.

9. Select **Finish Configuration** to save your updated cluster profile.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

You now have an add-on cluster profile that contains one or more packs, which you can reuse and apply to multiple
clusters in tandem with an [infrastructure](../create-infrastructure-profile.md) or
[full cluster profile](../create-full-profile.md).

<PartialsComponent category="profiles" name="create-profile-next-steps" />

## Resources

- [Update Cluster Profile](../../modify-cluster-profiles/update-cluster-profile.md)

- [Version a Cluster Profile](../../modify-cluster-profiles/version-cluster-profile.md)

- [Profile Customization](../../../profile-customization.md)

- [Duplicate a Pack in a Profile](../duplicate-pack-in-profile.md)
