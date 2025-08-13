---
sidebar_label: "Configure Direct Access to VM Dashboard"
title: "Configure Direct Access to Virtual Machine Dashboard"
description: "Learn how to configure a direct address to a cluster's virtual machines."
sidebar_position: 40
tags: ["vmo"]
---

This guide provides step-by-step instructions on how to configure an address for the **Virtual Machines** dashboard of
clusters configured using Virtual Machine Orchestrator (VMO). This configuration allows you to have direct access to
your virtual machines, without needing to navigate to **Clusters** > cluster **Overview** > **Virtual Machines**.

## Prerequisites

- Access to [Palette](https://console.spectrocloud.com) multi-tenant SaaS or a dedicated SaaS installation. Learn more
  about Palette installations on the [Deployment Architecture Overview](../architecture/architecture-overview.md) page.

- A workload cluster with VMO installed and configured. Refer to the [VMO](./vm-management.md) guide for details.
  <!--prettier-ignore-start-->

  - The cluster must use the **Direct** preset on the
    <VersionedLink text="Virtual Machine Orchestrator" url="/integrations/packs/?pack=virtual-machine-orchestrator" />
    layer.
  - Ensure that the [VM User Roles and Permissions](./rbac/vm-roles-permissions.md) are configured for your Palette
    user.

<!--prettier-ignore-end-->

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**. The cluster list appears. Select the VMO cluster you previously
   deployed.

3. From the cluster **Overview** tab, download the [Kubeconfig](../clusters/cluster-management/kubeconfig.md) file. This
   file allows you to connect to your deployed cluster.

4. Navigate to your terminal window and set the environment variable `KUBECONFIG` to point to the file you downloaded.

   ```shell
   export KUBECONFIG=<path-to-downloaded-kubeconfig-file>
   ```

5. Execute the following command to find the `vm-dashboard` service deployed by the VMO pack. Make a note of the
   external IP of the service. This could be a fully qualified domain name or an IP address.

   ```shell
   kubectl get services --namespace vm-dashboard
   ```

   ```text hideClipboard title="Example output"
    NAME           TYPE           CLUSTER-IP   EXTERNAL-IP         PORT(S)         AGE
    vm-dashboard   LoadBalancer   10.0.0.5     198.51.100.42       xxx:xxxxx/TCP   XXd
   ```

6. Return to [Palette](https://console.spectrocloud.com). Select the **Profile** tab of your cluster.

7. Select the **Virtual Machine Orchestrator** layer to edit it. Then, select **Values**. The values editor appears.

8. Paste the external IP you made a note of in step 5 in the
   `charts.virtual-machine-orchestrator.appConfig.clusterInfo.consoleBaseAddress` field. Append `/v1` to the value.

   ```text hideClipboard title="Example value"
    consoleBaseAddress: "https://198.51.100.42/v1"
   ```

9. Click **Save** to apply your changes. Wait for Palette to complete your cluster update.

## Validation

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**. The cluster list appears. Select the VMO cluster you previously
   deployed.

3. On the cluster **Overview** tab, select the **Connect** button in the **Virtual Machine Dashboard** section. A new
   tab opens with the address you configured and shows the virtual machines dashboard.

   ![Connect VM dashboard button](/vm-management_configure-console-base-address_connect-button.webp)

You can bookmark your configured address and access the VM dashboard for your cluster directly, without navigating
through Palette. You will need to log in with your Palette user credentials as usual to access it.
