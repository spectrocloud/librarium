---
title: "Environment Variables"
metaTitle: "Palette Dev Engine App Profile Macros"
metaDescription: "Explore Palette Dev Engine App Profile Macros"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Environment Variables

Pack environment variables are the variables defined in the App Profile and are only resolved at the cluster deployment time. The app profile variables can be:

* directly given by the developers while modelling the application profiles.

* resolved during the app instatiation.

* inherited from the lower tiers of the App Profile.

The variables are of two types:

* [The Input Variables](/devx/app-profile#inputparameters)

* [The Output Variables](/devx/app-profile#outputparameters)
<br />

## Input Variables

User-provided values that will be consumed by the current tier. It can even use output variables from below tier. This parameter resolves to a value of the variable defined in App Profile tier parameters.yaml file.

```
{{.spectro.system.[VARIABLE_NAME]}}
```
|**Supported Variables**|  Description|
|-----------------------|-------------|
|appprofile.name|Name of the app profile|
|appprofile.uid|Unique id of the app profile|
|appdeployment.name|Name of the deployment|
|appdeployment.uid|Unique id of the deployment|
|appdeployment.tiername| Resolves to a string value in the format `<deployment name>-<tier name>`|

<br />

The parameter which will be generated once the tier gets deployed. It can be consumed by the above tiers. It refers to the tier output variables of the top tiers. Refer the format and example below:

<br />

```
{{.spectro.system.apptier.<tierInput_Variable_Name>}}
```

**Example**
{{.spectro.system.apptier.NAMESPACE}}: 


## Output Variables

The variables are generated once the tier gets deployed. Output variables can be consumed by the higher tiers in the App Profile.


<br /> 


```
{{.spectro.app.$appdeploymentName.<tiername>.<tierOutput_Variable_Name>}} 
```

**Example**
{{.spectro.app.$appDepName-mongodb.PASSWORD}}: 

<br />

### Important Links to Refer Palette Environment Variables

* [Palette System Macros](/registries-and-packs/pack-constraints#packmacros)

* [Palette User Macros](/clusters/cluster-management/macros#overview)
<br />
