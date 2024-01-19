---
sidebar_label: "Pause and Resume Virtual Clusters"
title: "Pause and Resume Virtual Clusters"
description: "Learn how to pause and resume Palette Virtual Clusters."
hide_table_of_contents: false
sidebar_position: 0
tags: ["devx", "app mode", "pde"]
---

To optimize resource utilization, Palette allows you to pause and resume virtual clusters that are not in use. This adds significant flexibility in managing operating costs and resource management for virtual clusters.

## Prerequisite

- An active [Palette Virtual Cluster](palette-virtual-clusters.md).

## Pause and Resume a Palette Virtual Cluster

Invoke the pause and resume operations from the Palette Console.

1. Log in to the **Palette Dev Engine** console.

2. Navigate to the **Main Menu** and select **Palette Virtual Cluster** to be paused.

3. Go to the cluster details page by clicking the name of the virtual cluster to be paused.

4. Click **Settings** and select the **Pause** option. To resume a paused virtual cluster, select the **Resume** option.

## Validate Pause/Resume

You can verify the state of a cluster by reviewing the cluster details. To review the state of a cluster and its details, do the following steps.

1. First, navigate to the left "Main Menu" on the Palette Dev Engine console and click on Virtual Clusters.

2. Click on the specific cluster you want to check the status. This will take you to the cluster detail page. On this page, look for a section titled Status. The status section displays the current state of the cluster.

3. The Palette Virtual Cluster shows the following cluster **Status**:

- **Paused**: For a paused virtual cluster
- **Running**: For a resumed or running virtual cluster

:::tip

The status of a virtual cluster can also be viewed on the cluster listing page. The health column displays the status of the virtual cluster.

:::
