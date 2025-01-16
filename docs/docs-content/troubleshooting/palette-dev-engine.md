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

## Scenario - Adjust Virtual Clusters Limits Before Palette Upgrades

Palette upgrades on K3s virtual clusters may get stuck if the cluster does not have enough resources to accommodate
additional pods. Ensure that your cluster has 1 CPU, 1 GiB of memory, and 1 GiB storage of free resources before
commencing an upgrade. Use the following steps to adjust the resource limits of a virtual cluster.

### Debug Steps

1. Log in to [Palette](https://console.spectrocloud.com).

2. Select **Cluster Groups** from the left **Main Menu**. The list of cluster groups appears.

3. Select the **Virtual Clusters** tab. Next, select one of your virtual clusters.

4. Click **Settings**. Then, select **Cluster Settings**. The **Settings** pane appears.

5. Select the **Cluster Size** tab. Make a note of the CPU, memory and storage allocation indicated in their respective
   fields. Close the **Settings** pane once you are done reviewing the resources.

6. Click on the host cluster link in the **Host Cluster** field. The cluster **Overview** tab appears.

7. Download the **kubeconfig** file for your cluster. Open a terminal and navigate to the location of the file.

8. Set the `KUBECONFIG` environment variable to the file path of the **kubeconfig** file to enable you to connect to it
   using [kubectl CLI](https://kubernetes.io/docs/reference/kubectl/). Refer to the
   [Access Cluster with CLI](../clusters/cluster-management/palette-webctl.md#access-cluster-with-cli) section for
   further guidance.

   ```shell
   export KUBECONFIG=/path/to/your/kubeconfig
   ```

9. Execute the following commands to find the CPU and memory usage of all the pods deployed to your virtual cluster.
   This gives you an approximation of the resource usage in your virtual cluster.

   ```shell
   virtual_cluster_namespace=$(kubectl get pods --all-namespaces --no-headers | grep '^.*\svirtual-cluster' | awk '{print $1}')
   kubectl top pods --namespace $virtual_cluster_namespace
   ```

   The output will be similar to the following snippet.

   ```shell hideClipboard
   NAME                                                             CPU(cores)   MEMORY(bytes)
   capvc-controller-manager-85d7556d5c-49vh2                        2m           17Mi
   cluster-management-agent-7bffcc7c76-529tl                        7m           45Mi
   coredns-76699fd4f5-7vpkl-x-kube-system-x-virtual-cluster-cetus   2m           14Mi
   palette-controller-manager-6d55b49c54-pmp8s                      12m          80Mi
   virtual-cluster-cetus-0                                          36m          389Mi
   ```

10. Compare your CPU and memory usage to the virtual cluster allocations that you made note of earlier in step five.
    Your cluster should have 1 CPU, 1 GiB of memory, and 1 GiB of storage free before commencing an upgrade. If your
    cluster requires further resources and your virtual cluster allocation is at the limit, you can increase your
    virtual cluster limits.

11. Navigate back to the Palette UI. In the left **Main Menu**, select **Cluster Groups** . The list of cluster groups
    appears.

12. Select the cluster group corresponding to your virtual cluster. Click on **Settings** in the top right-hand corner.
    The **Cluster Group Settings** pane appears.

13. Select the **Settings** tab. You can adjust the CPU, memory, and storage limits according to your requirements from
    the **Virtual Clusters Limits** section. Alternatively, you can disable limits entirely by changing the
    `isolation.resourceQuota.enabled` YAML value to `false`. Click **Save Changes**. Close the **Settings** pane.

14. Select the **Virtual Clusters** tab. From the clusters list, choose the virtual cluster you have been analyzing.

15. Click **Settings**. Next, select **Cluster Settings**. The **Settings** pane appears.

16. Select the **Cluster Size** tab. You can then resize the cluster size to ensure there is 1 CPU, 1 GiB of memory, and
    1 GiB storage of free resources.

17. Repeat steps one through 16 for each virtual cluster.
