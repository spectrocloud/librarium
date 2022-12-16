---
title: "Pack Monitoring"
metaTitle: "Monitoring Packs in Palette"
metaDescription: "How to monitor the status of packs in Palette"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";


# Pack Monitoring

Palette provides a color scheme to help you monitor pack installation progress during Palette Workload Cluster deployment. Different colors represent stages of pack installation so you can track the progress of packs as they are added to a cluster.

The Cluster Profile page displays the list of packs associated with the cluster you are monitoring. In addition, the page also includes information on the status and the installation progress of the installed packs. The following are the possible pack statuses.

<br />
<br />

| **Indicator Status**                 | **Description**                                                     |
| ------------------------------------ | ------------------------------------------------------------------- |
| <p style="color:gray">**Gray**</p>   | The pack is onboarding, and it's right before the deployment stage. |
| <p style="color:blue">**Blue**</p>   | The pack is in processing mode.                                     |
| <p style="color:green">**Green**</p> | The pack installation is successful.                                |
| <p style="color:red">**Red**</p>     | The pack installation has failed.                                   |


<br />
<br />

#### Cluster Profiles Pack Status

![Pack_Status](pack_status.png)


<br />
<br />




