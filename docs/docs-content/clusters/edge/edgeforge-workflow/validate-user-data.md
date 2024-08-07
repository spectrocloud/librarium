---
sidebar_label: "Validate User Data"
title: "Validate User Data"
description: "Learn how to validate your user data."
hide_table_of_contents: false
sidebar_position: 5
tags: ["edge"]
---

After preparing or modifying your **user-data** file, you can validate your user data before using it to build the Edge
installer ISO. This allows you to be confident that your user data follows the expected schema and avoid having to
rebuilt Edge artifacts due to user data errors.

## Prerequisites

- A physical or virtual Linux machine with AMD64 (also known as x86_64) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```shell
  uname -m
  ```

- You have cloned the [**CanvOS** repository](https://github.com/spectrocloud/CanvOS.git).

- You have a file named **user-data** in your **CanvOS** directory. For more information on how to prepare the user-data
  file, refer to [Prepare User Data](./prepare-user-data.md).

## Validate User Data

From the **CanvOS** directory, issue the following command.

```
sudo ./earthly.sh +validate-user-data
```

If the output is similar to the following, it means that the user data is valid and will be applied to the Edge host.

:::warning

This only checks that the user data conforms to the expected schema and will not catch issues with the data itself. For
example, if your user data contained an expired registration token, this will not be flagged by the validation script.

:::

```hideClipboard
+validate-user-data | time=*2024-07-25T20:19:172* level=info msg="Validation successful"
```

## Validate

1. Build an Edge installer ISO with the user data and install an Edge host. For more information, refer to
   [Build Installer ISO](./palette-canvos/build-installer-iso.md).

2. Establish an SSH connection to the Edge host. View the `/oem/90_custom.yaml` file on your Edge host. If the file
   contains the customizations you made in your **user-data** file, it means the installer configuration has been
   applied to the Edge host.
