---
title: "Use non-FIPS Features"
metaTitle: "Use non-FIPS Features"
metaDescription: "Use non-FIPS features such as backup, restore, and scans."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

You can allow users on the tenant to use features that are *not* FIPS-compliant, such as tenant cluster backup and restore or various scanning capabilities for compliance, security, validation, and software bill of materials (SBOM).

# Prerequisites

- Palette can back up clusters to several locations. For Backup prerequisites, refer to [Backup-Restore](/clusters/cluster-management/backup-restore#prerequisites).


- There are no prerequisites for restoring clusters or performing scans.


# Allow non-FIPS features


1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.


2. Navigate to the left **Main Menu** and click on **Tenant Settings**. Next, on the **Tenant Settings Menu**, select **Platform Settings**.


3. Enable the **Allow non-FIPS features** option. When you enable this option, you are prompted to confirm the use of non-FIPS features for the tenant.

![Diagram showing the Allow non-FIPS features toggle enabled.](/vertex_use-non-fips-settings_nonFips-features.png)

To disable the setting, toggle this option off and confirm you want to disable it.

[Resources](/vertex/enable-non-fips-settings/use-non-fips-features#resources) listed below will guide you to configure and schedule cluster backups and describe available scans you can schedule during cluster deployment.


# Validate


1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu** and select **Project Tenant Settings** (?). The **Backup Locations** menu choice is displayed in the **Tenant Settings** Menu. 


3. Navigate to the left **Main Menu** and click on **Clusters**. The **Backups** and **Scan** tabs are displayed. 


# Resources 

- [Cluster Backup and Restore](/clusters/cluster-management/backup-restore)


- [Scans](/clusters/cluster-management/compliance-scan)

