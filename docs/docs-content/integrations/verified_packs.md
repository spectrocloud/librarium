---
sidebar_label: "Verified Packs"
title: "Verified Packs"
description: "Learn what are verified packs and how to use them in Palette."
icon: ""
hide_table_of_contents: false
sidebar_position: 20
tags: ["packs", "verified"]
---

Palette Verified Packs are packs we build and actively maintain with continuous updates and monitoring for security
vulnerabilities. We use our extensive knowledge to ensure verified packs are configured according to best practices. We
offer verified packs across the spectrum of a typical cluster profile stack - from the Operating System (OS) layer up to
application layers. Verified packs are readily recognized in Palette by the green shield icon that distinguishes them
from other packs.

![A screenshot of several Verified Packs with a green shield icon.](/integrations_verified-packs-green-check.webp)

### Verified Pack Updates

Verified packs are updated every six to eight weeks to ensure they are always current. These updates include necessary
software updates and configuration adjustments. Additionally, our OS and Kubernetes packs are hardened using Center for
Internet Security (CIS) standards, and we update them periodically to align with best practices. If any pack is found to
have a security issue, we quickly address it and, depending on the severity of the issue, we may release a patch fix. To
address patch fixes, we have established a weekly hotfix release schedule to flexibly roll out urgent fixes as needed.

To learn about our general pack maintenance policy, review the [Maintenance Policy](maintenance-policy.md) reference.

:::info

Palette paid subscriptions cover access to our Support team and product updates.

:::

## Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a profile. Refer to the
  [Roles and Permissions](../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  documentation for more information.

## Use Verified Packs

Use the following steps to create a cluster profile by adding one or more layers using verified packs.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button.

4. Fill out the cluster profile name and description.

5. Select the cluster profile type that you want to create. You can read more about cluster profile types on the
   [Cluster Profiles](../profiles/cluster-profiles/cluster-profiles.md) page. Click on **Next** to continue.

6. Select **Add New Pack**.

7. Toggle the **Verified** checkbox to display all verified packs. Select the pack you want to add to the cluster
   profile.

   ![A screenshot of selecting Palette Registry](/integrations_verified-packs_add-pack.webp)

8. Fill out the required input fields and click on **Confirm & Create**.

9. If you want to add additional layers, repeat steps 6 - 8. Otherwise, click on **Next** to review the profile.

10. Click on **Finish Configuration** to create the cluster profile.

You now have an add-on cluster profile that contains one or more verified packs.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes if needed.

## Next Steps

Now you can use the add-on profile with other profiles and across multiple environments, projects, and tenants.
