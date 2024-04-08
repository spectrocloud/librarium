---
sidebar_label: "Trusted Boot Key Management"
title: "Trusted Boot Key Management"
description: "Learn about how to manage the keys used in Trusted Boot."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

Several key pairs are used in Trusted Boot during installer ISO generation, upgrade image generation, as well as
installation. Each pair of keys serves a different purpose, is used during different stages of Edge artifact building
and deployment, and need to be secured differently. This page discusses the different key pairs used by Trusted Boot and
how to secure them.

Secure key management is the foundation of all security benefits provided by Trusted Boot. All security provided by
Trusted Boot assumes that your keys are securely stored. Ensure that you follow our recommendation to avoid compromising
the security of your systems.

## Platform Key (PK)

The PK is at the top of the Secure Boot cryptographic key hierarchy. It establishes a trust relationship between the
platform owner and the platform firmware.

## Key Exchange Key (KEK)

## Signature Database (DB)

The signature database (DB) stores the signers or image hashes of Unified Kernel Images (UKI) that can be used to boot
the device. Only UKI images with signatured matching the records on the DB key are allowed to boot.

The signature database includes the following files.

| File       | Description | Storage Recommendation |
| ---------- | ----------- | ---------------------- |
| **db.pem** |             |                        |
| **db.key** |             |                        |
| **db.esl** |             |                        |
| **db.der** |             |                        |

## Platform Configuration Registers (PCR)
