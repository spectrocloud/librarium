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


- Updating to a newer version must be done incrementally, one minor version at a time.


- Select a specific target version instead of a group that ends in ``.x``

</WarningBox>

# Prerequisites

There are no prerequisites.

# Enablement

Follow these steps to update a pack.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. From the left **Main Menu**, select **Profiles**.


3. Click the profile you want to update. Palette displays the profile stack. 


4. Click on the pack layer to update.  


5. In the **Edit Pack** page, select a specific target version, not a group that ends in ``.x``. Palette displays the difference between the current version at left and the new version at right. The target version is displayed in the header.

    Differences between the displayed configurations are as follows:

    <br />
    
    -  **Red highlighting**:  indicates text that is not present in the new configuration. 
    
        <br />
        
        Red highlighting indicates lines you may have added in the current configuration. You can use the arrow icon that displays between the two configurations to transfer the lines to the new version.

        <br />

        <br />
        
        Red-highlighting also indicates something may have been removed in the new configuration, as they are no longer valid in the new profile. If you need them, you should copy them to the new version. Similarly, copy any settings from the current configuration.
    
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

  
<br />


6. Check for red-highlighting in the configuration that is missing in the new configuration.

    <br />

    - If there are any lines you added, such as OIDC, use the arrow to transfer the lines to the new version.

    <br />
    
    - If there are lines you did not add that are highlighted, they may have been removed in the new version, and you should be copy them over.


7. Check for changed settings in the new configuration and copy settings from the current configuration to the new version.


8. Review new sections in the new configuration. Go ahead and adopt them, as they are typically needed to support the new version.


9. Check for changes in the same line that have a different value. If it is not a customization you made, you should go ahead and adopt the new value, as it is known to be compatible with the new version.


10. Confirm your updates.


# Validation

When you confirm your updates, Palette displays the profile stack. You can validate your changes by reviewing the layer in the stack that you updated to ensure the new pack version appears. If there is a configuration issue, click on the pack layer and review its configuration to fix any issues. 