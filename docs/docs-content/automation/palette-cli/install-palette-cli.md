---
sidebar_label: "Install"
title: "Install"
description: "Learn how to install the Palette CLI and how you can use the CLI with Palette Dev Engine."
hide_table_of_contents: false
sidebar_position: 0
tags: ["palette-cli"]
---

# Installation

Use the following steps to install and set up the Palette CLI.

## Supported Operating Systems

The Palette CLI is available for the following operating systems and architectures.

| **Operating System** | **Architecture** |
| -------------------- | ---------------- |
| Linux                | amd64            |

## Prerequisites

- A Palette account. Click [here](https://console.spectrocloud.com/) to create a Palette account.

- A Palette API key. Refer to the [Create API Key](../../user-management/authentication/api-key/create-api-key.md)
  reference page to learn how to create an API key.

- Different Palette CLI commands may require additional prerequisites. Refer to the individual command reference pages
  to learn more about the prerequisites for each command.

## Download and Setup

1. Visit the [Downloads](../../downloads/cli-tools.md#palette-cli) page and download the Palette CLI by using the URL
   provided for your operating system.

2. Open up a terminal session on your local system.

3. Navigate to your default download folder. For Linux environments the default location is **~/Downloads**.

4. Move the binary to a folder that is part of your system's `PATH` environment variable. Use the following command to
   move the binary to the **/usr/local/bin** folder.

   ```shell
   sudo mv ~/Downloads/palette /usr/local/bin/palette && \
   chmod +x /usr/local/bin/palette
   ```

5. Log in to Palette by using the `login` command. Replace `<YOUR-API-KEY>` with your Palette API key. If you are using
   a Palette self-hosted instance or Palette VerteX, replace the `--console-url` with your custom Palette URL.

   ```shell
   palette login --api-key <YOUR-API-KEY> --console-url https://console.spectrocloud.com/
   ```

## Validate

Verify the Palette CLI is part of your system path by issuing the Palette CLI `version` command.

```shell
palette version
```

<!-- palette-cli-version-output -->

```shell hideClipboard
Palette CLI version: 4.7.0
```

## Next Steps

Start exploring the Palette CLI by using the `--help` command with the various commands. The Palette CLI will continue
to receive more functionality, so you will want to keep it updated by downloading the newest version and replacing the
current binary.
