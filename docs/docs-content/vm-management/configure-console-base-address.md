---
sidebar_label: "Configure Direct Access to Virtual Machines"
title: "Configure Direct Access to Virtual Machines"
description: "Learn how to configure a direct address to a cluster's virtual machines."
sidebar_position: 30
tags: ["vmo"]
---

This guide provides step-by-step instructions on how to configure an address for the Virtual Machines tab of cluster
configured using Virtual Machine Orchestrator (VMO). This configuration allows you to have direct access to your virtual
machines, without additional navigation in the Palette UI.

## Prerequisites

- Access to [Palette](https://console.spectrocloud.com) multi-tenant SaaS or a dedicated SaaS installation. Learn more
  about Palette installations on the [Deployment Architecture Overview](../architecture/architecture-overview.md) page.

<!--prettier-ignore-start-->

  - Ensure that the [VM User Roles and Permissions](./rbac/vm-roles-permissions.md) are configured for your Palette user.

<!--prettier-ignore-end-->

- A workload cluster with VMO installed and configured. Refer to the [VMO](./vm-management.md) guide for details.
  <!--prettier-ignore-start-->

  - The cluster must use the **Direct** preset on the
    <VersionedLink text="Virtual Machine Orchestrator" url="/integrations/packs/?pack=virtual-machine-orchestrator" />
    layer.

<!--prettier-ignore-end-->

## Enablement

1. Log into [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**. The cluster list appears. Select the VMO cluster you previously
   deployed. The cluster **Overview** appears.

3. Download the [Kubeconfig](../clusters/cluster-management/kubeconfig.md) file, which allows you to connect to the
   deployed cluster.

4. Navigate to your terminal window and set the environment variable `KUBECONFIG` to point to the file you downloaded.

   ```shell
   export KUBECONFIG=<path-to-downloaded-kubeconfig-file>
   ```

5. Execute the following command to find the `vm-dashboard` service deployed by the VMO pack. Make a note of the
   external IP of the service.

   ```shell
   kubectl get services --namespace vm-dashboard
   ```

   ```text hideClipboard title="Example output"
    NAME           TYPE           CLUSTER-IP     EXTERNAL-IP                         PORT(S)         AGE
    vm-dashboard   LoadBalancer   xxx.xxx.xxx.x  external-url.example.com          xxx:xxxxx/TCP   XXd
   ```

6. Navigate back to [Palette](https://console.spectrocloud.com). The **Overview** tab of your cluster appears. Select
   the **Profile** tab.

7. Select the **Virtual Machine Orchestrator** layer to edit it. Then, select \*\*Values. The values editor appears.

8. Paste the external IP you made a note of in Step 5 in the
   `charts.virtual-machine-orchestrator.appConfig.clusterInfo.consoleBaseAddress` field. Append `/v1` to the value.

   ```text hideClipboard title="Example value"
    consoleBaseAddress: "https://external-url.example.com/v1"
   ```

9. Click **Save** to apply your changes. Wait for Palette to complete your cluster repave.

## Validation

1. Log into [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**. The cluster list appears. Select the VMO cluster you previously
   deployed. The cluster **Overview** appears.

3. Select the **Connect** button in the **Virtual Machine Dashboard** section. A new tab opens with the address you
   configured and shows the virtual machines dashboard.

   ![Connect VM dashboard button](/vm-management_configure-console-base-address_connect-button.webp)

You can bookmark your configured address and access the VM dashboard for your cluster directly, without navigating
through Palette. You will need to authenticate as usual to access it.
