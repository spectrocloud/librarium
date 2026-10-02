---
sidebar_label: "Palette Dev Engine"
title: "Palette Dev Engine"
description: "Troubleshooting steps for errors encountered with Palette Dev Engine."
icon: ""
hide_table_of_contents: false
sidebar_position: 40
tags: ["troubleshooting", "pde", "app mode"]
---

# Palette Dev Engine (PDE)

Use the following content to help you troubleshoot issues you may encounter when using Palette Dev Engine (PDE).

## Resource Requests

All [Cluster Groups](../clusters/cluster-groups/cluster-groups.md) are configured with a default
[_LimitRange_](https://kubernetes.io/docs/concepts/policy/limit-range/). The LimitRange configuration is in the Cluster
Group's Virtual Cluster configuration section. Packs deployed to a virtual cluster should have the `resources:` section
defined in the **values.yaml** file. Pack authors must specify the `requests` and `limits` or omit the section entirely
to let the system manage the resources.

If you specify `requests` but not `limits`, the default limits imposed by the LimitRange will likely be lower than the
requests, causing the following error.

```shell hideClipboard
Invalid value: "300m": must be less than or equal to CPU limit spec.containers[0].resources.requests: Invalid value: "512Mi": must be less than or equal to memory limit
```

The workaround is to define both the `requests` and `limits`.

## Scenario - Controller Manager Pod Not Upgraded

If the `palette-controller-manager` pod for a virtual cluster is not upgraded after a Palette platform upgrade, use the
following steps to resolve the issue.

### Debug Steps

1. Ensure you can connect to the host cluster using the cluster's kubeconfig file. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) guide for additional guidance.

2. Identify the namespace where the virtual cluster is active. Use the virtual cluster's ID to identify the correct
   namespace. Use the following to extract the namespace. Make sure you get the correct namespace for the virtual
   cluster and not the main host cluster namespace.

   ```shell
   kubectl get pods --all-namespaces | grep cluster-management-agent
   ```

   In this example, the virtual cluster ID is `666c92d18b802543a124513d`.

   ```shell hideClipboard {2}
   cluster-666c89f28b802503dc8542d3   cluster-management-agent-f766467f4-8prd6     1/1     Running     1 (29m ago)   30m
   cluster-666c92d18b802543a124513d   cluster-management-agent-f766467f4-8v577     1/1     Running     0             4m13s
   ```

   :::tip

   You can find the virtual cluster ID in the URL when you access the virtual cluster in the Palette UI. From the left
   **Main Menu**, click on **Cluster Groups** and select the cluster group hosting your virtual cluster. Click on the
   virtual cluster name to access the virtual cluster. The URL will contain the virtual cluster ID.

   :::

3. Scale down the `cluster-management-agent` deployment to 0. Replace `<namespace>` with the namespace of the virtual
   cluster.

   ```shell
   kubectl scale deployment cluster-management-agent --replicas=0 --namespace <namespace>
   ```

   ```shell hideClipboard
   deployment.apps/cluster-management-agent scaled
   ```

4. Edit the `palette-controller-manager` deployment and under the resources section for the `manager` and `atop` add the
   `ephemeral-storage` field and the `1Gi` value.

   ```yaml {4}
   name: manager
   resources:
     limits:
       ephemeral-storage: 1Gi
   ```

   ```yaml {4}
   name: atop-manager
    resources:
      limits:
        ephemeral-storage: 1Gi
   ```

   You can use the following command to edit the deployment. Press `i` to enter insert mode, make the necessary changes,
   and then press `Esc` followed by `:wq` to save and exit.

   ```shell
   kubectl edit deployment palette-controller-manager --namespace <namespace>
   ```

   ```shell hideClipboard
   deployment.apps/palette-controller-manager edited
   ```

5. Wait for the new `palette-manager` pod to become healthy and active.

6. Scale up the `cluster-management-agent` deployment to 1. Replace `<namespace>` with the namespace of the virtual
   cluster.

   ```shell
   kubectl scale deployment cluster-management-agent --replicas=1 --namespace <namespace>
   ```

   ```shell hideClipboard
   deployment.apps/cluster-management-agent scaled
   ```

## Scenario - Apply Host Cluster Resource Limits to Virtual Cluster

If you encounter Out-of-Memory (OOM) errors for the Palette agent pod inside a virtual cluster, it may be due to default
resource limits set in the Cluster Group's
[Virtual Cluster configuration](../clusters/cluster-groups/create-cluster-group.md#palette-virtual-cluster-configuration).
By default, virtual clusters are limited to half the resources of the host cluster. If you need to override the resource
limits for a virtual cluster, and use the host cluster's default resource limits, follow the steps below.

### Debug Steps

1. Open a terminal and connect to the host cluster using the cluster's kubeconfig file. Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md) guide for additional guidance.

2. Create an empty _ConfigMap_. Use the following command to create the ConfigMap in the `jet-system` namespace.

   ```shell
   cat <<EOF > skip-palette-patch.yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: skip-palette-patch
     namespace: jet-system
   data: {}
   EOF
   ```

3. Issue the following command to apply the ConfigMap to the host cluster.

   ```shell
   kubectl apply --filename=skip-palette-patch.yaml
   ```

4. Repeat step one through three for each host cluster that makes up the Cluster Group.
