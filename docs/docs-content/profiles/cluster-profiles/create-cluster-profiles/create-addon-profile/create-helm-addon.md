---
sidebar_label: "Add a Helm Chart"
title: "Add a Helm Chart"
description: "Learn how to create an add-on profile in Palette that adds a Helm chart layer."
hide_table_of_contents: false
sidebar_position: 10
tags: ["profiles", "cluster profiles", "helm", "add-on"]
---

You can extend the list of integrations by adding Helm charts from a public or private registry to your cluster profile.
Take the following steps to create a cluster profile by adding layers using Helm charts.

## Prerequisites

<PartialsComponent category="profiles" name="create-profile-prerequisites" />

## Create an Add-On Profile with Helm Charts

<PartialsComponent category="profiles" name="create-profile-enablement" edition="Add-on" />

5. Select the **Add Helm Chart** drop-down menu and choose **Public packs** or **Private packs**.

<Tabs groupId="registry-type">

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

8. <PartialsComponent category="profiles" name="add-on-namespace" />

9. When finished, select **Confirm & Create**.

10. Repeat steps 5 - 9 to add additional Helm charts. When finished, select **Next** to review your cluster profile.

11. Select **Finish Configuration** to create your cluster profile.

## Add Helm Charts to an Existing Profile

<PartialsComponent category="profiles" name="add-on-existing-intro" edition="Helm charts" />

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left main menu, select **Profiles**.

3. Select an existing full or add-on cluster profile. Use the **Profile Types** drop-down menu to help you locate
   compatible **Full** and **Add-on** profiles.

4. From the cluster profile menu, select the **Add Helm Chart** drop-down menu and choose **Public packs** or **Private
   packs**.

<Tabs groupId="registry-type">

<TabItem value="public" label="Public Packs">

5. To add a chart from a _public_ registry, make a selection from the **Registry** drop-down menu, and locate your
   desired pack. When selected, the **Profile Layers** page appears, which displays the pack's details and configuration
   file. Change the **Pack Version** if needed.

6. (Optional) If desired, specify the layer [install order](./create-addon-profile.md#install-order).

</TabItem>

<TabItem value="private" label="Private Packs">

5. To add a chart from a _private_ registry, on the **Profile Layers** page, select a **Registry** from the drop-down
   menu. Next, select **Chart name** and **Chart version**.

6. (Optional) If desired, add configurable **Chart Values** and specify the layer
   [install order](./create-addon-profile.md#install-order).

</TabItem>

</Tabs>

7. <PartialsComponent category="profiles" name="add-on-namespace" />

8. When finished, select **Confirm & Create** to return to the cluster profile overview page.

9. Repeat steps 4 - 8 to add additional Helm charts to your cluster profile. When finished, select **Next** to review
   your cluster profile.

10. Select **Finish Configuration** to save your updated cluster profile.

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
