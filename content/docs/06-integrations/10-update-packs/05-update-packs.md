---
title: "Update Packs"
metaTitle: "Update Packs"
metaDescription: "Learn how to update Palette packs."
icon: " "
hideToC: true
fullWidth: true
hideToCSidebar: true
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Overview

Pack configurations typically contains changes between versions, such as the addition or removal of parameters and policies. The following steps guide you in updating configurations.

<br />

<WarningBox>

When updating to a new Kubernetes version, these rules apply:

<br />

- You cannot copy the pack configuration from one version to another.


- Updating to a newer Kubernetes version must be done incrementally, one minor version at a time. 

</WarningBox>

# Prerequisites

There are no prerequisites.

# Enablement

Follow these steps to update a pack.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. From the left **Main Menu**, select **Profiles**.


3. 

Select a specific target version, not a group that ends in ``.x``. Palette displays the difference between the current version at left and the new version at right. The target version is displayed in the header.

    Differences between the displayed configurations are as follows:

    <br />
    
    -  **Red highlighting**:  indicates text that is not present in the new configuration. 
    
        <br />
        
        Red highlighting indicates lines you may have added in the current configuration. You can use the arrow icon that displays between the two configurations to transfer the lines to the new version.

        <br />

        <br />
        
        Red-highlighting also indicates they might be removed in the new configuration, as they are no longer valid in the new profile. If you need them, you should copy them to the new version. Similarly, copy any settings from the current configuration.
    
    <br />
    
    - **Green highlighting**:  indicates additions in the new configuration that are not present in the current version.
    
    <br />

    #### Example of Difference Between Current and New Configurations

    
    ![Screenshot that shows Palette's pack diff user interface with red highlight at left and green highlight at right](/integrations_pack_diffs.png)

    <br />

    <br />

    - Contrasting shades of red and green highlight in the same line indicates differences occur in only part of the line.

    <br />

    #### Example of Line Changes in Current and New Configurations

    ![Screenshot that shows Palette's pack diff user interface with contrasting shades of red and green highlight in the same line](/integrations_pack_line_diffs.png)

  







2. 

# Validation
