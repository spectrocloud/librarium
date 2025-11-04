---
sidebar_label: "Install VMO in Airgap Environments"
title: "Install VMO in Airgap Environments"
description: "Learn how to install VMO for use in self-hosted airgapped instances of Palette and Palette VerteX."
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["vmo"]
---

The Virtual Machine Orchestrator (VMO) pack is available for use in tenants that belong to your airgapped self-hosted
instance of Palette and Palette VerteX.

## Prerequisites

- An existing self-hosted, airgapped instance of [Palette](../self-hosted-setup/palette/palette.md) or
  [Palette VerteX](../self-hosted-setup/vertex/vertex.md).

  :::info

  If your environment is configured to use an external proxy, you can use the **No Proxy** list to exclude any domains
  or IP addresses. You have the option to set the No Proxy list during the Palette installation flow. This is useful in
  scenarios where you know the IP addresses you want to exclude before deployment, such as load balancer IP addresses.

  :::

- At least one tenant created for your airgap instance of Palette or Palette VerteX. Refer to the appropriate
  [Tenant Management guide for self-hosted Palette](../self-hosted-setup/palette/system-management/tenant-management.md)
  or [Palette VerteX](../self-hosted-setup/vertex/system-management/tenant-management.md) for more information.

- Access to the Palette airgap support Virtual Machine (VM) that you used for the initial Palette installation.

- Access to the Palette system console.

## Enablement

1. In your terminal, use the following command template to SSH into the Palette airgap support VM. Enter the path to
   your private SSH key, username, and the IP or domain of the airgap support VM. The default username is `ubuntu`.

   ```shell
   ssh -i </path/to/private/key> <username>@<vm-ip-or-domain>
   ```

   Consider the following command example for reference.

   ```shell
   ssh -i /docs/ssh-private-key.pem ubuntu@palette.example.com
   ```

2. Execute the following command to switch to the `root` user account.

   ```shell
   sudo --login
   ```

3. Refer to the [Palette Additional Packs](../downloads/self-hosted-palette/additional-packs.md) page to download and
   install the **airgap-pack-virtual-machine-orchestrator** and **airgap-pack-spectro-proxy** packs. You will need these
   packs for both Proxied and Direct network configuration.

4. If you are planning to deploy VMs with direct network access, repeat step three to install a load balancer pack of
   your choice. We recommend installing <VersionedLink text="MetalLB" url="/integrations/packs/?pack=lb-metallb" />
   (**airgap-pack-lb-metallb**), which you can find in
   [Palette Additional Packs](../downloads/self-hosted-palette/additional-packs.md).

5. Log in to the Palette system console.

6. From the left **Main Menu**, select **Administration**, and then select the **Pack Registries** tab.

7. Select the **three-dots Menu** of **spectro-packs** and click **Sync**.

   ![Palette system console displaying options for the spectro-packs registries.](/vm-management_install-vmo-in-airgap_sync-packs.webp)

   Once the sync is finished, the newly uploaded packs will be available for use in the tenants that belong to your
   airgapped instance of Palette or Palette VerteX.

## Validate

1. Log in to a tenant that belongs to your airgapped instance of Palette or Palette VerteX.

2. From the left **Main Menu**, select **Profiles** and click **Add Cluster Profile**.

3. Follow the [Create a VMO Profile](./create-vmo-profile.md) guide to start creating a VMO add-on profile.

4. If the Virtual Machine Orchestrator, Spectro Proxy, and, if applicable, your load balancer packs are available to add
   to a cluster profile, then the installation is successful.

   ![Profile creation view with the uploaded packs for a self-hosted tenant.](/vm-management_install-vmo-in-airgap_validate-packs.webp)
