---
title: "Use non-FIPS Add-On Packs"
metaTitle: "Use non-FIPS Add-On Packs"
metaDescription: "Add non-FIPS add-on packs to VerteX cluster profiles."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

Palette VerteX provides FIPS-compliant infrastructure components in Kubernetes clusters it deploys. These components are listed below. To learn more about these and other Palette VerteX components, refer to [FIPS-Compliant Components](/vertex/fips-compliant%20components).

<br />

    
- Operating System (OS)

- Kubernetes

- Container Network Interface (CNI)

- Container Storage Interface (CSI)

The screenshot shows the FIPS-compliant icon used to indicate full FIPS compliance next to Palette VerteX infrastructure components in the cluster profile stack. To learn about other icons Palette VerteX applies, refer to [FIPS Status Icons](/vertex/fips-status-icons).

![Diagram showing FIPS-compliant icons in profile stack.](/vertex_fips-status-icons_icons-in-profile-stack.png) 

You can allow tenant users to customize their cluster profiles by using add-on packs, which *may not* be FIPS-compliant. Add-on packs enhance cluster functionality by adding profile layers such as system apps, authentication, security, monitoring, logging, and more.


# Prerequisites

There are no prerequisites.


# Allow Non-FIPS Add-On Packs


1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.


2. Navigate to the left **Main Menu** and click on **Tenant Settings**. Next, on the **Tenant Settings Menu**, select **Platform Settings**.


3. Enable the **Allow non-FIPS add-on packs** option. When you enable this option, you are prompted to confirm the use of non-FIPS add-on packs for the tenant.


![Diagram showing the Allow non-FIPS add-on packs toggle enabled.](/vertex_use-non-fips-settings_nonFips-addon-packs.png)
 

To disable the setting, toggle this option off and confirm you want to disable it.

[Resources](/vertex/system-management/enable-non-fips-settings/use-non-fips-addon-packs#resources) listed below provide a searchable list of packs that users can to a cluster profile. Palette VerteX will apply the appropriate icon next to packs and imported clusters to indicate their FIPS compliance status.   


# Validate


1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu** and select **Profiles**.

    <br />
    
    When you select a cluster profile, an **Add New Pack** button is displayed. When you click on **Add Cluster Profile**, an **Add-on** button is displayed in the **Type** field of the Basic Information page. The Public Repo, which contains various add-on packs, is available for you to choose from.
   

# Resources

- [Packs List](/integrations)


- [Create an Add-on Profile](/cluster-profiles/create-add-on-profile)


- [FIPS Status Icons](/vertex/fips-status-icons)



