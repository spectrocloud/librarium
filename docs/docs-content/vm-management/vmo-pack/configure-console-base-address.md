---
sidebar_label: "Configure Direct Access to VM Dashboard"
title: "Configure Direct Access to Virtual Machine Dashboard"
description: "Learn how to configure a direct address to a cluster's virtual machines."
sidebar_position: 40
tags: ["vmo"]
---

This guide provides step-by-step instructions on how to configure a direct address for the Virtual Machine dashboard of
clusters configured using Virtual Machine Orchestrator (VMO) in **Direct** mode. When you set this address, Palette
replaces the **Virtual Machines** tab with a **Connect** button in the **Virtual Machine Dashboard** section of the
cluster **Overview** tab. The button opens the dashboard directly at the address you configure, in a new browser tab.

## Prerequisites

- Access to [Palette](https://console.spectrocloud.com) multi-tenant SaaS or a dedicated SaaS installation. Learn more
  about Palette installations on the [Deployment Architecture Overview](../../architecture/architecture-overview.md)
  page.

- A workload cluster with VMO installed and configured. Refer to the [VMO](../vm-management.md) guide for details.
  <!--prettier-ignore-start-->

  - VMO must be deployed as its own add-on cluster profile. If the VMO pack is a layer inside a full cluster profile,
    the **Connect** button and the **Virtual Machines** tab do not appear, regardless of the address you configure.
    Refer to [Create a VMO Profile](./create-vmo-profile.md) for guidance.
  - The cluster must use the **Direct** preset on the
    <VersionedLink text="Virtual Machine Orchestrator" url="/integrations/packs/?pack=virtual-machine-orchestrator" />
    layer.
  - Ensure that the [VM User Roles and Permissions](../rbac/vm-roles-permissions.md) are configured for your Palette
    user.

<!--prettier-ignore-end-->

## Enablement

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**. The cluster list appears. Select the VMO cluster you previously
   deployed.

3. From the cluster **Overview** tab, download the [Kubeconfig](../../clusters/cluster-management/kubeconfig.md) file.
   This file allows you to connect to your deployed cluster.

4. Open a terminal session and set the environment variable `KUBECONFIG` to point to the file you downloaded.

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
   `charts.virtual-machine-orchestrator.appConfig.clusterInfo.consoleBaseAddress` field. Do not append `/v1` to the
   value. The `/v1` suffix is not used in VMO pack version 4.10.x and later.

   ```text hideClipboard title="Example value"
    consoleBaseAddress: "https://198.51.100.42"
   ```

9. In the same values editor, set `charts.virtual-machine-orchestrator.vmo-manager.platform.baseUrl` to the same
   address, again without `/v1`. VMO uses `consoleBaseAddress` to surface the **Connect** button and `platform.baseUrl`
   to build the OIDC redirect URI, so both must point to the address that users reach the dashboard at.

   ```yaml
   charts:
     virtual-machine-orchestrator:
       vmo-manager:
         platform:
           baseUrl: "https://198.51.100.42"
   ```

   :::info

   The VMO pack currently holds this address in two places. A later pack version plans to merge them into a single
   parameter. Until then, set both to the same value.

   :::

10. Click **Save** to apply your changes. Wait for Palette to complete your cluster update.

## Validation

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the left main menu, select **Clusters**. The cluster list appears. Select the VMO cluster you previously
   deployed.

3. On the cluster **Overview** tab, select the **Connect** button in the **Virtual Machine Dashboard** section. A new
   tab opens with the address you configured and shows the virtual machines dashboard.

   ![Connect VM dashboard button](/vm-management_configure-console-base-address_connect-button.webp)

You can bookmark your configured address and access the VM dashboard for your cluster directly, without navigating
through Palette. You need to log in with your Palette user credentials as usual to access it.
