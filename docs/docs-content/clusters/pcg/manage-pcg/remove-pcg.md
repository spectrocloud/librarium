---
sidebar_label: "Delete a PCG"
title: "Delete a PCG"
description: "Learn how to delete a Private Cloud Gateway (PCG) from Palette."
hide_table_of_contents: false
sidebar_position: 30
tags: ["pcg"]
---

You can delete a Private Cloud Gateway (PCG) from Palette. Deleting a PCG removes the PCG from Palette, along with the
Palette services deployed on the PCG nodes. Deleting a PCG does not remove the underlying infrastructure resources, such
as the virtual machines, or machines. Those resources must be removed manually from the infrastructure environment.

:::info

Removing a PCG will not impact deployed clusters. The clusters will continue to function as expected. However, you will
not be able to deploy new clusters or remove existing ones from the infrastructure environment until a new PCG is
deployed.

:::

Use the following steps to delete a PCG from Palette.

## Prerequisites

- A PCG is installed, active, and in a healthy state. Refer to [Deploy a PCG](../deploy-pcg/deploy-pcg.md) for
  instructions on how to install a PCG.

- Tenant administrator access.

- Access to the infrastructure environment to manually remove the underlying infrastructure resources.

## Delete a PCG

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Private Cloud Gateways**.

4. Identify the PCG you want to delete and click on the **Three-Dot Menu** at the end of the PCG row.

5. Select **Delete**.

6. Palette will prompt you to confirm the deletion. Click **OK** to confirm the deletion.

7. Deleting a PCG will remove the PCG from Palette and the Palette services deployed on the PCG nodes. The underlying
   infrastructure resources, such as virtual machines or machines, must be removed manually from the infrastructure
   environment.

8. If you deployed the PCG onto an existing Kubernetes cluster, you must manually remove the PCG services from the
   cluster. Use the following steps to remove the PCG services from the cluster.

   ```shell
   kubectl delete namespace jet-system
   kubectl delete namespace --selector spectrocloud.com/hostMode=self-hosted-pcg
   ```

## Validate

To validate that the PCG has been deleted, you can use the following steps.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant administrator.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. Next, on the **Tenant Settings Menu**, select **Private Cloud Gateways**.

4. The deleted PCG should no longer be visible in the list of PCGs.

5. Log in to the infrastructure environment and verify that the underlying infrastructure resources containing the
   prefix of the PCG name have been removed.
