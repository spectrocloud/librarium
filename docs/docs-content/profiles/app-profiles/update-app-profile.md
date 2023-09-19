---
sidebar_label: "Update an App Profile"
title: "Update an App Profile"
description: "Understanding the Cluster Profiles Concept and how they make Spectro Cloud powerful"
hide_table_of_contents: false
sidebar_position: 20
tags: ["profiles", "app profiles"]
---


<<< Copied from Update a Cluster Profile - use as a base. >>>

You update a cluster profile to change the configuration of one or more layers in the profile stack. You can also update basic profile information such as the name, description, and tags.

## Prerequisites

There are no prerequisites. <<< OR >>> Your Palette account role must have the clusterProfile.create permission to create an Add-on cluster profile. Refer to the Cluster Profile permissions documentation for more information about roles and permissions.

## Modify Basic Profile Information

Follow these steps to update basic profile information.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Profiles**.

3. Click the profile you want to update. Palette displays the profile stack.

4. Click the **Settings drop-down Menu** and choose **Edit Info**.  You can modify the name, version, description, and tags.
    
:::info

  Updated tags are not propagated to previously created clusters. However, tag changes will apply to new clusters you create that use the updated profile.

:::

5. Save your changes.


## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Profiles**.

3. Click the profile you updated. Palette displays the profile details and profile stack.

4. Check that profile details display your changes.



## Update a Pack Layer

The following steps will guide you in making updates to a layer in the profile.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Profiles**.

3. Select the profile you want to update. Palette displays the profile details and profile stack.

4. You can do the following:
    
- Edit cluster basic cluster profile information by navigating to the **Settings drop-down Menu** and choosing **Edit Info**.


- Select **Add New Pack** and choose a new pack to add.


- Select **Import from cluster** to import a pack from another cluster. 

    - Click the layer you want to update, and edit pack settings in the YAML file.

    - Select **Add Manifest** to add, edit, or remove a manifest.

    - Select **Add Helm chart** to add a Helm chart.

    - Select **Add Zarf** In air-gapped environments, use Zarf to add applications.

    - Remove non-core pack layers from the profile. Click the layer to display its details and click the **trash can** icon next to **Edit Pack**. 

  :::info

  Operating System (OS) Kubernetes, Networking, and Storage are considered core layers and cannot be removed.

  :::
  
    - Delete the profile by navigating to the **Settings drop-down Menu** and choosing **Delete**.

5. Confirm your updates.

Clusters that use the updated profile are notified of the changes. You can update clusters to use the latest profile definition at any time.

## Validate

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Profiles**.

3. If you deleted the profile, verify it is no longer displayed on the **Cluster Profiles** page.

4. If you made changes, click the profile you updated. Palette displays the profile details and profile stack.

5. Check that layers are added to or removed from the stack.  

6. If you added, removed, or modified a manifest, click the layer in the stack that you updated and verify the manifest changes.


## Update the Pack Version

Packs typically contain changes between versions, such as the addition or removal of parameters and policies. The following steps guide you in updating configurations.

:::caution

When updating to a new pack version, these rules apply:

- You should not copy the pack configuration from one version to another, as the newer version often contains an adjusted configuration that is tailored to that version. Instead, you should integrate your changes manually in the new version.

- Updating to a newer Kubernetes version must be done incrementally, one minor version at a time.

- Select a specific target version instead of a group that ends in ``.x``
We do not recommend downgrading packs to the previous version.

:::

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Profiles**.

3. Click the profile you want to update. Palette displays the profile stack. 

4. Click on the pack layer to update. 

5. In the **Edit Pack** page, select a specific target version, not a group that ends in ``.x``. Palette displays the difference between the current version at left and the new version at right. The target version is displayed in the header. <br /><br />
    
  Differences between the displayed configurations are as follows:
    
  
    -  **Red highlighting**:  indicates text that is not present in the new configuration.
          
Red highlighting indicates lines you may have added in the current configuration. You can use the arrow icon that displays between the two configurations to transfer the lines to the new version.
            
These lines may also have been removed because they are no longer valid in the new configuration. If you need them, you should copy the lines to the new version. Similarly, you should copy any settings from the current configuration. 
               
- **Green highlighting**:  indicates additions in the new configuration that are not present in the current version.
  
    #### Example of Difference Between Current and New Configurations

    
    ![Screenshot that shows Palette's pack diff user interface with red highlight at left and green highlight at right](/integrations_pack_diffs.png)


    - **Contrasting shades** of red and green highlight in the same line indicates differences occur in only part of the line.

    
    #### Example of Line Changes in Current and New Configurations

    ![Screenshot that shows Palette's pack diff user interface with contrasting shades of red and green highlight in the same line](/integrations_pack_line_diffs.png)


6. Check for red-highlighting in the configuration that is missing in the new configuration.

    - If there are any lines you added, use the arrow to transfer the lines to the new version.
    
    - If there are lines you did not add that are red highlighted, they have been removed in the new version, and you should **not** copy them over.


7. Check for changed settings in the new configuration and copy settings from the current configuration to the new version.

8. Review new sections in the new configuration. You should adopt them, as they are typically needed to support the new version.


9. Check for changes in the same line that have a different value. If it is not a customization you made, you should adopt the new value, as it is known to be compatible with the new version.

10. Confirm your updates.

## Validate 

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. From the left **Main Menu**, select **Profiles**.

3. Click the profile you updated. Palette displays the profile stack.

4. Check that the updated layer displays the new pack version.
    
    Palette indicates any misconfigurations with a dot displayed on the problematic layer in the stack and a message letting you know there is an issue.   

5. Click on the pack layer and review its configuration. Apply fixes and confirm your updates. 

6. Repeat the process until Palette indicates the configuration works.
