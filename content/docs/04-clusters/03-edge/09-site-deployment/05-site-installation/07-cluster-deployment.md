---
title: "Create Cluster Definition"
metaTitle: "Define your edge cluster using the edge hosts that have registered and available"
metaDescription: "Define your edge cluster using the edge hosts that have registered and available"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Once all the edge hosts have been registered with the Palette Management Console.

# Create Cluster

1. Click the **Clusters** tab and select **+ Add New Cluster**.

2. Select **Edge Native** as the environment and choose the cluster profile created during the modeling phase. Add additional add-ons to deploy applications inside the cluster. If you need remote access, use an add-on layer with the [Spectro Proxy](/integrations/frp) pack. This establishes a route through the Palette console to access the cluster remotely.

3. Configure cluster properties such as Virtual IP address (VIP) for the edge site and inject SSH keys.

4. Configure node pools by adding your edge hosts to the master or worker pools. Successfully registered edge devices are displayed in the *drop-down Menu*.

5. Review and save the cluster configuration.

After creating the cluster, the Palette Edge Host agent will start the installation process. You can track installation progress in Palette Management Console. The cluster overview page shows a summary of the progress. The *Events* tab displays detailed orchestration logs.

## Validation

You can validate your cluster is up and running by reviewing the cluster details page. Navigate to the left **Main Menu** and click **Clusters**. The **Clusters** page contains a list of all available clusters managed by Palette. Select the cluster to review its details page. Ensure the **Cluster Status** field displays **Running**.
