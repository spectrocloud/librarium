---
sidebar_label: "Resize Virtual Clusters"
title: "Resize Virtual Clusters"
description: "Learn how to resize Palette Virtual Clusters"
hide_table_of_contents: false
sidebar_position: 10
tags: ["devx", "app mode", "pde"]
---

You can resize virtual clusters from the default size of 4 CPU, 4 GiB Memory, 2 GiB Storage to a size that does not exceed the system-level quota for a cluster group like Beehive or the user quota for tenant-level cluster groups.

## Prerequisite

- An active and healthy [virtual cluster](palette-virtual-clusters.md).

## Resize Virtual Clusters

Use the following steps to resize a virtual cluster.

1. Log in to [Palette](https://console.spectrocloud.com).

2. In App Mode, click **Virtual Clusters** in the **Main Menu**.

3. Select the virtual cluster you want to resize, and click **Settings > Cluster Settings**.

4. Click **Cluster Size** and specify new resource allocations for your virtual cluster. The size you specify cannot be greater than the system-level quota for a cluster group like Beehive or the user quota for tenant-level cluster groups. To learn more about resource quotas, refer to the [resource quota](../manage-dev-engine/resource-quota.md) documentation.

5. Save your changes.

## Validate

To verify your changes, click **Virtual Clusters** in the left **Main Menu** and select the resized cluster. The virtual cluster Overview page displays the new **Allocated Quota** for the cluster.
