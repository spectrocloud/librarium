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

Palette allocates a quota to users of Palette Cluster Groups as part of our free tier offering. You may launch Palette Virtual Clusters or deploy applications to new or existing virtual clusters. You may use the quota defined at the system level while exploring Palatte SaaS capabilities. 

Palette enterprise users may offer these capabilities to their internal developers. Theoretically, enterprise developers would be able to use the system-level quota offered to other developers, but the tenant admin will most likely set up different cluster groups and quotas for enterprise developers. You can view this as the enterprise developer's quota offered at the tenant level.

Enterprise developers may not exceed these quotas:

* System-level quota while launching virtual clusters in system-level cluster groups. 
* Tenant-level quota while launching virtual clusters in their tenant-level cluster groups.

## Manage Developer Quota

To create your cluster groups, you must manage the developer quota in Palette by hiding the system-level cluster groups as follows:

1. Log in to the Palette console. 

2. In **Cluster Mode**, select **Tenant Admin** from the drop-down menu 

3. Click **Tenant Settings** in the Main Menu and select **Developer Settings**. 

4. In **Manage Developer Settings**, enable the option to `Hide system-level cluster groups from tenant users`.

5. Set the desired *User Quotas* values. Default values are as follows:

|**Resource Requirement for two Palette Virtual Clusters**|**Default Quota**|**Minimum Value**|
|--------|-------------|-------------|
|CPU|12|4|
|Memory| 16 GiB|4 GiB|
|Storage| 20 GiB|2 GiB|

Palette offers a default ephemeral-storage of 1 GiB for virtual clusters launched on the Beehive cluster group.

 You can track the status of the resource quota from **Overview** in **Main Menu** of Palette Dev Engine console.

To summarize quota allocation, each user in a tenant may create up to two Palette virtual clusters with a cumulative CPU/memory/storage quota across all their virtual clusters. Each virtual cluster may consume up to 2.5 vCPU and 2.5 GiB memory from the allocated quota.

