---
sidebar_label: "Import EKS Cluster and Enable Hybrid Mode"
title: "Import EKS Cluster and Enable Hybrid Mode"
description:
  "Learn how to import Amazon EKS clusters, enable hybrid mode, and configure a CNI for your hybrid nodes with Palette."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks hybrid nodes"]
sidebar_position: 10
---

This section guides you on how to import an existing Amazon Elastic Kubernetes Service (Amazon EKS) cluster, enable
hybrid mode, and configure a Container Network Interface (CNI) add-on cluster profile for your Amazon EKS Hybrid Nodes.

## Limitations

The following limitations apply after importing an existing Amazon EKS cluster.

- The [general limitations](../../../imported-clusters/imported-clusters.md#limitations) apply for imported clusters and
  cloud-specific clusters.
- You cannot download the cluster's kubeconfig file from Palette. You must use AWS to access the kubeconfig file.
- [Cilium](https://docs.cilium.io/en/stable/overview/intro/) must be used as the CNI, as outlined in the
  [Import Amazon EKS Cluster and Enable Hybrid Mode](#import-amazon-eks-cluster-and-enable-hybrid-mode) steps.

## Import Amazon EKS Cluster and Enable Hybrid Mode

Import your Amazon EKS cluster and enable hybrid mode to be able to create edge host node pools.

### Prerequisites

- Access to an AWS cloud account.

- Palette integration with AWS account. Review [Add an AWS Account to Palette](../add-aws-accounts/add-aws-accounts.md)
  for guidance.

- Your Palette account role must have the `clusterProfile.create` permission to import a cluster profile. Refer to the
  [Cluster Profile](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  permissions for guidance.

- All networking prerequisites completed for hybrid nodes. Refer to
  [Prepare Network](./prepare-environment/prepare-network.md) for guidance. You will need to provide the following
  details during the import steps:

  - The Virtual Private Cloud (VPC) Classless Inter-Domain Routing (CIDR) range where your EKS cluster resides.
  - The CIDR ranges for hybrid nodes in other networks that need to connect to this cluster.
  - The CIDR ranges for hybrid pods in other networks that need to connect to this cluster.

- All credentials prerequisites completed for hybrid nodes. Refer to
  [Prepare credentials for hybrid nodes](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-creds.html) for
  guidance.

  If you are using AWS Systems Manager, you will need to provide the following details during the import steps:

  - The Activation ID assigned by AWS Systems Manager when creating an activation. This ID is used to associate hybrid
    nodes with your AWS account in Systems Manager.
  - The Activation Code that is generated alongside the Activation ID. It is required to authenticate hybrid nodes with
    AWS Systems Manager.
  - The Amazon Resource Name (ARN) for the
    [Hybrid Nodes IAM Role](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-creds.html#_hybrid_nodes_iam_role)
    created for AWS SSM hybrid activations.

  If you are using AWS IAM Roles Anywhere, you will need to provide the following details during the import steps:

  - The Amazon Resource Name (ARN) of the IAM Roles Anywhere profile that defines which roles can be assumed by hybrid
    nodes.
  - The ARN for the
    [Hybrid Nodes IAM Role](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-creds.html#_hybrid_nodes_iam_role)
    created for AWS IAM Roles Anywhere. This role defines the permissions and policies for roles that can be assumed by
    hybrid nodes.
  - The ARN of the IAM Roles Anywhere trust anchor that contains your certificate authority configuration.
  - The PEM-encoded certificate of your Certificate Authority (CA) that serves as the trust anchor. This certificate is
    used by IAM Roles Anywhere to validate the authenticity of the client certificates presented by your hybrid nodes.
  - The private key corresponding to your CA certificate, used to sign client certificates.

- An existing Amazon EKS cluster that has configured with the appropriate parameters to be imported into Palette. Refer
  to [Prepare EKS Cluster](./prepare-environment/prepare-eks-cluster.md) for guidance.

- Ensure [kubectl](https://kubernetes.io/docs/tasks/tools/) is installed and available in your local workstation.

- Access to your Amazon EKS cluster through kubectl.

  - To access your cluster with kubectl, you can use the AWS CLI built-in authentication capabilities. If you are using
    a custom OpenID Connect (OIDC) provider, you will need to configure your kubeconfig to use your OIDC provider.

    Refer to the [Access Imported Cluster with Kubectl](#access-imported-cluster-with-kubectl) section for more
    information.

### Import Cluster

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Click on **Add New Cluster** and select **Import Cluster** in the pop-up box.

4. Fill out the required information.

   | **Field**                           | **Description**                                                                                                          |
   | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
   | **Cluster Name**                    | The name of the cluster you want to import. Ensure it matches the cluster name in AWS.                                   |
   | **Cloud Type**                      | The cloud infrastructure type. Select **Amazon** from the **drop-down Menu**.                                            |
   | **Host Path (Optional)**            | Specify the CA file path for the cluster. This is the location on the physical host machine where the CA file is stored. |
   | **Container Mount Path (Optional)** | Specify the container mount path where the CA file is mounted in the container.                                          |
   | **Import mode**                     | The Palette permission mode for the imported cluster. Select **Full-permission mode**.                                   |

5. Click on **Create & Open Cluster Instance** to start the import.

6. You will be redirected to the cluster details page. A set of instructions with commands is displayed on the right
   side of the screen.

   Click the clipboard icon to copy the kubectl command to your clipboard.

   ![A view of the cluster details page with the sidebar instructions box](/aws_eks-hybrid_import-eks-cluster-enable-hybrid-mode_cluster-import-procedure.webp)

7. Open a terminal session and issue the kubectl command from your clipboard against the Amazon EKS cluster you want to
   import. The command is customized for your cluster as it contains the assigned cluster ID.

   :::tip

   Refer to [Access Imported Cluster with Kubectl](#access-imported-cluster-with-kubectl) for guidance on setting up
   kubectl to access your cluster.

   :::

   Example command.

   ```shell hideClipboard
   kubectl apply --filename https://api.spectrocloud.com/v1/spectroclusters/123abc456def789ghi012jkl/import/manifest
   ```

   Example output.

   ```shell hideClipboard
   namespace/cluster-674f4e3ad861bb1009be468a created
   serviceaccount/cluster-management-agent created
   clusterrolebinding.rbac.authorization.k8s.io/cma-lite-cluster-admin-binding configured
   configmap/log-parser-config created
   configmap/upgrade-info-9dtbh55tkc created
   configmap/version-info-g9kt4cdkg4 created
   priorityclass.scheduling.k8s.io/spectro-cluster-critical configured
   deployment.apps/cluster-management-agent-lite created
   configmap/cluster-info created
   configmap/hubble-info created
   secret/hubble-secrets created
   customresourcedefinition.apiextensions.k8s.io/awscloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/azurecloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/clusterprofiles.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/customcloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/edgecloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/edgenativecloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/gcpcloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/maascloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/nestedcloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/openstackcloudconfigs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/packs.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/spectroclusters.cluster.spectrocloud.com configured
   customresourcedefinition.apiextensions.k8s.io/vspherecloudconfigs.cluster.spectrocloud.com configured
   serviceaccount/palette-manager created
   clusterrolebinding.rbac.authorization.k8s.io/palette-lite-cluster-admin-binding configured
   configmap/palette-version-info-6ktgm4hgdh created
   priorityclass.scheduling.k8s.io/palette-spectro-cluster-critical configured
   deployment.apps/palette-lite-controller-manager created
   job.batch/palette-import-presetup-job created
   ```

8. Wait for your cluster health to transition to **Healthy**. This will take a few minutes after issuing the agent
   install command in the previous step.

9. Once your cluster displays as **Healthy**, click **Settings** in the top-right corner to reveal the **drop-down
   Menu**, and select **Cluster Settings**.

10. Select **Hybrid Configuration** from the **Settings Menu**, and click on the **Enable hybrid mode** toggle.

    ![Enable hybrid mode in Hybrid Configuration - Cluster Settings Menu](/aws_eks-hybrid_import-eks-cluster-enable-hybrid-mode_enable-hybrid-mode.webp)

11. Fill out the required information.

    | **Field**         | **Description**                                                                                                          | **Example**                      |
    | ----------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
    | VPC CIDR          | The VPC CIDR range where your EKS cluster resides.                                                                       | `10.100.0.0/16`                  |
    | Remote Node CIDRs | The CIDR ranges for hybrid nodes in other networks that need to connect to this cluster.                                 | `10.200.0.0/16`, `10.201.0.0/16` |
    | Remote Pod CIDRs  | The CIDR ranges for hybrid pods in other networks that need to connect to this cluster.                                  | `192.168.0.0/16`                 |
    | Access Management | The Access Management mode for the Amazon EKS Hybrid Nodes. Select either **Systems Manager** or **IAM Roles Anywhere**. |                                  |

12. If selecting **Systems Manager**, you must provide the following additional details.

    | **Field**       | **Description**                                                                                                                                                    | **Example**                            |
    | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
    | Activation ID   | The Activation ID assigned by AWS Systems Manager when creating an activation. This ID is used to associate hybrid nodes with your AWS account in Systems Manager. | `5743558d-563b-4457-8682-d16c3EXAMPLE` |
    | Activation Code | The Activation Code that is generated alongside the Activation ID. It is required to authenticate hybrid nodes with AWS Systems Manager.                           |                                        |

13. If selecting **IAM Roles Anywhere**, you must provide the following additional details.

    | **Field**           | **Description**                                                                                                                                                                                                                                                            | **Example**                                                                                      |
    | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
    | Profile ARN         | The ARN of the IAM Roles Anywhere profile that defines which roles can be assumed by hybrid nodes.                                                                                                                                                                         | `arn:aws:rolesanywhere:us-east-2:123456789012:profile/abcd1234-5678-90ef-ghij-klmnopqrstuv`      |
    | Role ARN            | The ARN for the [Hybrid Nodes IAM Role](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-creds.html#_hybrid_nodes_iam_role) created for AWS IAM Roles Anywhere. This role defines the permissions and policies for roles that can be assumed by hybrid nodes. | `arn:aws:iam::123456789012:role/AmazonEKSHybridNodesRole`                                        |
    | Trust Anchor ARN    | The ARN of the IAM Roles Anywhere trust anchor that contains your certificate authority configuration.                                                                                                                                                                     | `arn:aws:rolesanywhere:us-east-2:123456789012:trust-anchor/abcd1234-5678-90ef-ghij-klmnopqrstuv` |
    | Root CA Certificate | The PEM-encoded certificate of your CA that serves as the trust anchor. This certificate is used by IAM Roles Anywhere to validate the authenticity of the client certificates presented by your hybrid nodes.                                                             |                                                                                                  |
    | Root CA Private Key | The private key corresponding to your CA certificate, used to sign client certificates.                                                                                                                                                                                    |                                                                                                  |

14. Click **Save Changes** when complete.

15. Check whether the `aws-auth` ConfigMap exists.

    ```shell
    kubectl get configmap aws-auth --namespace kube-system
    ```

    Example output if the ConfigMap is found.

    ```shell hideClipboard
    NAME       DATA   AGE
    aws-auth   1      15d
    ```

    If it does not exist, you will receive an error similar to
    `Error from server (NotFound): configmaps "aws-auth" not found`.

16. If the `aws-auth` ConfigMap does not exist, create a ConfigMap in the `kube-system` namespace using the following
    command.

    Replace `<roleArn>` with the ARN for the
    [Hybrid Nodes IAM Role](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-creds.html#_hybrid_nodes_iam_role).

    ```shell
    kubectl create --filename=/dev/stdin <<-EOF
    apiVersion: v1
    kind: ConfigMap
    metadata:
    name: aws-auth
    namespace: kube-system
    data:
    mapRoles: |
      - groups:
        - system:bootstrappers
        - system:nodes
        rolearn: <roleArn>
        username: system:node:{{SessionName}}
    EOF
    ```

17. If the `aws-auth` ConfigMap already exists, append the `mapRoles` entry in your existing ConfigMap.

    You can edit the existing ConfigMap using the following command.

    ```shell
    kubectl edit configmap aws-auth --namespace kube-system
    ```

    The following example shows the `mapRoles` entry appended below an existing entry. Replace `<roleArn>` with the ARN
    for the
    [Hybrid Nodes IAM Role](https://docs.aws.amazon.com/eks/latest/userguide/hybrid-nodes-creds.html#_hybrid_nodes_iam_role).

    ```yaml {13-17} hideClipboard
    apiVersion: v1
    kind: ConfigMap
    metadata:
    name: aws-auth
    namespace: kube-system
    data:
    mapRoles: |
      - groups:
        - system:bootstrappers
        - system:nodes
        rolearn: arn:aws:iam::111122223333:role/eks-nodegroup-example
        username: system:node:{{EC2PrivateDNSName}}
      - groups:
        - system:bootstrappers
        - system:nodes
        rolearn: <roleArn>
        username: system:node:{{SessionName}}
    ```

18. This step is only required if you use a proxy configuration for edge hosts or you plan to specify a VPN server IP
    for one or more edge hosts.

    Create a ConfigMap using the following template. You can omit the `serviceCIDR` or `vpcCIDR` entries if one of them
    is not required.

    - Replace `<serviceCidrIp>` with your hybrid pod CIDR list. For example, `192.168.0.0/16`. This is only required if
      using a proxy configuration for edge hosts. The `serviceCIDR` configures `NO_PROXY` to prevent Kubernetes service
      traffic from routing through the proxy server.

    - Replace `<vpcCidrIp>` with your hybrid node CIDR list. For example, `10.200.0.0/16`. This is only required if a
      VPN server IP is configured for one or more edge hosts. The `vpcCIDR` defines the network range for VPC resources
      to ensure proper routing through the VPN.

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: hybrid-config
      namespace: kube-system
    data:
      serviceCIDR: "<serviceCidrIp>" # If not specified, defaults to 10.96.0.0/12.
      vpcCIDR: "<vpcCidrIp>" # No default value.
    ```

    Apply the ConfigMap to your cluster.

    Example command.

    ```shell hideClipboard
    kubectl create --filename=/dev/stdin <<-EOF
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: hybrid-config
      namespace: kube-system
    data:
      serviceCIDR: "192.168.0.0/16"
      vpcCIDR: "10.200.0.0/16"
    EOF
    ```

### Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Click on the cluster you created to view its details in the **Overview** tab.

4. Ensure the **Cluster Status** field displays **Running**.

## Configure CNI for Hybrid Nodes

You need to configure a CNI for Amazon EKS Hybrid Nodes as the standard Amazon EKS VPC CNI lacks hybrid node support.
Cilium handles IP Address Management (IPAM) and Border Gateway Protocol (BGP) for non-AWS nodes.

### Prerequisites

- Your Palette account role must have the `clusterProfile.create` permission to import a cluster profile. Refer to the
  [Cluster Profile](../../../../user-management/palette-rbac/project-scope-roles-permissions.md#cluster-profile)
  permissions for guidance.

- If enabling [Cilium Envoy](https://docs.cilium.io/en/latest/security/network/proxy/envoy/) or other Cilium add-ons,
  you must also complete the following prerequisites:

  - Ensure [kubectl](https://kubernetes.io/docs/tasks/tools/) is installed and available in your local workstation.

  - Access to your Amazon EKS cluster through kubectl.

    - To access your cluster with kubectl, you can use the AWS CLI's built-in authentication capabilities. If you are
      using a custom OIDC provider, you will need to configure your kubeconfig to use your OIDC provider.

      Refer to the [Access Imported Cluster with Kubectl](#access-imported-cluster-with-kubectl) section for more
      information.

### Add CNI Cluster Profile

1. Log in to [Palette](https://console.spectrocloud.com/).

2. From the left **Main Menu**, select **Profiles**.

3. On the **Profiles** page, click **Add Cluster Profile**.

4. Fill out the basic information and ensure **Type** is set to **Add-on**. Click **Next** when done.

5. In **Profile Layers**, click **Add New Pack**.

6. Enter **Cilium** in the search box, and select it. It appears in the **Network** category and must be version
   **1.16.0** or above.

7. Click the **Presets drop-down Menu**.

8. For **IPAM mode**, select **Cluster Pool**.

9. In the YAML editor, search for **clusterPoolIPv4PodCIDRList**. This parameter specifies the CIDR ranges from which
   pod IPs will be allocated across all your hybrid nodes.

   Adjust the pod CIDR list for hybrid pods in other networks that need to connect to this cluster. This should match
   the **Remote Pod CIDRs** value defined in step 11 during the [Import Cluster](#import-cluster) steps. For example,
   `192.168.0.0/16`.

10. In the YAML editor, search for **clusterPoolIPv4MaskSize**. This parameter defines the size of each per-node CIDR
    block.

    Adjust the mask size based on your required pods per hybrid node. For example, `/25` would provides 126 usable pod
    IPs for each node.

11. In the Presets, find the **cilium-agent - Hybrid Nodes Affinity** option, and select **Amazon EKS**.

    This will add the following entry to `charts.cilium.affinity`. No changes are required afterwards.

    ```yaml hideClipboard
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: eks.amazonaws.com/compute-type
                operator: In
                values:
                  - hybrid
    ```

    :::info

    The Cilium [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) is configured to
    operate on your hybrid nodes only. If no hybrid nodes are present in your cluster, the DaemonSet will remain
    inactive.

    :::

12. Click **Confirm & Create**.

13. Click **Next**, and then click **Finish Configuration**.

14. From the left **Main Menu**, select **Clusters**.

15. Select your cluster to view its **Overview** tab.

16. Select the **Profile** tab, and click **Attach Profile**.

17. Select the **Cilium** add-on profile that was created, and click **Confirm**.

18. In the **Cluster profiles** page, click **Save**. This will add the profile to your cluster.

19. If enabling [Cilium Envoy](https://docs.cilium.io/en/latest/security/network/proxy/envoy/) or other Cilium add-ons,
    you must apply the following label to all AWS cloud worker nodes.

    ```yaml
    cilium.io/no-schedule: "true"
    ```

    This ensures that Kubernetes does not attempt to schedule Cilium add-on pods on these nodes, which are reserved for
    your hybrid nodes.

    Example command.

    ```shell
    kubectl label node <node1> <node2> <node3> cilium.io/no-schedule=true
    ```

### Validate

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu** and select **Clusters**.

3. Click on your cluster to view its details in the **Overview** tab.

4. Check that the **Cilium** layer is listed in your **Cluster Profiles**.

## Access Imported Cluster with Kubectl

You can access your imported Amazon EKS cluster by using the kubectl CLI, which requires authentication.

### Default AWS Authentication

To access an Amazon EKS cluster with the AWS CLI's built-in authentication, you need to do the following:

- Configure your AWS CLI credentials. Refer to
  [Configuration and Credential File Settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
  for guidance.

- Ensure you have the following IAM permissions to download the kubeconfig and access the Amazon EKS cluster. Refer to
  [Amazon EKS identity-based policy examples](https://docs.aws.amazon.com/eks/latest/userguide/security-iam-id-based-policy-examples.html)
  for guidance.

  - `eks:DescribeCluster`
  - `eks:AccessKubernetesApi`

- Download the kubeconfig file from the Amazon EKS cluster. Refer to
  [Connect kubectl to an EKS cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html) for
  guidance.

Once you have downloaded your kubeconfig, you can use kubectl to access your cluster and apply manifests.

### Custom OIDC Provider

To access an Amazon EKS cluster with a custom [OIDC](https://openid.net/developers/how-connect-works/) provider, you
need to do the following:

- If you have not yet installed an OIDC provider for your cluster, install
  [kubelogin](https://github.com/int128/kubelogin). We recommend kubelogin for its ease of authentication. Visit
  [Grant users access to Kubernetes with an external OIDC provider](https://docs.aws.amazon.com/eks/latest/userguide/authenticate-oidc-identity-provider.html)
  to learn how to associate an OIDC identity provider with your cluster.

<!-- prettier-ignore-start -->

- Ensure your OIDC user or group is mapped to an `admin` or `clusteradmin` Kubernetes RBAC Role or ClusterRole. To learn
  how to map a Kubernetes role to users and groups, refer to
  [Create Role Bindings](../../../cluster-management/cluster-rbac.md#create-role-bindings). For an example, refer to the <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes&tab=custom" /> pack additional details.

<!-- prettier-ignore-end -->

- Configure your AWS CLI credentials. Refer to
  [Configuration and Credential File Settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
  for guidance.

- Ensure you have the following IAM permission to download the kubeconfig from the Amazon EKS cluster. Refer to
  [Amazon EKS identity-based policy examples](https://docs.aws.amazon.com/eks/latest/userguide/security-iam-id-based-policy-examples.html)
  for guidance.

  - `eks:DescribeCluster`

- Download the kubeconfig file from the Amazon EKS cluster. Refer to
  [Connect kubectl to an EKS cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html) for
  guidance.

  - Once the kubeconfig is downloaded, you must configure it to use your OIDC provider. Refer to
    [Using kubectl](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#using-kubectl) for guidance.

Once you have downloaded your kubeconfig and configured it to use your OIDC provider, you can use kubectl to access your
cluster and apply manifests.

## Next Steps

Learn how to create a hybrid node pool on your cluster and add your edge hosts to the pool. Refer to the
[Create Hybrid Node Pools](./create-hybrid-node-pools.md) guide to start creating your node pools.

## Resources

- [Add AWS Account](../add-aws-accounts/add-aws-accounts.md)

- [Prepare Environment](./prepare-environment/prepare-environment.md)

- [Create Role Bindings](../../../cluster-management/cluster-rbac.md#create-role-bindings)

<!-- prettier-ignore-start -->

- <VersionedLink text="Palette eXtended Kubernetes (PXK)" url="/integrations/packs/?pack=kubernetes" /> pack

<!-- prettier-ignore-end -->
