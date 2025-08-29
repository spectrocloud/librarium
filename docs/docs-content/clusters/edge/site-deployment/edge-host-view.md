---
sidebar_label: "Edge Host Grid View"
title: "Edge Host Grid View"
description: "Instructions for using the grid view of searching, filtering and ordering Edge hosts."
hide_table_of_contents: false
sidebar_position: 65
tags: ["edge"]
---

When a new Edge host registers with Palette, or when you manually add an Edge host to your Palette account, the Edge
host will show up in the **Edge Hosts** page as well as when you try to create a new Edge cluster. The Edge hosts will
appear in a grid view, with each Edge host being a row and each attribute of the Edge host in a column. You can search,
filter, and order your Edge hosts by attributes, as well as pin certain columns to customize your view.

The grid view is accessible from the following locations:

- In the **Edge Hosts** tab when you click **Clusters** from the **Main Menu**.
- During Edge cluster creation when you are required to select Edge hosts to assign to the cluster.
- After an Edge cluster has been created, when you try to add new Edge hosts to an existing cluster.

:::info

When you access the grid view during cluster creation or expansion, only Edge hosts that are assigned to the host
cluster will show in the grid view. For example, if you are adding an Edge host to an active cluster in a project, only
Edge hosts in that project that are paired with Palette and are ready to be assigned to workloads will be displayed.
Edge hosts that are in-use by another cluster or are unpaired will not show up.

:::

The customizations you make to the grid view are applied only to the specific location where you access the grid view.
For example, if you customize the grid view in the **Edge Hosts** tab, the same customizations will not be displayed in
the grid view when you try to create an Edge cluster.

## Edge Host Attributes

The following table lists all the attribute columns that are available in the Edge grid view. All of the attributes are
visible by default. Depending on your display settings, you might need to scroll horizontally to view all columns. When
you pin a column, it will always be visible.

| Attribute    | Description                                                                                                                                                                                                                                                                           | Support Order-by |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Machine ID   | The Unique Identifier (UID) of your Edge host. You can set this attribute with the `prefix` and the `name` parameter to set this attribute for your Edge host during installation. Refer to [Installer Reference](../edge-configuration/installer-reference.md) for more information. | Yes              |
| Status       | The status of your Edge host. It has three possible values: **Ready** means the Edge host is ready to be assigned to a workload; **In-Use** means the Edge host is already part of an active cluster; **Unpaired** means the Edge host has not been paired with Palette.              | Yes              |
| Health       | The health status of your Edge host. Once paired, an Edge host communicates its health status periodically with Palette. Possible values are **Healthy**, **Unhealthy**, and a grey icon for unpaired Edge hosts.                                                                     | Yes              |
| Tags         | Tags for your Edge hosts. Each tag is a key-value pair. You can use tags to help organize your Edge hosts and filter them by tags and their values.                                                                                                                                   | No               |
| Cluster      | The cluster that the Edge host belongs to.                                                                                                                                                                                                                                            | Yes              |
| CPU          | The number of cores that the CPU of the Edge host has.                                                                                                                                                                                                                                | Yes              |
| Memory       | The amount of RAM that an Edge host has.                                                                                                                                                                                                                                              | Yes              |
| OS           | The operating system of the Edge host. If it is already part of a cluster, this column will show the tag of the provider image used to form the cluster.                                                                                                                              | Yes              |
| IP Address   | The IP address of the Edge host.                                                                                                                                                                                                                                                      | No               |
| MAC Address  | The MAC address of the Edge host.                                                                                                                                                                                                                                                     | No               |
| Architecture | The architecture of the Edge host's processor. Possible values are **AMD64** and **ARM64**.                                                                                                                                                                                           | No               |
| GPU          | The Graphics Processing Unit (GPU) information of the Edge host, including the GPU model, vendor, memory, count, and Multi-Instance GPU (MIG) capability and strategy. The MIG fields are applicable only for Nvidia devices.                                                         | No               |

## Organize Edge Host Grid View

You can customize and organize the grid view of your Edge hosts in a number of ways. You can reorder the columns, hide
certain columns, pin a column, filter Edge hosts by attribute, and order the Edge hosts alphanumerically by a column.

### Prerequisites

- At least one Edge host in your current scope in Palette. For more information about scope, refer to
  [Palette RBAC](../../../user-management/palette-rbac/palette-rbac.md).

### Procedure

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left **Main Menu**, click **Clusters**.

3. At the top of the **Clusters** page, click the **Edge Hosts** tab. This will take you to the grid view of your Edge
   hosts. You can also get this view from creating a new Edge cluster, or adding an Edge host to an existing cluster.
   For more information, refer to [Create Cluster Definition](./cluster-deployment.md).

4. The following table lists the actions you can take to customize the grid view.

   ![A screenshot of the Edge host grid view complete with arrows pointing to the elements referred to by the preceding table](/clusters_site-deployment_edge-host-view_grid_4-7.webp)

   | Number  | Action                         | Description                                                                                                                                                                   |
   | --- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | 1   | Open the grid settings         | Click on the gear icon at the top right corner of the grid to perform actions 2, 3, and 4.                                                                                    |
   | 2   | Reorder columns                | In the list of scrollable columns, drag and drop the six dots icon to the left of each list item to reorder the columns.                                                      |
   | 3   | Remove column from view        | In the list of scrollable columns, uncheck the columns you want to hide from view.                                                                                            |
   | 4   | Pin a column                   | In the list of scrollable columns, click on the pin icon to the right of the list item you want to pin.                                                                       |
   | 5   | Filter Edge Hosts by attribute | At the top of the grid, click on **Tags**, **Status**, or **Architecture** depending on the attribute you want to filter by, and then choose the value you want to filter by. |
   | 6   | Order by a column              | Click on the label row of the column you want to order by alphanumeric order. You can click it again to change the sort order. You can only sort by one column at a time.     |

### Validate

After customizing the grid view, the modified view will be reflected immediately. Confirm that the modified view is
consistent with the customization you made.
