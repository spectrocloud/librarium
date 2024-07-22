---
sidebar_label: "Create and Manage AWS EKS Cluster"
title: "Create and Manage AWS EKS Cluster"
description: "Learn how to deploy and manage AWS EKS clusters with Palette."
hide_table_of_contents: false
tags: ["public cloud", "aws", "eks"]
sidebar_position: 30
---

Palette supports creating and managing Amazon Web Services (AWS) Elastic Kubernetes Service (EKS) clusters deployed to
an AWS account. This section guides you on how to create an EKS cluster in AWS that Palette manages.

## Prerequisites

- Access to an AWS cloud account.

- Palette integration with AWS account. Review [Add AWS Account](add-aws-accounts.md) for guidance.

- An infrastructure cluster profile for AWS EKS. When you create the profile, ensure you choose **EKS** as the **Managed
  Kubernetes** cloud type. Review
  [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)
  for guidance.

- An EC2 key pair for the target region that provides a secure connection to your EC2 instances. To learn how to create
  a key pair, refer to the
  [Amazon EC2 key pairs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) resource.

- To access your EKS cluster using kubectl, you will need the
  [aws-iam-authenticator](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html) plugin
  installed. If you are using a custom OIDC provider, you will need the [kubelogin](https://github.com/int128/kubelogin)
  plugin installed. Refer to the [Access EKS Cluster](#access-eks-cluster) section for more information.

- To use secrets encryption, which is available only during EKS cluster creation, you must have created an AWS Key
  Management Service (KMS) key. If you do not have one, review
  [Enable Secrets Encryption for EKS Cluster](enable-secrets-encryption-kms-key.md) for guidance.

- If you do not provide your own Virtual Private Cloud (VPC), Palette creates one for you with compute, network, and
  storage resources in AWS when it provisions Kubernetes clusters. Ensure there is sufficient capacity in the preferred
  AWS region to create the following resources. Note that Palette does not create these resources if you specify an
  existing VPC.

  - Virtual CPU (vCPU)
  - Virtual Private Cloud (VPC)
  - Elastic IP
  - Internet Gateway
  - Elastic Load Balancers
  - Network Address Translation (NAT) Gateway

  <br />

  :::info

  To enable automated subnet discovery to create external load balancers, you need to add tags to the Virtual Private
  Cloud (VPC) public subnets. For more information about tagging VPC networks, refer to the AWS
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

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu** select **Clusters**, and click **Add New Cluster**.

4. In **Public Clouds**, under **Managed Kubernetes**, select **AWS EKS**.

5. In the bottom-right corner, click **Start AWS EKS Configuration**.

6. Fill out the following basic information and click **Next**.

   | **Field**         | **Description**                                                                                                                                                                                     |
   | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Cluster Name**  | A custom name for the cluster.                                                                                                                                                                      |
   | **Description**   | Use the description to provide context about the cluster.                                                                                                                                           |
   | **Tags**          | Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `region:us-east-1a` or `zone:vpc-private-us-east-1a`. |
   | **Cloud Account** | If you already added your AWS account in Palette, select it from the **drop-down Menu**. Otherwise, click **Add New Account** and add your AWS account information.                                 |

   To learn how to add an AWS account, review the [Add an AWS Account to Palette](add-aws-accounts.md) guide.

7. Click **Add Cluster Profile**, select a cluster profile and click **Next**. Palette displays the cluster profile
   layers.

8. Review the profile layers and customize parameters as desired in the YAML files that display when you select a layer.
   You can configure custom OpenID Connect (OIDC) for EKS clusters at the Kubernetes layer. Check out
   [Access EKS Cluster](#access-eks-cluster) if you need more guidance.

9. Click **Next** to continue.

10. Provide the following cluster configuration information and click **Next** to continue.

    | **Parameter**               | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
    | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Static Placement**        | By default, Palette uses dynamic placement. This creates a new Virtual Private Cloud (VPC) for the cluster that contains two subnets in different Availability Zones (AZs), which is required for EKS cluster deployment. Palette places resources in these clusters, manages the resources, and deletes them when the corresponding cluster is deleted.<br /><br />If you want to place resources into pre-existing VPCs, enable the **Static Placement** option, and provide the VPCID in the **VPCID** field that displays with this option enabled. You will need to specify two subnets in different Availability Zones (AZs).                                                                                                                                                                                                                                                                                                                                    |
    | **Region**                  | Use the **drop-down Menu** to choose the AWS region where you would like to provision the cluster.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | **SSH Key Pair Name**       | Choose the SSH key pair for the region you selected. SSH key pairs must be pre-configured in your AWS environment. This is called an EC2 Key Pair in AWS. The key you select is inserted into the provisioned VMs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | **Cluster Endpoint Access** | This setting provides access to the Kubernetes API endpoint. Select **Private**, **Public** or **Private & Public**. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | **Public Access CIDRs**     | This setting controls which IP address CIDR ranges can access the cluster. To fully allow unrestricted network access, enter `0.0.0.0/0` in the field. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
    | **Private Access CIDRs**    | This setting controls which private IP address CIDR ranges can access the cluster. Private CIDRs provide a way to specify private, self-hosted, and air-gapped networks or Private Cloud Gateway (PCG) that may be located in other VPCs connected to the VPC hosting the cluster endpoint.<br /><br />To restrict network access, replace the pre-populated 0.0.0.0/0 with the IP address CIDR range that should be allowed access to the cluster endpoint. Only the IP addresses that are within the specified VPC CIDR range - and any other connected VPCs - will be able to reach the private endpoint. For example, while using `0.0.0.0/0` would allow traffic throughout the VPC and all peered VPCs, specifying the VPC CIDR `10.0.0.0/16` would limit traffic to an individual VPC. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide. |
    | **Enable Encryption**       | Use this option for secrets encryption. You must have an existing AWS Key Management Service (KMS) key you can use. Toggle the **Enable encryption** option and use the **drop-down Menu** in the **ARN** field to select the KMS key ARN.<br /><br />If you do not have a KMS key and want to create one to use this option, review [Enable Secrets Encryption for EKS Cluster](enable-secrets-encryption-kms-key.md). Once your KMS key is created, return to this Cluster Config step to enable secrets encryption and specify the KMS key ARN.                                                                                                                                                                                                                                                                                                                                                                                                                     |

    :::warning

    If you set the cluster endpoint to **Public**, ensure you specify `0.0.0.0/0` in the **Public Access CIDR** field to
    open it to all possible IP addresses. Otherwise, Palette will not open it up entirely. We recommend specifying the
    **Private & Public** option to cover all the possibilities.

    :::

11. Provide the following node pool and cloud configuration information. If you will be using Fargate profiles, you can
    add them here.

    #### Node Configuration Settings

    | **Parameter**                   | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
    | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Node pool name**              | A descriptive name for the node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | **Number of nodes in the pool** | Specify the number of nodes in the worker pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
    | **Additional Labels**           | You can add optional labels to nodes in key-value format. For more information about applying labels, review [Node Labels](../../cluster-management/node-labels.md) guide. Example: `"environment": "production"`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
    | **Taints**                      | You can apply optional taint labels to a node pool during cluster creation or edit taint labels on an existing cluster. Review the [Node Pool](../../cluster-management/node-pool.md) management page and [Taints and Tolerations](../../cluster-management/taints.md) guide to learn more. Toggle the **Taint** button to create a taint label. When tainting is enabled, you need to provide a custom key-value pair. Use the **drop-down Menu** to choose one of the following **Effect** options:<br />**NoSchedule** - Pods are not scheduled onto nodes with this taint.<br />**PreferNoSchedule** - Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited.<br />**NoExecute** - Existing pods on nodes with this taint are evicted. |

    #### Cloud Configuration settings

    | **Parameter**                     | **Description**                                                                                                                                                                                                                                                                        |
    | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Instance Option**               | Choose a pricing method:<br />**On-Demand** instances provide stable and uninterrupted compute capacity at a higher cost.<br />**Spot** instances allow you to bid for unused EC2 capacity at a lower cost.<br />We recommend you base your choice on your application's requirements. |
    | **Instance Type**                 | Select the instance type to use for all nodes in the node pool.                                                                                                                                                                                                                        |
    | **Enable Nodepool Customization** | To use a pre-configured VM image, toggle this option on and provide the Amazon Machine Image (AMI) ID. When this option is enabled, you can use the **drop-down Menu** to specify the disk type to use.                                                                                |
    | **Root Disk size**                | You can choose disk size based on your requirements. The default size is `60`.                                                                                                                                                                                                         |

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

12. Click **Next** to continue.

13. Specify your preferred **OS Patching Schedule** for EKS-managed machines.

14. Enable any scan options you want Palette to perform, and select a scan schedule. Palette provides support for
    Kubernetes configuration security, penetration testing, and conformance testing.

15. Schedule any backups you want Palette to perform. Review
    [Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) for more information.

16. RBAC configuration is required when you configure custom OIDC. You must map a set of users or groups to a Kubernetes
    RBAC role. To learn how to map a Kubernetes role to users and groups, refer to
    [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings). Refer to
    [Use RBAC with OIDC](../../../integrations/kubernetes.md#use-rbac-with-oidc) for an example.

17. Click **Validate** and review the cluster configuration and settings summary.

18. Click **Finish Configuration** to deploy the cluster.

The displayed cluster details page contains the status and details of the deployment. Use this page to track the
deployment progress.

:::info

Provisioning an AWS EKS clusters can take several minutes.

:::

For information on how to access your cluster using the kubectl CLI, review [Access EKS Cluster](#access-eks-cluster).

## Validate

You can validate your cluster is up and in **Running** state.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu** and select **Clusters**. The **Clusters** page displays a list of all available
   clusters that Palette manages.

3. Click on the cluster you created to view its details page.

4. Ensure the **Cluster Status** field displays **Running**.

## Access EKS Cluster

You can access your Kubernetes cluster by using the kubectl CLI, which requires authentication. Depending on how you
will authenticate to your EKS cluster, you need to install the appropriate plugin. The table below lists the plugin
required for two EKS deployment scenarios.

| **Scenario**                                              | **Plugin**                                                                                                   |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Deploy EKS cluster with custom OIDC                       | [kubelogin](https://github.com/int128/kubelogin)                                                             |
| Deploy EKS cluster access with default AWS authentication | [aws-iam-authenticator](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html) |

Select the appropriate tab for your deployment.

<Tabs queryString="oidc-authentication">

<TabItem label="AWS IAM" value="AWS IAM">

To access an EKS cluster with default AWS authentication, you need to do the following:

- Install [aws-iam-authenticator](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html).

- Configure your AWS credentials. The aws-iam-authenticator plugin requires AWS credentials to access the cluster. Refer
  to the
  [Configuration and Credential File Settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
  reference guide.

- Download the kubeconfig file from the cluster details page. Refer to the
  [Kubectl](../../cluster-management/palette-webctl.md) guide for more information.

</TabItem>

<TabItem label="Custom OIDC" value="Custom OIDC">

To use custom OIDC, you need to do the following:

- Install [kubelogin](https://github.com/int128/kubelogin). We recommend kubelogin for its ease of authentication. For
  more information and to learn about other available helper applications, you can visit
  [OIDC Identity Provider authentication for Amazon EKS](https://aws.amazon.com/blogs/containers/introducing-oidc-identity-provider-authentication-amazon-eks/).

- Configure OIDC in the Kubernetes pack YAML file. Refer to steps for Amazon EKS in the
  [Configure Custom OIDC](../../../integrations/kubernetes-generic.md#configure-custom-oidc) guide.

- Map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups,
  refer to [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings). Refer to
  [Use RBAC with OIDC](../../../integrations/kubernetes.md#use-rbac-with-oidc) for an example.

- Download the kubeconfig file from the cluster details page. Refer to the
  [Kubectl](../../cluster-management/palette-webctl.md) guide for more information.

</TabItem>

</Tabs>

Once you have the required plugin installed and kubeconfig file downloaded, you can use kubectl to access your cluster.

:::tip

For guidance in setting up kubectl, review the [Kubectl](../../cluster-management/palette-webctl.md) guide.

:::

## Resources

- [Add AWS Account](add-aws-accounts.md)

- [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)

- [Enable Secrets Encryption for EKS Cluster](enable-secrets-encryption-kms-key.md)

- [Configure Custom OIDC](../../../integrations/kubernetes.md#configure-custom-oidc)

- [Create Role Bindings](../../cluster-management/cluster-rbac.md#create-role-bindings).

- [Use RBAC with OIDC](../../../integrations/kubernetes.md#use-rbac-with-oidc)
