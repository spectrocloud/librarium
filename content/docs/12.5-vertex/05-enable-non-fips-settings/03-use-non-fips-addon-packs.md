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

Palette VerteX provides FIPS-compliant infrastructure components in cluster profiles. These components are:
    
- Operating System (OS)
- Kubernetes
- Container Network Interface (CNI)
- Container Storage Interface (CSI) 

You can allow users on the tenant to customize their cluster profiles by using add-on packs, which may *not* be FIPS-compliant. Add-on packs enhance cluster functionality by adding profile layers such as system apps, authentication, security, monitoring, logging, and more.


# Prerequisites

There are no prerequisites.


# Allow Non-FIPS Add-On Packs


1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.


2. Navigate to the left **Main Menu** and click on **Tenant Settings**. Next, on the **Tenant Settings Menu**, select **Platform Settings**.


3. Enable the **Allow non-FIPS add-on packs** option. When you enable this option, you are prompted to confirm the use of non-FIPS add-on packs for the tenant.


![Diagram showing the Allow non-FIPS add-on packs toggle enabled.](/vertex_use-non-fips-settings_nonFips-addon-packs.png)


To disable the setting, toggle this option off and confirm you want to disable it.

The [Resources](/vertex/enable-non-fips-settings/use-non-fips-addon-packs#resources) below provide a searchable list of packs that can be added to a cluster profile and steps to create an add-on profile.  



# Validate


1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu** and select **Profiles**.

    <br />
    
    When you select a cluster profile, an **Add New Pack** button is displayed. When you click on **Add Cluster Profile**, an **Add-on** button is displayed in the **Type** field of the Basic Information page. The Public Repo, which contains various add-on packs, is available for you to choose from.
   

# Resources

- [Packs List](/integrations)


- [Create an Add-on Profile](/cluster-profiles/create-add-on-profile)



