---
sidebar_label: "Create and Manage AWS EKS Cluster"
title: "Create and Manage AWS EKS Cluster"
description: "Learn how to deploy and manage AWS EKS clusters with Palette"
hide_table_of_contents: false
tags: ["public cloud", "aws"]
sidebar_position: 30
---


Palette supports creating and managing AWS Elastic Kubernetes Service (EKS) clusters deployed to an AWS account. This section guides you on how to create an AWS EKS cluster in AWS that is managed by Palette.

## Prerequisites

The following prerequisites must be met before deploying a cluster to AWS:

- Access to an AWS cloud account 
- Palette integration with AWS account. Review [Add AWS Account](add-aws-accounts.md) for guidance.
- An infrastructure cluster profile for AWS EKS. Review [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) for guidance.
- An [EC2 Key Pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) in the target region.
- Palette creates compute, network, and storage resources in AWS when it provisions Kubernetes clusters. Ensure there is sufficient capacity in the preferred AWS region for the creation of the following resources:
    - vCPU
    - VPC
    - Elastic IP
    - Internet Gateway
    - Elastic Load Balancers
    - NAT Gateway


:::info

The following tags should be added to the virtual private network (VPC) public subnets to enable automatic subnet discovery for integration with AWS load balancer service. Replace the value `yourClusterName` with your cluster's name.
- `kubernetes.io/role/elb = 1`
- `sigs.k8s.io/cluster-api-provider-aws/role = public`
- `kubernetes.io/cluster/[yourClusterName] = shared` 
- `sigs.k8s.io/cluster-api-provider-aws/cluster/[yourClusterName] = owned`

:::

## Deploy an AWS Cluster

Use the following steps to provision a new AWS EKS cluster:

1. Ensure you are in the correct project scope.

2. From the left **Main Menu**, select **Clusters** and click on the **Add New Cluster** button.

3. Click on **Deploy New Cluster** on the next page Palette displays. This will allow you to deploy a cluster using your own cloud account. 

4. Select **AWS** and click on the **Start AWS Configuration** button.

5. Fill out the following input values, and click on **Next** to continue.

  | **Field** | **Description** |
  |-----------|-----------------|
  | **Name**| A custom name for the cluster. |
  | **Description**| Use the description to provide context about the cluster.|
  | **Tags**| Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `zone` or `region`.|
  | **Cloud Account** | If you already have an AWS account, add the AWS cloud account name. If you do not have an account, click on **Add New Account** to a add one. |

7. On the AWS cloud account form that displays, provide your AWS account name. You can add an optional description to provide context about the account.

8. Select **AWS** from the **drop-down Menu**. <<< Note: check prod to see if AWS US Gov is listed >>

9. If you use **Credentials**, provide these in the Access Key and Secret access key fields. To use Security Token Service, review the guidance in the right panel that displays when you select **STS**. 
<<< The following needs different formatting - not sure it works as a tab because it would be only one. maybe the info is mentioned in prereqs? Maybe in a different doc? >>>
    STS requires you to create the following IAM policies with the listed permissions within your AWS account:

  | **Policy** | **Permissions** |
  |-----------|-----------------|
  | `PaletteControllerPolicy`| Controller Policy |
  | `PaletteControlPlanePolicy`| Control Plane Policy|
  | `PaletteNodesPolicy`| Nodes Policy|
  | `PaletteDeploymentPolicy` | Deployment Policy |


STS also requires you to create an IAM Role using the following options:

   - Trusted Entity Type: Specify another AWS account

   - Account ID: Copy this from the panel that displays when you select **STS**.

   - Require External ID: **Enable**

   - External ID: Copy this from the panel that displays when you select **STS**

   - Permissions Policy: These are the four policies you added, which are listed in the above table.


10. In the AWS Console, browse to the role details page and copy the Role ARN and paste it in the **ARN** field.

11. Click the **Validate** button. If the credentials you provided are correct, a Credentials validated success message with a green check is displayed.

11. Click the **Validate** button. If the ARN you provided is correct, a Credentials validated success message with a green check is displayed.

12. Toggle the **Connect Private Cloud Gateway** ... <<< why does user do this?? >>>

13. When you have completed inputting values and credentials are validated, click **Confirm**.




14. Under **Managed Kubernetes**, select **EKS**. Select the EKS cluster profile you created and click on **Next**.

