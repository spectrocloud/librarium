---
sidebar_label: "Create and Manage AWS EKS Cluster"
title: "Create and Manage AWS EKS Cluster"
description: "Learn how to deploy and manage AWS EKS clusters with Palette."
hide_table_of_contents: false
tags: ["public cloud", "aws"]
sidebar_position: 30
---


Palette supports creating and managing AWS Elastic Kubernetes Service (EKS) clusters deployed to an AWS account. This section guides you on how to create an EKS cluster in AWS that Palette manages.

## Prerequisites

- Access to an AWS cloud account.

- Palette integration with AWS account. Review [Add AWS Account](add-aws-accounts.md) for guidance.

<!-- - A Virtual Private Cloud (VPC) with at least two subnets in different Availability Zones (AZs). Palette requires two AZs within the VPC that you specify when creating the EKS cluster. -->

- An infrastructure cluster profile for AWS EKS. When you create the profile, ensure you choose **EKS** as the **Managed Kubernetes** cloud type. Review [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) for guidance.

- An EC2 key pair for the target region that provides a secure connection to your EC2 instances. To learn how to create a key pair, refer to the [Amazon EC2 key pairs](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) resource.

- kubelogin installed. This is a kubectl plugin for Kubernetes OpenID Connect (OIDC) authentication, also known as `kubectl oidc-login`.

- Palette creates compute, network, and storage resources in AWS when it provisions Kubernetes clusters. Ensure there is sufficient capacity in the preferred AWS region to create the following resources:
    - Virtual CPU (vCPU)
    - Virtual Private Cloud (VPC)
    - Elastic IP
    - Internet Gateway
    - Elastic Load Balancers
    - Network Address Translation (NAT) Gateway


:::info

To enable automatic subnet discovery for integration with AWS load balancer service, you need to add tags to the Virtual Private Cloud (VPC) public subnets. Use the AWS Tag Editor and specify the region and resource type. Then, add the following tags. Replace the value `yourClusterName` with your cluster's name. Refer to [AWS Tag Editor](https://docs.aws.amazon.com/tag-editor/latest/userguide/tag-editor.html) for more information.

<!-- The following tags should be added to the virtual private network (VPC) public subnets to enable automatic subnet discovery for integration with AWS load balancer service. Replace the value `yourClusterName` with your cluster's name. -->
- `kubernetes.io/role/elb = 1`
- `sigs.k8s.io/cluster-api-provider-aws/role = public`
- `kubernetes.io/cluster/[yourClusterName] = shared` 
- `sigs.k8s.io/cluster-api-provider-aws/cluster/[yourClusterName] = owned`

:::

## Deploy an AWS Cluster

Use the following steps to deploy an AWS cluster in which to provision an EKS cluster.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu** select **Clusters**, and click on the **Add New Cluster** button.

4. Select **Deploy New Cluster** on the next page Palette displays. This will allow you to deploy a cluster using your own cloud account. 

5. Select **AWS** and click on the **Start AWS Configuration** button.

6. Fill out the following basic information, and click **Next** to continue.

  | **Field** | **Description** |
  |-----------|-----------------|
  | **Cluster Name**| A custom name for the cluster. |
  | **Description**| Use the description to provide context about the cluster.|
  | **Tags**| Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `region:us-east-1a` or `zone:vpc-private-us-east-1a`.|
  | **Cloud Account** | If you already added your AWS account in Palette, select it from the **drop-down Menu**. Otherwise, click on **Add New Account** and add your AWS account information. |

  To learn how to add an AWS account, review the [Add an AWS Account to Palette](add-aws-accounts.md) guide.


### Create an EKS Cluster

Use the following steps to provision a new EKS cluster.

1. Select **EKS** as the **Managed Kubernetes**. 

2. Select the EKS cluster profile you created and click on **Next**. Palette displays the cluster profile layers.

