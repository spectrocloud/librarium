---
sidebar_label: "Validate User Data"
title: "Validate User Data"
description: "Learn how to validate your user data."
hide_table_of_contents: false
sidebar_position: 5
tags: ["edge"]
---

After preparing or modifying your `user-data` file, you can validate your user data before using it to build the Edge
installer ISO. This allows you to be confident that your user data follows the expected schema and avoid having to
rebuild Edge artifacts due to user data errors. The following issues will be flagged through validation:

- YAML formatting issues.
- Omission of the `#cloud-config` header.
- Missing required fields or fields containing incorrect data types.

This guide provides instructions on how to validate the `user-data` file manually without triggering an actual build.
However, this process is also executed automatically when you build the Edge installer ISO.

## Prerequisites

- A physical or virtual Linux machine with AMD64 (also known as x86_64) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```shell
  uname -m
  ```

- You have cloned the [CanvOS repository](https://github.com/spectrocloud/CanvOS.git).

- You have a file named `user-data` in your `CanvOS` directory. For more information on how to prepare the `user-data`
  file, refer to [Prepare User Data](./prepare-user-data.md).

## Validate User Data

<Tabs>

<TabItem value="CanvOS">

From the `CanvOS` directory, issue the following command.

```shell
sudo ./earthly.sh +validate-user-data
```

</TabItem>

<TabItem value="Palette Edge CLI">

From the directory where the Palette Edge CLI executable is present, issue the following command. Replace
`<path-to-user-data>` with the path to your `user-data` file. Refer to [Downloads](../../../downloads/cli-tools.md) to
download the Palette Edge CLI.

```shell
./palette-edge-cli validate --user-data-file-path <path-to-user-data>
```

</TabItem>

</Tabs>

If the output is similar to the following, it means that the user data is valid and will be applied to the Edge host.

:::warning

This only checks that the user data conforms to the expected schema and will not catch issues with the data itself. For
example, if your user data contains an expired registration token, this will not be flagged by the validation script.

:::

```hideClipboard
+validate-user-data | time=*2024-07-25T20:19:172* level=info msg="Validation successful"
```

If the data does not pass the validation, the output will display the encountered error. For example, if the
`stylus.registryCredentials.password` field is present but no value is provided, the following error will be displayed
in the output.

```
Error: invalid JSON: stylus.registryCredentials.password: Invalid type. Expected: string, given: null
```

## Validate

1. Build an Edge installer ISO with the user data and install an Edge host. For more information, refer to
   [Build Installer ISO](./palette-canvos/build-installer-iso.md).

2. Confirm that the user data you provided has been applied. For example, if you configured users in your user data and
   you were able to use the credentials to establish an SSH connection to your Edge host, then you can confirm that the
   user data has been applied.
