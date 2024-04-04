---
sidebar_label: "Generate Keys for Trusted Boot"
title: "Generate Keys for Trusted Boot"
description: "Learn about how to generate keys for Trusted Boot."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

Trusted Boot works by signing the Edge Installer image and provider images with keys, and only allowing images signed
with the trusted keys to operate during the Edge host boot process. This page guides you through the process of
generating keys to be used in building Edge artifacts.

The key generation process produces three pairs of keys and a platform Configuration Register (PCR) policy private key,
and each pair of keys fulfill different purposes. The following table provides a brief overview of which keys are used
in which Trusted Boot EdgeForge and deployment process.

| Keys                     | Key Generation | Build Installer ISO | Building Provider Images | Installation |
| ------------------------ | -------------- | ------------------- | ------------------------ | ------------ |
| PK & KEK (private)       | ✅             | Not needed          | Not needed               | Not needed   |
| PK & KEK (public)        |                | ✅                  | Not needed               | ✅           |
| DB (public)              |                | ✅                  | ✅                       | Not needed   |
| DB (private)             |                | ✅                  | ✅                       | Not needed   |
| PCR policy Key (private) |                | ✅                  | Not needed               | ✅           |

## Prerequisites

:::warning

All security provided by Trusted Boot assumes that the private keys are kept secure. We suggest that you perform key
generation in an airgapped environment and move the private keys to a secure location immediately after generating them.

:::

- A physical or virtual Linux machine with _AMD64_ (also known as x86_64) processor architecture to build the Edge
  artifacts. You can issue the following command in the terminal to check your processor architecture.

  ```bash
  uname -m
  ```

- Minimum hardware configuration of the Linux machine:

  - 4 CPU
  - 8 GB memory
  - 50 GB storage

## Generate Keys for Trusted Boot

1. Clone the **CanvOS** repository.

   ```shell
    git clone https://github.com/spectrocloud/CanvOS.git
   ```

2. Change to the **CanvOS/** directory.

   ```shell
   cd CanvOS
   ```

3. View the available git tag.

   ```shell
   git tag
   ```

4. Check out the latest available tag that is v4.4.0 or later. This guide uses the tag v4.4.0 as an example.

   ```
   git checkout v4.4.0
   ```

5. Issue the following command to generate keys. Replace `org-name` with the name of your organization, and replace
   3650, the default expiration period, with the desired expiration period for your keys. We suggest that you keep a
   long expiration date, since if the keys expire before you can replace them, it will render the Edge host unbootable.

   ```shell
   ./earthly.sh +uki-genkey --MY_ORG="org-name" --EXPIRATION_IN_DAYS=3650
   ```

   All keys are generated to the **keys** folder in the current directory.

## Validate

1. Use the `ls` command to view the keys generated in the **keys** folder.

   ```shell
   sudo ls --ltr keys
   ```
