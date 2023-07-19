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

You can allow users to import Kubernetes clusters that were not deployed through Palette, including some that are *not* FIPS-compliant. , and their FIPS copliance cannot be confirmed.

# Prerequisites


Refer to [Cluster Import Prerequisites](/clusters/imported-clusters/cluster-import#prerequisites).


# Allow non-FIPS Cluster Import


1. Log in to [Palette](https://console.spectrocloud.com/) as a tenant admin.


2. Navigate to the left Main Menu and click on **Tenant Settings**. Next, on the **Tenant Settings Menu**, select **Platform Settings**.


3. Enable the **Allow non-FIPS cluster import** option. When you enable this option, you are prompted to confirm importing clusters into the tenant that may not be FIPS-compliant.

![Diagram showing the Allow non-FIPS cluster import toggle enabled.](/vertex_use-non-fips-settings_nonFips-cluster-import.png)

To disable the setting, toggle this option off and confirm you want to disable it.

Use the listed Resources for guidance on creating and restoring backups and initiating scans. 

[Resources](/vertex/enable-non-fips-settings/allow-cluster-import#resources) listed below will guide you on how to import a cluster and import modes and limitations to be aware of. 

# Validate

1. Log in to [Palette](https://console.spectrocloud.com/).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select your imported cluster from the cluster list. A successful cluster import will have the cluster status Running.


# Resources

- [Import a Cluster](/clusters/imported-clusters/cluster-import)


- [Import Modes](/clusters/imported-clusters#importmodes)


- [Cluster Import Limitations](/clusters/imported-clusters#limitations)


