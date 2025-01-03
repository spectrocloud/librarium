---
sidebar_label: "Create Hybrid Node Pools"
title: "Create Hybrid Node Pools"
description: "Learn how to create hybrid node pools and add your edge hosts to them."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 30
---

This section guides you on how to create a cluster profile to collectively manage your Amazon Elastic Kubernetes Service
(Amazon EKS) Hybrid Nodes. You can then create hybrid node pools and add your edge hosts to them.

You must then configure your networking to allow traffic to reach the pods on your hybrid nodes.

## Limitations

- Overall cluster health is determined by the Amazon EKS cluster's status. While unhealthy edge hosts will appear as
  unhealthy nodes in Palette, this does not change the Amazon EKS cluster's overall health status.

## Create Cluster Profile for Hybrid Node Pools

### Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to create a cluster profile. Refer to the
  [Cluster Profile](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  permissions for guidance.

### Create Profile

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Profiles**.

3. On the **Profiles** page, click **Add Cluster Profile**.

4. Fill out the basic information and ensure **Type** is set to **Full**. Click **Next** when done.

5. Select **Edge Native** from the **Infrastructure provider** list, and click **Next**.

6. Select your base OS pack depending on how you will register your edge hosts.

   - For Agent Mode, select **BYOS - Agent Mode**.
   - For provider images, select **BYOS - Edge OS**.

7. If selecting **BYOS - Agent Mode**, on the **Configure Pack** page, click **Values** under **Pack Details**. Then,
   click on **Presets** on the right-hand side, and select **Agent Mode**.

8. Click **Next layer** to continue.

9. Select **Nodeadm** as your base Kubernetes pack, and click **Next**.

10. On the **Configure Pack** page, under **Pack Version**, select your Kubernetes version from the **drop-down Menu**.

11. In the YAML editor, make any changes you need for the kubelet or containerd configuration. Refer to
    [Amazon EKS Hybrid Nodes Configuration](https://github.com/aws/eks-hybrid?tab=readme-ov-file#configuration) for
    guidance on the available options.

12. Click **Next layer** to continue.

13. Select **Custom CNI** as your base Network pack, and click **Next**.

14. In the YAML editor on the **Configure Pack** page, change the value of `manifests.byo-cni.contents.data.custom-cni`
    from `calico` to `dummy`.

    :::info

    While this change is not required for the pack to function, setting it to `dummy` better indicates that this pack
    serves as a placeholder only. This is because the Container Network Interface (CNI) was already created for hybrid
    nodes during the [Add CNI Cluster Profile](./import-eks-cluster-enable-hybrid-mode.md#add-cni-cluster-profile)
    steps.

    :::

15. Click **Confirm** when complete.

16. In **Profile Layers**, click **Next** to continue.

17. Click **Finish Configuration**.

Your cluster profile for hybrid nodes is now created and can be used in the
[Create Hybrid Node Pool](#create-hybrid-node-pool) steps.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Profiles**.

3. On the **Profiles** page, click on your newly created profile.

4. Check that your profile layers are present and correct.

## Create Hybrid Node Pool

### Prerequisites

- An Amazon EKS cluster imported with hybrid mode enabled. Refer to
  [Import EKS Cluster and Enable Hybrid Mode](./import-eks-cluster-enable-hybrid-mode.md) for guidance.

- Edge hosts have been registered with Palette through
  [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md) or by using
  [provider images](../../../edge/edgeforge-workflow/palette-canvos/build-provider-images.md).

  :::warning

  If using provider images, you must include the following in your `.arg` file during the
  [build steps](../../../edge/edgeforge-workflow/palette-canvos/build-provider-images.md#build-provider-images).

  ```shell
  K8S_DISTRIBUTION=nodeadm
  K8S_VERSION=<kubernetesVersion>  # supported versions: [ 1.28.0 | 1.29.0 | 1.30.0 | 1.31.0 ]
  ```

  Replace `<kubernetesVersion>` with your version of Kubernetes. For example, `1.29.0`.

  :::

- A cluster profile created for your hybrid nodes. Refer to
  [Create Cluster Profile for Hybrid Node Pools](#create-cluster-profile-for-hybrid-node-pools) for steps.

- Verified network connectivity between your Amazon EKS cluster nodes and edge hosts.

  - If using a VPN, confirm that both tunnels of the site-to-site VPN connection are active and operational.

  - Ensure that a debug pod deployed on one of the Amazon EKS cluster's cloud worker nodes can successfully ping your
    edge hosts.

    <!-- prettier-ignore -->
    <details>
    <summary> Example ping command </summary>

    ```shell
    kubectl exec -it <debugPodName> -- ping <edgeHostIpAddress>
    ```

    </details>

  - Verify that your edge hosts can successfully ping the private IP address of an EC2 instance within the Amazon EKS
    cluster's VPC.

### Create Node Pool

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Clusters**.

3. Select your cluster to view its **Overview** tab.

4. Select the **Nodes** tab.

5. In the top-right, click **New Node Pool**.

6. In the pop-up window, fill in the following fields.

   | **Field**                        | **Description**                                                                                                                                                                                                                 |
   | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Node pool name**               | A descriptive name for the hybrid node pool.                                                                                                                                                                                    |
   | **Additional Labels (Optional)** | Labels can apply placement constraints on a pod. For example, you can add a label to make a node eligible to receive the workload. To learn more, refer to the [Node Labels](../../../cluster-management/node-labels.md) guide. |
   | **Taints**                       | Sets toleration to pods and allows (but does not require) the pods to schedule onto nodes with matching taints. To learn more, refer to the [Taints and Tolerations](../../../cluster-management/taints.md) guide.              |
   | **Hybrid Profile**               | Click in the field and select the cluster profile you [created for your hybrid nodes](#create-cluster-profile-for-hybrid-node-pools). Click **Configure**. Review the layers and click **Confirm**.                             |
   | **Architecture**                 | Select the architecture type for your edge hosts. Either **AMD64** or **ARM64**.                                                                                                                                                |
   | **NTP Servers (Optional)**       | The Network Time Protocol (NTP) servers to use for the hybrid nodes. For example, `pool.ntp.org`.                                                                                                                               |
   | **Nodes (edge hosts)**           | Click **Add Edge Hosts**. Select your edge hosts from the table by clicking the checkbox next to the **Machine ID**. Click **Confirm** once done.                                                                               |

7. Once your edge hosts have been selected, click **Configure** next to each edge host to review and configure
   individual host options.

   | **Field**                | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
   | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Host Name (Optional)** | Provide an optional name for the edge host that will be displayed in Palette.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
   | **NIC Name**             | Select a specific Network Interface Card (NIC) on the edge host from the **drop-down Menu**, or leave it on **Auto**.                                                                                                                                                                                                                                                                                                                                                                                                               |
   | **VPN server IP**        | Specify the Virtual Private Network (VPN) server's IP if the hybrid nodes in the pool use a VPN _and_ the hybrid node's network does not automatically route traffic to the EKS Virtual Private Cloud (VPC) Classless Inter-Domain Routing (CIDR) through the VPN server. If provided, a static route will be configured on edge hosts to route traffic to the Amazon EKS VPC CIDR through the VPN server. If not specified, ensure your hybrid node network routes traffic to the Amazon EKS VPC CIDR through the default gateway. |

8. Click **Confirm** once done.

9. Repeat step 7 and 8 for each edge host added to your node pool as needed.

10. Click **Confirm** on the **Add node pool** pop-up window to add the hybrid node pool to your cluster.

The hybrid node pool will then be provisioned and added to your cluster. This will take up to 15 minutes.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Clusters**.

3. Select your cluster to view its **Overview** tab.

4. Select the **Nodes** tab.

5. Your newly added hybrid node pool displays as **Running**.

   ![An active hybrid node pool on the Nodes tab](/aws_eks-hybrid_create-hybrid-node-pools_running-hybrid-pool.webp)

## Configure Hybrid Node Networking for VPN Solutions

This section explains how to configure your VPN with static routes to enable network traffic to reach pods on hybrid
nodes. Before proceeding, consider the following points:

- This guide is specifically for VPN solutions that support and require manual static route configuration. If your VPN
  uses a different routing mechanism, these steps may not apply.

- If your VPN supports BGP (Border Gateway Protocol), you may be able to skip manual route configuration entirely. BGP
  can automatically advertise and update routes between your cluster and VPN. Check your VPN's documentation for BGP
  neighbor configuration and route import procedures.

- These steps outline the general process for configuring a VPN with static routes. Refer to your VPN's documentation
  for provider-specific configuration details.

### Prerequisites

- Your hybrid node pool has been created and configured. Refer to [Create Hybrid Node Pool](#create-hybrid-node-pool)
  for guidance.

- Ensure [kubectl](https://kubernetes.io/docs/tasks/tools/) is installed and available in your local workstation.

- Access to your Amazon EKS cluster through kubectl.

  - To access your cluster with kubectl, you can use the AWS CLI's built-in authentication capabilities. If you are
    using a custom OIDC provider, you will need to configure your kubeconfig to use your OIDC provider.

    Refer to the
    [Access Imported Cluster with Kubectl](./import-eks-cluster-enable-hybrid-mode.md#access-imported-cluster-with-kubectl)
    section for more information.

- Access to your VPN configuration interface.

### Configure Networking

1. Issue the following kubectl command to list all CiliumNode resources in your cluster.

   ```shell
   kubectl get ciliumnode --output wide
   ```

   Example output.

   ```shell hideClipboard
   NAME                                    CILIUMINTERNALIP   INTERNALIP    AGE
   edge-abc123def4567890example1           192.168.5.101      10.200.1.23   2h
   edge-xyz987uvw6543210example2           192.168.6.102      10.200.2.34   3h
   ```

2. For each hybrid node, retrieve the `spec.ipam.podCIDRs` field to find the CIDR block allocated for pods active on
   that node.

   Replace `<nodeName>` with the name of your hybrid node discovered in step 1. Repeat this step for each hybrid node
   found.

   ```shell
   kubectl get ciliumnode <nodeName> --output yaml | grep "podCIDRs" --after-context 1
   ```

   Example output.

   ```shell hideClipboard
       podCIDRs:
       - 192.168.5.0/25
   ```

3. Access your VPN configuration interface. This could be a web UI, command-line tool, or API, depending on your VPN
   solution.

4. For each hybrid node, add the following entries.

   | **Field**              | **Description**                                                                                                         | **Example**        |
   | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------ |
   | **Destination**        | Use the `podCIDRs` value for the hybrid node discovered in step 2.                                                      | `192.168.4.128/25` |
   | **Next Hop / Gateway** | Specify the IP address of the hybrid node as listed in the CiliumNode resource under `internalIP` discovered in step 1. | `192.168.5.101`    |

5. Ensure the routes are saved and applied. The process varies depending on the VPN solution.

### Validate

1. From a pod in your Amazon EKS cluster, attempt to reach an active pod on a hybrid node.

   Replace `<podName>` with a pod in your Amazon EKS cluster and `<hybridPodIp>` with an IP address from an active pod
   on a hybrid node.

   ```shell
   kubectl exec --interactive --tty <podName> -- ping <hybridPodIp>
   ```

2. Check that the ping statistics from the output show a healthy connection.

   Example healthy output.

   ```shell hideClipboard
   PING 192.168.5.10 (192.168.5.10): 56 data bytes
   64 bytes from 192.168.5.10: icmp_seq=1 ttl=63 time=28.382 ms
   64 bytes from 192.168.5.10: icmp_seq=2 ttl=63 time=27.359 ms
   64 bytes from 192.168.5.10: icmp_seq=3 ttl=63 time=29.412 ms
   64 bytes from 192.168.5.10: icmp_seq=4 ttl=63 time=30.345 ms

   --- 192.168.5.10 ping statistics ---
   4 packets transmitted, 4 packets received, 0% packet loss
   round-trip min/avg/max/stddev = 27.359/28.875/30.345/1.091 ms
   ```

## When to Manually Repave Hybrid Node Pools

<!-- This section may be removed as the workaround is not currently working. There may also be repave logic included to resolve this for 4.5.c. -->

Your hybrid node pools require manual repaving in these scenarios:

- After modifying the **Access Management** settings of your Amazon EKS cluster in Palette. Refer to steps 11 through 13
  in [Import Cluster](./import-eks-cluster-enable-hybrid-mode.md#import-cluster).
- After changing an edge host's **VPN Server IP**. Refer to step 7 in [Create Node Pool](#create-node-pool).

These changes do not take effect until you repave the affected node pools.

- For **Access Management** changes, repave all hybrid node pools.
- For **VPN Server IP** changes, repave only the node pool containing the modified edge host.

### Prerequisites

- Your Palette account role must have the `cluster.update` permission to edit clusters. Refer to the
  [Cluster Profile](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  permissions for guidance.

### Trigger Repave on Hybrid Node Pool

Use the following steps to manually trigger a repave on a hybrid node pool.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Profiles**.

3. On the **Profiles** page, click on your hybrid node pool cluster profile.

4. You can confirm that this cluster profile is managing your hybrid node pool by viewing the **In Use Clusters** list.
   Your hybrid node pool names are listed here.

   ![Edit Hybrid Profile](/aws_eks-hybrid_create-hybrid-node-pools_in-use-clusters.webp)

5. Click on the **cni-custom 0.1.0** network layer to view the **Edit Pack** page.

6. In the YAML editor on the right, change the value for `manifests.byo-cni.contents.data.custom-cni` to something
   different.

   Example.

   ```yaml
   custom-cni: "dummy-repave-1"
   ```

   As mentioned in step 14 during the [Create Profile](#create-profile) steps, the specific value you enter does not
   affect your hybrid node pool's functionality, but any change to this field will trigger the required repave.

7. Click **Confirm Updates** when done, then click **Save Changes**.

8. From the left **Main Menu**, select **Clusters**.

9. Select your cluster to view its **Overview** tab.

10. Select the **Nodes** tab.

11. On the **Nodes** tab, once the profile change has been processed, an **Updates pending** banner appears. Click on
    **Node Pool Updates** in the banner.

12. On the **Pool changes summary** pop-up window, click the checkbox next to **Upcoming changes in hybridPoolName
    configuration**. Click **Confirm** afterward.

13. On the **Review update changes** window, review your changes and click **Confirm** to start the repave.

The hybrid node pool repave will now complete. This can take up to one hour.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Select your cluster to view its **Overview** tab.

4. Click on the **Nodes** tab.

5. Verify that all hybrid node pools are in the healthy status.

## Resources

- [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md)

- [Build Provider Images](../../../edge/edgeforge-workflow/palette-canvos/build-provider-images.md)

- [Worker Node Pool](../../../cluster-management/node-pool.md#worker-node-pool)

- [Access Imported Cluster with Kubectl](./import-eks-cluster-enable-hybrid-mode.md#access-imported-cluster-with-kubectl)
