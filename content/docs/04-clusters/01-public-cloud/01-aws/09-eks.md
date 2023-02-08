---
title: "Create and Manage AWS EKS Cluster"
metaTitle: "Creating new AWS EKS clusters on Palette"
metaDescription: "Learn how to deploy and manage AWS EKS clusters with Palette"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';



# Create and Manage AWS EKS Cluster

Palette supports creating and managing AWS Elastic Kubernetes Service (EKS) clusters deployed to an AWS account. This section guides you on how to create an AWS EKS cluster in AWS that is managed by Palette.

# Prerequisites

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


<InfoBox>


The following tags should be added to the virtual private network (VPC) public subnets to enable automatic subnet discovery for integration with AWS load balancer service. Replace the value `yourClusterName` with your cluster's name.

<br />

- `kubernetes.io/role/elb = 1`
- `sigs.k8s.io/cluster-api-provider-aws/role = public`
- `kubernetes.io/cluster/[yourClusterName] = shared` 
- `sigs.k8s.io/cluster-api-provider-aws/cluster/[yourClusterName] = owned`

</InfoBox>

# Deploying an AWS Cluster

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
    |**Cluster Endpoint Access**:| Select Private or Public or Private & Public, based on how the customer want to establish the communication with the endpoint for the managed Kubernetes API server and your cluster. 
    |**Public Access CIDR**: |For Public or Private & Public end point access, give the CIDR values.| 
    |**Enable Encryption**|The user can enable secret encryption by toggling **Enable Encryption**. Provide the provider KMS key ARN to complete the wizard. Review [EKS Cluster Encryption](#eks-cluster-secrets-encryption) for more details.|
    |**Worker Pool Update**|Optionally enable the option to update the worker pool in parallel.|
    

10. Make the choice of updating the worker pool in parallel, if required. Click on **Next**.


11. Configure the master and worker node pools. A single master and a worker node pool are configured by default. This is the section where you can specify the availability zones (AZ), instance types, [instance cost type](/clusters/public-cloud/aws/architecture#spotinstances), disk size, and the number of nodes. Use the following tables to better understand the available input options.

    |**Parameter**| **Description**|
    |-------------|----------------|
    |**Name** | A descriptive name for the node pool.|
    |**Size** | Make your choice of minimum, maximum and desired sizes for the worker pool. The size of the worker pool will scale between the minimum and maximum size under varying workload conditions. Review the [AWS Instance Type and Pod Capacity](/clusters/public-cloud/aws/architecture#awsinstancetypeandpodcapacity) documentation for help in determining the proper instance type and size. |
    |[Taints](/clusters/cluster-management/taints#overviewontaints): |Optionally enable node affinity optionally to attracts pods to a set of nodes| 
    |[Labels](/clusters/cluster-management/taints#overviewonlabels): |Optionally enable labels to constrain a pod to only run on a particular set of nodes|
    |**Instance Type** | Select the AWS [instance type](/clusters/public-cloud/eks/#awsinstancetypewithpodcapacity) to be used for all nodes in the node pool.|
    
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

<InfoBox>

You can add new worker pools if you need to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the m3.large instance types for general-purpose workloads, and another worker pool with instance type g2.2xlarge can be configured to run GPU workloads.

</InfoBox>

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


# Validate

You can validate your cluster is up and running by reviewing the cluster details page. Navigate to the left **Main Menu** and click on **Clusters**. The **Clusters** page contains a list of all available clusters managed by Palette. Click on the row for the cluster you wish to review its details page. Ensure the **Cluster Status** field contains the value **Running**.




<!-- # Deploying an EKS Cluster

`video: title: "eks-cluster-creation": ./cluster-creation-videos/eks.mp4`

The following steps need to be performed to provision a new EKS cluster:

1. Provide the basic cluster information like Name, Description, and Tags. Tags on a cluster are propagated to the VMs deployed on the cloud/data center environments.


2. Select the Cluster Profile created for the EKS cloud. The profile definition will be used as the cluster construction template.


3. Review and override pack parameters, as desired. By default, parameters for all packs are set with values defined in the cluster profile.


4. Provide the AWS Cloud account and configure the cluster.


   


5. Configure the Node Pools.

   * Configure one or more worker node pools. A single worker node will be configured by default.

    |**Parameter**| **Description**|
    |-------------|----------------|
    |**Name** | A descriptive name for the node pool.|
    |**Size** | Make your choice of minimum, maximum and desired sizes for the worker pool. The size of the worker pool will scale between the minimum and maximum size under varying workload conditions.|
    |[Taints](/clusters/cluster-management/taints#overviewontaints): |Optionally enable node affinity optionally to attracts pods to a set of nodes| 
    |[Labels](/clusters/cluster-management/taints#overviewonlabels): |Optionally enable Labels to constrain a Pod to only run on a particular set of Node(s)|
    |**Instance Type** | Select the AWS [instance type](/clusters/public-cloud/eks/#awsinstancetypewithpodcapacity) to be used for all nodes in the node pool.|
  * Cloud Configuration settings:

     |**Parameter**| **Description**|
     |-------------|----------------|
     |**Instance Option**:| Chose between on-demand or spot instances|
     |**Instance Type**:|Make the selection of the instance type|
     |**Availability Zones**:|Select at least one availability zone within the VPC|
     |**Disk Size**|Make the choice of disk size as per requirement|
 *  Optionally, create one or more Fargate Profile(s) to aid the provisioning of on-demand, optimized compute capacity for the workload clusters.
    
    |**Parameter**| **Description**|
    |-------------|---------------|
    |**Name** |Provide a name for the Fargate profile.|
    |**Subnets** |Pods running on Fargate Profiles are not assigned public IP addresses, so only private subnets (with no direct route to an Internet Gateway) are accepted for this parameter. For dynamic provisioning, this input is not required and subnets are automatically selected.|
    |**Selectors** |Define pod selector by providing a target namespace and optionally labels. Pods with matching namespace and app labels are scheduled to run on dynamically provisioned compute nodes.<br /> You can have up to five selectors in a Fargate profile and a pod only needs to match one selector to run using the Fargate profile.|

6. Configure the [Cluster Management](/clusters/cluster-management#manageclusters) options as per user requirements.


7. Review the settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if it is desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the <i>m3.large</i> instance types for general-purpose workloads, and another worker pool with instance type <i>g2.2xlarge</i> can be configured to run GPU workloads.
</InfoBox> -->

# EKS Cluster Secrets Encryption

Palette encourages using AWS Key Management Service (KMS) to provide envelope encryption of Kubernetes secrets stored in Amazon Elastic Kubernetes Service (EKS) clusters. This encryption is 
a defense-in-depth security strategy to protect the sensitive data  such as passwords, docker registry credentials, and TLS keys stored as [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/). 

## Prerequisites

* KMS key created in the AWS account.
* KMS key is of the type symmetric.
* KMS key policy permits the following actions; encrypt and decrypt.

## Configure KMS:

The IAM User or IAM role that Palette is using must have the following IAM permissions.

```json
kms:CreateGrant
```
Ensure the IAM role or IAM user can perform the required IAM permissions on the KMS key that will be used for EKS.
You can enable secret encryption during the EKS cluster creation process by toggling the encryption button providing the amazon resource name (ARN) of the encryption key. The encryption option is available on the **Cluster Config** page of the cluster creation wizard.


# Deleting an EKS Cluster

The deletion of an EKS cluster results in the removal of all instances and associated resources created for the cluster. To perform a cluster deletion, use the following steps. 


1. Ensure you are in the correct project scope.


2. Navigate to the left **Main Menu** and click on **Clusters**


3. Click on the cluster that you want to remove.


4. Click on the **Settings** drop-down menu.


5. Click on **Delete Cluster**


6. Type in the name of the cluster and click on **OK**

The cluster status is updated to **Deleting** while cluster resources are being deleted. Once all resources are successfully deleted, the cluster status is updated to **Deleted** and is removed from the list of clusters.

## Force Delete a Cluster

If a cluster is stuck in the **Deletion** state for a minimum of 15 minutes it becomes eligible for force deletion. You can force delete a cluster from the tenant and project admin scope.
To force delete a cluster follow the same steps outlined in [Deleting an EKS Cluster](#deleting-an-eks-cluster). However, after 15 minutes, a **Force Delete Cluster** option is available in the **Settings** drop-down menu. The **Settings** drop-down menu will provide you with an estimated time left before the force deletion becomes available..

<br />

<WarningBox>
 

A force delete can result in resources Palette provisioned to be missed in the removal process. Verify there are no remaining Palette provisioned resources such as:

- VPC
- Elastic IP
- Elastic Network Interfaces
- Internet Gateway
- Elastic Load Balancers
- EBS Volumes
- NAT Gateway

Failure in removing provisioned resources can result in unexpected costs.   

</WarningBox>

# Next Steps

Now that you have a Kubernetes cluster deployed, you can start developing and deploying applications to your clusters. We recommend you review the day two responsibilities and become familiar with the cluster management tasks. Check out the [Manage Clusters](/clusters/cluster-management) documentation to learn more about day two responsibilities. 