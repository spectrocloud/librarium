---
sidebar_label: "Trusted Boot"
title: "Trusted Boot"
description: "Learn about Trusted Boot."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

Trusted Boot is a security feature supported by Palette Edge running on Edge devices with supported hardware and
firmware. Trusted Boot consists of the following security measures:

![High level description diagram for Trusted Boot](/clusters_edge_trusted-boot_highlevel.png)

- Full disk encryption (FDE): Encryption of the entire persistent partition of the disk drive. The purpose of FDE is to
  protect data stored on the disk from unauthorized access in the event of theft or loss of the device.
- Secure boot: A security measure that ensures only properly signed and authenticated software is allowed to operate
  during the boot process of a device.
- Measured boot. A security feature that works by measuring each component of the boot process and recording these
  measurements in a
  [Trusted Platform Module (TPM)](https://www.intel.com/content/www/us/en/business/enterprise-computers/resources/trusted-platform-module.html),
  which can be used for later analysis.

Together, these measures allow Trusted Boot to ensure the authenticity of the boot processes that are allowed to run on
your Edge device. In addition, the measurements stored in the TPM can be provided to third parties to prove that your
boot process is secure and unaltered. Since only when the boot process can be verified does the TPM release the key to
decrypt the encrypted content, the sensitive data is not accessible in the case an Edge device is lost or stolen.

![Boot Process for Trusted Boot](/cluster_edge_trusted-boot_boot-process.webp)

## Why Do You Need Trusted Boot?

Edge devices are often deployed in locations with minimal security and high traffic, such as restaurants and coffee
shops, and are susceptible to physical attacks. If an attacker is able to inject malware into the Edge host through a
physical attack, it has the potential to seriously compromise the security of your systems.

Trusted Boot allows you to be confident that all software that is allowed to run on your Edge hosts is authenticated
software verified through cryptographic signatures. In the event that an Edge device is lost or stolen, the TPM will not
release the key to decrypt the disk encryption if the boot process is tampered with, ensuring your user data remains
encrypted.

## Resources

- [Keys](./keys/keys.md)
- [EdgeForge](./edgeforge/edgeforge.md)
- [Deployment and Day-2 Operations](./deployment-day2/deployment-day2.md)
