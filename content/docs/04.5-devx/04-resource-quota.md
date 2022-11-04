---
title: "Resourse Quota"
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

Palette allocates quota to developers using the Palette cluster group(s) to try out our free tier offering. They may launch (vanilla) sandbox clusters or deploy apps to new sandbox clusters or existing ones. Developers will end up using their quota defined at the system level while exploring the capabilities offered by Palette (SaaS). 


At the same time, our Enterprise developers might offer the above capabilities to their internal developers, i.e., enterprise developers. These enterprise developers (in theory) could use the system-level quota offered to every other developer. Still, in all likelihood, the tenant admin will set up different cluster groups(s) and quotas for enterprise developers. You may view this as the enterprise developer's quota offered at the tenant level.
Enterprise developers may not exceed their system-level quota while launching sandbox clusters in system-level cluster group(s). In addition, they may not exceed their tenant-level quota while launching sandbox clusters in their tenant-level cluster groups.

## Manage the developer Quota

The developer quota can be managed through the Palette Platform as below:

1. Login to the Palette console as Tenant Admin, go to Tenant Settings and select `Developer Settings.


2. In the wizard to Manage Developer Settings, there is an option to `Hide system-level cluster groups from tenant users` using the toggle button. You will have to create your cluster groups by hiding the system-level cluster groups.


3. Set the desired *User Quotas* values.  The user quotas have the following default values:

|**Resource Requirement for 2 Sandbox Clusters**|**Default Quota**|**Minimum Value**|
|--------|-------------|-------------|
|CPU|12|4|
|Memory| 16 GiB|4 GiB|
|Storage| 20 GiB|2 GiB|

<InfoBox>
The Quota allocation can be interpreted as - Each user in this tenant may create up to 2 sandbox clusters and has a cumulative CPU/Memory/Storage quota across all their sandbox clusters. Each sandbox cluster may consume up to 2.5 vCPU and 2.5 GiB memory from the allocated quota.
</InfoBox>

<br />

