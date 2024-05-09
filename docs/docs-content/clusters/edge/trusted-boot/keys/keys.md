---
sidebar_label: "Keys"
title: "Trusted Boot Keys"
description: "An overview of keys in Trusted Boot."
hide_table_of_contents: false
sidebar_position: 15
tags: ["edge"]
---

All security features of Trusted Boot rely on cryptographic keys. Secure Boot relies on the chain of trust between
Platform Key (PK), Key Exchange Keys (KEK), and signature database (db) keys to achieve a temper proof boot process.
Full Disk Encryption also replies on a key pair. This section talks about the different keys used in Trusted Boot, their
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

The KEK is a list of certificates, public keys, or signatures in an ESL signed by a private PK key. Entires in the KEK
set are used to update the signature database (db) and the forbidden signature database (dbx). Each entry in the KEK set
has a corresponding private key. It establishes a relationship of trust between the firmware and the operating system
(OS).

Any private key corresponding to an entry in the KEK set can sign updates to the db. When there are updates to the db,
the corresponding public key, certificate, or signature in the KEK set is used to verify that those updates are signed
by the authentic private.

## Signature Database (db) and Forbidden Signature Database (dbx)

The db is used to validate signed EFI (Extensible Firmware Interface) binaries. The db may contain a mixed set of
certificates, public keys, signatures or hashes of binary files. The signature stored in the EFI binary (or a hash of
the binary if there is no signature) is compared against the entries in the database. The binary will be executed if one
of the following conditions is met:

- The EFI binary is unsigned and a SHA-256 hash of the image is in the db.
- The EFI binary is signed, and the signature on the binary is in the db.
- The EFI binary is signed, and the signing key is in the db.

Similarly, dbx may contain a mixed set of certificates, signatures or hashes. Any EFI whose signatures, hashes, or
signing key matches the entries in dbx is forbidden from being executed.

## Platform Configuration Registers (PCR) Policy Key

The PCR policy key is a private key that is used to decrypt the sensitive user date in your Edge device's persistent
partitions. The public key and the signature is generated automatically during the EdgeForge process and added inside
the EFI files. The public key will encrypt the persistent partitions containing sensitive user data.

## Factory Keys

Factory keys refer to the secure boot keys that are stored on the device that is set to factory settings. They may
include PK, KEK, and db keys. Factory keys are often used to authenticate the firmware of a device.

## Resources

- [Export Factory Keys](./export-keys.md)
- [Generate Keys](./generate-keys.md)
- [Key Management](./key-management.md)
