---
title: "Allow Cluster Import"
metaTitle: "Allow Cluster Import"
metaDescription: "Learn how to import clusters to Palette VerteX."
icon: ""
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Overview

You can allow users to import clusters that were not deployed through Palette.

# Prerequisites


Refer to [Cluster Import Prerequisites](/clusters/imported-clusters/cluster-import#prerequisites).


# Allow non-FIPS Cluster Import


1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.


2. Navigate to the left Main Menu and click on Tenant Settings. Next, on the Tenant Settings Menu, click on Platform Settings.


3. Enable the Allow non-FIPS cluster import option. When you enable this option, you are prompted to confirm importing clusters into the tenant that may have profiles with non-FIPS-compliant packs.

![Diagram showing the Allow non-FIPS cluster import toggle enabled.](https://vertex_use-non-fips-settings_nonFips-cluster-import.png)

To disable the setting, toggle this option off and confirm you want to disable it.

Use the listed Resources for guidance on creating and restoring backups and initiating scans. 


# Validate

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select your imported cluster from the cluster list. A successful cluster import will have the cluster status Running.


# Resources

- [Import Modes](/clusters/imported-clusters#importmodes)


- [Cluster Import Limitations](/clusters/imported-clusters#limitations)


- [Import a Cluster](/clusters/imported-clusters/cluster-import)
