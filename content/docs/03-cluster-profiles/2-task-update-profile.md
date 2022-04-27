---
title: "Updating Cluster Profiles"
metaTitle: "Updating Cluster Profiles"
metaDescription: "The method for updating or editing an existing Cluster Profile on Spectro Cloud"
icon: ""
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

## Updating Cluster Profiles

Cluster profiles are typically updated to change the configuration of various layers in a Kubernetes stack. Basic information like name, description, and tags can also be updated. However, the environment associated with the profile cannot be updated.


The following are the steps to update a cluster profile:

* Navigate  to the desired cluster profile’s details page.

* To update the basic information, invoke the edit dialog from the settings menu located at the top right corner of the page, and make changes to name, description, and tags as required. Updates to the tags are not propagated to the cloud environment for previously created clusters. However, any new clusters created from the profile will have their virtual machines tagged in the cloud environment.


* To add additional layers, pick one of the following options:
  * Add New Pack
  * Import from cluster
  * Add Manifest

 * To update settings of a layer or any of its attached manifest, as well as to add/remove 'attach manifests' or delete the layer completely, click on the relevant layer from the profile's topology to invoke the edit pack panel. To update pack settings, click on Pack Values button to invoke the pack values editor. Additional manifests can be attached, and previously added ones can be updated or deleted from the edit panel. A link to remove the pack completely from the profile is also displayed in the edit panel. <WarningBox>Please note that OS, Kubernetes, Networking, and Storage are considered as core layers and these cannot be removed.</WarningBox>
 * Alternately, to click on the "Editor" link to invoke a tabbed layer editor. From here you can quickly navigate to the desired layer and update its settings.
 * Save your changes. Optionally provide a comment to describe the reason for the change. This is useful for audit purposes.

All clusters previously created from this profile will be notified of the changes made to the profile. The clusters can be updated to the latest definition of the profile whenever deemed appropriate.

<InfoBox>

**Kubernetes Version Upgrades:** We recommend our users to go for single-step upgrades of Kubernetes minor versions. E.g., Kubernetes version 1.18.x is to be updated to 1.19.x, not a direct upgrade to 1.20.x

**Kubernetes Version Downgrades:** We do not recommend downgrading the Kubernetes versions.

</InfoBox>

