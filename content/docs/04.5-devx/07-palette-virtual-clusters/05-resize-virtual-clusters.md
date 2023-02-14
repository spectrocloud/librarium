---
title: "Resize Palette Virtual Clusters"
metaTitle: "Resize Palette Virtual Clusters"
metaDescription: "Learn how to resize Palette Virtual Clusters"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";



# Overview

You can resize virtual clusters from the default size of 4 CPU, 4 GiB Memory, 2 GiB Storage. The size you specify can be greater than the Cluster Group allocation. 

# Prerequisite

* A running [Palette Virtual Cluster](/devx/palette-virtual-clusters/pause-restore-virtual-clusters).

# Resize Virtual Clusters

Use the following steps to resize a virtual cluster.

1. Log in to [Palette](https://console.spectrocloud.com).

2. In App Mode, click **Virtual Clusters** in the **Main Menu**.

3. Select the virtual cluster you want to resize, and click **Settings > Cluster Settings**.

4. Click **Cluster Size** and specify new resource allocations for your virtual cluster. The size you specify can be greater than the Cluster Group allocation.

5. Save your changes.

# Validation

To verify your changes, click **Virtual Clusters** in the **Main Menu** and select the resized cluster. The virtual cluster Overview page displays the new **Allocated Quota** for the cluster.




