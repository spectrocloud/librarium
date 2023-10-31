---
sidebar_label: "Create and Manage AWS EKS Cluster"
title: "Create and Manage AWS EKS Cluster"
description: "Learn how to deploy and manage AWS EKS clusters with Palette."
hide_table_of_contents: false
tags: ["public cloud", "aws"]
sidebar_position: 30
---


Palette supports creating and managing AWS Elastic Kubernetes Service (EKS) clusters deployed to an AWS account. This section guides you on how to create an AWS EKS cluster in AWS that is managed by Palette.

## Prerequisites

- Access to an AWS cloud account. 
- Palette integration with AWS account. Review [Add AWS Account](add-aws-accounts.md) for guidance.
- An infrastructure cluster profile for AWS EKS. Review [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md) for guidance.
- An [EC2 Key Pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) for the target region.
- Palette creates compute, network, and storage resources in AWS when it provisions Kubernetes clusters. Ensure there is sufficient capacity in the preferred AWS region to create the following resources:
    - Virtual CPU (vCPU)
    - Virtual Private Cloud (VPC)
    - Elastic IP
    - Internet Gateway
    - Elastic Load Balancers
    - Network Address Translation (NAT) Gateway


:::info

The following tags should be added to the virtual private network (VPC) public subnets to enable automatic subnet discovery for integration with AWS load balancer service. Replace the value `yourClusterName` with your cluster's name.
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

