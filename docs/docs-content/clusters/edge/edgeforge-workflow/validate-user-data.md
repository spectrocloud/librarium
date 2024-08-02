---
sidebar_label: "Validate User Data"
title: "Validate User Data"
description: "Learn how to validate your user data."
hide_table_of_contents: false
sidebar_position: 5
tags: ["edge"]
---

fter preparing or modifying your **user-data** file, you can validate your user data before using it to build the Edge
installer ISO. This allows you to be confident that your user data follows the the expected schema and avoid having to
rebuilt Edge artifacts due to user data errors.

## Prerequisites

- A physical or virtual Linux machine with AMD64 (also known as x86_64) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```shell
  uname -m
  ```

- You have cloned the **CanvOS** repository.

- You have a file named **user-data** in your **CanvOS** directory. For more information on how to prepare the user-data
  file, refer to [Prepare User Data](./prepare-user-data.md).

## Validate User Data

From the **CanvOS** directory, issue the following command.

```
sudo ./earthly.sh +validate-user-data
```

## Validate
