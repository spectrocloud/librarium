---
sidebar_label: "Key Management"
title: "Trusted Boot Key Management"
description: "Learn about how to manage the keys used in Trusted Boot."
hide_table_of_contents: false
sidebar_position: 15
tags: ["edge"]
---

Several key pairs are used in Trusted Boot during installer ISO generation, upgrade image generation, as well as
installation. Each key pair serves a different purpose and is used during different stages of Edge artifact building and
deployment. Each key pair needs to be secured differently. This page discusses the different key pairs used by Trusted
Boot and how to secure them.

Careful key management is the foundation of all security benefits provided by Trusted Boot. All security provided by
Trusted Boot assumes that your keys are handled and stored securely. Ensure that you follow our recommendations to avoid
compromising the security of your systems.

## Platform Key (PK)

The private PK must be stowed away in a secure location _immediately_ after being generated. You do not need the PK
private key during EdgeForge operations, installation, upgrades or deployments of your Edge hosts. The public PK key is
required during the EdgeForge build process so that it can be embedded into the Edge Installer ISO and thereafter
installed on Edge hosts. For more information, refer to [EdgeForge with Trusted Boot](../edgeforge/edgeforge.md).

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

## Signature Database (DB) and Forbidden Signature Database (DBX)

Both the public and private DB keys should be stored securely in the build pipeline of your Edge artifacts, as they are
needed during EdgeForge both during initial deployment and upgrades. The build pipeline itself should be heavily secured
with limited access. The DB private key must not be stored in repositories that are exposed publicly. Ideally, Edge host
artifacts should be generated in an air-gapped environment to reduce potential exposure of the DB private key. If
possible, the build pipeline should utilize an Hardware Security Module (HSM).

| Filename    | Description                                                                                      | Key Management Recommendation              |
| ----------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| **db.pem**  | The public DB key in Privacy Enhanced Mail (PEM) format.                                         | Store in the build pipeline for EdgeForge. |
| **db.key**  | The private DB key.                                                                              | Store in the build pipeline for EdgeForge  |
| **db.esl**  | The EFI Signature List for the DB key.                                                           | Store in the build pipeline for EdgeForge. |
| **db.der**  | The public DB key in DER (Distinguished Encoding Rules) format, a binary form of the PEM file.   | Store in the build pipeline for EdgeForge. |
| **db.auth** | This file contains signed data used for updating the Secure Boot variables in the UEFI firmware. | Store in the build pipeline for EdgeForge. |

## Platform Configuration Registers (PCR) Policy Key

The PCR policy key pair is in charge of signing the pre-calculated measurements of the boot process and involved in disk
encryption. The private PCR policy key needs to be stored securely in the build pipeline so it can sign the
pre-calculated measurement during EdgeForge. The public key is generated and embedded in the UKI image automatically,
and you do not need to handle the public key.

| Filename                 | Description                 | Key Management Recommendation              |
| ------------------------ | --------------------------- | ------------------------------------------ |
| **tpm2-pcr-private.pem** | The private PCR policy key. | Store in the build pipeline for EdgeForge. |
