---
sidebar_label: "Community Packs"
title: "Community Packs"
description: "Identify Community Packs in Palette, which are not actively maintenance."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["packs", "community"]
---

Palette Community Packs are packs that are created and maintained by the Spectro Cloud community. They provide important
integrations with Spectro Cloud Palette.

:::warning

We provide community packs to facilitate collaborations and contributions from the wider community. All community packs
are reviewed and accepted by Spectro Cloud. However, unlike [Verified Packs](./verified_packs.md), community packs are
not maintained and updated regularly.

:::

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a profile. Refer to the
  [Roles and Permissions](../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin)
  documentation for more information.

## Use Community Packs

Palette comes with a default community pack registry that is available to all SaaS tenants, and non-airgap self-hosted
Palette environments. The [Default Registries](../registries-and-packs/registries/registries.md#default-registries)
table has the details of the community registry. You can use community packs in your cluster profiles without any
special configuration.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button.

4. Fill out the cluster profile name and description.

5. Select **Add-on** for the cluster profile type. Click on **Next** to continue.

6. Select **Add New Pack**. In the next window that displays, choose the **Palette Community Registry** and select the
   community pack to add to your profile. You can search packs by name.

![A screenshot of selecting Palette Community Registry](/integrations_community-packs_add-community-pack.webp)

7. Fill out the required input fields and click on **Confirm & Create**.

8. If you want to add additional layers, repeat steps 6 and 7. Otherwise, click on **Next** to review the profile.

9. Click on **Finish Configuration** to create the cluster profile.

You now have an add-on cluster profile that contains one or more community packs.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes.

## Next Steps

Now you can use the add-on profile with other profiles and across multiple environments, projects, and tenants.

We welcome all contributions to the Spectro Cloud community packs, either by adding new packs or updating existing
packs. You can read our
[Contribution Guidelines](https://github.com/spectrocloud/pack-central?tab=readme-ov-file#contributing) in the community
packs repository.
