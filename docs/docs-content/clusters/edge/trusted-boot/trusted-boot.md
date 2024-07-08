---
sidebar_label: "Trusted Boot"
title: "Trusted Boot"
description: "Learn about Trusted Boot."
hide_table_of_contents: false
sidebar_position: 10
tags: ["edge"]
---

Trusted Boot is a security feature supported by Palette Edge available on Edge devices with supported hardware and
firmware. Trusted Boot consists of the following security measures:

![High level description diagram for Trusted Boot](/clusters_edge_trusted-boot_highlevel.webp)

- Full Disk Encryption (FDE): Encryption of all persistent partitions of the disk drive. The purpose of FDE is to
  protect data stored on the disk from unauthorized access if the boot process was tempered with.
- Secure boot: A security measure that ensures only properly signed and authenticated software is allowed to operate
  during the boot process of a device.
- Measured boot. A security feature that works by measuring each component of the boot process and recording these
  measurements in a
  [Trusted Platform Module (TPM)](https://www.intel.com/content/www/us/en/business/enterprise-computers/resources/trusted-platform-module.html).
  Only when it receives measurements with a valid signature does the TPM release the key to decrypt encrypted content.

Together, these measures allow Trusted Boot to ensure the authenticity of the boot processes that are allowed to operate
on your Edge device. Only when the boot process can be verified does the TPM release the key to decrypt the encrypted
content, and the sensitive data is not accessible if the boot process is tempered with.

:::preview

:::

## Why Do You Need Trusted Boot?

Edge devices are often deployed in locations with minimal security and high traffic, such as restaurants and coffee
shops, and are susceptible to physical attacks. If an attacker is able to inject malware into the Edge host through a
physical attack, it has the potential to compromise the security of your operations.

Trusted Boot allows you to be confident that all software that is allowed to operate on your Edge hosts is authenticated
software verified through cryptographic signatures. In the event that an Edge device is lost or stolen, the TPM will not
release the key to decrypt the disk encryption if the boot process is tampered with, ensuring your user data remains
encrypted.

## Limitation

- Trusted Boot is only supported for clusters with a connection to a Palette instance. Air-gapped clusters cannot be
  deployed to an Edge host with Trusted Boot enabled.

## Next Steps

To get started with Trusted Boot, we recommend you start by familiarizing yourself with the concepts related to Trusted
Boot, especially the keys used by Trusted Boot and how to manage them. In addition, Trusted Boot has additional hardware
requirements compared with Edge hosts that do not have workloads with Trusted Boot. You should ensure that you use Edge
hosts that meet the minimum hardware requirements.

- [Trusted Boot Keys](./keys/keys.md)
- [Key Management](./keys/key-management.md)
- [Hardware Requirements](../hardware-requirements.md#trusted-boot)

After understanding the core concepts, you can proceed to generate the keys that will be used by your Edge host. You
need to start by exporting the existing keys on your Edge host and then use those exported keys to generate new keys to
be used by Trusted Boot. You can generate keys using a self-signed certificate, or an existing Certificate Authority
(CA).

- [Export Factory Keys](./keys/export-keys.md)
- [Generate Trusted Boot Keys](./keys/generate-keys.md)

With the keys ready, you can proceed to build the necessary Edge artifacts to install Palette on your Edge host and
provision your cluster. The EdgeForge process with Trusted Boot is similar to the EdgeForge process without Trusted
Boot. We recommend you become familiar with the EdgeForge workflow first before building Edge artifacts with Trusted
Boot enabled.

- [EdgeForge Workflow without Trusted Boot](../edgeforge-workflow/edgeforge-workflow.md)
- [EdgeForge Workflow with Trusted Boot](./edgeforge/edgeforge.md)

After you build the artifacts, you should check the boot size limit of your Edge host before installing Palette on your
Edge host. Trusted Boot uses the Unified Kernel Image (UKI), which is a single file that encompasses the Operating
System (OS) and other needed bits in order to boot the full system. As a result, the Extensible Firmware Interface (EFI)
file, which contains the UKI, can grow quite large and can pose a limitation depending on your hardware conditions.

- [Check Device Boot Limit](./edgeforge/check-efi-limit.md)

If you find that the EFI file inside the EdgeForge artifacts is bigger than your boot limit, you may need to either
choose a device with a higher boot limit or decrease the size of the EFI file. One way to decrease the EFI file size is
to avoid installing software packages to the OS image and instead use static binaries of the packages you need.

- [Add Static Binaries to Persistent Partition](./edgeforge/add-extra-content.md)

Having ensured that your hardware meets the boot size requirement, you can proceed to install Palette Edge on your Edge
host. The installation process is similar to the regular installation workflow, but requires a few additional steps to
prepare the Edge host for secure boot key enrollment.

- [Installation with Trusted Boot](./deployment-day2/install.md)

After installation, the registration process and the process to create a cluster from your Edge host are identical to
Edge hosts without Trusted Boot. The upgrade process, however, requires you to use the same keys to build new provider
images.

- [Edge Host Registration](../site-deployment/site-installation/edge-host-registration.md)
- [Create Cluster Definition](../site-deployment/cluster-deployment.md)
- [Upgrade Cluster with Trusted Boot](./deployment-day2/upgrade-cluster.md)

## Resources

- [Keys](./keys/keys.md)
- [EdgeForge](./edgeforge/edgeforge.md)
- [Deployment and Day-2 Operations](./deployment-day2/deployment-day2.md)
