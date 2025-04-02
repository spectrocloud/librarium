---
sidebar_label: "Trusted Boot Keys"
title: "Trusted Boot Keys"
description: "An overview of keys in Trusted Boot."
hide_table_of_contents: false
sidebar_position: 15
tags: ["edge"]
---

All security features of Trusted Boot rely on cryptographic keys. Secure Boot relies on the chain of trust between
Platform Key (PK), Key Exchange Keys (KEK), and Signature Database (DB) keys to achieve a tamper proof boot process.
Full Disk Encryption also relies on a key pair. This section talks about the different keys used in Trusted Boot, their
roles, and best practices to manage them securely.

![Relationship between Secure Boot Keys](/clusters_edge_trusted-boot_key-management_key-relationship.webp)

## Platform Key (PK)

The PK is at the top of the Secure Boot cryptographic key hierarchy. It's a key pair that has a private key and a public
key.

The private PK signs updates to the Key Exchange Key (KEK) variable, which contains a list of certificates, public keys,
or signatures in a EFI Signature List (ESL). The public PK is used to verify whether updates to the KEK are signed with
the authentic private key and can be trusted. It establishes a relationship of trust between the platform owner and the
platform firmware. A system can only have one PK.

## Key Exchange Key (KEK)

The KEK is a set of certificates, public keys, or signatures in an ESL signed by a private PK key. Entries in the KEK
set are used to update the Signature Database (DB) and the Forbidden Signature Database (DBX). Each entry in the KEK set
has a corresponding private key. It establishes a relationship of trust between the firmware and the operating system
(OS).

Any private key corresponding to an entry in the KEK set can sign updates to the DB. When there are updates to the DB,
the corresponding public key, certificate, or signature in the KEK set is used to verify that those updates are signed
by the authentic private key.

## Signature Database (DB) and Forbidden Signature Database (DBX)

The DB validates signed EFI (Extensible Firmware Interface) binaries. The DB may contain a mixed set of certificates,
public keys, signatures or hashes of binary files. The signature stored in the EFI binary (or a hash of the binary if
there is no signature) is compared against the entries in the database. The binary will be executed if one of the
following conditions is met:

- The EFI binary is signed, and the signing key is in the DB.
- The EFI binary is signed, and the signature on the binary is in the DB.
- The EFI binary is unsigned and a SHA-256 hash of the image is in the DB.

Similarly, DBX may contain a mixed set of certificates, signatures or hashes. Any EFI whose signatures, hashes, or
signing key matches the entries in DBX is forbidden from being executed.

## Platform Configuration Registers (PCR) Policy Key

The PCR policy key pair is in charge of signing the pre-calculated measurements of the boot process and involved in disk
encryption. The private PCR policy key signs the pre-calculated measurement during EdgeForge. The public key is embedded
in the UKI image.

During EdgeForge, each boot component is hashed and these hash values, or measurements, are signed by the PCR private
key. The signed measurements are embedded in the UKI image, along with the public key of the PCR policy key pair. For
more information about EdgeForge, refer to [EdgeForge with Trusted Boot](../edgeforge/edgeforge.md).

During installation, encrypted partitions are setup using a Disk Encryption Key (DEK), which is itself encrypted by the
TPM and stored in a secure blob. The PCR public key embedded in the ISO is used to form a binding policy. The binding
policy states that in order to decrypt the secure blob containing the DEK, the PCR measurements must match pre-calculated
set of measurements signed by the corresponding PCR private key.

During the boot process, before the encrypted disk partition is mounted, the TPM will perform the following:

- Verify the public key in the image is valid
- Verify the signature on the pre-calculated measurements using the public key
- Compare the pre-calculated measurements vs the actual PCR measurements

If all three verifications are successful, TPM will decrypt the secure blob, release DEK, and the OS can use it to
decrypt the encrypted partitions of the disk.

## Disk Encryption Key (DEK)

The disk encryption key (DEK) is generated during installation, encrypted by the TPM with an internal key, and sealed
inside the TPM. You will never interact with the DEK itself.

During the boot process, the TPM will perform a series of verifications. If all of them are successful, the TPM will
decrypt and release the DEK to the OS, so it can use it to decrypt the encrypted partitions. Refer to the
[PCR Policy Key](#platform-configuration-registers-pcr-policy-key) section for details.

## Factory Keys

Factory keys refer to the secure boot keys that are stored on the device in factory settings. In EdgeForge, these keys
are stored in the folder **exported-keys**. They may include PK, KEK, and DB keys. Factory keys are often used to
authenticate the firmware of a device. For more information, refer to [Export Factory Keys](export-keys.md).

## Resources

- [Export Factory Keys](./export-keys.md)
- [Generate Keys](./generate-keys.md)
- [Key Management](./key-management.md)
