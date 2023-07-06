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

You can allow users to add non-FIPS-compliant features such as tenant cluster backup, restore, and compliance scans for security, validation, and software bill of materials (SBOM).

# Prerequisites

- Palette can back up clusters to several locations. For Backup prerequisites, refer to [Backup-Restore](/clusters/cluster-management/backup-restore#prerequisites).


- There are no prerequisites for restoring clusters or performing scans.


# Allow non-FIPS features


1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.


2. Navigate to the left **Main Menu** and click on **Tenant Settings**. Next, on the **Tenant Settings Menu**, select **Platform Settings**.


3. Enable the **Allow non-FIPS features** option.


4. Use the listed Resources to guide you to create and restore backups and initiate scans. 


# Validate


1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu** and select **Project Tenant Settings** (?). The **Backup Locations** menu choice is displayed in the **Tenant Settings** Menu. 


3. Navigate to the left **Main Menu** and click on **Clusters**. The **Backups** and **Scan** tabs are displayed. 


# Resources 

- [Cluster Backup and Restore](/clusters/cluster-management/backup-restore)


- [Scans](/clusters/cluster-management/compliance-scan)

