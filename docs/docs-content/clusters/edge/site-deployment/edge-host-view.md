---
sidebar_label: "Edge Host Grid View"
title: "Edge Host Grid View"
description: "Instructions for using the grid view of searching, filtering and ordering Edge hosts."
hide_table_of_contents: false
sidebar_position: 0
tags: ["edge"]
---

When a new Edge host registers with Palette, or when you manually add an Edge host in your Palette account. the Edge
host will show up in the **Edge Hosts** page in a grid view. You can search, filter, and order your Edge hosts by any
attribute, as well as freeze certain rows and columns to customize your view.

The grid view is accessible from the following locations:

- In the **Edge Hosts** tab when you click **Cluster** from the **Main Menu**. This shows you all Edge hosts included in
  the scope you select, including Edge hosts that are **In-use** inside a Palette cluster as well as Edge hosts that are
  ready for workloads.
- During Edge cluster creation when you are required to select Edge hosts to assign to the cluster. This will only show
  you Edge hosts that are ready to be assigned to workloads in the project where your cluster will reside.
- After an Edge cluster has been created, when you try to add new Edge hosts to an existing cluster. This will only show
  you Edge hosts that are ready to be assigned to workloads in the project where your cluster resides.

The customizations you make to the grid view is applied only to the specific location where you access the grid view.
For example, this means that if you customize the grid view in the **Edge Hosts** tab, you will not see the same
customizations in the grid view when you try to create an Edge cluster.

## Edge Host Attributes

The following table lists all the attribute columns that are available in the Edge grid view. All of the attributes are
visible by default.

| Attribute    | Description                                                                                                                                                                                                                                                              | Support Order By |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| Machine ID   | The Unique Identifier (UID) of your Edge host. You can set this attribute with the `prefix` and the `name` parameter to set this attribute for your Edge host during installation.                                                                                       | Yes              |
| Status       | The status of your Edge host. It has three possible values: **Ready** means the Edge host is ready to be assigned to a workload; **In-Use** means the Edge host is already part of an active cluster. **Unpaired** means the Edge host has not been paired with Palette. | Yes              |
| Health       | The health status of your Edge host. Once paired, an Edge host communicates its health status periodically with Palette. Possible values are **Healthy**, **Unhealthy** and a grey icon for unpaired Edge hosts.                                                         | Yes              |
| Tags         | Tags for your Edge hosts. Each tag is a key-value pair.                                                                                                                                                                                                                  | No               |
| Cluster      | The cluster that the Edge host belongs to, if it is already part of an active cluster.                                                                                                                                                                                   | Yes              |
| CPU          | The number of cores that the CPU of the Edge host has.                                                                                                                                                                                                                   | Yes              |
| Memory       | The amount of RAM that an Edge host has.                                                                                                                                                                                                                                 | Yes              |
| OS           | The operating system of the Edge host. If it is already part of a cluster, this column will show the tag of the provider image used to form the cluster.                                                                                                                 | Yes              |
| IP Address   | The IP address of the Edge host.                                                                                                                                                                                                                                         | NO               |
| MAC Address  | The MAC address of the Edge host.                                                                                                                                                                                                                                        | NO               |
| Architecture | The architecture of the Edge host's processor. Possible values are **AMD64** and **ARM64**.                                                                                                                                                                              | NO               |

## Organize Edge Host Grid View

There are many ways in which you can customize and organizae the grid view of your Edge hosts. You can

### Prerequisites

- At least one Edge host in your current scope in Palette. For more information about scope, refer to
  [Palette RBAC](../../../user-management/palette-rbac/palette-rbac.md).

### Procedure

1. Log in to Palette.

2. From the left **Main Menu**, click **Clusters**.

3. At the top of the **Clusters** page, click **Edge Hosts** tab. This will take you to the grid view of your Edge
   hosts. You can also get this view from creating a new Edge cluster, or adding an Edge host to an existing cluster.
   For more information, refer to [Create Cluster Definition](./cluster-deployment.md).

4. The following table lists the actions you can take to customize the grid view.

   | Action                         | Description                                                                                                                                                                     |
   | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Reorder Columns                | Click on the Gear icon at the top right corner of the grid. In the list of scrollable columns, drag and drop the six dots to the left of each list item to reorder the columns. |
   | Remove Column From View        | Click on the Gear icon at the top right corner of the grid. In the list of scrollable columns, uncheck the columns you want to hide from view.                                  |
   | Pin a Column                   | Click on the Gear icon at the top right corner of the grid. In the list of scrollable columns, click on the pin icon to the right of the list item you want to pin.             |
   | Filter Edge Hosts by Attribute | At the top of the grid, click on **Tags**, **Status**, and **Architecture** depending on the attribute you want to filter by, and then choose the value you want to filter by.  |
   | Order by a Column              | Click on the label row of the column you want to order by alphanumeric order. You can click it again to change the sort order. You can only sort by one column at a time.       |

### Validate

After taking the action to customize the grid view, the modified view will be reflected immediately. Confirm that the
modified view is consistent with the customization you made.
