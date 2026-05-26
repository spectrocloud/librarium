---
sidebar_label: "Prepare CoreOS Image"
title: "Prepare a MAAS-Compatible CoreOS Image"
description:
  "Learn how to prepare and import a MAAS-compatible CoreOS (RHCOS or SCOS) image for use with OpenShift workload
  clusters on MAAS."
hide_table_of_contents: false
tags: ["data center", "maas", "openshift", "hypershift"]
sidebar_position: 10
---

:::preview

:::

Red Hat Enterprise Linux CoreOS (RHCOS) and the related CentOS Stream CoreOS (SCOS) are incompatible with the standard
MAAS/[Curtin](https://canonical.com/blog/customising-maas-installs) deployment process out of the box. MAAS deploys
machines using a two-stage boot process in which Curtin writes and validates the target OS disk image. Curtin expects a
traditional Linux root filesystem layout, including:

- a `/curtin` directory
- `cloud-init` as the machine configuration tool
- a standard filesystem structure

None of these are provided natively by RHCOS or SCOS, as both are immutable OSTree-based operating systems. In addition,
they use
[Ignition](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/composing_installing_and_managing_rhel_for_edge_images/assembly_using-the-ignition-tool-for-the-rhel-for-edge-simplified-installer-images_composing-installing-managing-rhel-for-edge-images)
for machine configuration rather than cloud-init.

To work around this, the MAAS-compatible CoreOS image build process appends a minimal Ubuntu root filesystem as an extra
partition to the official CoreOS raw image. This allows Curtin validation to pass, while Curtin hooks persist the real
Ignition configuration for the CoreOS variant, which is applied on first boot.

This guide walks you through importing a MAAS-compatible CoreOS image into your MAAS environment. This image is required
before you can deploy OpenShift workload clusters on MAAS using HyperShift. You can choose between the two options
described in the following table.

| Option                                                                                  | Requirements                         | Usage                                                             |
| --------------------------------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| [Option 1 - Use the Pre-Built Docker Image](#option-1---use-the-pre-built-docker-image) | Docker, MAAS credentials             | You want to use the published SCOS version with minimal effort.   |
| [Option 2 - Build Your Own Image](#option-2---build-your-own-image)                     | Linux build host with root, MAAS CLI | You need a specific RHCOS version or want to customize the image. |

## Option 1 - Use the Pre-Built Docker Image

The pre-built Docker image bundles a MAAS-ready SCOS image and the MAAS CLI. Use this option to import the published
SCOS version with minimal effort.

### Prerequisites

- A host with [Docker](https://docs.docker.com/engine/install/) installed.

  - The host must have network access to your MAAS server endpoint to import the image successfully.

- A MAAS server endpoint and API key. Refer to the
  [MAAS API Keys](https://canonical.com/maas/docs/how-to-find-and-use-api-keys) documentation for guidance on obtaining
  your API key.

### Enablement

1. Log in to the host where Docker is installed and has access to your MAAS server endpoint.

2. Use the following command to pull the pre-built Docker image.

   **Last update**: May 31, 2026

   ```bash title="Export image variable"
   export IMAGE=us-docker.pkg.dev/palette-images/third-party/scos-maas:v10.0.20250628-0
   ```

   ```bash title="Pull the Docker image"
   docker pull $IMAGE
   ```

3. Set your MAAS credentials as environment variables. Replace `<https://your-maas-server/MAAS>` and `<maas-api-key>`
   with your MAAS server endpoint and API key, respectively.

   ```bash title="Set MAAS credentials"
   export MAAS_ENDPOINT="<https://your-maas-server/MAAS>"
   export MAAS_API_KEY="<maas-api-key>"
   ```

4. Use the following command to import the SCOS image into MAAS.

   - Replace `<image-name>` with a descriptive name for the image as it will appear in the MAAS boot resources list.
   - Replace `<operating-system>` with the OS name to associate with the image in MAAS.
   - Replace `<release-version>` with the OS version to associate with the image in MAAS.

   ```bash title="Template"
   docker run --rm \
     --env MAAS_ENDPOINT="$MAAS_ENDPOINT" \
     --env MAAS_API_KEY="$MAAS_API_KEY" \
     $IMAGE \
     /image.raw.gz <image-name> <operating-system> <release-version>
   ```

   The `/image.raw.gz` argument refers to the SCOS image path inside the container and should not be changed.

   ```bash hideClipboard title="Example"
   docker run --rm \
     --env MAAS_ENDPOINT="$MAAS_ENDPOINT" \
     --env MAAS_API_KEY="$MAAS_API_KEY" \
     $IMAGE \
     /image.raw.gz scos-10.0 scos 10.0.20250628-0
   ```

   Once the command completes, the image will appear in the MAAS boot resources list under the **Custom** or **Other**
   category. Partition cleanup is handled automatically during deployment; no manual disk management is required.

### Validate

<Tabs groupId="validate-image">

<TabItem label="MAAS UI" value="maas-ui">

1. Log in to your MAAS server web interface.

2. From the left sidebar, navigate to **Images**.

3. Locate the image under the **Custom** or **Other** category and verify it appears with the name you specified during
   import. The name appears under the **Release Title** column. For example, `scos-10.0`.

4. Confirm the image status is **Synced**.

</TabItem>

<TabItem label="MAAS CLI" value="maas-cli">

Use the following command to list all boot resources and confirm your image is present. Replace `<image-name>` with the
name of the image you specified during import. For example, `scos-10.0`.

```bash
maas default boot-resources read | grep "<image-name>"
```

If the image was imported successfully, the command returns a JSON entry containing the image name. No output indicates
the image was not found.

</TabItem>

</Tabs>

## Option 2 - Build Your Own Image

### Prerequisites

- A Linux build host with the following tools installed:

  - `debootstrap`
  - `rsync`
  - `losetup` (`util-linux`)
  - `sgdisk` (`gdisk`)
  - `kpartx`
  - `partprobe`
  - `udevadm`
  - `mkfs.ext4`
  - `e2label`
  - `gzip` / `gunzip`
  - root privileges (`sudo`)

- The MAAS CLI (`maas-cli`) installed on your build host.

- A MAAS server endpoint and API key. Refer to the
  [MAAS API Keys](https://canonical.com/maas/docs/how-to-find-and-use-api-keys) documentation for guidance on obtaining
  your API key.

- The RHCOS image build scripts, available at the following URL.

  **Last update**: May 3, 2026

  ```text
  http://software.spectrocloud.com/rhcos-maas-image-builder/v4.8.c-v2/rhcos-maas-image.tgz
  ```

  Download and extract the archive before proceeding. The archive contains the following files and scripts used in this
  guide.

  ```shell hideClipboard
  build-rootfs.sh
  create-maas-image.sh
  import-maas-image.sh
  curtin/curtin-hooks
  curtin/deploy-ignition-config
  ```

- The official RHCOS raw image for your target OpenShift version, downloaded from the Red Hat mirror.

  ```text title="Example RHCOS image URL"
  https://mirror.openshift.com/pub/openshift-v4/dependencies/rhcos/4.20/4.20.13/rhcos-4.20.13-x86_64-metal.x86_64.raw.gz
  ```

  Save the file on your build host and note the path for use in the [Enablement](#enablement) steps.

  ```shell title="Example RHCOS image path"
  ~/images/rhcos-4.20.13-x86_64-metal.x86_64.raw.gz
  ```

### Enablement

1. Log in to your MAAS build host and navigate to the directory where you extracted the RHCOS image build scripts.

2. Use the following command to build the minimal Ubuntu root filesystem. This creates the fake root filesystem used for
   Curtin validation.

   ```bash
   sudo ./build-rootfs.sh ./ubuntu2404-rootfs
   ```

   The script executes `debootstrap` for Ubuntu 24.04 (Noble), installs `cloud-init`, `netplan.io`, `python3-cffi`, and
   `python3-ply`, cleans apt caches, and outputs the root filesystem directory to `./ubuntu2404-rootfs/`. This directory
   is copied into the extra partition in the next step.

3. Use the following command to create the MAAS-ready RHCOS image. This appends a new partition (p5) to the RHCOS raw
   image and injects the Ubuntu root filesystem directory and Curtin hooks.

   - Replace `<path-to-rhcos-raw-image>` with the path to your RHCOS raw image downloaded in the prerequisites step.

   ```bash title="Template"
   sudo ./create-maas-image.sh \
     ./ubuntu2404-rootfs \
     <path-to-rhcos-raw-image>
   ```

   ```bash hideClipboard title="Example"
   sudo ./create-maas-image.sh \
     ./ubuntu2404-rootfs \
     ./images/rhcos-4.20.13-x86_64-metal.x86_64.raw.gz
   ```

   <details>

   <summary> Click to view the script operations </summary>

   1. Decompresses the raw image.
   2. Extends the disk size by 512 MB.
   3. Attaches a loop device with a partition scan.
   4. Relocates the GPT backup header.
   5. Creates a new partition p5 after p4.
   6. Formats p5 as ext4.
   7. Copies the Ubuntu root filesystem directory into p5.
   8. Copies the Curtin scripts into `/curtin`.
   9. Compresses the new raw image to `*-with-ubuntu.raw.gz`.

   The resulting partition layout is as follows:

   | Partition | Contents                                                |
   | --------- | ------------------------------------------------------- |
   | p3        | RHCOS boot                                              |
   | p4        | RHCOS root                                              |
   | p5        | Ubuntu fake root filesystem (Curtin validation + hooks) |

   </details>

   The original input image remains unchanged and the output image is saved alongside the original input image.

   ```text hideClipboard title="Example output image path"
   ./images/rhcos-4.20.13-x86_64-metal.x86_64-with-ubuntu.raw.gz
   ```

4. Set your MAAS credentials as environment variables. Replace `<https://your-maas-server/MAAS>` and `<maas-api-key>`
   with your MAAS server endpoint and API key, respectively.

   ```bash title="Set MAAS credentials"
   export MAAS_ENDPOINT="<https://your-maas-server/MAAS>"
   export MAAS_API_KEY="<maas-api-key>"
   ```

   :::warning

   Keep your MAAS OAuth credentials secure. Do not add credentials to the deploy scripts. Using environment variables
   allows the deploy scripts to read credentials securely without exposing them in code or logs.

   :::

5. Use the following command to import the new image into MAAS.

   - Replace `<maas-ready-rhcos-image-filepath>` with the path to the new RHCOS image created in the previous step.
   - Replace `<image-name>` with a descriptive name for the image as it will appear in the MAAS boot resources list.
   - Replace `<operating-system>` with the OS name to associate with the image in MAAS.
   - Replace `<release-version>` with the OS version to associate with the image in MAAS.

   ```bash title="Template"
   ./import-maas-image.sh \
     <maas-ready-rhcos-image-filepath> \
     <image-name> \
     <operating-system> \
     <release-version>
   ```

   ```bash hideClipboard title="Example"
   ./import-maas-image.sh \
     ./images/rhcos-4.20.13-x86_64-metal.x86_64-with-ubuntu.raw.gz \
     rhcos-4.20.13-with-ubuntu \
     openshift \
     4.20.13
   ```

   The script logs into MAAS using the `default` profile, uploads the image as a `ddgz` resource, and triggers a
   boot-resources import. The image will then appear in the MAAS boot resources list. Partition cleanup is handled
   automatically during deployment, no manual disk management is required.

### Validate

<Tabs groupId="validate-image">

<TabItem label="MAAS UI" value="maas-ui">

1. Log in to your MAAS server web interface.

2. From the left sidebar, navigate to **Images**.

3. Locate the image and verify it appears with the name you specified during import. The name appears under the
   **Release Title** column. For example, `rhcos-4.20.13-with-ubuntu`.

   The image may appear in the **Other** category if the image metadata does not match any existing categories.

4. Confirm the image status is **Synced**.

</TabItem>

<TabItem label="MAAS CLI" value="maas-cli">

Use the following command to list all boot resources and confirm your image is present. Replace `<image-name>` with the
name of the image you specified during import. For example, `rhcos-4.20.13-with-ubuntu`.

```bash
maas default boot-resources read | grep "<image-name>"
```

If the image was imported successfully, the command returns a JSON entry containing the image name. No output indicates
the image was not found.

</TabItem>

</Tabs>

## Next Steps

Now that the MAAS-compatible CoreOS image is imported, you can proceed to
[create the HyperShift host cluster](./create-hypershift-host-cluster.md) that will run the OpenShift control plane
components.
