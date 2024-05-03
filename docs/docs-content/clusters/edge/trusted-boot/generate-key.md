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

- You have exported the factory keys from the Edge device. For more information, refer to
  [Export Factory Keys](./export-keys.md).

## Generate Keys for Trusted Boot with Self-Signed Certificates

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

5. Create a directory called **secure-boot**, and then a subdirectory called **exported-keys** in the **secure-boot**
   directory. Copy the keys you exported from your Edge device in [Export Factory Keys](./export-keys.md) to the
   **exported-keys** directory.

6. Issue the following command to generate keys. Replace `org-name` with the name of your organization, and replace
   5475, the default expiration period in days, with the desired expiration period for your keys. We suggest that you
   specify a long expiration date, since if the keys expire before you can replace them, it will render the Edge host
   unbootable.

   ```shell
   ./earthly.sh +uki-genkey --MY_ORG="org-name" --EXPIRATION_IN_DAYS=5475 --UKI_SELF_SIGNED_KEYS=false
   ```

   All keys are generated to the **secure-boot** folder. Private keys are kept in a subdirectory called
   **private-keys**. Public keys are generated to a subdirectory called **public-keys**.

   The key generation script also produces a folder named **enrollment**. This folder contains public keys that will be
   built into the Edge installer ISO, and eventually enrolled in your Edge device when you install Palette Edge with the
   ISO.

## Generate Keys for Trusted Boot with a CA

In addition to using self-signed certificates, Palette Edge allows you to use certificates issued by a Certificate
Authority (CA) to generate Trusted Boot keys in the EdgeForge process.

## Validate

1. Use the `ls` command to view the folders and keys generated in the **secure-boot** folder.

   ```shell
   sudo ls --ltr secure-boot
   ```

   If key generation is successful, you should see three folders: **enrollment**, **private-keys**, and **public-keys**.
