---
title: "Logs"
metaTitle: "Palette Dev Engine App Logs"
metaDescription: "Palette Dev Engine expose the ability to download applications logs."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import InfoBox from 'shared/components/InfoBox';
import WarningBox from 'shared/components/WarningBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# Application Logs

Palette Dev Engine (PDE) provides access to application configuration and status logs for each application. The following files are available for download.

| File                      | Description                                                                                                                 |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| **cloudconfig.yaml**      | The configuration file of the cluster. Contains the Kubernetes specifications of the cluster.                               |
| **manifest.yaml**         | The generated manifest file that contains the Pack details.                                                                 |
| **spec_description.yaml** | A file that contains meta data about the cluster and application. Status probes and their status are captured in this file. |


<InfoBox>

You can download cluster log files by visiting the cluster's overview page and selecting **Settings** > **Download Logs**. Select the log files you want to review.

</InfoBox>


# Download Application Logs

Use the steps below to download the application log files. The download bundle is a zip file containing all the log files.


## Prerequisites

* A deployed application in app mode. 

* Access to view the application and its logs.


## Dowload Logs

1. Log in to [Palette](https://console.spectrocloud.com)


2. Navigate to the **User Menu** and select **Switch to App Mode**. If you are already in app mode view, move to the next step.


3. On the left **Main Menu**, select **Apps**.


4. Select you application.


5. Click on the **Actions** drop-down Menu. 


6. Select **Download Logs**. 


7. A message will pop up with the download link.


8. Click on the download link and review the files.


## Validation

To review the downloaded files, inspect your downloads folder on your device. Search for a zip file with the following file format: `[clusterNameHere]-logs-[currentTimeStamp]`.