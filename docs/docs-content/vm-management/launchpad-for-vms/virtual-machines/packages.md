---
sidebar_label: "Manage Packages"
title: "Manage Packages"
description: "Learn how to manage packages in airgap Launchpad for VMs environments."
icon: " "
hide_table_of_contents: false
sidebar_position: 9
tags: ["vmo", "vm launchpad", "packages"]
---

Launchpad provides package management for airgap environments. Upload DEB, RPM, MSI, and ISO packages, and serve them to
VMs via a built-in APT/YUM-compatible repository.

## Overview

In airgap clusters, VMs cannot reach external package repositories. Launchpad provides the following capabilities.

| **Capability**                    | **Description**                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Stores packages**               | Upload DEB, RPM, MSI, and ISO files with SHA-256 checksums.                                             |
| **Generates repository metadata** | Pure-Go APT and YUM metadata so VMs can use `apt` or `dnf`/`yum` to install packages.                   |
| **Serves packages**               | The `/serve/repo/` endpoint serves package files and metadata to in-cluster VMs.                        |
| **Auto-injects guest agent**      | Cloud-init can be augmented to configure the repository and install the QEMU guest agent automatically. |

## Package Management in Airgap Environments

### Workflow

1. **Upload packages**. On a connected machine, download DEB/RPM/MSI/ISO files. Upload them to Launchpad from the
   Packages page or API.
2. **Rebuild metadata**. Trigger a repository metadata rebuild so APT/YUM clients detect the new packages.
3. **Configure VMs**. Use cloud-init to add the VMO repository as a source and install packages, or enable **Install
   QEMU Guest Agent** in the VM wizard to auto-inject the guest agent installation.

### Supported Formats

| Format  | Use Case                                                  |
| ------- | --------------------------------------------------------- |
| **DEB** | Debian, Ubuntu packages                                   |
| **RPM** | RHEL, CentOS, Fedora, SUSE packages                       |
| **MSI** | Windows installers, such as the QEMU guest agent.         |
| **ISO** | Full disk images, such as the Virtio Windows drivers ISO. |

## Packages Page

Navigate to **Image Catalog** > **Packages** to view and manage uploaded packages. The page shows the current storage
usage and the time the repository was last rebuilt, and provides the following controls.

