---
title: 'Update Cluster Profiles'
metaTitle: 'Update Cluster Profiles'
metaDescription: 'Learn how to update cluster profiles in Palette.'
icon: ''
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Overview

You update a cluster profile to change the configuration of one or more layers in the profile stack. You can also update basic profile information such as the name, description, and tags. However, you cannot update the environment associated with the profile, such as ??

## Prerequisites

There are no prerequisites.

## Enablement

The following steps will guide you in updating profiles.

## Modify Basic Profile Information

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. From the left **Main Menu**, select **Profiles**.


3. Click the profile you want to update. Palette displays the profile stack.


4. Click the **Settings drop-down Menu** and choose **Edit Info**. 


  You can change the name, version, description, and tags as required. Updated tags are not propagated to previously created clusters. However, tag changes will apply to new clusters you create using the updated profile.


5. Save your changes.


## Update a Pack Layer

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. From the left **Main Menu**, select **Profiles**.


3. Click the profile you want to update. Palette displays the profile stack.


4. Click the layer to update. Palette displays the profile stack. To add a pack layer, select one of the following options:

  - Add New Pack
  - Import from cluster
  - Add Manifest


5. You can do the following:

  - Choose a new pack to add or import one from another cluster. Or you can edit pack settings in the YAML file.

  - Add, edit, or remove a manifest.

  - Remove non-core pack layers from the profile by navigating to the **Settings drop-down Menu** and choosing **Delete**.

  <br /> 

  <InfoBox>

  Operating System (OS) Kubernetes, Networking, and Storage are considered core layers and cannot be removed.

  </InfoBox>

  <br />

6. Confirm your updates.

Clusters that use the updated profile are notified of the changes. You can update clusters to use the latest profile definition at any time.


## Update the Pack Version

Packs typically contain changes between versions, such as the addition or removal of parameters and policies. The following steps guide you in updating configurations.

<br />

<WarningBox>

When updating to a new Kubernetes version, these rules apply:

<br />

- You cannot copy the pack configuration from one version to another.


- Updating to a newer version must be done incrementally, one minor version at a time.


- Select a specific target version instead of a group that ends in ``.x``
We do not recommend downgrading packs to the previous version.

</WarningBox>

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
        
        Red-highlighting also indicates something may have been removed in the new configuration, as they are no longer valid. If you need them, you should copy the lines to the new version. Similarly, you should copy any settings from the current configuration.
    
    <br />
    
    - **Green highlighting**:  indicates additions in the new configuration that are not present in the current version.
    
    <br />

    #### Example of Difference Between Current and New Configurations

    
    ![Screenshot that shows Palette's pack diff user interface with red highlight at left and green highlight at right](/integrations_pack_diffs.png)

    <br />

    <br />

    - **Contrasting shades** of red and green highlight in the same line indicates differences occur in only part of the line.

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

 

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. From the left **Main Menu**, select **Profiles**.


3. Click the profile you updated. Palette displays the profile stack.


4. Check that the updated layer displays the new pack version.

    <br />
    
    Palette indicates any misconfigurations with a dot displayed on the problematic layer in the stack and a message letting you know there is an issue.   


5. Click on the pack layer and review its configuration. Apply fixes and confirm your updates. 


6. Repeat the process until Palette indicates the configuration works.


# Next Steps

Try applying the profile to a cluster. For more information about cluster profiles, review the [Update Cluster Profiles](/cluster-profiles/task-update-profile.) guide.
