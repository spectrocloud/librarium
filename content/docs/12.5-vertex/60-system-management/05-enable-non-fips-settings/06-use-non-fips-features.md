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

You can allow tenant users access to Palette features that are *not* FIPS-compliant, such as tenant cluster backup and restore or various scanning capabilities for compliance, security, validation, and software bill of materials (SBOM). Prior to enabling non-FIPS features, the **Scan** and **Backups** tabs are not displayed on the **Cluster Overview** page. 

# Prerequisites

- You need tenant admin permission to enable this feature.


- Palette can back up clusters to several locations. To learn about backup requirements, review [Backup-Restore](/clusters/cluster-management/backup-restore).


- There are no prerequisites for restoring clusters or performing scans.


# Allow non-FIPS Features


1. Log in to [Palette VerteX](https://console.spectrocloud.com/) as a tenant admin.


2. Navigate to the left **Main Menu** and click on **Tenant Settings**. 


3. On the **Tenant Settings Menu**, select **Platform Settings**.


4. Enable the **Allow non-FIPS features** option. When you enable this option, you are prompted to confirm the use of non-FIPS features for the tenant.

![Diagram showing the Allow non-FIPS features toggle enabled.](/vertex_use-non-fips-settings_nonFips-features.png)


To disable the setting, toggle this option off and confirm you want to disable it.

# Validate


1. Log in to [Palette VerteX](https://console.spectrocloud.com/).


2. Navigate to the left **Main Me[Title](http://localhost:9000/vertex/system-management/enable-non-fips-settings/use-non-fips-features)nu** and click on **Clusters**. 


3. Select your cluster in the list. The **Scan** and **Backups** tabs are now displayed on the **Cluster Overview** page.


# Resources 

- [Cluster Backup and Restore](/clusters/cluster-management/backup-restore)


- [Scans](/clusters/cluster-management/compliance-scan)

