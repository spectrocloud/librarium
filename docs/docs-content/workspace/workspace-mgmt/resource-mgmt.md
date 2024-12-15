---
sidebar_label: "Resource Management"
title: "Resource Management"
description: "Learn how to monitor workload resource consumption and implement resource quotas for your workspace."
hide_table_of_contents: false
sidebar_custom_props:
  icon: "workspaces"
tags: ["workspace", "resource-management"]
---

Workspaces give you a unified view of resource consumption in specified namespaces across all clusters in the workspace.
Additionally, you can implement resource quotas for the workspace as a whole, or for individual namespaces.

## Monitor Resource Consumption

Workspaces allow you to view the workloads such as pods, deployments, daemon sets, and stateful sets in the namespaces
that comprise the workspace.

In the workspace details page, the landing **Namespaces** tab give you an overview of how much resources are consumed by
each namespace. The **CPU** and **Memory** column display the total CPU and memory consumed by the namespaces with the
same name in the entire workspace.

You can view more workloads by selecting the corresponding tab. For example, select the **Pods** tab if you want to
monitor pod workloads. Each tab will show you the CPU and memory consumption of the corresponding workload in the entire
workspace.

## Implement Resource Quotas

You can implement resource quotas on an entire workspace, as well as implement them on individual namespaces.

### Prerequisites

-

### Procedure

1. Log in to [Palette](https://console.spectrocloud.com).

2. In the **Drop-Down Menu** at the top of the page, choose the project that has your workspace.

3. On the left **Main Menu**, click **Workspaces**.

4. Click on the workspace you want to update.

5. Click **Settings** in the upper-right corner.

6. Click **Namespaces**.

7. Under **Workspace Quota**, you can specify the amount of CPU and memory that the entire workspace is allowed to
   consume. The default value is 0, which imposes no limit.

8. If you want to limit resource use based on namespaces, enter the desired CPU and memory limit in the next to the
   namespace entry.

   You can impose the limit more granularly by expanding the namespace row and enter the limit on the namespace in one
   particular cluster. You must ensure that resources alloted to individual namespaces do not exceed the workspace
   quota.

### Validate
