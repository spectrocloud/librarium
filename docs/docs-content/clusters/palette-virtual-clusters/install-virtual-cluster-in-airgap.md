---
sidebar_label: "Install a Virtual Cluster in an Airgap Environment"
title: "Install a Virtual Cluster in an Airgap Environment"
description: "Learn how to install virtual clusters for use in self-hosted airgapped instances of Palette and Palette VerteX."
icon: " "
hide_table_of_contents: false
sidebar_position: 10
tags: ["virtual clusters"]
---

The Palette Virtual Cluster pack is available for use in tenants that belong to your airgapped self-hosted
instance of Palette and Palette VerteX. 

## Prerequisites

- An existing airgapped instance of Palette or Palette VerteX. Refer to the
  [Self-Hosted Palette Installation](../../enterprise-version/install-palette/install-palette.md) and
  [Palette VerteX Installation](../../vertex/install-palette-vertex/install-palette-vertex.md) guides for more information.

  :::info

  If your environment is configured to use an external proxy, you can use the **No Proxy** list to exclude any domains
  or IP addresses from proxying. You have the option to set the No Proxy list during the Palette installation flow. This
  is useful in scenarios where you know the IP addresses you want to exclude before deployment, such as load balancer IP
  addresses.

  :::

- At least one tenant created for your airgap instance of Palette or Palette VerteX. Refer to
  [Tenant Management](../../enterprise-version/system-management/tenant-management.md) for more information.

- An existing [cluster profile](../../profiles/cluster-profiles/cluster-profiles.md) configured for your virtual cluster.

- A healthy running [Palette host cluster](../../clusters/clusters.md).

- Access to the Palette airgap support Virtual Machine (VM) that you used for the initial Palette installation.

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

3. Refer to the [Palette Additional Packs](../../enterprise-version/install-palette/airgap/supplemental-packs.md#additional-deployment-options) page to download and install the **airgap-pack-vcluster** pack.

4. Log in to the tenant that belongs to your airgapped instance of Palette or Palette VerteX.

5. From the left **Main Menu**, select **Cluster Groups**, and create a **New Cluster Group**. Refer to the [Create and Manage Cluster Groups](../cluster-groups/create-cluster-group.md) guide for a full walkthrough.

6. Once you have a cluster group, follow the [Deploy a Virtual Cluster to a Cluster Group](deploy-virtual-cluster.md) guide to deploy your virtual cluster.

## Validate

1. Log in to the tenant that belongs to your airgapped instance of Palette or Palette VerteX.
   
2. Switch to **App Mode**.
   
3. Select **Virtual Clusters** from the left **Main Menu**. Your cluster is ready to use if the status is **Running**.

## Resources

- [Self-Hosted Palette Installation](../../enterprise-version/install-palette/install-palette.md)
  
- [Palette VerteX Installation](../../vertex/install-palette-vertex/install-palette-vertex.md)

- [Tenant Management](../../enterprise-version/system-management/tenant-management.md)

- [Cluster Profiles](../../profiles/cluster-profiles/cluster-profiles.md)

- [Creating Clusters on Palette](../../clusters/clusters.md)

- [Palette Additional Packs](../../enterprise-version/install-palette/airgap/supplemental-packs.md)

- [Create and Manage Cluster Groups](../cluster-groups/create-cluster-group.md)

- [Deploy a Virtual Cluster to a Cluster Group](deploy-virtual-cluster.md)
