---
sidebar_label: "Verified Packs"
title: "Verified Packs"
description: "Identify Verified Packs in Palette, which undergo active maintenance."
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
  [Roles and Permissions](../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile-admin)
  documentation for more information.

## Use Verified Packs

Palette comes with a default pack registry that is available to all SaaS tenants, and non-airgap self-hosted Palette
environments. The [Default Registries](../registries-and-packs/registries/registries.md#default-registries) table has
the details of the Palette registry. You can use verified packs in your cluster profiles without any special
configuration.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu** click **Profiles**.

3. Click on the **Add Cluster Profile** button.

4. Fill out the cluster profile name and description.

5. Select **Add-on** for the cluster profile type. Click on **Next** to continue.

6. Select **Add New Pack**. In the next window that displays, choose the **Palette Registry** and select the pack to add
   to your profile. You can search packs by name.

![A screenshot of selecting Palette Registry](/integrations_verified-packs_add-pack.webp)

7. Fill out the required input fields and click on **Confirm & Create**.

8. If you want to add additional layers, repeat steps 6 and 7. Otherwise, click on **Next** to review the profile.

9. Click on **Finish Configuration** to create the cluster profile.

You now have an add-on cluster profile that contains one or more verified packs.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to left **Main Menu** and select **Profiles**.

3. Select your cluster profile to review its layers or make changes if needed.

## Next Steps

Now you can use the add-on profile with other profiles and across multiple environments, projects, and tenants.
