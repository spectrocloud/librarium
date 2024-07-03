---
sidebar_label: "Packs"
title: "Packs"
description: "Troubleshooting steps for common Pack scenarios."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["troubleshooting", "packs"]
---

The following are common scenarios that you may encounter when using Packs.

## Scenario - Control Plane Node Fails to Upgrade in Sequential MicroK8s Upgrades

In clusters that use [MicroK8s](../integrations/microk8s.md) as the Kubernetes distribution, there is a known issue when
using the `InPlaceUpgrade` strategy for sequential Kubernetes upgrades. For example, upgrading from version 1.25.x to
version 1.26.x and then to version 1.27.x may cause the control plane node to fail to upgrade. Use the following steps
to troubleshoot and resolve the issue.

### Debug Steps

1. Execute the first MicroK8s upgrade in your cluster. For example, upgrade from version 1.25.x to version 1.26.x.

2. Ensure you can access your cluster using kubectl. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) guide for more information.

3. After the first upgrade is complete, issue the following command to delete the pod named `upgrade-pod`.

   ```shell
   kubectl delete pod upgrade-pod --namespace default
   ```

4. Once the pod is deleted, proceed to the next upgrade. For example, upgrade from version 1.26.x to version 1.27.x.

5. Within a few minutes, the control plane node will be upgraded correctly.
