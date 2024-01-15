---
sidebar_label: "App Logs"
title: "App Logs"
description: "Download Palette application logs."
hide_table_of_contents: false
sidebar_position: 20
tags: ["devx", "app mode", "pde"]
---

Palette Dev Engine (PDE) provides access to application configuration and status logs for each application. The following files are available for download.

| **File**                  | **Description**                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **cloudconfig.yaml**      | The cluster configuration file, which contains Kubernetes specifications for the cluster.                          |
| **manifest.yaml**         | The generated manifest file, which contains pack details.                                                          |
| **spec_description.yaml** | A file that contains metadata about clusters and applications. This file captures status probes and their results. |

:::info

To download cluster logs, navigate to the cluster's **Overview** page and select **Settings** > **Download Logs**. Select the log files you want to review.

:::

## Download Application Logs

Use the steps below to download application logs. The download bundle is a zip file containing all the log files.

### Prerequisites

- A deployed application in app mode.

- Access to view the application and its logs.

### Download Logs

1. Log in to [Palette](https://console.spectrocloud.com).

2. If you are not already in App Mode, navigate to the **User Menu** and select **Switch to App Mode**.

3. On the left **Main Menu**, select **Apps**.

4. Select you application.

5. Click the **Actions** drop-down menu.

6. Select **Download Logs**.

7. A message displays with the download link.

8. Click the download link and review the files.

### Validate

To review the logs, locate a zip file with file name format `[clusterNameHere]-logs-[currentTimeStamp]` in the downloads folder on your device.
