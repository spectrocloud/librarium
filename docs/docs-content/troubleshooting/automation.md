---
sidebar_label: "Automation"
title: "Automation"
description: "Troubleshooting steps for Palette and VerteX related automation tools such as the SDK, CLI, and API."
icon: ""
hide_table_of_contents: false
sidebar_position: 5
tags: ["troubleshooting", "automation", "sdk", "cli", "api"]
---

The following sections will help you troubleshoot issues with Palette and VerteX related automation tools such as the
API, CLI, Terraform, and SDK.

## Scenario - Incompatible Stale Palette CLI Binaries

Palette CLI may encounter issues when attempting to use third-party binaries that are incompatible with the CLI such as
`docker`, `kind`, and `validatorctl`. By default, the Palette CLI will download the third-party binaries from the
internet and store them in the `$HOME/.palette/bin` directory, the first time you issue a command that requires them.
The Palette CLI does not upgrade these binaries, which can lead to compatibility issues with current versions of the CLI.

Use the following steps to resolve issues with incompatible stale Palette CLI binaries.

### Debug Steps

1. Log in to the machine where the Palette CLI is installed.

2. Remove the `~/.palette/bin` directory.

   ```shell
   rm -rf ~/.palette/bin
   ```

3. Re-issue the command that requires the binary. The CLI will download the latest version of the binary and store it in
   the `$HOME/.palette/bin` directory. If you used the `--workspace` flag then the third-party binaries will be stored
   in the specified workspace directory.
