---
sidebar_label: "Pack Monitoring"
title: "Pack Monitoring"
description: "Learn how to to monitor the status of packs in Palette"
hide_table_of_contents: false
sidebar_position: 140
---

Palette provides a color scheme to help you monitor pack installation progress during Palette Workload Cluster deployment. Different colors represent stages of pack installation so you can track the progress of packs as they are added to a cluster.

The Cluster Profile page displays the list of packs associated with the cluster you are monitoring. In addition, the page also includes information on the status and the installation progress of the installed packs. The following are the possible pack statuses.


| **Indicator Status**                       | **Description**                                                     |
| ------------------------------------       | ------------------------------------------------------------------- |
| <p style={{"color":"gray"}}>**Gray**</p>   | The pack is onboarding, and it's right before the deployment stage. |
| <p style={{"color":"blue"}}>**Blue**</p>   | The pack is in processing mode.                                     |
| <p style={{"color":"green"}}>**Green**</p> | The pack installation is successful.                                |
| <p style={{"color":"red"}}>**Red**</p>     | The pack installation has failed.                                   |



## Cluster Profiles Pack Status

The following image shows the pack status for a cluster profile.

![An image of a cluster profile with various pack statuses.](/pack_status.png)