15. Review and customize parameters as desired in the YAML files for each cluster profile layer. Click on **Next** when you are done.


16. Provide the following and placement information and click on **Next** to continue. 

    |**Parameter**| **Description**|
    |-------------|---------------|
    <!-- |**Cloud Account** | Select the desired cloud account. AWS cloud accounts with AWS credentials need to be pre-configured in project settings.| -->
    |**Static Placement** | By default, Palette uses dynamic placement. This creates a new Virtual Private Cloud (VPC) in which cluster resources for each cluster will be placed. Palette manages these resources and deletes them when the corresponding cluster is deleted. <br /><br /> Enable the **Static Placement** option if you want to place resources into preexisting VPCs and subnets. You will need to provide the VPCID.|
    |**Region** | Use the **drop-down Menu** to choose the AWS region where you would like to provision the cluster.|
    |**SSH Key Pair Name** | Choose the SSH key pair for the region you selected. SSH key pairs must be pre-configured in your AWS environment. This is called an EC2 Key Pair in AWS. The selected key is inserted into the provisioned VMs.|
    |**Cluster Endpoint Access**| This setting provides access to the Kubernetes API endpoint. Select **Private**, **Public** or **Private & Public**. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.|
    |**Public Access CIDR** |This setting controls which IP address CIDR range can access the cluster. To fully allow unrestricted network access, enter `0.0.0.0/0` in the field. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.|
    |**Private Access CIDR** |This setting controls which IP address CIDR range can access the cluster. To restrict network access, enter the IP address CIDR range that will provide access to the cluster. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.|
    |**Enable Encryption**| To enable secret encryption, toggle the **Enable Encryption** option and use the **drop-down Menu** to the select the AWS Key Managment Service (KMS) key **ARN** <<< for the cluster? >>>. Review [EKS Cluster Encryption](#eks-cluster-secrets-encryption) for more details.|
    |**Update worker pools in parallel**|This option allows the simultaneous update of nodes in the worker pool.| <<<  Any advantages/disadvantages in doicng this?? >>>

    :::caution

    If you set the cluster endpoint to Public, ensure you specify `0.0.0.0/0` in the Public Access CIDR field to open it to all possible IP addresses. Otherwise, Palette will not open it up entirely. We recommend specifying the **Private & Public** option to cover all the possibilities. <<< verify this >>>

    :::
<<< In a managed environment, do we still have a control plance?? >>>

11. Configure the worker node pools. A single master and a worker node pool are configured by default. This is the section where you can specify the availability zones (AZ), instance types, [instance cost type](architecture#spot-instances), disk size, and the number of nodes. Use the following tables to better understand the available input options.

    |**Parameter**| **Description**|
    |-------------|----------------|
    |**Node pool name** | A descriptive name for the node pool.|
    |**Number of nodes in the pool** | Specify the number of nodes.|
    |**Additional Labels** | ??       |
    |**Taints** | To control which workloads are placed on nodes in the pool. Toggle **Taints** on and specify a key and value. Use the **drop-down Menu** to choose the **Effect**: **NoSchedule**, **PreferNoSchedule**, or **NoExecute**. | 
    | **Instance Option** | Choose the pricing method: **On-Demand** instances provide stable and uninterrupted compute capacity - usually at a higher cost. **Spot** instances allow you to bid for unused EC2 capacity at a lower cost. We recommend you base your choice on your application's requirements. | 
    |**Instance Type** | Select the AWS instance type to be used for all nodes in the node pool.|
    |**Enable Nodepool Customization** | <<< Start here >>> AMI ID (optional) toggle. When this option is enabled, AMI ID, Root Disk Size, Disk Type fields are displayed. |
    |**Fargate Profiles** | <<< ??? >>> |

    <<< Check out tables below that separate out options. See how this publishes to determine which format to use. >>>


    |**Size** | Make your choice of minimum, maximum and desired sizes for the worker pool. The size of the worker pool will scale between the minimum and maximum size under varying workload conditions. Review the [AWS Instance Type and Pod Capacity](architecture#formula-for-pod-calculation) documentation for help in determining the proper instance type and size. |
    |[Taints](../../cluster-management/taints.md#taints): |Optionally enable node affinity optionally to attracts pods to a set of nodes| 
    |[Labels](../../cluster-management/taints.md#labels): |Optionally enable labels to constrain a pod to only run on a particular set of nodes|
    
    
  * Cloud Configuration settings:

     |**Parameter**| **Description**|
     |-------------|----------------|
     |**Instance Option**:| Choose between on-demand or spot instances|
     |**Instance Type**:| Choose an instance type |
     |**Availability Zones**:|Select at least one availability zone within the VPC|
     |**Disk Size**|Make the choice of disk size as per requirement|

 *  You can create one or more Fargate profiles for the EKS cluster to use. 
    
    |**Parameter**| **Description**|
    |-------------|---------------|
    |**Name** |Provide a name for the Fargate profile.|
    |**Subnets** |Pods running on Fargate Profiles are not assigned public IP addresses, so only private subnets (with no direct route to an Internet Gateway) are accepted for this parameter. For dynamic provisioning, this input is not required and subnets are automatically selected.|
    |**Selectors** |Define pod selector by providing a target namespace and optionally labels. Pods with matching namespace and app labels are scheduled to run on dynamically provisioned compute nodes.<br /> You can have up to five selectors in a Fargate profile and a pod only needs to match one selector to run using the Fargate profile.|

:::info

You can add new worker pools if you need to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the m3.large instance types for general-purpose workloads, and another worker pool with instance type g2.2xlarge can be configured to run GPU workloads.

:::

12. An optional taint label can be applied to a node pool during the cluster creation. For a an existing cluster, the taint label can be edited, review the [Node Pool](../../cluster-management/node-pool.md) management page to learn more. Toggle the **Taint** button to create a label.


13. Enable or disable node pool taints. If tainting is enabled then you need provide values for the following parameters:
    
    |**Parameter**| **Description**|
    |-------------|---------------|
    |**Key**      |Custom key for the taint.|
    |**Value**    | Custom value for the taint key.|
    | **Effect**  | Make the choice of effect from the drop-down menu. Review the effect table bellow for more details. |
  
    #### Effect Table
    
    |**Parameter**| **Description**|
    |-------------|---------------|
    | **NoSchedule**|  A pod that cannot tolerate the node taint and should not be scheduled to the node. 
    | **PreferNoSchedule**| The system will avoid placing a non-tolerant pod to the tainted node but is not guaranteed.
    | **NoExecute**|  New pods will not be scheduled on the node, and existing pods on the node if any on the node will be evicted they do not tolerate the taint. |

14. Click on **Next**.  
    
15. The settings page is where you can configure patching schedule, security scans, backup settings, setup role based access control (RBAC), and enable [Palette Virtual Clusters](../../../devx/palette-virtual-clusters/palette-virtual-clusters.md). Review the settings and make changes if needed. Click on **Validate**.

16. Review the settings summary and click on **Finish Configuration** to deploy the cluster. Be aware that provisioning an AWS EKS clusters can take several minutes.

The cluster details page of the cluster contains the status and details of the deployment. Use this page to track the deployment progress.


## Validate

You can validate your cluster is up and running by reviewing the cluster details page. Navigate to the left **Main Menu** and click on **Clusters**. The **Clusters** page contains a list of all available clusters managed by Palette. Click on the row for the cluster you wish to review its details page. Ensure the **Cluster Status** field contains the value **Running**.


## EKS Cluster Secrets Encryption

Palette encourages using AWS Key Management Service (KMS) to provide envelope encryption of Kubernetes secrets stored in Amazon Elastic Kubernetes Service (EKS) clusters. This encryption is 
a defense-in-depth security strategy to protect sensitive data such as passwords, docker registry credentials, and TLS keys stored as [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/). 

### Prerequisites

* KMS key created in the AWS account.
* KMS key is of the type symmetric.
* KMS key policy permits the following actions; encrypt and decrypt.

### Configure KMS

The IAM User or IAM role that Palette is using must have the following IAM permissions.

```json hideClipboard
kms:CreateGrant,
kms:ListAliases,
kms:ListKeys,
kms:DescribeKeys
```
Ensure the IAM role or IAM user can perform the required IAM permissions on the KMS key that will be used for EKS.
You can enable secret encryption during the EKS cluster creation process by toggling the encryption button providing the Amazon Resource Name (ARN) of the encryption key. The encryption option is available on the cluster creation wizard's **Cluster Config** page.
