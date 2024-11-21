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

### Configure

| Name                                          | Description                                                                                                                         | Default Value | Values                                |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------- |
| **Max concurrent virtual machine migrations** | The maximum number of VMs per plan that can be migrated simultaneously.                                                             | `20`          |                                       |
| **Controller main container CPU limit**       | The CPU limit (in milliCPU) allocated to the main container in the controller pod.                                                  | `500m`        | `200m` / `500m` / `2000m` / `8000m`   |
| **Controller main container Memory limit**    | The Memory limit (in mebibytes) allocated to the main container in the controller pod.                                              | `800Mi`       | `200Mi` / `800Mi` / `2000m` / `8000m` |
| **Precopy interval (minutes)**                | _(Only applicable to warm migrations)_ The interval time for when a new snapshot is requested prior to initiating a warm migration. | `60`          | `5` / `30` / `60` / `120`             |
| **Snapshot polling interval (seconds)**       | _(Only applicable to warm migrations)_ The frequency to which the snapshot status is checked during creation and removal.           | `10`          | `1` / `5` / `10` / `60`               |

### Validate

TBC

## Configure Provider Settings

### Configure

| Setting | Description | Values |
| ------- | ----------- | ------ |

### Validate

TBC

## Configure Plan Settings

### Configure

| Setting | Description | Values |
| ------- | ----------- | ------ |

### Validate

TBC

## Configure StorageMap Settings

### Configure

| Setting | Description | Values |
| ------- | ----------- | ------ |

### Validate

TBC

## Configure NetworkMap Settings

### Configure

| Setting | Description | Values |
| ------- | ----------- | ------ |

### Validate

TBC
