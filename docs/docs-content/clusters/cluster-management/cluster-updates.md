---
sidebar_label: "Cluster Updates"
title: "Cluster Updates"
description: "Events and Notifications on Cluster Updates"
hide_table_of_contents: false
sidebar_position: 20
tags: ["clusters", "cluster management"]
---


Palette supports various kinds of updates to running clusters, such as upgrade of Kubernetes version, upgrade of add-on versions, the addition of new add-ons, removing existing ones, etc. Based on the nature of the change, one of the following two mechanisms can be used to apply cluster updates to the cluster.

## Cluster Profile Updates

Fundamental changes to the cluster’s definition, such as upgrading Kubernetes versions, installing new packs, uninstalling previously installed packs, and updating default pack configuration, are initiated through the cluster profile. These changes result in update notifications on all the clusters that are instantiated from the cluster profile. Update notifications consist of detailed information about all the changes applied to the profile since the initial installation or the previous update. In addition, users can update the clusters individually at an appropriate time. 

:::info

Cluster Profile Changes will not be displayed or allowed on clusters when the cluster is provisioning and all worker node additions are completed. This is done to prevent the Kubernetes clusters from becoming unstable and transitioning into an unrecoverable state due to the changes in core components. 
:::

![Cluster Notification - Update Available](/cluster_list_update_available.png)

Updates to pack configuration might result in a conflict if the configuration was previously overridden within the cluster. These conflicts are presented to the user and need to be resolved before changes can be applied to the cluster.


![Cluster Update Details](/cluster_update_available_detail.png)



## Instructions

* Navigate to the cluster profiles page and choose the profile to be updated. 
* Make the desired changes. These include add/delete layers, change pack version, change pack values, etc. Save your changes. 
* On the Clusters page, observe the  ‘Updates Available’ tag on every previously launched cluster using the updated cluster profile.
* Click on one of the clusters to be updated to invoke the cluster details page. 
* An update notification in the form of a button called ‘Updates Available’ can be seen on the right top of the screen. Click the button to open the update  notifications dialog.
* A notification is created for each change made to the profile. Review all notifications. Depending on the nature of the change, additional action might be required for certain notifications. There are typical scenarios where the settings or attached manifests for a pack are directly updated on the cluster, resulting in a conflict with the new incoming changes from the profile. The updated profile settings and modified cluster settings are shown side by side for such cases, with the differences highlighted. Resolve all of the conflicts. When there has been no update to the pack settings or manifests, the incoming changes from the profile are automatically merged. A side-by-side comparison between the original and merged cluster settings is still displayed in such cases for review purposes. However, users may choose to customize settings from this dialog further. 
* Once all the notifications are reviewed and conflicts, if any, are resolved, confirm updates to apply changes to the cluster. 
* The system starts the update process in a few seconds. Depending upon the nature of the change, a rolling update nodes of the clusters may take place. The detailed status of the upgrade is made available at UI. 
* Repeat this process for other clusters to be upgraded.


### Examples - Update Notifications

|**Update Type**     |**Description**|**Notification Example** |
|:---------------|:---------|:-----------------------|
Pack Version Upgrade |The existing pack version is upgraded to a different version in the cluster profile     |Kubernetes version is updated 1.18.16 > 1.20.0|
|Pack Values Update |The existing pack values are updated in the cluster profile       |Kubernetes  1.20.0 values are updated|
|Add Pack|Add a new pack to the cluster profile    |New Kibana 7.2.4 layer is added|
|Delete Pack|Delete the existing pack from the cluster profile      |Kibana 7.2.4 layer is deleted|
|Attach Pack Manifest|Delete the existing pack from the cluster profile      |Manifest security is attached to the pack Kubernetes|
|Update Pack Manifest|The attached pack manifest content is updated in the cluster profile|manifest security is updated in the pack Kubernetes|
|Delete Pack Manifest |The attached pack manifest is deleted from the cluster profile|manifest security is deleted in the pack Kubernetes|

:::info

Prior to applying the notifications resulting from a profile update, the notification is automatically cleared if the corresponding changes are reverted. 
 
:::


### Examples - Notification settings

As described above, notifications originate from changes to pack settings or manifest. They are accompanied by a settings dialog with a split pane showing differences in values. Following are a few examples of such scenarios:

|Values Updated    |Values overridden in Clusters   |Settings displayed (LHS)   |Settings displayed (RHS)   |Auto Merged  | Action  |
|:---------------|:---------|:--------------------|:--------|:-------|:--------|
|Pack Values|No|Original pack settings| Updated pack settings| Yes| Review and/or modify if desired|
|Attached Manifests|No|Original Manifests| Updated Manifests| Yes| Review and/or modify if desired|
|Pack Values|Yes|Updated settings from Cluster Profile| Current settings from cluster| No| Resolve all conflicts|
|Attached Manifests|Yes|Updated settings from Cluster Profile| Current settings from cluster| No| Resolve all conflicts|
|Pack Version Changed|No|Original pack settings| Updated pack settings| Yes| Review and/or modify if desired|
|Pack Version Changed|Yes|Updated settings from Cluster Profile| Current settings from cluster| No| Resolve all conflicts|

## Configuration overrides

Every pack installed via cluster profile provides a set of out-of-the-box default settings. These can be overridden at the time of launching a new cluster or any time afterward for a running cluster. Besides basic defaults, Palette also provides useful presets. Presets are preconfigured configuration blocks logically grouped. Can leverage these to turn a feature on/off quickly. For example, enabling ingress for a Prometheus/Grafana pack requires many settings to be added. However, the Ingres preset for the Prometheus pack makes it easy to make this change. 

![Cluster Update Details](/cluster_config_override.png)