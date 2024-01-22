---
sidebar_label: "Use non-FIPS Add-On Packs"
title: "Use non-FIPS Add-On Packs"
description: "Add non-FIPS add-on packs to VerteX cluster profiles."
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["vertex", "non-fips"]
---

Palette VerteX provides the following FIPS-compliant infrastructure components in Kubernetes clusters it deploys. Review
[FIPS-Compliant Components](../../fips/fips-compliant-components.md) to learn more.

<br />

- Operating System (OS)

- Kubernetes

- Container Network Interface (CNI)

- Container Storage Interface (CSI)

As shown in the screenshot below, the FIPS-compliant icon used to indicate full FIPS compliance is displayed next to
Palette VerteX infrastructure components in the cluster profile stack. To learn about other icons Palette VerteX
applies, refer to [FIPS Status Icons](../../fips/fips-status-icons.md).

![Diagram showing FIPS-compliant icons in profile stack.](/vertex_fips-status-icons_icons-in-profile-stack.png)

You can allow tenant users to customize their cluster profiles by using add-on packs, which _may not_ be FIPS compliant.
Add-on packs enhance cluster functionality by adding profile layers such as system apps, authentication, security,
monitoring, logging, and more.

## Prerequisites

- You need tenant admin permission to enable this feature.

## Allow Non-FIPS Add-On Packs

1. Log in to [Palette VerteX](https://console.spectrocloud.com/) as a tenant admin.

2. Navigate to the left **Main Menu** and click on **Tenant Settings**.

3. On the **Tenant Settings Menu**, select **Platform Settings**.

4. Enable the **Allow non-FIPS add-on packs** option. When you enable this option, you are prompted to confirm the use
   of non-FIPS add-on packs for the tenant.

![Diagram showing the Allow non-FIPS add-on packs toggle enabled.](/vertex_use-non-fips-settings_nonFips-addon-packs.png)

To disable the setting, toggle this option off and confirm you want to disable it.

When you or other users add a pack to a cluster profile. Palette VerteX will apply the appropriate icon next to packs
and imported clusters to indicate their FIPS compliance status.

## Validate

1. Log in to [Palette VerteX](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu** and select **Profiles**. When you select a profile, the **Add New Pack** option is
   available.
3. Navigate back to the **Main Menu** and re-select **Profiles**.

4. Click the **Add Cluster Profile** button. The **Add-on** option is available in the wizard.

Palette VerteX will display the appropriate FIPS status icon next to the pack layer and in the profile stack.

## Resources

- [Packs List](../../../integrations/integrations.mdx)

- [Create an Add-on
  Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-addon-profile/create-addon-profile.md

- [FIPS Status Icons](../../fips/fips-status-icons.md)
