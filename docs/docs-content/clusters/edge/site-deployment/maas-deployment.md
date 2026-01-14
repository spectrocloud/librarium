---
sidebar_label: "Deploy Edge Hosts on MAAS"
title: "Deploy Edge Hosts on MAAS"
description: "Learn how to deploy Edge hosts on MAAS."
icon: ""
hide_table_of_contents: false
sidebar_position: 55
tags: ["edge"]
---

Palette Edge supports deployment on MAAS-managed bare-metal machines and LXD VMs. You can use MAAS to provision hosts,
register them with Palette, and deploy clusters on them just like any other Edge host. This enables consistent and
automated deployments across both physical and virtual infrastructure managed by MAAS.

## Limitations

- MAAS image creation is supported only for appliance-mode Palette eXtended Kubernetes - Edge (PXK-E) deployments. Other
  Kubernetes distributions and agent-mode deployments are not supported by this workflow.

- MAAS-based Edge deployments are verified only with <VersionedLink text="Calico" url="/integrations/packs/?pack=cni-calico"/> as the Container Network Interface (CNI) and <VersionedLink text="Longhorn" url="integrations/packs/?pack=csi-longhorn"/> as the Container Storage Interface (CSI).

- For MAAS-based deployments, the Kairos `install` stage in user data is not used. Any GRand Unified Bootloader (GRUB)
  configuration or mount customizations must be applied using other Kairos stages or overlay files. Refer to
  [Edge Installer Configuration Reference](../edge-configuration/installer-reference.md) for details on the available
  stages.

## Prerequisites

- A [Palette account](https://www.spectrocloud.com/get-started).

- A MAAS image created according to the [Build MAAS Images](../edgeforge-workflow/palette-canvos/build-maas-image.md)
  guide.

-  If you did not embed user data in the MAAS image, you need a [Palette registration token](site-installation/create-registration-token.md) to pair your Edge hosts
  with Palette.

- A MAAS-managed bare-metal machine or LXD virtual machine.

- A user and a machine with permissions to upload and publish custom images to MAAS. The machine must have the
  [MAAS CLI](https://maas-cli-doc.readthedocs.io/en/latest/maas-cli-install.html) installed and be able to access the
  MAAS API.

- The target machine must either be configured for Unified Extensible Firmware Interface (UEFI) boot mode or, if the
  boot mode is not set to UEFI, have UEFI-based boot options prioritized. Legacy Basic Input/Output System (BIOS) boot
  mode is not supported for this workflow.

  For MAAS-managed bare-metal machines, verify the UEFI-related boot settings and adjust the boot order if needed
  directly in the machine firmware:

  - Access the machine console (for example, using a Windows jump host).

  - Reboot the machine and press **F11** during boot to enter the BIOS/UEFI setup.

  - In the **Boot** menu, check the current boot mode. If it is not set to **UEFI**, ensure that **UEFI Network** is
    first in the boot order, and the UEFI local disk entry (for example, **UEFI Hard Disk:UEFI OS**) is second.

    The following screenshot shows an example of the required boot order configured.

    ![A screenshot with the required UEFI boot order configured](/clusters_site-deployment_maas-deployment_boot-order_4-8.webp)

  For LXD VMs managed by MAAS, ensure the VM is created with UEFI boot enabled. You can verify the machine configuration
  in the MAAS UI by opening the machine **Summary** page and checking the **Boot mode**. It must be set to **UEFI**
  before deploying the Edge host.

## Deploy MAAS Edge Host

1. Copy the MAAS image from the system where it was built to the machine you will use to access MAAS. The following
   command is an example that copies the `custom-maas-image.raw.gz` image to the local `Downloads/` directory.

   ```bash title="Example command"
   scp ubuntu@10.10.150.244:/home/ubuntu/CanvOS/build/custom-maas-image.raw.gz ~/Downloads/
   ```

2. Use the following command to log in to MAAS. Replace `<MAAS-URL>` and `<API-KEY>` with your MAAS endpoint and API
   key. Replace `admin` with the name of your MAAS CLI profile.

   ```bash
   maas login admin http://<MAAS-URL>:5240/MAAS <API-KEY>

   ```

3. Upload the custom image to MAAS. Use your own values for `name`, `title`, and `content@` path that points to the
   image location. The `name` value must be unique within MAAS and follow MAAS naming conventions (lowercase, no spaces,
   and typically using `/` as a namespace separator). The `title` value is a human-readable label shown in the MAAS UI.
   Additionally, replace `admin` with the name of your MAAS CLI profile. The following command serves as an example.

   ```bash title="Example command"
   maas admin boot-resources create \
    name='custom/my-image' \
    title='My Custom Image' \
    architecture='amd64/generic' \
    filetype='ddgz' \
    content@=~/Downloads/custom-maas-image.raw.gz
   ```

4. In the MAAS web UI, open the page for the machine you want to use as your Edge host. Select **Actions** > **Deploy**.

5. Select the **Custom** value in the **OS** field. In the **Release** field, select the custom MAAS image you uploaded
   in step 3.

6. (Optional) If you did not embed the user data in the custom image, enable **Cloud-init user-data** and paste the
   required user data. For instructions on preparing user data, refer to
   [Prepare User Data and Argument Files](../edgeforge-workflow/prepare-user-data.md).

7. Click **Deploy machine** to start the deployment.

## Validate

1. Once the deployment finishes, log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**.

3. At the top of the **Clusters** page, click the **Edge Hosts** tab. Once the Edge host is registered with Palette, it
   appears in the grid.

## Next Steps

Once an Edge host is registered with Palette, you can allocate the Edge host to a cluster. For more information, refer
to [Create Cluster Definition](cluster-deployment.md).
