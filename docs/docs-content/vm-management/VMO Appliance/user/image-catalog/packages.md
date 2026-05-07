# Packages

VMO Manager provides package management for air-gapped environments. Upload DEB, RPM, MSI, and ISO packages, and serve them to VMs via a built-in APT/YUM-compatible repository.

## Overview

In air-gapped clusters, VMs cannot reach external package repositories. VMO Manager:

- **Stores packages** — Upload DEB, RPM, MSI, and ISO files with SHA-256 checksums.
- **Generates repository metadata** — Pure-Go APT and YUM metadata so VMs can use `apt` or `dnf`/`yum` to install packages.
- **Serves packages** — The `/serve/repo/` endpoint serves package files and metadata to in-cluster VMs.
- **Auto-injects guest agent** — Cloud-init can be augmented to configure the repo and install the QEMU guest agent automatically.

---

## Package Management in Air-Gapped Environments

### Workflow

1. **Upload packages** — On a connected machine, download DEB/RPM/MSI/ISO files. Upload them to VMO Manager via the Packages page or API.
2. **Rebuild metadata** — Trigger a repository metadata rebuild so APT/YUM clients see the new packages.
3. **Configure VMs** — Use cloud-init to add the VMO repo as a source and install packages. Or enable **Install QEMU Guest Agent** in the VM wizard to auto-inject the guest agent installation.

### Supported Formats

| Format | Use Case |
|--------|----------|
| **DEB** | Debian, Ubuntu packages |
| **RPM** | RHEL, CentOS, Fedora, SUSE packages |
| **MSI** | Windows installers (e.g., QEMU guest agent) |
| **ISO** | Full disk images (e.g., VirtIO Windows drivers ISO) |

---

## Uploading Packages

1. Navigate to **Image Catalog > Packages**.
2. Click **Upload Package**.
3. Select the file (DEB, RPM, MSI, or ISO).
4. Optionally provide a custom name. The system computes and stores the SHA-256 checksum.
5. Upload. The package is stored in the configured package path (default `/packages`, configurable via `PACKAGES_PATH`).

> **Note:** Package uploads are streamed to the cluster. Large files (e.g., multi-GB ISOs) may take time. Ensure the request body limit (default 1MB for general API; uploads use streaming) and CDI/upload infrastructure can handle the file size.

### SHA-256 Checksums

Packages are stored with SHA-256 checksums for integrity verification. When the repository metadata is generated, checksums are included so clients can verify downloads.

---

## QEMU Guest Agent

The QEMU guest agent enables:

- VNC clipboard support.
- Graceful shutdown and reboot.
- Guest identity diagnostics.
- Live migration features.

### Built-in Package

VMO Manager ships with a built-in QEMU guest agent package for Debian/Ubuntu (amd64 and arm64). It is embedded in the container image at `/embedded-packages/` and does not require upload.

### Auto-Injection via Cloud-Init

When **Install QEMU Guest Agent** is enabled in the VM creation wizard (Review step, Cloud-Init section), the generated cloud-init user-data includes:

- Repository configuration pointing to the VMO package server.
- Commands to install the guest agent (e.g., `apt-get install -y qemu-guest-agent` for Debian/Ubuntu).

The package server URL uses the in-cluster service name (e.g., `http://vmo-manager.vm-dashboard.svc.cluster.local:8080/serve/repo/`). VMs must be able to reach the VMO Manager service from within the cluster.

> **Tip:** The `GUEST_AGENT_AUTO_INSTALL` config (default: true) controls whether the wizard offers and applies guest agent injection. Disable it if you manage the guest agent separately.

---

## Package Repository

### Pure-Go APT/YUM Metadata

VMO Manager generates APT and YUM repository metadata in pure Go—no external tools (dpkg-scanpackages, createrepo) are required. This keeps the container image small and avoids licensing concerns.

### Metadata Rebuild

After uploading or deleting packages, trigger a metadata rebuild:

1. Go to **Image Catalog > Packages** (or **Settings > Storage** / package admin page).
2. Click **Rebuild Repository** or use the API `POST /api/v1/packages/repo/rebuild`.

The rebuild scans the package directory and regenerates `Packages` (APT) and `repodata` (YUM) so clients see the current package set.

### Serving Packages

Packages are served at `/serve/repo/`. The path structure is compatible with APT and YUM:

- **APT** — `http://<vmo-service>.<namespace>.svc.cluster.local:8080/serve/repo/apt/` (or similar).
- **YUM** — `http://<vmo-service>.<namespace>.svc.cluster.local:8080/serve/repo/yum/` (or similar).

VMs add these URLs as package sources in `/etc/apt/sources.list` or `/etc/yum.repos.d/`.

---

## Cloud-Init Auto-Injection

When creating a VM with **Install QEMU Guest Agent** enabled:

1. The wizard generates cloud-init user-data.
2. The backend injects a snippet that:
   - Adds the VMO package repo as an APT or YUM source (based on guest OS).
   - Installs `qemu-guest-agent` (and dependencies such as `liburing2`, `libnuma1` for DEB).
3. At first boot, cloud-init runs and installs the guest agent.

For Windows, the guest agent is typically installed from an MSI. The VirtIO Windows ISO or a separate MSI package can be used. The Windows customization template's seal script may install the guest agent from the VMO package server before sysprep.

---

## VirtIO Windows ISO

The **VirtIO Windows drivers ISO** is a special package used for Windows golden image builds. It provides VirtIO disk and network drivers so Windows can boot from VirtIO devices.

- **Storage** — A DataVolume `vmo-virtio-win` is created in the golden images namespace. It is populated from a built-in package definition or downloaded at runtime.
- **Auto-mount** — When creating a Windows builder VM, the VirtIO ISO is automatically attached as a CD-ROM. The ISO is served from a shared RWX PVC so the builder VM can access it.
- **Installation** — During Windows setup, load the VirtIO drivers from the attached CD-ROM when prompted for disk/network drivers.

The VirtIO ISO is managed as part of package seeding. Ensure the package is seeded and the PVC is bound before building Windows golden images.
