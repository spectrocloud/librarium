---
sidebar_label: "Create and Manage MAAS Openshift Clusters"
title: "Create and Manage MAAS Openshift Clusters"
description: "Learn how to create and manage MAAS Openshift clusters in Palette."
hide_table_of_contents: false
tags: ["data center", "maas", "openshift", "hypershift"]
---

:::preview

:::

## Create MAAS-Compatible Red Hat Enterprise Linux CoreOS Image

Red Hat Enterprise Linux CoreOS (RHCOS) is an immutable, OSTree-based operating system that is incompatible with the
standard MAAS/[Curtin](https://canonical.com/blog/customising-maas-installs) deployment process out of the box. MAAS
deploys machines using a two-stage boot process in which Curtin writes and validates the target OS disk image. Curtin
expects a traditional Linux root filesystem layout — including a `/curtin` directory, `cloud-init`, and standard
filesystem structure — none of which RHCOS provides natively. In addition, RHCOS uses Ignition for machine configuration
rather than cloud-init.

To work around this, the RHCOS MAAS image build process appends a minimal Ubuntu root filesystem as an extra partition
to the official RHCOS raw image. This allows Curtin validation to pass, while Curtin hooks persist the real Ignition
configuration for RHCOS, which is applied on first boot.

### Prerequisites

- A Linux build host with the following tools installed:

  - `debootstrap`
  - `rsync`
  - `losetup` (util-linux)
  - `sgdisk` (gdisk)
  - `kpartx`
  - `partprobe`
  - `udevadm`
  - `mkfs.ext4`
  - `e2label`
  - `gzip` / `gunzip`
  - Root privileges (`sudo`)

- The MAAS CLI (`maas-cli`) installed on your build host.

- A MAAS server endpoint and API key. [ambiguous - instructions for obtaining a MAAS API key are not provided in the
  source material.]

- The RHCOS image build scripts, available at the following URL. Download and extract the archive before proceeding.

  ```
  http://software.spectrocloud.com/rhcos-maas-image-builder/v4.8.c-v2/rhcos-maas-image.tgz
  ```

  The archive contains the following scripts used in this guide:

  ```
  build-rootfs.sh
  create-maas-image.sh
  import-maas-image.sh
  curtin/curtin-hooks
  curtin/deploy-ignition-config
  ```

- The official RHCOS raw image for your target OpenShift version, downloaded from the Red Hat mirror. For example:

  ```
  https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.20/4.20.13/rhcos-4.20.13-x86_64-metal.x86_64.raw.gz
  ```

  Save the file locally, for example:

  ```
  ./images/rhcos-4.20.13-x86_64-metal.x86_64.raw.gz
  ```

### Enablement

1. **Build the minimal Ubuntu root filesystem.** This creates the fake root filesystem used for Curtin validation.

   ```bash
   sudo ./build-rootfs.sh ./ubuntu2404-rootfs
   ```

   The script runs `debootstrap` for Ubuntu 24.04 (Noble), installs `cloud-init`, `netplan.io`, `python3-cffi`, and
   `python3-ply`, cleans apt caches, and outputs the rootfs to `./ubuntu2404-rootfs/`. This directory is copied into the
   extra partition in the next step.

2. **Create the MAAS-ready RHCOS image.** This appends a new partition (p5) to the RHCOS raw image and injects the
   Ubuntu rootfs and Curtin hooks.

   ```bash
   sudo ./create-maas-image.sh \
     ./ubuntu2404-rootfs \
     ./images/rhcos-4.20.13-x86_64-metal.x86_64.raw.gz
   ```

   The script performs the following operations:

   1. Decompresses the raw image.
   2. Extends the disk size by 512 MB.
   3. Attaches a loop device with a partition scan.
   4. Relocates the GPT backup header.
   5. Creates a new partition p5 after p4.
   6. Formats p5 as ext4.
   7. Copies the Ubuntu rootfs into p5.
   8. Copies the Curtin scripts into `/curtin`.
   9. Compresses the new raw image to `*-with-ubuntu.raw.gz`.

   The resulting partition layout is as follows:

   | Partition | Contents                                       |
   | --------- | ---------------------------------------------- |
   | p3        | RHCOS boot                                     |
   | p4        | RHCOS root                                     |
   | p5        | Ubuntu fake rootfs (Curtin validation + hooks) |

   The output image is saved alongside the original input image:

   ```
   ./images/rhcos-4.20.13-x86_64-metal.x86_64-with-ubuntu.raw.gz
   ```

   The original input image remains unchanged.

3. **Import the image into MAAS.** Set your MAAS credentials as environment variables, then run the import script.

   ```bash
   export MAAS_ENDPOINT="https://your-maas-server/MAAS"
   export MAAS_API_KEY="your-api-key"

   ./import-maas-image.sh \
     ./images/rhcos-4.20.13-x86_64-metal.x86_64-with-ubuntu.raw.gz \
     rhcos-4.20.13-with-ubuntu \
     openshift \
     4.20.13
   ```

   The script logs into MAAS using the `default` profile, uploads the image as a `ddgz` resource, and triggers a
   boot-resources import. The image will then appear in the MAAS boot resources list.

   :::info

   MAAS metadata endpoints require OAuth credentials to return the actual user-data payload. The
   `deploy-ignition-config` Curtin hook reads these credentials from `/etc/cloud/cloud.cfg.d/*_dpkg_maas.cfg` within the
   Curtin environment and uses them to call `<metadata_url>/latest/user-data`. Without OAuth, the endpoint returns
   base64-encoded Curtin scripts rather than the Ignition configuration.

   :::

   :::warning

   MAAS OAuth credentials are sensitive. Do not hardcode credentials in deploy scripts, ensure no backup artifacts are
   left inside the injected rootfs, and remove any debugging code from Curtin scripts before using in production.

   :::

#### Optional: Resize the root partition

Because partition p5 is appended to the disk, the RHCOS root partition (p4) does not auto-expand after deployment. You
can reclaim this space by removing p5 and expanding p4 using the Ignition `storage` configuration:

```json
"storage": {
  "disks": [
    {
      "device": "/dev/sda",
      "partitions": [
        {
          "number": 5,
          "shouldExist": false,
          "wipePartitionEntry": true
        }
      ]
    }
  ]
}
```

Alternatively, handle the resize manually after deployment. [ambiguous - an exact manual resize procedure is not
specified in the source material.]

### Validate

After MAAS completes deployment and the machine reboots, RHCOS boots normally from its original partitions (p3 and p4).
Before the reboot, the `deploy-ignition-config` Curtin hook mounts the RHCOS boot partition, fetches the Ignition
configuration from the MAAS metadata endpoint, and writes it to `/boot/ignition/config.ign`. On first boot, Ignition
finds the configuration locally and applies the full machine configuration.

To confirm the image was imported successfully, navigate to the MAAS boot resources list and verify that the image
appears with the name and version specified during import. [ambiguous - specific MAAS UI navigation steps for verifying
boot resources are not provided in the source material.]

## Create HyperShift Host Cluster

### Prerequisites

- A cluster profile for your HyperShift host cluster.

  - The **HyperShift Operator** must be added as a System App layer in the cluster profile.

### Enablement

### Validate

## Create MAAS OpenShift Workload Cluster with HyperShift Control Plane

### Prerequisites

- A cluster profile for your OpenShift workload clusters configured with the following infrastructure layers:

  - **Bring Your Own OS (BYOOS)** pack for the OS layer. Set the following parameters in the pack values.

    | Parameter              | Description                                                                                                                             | Example value               |
    | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
    | `pack.osImageOverride` | The name of the MAAS image imported in the previous section. This should match the name specified in the `import-maas-image.sh` script. | `rhcos-4.20.13-with-ubuntu` |
    | `pack.osName`          | The name of the OS in the MAAS image. This should match the OS name specified during import.                                            | `rhcos`                     |
    | `pack.osVersion`       | The version of the OS in the MAAS image. This should match the OS version specified during import.                                      | `4.20.13`                   |

  - **OpenShift** pack for the Kubernetes layer.

  - The network layer can be any of the available options.

  - **Local Path Provisioner** pack for the storage layer.

### Enablement

### Validate

## Next Steps
