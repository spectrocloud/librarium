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
- Palette integration with AWS account. Review the [Add AWS Account](/clusters/public-cloud/aws/add-aws-accounts) for guidance.
- An infrastructure cluster profile for AWS EKS. Review the [Create Cluster Profiles](/cluster-profiles/task-define-profile) for guidance.
- An [EC2 Key Pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) in the target region.
- Palette creates compute, network, and storage resources in AWS during the provisioning of Kubernetes clusters. Ensure there is sufficient capacity in the preferred AWS region for the creation of the following resources:
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


2. Navigate to the left **Main Menu** and click on **Clusters**


3. Click on **Add New Cluster**


4. You will receive a prompt asking you if you want to deploy a new cluster or import an existing cluster. Click on **Deploy New Cluster**


5. Select **AWS** and click on **Start AWS Configuration**


6. Populate the wizard page with the following information: name, description, tags and AWS account. Tags on a cluster are propagated to the VMs deployed to the target environments. Click on **Next** after you have filled out all the required information.

7. Selected **Managed Kubernetes** and click on your cluster profile that supports AWS EKS. Click on **Next**.


8. Review and customize pack parameters, as desired. By default, parameters for all packs are set with values, defined in the cluster profile. Click on **Next**.


9. Provide the AWS cloud account and placement information.

    |**Parameter**| **Description**|
    |-------------|---------------|
    |**Cloud Account** | Select the desired cloud account. AWS cloud accounts with AWS credentials need to be pre-configured in project settings.|
    |**Static Placement** | By default, Palette uses dynamic placement, wherein a new VPC with a public and private subnet is created to place cluster resources for every cluster. <br /> These resources are fully managed by Palette and deleted, when the corresponding cluster is deleted. Turn on the **Static Placement** option if it's desired to place resources into preexisting VPCs and subnets.|
    |**Region** | Choose the preferred AWS region where you would like the clusters to be provisioned.|
    |**SSH Key Pair Name** | Choose the desired SSH Key pair. SSH key pairs need to be pre-configured on AWS for the desired regions. The selected key is inserted into the VMs provisioned.|
    |**Cluster Endpoint Access**| Select Private, Public or Private & Public, in order to control communication with the Kubernetes API endpoint. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide. :::caution If you set the cluster endpoint to Public, specify `0.0.0.0/0` in the Public Access CIDR field to open it to all possible IP addresses. Otherwise, Palette will not open it up entirely.  :::|
    |**Public Access CIDR** |This setting controls which IP address CIDR range can access the cluster. To fully allow unrestricted network access, enter `0.0.0.0/0` in the field. For more information, refer to the [Amazon EKS cluster endpoint access control](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) reference guide.| 
    |**Enable Encryption**|The user can enable secret encryption by toggling **Enable Encryption**. Provide the provider KMS key ARN to complete the wizard. Review [EKS Cluster Encryption](/clusters/public-cloud/aws/eks/#eksclustersecretsencryption) for more details.|
    |**Worker Pool Update**|Optionally enable the option to update the worker pool in parallel.|
    

10. Make the choice of updating the worker pool in parallel, if required. Click on **Next**.


11. Configure the master and worker node pools. A single master and a worker node pool are configured by default. This is the section where you can specify the availability zones (AZ), instance types, [instance cost type](/clusters/public-cloud/aws/architecture#spotinstances), disk size, and the number of nodes. Use the following tables to better understand the available input options.

    |**Parameter**| **Description**|
    |-------------|----------------|
    |**Name** | A descriptive name for the node pool.|
    |**Size** | Make your choice of minimum, maximum and desired sizes for the worker pool. The size of the worker pool will scale between the minimum and maximum size under varying workload conditions. Review the [AWS Instance Type and Pod Capacity](/clusters/public-cloud/aws/architecture#awsinstancetypeandpodcapacity) documentation for help in determining the proper instance type and size. |
    |[Taints](/clusters/cluster-management/taints#overviewontaints): |Optionally enable node affinity optionally to attracts pods to a set of nodes| 
    |[Labels](/clusters/cluster-management/taints#overviewonlabels): |Optionally enable labels to constrain a pod to only run on a particular set of nodes|
    |**Instance Type** | Select the AWS instance type to be used for all nodes in the node pool.|
    
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

12. An optional taint label can be applied to a node pool during the cluster creation. For a an existing cluster, the taint label can be edited, review the [Node Pool](/clusters/cluster-management/node-pool) management page to learn more. Toggle the **Taint** button to create a label.


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
    
15. The settings page is where you can configure patching schedule, security scans, backup settings, setup role based access control (RBAC), and enable [Palette Virtual Clusters](/devx/palette-virtual-clusters). Review the settings and make changes if needed. Click on **Validate**.

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
