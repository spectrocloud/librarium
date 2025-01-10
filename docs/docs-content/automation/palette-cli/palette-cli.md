---
sidebar_label: "Palette CLI"
title: "Palette CLI"
description: "Learn how to use the Palette CLI."
hide_table_of_contents: false
tags: ["palette-cli"]
---

The Palette CLI contains various functionalities that you can use to interact with Palette and manage resources. The
Palette CLI is well suited for Continuous Integration/Continuous Deployment (CI/CD) pipelines and recommended for
automation tasks, where Terraform or direct API queries are not ideal.

To get started with the Palette CLI, check out the [Install](install-palette-cli.md) guide.

## Encryption

The Palette CLI uses Advanced Encryption Standard (AES) encryption to secure sensitive data. Several CLI commands
require an encryption passphrase to be provided as either an environment variable or a CLI flag. Otherwise, you will be
prompted to provide the passphrase when required. The passphrase must be between 8 to 32 characters long and contain a
capital letter, a lowercase letter, a digit, and a special character.

Sensitive data, such as the Palette API key, passwords, and other credentials, are encrypted using the provided
passphrase and stored in the CLI configuration files. The CLI decrypts the data using the same passphrase when required.

:::warning

We recommend that you store the encryption passphrase in a secure location. If you lose the passphrase, you will have to
set a new encryption passphrase and update the main Palette configuration file **~/.palette/palette.yaml** and other
configuration files with the new passphrase. Refer to the
[Update CLI Configuration Files Credentials](../../troubleshooting/automation.md#scenario---update-cli-configuration-files-credentials)
guide for steps on updating the CLI configuration files with a new passphrase.

:::

We recommend you set the `PALETTE_ENCRYPTION_PASSWORD` environment variable to avoid providing the passphrase every time
you issue a command that requires it. You can set the environment variable using the following command. Replace
`*************` with your passphrase.

```bash
export PALETTE_ENCRYPTION_PASSWORD=*************
```

Alternatively, you can provide the passphrase through the `-k` or `--encryption-passphrase` flag when issuing a command
that requires the passphrase.

## Resources

- [Install](install-palette-cli.md)

- [Commands](./commands/commands.md)
