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
The Palette CLI does not upgrade these binaries, which can lead to compatibility issues with current versions of the
CLI.

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

## Scenario - Update CLI Configuration Files Credentials

The Palette CLI stores [encrypted](../automation/palette-cli/palette-cli.md#encryption) sensitive data such as the
Palette API key, passwords, and other credentials in the CLI configuration files. If you need to change the credentials
due to a changed encryption passphrase or other reasons, you can update the CLI configuration files by using the
following steps.

### Debug Steps

1.  Log in to the machine where the Palette CLI is installed.

2.  Set the `PALETTE_ENCRYPTION_PASSWORD` environment variable to the new passphrase.

    ```shell
    export PALETTE_ENCRYPTION_PASSWORD=*************
    ```

3.  Log in to the Palette CLI using the `login` command. This will overwrite the existing Palette credentials in the
    CLI. If you don't have an Ubuntu Pro token, you can omit the `--ubuntu-pro-token` flag.

    <!-- prettier-ignore -->
      <Tabs>
        <TabItem label="Ubuntu Pro Token" value="token">

          ```shell
          palette login --ubuntu-pro-token *************
          ```

        </TabItem>
        <!-- prettier-ignore -->
        <TabItem label="No Ubuntu Pro Token" value="no-token">

          ```shell
          palette login
          ```

        </TabItem>

      </Tabs>

4.  (Optional) Update any previous Palette EC install configuration file that was created using the previous encryption
    passphrase. You can use the `ec install` command with the `--update-passwords` flag to update the passwords in the
    configuration. Replace `/path/to/ec.yaml` with the path to the desired EC configuration file. If you are using
    Ubuntu Pro, pass in the token using the `--ubuntu-pro-token` flag.

    <!-- prettier-ignore -->
      <Tabs>
        <TabItem label="Ubuntu Pro Token" value="token">

          ```shell
          palette ec install --config-file /path/to/ec.yaml --update-passwords --ubuntu-pro-token *************
          ```

        </TabItem>
        <!-- prettier-ignore -->
        <TabItem label="No Ubuntu Pro Token" value="no-token">

          ```shell
          palette ec install --config-file /path/to/ec.yaml --update-passwords
          ```

        </TabItem>

      </Tabs>

5.  (Optional) Update any previous Palette PCG install configuration file that was created using the previous encryption
    passphrase. You can use the `pcg install` command with the `--update-passwords` flag to update the passwords in the
    configuration. Replace `/path/to/pcg.yaml` with the path to the desired PCG configuration file. If you are using
    Ubuntu Pro, pass in the token using the `--ubuntu-pro-token` flag.

    <!-- prettier-ignore -->
      <Tabs>
        <TabItem label="Ubuntu Pro Token" value="token">

          ```shell
          palette pcg install --config-file /path/to/pcg.yaml --update-passwords --ubuntu-pro-token *************
          ```

        </TabItem>
        <!-- prettier-ignore -->
        <TabItem label="No Ubuntu Pro Token" value="no-token">

          ```shell
          palette pcg install --config-file /path/to/pcg.yaml --update-passwords
          ```

        </TabItem>

      </Tabs>

6.  (Optional) Update any previous Palette TC install configuration file that was created using the previous encryption
    passphrase. You can use the `tc install` command with the `--update-passwords` flag to update the passwords in the
    configuration. Replace `/path/to/tc.yaml` with the path to the desired TC configuration file. If you are using
    Ubuntu Pro, pass in the token using the `--ubuntu-pro-token` flag.

    <!-- prettier-ignore -->
      <Tabs>
        <TabItem label="Ubuntu Pro Token" value="token">

          ```shell
          palette tc install --config-file /path/to/tc.yaml --update-passwords --ubuntu-pro-token *************
          ```

        </TabItem>
        <!-- prettier-ignore -->
        <TabItem label="No Ubuntu Pro Token" value="no-token">

          ```shell
          palette tc install --config-file /path/to/tc.yaml --update-passwords
          ```

        </TabItem>

      </Tabs>
