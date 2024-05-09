---
sidebar_label: "Key Management"
title: "Trusted Boot Key Management"
description: "Learn about how to manage the keys used in Trusted Boot."
hide_table_of_contents: false
sidebar_position: 15
tags: ["edge"]
---

Several key pairs are used in Trusted Boot during installer ISO generation, upgrade image generation, as well as
installation. Each pair of keys serves a different purpose, is used during different stages of Edge artifact building
and deployment, and needs to be secured differently. This page discusses the different key pairs used by Trusted Boot
and how to secure them.

Careful key management is the foundation of all security benefits provided by Trusted Boot. All security provided by
Trusted Boot assumes that your keys are handled and stored securely. Ensure that you follow our recommendations to avoid
compromising the security of your systems.

## Platform Key (PK)

The private PK must be stowed away in a secure location **immediately** after being generated. You do not need the PK
private key during EdgeForge operations, installation, upgrades or deployments of your Edge hosts. The public PK key is
required during the EdgeForge build process so that it can be embedded into the Edge Installer ISO and thereafter
installed on Edge hosts.

:::danger

Ensure that the private PK is kept securely with strictly limited access. Someone in possession of the private PK key
can make changes to the KEK and gain access to your devices and their data.

:::

The following files are all part of the PK key.

| Filename    | Description                                                                                                                              | Key Management Recommendation              |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **PK.pem**  | The public PK key in Privacy Enhanced Mail (PEM) format.                                                                                 | Store in the build pipeline for EdgeForge. |
| **PK.key**  | The private PK key.                                                                                                                      | Store offline in a secure location.        |
| **PK.esl**  | The EFI Signature List for the PK key.                                                                                                   | Store in the build pipeline for EdgeForge. |
| **PK.der**  | The public PK key in DER (Distinguished Encoding Rules) format, a binary form of the PEM file.                                           | Store in the build pipeline for EdgeForge. |
| **PK.auth** | This file contains signed data used for updating the Secure Boot variables in the Unified Extensible Firmware Interface (UEFI) firmware. | Store in the build pipeline for EdgeForge. |

## Key Exchange Key (KEK)

The private KEK must be stowed away in a secure location **immediately** after being generated. You do not need the KEK
private key during EdgeForge operations, installation, upgrades or deployments of your Edge hosts. The public KEK is
required during the EdgeForge build process so that it can be embedded into the Edge Installer ISO and thereafter
installed on Edge hosts.

| Filename     | Description                                                                                      | Key Management Recommendation              |
| ------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| **KEK.pem**  | The public KEK key in Privacy Enhanced Mail (PEM) format.                                        | Store in the build pipeline for EdgeForge. |
| **KEK.key**  | The private KEK key.                                                                             | Store offline in a secure location.        |
| **KEK.esl**  | The EFI Signature List for the KEK key.                                                          | Store in the build pipeline for EdgeForge. |
| **KEK.der**  | The public KEK key in DER (Distinguished Encoding Rules) format, a binary form of the PEM file.  | Store in the build pipeline for EdgeForge. |
| **KEK.auth** | This file contains signed data used for updating the Secure Boot variables in the UEFI firmware. | Store in the build pipeline for EdgeForge. |

## Signature Database (db) and Forbidden Signature Database (dbx)

Both the public and private DB keys should be stored securely in the build pipeline of your Edge artifacts, as they are
needed during EdgeForge both during initial deployment and upgrades. The build pipeline itself should be heavily secured
with limited access. The db private key must not be stored in repositories that are exposed publicly. Ideally, Edge host
artifacts should be generated in an airgapped environment to reduce potential exposure of the DB private key. If
possible, the build pipeline should utilize an HSM (Hardware Security Module).

| Filename    | Description                                                                                      | Key Management Recommendation              |
| ----------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| **db.pem**  | The public db key in Privacy Enhanced Mail (PEM) format.                                         | Store in the build pipeline for EdgeForge. |
| **db.key**  | The private db key.                                                                              | Store in the build pipeline for EdgeForge  |
| **db.esl**  | The EFI Signature List for the DB key.                                                           | Store in the build pipeline for EdgeForge. |
| **db.der**  | The public DB key in DER (Distinguished Encoding Rules) format, a binary form of the PEM file.   | Store in the build pipeline for EdgeForge. |
| **db.auth** | This file contains signed data used for updating the Secure Boot variables in the UEFI firmware. | Store in the build pipeline for EdgeForge. |

## Platform Configuration Registers (PCR) Policy Key

The PCR policy key is a private key that is used to decrypt the sensitive user date in your Edge device's persistent
partitions. The public key and the signature is generated automatically during the EdgeForge process and added inside
the EFI files. The public key will encrypt the persistent partitions containing sensitive user data.

During EdgeForge, each boot component is hashed and these hash values, or measurements, are embedded in the UKI image.
These measurements are signed by the private PCR policy key. During the boot process, the public key embedded in the UKI
image is evaluated against the signature database. If it is an authorized signature, the TPM releases the private key to
decrypt the encrypted content. After the boot process is complete, the measurements are stored in the Trusted Platform
Module (TPM) of your Edge host.

| Filename                 | Description                 | Key Management Recommendation              |
| ------------------------ | --------------------------- | ------------------------------------------ |
| **tpm2-pcr-private.pem** | The private PCR policy key. | Store in the build pipeline for EdgeForge. |
