---
title: "Cluster Updates"
metaTitle: "Managing Cluster Update Events on Spectro Cloud"
metaDescription: "Events and Notifications on Cluster Updates"
icon: "envelope-open-text"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';



 
# Cluster Updates
Spectro Cloud ensures the complete life cycle utilization of its cluster for the users by promoting strong day 2 operations. In this context, cluster updates and integrations are extremely important. In Spectro Cloud, majority of the updates are rolled out through Cluster Profiles. Updates such as addition of a new layer, changes to the pack version, removal of an existing layer, changes to the layer settings or attached manifests, etc. result in update notifications on all the clusters that were instantiated from that cluster profile.  Users can check, confirm and incorporate the updates to their running clusters at an appropriate time.

Additionally, users may changes like overriding pack settings or manifest settings directly on the clusters. 
 
## Instructions:
* Navigate to the cluster profiles page and choose the profile to be updated. 
* Make the desired changes. These include add/delete layers, change pack version, change pack values etc. Save your changes. 
* On the Clusters page, observe the  ‘Updates Available’ tag on every cluster that was previously launched using the updated cluster profile.
* Click on one of the clusters to be updated to invoke the cluster details page. 
* An update notification in form of a button called ‘Updates Available’ can be seen on the right top of the screen. Click the button to open the update  notifications dialog.
* A notification is created for each change made to the profile. Review all notifications. Depending on the nature of the change, additional action might be required for certain notifications. These are typically scenarios, where the settings or attached manifests for a pack were directly update on the cluster which results in a conflict with the new incoming changes from the profile. For such cases, the updated profile settings and modified cluster settings are shown side by side, with the differences highlighted. Resolve all of the conflicts. When there has been no update to the pack settings or manifests, the incoming changes from the profile are automatically merged. A side by side comparison between the original cluster settings and the merged cluster settings is still displayed in such cases for review purposes. However, users may choose to further customize settings from this dialog. 
* Once all the notifications are reviewed and conflicts, if any, are resolved, confirm updates to apply changes to the cluster. 
* The system starts the update process in a few seconds. Depending upon the nature of the change, a rolling update of the clusters nodes may take place. The UI updates with detailed status of the upgrade. 
* Repeat this process for other clusters to be upgraded.


# Examples - Update Notifications

|Update Type     |Description|Notification Example                   |
|:---------------|:---------|:-----------------------|
Pack Version Upgrade |The existing pack version is upgraded to a different version in the cluster profile     |Kubernetes version is updated 1.18.16 > 1.20.0|
|Pack Values Update |The existing pack values are updated in the cluster profile       |Kubernetes  1.20.0 values are updated|
|Add Pack|Add a new pack to the cluster profile    |New Kibana 7.2.4 layer is added|
|Delete Pack|Delete the existing pack from the cluster profile      |Kibana 7.2.4 layer is deleted|
|Attach Pack Manifest|Delete the existing pack from the cluster profile      |Manifest security is attached to the pack Kubernetes|
|Update Pack Manifest|The attached pack manifest content is updated in the cluster profile|manifest security is updated in the pack Kubernetes|
|Delete Pack Manifest |The attached pack manifest is deleted from the cluster profile|manifest security is deleted in the pack Kubernetes|

**Note:**
Prior to applying the notifications that result from a profile update, if the corresponding changes are reverted, the notification is automatically cleared. 
 
# Examples - Notification settings

As described above, when notifications originate from changes to pack settings or manifest, they are accompanied with a settings dialog with a split pane showing differences in values. Following are a few examples of such scenarios:

|Values Updated    |Values overridden in Clusters   |Settings displayed (LHS)   |Settings displayed (RHS)   |Auto Merged  | Action  |
|:---------------|:---------|:--------------------|:--------|:-------|:--------|
|Pack Values|No|Original pack settings| Updated pack settings| Yes| Review and/or modify if desired|
|Attached Manifests|No|Original Manifests| Updated Manifests| Yes| Review and/or modify if desired|
|Pack Values|Yes|Updated settings from Cluster Profile| Current settings from cluster| No| Resolve all conflicts|
|Attached Manifests|Yes|Updated settings from Cluster Profile| Current settings from cluster| No| Resolve all conflicts|
|Pack Version Changed|No|Original pack settings| Updated pack settings| Yes| Review and/or modify if desired|
|Pack Version Changed|Yes|Updated settings from Cluster Profile| Current settings from cluster| No| Resolve all conflicts|
