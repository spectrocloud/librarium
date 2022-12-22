---
title: "Create and Manage AWS IaaS Cluster"
metaTitle: "Create and Manage AWS Cluster"
metaDescription: "Learn how to add and manage a cluster deployed to AWS."
hideToC: false
fullWidth: false
category: ["how-to"]
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Create and Manage AWS Iaas Cluster

Palette supports creating and managing Kubernetes clusters deployed to an AWS account. This section guides you on how to create a Kubernetes cluster in AWS that is managed by Palette.

# Prerequisites

The following prerequisites must be met before deploying a cluster to AWS:

- Access to an AWS cloud account 
- Palette integration with AWS account. Review the [Add AWS Account](/clusters/public-cloud/aws/create-gov-accounts) for guidance.
- An infrastructure cluster profile. Review the [Create Cluster Profiles](/cluster-profiles/task-define-profile) for guidance.
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

<!-- `video: title: "aws-cluster-creation": ./cluster-creation-videos/aws.mp4` -->

Use the following steps to provision a new AWS cluster:

1. Ensure you are in the correct project scope.


2. Navigate to the left **Main Menu** and click on **Clusters**


3. Click on **Add New Cluster**


4. You will receive a prompt asking you if you want to deploy a new cluster or import an existing cluster. Click on **Deploy New Cluster**


5. Select **AWS** and click on **Start AWS Configuration**


6. Populate the wizard page with the following informaton: name, description, tagsm and AWS account. Tags on a cluster are propagated to the VMs deployed on the cloud/data center environments. Click on **Next** after you have filled out all the required information.


7. Select a cluster profile. Click on **Next**.


8. Review and customize pack parameters, as desired. By default, parameters for all packs are set with values, defined in the cluster profile.


9. Provide the AWS cloud account and placement information.

    |**Parameter**| **Description**|
    |-------------|---------------|
    |**Cloud Account** | Select the desired cloud account. AWS cloud accounts with AWS credentials need to be preconfigured in project settings.|
    |**Region** | Choose the preferred AWS region where you would like the clusters to be provisioned.|
    |**SSH Key Pair Name** | Choose the desired SSH Key pair. SSH key pairs need to be preconfigured on AWS for the desired regions. The selected key is inserted into the VMs provisioned.|
    |**Static Placement** | By default, Palette uses dynamic placement, wherein a new VPC with a public and private subnet is created to place cluster resources for every cluster. <br /> These resources are fully managed by Palette and deleted, when the corresponding cluster is deleted. Turn on the **Static Placement** option if it's desired to place resources into preexisting VPCs and subnets.<br /> If the user is making the selection of **Static Placement** of resources, the following placement information needs to be provided:
    ||**Virtual Network**: Select the virtual network from dropdown menu.
    ||**Control plane Subnet**: Select the control plane network from the dropdown menu.
    ||**Worker Network**: Select the worker network from the dropdown menu. |
    

10. Make the choice of updating the worker pool in parallel, if required. Click on **Next**.


11. Configure the master and worker node pools. A master and a worker node pool are configured by default. This is the section where you can specify the avaiability zones (AZ), instance types, [instance cost type](/clusters/public-cloud/aws/architecture#spotinstances), disk size, and the number of nodes.

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

16. Review the settings summary and click on **Finish Configuration** to deploy the cluster. Be aware that provisioning IaaS clusters can take serveral minutes.

The cluster details page of the cluster contains the status and details of the deployment. Use this page to track the deploment progress.


# Validate

You can validate your cluster is up and running by reviewing the cluster details page. Navigate to the left **Main Menu** and click on **Clusters**. The **Clusters** page contains a list of all available clusters managed by Palette. Click on the row for the cluster you wish to review its details page. Ensure the **Cluster Status** field contains the value **Running**.




# Deleting an AWS IaaS Cluster

The deletion of an AWS cluster results in the removal of all instances and associated resources created for the cluster. To perform a cluster deletion, use the following steps. 


1. Ensure you are in the correct project scope.


2. Navigate to the left **Main Menu** and click on **Clusters**


3. Click on the cluster that you want to remove.


4. Click on the **Settings** drop-down menu.


5. Click on **Delete Cluster**


6. Type in the name of the cluster and click on **OK**

The cluster status is updated to **Deleting** while cluster resources are being deleted. Once all resources are successfully deleted, the cluster status is updated to **Deleted** and is removed from the list of clusters.

## Force Delete a Cluster

If a cluster is stuck in the **Deletion** state for a minimum of 15 minutes it becomes eligible for force deletion. You can force delete a cluster from the tenant and project admin scope.
To force delete a cluster follow the same steps outlined in [Deleting an AWS IaaS Cluster](#deleting-an-aws-iaas-cluster). However, after 15 minutes, a **Force Delete Cluster** option is available in the **Settings** drop-down menu. The **Settings** drop-down menu will provide you with an estimated time left before the force deletion becomes available..

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