3. Review the profile layers and customize parameters as desired in the YAML files that display when you select a layer.

  You can configure OpenID Connect (OIDC) at the Kubernetes layer. To configure OIDC for managed EKS clusters, follow steps for Amazon EKS in the [Configure Custom OIDC](../../../integrations/kubernetes.md/#configure-custom-oidc) guide.

  :::caution

  Configuring OIDC requires you to map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](../../cluster-management/cluster-rbac.md/#create-role-bindings). Refer to [Use RBAC with OIDC](../../../integrations/kubernetes.md/#use-rbac-with-oidc) for an example.

  :::

4. Click on **Next** to continue.

5. Provide the following cluster configuration information and click on **Next** to continue. 

  |**Parameter**| **Description**|
  |-------------|---------------|
  |**Static Placement** | By default, Palette uses dynamic placement. This creates a new Virtual Private Cloud (VPC) for the cluster that contains two subnets in different Availability Zones (AZs), which is required for EKS cluster deployment. Palette places resources in these clusters, manages the resources, and deletes them when the corresponding cluster is deleted.<br /><br />If you want to place resources into pre-existing VPCs and subnets, enable the **Static Placement** option, and provide the VPCID in the **VPCID** field that displays with this option enabled. You will need to specify two subnets in different Availability Zones (AZs). |
  |**Region** | Use the **drop-down Menu** to choose the AWS region where you would like to provision the cluster.|
  |**SSH Key Pair Name** | Choose the SSH key pair for the region you selected. SSH key pairs must be pre-configured in your AWS environment. This is called an EC2 Key Pair in AWS. The key you select is inserted into the provisioned VMs.|
  |**Cluster Endpoint Access**| This setting provides access to the Kubernetes API endpoint. Select **Private**, **Public** or **Private & Public**. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.|
  |**Public Access CIDRs** |This setting controls which IP address CIDR ranges can access the cluster. To fully allow unrestricted network access, enter `0.0.0.0/0` in the field. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.|
  |**Private Access CIDRs** |This setting controls which private IP address CIDR ranges can access the cluster. Private CIDRs provide a way to specify private, self-hosted, and air-gapped networks or Private Cloud Gateway (PCG) that may be located in other VPCs connected to the VPC hosting the cluster endpoint.<br /><br />To restrict network access, enter the IP address CIDR range that will provide access to the cluster. Although `0.0.0.0/0` is pre-populated in this field, Palette ensures the only IPs that can reach the private endpoint are those within the VPC or any other connected VPCs. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.|
  |**Enable Encryption**| To enable secret encryption, toggle the **Enable Encryption** option and use the **drop-down Menu** to the select the AWS Key Managment Service (KMS) key **ARN**. Review [EKS Cluster Encryption](#eks-cluster-secrets-encryption) for more details.|

  :::caution

  If you set the cluster endpoint to **Public**, ensure you specify `0.0.0.0/0` in the **Public Access CIDR** field to open it to all possible IP addresses. Otherwise, Palette will not open it up entirely. We recommend specifying the **Private & Public** option to cover all the possibilities.

  :::

<!-- Configure the worker node pool and provide cloud configuration information. Palette configures a single worker node pool by default.  [instance cost type](architecture#spot-instances) Use the following table to better understand the available input options. Click **Next** to continue. -->

6. Provide the following node pool and cloud configuration information. If you will be using Fargate profiles, you can add them here.

    - Node Configuration Settings
    
    |**Parameter**| **Description**|
    |-------------|----------------|
    |**Node pool name** | A descriptive name for the node pool.|
    |**Number of nodes in the pool** | Specify the number of nodes in the worker pool.|
    |**Additional Labels** | You can add optional labels to nodes in key-value format. For more information about applying labels, review [Apply Labels to Nodes](../../cluster-management/taints.md/#apply-labels-to-nodes).  Example: `"environment": "production"` |
    |**Taints** | You can apply optional taint labels to a node pool during cluster creation or edit taint labels on an existing cluster. Review the [Node Pool](../../cluster-management/node-pool.md) management page and [Apply Taints to Nodes](../../cluster-management/taints.md/#apply-taints-to-nodes) page to learn more. Toggle the **Taint** button to create a taint label. When tainting is enabled, you need to provide a custom key-value pair. Use the **drop-down Menu** to choose one of the following **Effect** options:<br />**NoSchedule** - Pods are not scheduled onto nodes with this taint.<br />**PreferNoSchedule** - Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited.<br />**NoExecute** - Existing pods on nodes with this taint are evicted.| 
    
    - Cloud Configuration settings
    
    |**Parameter**| **Description**|
    |-------------|----------------|
    | **Instance Option** | Choose a pricing method:<br />**On-Demand** instances provide stable and uninterrupted compute capacity at a higher cost.<br />**Spot** instances allow you to bid for unused EC2 capacity at a lower cost.<br />We recommend you base your choice on your application's requirements. | 
    |**Instance Type** | Select the instance type to use for all nodes in the node pool.|
    |**Enable Nodepool Customization** | To use a pre-configured VM image, toggle this option on and provide the Amazon Machine Image (AMI) ID. When this option is enabled, you can use the **drop-down Menu** to specify the disk type to use. |
    |**Root Disk size** | You can choose disk size based on your requirements. The default size is `60`. |

    - Fargate Profiles

    You can create one or more Fargate profiles for the EKS cluster to use. Click **+ Add Fargate Profile**. For more information about Fargate profiles, refer to the [AWS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/userguide/what-is-fargate.html) reference guide.
    
    |**Parameter**| **Description**|
    |-------------|---------------|
    |**Name** |A custom name for the Fargate profile.|
    |**Subnets** |Pods running on Fargate Profiles are not assigned public IP addresses, so only private subnets (with no direct route to an Internet Gateway) are accepted for this parameter. For dynamic provisioning, this input is not required and subnets are automatically selected.|
    |**Selectors** |Define a pod selector by providing a target namespace and optional labels. Pods with a matching namespace and app labels are scheduled to run on dynamically provisioned compute nodes.<br /> You can have up to five selectors in a Fargate profile, and a pod only needs to match one selector to run using the Fargate profile.|
    
    :::info
    
    You can add new worker pools if you need to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the m3.large instance types for general-purpose workloads, and another worker pool with instance type g2.2xlarge can be configured to run GPU workloads.
    
    :::

7. Click on **Next** to continue.

8. Specify your preferred **OS Patching Schedule** for EKS-managed machines.

9. Enable any scan options you want Palette to perform, and select a scan schedule. Palette provides support for Kubernetes configuration security, penetration testing, and conformance testing.

10. Schedule any backups you want Palette to perform. Review [Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) for more information.

11. RBAC configuration is required when you configure OIDC. You must map a set of users or groups to a Kubernetes RBAC role. To learn how to map a Kubernetes role to users and groups, refer to [Create Role Bindings](../../cluster-management/cluster-rbac.md/#create-role-bindings). Refer to [Use RBAC with OIDC](../../../integrations/kubernetes.md/#use-rbac-with-oidc) for an example.

12. Click on the **Validate** button and review the cluster configuration and settings summary. 

13. Click **Finish Configuration** to deploy the cluster. 

  The cluster details page of the cluster contains the status and details of the deployment. Use this page to track the deployment progress.
  
  :::info
  
  Provisioning an AWS EKS clusters can take several minutes.
  
  :::


### Validate

You can validate your cluster is up and running.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu** and select **Clusters**. The **Clusters** page displays a list of all available clusters that Palette manages. 

3. Click on the cluster you created to view its details page.

4. Ensure the **Cluster Status** field displays **Running**.


## EKS Cluster Secrets Encryption

Palette encourages using AWS Key Management Service (KMS) to provide envelope encryption of Kubernetes secrets stored in Amazon Elastic Kubernetes Service (EKS) clusters. This encryption is 
a defense-in-depth security strategy to protect sensitive data such as passwords, docker registry credentials, and Transport Layer Security (TLS) keys stored as [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/). 

### Prerequisites

* KMS key created in the AWS account.
* KMS key is of the type symmetric.
* KMS key policy permits the following actions; encrypt and decrypt.

### Configure KMS

The IAM user or IAM role that Palette is using must have the following IAM permissions.

```json hideClipboard
kms:CreateGrant,
kms:ListAliases,
kms:ListKeys,
kms:DescribeKeys
```
Ensure the IAM role or IAM user can perform the required IAM permissions on the KMS key that will be used for EKS.

You can enable secret encryption during the EKS cluster creation process by toggling the **Enable Encryption** button on and providing the Amazon Resource Name (ARN) of the encryption key. The encryption option is available on the cluster creation wizard's **Cluster Config** page. Review [EKS Cluster Encryption](#eks-cluster-secrets-encryption) for more details.



<!-- To connect to the EKS cluster with kubectl, use the `SpectroCloudRole` IAM role. Or does it need to be another user?

1. Install aws-iam-authenticator.

2. <<< What else? . >>>

3. attach a policy to the user so the user can assume the role `SpectroCloudRole`.
new policy is assumeSpectroCloudRole. Make it a trusted entity. -->



## Resources

- [Add AWS Account](add-aws-accounts.md)

- [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)

- [EC2 Key Pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) 

- [AWS Tag Editor](https://docs.aws.amazon.com/tag-editor/latest/userguide/tag-editor.html)

- [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html)

- [EKS Cluster Encryption](#eks-cluster-secrets-encryption)

- [AWS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/userguide/what-is-fargate.html)

- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)

- [Configure Custom OIDC](../../../integrations/kubernetes.md/#configure-custom-oidc)

- [Create Role Bindings](../../cluster-management/cluster-rbac.md/#create-role-bindings).

- [Use RBAC with OIDC](../../../integrations/kubernetes.md/#use-rbac-with-oidc)

- [EKS Cluster Encryption](#eks-cluster-secrets-encryption) 