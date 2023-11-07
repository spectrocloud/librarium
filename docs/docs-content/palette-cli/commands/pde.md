---
sidebar_label: "PDE"
title: "PDE"
description: "Reference resource for the pde command."
hide_table_of_contents: false
sidebar_position: 40
tags: ["palette-cli"]
---

The `pde` command interacts with the Palette Dev Engine (PDE) platform and its resources. You can use the `pde` command to log in to Palette, manage virtual clusters, and switch the project scope. 

The `pde` command exposes the following subcommands.


  * [`app`](#app)           -   Manage Palette Apps deployments.

  * [`app-profile`](#app-profile)  -   Manage Palette App Profiles.

  * [`cluster-group`](#cluster-group) -   Manage Palette Cluster Groups.

  * [`registry`](#registry)      -  Manage Palette Registries for App Mode.

  * [`virtual-cluster`](#virtual-cluster) - Manage Palette Virtual Clusters.


## App

Use the `app` subcommand to manage Palette Apps deployments. The `app` subcommand supports the following subcommands.


  * `create` - Create a Palette App deployment. This command contain several subcommands. Use the `--help` flag to learn more about each subcommand or refer to the [Create](#create) section.

  * `delete` - Delete a Palette App deployment. Refer to the [Delete](#delete) section for more information.

  * `list`   - List Palette App deployments. Refer to the [List](#list) section for more information.

  * `update` - Update a Palette App deployment. Refer to the [Update](#update) section for more information.



  ### Create

  Use the `create` subcommand to create a Palette App deployment. The `create` subcommand supports the following subcommands.

  
  * `cluster-group` - Create a Palette App deployment inside a Cluster Group. A new Virtual Cluster will be created. Use the following flags to create a Palette App deployment inside a Cluster Group.

    | **Flag**              | **Description**                                                              | **Type**    |
    |-------------------|--------------------------------------------------------------------------|---------|
    | `---app-profile-name`      |  Install using a configuration file (optional). Use `-config-only` to generate a configuration file.  | string  |
    | `--app-profile-version`      | Generate configuration file only. This command will not proceed with installation.     | boolean    |
    | `--cluster-group-name`   | Validate prerequisites for environment. Do not proceed with installation. |  boolean      |
    | `--cpu` | CPUs (optional). Defaults to 4 cores. (default 4) | int |
    | `--memory`| Memory (GB) (optional). Defaults to 4GB. (default 4) | int|
    | `--name` | The name of the App deployment. | string |
    | `--storage`|  Storage (GB) (optional). Defaults to 4GB. (default 4)| int |
    | `--virtual-cluster-name`| The name of the new Virtual Cluster.  | string |

  * `interactive`   - Create a Palette App deployment in an interactive mode.

  * `virtual-cluster` - Create a Palette App deployment inside an existing Virtual Cluster. Use the following flags to create a Palette App deployment inside an existing Virtual Cluster.

    | **Flag**              | **Description**                                                              | **Type**    |
    |-------------------|--------------------------------------------------------------------------|---------|
    | `---app-profile-name`      |  Install using a configuration file (optional). Use `-config-only` to generate a configuration file.  | string  |
    | `--app-profile-version`      | Generate configuration file only. This command will not proceed with installation.     | boolean    |
    | `--name` | The name of the App deployment. | string |
    | `--virtual-cluster-name`| The name of the new Virtual Cluster.  | string |


  ### Delete

  Use the `delete` subcommand to delete a Palette App deployment. The `delete` requires the name of the App deployment to delete. Use the `--name` flag to specify the name of the App deployment to delete.

  | **Flag**              | **Description**   | **Type**    |
  |-------------------|-----------------------|---------|
  | `--name` | The name of the App deployment. | string |
  | `--help` | Help for the `delete` subcommand. | - |

  <br />

  ### List

  Use the `list` subcommand to list all Palette App deployments. The `list` subcommand supports the following flags. 


  | **Flag**  | **Description**    | **Type** |
  |-----------| ------------------ | -------- |
  | `--name` | The name of the App deployment. | string | 
  | `--help` | Help for the `list` subcommand. | - |



  ### Update

  Use the `update` subcommand to update an App deployment. The `update` subcommand supports the following flags.

  | **Flag**              | **Description**   | **Type**    |
  | ------------------- | --------------------------------------------------------------------------|---------|
  | `--name` | The name of the App deployment. Only Apps pending an App Profile update are eligible for an update. | string |
  | `--help` | Help for the `update` subcommand. | - |



## App Profile

Use the `app-profile` subcommand to manage app profiles. The `app-profile` command supports the following subcommands.

  * `create` - Create an app profile

  * `delete` - Delete an app profile

  * `describe` - Describe an app profile

  * `list`   - List app profiles

  * `versions` - List the versions of an app profile



  ### Create

  Use the `create` subcommand to create an app profile. You have two options to create an app profile. You can create an app profile using a configuration file or in interactive mode. The `create` subcommand supports the following subcommands.

  * `from-config` - Create an app profile from an app profile configuration file.

  * `interactive` - Create an app profile in interactive mode.


  #### From Config

  You can create an app profile using a configuration file. The configuration file must be in YAML format. The `from-config` subcommand supports the following flags.

  | **Flag**              | **Description**   | **Type**    |
  |-------------------|-----------------------|---------|
  | `--config-file` | The path to the app profile configuration file. | string |
  | `--help` | Help for the `from-config` subcommand. | - |s


:::tip

You can create an app profile config file by using the `interactive` subcommand with the `--config-only` flag.

```shell hideClipboard
palette pde app-profile create interactive --config-only
```
The configuration file will be created in the $HOME directory, under the `~/.palette/pde/app-profiles/` folder.

:::


#### Interactive

Use the interactive subcommand to create an app profile in interactive mode. The `interactive` subcommand supports the following flags.

  | **Flag**              | **Description**   | **Type**    |
  |-------------------|-----------------------|---------|
  | `--config-only`| Generate configuration file only. This command will not proceed with installation.     | boolean    |
  | `--help` | Help for the `interactive` subcommand. | - |



### Delete

Use the `delete` subcommand to delete an app profile. To delete an app profile, you must provide the name and version of the app profile. The `delete` subcommand supports the following flags.

  | **Flag**              | **Description**   | **Type**    |
  |-------------------|-----------------------|---------|
  | `--name` | The name of the app profile. | string |
  | `--version` | The version of the app profile. | string |
  | `--help` | Help for the `delete` subcommand. | - |


### Describe

Use the `describe` subcommand to describe an app profile. To describe an app profile, you must provide the name and version of the app profile. The `describe` subcommand supports the following flags.

  | **Flag**              | **Description**   | **Type**    |
  |-------------------|-----------------------|---------|
  | `--name` | The name of the app profile. | string |
  | `--version` | The version of the app profile. | string |
  | `--help` | Help for the `describe` subcommand. | - |


### List

Use the `list` subcommand to list all app profiles. The `list` subcommand supports the following flags.

  | **Flag**              | **Description**   | **Type**    |
  |-------------------|-----------------------|---------|
  | `--name-filter` | Filter the list of app profiles by providing a name. | string |
  | `--help` | Help for the `list` subcommand. | - |


### Versions

Use the `versions` subcommand to list all versions of an app profile. To list all versions of an app profile, you must provide the name of the app profile. The `versions` subcommand supports the following flags.

  | **Flag**              | **Description**   | **Type**    |
  |-------------------|-----------------------|---------|
  | `--name` | The name of the app profile. | string |
  | `--help` | Help for the `versions` subcommand. | - |

## Cluster Group

Use the `cluster-group` command to change the cluster group that commands will target. You can also list all available clusters. The `cluster-group` supports the following subcommands.

  * `list`   -      List Palette Cluster Groups.

  * `switch` -      Switch your active Palette Cluster Group.


  ### List

  Use the `list` subcommand to list all Palette Cluster Groups. No additional flags are required.

  ### Switch

  Use the `switch` subcommand to switch your active cluster group. The `switch` subcommand supports the following flags.

  | **Flag**              | **Description**   | **Type**    |
  |-------------------|-----------------------|---------|
  | `--name` | The name of the cluster group. | string |
  | `--scope`| The scope of the cluster group. Allowed values are `project`, `tenant`, and `system`. | string |
  | `--help` | Help for the `switch` subcommand. | - |


## Registry

Use the `registry` subcommand to manage Palette Registries for App Mode. The `registry` subcommand supports the following subcommands.

  * `create` - Create a Palette Registry.

  * `delete` - Delete a Palette Registry.

  * `list`   - List Palette Registries. 


  ### Create

  The `create` subcommand creates a Palette Registry. You can specify an Open Container Initiative (OCI) registry or a Helm registry. Use the subcommand `oci` or `helm` to specify the type of registry you want to create. The `create` subcommand supports the following subcommands. 

  * `oci` - Create an OCI registry. Use the following flags to create an OCI registry.

  * `helm` - Create a Helm registry. Use the following flags to create a Helm registry.

  The following flags are supported by the `oci` and `helm` subcommands.
  
  | **Flag**              | **Description**                                                              | **Type**    |
  |-------------------|--------------------------------------------------------------------------|---------|
  | `--endpoint` | The endpoint of the registry. | string |
  | `--help` | Help for the `oci` or the `helm` subcommand. | - |
  | `--username` | The username of the OCI registry. | string |
  | `--password` | The password of the OCI registry. | string |

  The following example shows how to create an OCI registry.

  ```shell hideClipboard
  palette pde registry create oci --endpoint https://harbor.internal.abc.org  \
  --name internal-packs --username harbor --password *********
  ```



  ### List

  The `list` subcommand lists all Palette Registries available in App Mode. The `list` subcommand supports the following flags.

  | **Flag**  | **Description**      | **Type**    |
  |-----------|----------------------|---------|
  | `--type` | The type of registry. Allowed values are `oci` and `helm`. | string |
  | `--help` | Help for the `list` subcommand. | - |


  ### Delete

  The `delete` subcommand deletes a Palette Registry from App Mode. You can specify an Open Container Initiative (OCI) registry or a Helm registry. Use the type flag `--type` to specify the type of registry you want to delete. The `delete` subcommand supports the following flags.

  | **Flag**              | **Description**                                                              | **Type**    |
  |-------------------|--------------------------------------------------------------------------|---------|
  | `--name` | The name of the registry. | string |
  | `--type` | The type of registry. Allowed values are `oci` and `helm`. | string |
  | `--help` | Help for the `delete` subcommand. | - |

## Virtual Cluster

You can use the `virtual-cluster` subcommand to manage Palette Virtual Clusters. Below is a list of the supported subcommands you can use. Use the `--help` flag to learn more about each subcommand.

- `create` - Create a virtual cluster.


- `delete` - Delete a virtual cluster.


- `download-kubeconfig` - Download the kubeconfig for a virtual cluster.


- `events` - View events for a virtual cluster.


- `lifecycle` - Pause or resume a virtual cluster.


- `list` - List all virtual clusters.


- `resize` - Resize a virtual cluster.


### Create

Use the `create` subcommand to create a virtual cluster. The `create` subcommand supports the following flags.

| **Flag**              | **Description**                                                              | **Type**    |
|-------------------|--------------------------------------------------------------------------|---------|
| `--cluster-group-name` | The name of the Cluster Group. Defaults to the active cluster group.  | string |
| `--cpu` | CPUs (optional). Defaults to 4 cores. (default 4) | int |
| `--memory`| Memory (GB) (optional). Defaults to 4GB. (default 4) | int|
| `--name` | The name of the Virtual Cluster. | string |
| `--storage`|  Storage (GB) (optional). Defaults to 4GB. (default 4)| int |
| `--tags`|  A list of tags separated by commas  (optional) | strings |
| `--help` | Help for the `create` subcommand. | - |

Example

```shell hideClipboard
palette pde virtual-cluster create --cpu 4 --memory 4 --storage 4 --name dev-cluster --tags "environment:dev,cli,qa-team"
``` 


### Delete

Use the `delete` subcommand to delete a Palette Virtual Cluster. The `delete` subcommand requires the name of the Virtual Cluster to delete. Use the `--name` flag to specify the name of the Virtual Cluster to delete.

| **Flag**              | **Description**                                                              | **Type**    |
|-------------------|--------------------------------------------------------------------------|---------|
| `--name` | The name of the Virtual Cluster. | string |
| `--help` | Help for the `delete` subcommand. | - |



### Download Kubeconfig

Use the `download-kubeconfig` subcommand to download the kubeconfig for virtual cluster. The `download-kubeconfig` subcommand requires the name of the Virtual Cluster. Use the `--name` flag to specify the name of the virtual cluster.

| **Flag**    | **Description**    | **Type**    |
|-------------------|--------------------------------------------------------------------------|---------|
| `--name` | The name of the Virtual Cluster. | string |
| `--path` | Download path for Kubeconfig file (optional). Default is `$HOME/.kube/<virtual-cluster-name>.conf` | string |
| `--help` | Help for the `download-kubeconfig` subcommand. | - |


Example

```shell hideClipboard
palette pde virtual-cluster download-kubeconfig --name cli-cluster --path ~/projects/spectro-cloud/kubeconfig/cli-cluster.config
```
```shell hideClipboard
Downloaded kubeconfig for Virtual Cluster cli-cluster
Kubeconfig location: /Users/demo/projects/spectro-cloud/kubeconfig/cli-cluster.config
```

### Events

Use the `events` subcommand to view event logs for a virtual cluster. The `events` subcommand requires the name of the Virtual Cluster. Use the `--name` flag to specify the name of the virtual cluster.

| **Flag**    | **Description**    | **Type**    |
|-------------|-----------------|---------|
| `--name` | The name of the Virtual Cluster. | string |
| `--limit`| Event limit (optional). Maximum number of events to return. (default 5) | int |
| `--max-age`| Maximum event age in minutes (optional) (default -1) | int |
| `--severity`| Event severity (optional). One or more of: [ Normal | Warning | Error ], comma-separated. | string
| `--help` | Help for the `events` subcommand. | - |



### Lifecycle

Use the `lifecycle` subcommand to pause or resume a virtual cluster. The `lifecycle` subcommand requires the name of the virtual cluster and the action type.  Use the `--name` flag to specify the name of the virtual cluster, and the `--action` flag to specify the action type. The action type can be `pause` or `resume`.

| **Flag**    | **Description**    | **Type**    |
|-------------|-----------------|---------|
| `--name` | The name of the Virtual Cluster. | string |
| `--action`| The action type. Allowed values are `pause` and `resume`. | string |
| `--help` | Help for the `lifecycle` subcommand. | - |

Example

```shell hideClipboard
palette pde virtual-cluster lifecycle --name cli-cluster --action pause
```

<br />

```shell hideClipboard
palette pde virtual-cluster lifecycle --name cli-cluster --action resume
```

### List

Use the `list` subcommand to list all available virtual clusters. No additional flags are required.

### Resize

Use the `resize` subcommand to resize a virtual cluster. The `resize` subcommand requires the name of the virtual cluster and the new size.  Use the `--name` flag to specify the name of the virtual cluster, and the `--size` flag to specify the new size.

| **Flag**    | **Description**    | **Type**    |
|-------------|-----------------|---------|
| `--name` | The name of the virtual cluster. | string |
| `--cpu`| CPUs (optional). Defaults to 4 cores. (default 4) | int |
| `--memory`| Memory (GB) (optional). Defaults to 4GB. (default 4) | int|
| `--storage`|  Storage (GB) (optional). Defaults to 4GB. (default 4)| int |
| `--help` | Help for the `resize` subcommand. | - |

Example

```shell hideClipboard
palette pde virtual-cluster resize --name cli-cluster --cpu 4 --memory 4 --storage 4
```
```shell hideClipboard
Resized Virtual Cluster cli-cluster
```