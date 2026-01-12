---
sidebar_label: "Create and Manage AWS EKS Cluster"
title: "Create and Manage AWS EKS Cluster"
description: "Learn how to deploy and manage AWS EKS clusters with Palette."
hide_table_of_contents: false
toc_max_heading_level: 5
tags: ["public cloud", "aws", "eks"]
sidebar_position: 30
---

Palette supports creating and managing Amazon Web Services (AWS) Elastic Kubernetes Service (EKS) clusters deployed to
an AWS account. This section guides you on how to create an EKS cluster in AWS that Palette manages.

:::warning

[EKS-optimized Amazon Linux 2 (AL2) AMIs](https://docs.aws.amazon.com/eks/latest/userguide/eks-ami-deprecation-faqs.html)
are deprecated and will be disabled in an upcoming Palette release. When disabled, you will no longer be able to select
the AL2 AMIs for EKS worker nodes in Palette for new clusters. For existing clusters, you must create new worker nodes
using AL2023 AMIs. Existing AL2 AMI worker nodes will no longer receive bug fixes or security patches after the removal
date.

Refer to our
[Scenario - Unable to Upgrade EKS Worker Nodes from AL2 to AL2023](../../../troubleshooting/cluster-deployment.md#scenario---unable-to-upgrade-eks-worker-nodes-from-al2-to-al2023)
guide for help with migrating workloads. For deprecation updates, refer to our
[Announcements](../../../release-notes/announcements.md#deprecations) page.

:::

## Limitations

- You must use [Palette VerteX](../../../vertex/vertex.md) to deploy clusters in
  [AWS Secret or Top Secret cloud](./add-aws-accounts.md#aws-secret-cloud-sc2s-and-top-secret-cloud-c2s). Multi-tenant
  Palette SaaS and self-hosted Palette instances are not supported.

## Prerequisites

- Access to an AWS cloud account.

- Palette integration with AWS account. Review [Add AWS Account](add-aws-accounts.md) for guidance.

  - If you are using EKS Pod Identity to authenticate Palette with your AWS account, and you want users to access the
    kubeconfig file of EKS workload clusters, you must add these users to the `iamAuthenticatorConfig.mapUsers` section
    of the Kubernetes layer of your AWS EKS cluster profiles.

    As per the following example, these users must be added to the `system:masters` group to have admin access to the
    cluster. Replace `<aws-account-id>`, `<username>`, and `<k8s-username>` with your AWS account ID, the IAM username,
    and the desired Kubernetes username, respectively. Add additional users as needed.

    ```yaml title="Configuration template"
    iamAuthenticatorConfig:
      mapUsers:
        - userarn: arn:aws:iam::<aws-account-id>:user/<username>
          username: <k8s-username>
          groups:
            - system:masters
    ```

<!-- prettier-ignore-start -->
- An infrastructure cluster profile for AWS EKS. When you create the profile, ensure you choose **EKS** as the **Managed
  Kubernetes** cloud type. Review
  [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)
  for guidance.

  :::info

  For guidance on all available configuration options for the EKS Kubernetes pack, review the
  <VersionedLink text="Additional Details" url="/integrations/packs/?pack=kubernetes-eks&tab=custom"/> for the pack.

  :::

<!-- prettier-ignore-end -->

- If you choose to [assign an Amazon Linux 2023 AMI](#cloud-configuration-settings) (AL2023) to your worker nodes and
  you are using PersistentVolumes (PVs) or PersistentVolumeClaims (PVCs), you must make additional edits to your AWS EKS
  cluster profile to configure IAM Roles for Service Accounts (IRSA) for the Amazon Elastic Block Store (EBS) Container
  Storage Interface (CSI).

  <!-- prettier-ignore -->
  <details>
  <summary>Configure IRSA for Amazon EBS CSI</summary>

  Use the following steps to configure IRSA for the Amazon EBS CSI. For instances launched on Amazon Linux 2023, IMDSv2
  is enforced by default, and IRSA is the
  [recommended approach](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html) for providing IAM permissions to
  Amazon EBS CSI.

  1. Log in to [Palette](https://console.spectrocloud.com/).

  2. Ensure you are in the correct project scope.

  3. From the left main menu, navigate to the **Profiles** page.

  4. Select an existing AWS EKS cluster profile or
     [create a new AWS EKS cluster profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-cluster-profiles.md)
     that meets your requirements, including any necessary add-on packs or additional Helm charts.

  5. Select the **Kubernetes** layer of your cluster profile.

  6. Use the YAML editor to configure IRSA roles for the `managedControlPlane` and `managedMachinePool`.

     ```yaml hideClipboard title="Example configuration"
     managedControlPlane:
     ---
     irsaRoles:
       - name: "{{.spectro.system.cluster.name}}-irsa-cni"
         policies:
           - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
         serviceAccount:
           name: aws-node
           namespace: kube-system
       - name: "{{.spectro.system.cluster.name}}-irsa-csi"
         policies:
           - arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy
     ---
     managedMachinePool:
       roleAdditionalPolicies:
         - "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
     ```

  7. Click **Confirm Updates** after editing.

  8. Select the **Storage** layer of your cluster profile.

  9. Use the YAML editor to add an IAM role ARN annotation to the AWS EBS CSI Driver so that the IRSA role is correctly
     referenced. Replace `<aws-account-id>` with your AWS account ID.

     ```yaml hideClipboard title="Example configuration" {12}
     charts:
     ...
       aws-ebs-csi-driver:
       ...
         controller:
         ...
           serviceAccount:
             # A service account will be created for you if set to true. Set to false if you want to use your own.
             create: true
             name: ebs-csi-controller-sa
             annotations: {
               "eks.amazonaws.com/role-arn":"arn:aws:iam::<aws-account-id>:role/{{.spectro.system.cluster.name}}-irsa-csi"
             }
             ## Enable if EKS IAM for SA is used
             # eks.amazonaws.com/role-arn: arn:<partition>:iam::<account>:role/ebs-csi-role
             automountServiceAccountToken: true
     ```

  10. Click **Confirm Updates** after editing.

  11. Click **Save Changes** on the cluster profile page.

  12. [Deploy your AWS EKS cluster](#deploy-an-aws-eks-cluster).

  13. Once the cluster is running and healthy, verify that the PV or PVC status is `Bound` by issuing one of the
      following `kubectl` commands.

      ```shell title="Example command for PVs"
      kubectl get pv --output wide
      ```

      ```shell title="Example output for PVs"
      NAME               CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                         STORAGECLASS            VOLUMEATTRIBUTESCLASS   AGE   VOLUMEMODE
      pv-xyz...          10Gi       RWO            Delete           Bound    wordpress/data-wordpress-wordpress-mariadb-0  spectro-storage-class   <unset>                 16m   Filesystem
      pv-abc...          8Gi        RWO            Delete           Bound    wordpress/wordpress-wordpress                 spectro-storage-class   <unset>                 16m   Filesystem
      ```

      ```shell title="Example command for PVCs"
      kubectl get pvc --all-namespaces --output wide
      ```

      ```shell title="Example output for PVCs"
      NAMESPACE   NAME                                 STATUS    VOLUME      CAPACITY   ACCESS MODES   STORAGECLASS            VOLUMEATTRIBUTESCLASS   AGE   VOLUMEMODE
      wordpress   data-wordpress-wordpress-mariadb-0   Bound     pvc-xyz...  10Gi       RWO            spectro-storage-class   <unset>                 16m   Filesystem
      wordpress   wordpress-wordpress                  Bound     pvc-abc...  8Gi        RWO            spectro-storage-class   <unset>                 16m   Filesystem
      ```

  </details>

- Deploying EKS clusters with the <VersionedLink text="Cilium" url="/integrations/packs/?pack=cni-cilium-oss"/> pack
  requires using the **Replace Kube-Proxy With EBPF** preset and configuring additional values in the Cilium layer of
  your cluster profile. The required configuration varies based on whether the cluster is deployed with dynamic or
  static placement. Expand the following panel for the required configuration.

      <details>

          <summary>Cilium **Replace Kube-Proxy With EBPF** configuration </summary>

          <Tabs>
          <TabItem value="Dynamic" label="Dynamic">

          | **Parameter**                                       | **Required Value** | **Description**                                                                                                                            |
          | --------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
          | `charts.cilium.endpointRoutes.enabled`              | `true`             | Enables per-endpoint routing to allow direct pod-to-pod communication in elastic network interface (ENI) mode without encapsulation.                                   |
          | `charts.cilium.eni.enabled`                         | `true`             | Enables AWS ENI integration for direct networking instead of using an overlay network.                                                     |
          | `charts.cilium.ipam.mode`                           | `"eni"`            | Uses AWS ENI-based Internet Protocol address management (IPAM) to allocate pod IPs directly from AWS Virtual Private Cloud (VPC) subnets.                                         |
          | `charts.cilium.k8sServiceHost` | `#k8sServiceHost: "auto"` | Specifies the Kubernetes API server host address. This field must be disabled in lieu of `charts.cilium.k8sServiceHostRef`, which points to Palette's managed ConfigMap. |
          | `charts.cilium.k8sServiceHostRef.key` | `k8s-service-host` | Specifies the key within Palette's managed `k8s-service-host` ConfigMap, which contains the Kubernetes API server endpoint. |
          | `charts.cilium.k8sServiceHostRef.name` | `palette-cilium-config` |  Specifies the name of Palette's managed ConfigMap, which contains the Kubernetes API server endpoint. |
          | `charts.cilium.k8sServicePort` | `"443"` | Specifies the Kubernetes API server port. Required when using `k8sServiceHostRef` for EKS clusters. |
          | `charts.cilium.kubeProxyReplacement`                | `"true"`           | Enables eBPF-based kube-proxy replacement because kube-proxy is disabled, and Cilium must handle service load balancing.                   |
          | `charts.cilium.kubeProxyReplacementHealthzBindAddr` | `0.0.0.0:10256`    | Binds the health check service to `0.0.0.0:10256` for the kube-proxy replacement.                                                          |
          | `charts.cilium.autoDirectNodeRoutes`                | `false`            | Disables automatic direct routing between nodes because AWS ENI mode already manages routing, making additional direct routes unnecessary. |
          | `charts.cilium.routingMode`                         | `"native"`           | Uses native routing mode because AWS ENI mode supports direct pod-to-pod routing, making encapsulation unnecessary.                        |

          </TabItem>

          <TabItem value="Static" label="Static">

          | **Parameter**                                       | **Required Value** | **Description**                                                                                                                            |
          | --------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
          | `charts.cilium.bpf.masquerade`                      | `true`            | Enables eBPF masquerading because AWS handles network address translation (NAT) and Internet Protocol (IP) address masquerading through the elastic network interface (ENI).                                          |
          | `charts.cilium.enableIPv4Masquerade` | `true` | Enables Internet Protocol version 4 (IPv4) masquerading for outgoing packets because AWS ENI mode provides direct pod-to-pod routing without NAT. |
          | `charts.cilium.endpointRoutes.enabled`              | `true`             | Enables per-endpoint routing to allow direct pod-to-pod communication in ENI mode without encapsulation.                                   |
          | `charts.cilium.eni.enabled`                         | `true`             | Enables AWS ENI integration for direct networking instead of using an overlay network.                                                     |
          | `charts.cilium.ipam.mode`                           | `"eni"`            | Uses AWS ENI-based IP address management (IPAM) to allocate pod IPs directly from AWS Virtual Private Cloud (VPC) subnets.                                         |
          | `charts.cilium.k8sServiceHost` | `#k8sServiceHost: "auto"` | Specifies the Kubernetes API server host address. This field must be disabled in lieu of `charts.cilium.k8sServiceHostRef`, which points to Palette's managed ConfigMap. |
          | `charts.cilium.k8sServiceHostRef.key` | `k8s-service-host` | Specifies the key within Palette's managed `k8s-service-host` ConfigMap, which contains the Kubernetes API server endpoint. |
          | `charts.cilium.k8sServiceHostRef.name` | `palette-cilium-config` |  Specifies the name of Palette's managed ConfigMap, which contains the Kubernetes API server endpoint. |
          | `charts.cilium.k8sServicePort` | `"443"` | Specifies the Kubernetes API server port. Required when using `k8sServiceHostRef` for EKS clusters. |
          | `charts.cilium.kubeProxyReplacement`                | `"true"`           | Enables eBPF-based kube-proxy replacement because kube-proxy is disabled, and Cilium must handle service load balancing.                   |
          | `charts.cilium.kubeProxyReplacementHealthzBindAddr` | `0.0.0.0:10256`    | Binds the health check service to `0.0.0.0:10256` for the kube-proxy replacement.                                                          |
          | `charts.cilium.autoDirectNodeRoutes`                | `false`            | Disables automatic direct routing between nodes because AWS ENI mode already manages routing, making additional direct routes unnecessary. |
          | `charts.cilium.routingMode`                         | `"native"`           | Uses native routing mode because AWS ENI mode supports direct pod-to-pod routing, making encapsulation unnecessary.                        |

          </TabItem>
          </Tabs>

      </details>

<!-- prettier-ignore-start -->

- If you need to override the default service Classless Inter-Domain Routing (CIDR), configure the service ClusterIP range in the
  <VersionedLink text="Kubernetes (EKS)" url="/integrations/packs/?pack=kubernetes-eks&tab=custom" /> pack.
  Additionally, if you want to use your own VPC and subnets, configure the pod CIDR in the
  <VersionedLink text="AWS VPC CNI (Helm)" url="/integrations/packs/?pack=cni-aws-vpc-eks-helm&tab=custom" /> pack.

  Pods running on the control plane continue to receive IP addresses from the node CIDR range. The custom pod CIDR
  applies only to pods scheduled on worker nodes.

<!-- prettier-ignore-end -->

- An EC2 key pair for the target region that provides a secure connection to your EC2 instances. A key pair is required
  for dynamic placement and is optional for static placement. To learn how to create a key pair, refer to the
  [Amazon EC2 key pairs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) resource.

  :::info

  Dynamic placement means Palette automatically creates and manages a new VPC and subnets for your EKS cluster. Static
  placement means Palette uses your existing VPC, requiring you to specify the necessary network resources.

  :::

- Your Amazon EKS cluster must be deployed with at least one worker node to host the Palette agent, which is necessary
  for Palette to manage the cluster. Because of EKS architecture constraints, the agent cannot be installed on the
  control plane.

  - The minimum instance type required is **t3.xlarge** with at least 20 GB of storage.
  - Be sure at least one worker node is always available so Palette can continue managing the cluster.

- To access your EKS cluster using kubectl, you will need the
  [aws-iam-authenticator](https://github.com/kubernetes-sigs/aws-iam-authenticator) plugin installed. If you are using a
  custom OIDC provider, you will need the [kubelogin](https://github.com/int128/kubelogin) plugin installed. Refer to
  the [Access EKS Cluster](#access-eks-cluster) section for more information.

- To use secrets encryption, which is available only during EKS cluster creation, you must have created an AWS Key
  Management Service (KMS) key. If you do not have one, review
  [Enable Secrets Encryption for EKS Cluster](enable-secrets-encryption-kms-key.md) for guidance.

- To use disk encryption, you must have created an AWS KMS key and set the appropriate configuration in the Kubernetes
  layer of your cluster profile. Review [Enable Disk Encryption for EKS Cluster](enable-disk-encryption-eks-cluster.md)
  for guidance.

- If you are deploying your cluster in
  [AWS Secret or Top Secret cloud](./add-aws-accounts.md#aws-secret-cloud-sc2s-and-top-secret-cloud-c2s), you must
  configure [Image Swap](../../../clusters/cluster-management/image-swap.md) in the Kubernetes layer of your
  [cluster profile](../../../profiles/cluster-profiles/cluster-profiles.md) to redirect public image requests to your
  internal or Elastic Container Registry.

  :::warning

  For static network deployments, you must have port 6443 open between Palette and the workload cluster. Refer to the
  [Network Ports](../../../architecture/networking-ports.md) documentation for detailed network architecture diagrams
  and to learn more about the ports used for communication.

  :::

- If you do not provide your own VPC, Palette creates one for you with compute, network, and storage resources in AWS
  when it provisions Kubernetes clusters. Ensure there is sufficient capacity in the preferred AWS region to create the
  following resources. Note that Palette does not create these resources if you specify an existing VPC.

  - Virtual CPU (vCPU)
  - VPC
  - Elastic IP
  - Internet Gateway
  - Elastic Load Balancers
  - Network Address Translation (NAT) Gateway

  <br />

  :::info

  To enable automated subnet discovery to create external load balancers, you need to add tags to the VPC public
  subnets. For more information about tagging VPC networks, refer to the AWS
  [EKS VPC Subnet Discovery](https://repost.aws/knowledge-center/eks-vpc-subnet-discovery) reference guide. Use the AWS
  Tag Editor and specify the region and resource type. Then, add the following tags. Replace the value `yourClusterName`
  with your cluster's name. To learn more about the Tag Editor, refer to the
  [AWS Tag Editor](https://docs.aws.amazon.com/tag-editor/latest/userguide/tag-editor.html) reference guide.

  - `kubernetes.io/role/elb = 1`
  - `sigs.k8s.io/cluster-api-provider-aws/role = public`
  - `kubernetes.io/cluster/[yourClusterName] = shared`
  - `sigs.k8s.io/cluster-api-provider-aws/cluster/[yourClusterName] = owned`

  :::

## Deploy an AWS EKS Cluster

1.  Log in to [Palette](https://console.spectrocloud.com/).

2.  Ensure you are in the correct project scope.

3.  From the left main menu, select **Clusters** and click **Add New Cluster**.

4.  In **Public Clouds**, under **Managed Kubernetes**, select **AWS EKS**.

5.  In the bottom-right corner, click **Start AWS EKS Configuration**.

6.  Fill out the following basic information and click **Next**.

    | **Field**         | **Description**                                                                                                                                                                                     |
    | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Cluster Name**  | A custom name for the cluster.                                                                                                                                                                      |
    | **Description**   | Use the description to provide context about the cluster.                                                                                                                                           |
    | **Tags**          | Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `region:us-east-1a` or `zone:vpc-private-us-east-1a`. |
    | **Cloud Account** | If you already added your AWS account in Palette, select it from the **drop-down Menu**. Otherwise, click **Add New Account** and add your AWS account information.                                 |

    To learn how to add an AWS account, review the [Add an AWS Account to Palette](add-aws-accounts.md) guide.

7.  <PartialsComponent category="cluster-templates" name="profile-vs-template" />

    - You can configure custom OpenID Connect (OIDC) for EKS clusters at the Kubernetes layer. Refer to the
      [Access EKS Cluster](#access-eks-cluster) section for additional guidance.

8.  <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

9.  Provide the following cluster configuration information and click **Next** to continue.

    | **Parameter**                          | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Region**                             | Use the drop-down menu to choose the AWS region where you would like to provision the cluster.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | **SSH Key Pair Name**                  | Choose the SSH key pair for the region you selected. This is required for dynamic placement and optional for static placement. SSH key pairs must be pre-configured in your AWS environment. This is called an EC2 Key Pair in AWS. The key you select is inserted into the provisioned VMs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | **Enable static placement (Optional)** | By default, Palette uses dynamic placement. This creates a new VPC for the cluster that contains two subnets in different Availability Zones (AZs), which is required for EKS cluster deployment. Palette places resources in these clusters, manages the resources, and deletes them when the corresponding cluster is deleted. <br /><br />If you want to place resources into pre-existing VPCs, toggle the **Enable static placement (Optional)** option, and provide the VPC ID in the **Virtual Private Cloud (VPC) ID** field that displays with this option enabled. <br /><br /> Static placement is required for EKS clusters deployed in [AWS Secret or Top Secret cloud](./add-aws-accounts.md#aws-secret-cloud-sc2s-and-top-secret-cloud-c2s). Azure Secret clusters require two subnets in different AZs.                                                                                                                                                  |
    | **Cluster Endpoint Access**            | This setting provides access to the Kubernetes API endpoint. Select **Private**, **Public**, or **Private & Public**. If you are deploying your cluster in [AWS Secret or Top Secret cloud](./add-aws-accounts.md#aws-secret-cloud-sc2s-and-top-secret-cloud-c2s), use **Private & Public**. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
    | **Public Access CIDRs**                | This setting controls which IP address CIDR ranges can access the cluster. To fully allow unrestricted network access, enter `0.0.0.0/0` in the field. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | **Private Access CIDRs**               | This setting controls which private IP address CIDR ranges can access the cluster. Private CIDRs provide a way to specify private, self-hosted, and air-gapped networks or Private Cloud Gateway (PCG) that may be located in other VPCs connected to the VPC hosting the cluster endpoint.<br /><br />To restrict network access, replace the pre-populated `0.0.0.0/0` with the IP address CIDR range that should be allowed access to the cluster endpoint. Only the IP addresses that are within the specified VPC CIDR range - and any other connected VPCs - will be able to reach the private endpoint. For example, while using `0.0.0.0/0` would allow traffic throughout the VPC and all peered VPCs, specifying the VPC CIDR `10.0.0.0/16` would limit traffic to an individual VPC. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide. |
    | **Enable key encryption (Optional)**   | Use this option for secrets encryption. You must have an existing AWS Key Management Service (KMS) key you can use. Toggle the **Enable key encryption (Optional)** option and use the **Provider Amazon Resource Name (ARN)** drop-down menu to select the KMS key ARN.<br /><br />If you do not have a KMS key and want to create one, review [Enable Secrets Encryption for EKS Cluster](enable-secrets-encryption-kms-key.md). Once your KMS key is created, return to this step to enable secrets encryption with your new KMS key ARN.                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | **Update worker pools in parallel**    | Use this option to efficiently manage workloads by updating multiple worker pools simultaneously.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

    :::warning

    If you set the cluster endpoint to **Public**, ensure you specify `0.0.0.0/0` in the **Public Access CIDR** field to
    open it to all possible IP addresses. Otherwise, Palette will not open it up entirely. We recommend specifying the
    **Private & Public** option to cover all the possibilities.

    :::

10. Provide the following node pool and cloud configuration information. If you will be using Fargate profiles, you can
    add them here.

    :::info

    <!-- prettier-ignore -->
    To automatically scale the number of worker nodes for EKS clusters, you must add the <VersionedLink text="AWS Cluster Autoscaler" url="/integrations/packs/?pack=aws-cluster-autoscaler" />
    pack to your cluster profile.

    :::

    #### Node Configuration Settings

    | **Parameter**                    | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
    | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Node pool name**               | A descriptive name for the node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | **Number of nodes in the pool**  | The number of nodes in the worker pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
    | **Additional Labels (Optional)** | Optional labels to nodes in key-value format. For general information about applying labels, review the [Node Labels](../../cluster-management/node-labels.md) guide. Example: `"environment": "production"`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
    | **Taints (Optional)**            | You can apply optional taint labels to a node pool during cluster creation or edit taint labels on an existing cluster. Review the [Node Pool](../../cluster-management/node-pool.md) management page and [Taints and Tolerations](../../cluster-management/taints.md) guide to learn more. Toggle the **Taint** button to create a taint label. When tainting is enabled, you need to provide a custom key-value pair. Use the drop-down menu to choose one of the following **Effect** options:<br /><br />- **NoSchedule** - Pods are not scheduled onto nodes with this taint.<br />- **PreferNoSchedule** - Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited.<br />- **NoExecute** - New pods that do not tolerate the taint will not be scheduled on the node, and existing pods on the node, if any, will be evicted if they do not tolerate the taint. |

    #### Cloud Configuration Settings

    | **Parameter**                                | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Instance Option**                          | Choose a pricing method:<br /><br />- **On-Demand** - Provides stable and uninterrupted compute capacity at a higher cost.<br />- **Spot** - Allows you to bid for unused EC2 capacity at a lower cost.<br />We recommend you base your choice on your application's requirements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | **Instance Type**                            | Select the instance type to use for all nodes in the node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
    | **Amazon Machine Image (AMI) Type**          | Specify a base AMI to use for your worker nodes: <br /> - **AL2_x86_64** [(pending deprecation)](../../../release-notes/announcements.md#deprecations) <br /> - **AL2_x86_64_GPU** [(pending deprecation)](../../../release-notes/announcements.md#deprecations) <br /> - **AL2023_x86_64_STANDARD** (default) <br /> - **AL2023_x86_64_NEURON** <br /> - **AL2023_x86_64_NVIDIA** <br /><br /> The AMI type cannot be modified post-deployment. Refer to the <VersionedLink text="Node Customization" url="/integrations/packs/?pack=kubernetes-eks&tab=custom#node-customization"/> section of the Kubernetes EKS pack for configurable options available for these AMIs. <br /><br /> If using an Amazon Linux 2023 (AL2023) AMI and using an AWS CSI pack such as Amazon EBS CSI, Amazon EFS CSI, or Amazon Cloud Native, you must configure IAM Roles for Service Accounts (IRSA). IRSA is also required if using the AWS Application Loadbalancer. Refer to the [Scenario - PV/PVC Stuck in Pending Status for EKS Cluster Using AL2023 AMI](../../../troubleshooting/cluster-deployment.md#scenario---pvpvc-stuck-in-pending-status-for-eks-cluster-using-al2023-ami) troubleshooting guide for further information. |
    | **Enable Nodepool Customization (Optional)** | Activate additional node pool customization options: <br /><br />- **Amazon Machine Image (AMI) ID (Optional)** - Use a pre-configured VM image by providing the ID value of the AMI. The AMI ID can be updated post-deployment, but the base AMI type must always match the type specified in the **Amazon Machine Image (AMI) Type** field, and the AMI must be compatible with the Kubernetes version specified in the [cluster profile](../../../profiles/cluster-profiles/cluster-profiles.md). <br /><br /> **CAUTION:** If you do not specify an AMI ID, Palette will use the Amazon EKS AMI for the node pool. As such, any future updates to the underlying Amazon EKS AMI in Palette will trigger [cluster repaves](../../cluster-management/node-pool.md#repave-behavior-and-configuration). To avoid unexpected repaves, explicitly set the AMI ID. Refer to the [AWS documentation](https://docs.aws.amazon.com/eks/latest/userguide/retrieve-ami-id.html) for the latest AMI IDs. <br /><br />- **Disk Type (Optional)** - Specify the disk type to use.                                                                                                                                                      |
    | **Root Disk size (GB)**                      | Choose a disk size based on your requirements. The default size is `60`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

    #### Fargate Profiles

    You can create one or more Fargate profiles for the EKS cluster to use. Click **+ Add Fargate Profile**. For more
    information about Fargate profiles, refer to the
    [AWS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/userguide/what-is-fargate.html) reference guide.

    | **Parameter** | **Description**                                                                                                                                                                                                                                                                                                                    |
    | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Name**      | A custom name for the Fargate profile.                                                                                                                                                                                                                                                                                             |
    | **Subnets**   | Pods running on Fargate Profiles are not assigned public IP addresses, so only private subnets (with no direct route to an Internet Gateway) are accepted for this parameter. For dynamic provisioning, this input is not required and subnets are automatically selected.                                                         |
    | **Selectors** | Define a pod selector by providing a target namespace and optional labels. Pods with a matching namespace and app labels are scheduled to run on dynamically provisioned compute nodes.<br /> You can have up to five selectors in a Fargate profile, and a pod only needs to match one selector to run using the Fargate profile. |

    :::info

    You can add new worker pools if you need to customize certain worker nodes to run specialized workloads. As an
    example, the default worker pool may be configured with the m3.large instance types for general-purpose workloads,
    and another worker pool with instance type g2.2xlarge can be configured to run GPU workloads.

    :::

11. Click **Next** to continue.

12. <PartialsComponent category="clusters" name="cluster-settings" />

13. Select **Validate** to review your cluster configurations and settings.

14. If no changes are needed, select **Finish Configuration** to deploy your cluster.

To monitor the status of your cluster deployment, from the left main menu, select **Clusters** and choose your cluster.
The cluster **Overview** tab displays the status and health of your cluster, as well as deployment details. Use the
**Events** tab to monitor the deployment in real time. Provisioning may take several minutes.

For information on how to access your cluster using the kubectl CLI, review [Access EKS Cluster](#access-eks-cluster).

## Validate

You can validate your cluster is up and in **Running** state.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left main menu and select **Clusters**. The **Clusters** page displays a list of all available
   clusters that Palette manages.

3. Click on the cluster you created to view its details page.

4. Ensure the **Cluster Status** field displays **Running**.

## Access EKS Cluster

You can access your EKS cluster using the kubectl CLI with a kubeconfig file. Authentication is required, and the
availability of the kubeconfig file through Palette depends on your chosen authentication method, as shown in the
following table.

| **Authentication Method**    | **Kubeconfig Availability** |
| ---------------------------- | --------------------------- |
| AWS IAM Authenticator Plugin | :white_check_mark:          |
| Default AWS Authentication   | :x:                         |
| Custom OIDC                  | :white_check_mark:          |

Based on your chosen authentication method, follow the instructions in the appropriate tab to access your Amazon EKS
cluster through kubectl.

<Tabs queryString="authentication-type">

<TabItem label="AWS IAM Authenticator Plugin" value="aws-iam-authenticator-plugin">

To access an Amazon EKS cluster using the
[AWS IAM Authenticator plugin](https://github.com/kubernetes-sigs/aws-iam-authenticator), follow these steps:

- Configure your AWS CLI credentials. Refer to
  [Configuration and Credential File Settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
  for guidance.

- Download and install the AWS IAM Authenticator plugin for your system. Refer to
  [Installing the AWS IAM Authenticator](https://github.com/kubernetes-sigs/aws-iam-authenticator) for guidance.

  <details>

  <summary> Example steps to install </summary>

  1. Download the binary from the
     [GitHub releases page](https://github.com/kubernetes-sigs/aws-iam-authenticator/releases).

  2. Move the binary to a directory included in your system's `PATH` and rename it to `aws-iam-authenticator`.

     ```bash title="Example command"
     sudo mv Downloads/aws-iam-authenticator_0.7.9_darwin_arm64 /usr/local/bin/aws-iam-authenticator
     ```

  3. Make the binary executable.

     ```bash
     sudo chmod +x /usr/local/bin/aws-iam-authenticator
     ```

  4. Verify the installation:

     ```bash
     aws-iam-authenticator --version
     ```

     ```shell hideClipboard title="Example output"
     {"Version":"0.7.9","Commit":"19000d354fa0828012e45dc52039c73177f7cde8"}
     ```

  </details>

- Download the kubeconfig file for the Amazon EKS cluster from Palette. Refer to
  [Kubeconfig](../../cluster-management/kubeconfig.md) for guidance.

Once you have downloaded your kubeconfig, you can use kubectl to access your cluster and apply manifests.

</TabItem>

<TabItem label="Default AWS Authentication" value="default-aws-authentication">

To access an Amazon EKS cluster using the AWS CLI's built-in authentication, follow these steps:

- Configure your AWS CLI credentials. Refer to
  [Configuration and Credential File Settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
  for guidance.

- Ensure you have the following IAM permissions to download the kubeconfig and access the Amazon EKS cluster. Refer to
  [Amazon EKS identity-based policy examples](https://docs.aws.amazon.com/eks/latest/userguide/security-iam-id-based-policy-examples.html)
  for guidance.

  - `eks:DescribeCluster`
  - `eks:AccessKubernetesApi`

- Download the kubeconfig file from the Amazon EKS cluster using the AWS CLI. Refer to
  [Connect kubectl to an EKS cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html) for
  guidance.

  ```bash title="Example command"
  aws eks update-kubeconfig --region <region> --name <cluster-name>
  ```

Once you have downloaded your kubeconfig, you can use kubectl to access your cluster and apply manifests.

</TabItem>

<TabItem label="Custom OIDC" value="Custom OIDC">

To access an Amazon EKS cluster using a custom [OIDC](https://openid.net/developers/how-connect-works/) provider, follow
these steps:

<!-- prettier-ignore-start -->
- Ensure your Amazon EKS cluster has an associated OIDC provider by configuring it in the Kubernetes layer.
  Refer to the <VersionedLink text="Kubernetes (EKS)" url="/integrations/packs/?pack=kubernetes-eks&tab=custom#configure-oidc-identity-provider" />
  pack documentation for guidance.

  - If you have not yet associated an OIDC provider with your cluster, use
    [kubelogin](https://github.com/int128/kubelogin). We recommend kubelogin due to its ease of authentication.

<!-- prettier-ignore-end -->

- Ensure your OIDC user or group is mapped to an `admin` or `clusteradmin` Kubernetes RBAC Role or ClusterRole. To learn
  how to map a Kubernetes role to users and groups, refer to
  [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings).

- Download the kubeconfig file for the Amazon EKS cluster from Palette. Refer to
  [Kubeconfig](../../cluster-management/kubeconfig.md) for guidance.

Once you have downloaded your kubeconfig and configured it to use your OIDC provider, you can use kubectl to access your
cluster and apply manifests.

</TabItem>

</Tabs>

:::tip

For guidance in setting up kubectl, review the [Kubectl](../../cluster-management/palette-webctl.md) guide.

:::

## Next Steps

After deploying your EKS cluster, you may want to perform additional configuration tasks. Consider the following guides.

- [Enable Secrets Encryption for EKS Cluster](enable-secrets-encryption-kms-key.md)

- [Enable Disk Encryption for EKS Cluster](enable-disk-encryption-eks-cluster.md)

- [Configure Karpenter for EKS Clusters](configure-karpenter-eks-clusters.md)

- [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings).

- [Cluster Management guides](../../cluster-management/cluster-management.md)

<!-- prettier-ignore-start -->
- <VersionedLink text="Kubernetes (EKS) pack documentation" url="/integrations/packs/?pack=kubernetes-eks" />

<!-- prettier-ignore-end -->