6. Fill out the following basic information, and click on **Next Step** to continue.

  | **Field** | **Description** |
  |-----------|-----------------|
  | **Cluster Name**| A custom name for the cluster. |
  | **Description**| Use the description to provide context about the cluster.|
  | **Tags**| Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `zone` or `region`.|
  | **Cloud Account** | If you already added your AWS account in Palette, select it from the **drop-down Menu**. Otherwise, click on **Add New Account** and add your AWS account information.  |

  If you already have an AWS account, skip to the [Create an EKS Cluster](#create-an-eks-cluster) section. To add a cloud account, continue to the [Add Cloud Account](#add-aws-cloud-account) section.

### Add Cloud Account

Follow the steps below if you have not previously added your AWS cloud account in Palette.

1. At the Basic Information step in the wizard, click on the **drop-down Menu** in the **Cloud Account** field and click **Add New Account**.

2. On the form that displays, provide your AWS account name and an optional description to provide context about the account.

3. In the **Partition** field, select **AWS** from the **drop-down Menu**.

Creating the account is different depending on the authentication type you choose. Select the tab below that applies to the authentication method you will use to configure your AWS account.

<!-- If you use **Credentials**, provide these in the **Access Key** and **Secret access key** fields. To use Security Token Service, review the guidance in the right panel that displays when you select **STS**.  -->
  
<Tabs groupId="authentication">

<TabItem label="Credentials" value="Credentials">

4. Specify the account name. 

5. Add an optional description to give the account some context.

6. In the **Partition** field, select **AWS** in the **drop-down Menu**.

7. From your AWS console, copy the access key and secret key.

8. In Palette, paste the keys in the **Access key** and **Secret access key** fields.

9. Click the **Validate button**.  If the credentials you provided are correct, a *Credentials validated* success message with a green check is displayed.

10. To use a Private Cloud Gateway (PCG) that you installed, toggle the **Connect Private Cloud Gateway** button and select the PCG from the **drop-down Menu**.

11. When you have completed inputting values and credentials are validated, click **Confirm**.

</TabItem>

<TabItem label="STS" value="STS">


4. Specify the account name.

5. Add an optional description to give the account some context.

6. In the **Partition** field, select **AWS** in the **drop-down Menu**.

7. If you have not already created the following IAM policies with the permissions listed in the table, go ahead and create them.

  | **Policy** | **Permission** |
  |-----------|-----------------|
  | `PaletteControllerPolicy`| Controller Policy |
  | `PaletteControlPlanePolicy`| Control Plane Policy|
  | `PaletteNodesPolicy`| Nodes Policy|
  | `PaletteDeploymentPolicy` | Deployment Policy |

8. Create an IAM Role that uses the following rules and options.

  | **Rule** | **Option** |
  |-----------|-----------------|
  | **Trusted Entity Type**| Controller Policy |
  | **Account ID** | In Palette, copy this from the right panel that displays when you select **STS**.|
  | **Require External ID** | **Enable**|
  | **External ID** | In Palette, copy this from the right panel that displays when you select **STS**. |
  | **Permissions Policy** | Search and select the four policies you added in step 12. |
  | **Role Name** | Provide `SpectroCloudRole` as the role name. |

9. In the AWS Console, browse to the role details page and copy the Role ARN and paste it in the **ARN** field in Palette. 

10. Click the **Validate** button. If the ARN you provided is correct, a Credentials validated success message with a green check is displayed.

11. To use a Private Cloud Gateway (PCG) that you installed, toggle the **Connect Private Cloud Gateway** button and select the PCG from the **drop-down Menu**.

12. When you have completed inputting values and credentials are validated, click **Confirm**.

</TabItem>
</Tabs>

### Create an EKS Cluster

Use the following steps to provision a new EKS cluster.

1. Select **EKS** as the **Managed Kubernetes**. 

2. Select the EKS cluster profile you created and click on **Next**.

3. Review the profile layers and customize parameters as desired in the YAML files that display when you select a layer. 

4. To configure OIDC, select the Kubernetes layer and edit the Kubernetes YAML file.


Click on **Next** when you are done.

5. Provide the following cluster configuration information and click on **Next** to continue. 

  |**Parameter**| **Description**|
  |-------------|---------------|
  |**Static Placement** | By default, Palette uses dynamic placement. This creates a new Virtual Private Cloud (VPC) in which resources for each cluster will be placed. Palette manages these resources and deletes them when the corresponding cluster is deleted. <br /><br /> Enable the **Static Placement** option if you want to place resources into pre-existing VPCs and subnets. You will need to provide the VPCID.|
  |**Region** | Use the **drop-down Menu** to choose the AWS region where you would like to provision the cluster.|
  |**SSH Key Pair Name** | Choose the SSH key pair for the region you selected. SSH key pairs must be pre-configured in your AWS environment. This is called an EC2 Key Pair in AWS. The key you select is inserted into the provisioned VMs.|
  |**Cluster Endpoint Access**| This setting provides access to the Kubernetes API endpoint. Select **Private**, **Public** or **Private & Public**. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.|
  |**Public Access CIDRs** |This setting controls which IP address CIDR range can access the cluster. To fully allow unrestricted network access, enter `0.0.0.0/0` in the field. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.|
  |**Private Access CIDRs** |This setting controls which IP address CIDR range can access the cluster. To restrict network access, enter the IP address CIDR range that will provide access to the cluster. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.|
  |**Enable Encryption**| To enable secret encryption, toggle the **Enable Encryption** option and use the **drop-down Menu** to the select the AWS Key Managment Service (KMS) key **ARN**. Review [EKS Cluster Encryption](#eks-cluster-secrets-encryption) for more details.|
  |**Update worker pools in parallel**| This option allows the simultaneous update of nodes in the worker pool. This is an efficient way to manage various types of workloads. | 

  :::caution

  If you set the cluster endpoint to Public, ensure you specify `0.0.0.0/0` in the Public Access CIDR field to open it to all possible IP addresses. Otherwise, Palette will not open it up entirely. We recommend specifying the **Private & Public** option to cover all the possibilities.

  :::

6. Provide the following node pool and cloud configuration information. Click on **Next** to continue.  

<!-- Configure the worker node pool and provide cloud configuration information. Palette configures a single worker node pool by default.  [instance cost type](architecture#spot-instances) Use the following table to better understand the available input options. Click **Next** to continue. -->

  |**Parameter**| **Description**|
  |-------------|----------------|
  |**Node pool name** | A descriptive name for the node pool.|
  |**Number of nodes in the pool** | Specify the number of nodes in the worker pool.|
  |**Additional Labels** | Optionally, you can add labels to nodes in key-value format. For more information about applying labels, review [Apply Labels to Nodes](../../cluster-management/taints.md/#apply-labels-to-nodes).  Example: `"environment": "production"` |
  |**Taints** | You can apply optional taint labels to a node pool during the cluster creation or edit taint labels on an existing cluster. Review the [Node Pool](../../cluster-management/node-pool.md) management page to learn more. Toggle the **Taint** button to create a label. If tainting is enabled, you need to provide a custom key-value pair and use the **drop-down Menu** to choose **Effect**:<br />**NoSchedule**: Pods are not scheduled onto nodes with this taint.<br />**PreferNoSchedule**: Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited.<br />**NoExecute**: Existing pods on nodes with this taint are evicted.  | 
  | **Instance Option** | Choose the pricing method:<br />**On-Demand** instances provide stable and uninterrupted compute capacity at a higher cost.<br />**Spot** instances allow you to bid for unused EC2 capacity at a lower cost. We recommend you base your choice on your application's requirements. | 
  |**Instance Type** | Select the instance type to use for all nodes in the node pool.|
  |**Enable Nodepool Customization** | Toggle this option on to use a pre-configured VM image and provide the Amazon Machine Image (AMI) ID. When this option is enabled, you can use the **drop-down Menu** to specify the disk type to use. |
  |**Root Disk size** | By default, the **Root Disk size** is `60`, which you can change. |
  |**Fargate Profiles** | An AWS feature that allows you to run containers without the need for EC2 instances. With Fargate, you do not provision or manage the cloud infrastructure. |

<<< Ask eng. about Fargate Profiles that displays in the Node pools configuration for EKS. There are no options - it should be removed because it causes confusion. >>>

:::info

You can add new worker pools if you need to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the m3.large instance types for general-purpose workloads, and another worker pool with instance type g2.2xlarge can be configured to run GPU workloads.

:::

7. Specify your preferred **OS Patching Schedule** for EKS-managed machines.

8. Enable any scan options you want Palette to perform, and select a scan schedule. Palette provides support for Kubernetes configuration security, penetration testing, and conformance testing.

9. Schedule any backups you want Palette to perform. Review [Backup and Restore](../../cluster-management/backup-restore/backup-restore.md) for more information.

10. RBAC configuration is required for OIDC.

11. Click on the **Validate** button and review the cluster configuration. 

12. Review the settings summary and click **Finish Configuration** to deploy the cluster. 

  The cluster details page of the cluster contains the status and details of the deployment. Use this page to track the deployment progress.

:::info

Provisioning an AWS EKS clusters can take several minutes.

:::
  
    
<!-- 5. Configure optional cluster settings for an OS patching schedule, security scans, backup settings, and set up role based access control (RBAC), 

 Review the settings and make changes if needed. Click on **Validate**.

16. Review the settings summary and click on **Finish Configuration** to deploy the cluster. Be aware that provisioning an AWS EKS clusters can take several minutes.

The cluster details page of the cluster contains the status and details of the deployment. Use this page to track the deployment progress. -->


## Validate

You can validate your cluster is up and running.

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Navigate to the left **Main Menu** and select **Clusters**. The **Clusters** page displays a list of all available clusters managed by Palette. 

3. Click on the cluster you created to view its details page.

4. Ensure the **Cluster Status** field contains the value **Running**.


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

You can enable secret encryption during the EKS cluster creation process by toggling the encryption button providing the Amazon Resource Name (ARN) of the encryption key. The encryption option is available on the cluster creation wizard's **Cluster Config** page.

## Resources

- [Add AWS Account](add-aws-accounts.md)

- [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)

- [EC2 Key Pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html)  

- [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html)

- [EKS Cluster Encryption](#eks-cluster-secrets-encryption)

- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)