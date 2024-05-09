---
sidebar_label: "Generate Keys"
title: "Generate Keys for Trusted Boot"
description: "Learn about how to generate keys for Trusted Boot."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

Trusted Boot works by signing the Edge Installer image and provider images with cryptographic keys, and only allowing
images signed with the trusted keys to operate during the Edge host boot process. This page guides you through the
process of generating keys to be used in building Edge artifacts.

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

:::warning

All security provided by Trusted Boot assumes that the private keys are kept secure. We suggest that you perform key
generation in an airgapped environment and move the PK and KEK private keys to a secure location immediately after
generating them.

:::

### Prerequisites

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

If your environment does not require a Certificate Authority (CA), you can use self-signed certificates to generate the
keys needed for Trusted Boot. Using self-signed certificates does not in itself make your systems less secure,

### Prerequisites

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

### Instructions

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

5. Issue the following command to create the folders for Trusted Boot keys.

   ```shell
   ./earthly.sh +secure-boot-dirs
   ```

   This will create a folder named **secure-boot** and three subdirectories: **exported-keys**, **private-keys** and
   **public-keys**.

6. Copy the keys you exported from your Edge device in [Export Factory Keys](./export-keys.md) to the **exported-keys**
   directory.

7. Issue the following command to generate keys. Replace `org-name` with the name of your organization, and replace
   5475, the default expiration period in days, with the desired expiration period for your keys. We suggest that you
   specify a long expiration date, since if the keys expire before you can replace them, it can soft-brick the Edge
   host.

   ```shell
   ./earthly.sh +uki-genkey --MY_ORG="org-name" --EXPIRATION_IN_DAYS=5475 --UKI_SELF_SIGNED_KEYS=false
   ```

   All keys are generated to the **secure-boot** folder. Private keys are kept in a subdirectory called
   **private-keys**. Public keys are generated to a subdirectory called **public-keys**.

   The key generation script also produces a folder named **enrollment**. This folder contains public keys that will be
   built into the Edge installer ISO, and eventually enrolled in your Edge device when you install Palette Edge with the
   ISO.

8. Remove **PK.key** and **KEK.key** out of the **private-keys** folder and keep them offline in a safe location.

### Validate

Check the content of the **secure-boot/enrollment** directory. You should see the following nine files.

```
$ ls secure-boot/enrollment/
KEK.auth  KEK.der  KEK.esl  PK.auth  PK.der  PK.esl  db.auth  db.der  db.esl
```

## Generate Keys for Trusted Boot with a CA

Palette Edge allows you to use certificates issued by a CA to generate Trusted Boot keys in the EdgeForge process.
Follow the steps below to generate keys from certificates issued by your CA.

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

   ```shell
   git checkout v4.4.0
   ```

5. Change into the **sb-private-ca** directory.

   ```shell
   cd sb-private-ca
   ```

6. Review the three configuration files in the directory. Each file configures the generation of the PK, KEK, and db key
   as well as their corresponding certificate request.

   ```
   [ req ]
   prompt             = no
   string_mask        = default
   default_bits       = 2048
   encrypt_key        = no
   distinguished_name = req_dn
   req_extensions     = req_ext
   oid_section        = OIDs

   [ req_dn ]
   C            = US
   L            = San Jose
   OU           = IT
   CN           = Spectro Cloud Example - PK

   [ req_ext ]
   basicConstraints       = critical, CA:false
   keyUsage               = critical, digitalSignature
   extendedKeyUsage       = codeSigning
   subjectKeyIdentifier   = hash
   ```

   Edit the conf files to specify the subject of the request files. Only modify the `req_dn` section, which records the
   distinguished name of the certificate owner. Do not modify any other sections.

7. After you are done editing the configuration files, issue the following command to generate three pairs of keys, and
   a certificate request for each pair.

   ```shell
   openssl req -new -config PK_request.conf  -keyout PK.key  -out CSR_PK.req
   openssl req -new -config KEK_request.conf -keyout KEK.key -out CSR_KEK.req
   openssl req -new -config db_request.conf  -keyout db.key  -out CSR_db.req
   ```

8. Use the request files to request certificates from your CA. If you have access to the CA's private key and root
   certificate, you can use `openssl` to issue these certificates.

   ```shell
   openssl x509 -req -in CSR_PK.req -CA path-to-ca-root-cert -CAkey path-to-ca-private-key -CAcreateserial -out PK.pem -days 5475 -sha256
   openssl x509 -req -in CSR_KEK.req -CA path-to-ca-root-cert -CAkey path-to-ca-private-key -CAcreateserial -out KEK.pem -days 5475 -sha256
   openssl x509 -req -in CSR_db.req -CA path-to-ca-root-cert -CAkey path-to-ca-private-key -CAcreateserial -out db.pem -days 5475 -sha256
   ```

9. Generate another key for disk encryption.

   ```
   openssl genrsa -out tpm2-pcr-private.pem 2048
   ```

10. Return to the **CanvOS** directory. Issue the following command to create the folder structure to save the keys.

    ```shell
    ./earthly.sh +secure-boot-dirs
    ```

    This will create a folder named **secure-boot** and three subdirectories: **exported-keys**, **private-keys** and
    **public-keys**.

11. Copy the certificates that you just generated into the **public-keys** folder.

12. Copy the private keys you generated into the **private-keys** folder. At this point, your **secure-boot** folder
    should have the following content.

    ```shell
    CanvOS/
    secure-boot/
    private-keys/
       PK.key
       KEK.key
       db.key
       tpm2-pcr-private.pem
    public-keys/
       PK.pem
       KEK.pem
       db.pem
    ```

13. Copy the keys you exported from your Edge device in [Export Factory Keys](./export-keys.md) to the **exported-keys**
    directory.

14. Review the **.arg** file in your **CanvOS** directory. Add the following line to the file.

    ```
    UKI_BRING_YOUR_OWN_KEYS=true
    ```

    Refer to [Edge Artifact Build Reference](../edgeforge-workflow/palette-canvos/arg.md) for a complete list of
    available arguments.

15. Issue the following command to generate Trusted Boot keys for enrollment. Replace `org-name` with the name of your
    organization, and replace 5475, the default expiration period in days, with the desired expiration period for your
    keys. We suggest that you specify a long expiration date, since if the keys expire before you can replace them, it
    can soft-brick the Edge host.

    ```
    ./earthly.sh +uki-genkey --MY_ORG="org-name" --EXPIRATION_IN_DAYS=5475 --UKI_SELF_SIGNED_KEYS=false
    ```

## Validate

Check the content of the **secure-boot/enrollment** directory. You should see the following nine files.

```
$ ls secure-boot/enrollment/
KEK.auth  KEK.der  KEK.esl  PK.auth  PK.der  PK.esl  db.auth  db.der  db.esl
```
