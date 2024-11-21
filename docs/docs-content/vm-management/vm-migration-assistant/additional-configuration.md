---
sidebar_label: "Additional Configuration"
title: "VM Migration Assistant Additional Configuration"
description: "Learn how to configure additional settings in the VM Migration Assistant"
icon: " "
hide_table_of_contents: false
sidebar_position: 30
tags: ["vmo", "vm migration assistant"]
#toc_max_heading_level: 4
---

## Configure Overview Settings

<Tabs queryString="overview">

<TabItem label="Overview" value="overview">

You can configure parameters related to tuning on the **Overview > Overview Tab**.

![Overview - Overview Tab Settings](/vm-management_vm-migration-assistant_additional-configuration_overview-settings.webp)

To change a setting, click the pencil icon next to each value, and adjust the value in the pop-up window. Click **Save**
after making changes.

The available parameters are described in the following table.

| Parameter                                     | Description                                                                                                                         | Default Value |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **Max concurrent virtual machine migrations** | The maximum number of VMs per plan that can be migrated simultaneously.                                                             | `20`          |
| **Controller main container CPU limit**       | The CPU limit (in milliCPU) allocated to the main container in the controller pod.                                                  | `500m`        |
| **Controller main container Memory limit**    | The Memory limit (in mebibytes) allocated to the main container in the controller pod.                                              | `800Mi`       |
| **Precopy interval (minutes)**                | _(Only applicable to warm migrations)_ The interval time for when a new snapshot is requested prior to initiating a warm migration. | `60`          |
| **Snapshot polling interval (seconds)**       | _(Only applicable to warm migrations)_ The frequency to which the snapshot status is checked during creation and removal.           | `10`          |

</TabItem>

<TabItem label="YAML" value="yaml">

View and edit the Custom Resource Definition for the VM Migration Assistant in YAML format on this tab.

_Link to YAML schema (CRD)._

</TabItem>

<TabItem label="Metrics" value="metrics">

View your migration metrics on the **Overview > Metrics Tab**.

To change the time period displayed for the Migrations and Virtual Machine Migrations graphs, click the three-dot Menu
at the top-right of each graph. You can then select from 7 days, 31 days, and 24 hours.

![Overview - Metrics Tab](/vm-management_vm-migration-assistant_additional-configuration_overview-metrics.webp)

</TabItem>

</Tabs>

## Configure Provider Settings

| Setting | Description | Values |
| ------- | ----------- | ------ |

### Validate

TBC

## Configure Plan Settings

| Setting | Description | Values |
| ------- | ----------- | ------ |

### Validate

TBC

## Configure StorageMap Settings

| Setting | Description | Values |
| ------- | ----------- | ------ |

### Validate

TBC

## Configure NetworkMap Settings

| Setting | Description | Values |
| ------- | ----------- | ------ |

### Validate

TBC
