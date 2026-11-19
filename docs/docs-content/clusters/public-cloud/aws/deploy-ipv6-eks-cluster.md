---
sidebar_label: "Deploy an IPv6 EKS Cluster"
title: "Deploy an IPv6 EKS Cluster"
description: "Learn how to deploy an Amazon EKS cluster that uses the IPv6 IP address family with Palette."
tags: ["public cloud", "aws", "eks", "ipv6"]
sidebar_position: 35
---

Palette supports deploying Amazon EKS clusters that use the IPv6 IP address family. In an IPv6 EKS cluster, pods and
services receive IPv6 addresses only. Worker nodes run in subnets that have both IPv4 and IPv6 CIDR blocks, which allows
pods to reach IPv4 endpoints outside the cluster. Refer to
[Learn about IPv6 addresses to clusters, Pods, and services](https://docs.aws.amazon.com/eks/latest/userguide/cni-ipv6.html)
in the AWS documentation for details on how Amazon EKS implements the IPv6 IP address family.

Palette does not provide a dedicated IP address family setting when you create an EKS cluster. Instead, you enable IPv6
through pack values in your [cluster profile](../../../profiles/cluster-profiles/cluster-profiles.md) and a
[Cluster API (CAPI) override](../../../architecture/override-capi-properties/override-capi-properties.md) during cluster
creation. This guide describes the required configuration and the order in which to apply it.

## Limitations

- You select the IP address family when you create the cluster. Amazon EKS does not allow you to change the IP address
  family of an existing cluster, so you cannot convert an IPv4 EKS cluster to IPv6.

- Amazon EKS does not support dual-stack pods or services. Pods and services in an IPv6 EKS cluster cannot have both an
  IPv4 and an IPv6 address.

- Amazon EKS assigns the IPv6 service CIDR when it creates the cluster. You cannot choose the service CIDR in advance.
  For this reason, you deploy the cluster with a placeholder value and
  [update the service CIDR](#update-the-service-cidr) after the cluster is created.

- Do not enable **Override Cluster API node pool configuration (Optional)** on any node pool until you have
  [updated the service CIDR](#update-the-service-cidr). Node pools that use a CAPI override are bootstrapped with the
  service CIDR from the cluster profile. If the placeholder value is still in place, the nodes receive an incorrect
  service CIDR.

- Do not set `instanceMetadataOptions.httpProtocolIpv6` to `enabled` in a node pool CAPI override. This setting causes
  the node pool to be repaved repeatedly.

- Many services outside the cluster, such as some container image registries, are reachable over IPv4 only. Ensure the
  subnets of your worker nodes have an IPv4 route to the services your workloads and Palette depend on, for example,
  through a Network Address Translation (NAT) gateway.

## Prerequisites

- All prerequisites listed in the [Create and Manage AWS EKS Cluster](./eks.md#prerequisites) guide.

- An existing Virtual Private Cloud (VPC) that has both an IPv4 and an IPv6 CIDR block, with subnets in at least two
  Availability Zones (AZs). The **Enable auto-assign IPv6 address** setting must be enabled on the private subnets that
  host the worker nodes. Refer to
  [Learn about IPv6 addresses to clusters, Pods, and services](https://docs.aws.amazon.com/eks/latest/userguide/cni-ipv6.html)
  in the AWS documentation for the complete list of AWS requirements and considerations, such as supported instance
  types.

- An Identity and Access Management (IAM) policy for the Amazon VPC Container Network Interface (CNI) plugin that allows
  it to assign IPv6 addresses. AWS does not provide a managed policy for the IPv6 IP address family, so you must create
  the policy in the AWS account where you deploy the cluster. This guide uses the policy name
  `AmazonEKS_CNI_IPv6_Policy`. Refer to
  [Configure Amazon VPC CNI plugin to use IRSA](https://docs.aws.amazon.com/eks/latest/userguide/cni-iam-role.html) in
  the AWS documentation for the policy contents and the command to create it.

<!-- prettier-ignore-start -->

- A cluster profile for AWS EKS that contains the following packs. Refer to
  [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)
  for guidance on creating a cluster profile.

  - <VersionedLink text="Kubernetes (EKS)" url="/integrations/packs/?pack=kubernetes-eks" />

  - <VersionedLink text="AWS VPC CNI (Helm)" url="/integrations/packs/?pack=cni-aws-vpc-eks-helm" />

  - <VersionedLink text="Amazon EBS CSI" url="/integrations/packs/?pack=csi-aws-ebs" />

<!-- prettier-ignore-end -->

- The [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and configured
  with credentials for the AWS account that hosts the cluster. The credentials need the `eks:DescribeCluster`
  permission.

- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl) installed to validate the cluster.

## Configure the Cluster Profile

The Kubernetes, network, and storage layers of your cluster profile need additional values for IPv6. The network and
storage layers use IAM Roles for Service Accounts (IRSA) to obtain their AWS permissions.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Profiles**, and then select your AWS EKS cluster profile.

4. Select the **Kubernetes** layer of the cluster profile.

5. Use the YAML editor to set the service CIDR to a placeholder IPv6 CIDR. Amazon EKS assigns the actual service CIDR
   when it creates the cluster, and you replace the placeholder in the
   [Update the Service CIDR](#update-the-service-cidr) section.

   ```yaml
   pack:
     serviceClusterIpRange: "ff00:ff00:ff00::/108"
   ```

6. In the same layer, add the following IRSA roles under `managedControlPlane`. Palette creates one IAM role for the
   Amazon VPC CNI plugin and one for the Amazon Elastic Block Store (EBS) CSI driver when it deploys the cluster.

   ```yaml
   managedControlPlane:
     irsaRoles:
       - name: "{{.spectro.system.cluster.name}}-irsa-vpc-cni"
         policies:
           - arn:aws:iam::<aws-account-id>:policy/AmazonEKS_CNI_IPv6_Policy
         serviceAccount:
           name: aws-node
           namespace: kube-system
       - name: "{{.spectro.system.cluster.name}}-irsa-ebs-csi"
         policies:
           - arn:aws:iam::aws:policy/AmazonEBSCSIDriverPolicyV2
         serviceAccount:
           name: ebs-csi-controller-sa
           namespace: kube-system
   ```

   Replace `<aws-account-id>` with the ID of the AWS account where you created the `AmazonEKS_CNI_IPv6_Policy` policy.

7. Select **Confirm Updates**.

8. Select the **Network** layer of the cluster profile, which contains the **AWS VPC CNI (Helm)** pack.

9. Use the YAML editor to enable IPv6 and prefix delegation, disable IPv4, and annotate the service account of the
   plugin with the IRSA role.

   ```yaml
   charts:
     aws-vpc-cni:
       init:
         env:
           ENABLE_IPv6: "true"
       nodeAgent:
         enableIpv6: "true"
       env:
         ENABLE_PREFIX_DELEGATION: "true"
         ENABLE_IPv4: "false"
         ENABLE_IPv6: "true"
       serviceAccount:
         annotations:
           eks.amazonaws.com/role-arn: "arn:aws:iam::<aws-account-id>:role/{{.spectro.system.cluster.name}}-irsa-vpc-cni"
   ```

   Replace `<aws-account-id>` with the ID of the AWS account where you deploy the cluster.

10. Select **Confirm Updates**.

11. Select the **Storage** layer of the cluster profile, which contains the **Amazon EBS CSI** pack.

12. Use the YAML editor to annotate the service account of the EBS CSI controller with the IRSA role.

    ```yaml
    charts:
      aws-ebs-csi-driver:
        controller:
          serviceAccount:
            annotations:
              eks.amazonaws.com/role-arn: "arn:aws:iam::<aws-account-id>:role/{{.spectro.system.cluster.name}}-irsa-ebs-csi"
    ```

    Replace `<aws-account-id>` with the ID of the AWS account where you deploy the cluster.

13. Select **Confirm Updates**, and then select **Save Changes** on the cluster profile page.

## Deploy the Cluster

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters**, and then select **Add New Cluster**.

4. In **Public Clouds**, under **Managed Kubernetes**, select **AWS EKS**.

5. In the bottom-right corner, select **Start AWS EKS Configuration**.

6. Enter a **Cluster Name**, select your AWS **Cloud Account**, and select **Next**.

7. <PartialsComponent category="cluster-templates" name="profile-vs-template" />

   - Select the cluster profile that you configured in the
     [Configure the Cluster Profile](#configure-the-cluster-profile) section.

8. <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

9. In the **Cluster Config** step, select the **Region**, enable **Enable static placement (Optional)**, and select the
   VPC and subnets that meet the IPv6 [prerequisites](#prerequisites).

10. Enable **Override Cluster API cluster configuration**, and then select **Update Cluster API cluster configuration**.

11. Enter the following override in the YAML editor to set the IP address family of the cluster to IPv6.

    ```yaml
    awsManagedControlPlane:
      spec:
        network:
          vpc:
            ipv6: {}
    ```

12. Complete the remaining fields in the **Cluster Config** step, and select **Next**. Refer to
    [Deploy an AWS EKS Cluster](./eks.md#deploy-an-aws-eks-cluster) for a description of each field.

13. In the **Nodes Config** step, configure one worker node pool, and leave **Override Cluster API node pool
    configuration (Optional)** disabled. Refer to [Deploy an AWS EKS Cluster](./eks.md#deploy-an-aws-eks-cluster) for a
    description of each field. Select **Next**.

14. <PartialsComponent category="clusters" name="cluster-settings" />

15. Select **Validate** to review your cluster configurations and settings.

16. If no changes are needed, select **Finish Configuration** to deploy your cluster.

17. From the left main menu, select **Clusters**, and then select your cluster. Wait until the **Cluster Status** field
    displays **Running**.

## Update the Service CIDR

After Amazon EKS creates the cluster, replace the placeholder service CIDR in the Kubernetes layer with the service CIDR
that Amazon EKS assigned. The service CIDR is specific to each cluster.

1. Use the AWS CLI to retrieve the IPv6 service CIDR of the cluster.

   ```shell
   aws eks describe-cluster --name <eks-cluster-name> --region <region> --query "cluster.kubernetesNetworkConfig.serviceIpv6Cidr" --output text
   ```

   Replace `<eks-cluster-name>` with the name of the cluster in the Amazon EKS console and `<region>` with the AWS
   region of the cluster.

2. Update the `pack.serviceClusterIpRange` value in the **Kubernetes** layer with the CIDR that the command returned,
   and apply the change to the cluster. Refer to [Update a Cluster](../../cluster-management/cluster-updates.md) for the
   available methods to apply a cluster profile change to an active cluster.

   ```yaml
   pack:
     serviceClusterIpRange: "<ipv6-service-cidr>"
   ```

   Replace `<ipv6-service-cidr>` with the IPv6 service CIDR of the cluster.

3. Wait a few minutes for Palette to apply the change to the cluster.

4. (Optional) If you need node pools that use a CAPI override, add them now, or edit the existing node pool. The
   following example raises the Instance Metadata Service version 2 (IMDSv2) hop limit to `2` for the nodes of the pool.

   ```yaml
   awsManagedMachinePool:
     spec:
       awsLaunchTemplate:
         ami:
           eksLookupType: AmazonLinux2023
         instanceMetadataOptions:
           httpTokens: required
           httpPutResponseHopLimit: 2
   ```

   You must enable **Enable Nodepool Customization (Optional)** on the node pool before you override
   `awsLaunchTemplate`. Refer to
   [Node Pool Launch Template](../../../architecture/override-capi-properties/aws-capi-override-reference.md#node-pool-launch-template)
   for details.

## Validate

Use the following steps to confirm that the cluster uses the IPv6 IP address family. The kubectl steps require access to
the cluster. Refer to [Access EKS Cluster](./eks.md#access-eks-cluster) to obtain the kubeconfig file, and then set the
`KUBECONFIG` environment variable.

```shell
export KUBECONFIG=<path-to-kubeconfig>
```

Replace `<path-to-kubeconfig>` with the path to the kubeconfig file of the cluster.

1. Use the AWS CLI to check the IP address family of the cluster. The command returns `ipv6`.

   ```shell
   aws eks describe-cluster --name <eks-cluster-name> --region <region> --query "cluster.kubernetesNetworkConfig.ipFamily" --output text
   ```

   Replace `<eks-cluster-name>` with the name of the cluster in the Amazon EKS console and `<region>` with the AWS
   region of the cluster.

2. List the pods in the cluster, and verify that the **IP** column contains IPv6 addresses.

   ```shell
   kubectl get pods --all-namespaces --output wide
   ```

3. Check the IP address family of the `kubernetes` service. The command returns `["IPv6"]`.

   ```shell
   kubectl get service kubernetes --namespace default --output jsonpath='{.spec.ipFamilies}'
   ```

## Next Steps

- [Create and Manage AWS EKS Cluster](./eks.md)

- [Override Cluster API (CAPI) Properties](../../../architecture/override-capi-properties/override-capi-properties.md)

- [Cluster Management guides](../../cluster-management/cluster-management.md)