| **Control**            | **Description**                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **Upload Package**     | Upload a new package. Refer to [Upload a Package](#upload-a-package).                      |
| **Check for Updates**  | Check for newer versions of the built-in packages.                                         |
| **Refresh**            | Reload the package list.                                                                   |
| **Rebuild Repository** | Regenerate the APT and YUM repository metadata so VMs can install the current package set. |
| **URLs**               | Display the repository URLs that VMs use as package sources.                               |
| **Filters**            | Filter the package list. Use **Filter rows** to search by name.                            |
| **Delete**             | Select one or more package rows, then select **Delete** to remove them.                    |

Each package is listed with the following columns.

| **Column**       | **Description**                                                                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**         | The package name and target, such as `libnuma1 (Ubuntu 24.04 Noble / generic, amd64)`. A **Built-in** badge marks packages that Launchpad seeds automatically, such as the QEMU guest agent and its dependencies. |
| **Type**         | The package format, such as DEB or RPM, including codename-specific variants such as DEB (jammy).                                                                                                                 |
| **Architecture** | The target architecture, such as amd64 or arm64.                                                                                                                                                                  |
| **Version**      | The package version.                                                                                                                                                                                              |
| **File**         | The package filename.                                                                                                                                                                                             |
| **Size**         | The package file size.                                                                                                                                                                                            |
| **Uploaded**     | The date and time the package was uploaded.                                                                                                                                                                       |

## Upload a Package

1. Navigate to **Image Catalog** > **Packages**.

2. Select **Upload Package**.

3. In the **Upload Package** dialog, configure the following fields.

   | **Field**        | **Description**                                                                                                                                                          |
   | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Package Name** | The package name, such as `qemu-guest-agent`.                                                                                                                            |
   | **Version**      | The package version, such as `9.1.0`.                                                                                                                                    |
   | **OS Type**      | Select the package OS type and format from the drop-down menu, such as Linux DEB, Linux RPM, or Windows MSI. DEB packages can be codename-agnostic or codename-specific. |
   | **Architecture** | Select the target architecture from the drop-down menu, such as **amd64** or **arm64**.                                                                                  |
   | **Description**  | An optional description for the package.                                                                                                                                 |
   | **File**         | Select **Choose File** and select the package file (DEB, RPM, MSI, or ISO).                                                                                              |

4. Select **Upload**. Launchpad stores the package and computes its SHA-256 checksum.

:::info

Package uploads are streamed to the cluster. Large files, such as multi-GB ISOs, may take time. Ensure the request body
limit and CDI upload infrastructure can handle the file size.

:::

### SHA-256 Checksums

Packages are stored with SHA-256 checksums for integrity verification. When the repository metadata is generated,
checksums are included so clients can verify downloads.

## QEMU Guest Agent

The QEMU guest agent enables:

- VNC clipboard support.
- Graceful shutdown and reboot.
- Guest identity diagnostics.
- Live migration features.

### Built-in Package

Launchpad ships with a built-in QEMU guest agent package for Debian/Ubuntu (amd64 and arm64). It is embedded in the
container image at `/embedded-packages/` and does not require upload.

### Auto-Injection via Cloud-Init

When **Install QEMU Guest Agent** is enabled in the [VM creation wizard](./creating.md) (Lifecycle step, Cloud-Init
section), the generated cloud-init user-data includes:

- Repository configuration pointing to the VMO package server.
- Commands to install the guest agent, such as `apt-get install --yes qemu-guest-agent` for Debian/Ubuntu.

The package server URL uses the in-cluster service name, such as
`http://vmo-manager.vm-dashboard.svc.cluster.local:8080/serve/repo/`. VMs must be able to reach the Launchpad service
from within the cluster.

:::tip

The `GUEST_AGENT_AUTO_INSTALL` config controls whether the wizard offers and applies guest agent injection. Disable it
if you manage the guest agent separately.

:::

## Package Repository

### Pure-Go APT/YUM Metadata

Launchpad generates APT and YUM repository metadata in pure Go. No external tools, such as `dpkg-scanpackages` or
`createrepo`, are required. This keeps the container image small and avoids licensing concerns.

### Metadata Rebuild

After uploading or deleting packages, trigger a metadata rebuild.

1. Navigate to **Image Catalog** > **Packages**.
2. Select **Rebuild Repository** or use the API `POST /api/v1/packages/repo/rebuild`.

The rebuild scans the package directory and regenerates the APT `Packages` metadata and the YUM `repodata` metadata so
clients can install the current package set.

### Serve Packages

Packages are served at `/serve/repo/`. The path structure is compatible with APT and YUM.

| **Repository** | **URL**                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| **APT**        | `http://<vmo-service>.<namespace>.svc.cluster.local:8080/serve/repo/apt/` |
| **YUM**        | `http://<vmo-service>.<namespace>.svc.cluster.local:8080/serve/repo/yum/` |

VMs add these URLs as package sources in `/etc/apt/sources.list` or `/etc/yum.repos.d/`.

## Cloud-Init Auto-Injection

When creating a VM with **Install QEMU Guest Agent** enabled, the following occurs.

1. The wizard generates cloud-init user-data.
2. The backend injects a snippet that:
   - Adds the VMO package repository as an APT or YUM source (based on guest OS).
   - Installs `qemu-guest-agent` (and dependencies such as `liburing2`, `libnuma1` for DEB).
3. At first boot, cloud-init runs and installs the guest agent.

For Windows, the guest agent is typically installed from an MSI. The Virtio Windows ISO or a separate MSI package can be
used. The Windows [finalization template](./image-customization.md)'s seal script may install the guest agent from the
VMO package server before `sysprep`.

## Virtio Windows ISO

The **Virtio Windows drivers ISO** is a dedicated package used for Windows [golden image](./golden-images.md) builds. It
provides Virtio disk and network drivers so Windows can boot from Virtio devices.

| **Aspect**       | **Description**                                                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Storage**      | A DataVolume `vmo-virtio-win` is created in the golden images namespace. It is populated from a built-in package definition or downloaded at runtime.              |
| **Auto-mount**   | When creating a Windows builder VM, the Virtio ISO is automatically attached as a CD-ROM. The ISO is served from a shared RWX PVC so the builder VM can access it. |
| **Installation** | During Windows setup, load the Virtio drivers from the attached CD-ROM when prompted for disk or network drivers.                                                  |

The Virtio ISO is managed as part of package seeding. Ensure the package is seeded and the PVC is bound before building
Windows golden images.
