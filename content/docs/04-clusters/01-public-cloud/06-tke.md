---
title: "Tencent-TKE"
metaTitle: "Creating TKE clusters in Palette"
metaDescription: "The methods of creating clusters for a speedy deployment on Tencent-TKE"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';



# Overview

Palette supports the deployment of tenant workloads with Tencent Kubernetes Engine (TKE). The following are the detailing of the Tencent TKE cluster provisioning through Palette:

1. Palette enables the effortless deployment and management of containerized applications with fully managed TKE.


2. TKE is fully compatible with the native Kubernetes APIs and extends Kubernetes plugins such as CBS and CLB on the Tencent Cloud.


3. The Palette-supported TKE architecture is represented diagrammatically as below:

![tencent-diagram.png](tencent-diagram.png)

# Prerequisites

1. A Tencent Cloud account with appropriate [permissions](/clusters/public-cloud/tke#permissionsfortkeclustercrudoperations).


2. Create a Cloud API **Secret ID** and **Secret Key**.


3. Create the **Virtual Private Network** and **Subnet** to the region where the workload cluster needs to be deployed.


4. The [**NAT Gateway**](https://intl.cloud.tencent.com/document/product/457/38369) is to be created to support IP address translation and to enable Internet access to resources in Tencent Cloud. 


5. A Route table set to accept external traffic, so that the nodes getting created in the associated subnets will have internet capability.


# Tencent Cloud Account Permissions 

**Last Update**: April 26, 2022

```yaml
{
    "version": "2.0",
    "statement": [
        {
            "effect": "allow",
            "action": [
                "as:CreateLaunchConfiguration",
                "as:CreateAutoScalingGroup",
                "as:DescribeLaunchConfigurations",
                "as:DescribeAutoScalingInstances",
                "as:DescribeAutoScalingActivities",
                "as:DescribeAutoScalingGroups",
                "as:ModifyDesiredCapacity",
                "as:ModifyAutoScalingGroup",
                "as:DescribeAutoScalingGroups",
                "as:DescribeAutoScalingGroupLastActivities",
                "cam:GetRole",
                "cam:GetPolicy",
                "cam:DeletePolicyVersion",
                "cam:CreatePolicyVersion",
                "cam:ListGroupsForConsole",
                "cam:ListPolicies",
                "cam:ListMaskedSubAccounts",
                "cvm:DescribeSecurityGroupLimits",
                "cvm:DescribeSecurityGroups",
                "cvm:CreateSecurityGroup",
                "cvm:DescribeInstances",
                "cvm:DescribeInstancesStatus",
                "cvm:DescribeSecurityGroupAssociateInstances",
                "cvm:DescribeSecurityGroupLimits",
                "cvm:DescribeSecurityGroupPolicys",
                "cvm:DescribeImages",
                "cvm:DescribeCbsStorages",
                "cvm:RunInstances",
                "cvm:DescribeKeyPairs",
                "cvm:DescribeAddresses",
                "cvm:ModifySingleSecurityGroupPolicy",
                "cvm:CreateSecurityGroupPolicy",
                "cvm:DeleteSecurityGroupPolicy",
                "clb:DescribeLoadBalancers",
                "cloudaudit:DescribeEvents",
                "cloudaudit:DescribeEvents",
                "ecdn:PurgePathCache",
                "ecdn:PurgeUrlsCache",
                "ecdn:PushUrlsCache",
                "monitor:DescribeDashboardMetricData",
                "tke:CreateCluster",
                "tke:DescribeClusters",
                "tke:DescribeClusterEndpointStatus",
                "tke:DescribeClusterEndpointVipStatus",
                "tke:DescribeClusterSecurity",
                "tke:CreateClusterEndpointVip",
                "tke:CreateClusterEndpoint",
                "tke:DeleteClusterEndpointVip",
                "tke:DeleteClusterEndpoint",
                "tke:DeleteCluster",
                "tke:DescribeClusterAsGroupOption",
                "tke:DescribeClusterInstances",
                "tag:DescribeResourceTagsByResourceIds",
                "tag:DescribeTagValues",
                "tag:TagResources",
                "tag:DescribeTagKeys",
                "vpc:DescribeSubnetEx",
                "vpc:DescribeVpcEx",
                "vpc:DescribeVpcLimits",
                "vpc:DescribeRouteTable",
                "vpc:DescribeNatGateways",
                "vpc:DescribeCcns",
                "vpc:DescribeCcnAttachedInstances",
                "vpc:DescribeLocalGateway",
                "vpc:DescribeHaVips",
                "vpc:DescribeVpnGw",
                "vpc:DescribeDirectConnectGateways",
                "vpc:DescribeVpcPeeringConnections",
                "vpc:DescribeCustomerGateways",
                "vpc:DescribeRoutes",
                "vpc:ModifyNatGatewayAttribute",
                "vpc:ResetNatGatewayConnection",
                "vpc:DescribeAddress",
                "vpc:DescribeTemplateLimits",
                "vpc:DescribeAddressGroups",
                "vpc:DescribeService",
                "vpc:DescribeServiceGroups",
                "vpc:DescribeNetworkAcls",
                "vpc:DescribeNetworkInterfaces"
            ],
            "resource": [
                "*"
            ]
        }
    ]
}
```


# Creating a Tencent Cloud Account

A Tencent Cloud account needs to be created for the Palette Console from the Tenant Admin or Project Admin scope. To create the Cloud Account:
1. Log in to the Palette Management Console and from the **Project**/**Tenant Admin Settings**, select the **Cloud Accounts** tab.


2. Click **+ Tencent Account** to open the Cloud Account Creation wizard and fill in the following details:

    |**Parameter** | **Description**|
    |-----------------|----------------|
    | **Account Name**| A custom name to identify the cloud account on the Palette Console.|
    | **Optional Description**| Add a description, if any about the cloud account.
    | **Secret ID**| The Secret ID of the Tencent cloud account.
    | **Secret Key**| The secret key of the Tencent cloud account.|
    

3. Validate and confirm the given information to complete the wizard. 


**Note**: The Cloud Account can be created during the first step of cluster creation, when you fill in the basic information by clicking the **+** next to **Cloud Account**. 

# Deploying a Tencent Cluster

The following steps need to be performed to provision a new TKS cluster:
1. Provide the basic cluster information like Name, Description, and Tags. Tags on a cluster are propagated to the VMs deployed on the cloud/data center environments.


2. Select the Cluster Profile, created for Tencent Cloud. The profile definition will be used as the Cluster Deployment Template.


3. Review and override Pack parameters as desired. By default, parameters for all Packs are set with values defined in the Cluster Profile.

<InfoBox>

While configuring the Operating System layer of the TKE cluster profile, configure the value of the OS pack file with any one of the following images:

```yaml
"OsName": "centos7.6.0_x64"
```
```yaml
"OsName": "centos7.6.0_x64 GPU"
```
```yaml
"OsName": "ubuntu18.04.1x86_64"
```
```yaml
"OsName": "ubuntu18.04.1x86_64 GPU"
```

</InfoBox>

<WarningBox>

While adding Add-on packs to the Cluster Profile, make sure that Persistent Volume Claim size is >=10 GB and also are in multiples of 10 (10,20,30 …).

Example:

```yaml
## Enable persistence using Persistent Volume Claims
     ## ref: http://kubernetes.io/docs/user-guide/persistent-volumes/
     ##
     master:
       persistence:
         enabled: true
         ## mariadb data Persistent Volume Storage Class
         ## If defined, storageClassName: <storageClass>
         ## If set to "-", storageClassName: "", which disables dynamic provisioning
         ## If undefined (the default) or set to null, no storageClassName spec is
         ##   set, choosing the default provisioner.  (gp2 on AWS, standard on
         ##   GKE, AWS & OpenStack)
         ##
         # storageClass: "-"
         accessModes:
           - ReadWriteOnce
         size: 20Gi
```

</WarningBox>

4. Provide the Tencent Cloud account and placement information:

    |**Parameter** | **Description**|
    |--------------|----------------|
    |  **Cloud Account**| Select the desired cloud account. 
    | **Tencent Cloud Accounts** | The Tencent credentials need to be pre-configured in the **Project**/**Tenant Admin** settings.
    ||**Note**: The cloud account can be created during this step of<br /> cluster creation by clicking **+** next to the **Cloud Account**. |
    | **Region** | Choose the desired Tencent region where you <br /> would like the clusters to be provisioned.
    | **SSH Key Pair Name**| Choose the desired SSH Keypair. SSH key pairs <br />need to be preconfigured on TKS for the<br /> desired regions. The selected key is inserted into the VMs provisioned.
    | **VPCID**|
    | **Cluster endpoint access** | Private <br />  Public <br /> Private & Public|
    
<InfoBox>
Palette encourages its uses to go with the Public Cluster endpoint access as of now. Other options will be supported in the near future.
</InfoBox>

5. Public Access CIDRs - To enable access restrictions for the users.


6. Update Worker Pools in parallel - Patch updates to all Worker Pools simultaneously.


7. Configure one or more worker node pools. A single worker node will be configured by default. To learn more about the configuration options, review the [Node Pool](/clusters/cluster-management/node-pool) documentation page. Click on **Next** when you are done with node pool configurations.
    

8. Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

# Deleting a Tencent Cluster

The deletion of a Tencent cluster results in the removal of all Virtual Machines and associated Storage Disks created for the cluster. The following tasks need to be performed to delete a Tencent cluster:

1. Select the cluster to be deleted from the **Cluster View** page and navigate to the **Cluster Overview** page.


2. Invoke a delete action available on the page: **Cluster** > **Settings** > **Cluster** **Settings** > **Delete** **Cluster**.


3. Confirm the delete operation, by typing in the cluster name. 
    * The **Cluster Status** is updated to **Deleting** while cluster resources are deleted. 
    * The **Provisioning Status** is updated with the **Ongoing progress** of the delete operation. 
    * Once all resources are successfully deleted, the cluster status changes to **Deleted** and is removed from the list of clusters.


# Forcing a Cluster Deletion

A cluster stuck in the **Deletion** state can be force deleted by the user through the User Interface. The user can go for a force deletion of the cluster, only if it is stuck in a deletion state for a minimum of **15 minutes**. Palette enables cluster force delete from the Tenant Admin and Project Admin scope. 

## To force delete a cluster:

1. Log in to the Palette Management Console.


2. Navigate to the **Cluster Details** page of the cluster stuck in deletion.

      - If the deletion is stuck for more than 15 minutes, click the **Force Delete Cluster** button from the **Settings** dropdown. 
    
      - If the **Force Delete Cluster** button is not enabled, wait for 15 minutes. The **Settings** dropdown will give the estimated time for the auto-enabling of the **Force Delete** button.


<WarningBox>
If there are any cloud resources still on the cloud, the user should clean up those resources before doing the force deletion. 
</WarningBox>




