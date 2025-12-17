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

## Prerequisites

- You must provide an encryption passphrase to secure sensitive data. The passphrase must be between 8 to 32 characters
  long and contain a capital letter, a lowercase letter, a digit, and a special character. You can provide the
  passphrase through the `PALETTE_ENCRYPTION_PASSWORD` environment variable or the `-k` or `--encryption-passphrase`
  flag. Refer to the [Encryption](./../palette-cli.md#encryption) section for more information on encryption.

## Login

| **Short Flag** | **Long Flag**             | **Description**                                                                                                                                                                                                                                                                                                                                                             | **Type** |
| -------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| -              | `--api-key`               | Palette API key. Omit for interactive login.                                                                                                                                                                                                                                                                                                                                | string   |
|                | - `--cluster-group-name`  | Palette Cluster Group name (optional). Specifies the active cluster group.                                                                                                                                                                                                                                                                                                  | string   |
| -              | `--cluster-group-scope`   | Palette cluster group scope. Required with `--cluster-group-name`. Allowed values are: `project`, `tenant` , and `system`.                                                                                                                                                                                                                                                  | string   |
| -              | `--console-url`           | Palette URL (omit for interactive login).                                                                                                                                                                                                                                                                                                                                   | string   |
| `-h`           | `--help`                  | Help for the `login` subcommand.                                                                                                                                                                                                                                                                                                                                            | -        |
| `-k`           | `--encryption-passphrase` | Encryption passphrase to secure sensitive data. The passphrase must be between 8 to 32 characters long and contain a capital letter, a lowercase letter, a digit, and a special character. Can be set through the environment variable `PALETTE_ENCRYPTION_PASSWORD`. Refer to the [Encryption](./../palette-cli.md#encryption) section for more information on encryption. | string   |
| -              | `--insecure`              | Skip Transport Layer Security (TLS) (bypass x509 verification).                                                                                                                                                                                                                                                                                                             | -        |
| -              | `--org`                   | Palette Organization name. Omit for interactive login.                                                                                                                                                                                                                                                                                                                      | string   |
| -              | `--project`               | Palette Project name (optional). Specifies the active project.                                                                                                                                                                                                                                                                                                              | string   |
| -              | `--ubuntu-pro-token`      | The Canonical subscription token for [Ubuntu Pro](https://ubuntu.com/pro). An Ubuntu Pro subscription is required, and Ubuntu Pro must be enabled.                                                                                                                                                                                                                          | string   |

### Examples

```shell hideClipboard
palette login --api-key 123456789 --org demo-org --console-url https://console.spectrocloud.com
```

If you want to target a specific project when using the `login` command, use the `--project` flag.

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
