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
Spectro Cloud ensures the complete life cycle utilization  of its cluster for the users  by promoting strong day 2 operations. In this context cluster updates and integrations are of at most importance and could be done very easily. Cluster updates are all about updating the cluster profile features like packs, manifests, pack values, versions etc after the cluster is created. Each of these updates creates notifications to the user to check, confirm and incorporate the updates to the running cluster. A detailed overview of these updates and notifications pertaining to individual updates is enumerated in this session.
 
## Steps to follow:
* Go to the Cluster profiles.
* Select the cluster profile to be updated.
* Make the pack updates pack updates and save.
* Now, go to the Clusters page, where the ‘Updates Available’ tag can be seen on the corresponding cluster names for which the cluster profile update was done.
* Click on the particular cluster.
* A green button tagged ‘Updates Available’ can be seen on the right top of the screen, click open it.
* A new window tagged ‘Available updates’ opens up.
* This screen has information regarding all the profile updates done to that cluster.This window carries two types of information :
 *  Profile Updates and notifications.
 *  Current cluster values and incoming profile changes.
* Users can verify the changes and press ‘confirm updates’ to complete the process of cluster updation.
 
# Cluster Updates and Notifications

Any updates to the Cluster Profile packs generates update notification on the Clusters. Users are required to verify the updates, resolve the pack values if any conflicts and confirm only if the updates are valid. Only on confirmation the updates are applied to the running Spectro Cloud clusters.
Supported notification updates are as listed below.
 
|Cluster Updates     |Description|Notification Example                   |
|:---------------|:---------|:-----------------------|
Pack Upgrade |The existing pack version is upgraded to a different version in the cluster profile     |Kubernetes version is updated 1.18.16 > 1.20.0|
|Pack Values Update |The existing pack values are updated in the cluster profile       |Kubernetes  1.20.0 values are updated|
|Add Pack|Add a new pack to the cluster profile    |New Kibana 7.2.4 layer is added|
|Delete Pack|Delete the existing pack from the cluster profile      |Kibana 7.2.4 layer is deleted|
|Attach Pack Manifest|Delete the existing pack from the cluster profile      |Manifest security is attached to the pack Kubernetes|
|Update Pack Manifest|The attached pack manifest content is updated in the cluster profile|manifest security is updated in the pack Kubernetes|
|Delete Pack Manifest |The attached pack manifest is deleted from the cluster profile|manifest security is deleted in the pack Kubernetes|
 
 
## ‘Available Updates’- pop up screen
The ‘**Available Updates**’ pop-up carries details on **‘current cluster values and incoming profile changes’**. As the tag suggests, the left side carries the current values in the cluster in view only mode and the right side carries the updated values which are in editable format. Once the ‘confirm updates’ is selected the right side updates get overridden to the left side and the cluster profile gets updated . While adding and deleting a cluster feature ‘current cluster values and incoming profile changes’ will not be there, only current cluster values window in editable format will only be present.
 
Related to ‘current cluster values and incoming profile changes’ the contents of this window takes two forms:
* current cluster values / incoming profile changes:
If a pack contains no overridden values, an edit to the pack values displays current cluster values / incoming profile changes format .
* incoming profile changes / current cluster values:
If a pack contains already overridden values and a further edit to the pack values displays incoming profile changes / current cluster values.
 
**Note:**
Once a change is made at the cluster profile and notification update is not applied to the cluster (pending notification), then if the user decides to revert the changes at cluster profile then the pending notification on the cluster gets cleared automatically.

Eg: new pack added - update notification generated  - keep the notification pending - remove the added pack - No updates visible on the cluster.
 
# Cluster Profile Notification
 
The registry updates such as new pack or helm chart release, existing pack values update generates the notification on the cluster profiles. If the user selects the Kubernetes pack with smart tag (eg: version 1.20.x) while adding the pack, any new Kubernetes release available at the registry auto updates the cluster profiles to update to the latest Kubernetes. Instead if the user selects a specific version (eg: version 1.20.2) of the pack then users need to update to the new version by updating the cluster profile manually. Any update to the cluster profile triggers the notification on the clusters and users should confirm the updates in order to apply the changes to the running kubernetes cluster.
 
|Update Notification     |Description|Example                   |
|:---------------|:---------|:-----------------------|
New Spectro Pack or Helm Chart Release |TA new pack or helm chart version is available at registry|"EventMessageRegistryPackNewVersion": "{{.Kubernetes}} {{.1.20.x}} is associated to version {{.1.20.5}}",|
|Spectro Pack Values Update |Pack values modifications are  detected and notified to the cluster profiles.|"EventMessageRegistryPackUpdate": "{{.Kubernetes}} {{.1.20.5}} is updated : {{.packRevMessage}}",|
|Pack Tag Delete|Removal of a pack from the registry.|"EventMessageRegistryPackTagDelete": {{.Kubernetes}} {{1.16.0 }} tag is delete|
 
**Note:**

*  Info Notification : If user doesn't customize the pack values at profile then system auto updates the cluster profile and show review notification to describe about the updates
*  Update Notification: If user customize the pack values at profile then user must resolve the pack values and confirm the updates manually
