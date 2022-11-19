---
title: "Pause and Resume Palette Virtual Clusters"
metaTitle: "Palette Dev Engine Pause and Restore Palette Virtual Clusters"
metaDescription: "Pause and Restore Palette Virtual Clusters"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Overview

To optimize resource utilization, Palette allows you to pause and resume virtual clusters that are not in use. This adds significant flexibility in managing operating costs and resource management for virtual clusters. 

# Prerequisite

* A Running [Palette Virtual Cluster](/devx/sandbox-clusters#createyoursandboxcluster:).

#  Pause and Resume a Palette Virtual Cluster

Invoke the pause and resume operations from the Palette Console.

1. Log in to the **Palette Dev Engine** console.


2. Navigate to the **Main Menu** and select **Palette Virtual Cluster** to be paused.


3. Go to the cluster details page by clicking the name of the virtual cluster to be paused.


4. Click **Settings** and select the **Pause** option. To resume a paused virtual cluster, select the **Resume** option.

# Validate the Pause or Resume Status of a Palette Virtual Cluster

1. In the cluster detail page of the Palette Virtual Cluster shows the cluster **Status** as:

*  **Paused**: For a paused virtual cluster
*  **Running**: For a resumed or running virtual cluster
