---
title: "Resource Quota"
metaTitle: "Palette Dev Engine for Enterprise developers"
metaDescription: "Explore Palette Dev Engine as Free developers"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Resource Quota

Palette allocates a quota to users of Palette Cluster Groups as part of Spectro Cloud's free tier offering. You can launch Palette Virtual Clusters or deploy applications to new or existing virtual clusters. You may use the quota defined at the system level while exploring Palette SaaS capabilities. 

Palette enterprise users may offer these capabilities to their internal developers. Theoretically, enterprise developers would be able to use the system-level quota offered to other developers, but the tenant administrator will most likely set up different cluster groups and quotas for enterprise developers. You can view this as the enterprise developer's quota offered at the tenant level.

Enterprise developers may not exceed these quotas:

* System-level quota while launching virtual clusters in system-level cluster groups. 
* Tenant-level quota while launching virtual clusters in their tenant-level cluster groups.

## Manage Developer Quota

To create your cluster groups, you must manage the developer quota in Palette by hiding the system-level cluster groups as follows:

1. Log in to [Palette](https://console.spectrocloud.com/). 

2. In **Cluster Mode**, select **Tenant Admin** from the drop-down menu 

3. Click **Tenant Settings** in the Main Menu and select **Developer Settings**. 

4. In **Manage Developer Settings**, toggle the `Hide system-level cluster groups from tenant users` option to *on*.

5. Set desired values for *User Quotas*. The table lists the default values.

|**Resource Requirement for two Palette Virtual Clusters**|**Default Quota**|**Minimum Value**|
|--------|-------------|-------------|
|CPU|12|4|
|Memory| 16 GiB|4 GiB|
|Storage| 20 GiB|2 GiB|

If limits defined for cluster groups are lower than the default quota shown in the table, the size of the respective resource (CPU, memory, or storage) will update automatically to the lower limit. You can verify cluster group limits on the **Cluster Group Settings** page. 

Palette offers a default ephemeral-storage of 1 GiB for virtual clusters launched on the Beehive cluster group.

 You can track the status of the resource quota from **Overview** in the **Main Menu** of Palette Dev Engine console.

To summarize quota allocation, each user in a tenant may create up to two virtual clusters with a cumulative CPU/memory/storage quota across all their virtual clusters. Each virtual cluster may consume up to 2.5 vCPU and 2.5 GiB memory from the allocated quota.

<br />

