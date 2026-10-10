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

- The manifest output for your provider image that was created during the
  [Register Edge Host in Appliance Mode](./prepare-environment/prepare-edge-hosts.md#register-edge-host-in-appliance-mode)
  steps.

### Create Profile

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Profiles**.

3. On the **Profiles** page, click **Add Cluster Profile**.

4. Fill out the basic information and ensure **Type** is set to **Full**. Click **Next** when done.

5. Select **Edge Native** from the **Infrastructure provider** list, and click **Next**.

6. Select **BYOS - Edge OS** as your base OS pack.

7. If using [Agent Mode](../../../../deployment-modes/agent-mode/agent-mode.md), on the **Configure Pack** page, click
   **Values** under **Pack Details**. Then, click on **Presets** on the right-hand side, and select **Agent Mode**.

<!-- prettier-ignore -->
8. If using [Appliance Mode](../../../../deployment-modes/appliance-mode/appliance-mode.md), on the **Configure Pack** page, click
   **Values** under **Pack Details**. Then, replace the contents of the pack manifest with your built image
   manifest.

   Example.

   ```yaml hideClipboard
   pack:
     content:
       images:
         - image: '{{.spectro.pack.edge-native-byoi.options.system.uri}}'
     # Below config is default value, please uncomment if you want to modify default values
     #drain:
       #cordon: true
       #timeout: 60 # The length of time to wait before giving up, zero means infinite
       #gracePeriod: 60 # Period of time in seconds given to each pod to terminate gracefully. If negative, the default value specified in the pod will be used
       #ignoreDaemonSets: true
       #deleteLocalData: true # Continue even if there are pods using emptyDir (local data that will be deleted when the node is drained)
       #force: true # Continue even if there are pods that do not declare a controller
       #disableEviction: false # Force drain to use delete, even if eviction is supported. This will bypass checking PodDisruptionBudgets, use with caution
       #skipWaitForDeleteTimeout: 60 # If pod DeletionTimestamp older than N seconds, skip waiting for the pod. Seconds must be greater than 0 to skip.
    options:
      system.uri: "{{ .spectro.pack.edge-native-byoi.options.system.registry }}/{{ .spectro.pack.edge-native-byoi.options.system.repo }}:{{ .spectro.pack.edge-native-byoi.options.system.k8sDistribution }}-{{ .spectro.system.kubernetes.version }}-{{ .spectro.pack.edge-native-byoi.options.system.peVersion }}-{{ .spectro.pack.edge-native-byoi.options.system.customTag }}"

      system.registry: spectrocloud
      system.repo: ubuntu
      system.k8sDistribution: nodeadm
      system.osName: ubuntu
      system.peVersion: v4.5.15
      system.customTag: eks-hybrid
      system.osVersion: 22
   ```

9. Click **Next layer** to continue.

10. Select **Nodeadm** as your base Kubernetes pack, and click **Next**.

11. On the **Configure Pack** page, under **Pack Version**, select your Kubernetes version from the **drop-down Menu**.

12. In the YAML editor, make any changes you need for the kubelet or containerd configuration. Refer to
    [Amazon EKS Hybrid Nodes Configuration](https://github.com/aws/eks-hybrid?tab=readme-ov-file#configuration) for
    guidance on the available options.

13. Click **Next layer** to continue.

14. Select **Custom CNI** as your base Network pack, and click **Next**.

15. In the YAML editor on the **Configure Pack** page, change the value of `manifests.byo-cni.contents.data.custom-cni`
    from `calico` to `dummy`.

    :::info

    While this change is not required for the pack to function, setting it to `dummy` better indicates that this pack
    serves as a placeholder only. This is because the Container Network Interface (CNI) was already created for hybrid
    nodes during the [Add CNI Cluster Profile](./import-eks-cluster-enable-hybrid-mode.md#add-cni-cluster-profile)
    steps.

    :::

16. Click **Confirm** when complete.

17. In **Profile Layers**, click **Next** to continue.

18. Click **Finish Configuration**.

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

- Edge hosts have been registered with Palette using the steps in
  [Prepare Edge Hosts](./prepare-environment/prepare-edge-hosts.md).

- A cluster profile created for your hybrid nodes. Refer to
  [Create Cluster Profile for Hybrid Node Pools](#create-cluster-profile-for-hybrid-node-pools) for steps.

- Verified network connectivity between your Amazon EKS cluster nodes and edge hosts. Refer to
  [Prepare Network - Inter-Site Connectivity](./prepare-environment/prepare-network.md#inter-site-connectivity) for
  guidance.

  - If using a VPN, confirm that both tunnels of the site-to-site VPN connection are active and operational.

  - Ensure that a debug pod deployed on one of the Amazon EKS cluster's cloud worker nodes can successfully ping your
    edge hosts.

    <!-- prettier-ignore -->
    <details>
    <summary> Example </summary>

    1. Deploy a lightweight debug pod in your Amazon EKS cluster if one does not exist.

       The following example command creates a pod named `debug-pod` using the Busybox image, which includes basic
       networking utilities. The pod will stay alive for 1 hour (3600 seconds).

       ```shell
       export POD=debug-pod
       kubectl run "$POD" --image=busybox --restart=Never -- sleep 3600
       ```

    2. From the debug pod in your Amazon EKS cluster, attempt to reach an active hybrid node.

       Replace `<hybridNodeIp>` with an IP address from an active hybrid node.

       ```shell
       kubectl exec --stdin --tty "$POD" -- ping <hybridNodeIp>
       ```

    3. Check that the ping statistics from the output show a healthy connection.

       Example healthy output.

       ```shell hideClipboard
       PING 10.200.1.23 (10.200.1.23): 56 data bytes
       64 bytes from 10.200.1.23: icmp_seq=1 ttl=63 time=28.382 ms
       64 bytes from 10.200.1.23: icmp_seq=2 ttl=63 time=27.359 ms
       64 bytes from 10.200.1.23: icmp_seq=3 ttl=63 time=29.412 ms
       64 bytes from 10.200.1.23: icmp_seq=4 ttl=63 time=30.345 ms

       --- 10.200.1.23 ping statistics ---
       4 packets transmitted, 4 packets received, 0% packet loss
       round-trip min/avg/max/stddev = 27.359/28.875/30.345/1.091 ms
       ```

    </details>

  - Verify that your edge hosts can successfully ping the private IP address of your AWS VPC gateway or an AWS worker
    node within the Amazon EKS cluster's VPC.

    <!-- prettier-ignore -->
    <details>
    <summary> Example </summary>

    1. From an edge host in your on-prem environment, attempt to reach your AWS VPC gateway or an AWS worker node.

       Replace `<awsGatewayOrNode>` with the IP address of your AWS VPC gateway or AWS worker node, for example,
       `10.100.0.1` or `10.100.0.27`.

       ```shell
       ping <awsGatewayOrNode>
       ```

    2. Check that the ping statistics from the output show a healthy connection.

       Example healthy output.

       ```shell hideClipboard
       PING 10.100.0.1 (10.100.0.1) 56(84) bytes of data.
       64 bytes from 10.100.0.1: icmp_seq=1 ttl=64 time=27.5 ms
       64 bytes from 10.100.0.1: icmp_seq=2 ttl=64 time=28.2 ms
       64 bytes from 10.100.0.1: icmp_seq=3 ttl=64 time=29.1 ms
       64 bytes from 10.100.0.1: icmp_seq=4 ttl=64 time=27.9 ms
       --- 10.100.0.1 ping statistics ---
       4 packets transmitted, 4 received, 0% packet loss, time 3999ms
       rtt min/avg/max/mdev = 27.5/28.2/29.1/0.6 ms
       ```

    </details>

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

- If your VPN supports Border Gateway Protocol (BGP), you may be able to skip manual route configuration entirely. BGP
  can automatically advertise and update routes between your cluster and VPN. Check your VPN documentation for BGP
  neighbor configuration and route import procedures.

- These steps outline the general process for configuring a VPN with static routes. Refer to your VPN documentation for
  provider-specific configuration details.

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

### Configure VPN Networking

1. Issue the following kubectl command to list all CiliumNode resources in your cluster.

   ```shell
   kubectl get ciliumnode --output wide
   ```

   Example output.

   ```shell hideClipboard
   NAME                                    CILIUMINTERNALIP   INTERNALIP    AGE
   edge-abc123def4567890example1           192.168.5.101      10.200.1.23   2h
   edge-xyz987uvw6543210example2           192.168.6.102      10.200.0.34   3h
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

   | **Field**              | **Description**                                                                                                         | **Example**      |
   | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------- |
   | **Destination**        | Use the `podCIDRs` value for the hybrid node discovered in step 2.                                                      | `192.168.5.0/25` |
   | **Next Hop / Gateway** | Specify the IP address of the hybrid node as listed in the CiliumNode resource under `internalIP` discovered in step 1. | `10.200.1.23`    |

5. Ensure the routes are saved and applied. The process varies depending on the VPN solution.

### Validate

1. Deploy a lightweight debug pod in your Amazon EKS cluster if one does not exist.

   The following example command creates a pod named `debug-pod` using the Busybox image, which includes basic
   networking utilities. The pod will stay alive for 1 hour (3600 seconds).

   ```shell
   export POD=debug-pod
   kubectl run "$POD" --image=busybox --restart=Never -- sleep 3600
   ```

2. From the debug pod in your Amazon EKS cluster, attempt to reach an active hybrid node.

   Replace `<hybridNodeIp>` with an IP address from an active hybrid node.

   ```shell
   kubectl exec --stdin --tty "$POD" -- ping <hybridNodeIp>
   ```

3. Check that the ping statistics from the output show a healthy connection.

   Example healthy output.

   ```shell hideClipboard
   PING 10.200.1.23 (10.200.1.23): 56 data bytes
   64 bytes from 10.200.1.23: icmp_seq=1 ttl=63 time=28.382 ms
   64 bytes from 10.200.1.23: icmp_seq=2 ttl=63 time=27.359 ms
   64 bytes from 10.200.1.23: icmp_seq=3 ttl=63 time=29.412 ms
   64 bytes from 10.200.1.23: icmp_seq=4 ttl=63 time=30.345 ms

   --- 10.200.1.23 ping statistics ---
   4 packets transmitted, 4 packets received, 0% packet loss
   round-trip min/avg/max/stddev = 27.359/28.875/30.345/1.091 ms
   ```

4. From an edge host in your on-prem environment, attempt to reach your AWS VPC gateway or an AWS worker node within the
   Amazon EKS cluster's VPC.

   Replace `<awsGatewayOrNode>` with the IP address of your AWS VPC gateway or AWS worker node, for example,
   `10.100.0.1` or `10.100.0.27`.

   ```shell
   ping <awsGatewayOrNode>
   ```

5. Check that the ping statistics from the output show a healthy connection.

   Example healthy output.

   ```shell hideClipboard
   PING 10.100.0.1 (10.100.0.1) 56(84) bytes of data.
   64 bytes from 10.100.0.1: icmp_seq=1 ttl=64 time=27.5 ms
   64 bytes from 10.100.0.1: icmp_seq=2 ttl=64 time=28.2 ms
   64 bytes from 10.100.0.1: icmp_seq=3 ttl=64 time=29.1 ms
   64 bytes from 10.100.0.1: icmp_seq=4 ttl=64 time=27.9 ms
   --- 10.100.0.1 ping statistics ---
   4 packets transmitted, 4 received, 0% packet loss, time 3999ms
   rtt min/avg/max/mdev = 27.5/28.2/29.1/0.6 ms
   ```

## When to Manually Repave Hybrid Node Pools

Your hybrid node pools require manual repaving in these scenarios:

- After modifying the **Access Management** settings of your Amazon EKS cluster in Palette. Refer to steps 11 through 13
  in [Import Cluster](./import-eks-cluster-enable-hybrid-mode.md#import-cluster).
- After changing an edge host's **VPN Server IP**. Refer to step 7 in [Create Node Pool](#create-node-pool).
- After changing any configuration in the Kubernetes layer of the Node Pool **Hybrid Profile**.

These changes do not take effect until you repave the affected node pools.

- For **Access Management** changes, repave all hybrid node pools.
- For **VPN Server IP** changes, repave only the node pool containing the modified edge host.
- For **Hybrid Profile** changes, repave only the node pool containing the modified profile.

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

5. Click on the version drop-down and select **Create new version**. The version creation dialog appears.

6. Fill in a new value in the **Version** input field and click **Confirm**. The new cluster profile version is created
   with the same layers as the current version.

7. You will need to make changes to the cluster profile based on how you registered your edge hosts.

   - For Agent Mode, select the **Kubernetes** layer of your cluster profile. Next, select a Kubernetes pack version
     that is one minor version lower than your current selection. For example, select **1.29.x** if your cluster profile
     is configured with **1.30.x**.
   - For Appliance Mode, select the **OS** layer of your cluster profile. Next, click **Values** in the **Pack Details**
     section. Edit the `options.system.uri` with another provider image value.

8. Click **Confirm Updates** to save your changes.

9. From the left **Main Menu**, select **Clusters**.

10. Select your cluster to view its **Overview** tab.

11. Select the **Nodes** tab.

12. Click **Edit** on the node pool that you wish to trigger a repave on. The **Edit node pool** screen appears.

13. Click the pencil icon on the **Hybrid Profile** field. The **Configure profile** tab appears.

14. Select the cluster profile version you created. Click **Save**.

15. Click **Confirm** to start the repave.

The hybrid node pool repave will now start. This can take up to one hour. Once the repave completes, you can edit the
node pool again and select the cluster profile version that you had originally selected. This will allow your changes to
take effect, while restoring your nodes to the desired configuration.

### Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu** and click on **Clusters**.

3. Select your cluster to view its **Overview** tab.

4. Click on the **Nodes** tab.

5. Verify that all hybrid node pools are in the healthy status.

## Resources

- [Prepare Edge Hosts](./prepare-environment/prepare-edge-hosts.md)

- [Prepare Network](./prepare-environment/prepare-network.md)

- [Worker Node Pool](../../../cluster-management/node-pool.md#worker-node-pool)

- [Access Imported Cluster with Kubectl](./import-eks-cluster-enable-hybrid-mode.md#access-imported-cluster-with-kubectl)
