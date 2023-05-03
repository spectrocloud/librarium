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

* A Running [Palette Virtual Cluster](/devx/palette-virtual-clusters/pause-restore-virtual-clusters).

#  Pause and Resume a Palette Virtual Cluster

Invoke the pause and resume operations from the Palette Console.

1. Log in to the **Palette Dev Engine** console.


2. Navigate to the **Main Menu** and select **Palette Virtual Cluster** to be paused.


3. Go to the cluster details page by clicking the name of the virtual cluster to be paused.


4. Click **Settings** and select the **Pause** option. To resume a paused virtual cluster, select the **Resume** option.

# Validate Pause/Resume

You can verify the state of a cluster by reviewing the cluster details. To review the state of a cluster and its details, do the following steps.

1. First, navigate to the left "Main Menu" on the Palette Dev Engine console and click on Virtual Clusters.


2. Click on the specific cluster you want to check the status. This will take you to the cluster detail page. On this page, look for a section titled Status. The status section displays the current state of the cluster.


3. The Palette Virtual Cluster shows the following cluster **Status**:

*  **Paused**: For a paused virtual cluster
*  **Running**: For a resumed or running virtual cluster

**Note:** The status of a Palette Virtual cluster can also be viewed against the cluster name, in the existing cluster listing page of Palette Dev Engine console.

