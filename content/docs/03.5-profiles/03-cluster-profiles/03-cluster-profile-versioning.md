---
title: "Cluster Profile Versioning"
metaTitle: "Cluster Profile Versioninge"
metaDescription: "Learn how to version a cluster profile in Palette."
icon: ""
hideToC: true
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

## Cluster Profile Versioning

Palette enables allows you to create multiple versions of a cluster profile using the same profile name. The **Version** field of the cluster profile creation wizard uses the following versioning format. Only numbers supported. 

`major.minor.patch`
         
Profile versioning is an optional field with a default value of `1.0.0`. You can create multiple versions of a cluster profile under a single profile name and each of these versions can have its own pack configurations. Profile versions are backward compatible with profile changes. 
 
<!-- Cluster profile versions are grouped under their unique names and their uniqueness is decided by the name and version within the scope and promotes backward compatibility to profile changes. -->

Palette displays multiple profile versons under one cluster profile name. For example, a profile named *nginx-ingress* that has two major versions, 1.0.0 and 2.0.0, would be listed in the **drop-down Menu** next to the profile name when you navigate to **Profiles** > **Cluster Profiles** and select the profile. You can edit the version number displayed in the **drop-down Menu** next to the profile name.

<WarningBox>

When you delete a profile that has multiple versions, navigate to **Profiles** > **Cluster Profiles**, select the profile ....
          
<<<COME BACK TO THIS>>>

