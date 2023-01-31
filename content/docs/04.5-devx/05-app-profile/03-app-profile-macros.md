---
title: "Output Variables"
metaTitle: "Palette Dev Engine Output Variables"
metaDescription: "Explore Palette Dev Engine App Profile Macros"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Output Variables

Palette Dev Engine output variables are defined in the App Profile and are only resolved at cluster deployment time. The output variables have the following properties:

* May be referenced by specifying them during app profile creation.

* Output variables are inherited from the lower tiers of the app profile.

* Each service type exposes a set of unique output variables. 



The variables are generated once the server layer or tier gets deployed. Output variables can be consumed by the higher tier layers in the app profile. 

Check out the [Services Connectivity](/devx/app-profile/services/connectivity) page to learn how to use output variables for establishing network connectivity between services.


<br /> 


```
{{.spectro.app.$appdeploymentName.<tiername>.<tierOutput_Variable_Name>}}
```

<!-- # System Output Variables

The following output variables are globally available for all services.

| Output Variable | Description |
| --- | --- |
| spectro.macro.cloudanix.partnerIdentifier | |
| spectro.system.user.name | |
| spectro.system.user.uid | |
| spectro.system.user.email | |
| spectro.system.tenant.uid | |
| spectro.system.project.uid | |
| spectro.system.project.name | |
| spectro.system.cluster.uid | |
| spectro.system.cluster.name | |
| spectro.system.kubernetes.version | |
| spectro.system.reverseproxy.server | |
| spectro.system.reverseproxy.port | |
| spectro.system.reverseproxy.vhostport | |
| spectro.system.reverseproxy.protocol | |
| spectro.system.cloud.type | |
| spectro.system.cloud.region | |
| spectro.system.cloud.image.id | |
| spectro.system.apptier.name | |
| spectro.system.apptier.uid | |
| spectro.system.appprofile.name | |
| spectro.system.appprofile.uid | |
| spectro.system.appdeployment.uid | |
| spectro.system.appdeployment.name | |
| spectro.system.appdeployment.tiername | |
| spectro.system.appdeployment.ingress.host | |
| spectro.app.$appDeploymentName.#tierName.#tierOutputParam | |
| spectro.system.apptier.#tierInputParam | | -->



# Resources

* [Palette System Macros](/registries-and-packs/pack-constraints#packmacros)

* [Palette User Macros](/clusters/cluster-management/macros#overview)
<br />
