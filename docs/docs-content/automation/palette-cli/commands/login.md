---
sidebar_label: "Login"
title: "Login"
description: "Reference resource for the login command."
hide_table_of_contents: false
sidebar_position: 20
tags: ["palette-cli"]
---

The `login` command authenticates the Palette CLI with Palette. The `login` command can be used in interactive mode,
which prompts you for required values. Or, you can use flags to provide the command with all the required values such as
the API key, the organization ID, and the Palette URL.

<br />

| **Flag**                | **Description**                                                                                                            | **Type** |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------- |
| `--api-key`             | Palette API key (omit for interactive login).                                                                              | string   |
| `--cluster-group-name`  | Palette Cluster Group name (optional). Specifies the active Cluster Group.                                                 | string   |
| `--cluster-group-scope` | Palette Cluster Group scope. Required with `--cluster-group-name`. Allowed values are: `project`, `tenant` , and `system`. | string   |
| `--console-url`         | Palette URL (omit for interactive login).                                                                                  | string   |
| `--help`                | Help for the `login` subcommand.                                                                                           | -        |
| `--insecure`            | Skip Transport Layer Security (TLS) (bypass x509 verification).                                                            | -        |
| `--org`                 | Palette Organization name (omit for interactive login).                                                                    | string   |
| `--project`             | Palette Project name (optional). Specifies the active Project.                                                             | string   |

### Examples

<br />

```shell hideClipboard
palette login --api-key 123456789 --org demo-org --console-url https://console.spectrocloud.com
```

If you want to target a specific project when using the `login` command, use the `--project` flag.

<br />

```shell hideClipboard
palette login  \
 --api-key 123456789 \
 --org demo-org  \
 --console-url https://console.spectrocloud.com \
 --project dev-team
```

Upon successful login, a local configuration file named **palette.yaml** is created. This file contains the metadata for
CLI operations and is created in your $HOME directory under the folder name **.palette**. The following output is an
example of a **palette.yaml** configuration file. Sensitive values, such as passwords, tokens, and API keys are
encrypted at rest.

<br />

```yaml hideClipboard
paletteConfig:
  organization: demo-org
  scope: tenant
  projectName: dev-team
  projectUid: 6342eab2faa0813ead9082e0
  clusterGroupName: beehive
  clusterGroupUid: 635669ba4583891d109fe6c0
  tenantUid: 40b8a9a7f724831be814e5734ea744ed
  ubuntuConfig:
    enablefips: false
    token: ""
  scarConfig:
    scarLoc: ""
    scarUsername: ""
    scarPassword: ""
  mgmt:
    apikey: ************************
    endpoint: https://console.spectrocloud.com
    insecure: false
    pairingcode: ""
runLoc: /Users/demo/.palette/
workspaceLoc: /Users/demo/.palette
```
