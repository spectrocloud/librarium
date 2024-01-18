---
sidebar_label: "Tencent TKE"
title: "Tencent TKE"
description: "The methods of creating clusters for a speedy deployment on Tencent-TKE"
hide_table_of_contents: false
tags: ["public cloud", "tencent", "tke"]
sidebar_position: 40
---


Palette supports the deployment of tenant workloads with Tencent Kubernetes Engine (TKE). The following are the detailing of the Tencent TKE cluster provisioning through Palette:

1. Palette enables the effortless deployment and management of containerized applications with fully managed TKE.


2. TKE is fully compatible with the native Kubernetes APIs and extends Kubernetes plugins such as CBS and CLB on the Tencent Cloud.


3. The Palette-supported TKE architecture is represented diagrammatically as below:

    ![tencent-diagram.png](/tencent-diagram.png)

## Prerequisites

* A Tencent Cloud account with appropriate [permissions](#tencent-cloud-account-permissions).


* Create a Cloud API **Secret ID** and **Secret Key**.


* Create the **Virtual Private Network** and **Subnet** to the region where the workload cluster needs to be deployed.


* The [**NAT Gateway**](https://intl.cloud.tencent.com/document/product/457/38369) is to be created to support IP address translation and to enable Internet access to resources in Tencent Cloud.


* A Route table set to accept external traffic, so that the nodes getting created in the associated subnets will have internet capability.


* Create a security group for network security isolation and add Inbound traffic rule that allows the TCP/HTTPS protocol for port 443 from all IPv6 and IPv4 sources through this security group.


## Tencent Cloud Account Permissions

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


## Create a Tencent Cloud Account

Create a Tencent Cloud account in Palette from the Tenant Admin or Project Admin scope. To create the cloud account:

1. Log in to the Palette and from the **Tenant Admin Settings**, select the **Cloud Accounts** tab.


2. Click **+ Tencent Account** to open the cloud account creation wizard and fill in the following details:

    |**Parameter** | **Description**|
    |-----------------|----------------|
    | **Account Name**| A custom name to identify the cloud account on the Palette Console.|
    | **Optional Description**| Add a description, if any about the cloud account.
    | **Secret ID**| The Secret ID of the Tencent cloud account.
    | **Secret Key**| The secret key of the Tencent cloud account.|


3. Click the **Validate** button to validate credentials.


4. Click **Confirm** button to complete the cloud account create wizard.


**Note**: The cloud account can be created during the first step of cluster creation when you fill in the basic information by clicking the **+** next to **Cloud Account**.

## Deploy a Tencent Cluster

The following steps need to be performed to provision a new TKS cluster:

1. Provide the basic cluster information such as:
   * **Name**, **Description**, and **Tags**. Tags on a cluster are propagated to the VMs deployed on the cloud or data center environments.
   * Select the desired [Tencent cloud account](#create-a-tencent-cloud-account). The Tencent credentials must be pre-configured in the Project/Tenant Admin settings.


  **Note**: The cloud account can be created during the cluster creation by clicking **+** next to the **Cloud Account**.
<br />

2. Select the cluster profile created for Tencent Cloud. The profile definition will be used as the cluster deployment template.


3. Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile. While configuring the Operating System layer of the TKE cluster profile, configure the value of the OS pack file with any one of the following images:

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

    :::warning

    While adding Add-on packs to the Cluster Profile, make sure that Persistent Volume Claim size is >=10 GB and in multiples of 10.

    Example:

    ```yaml
    master:
    persistence:
        enabled: true
        accessModes:
        - ReadWriteOnce
        size: 20Gi
    ```

    :::

4. Provide the Tencent Cloud account and placement information:

    |**Parameter** | **Description**|
    |--------------|----------------|
    |  **Cloud Account**| Select the desired cloud account.
    | **Tencent Cloud Accounts** | The Tencent credentials need to be pre-configured in the **Project**/**Tenant Admin** settings.
    ||**Note**: The cloud account can be created during this step of<br /> cluster creation by clicking **+** next to the **Cloud Account**. |
    | **Region** | Choose the desired Tencent region where you <br /> would like the clusters to be provisioned.
    | **SSH Key Pair Name**| Choose the desired SSH keypair. You must preconfigure SSH key pairs on TKS for the desired regions. The selected key is inserted into the provisioned VMs.
    | **VPCID**|The ID of the Virtual Private Cloud (VPC) that the stack is to be launched into. The VPC must be in the specified region. All cluster instances will be launched into this VPC. |
    |**Cluster Endpoint Access**| Select Public, or Private & Public, based on how you want to establish the communication with the endpoint for the managed Kubernetes API server and your cluster.|
    |**Public Security Group**|A security group to controls the traffic that is allowed to reach and leave the resources that it is associated with. For example, after you associate a security group with the cluster, it controls the inbound and outbound traffic to the cluster. |

    :::info
    Palette encourages its uses to go with the Public Cluster endpoint access as of now. Other options will be supported in the near future.
    :::

5. Public Access CIDRs - To enable access restrictions.


6. Update Worker Pools in parallel - Patch updates to all Worker Pools simultaneously.


7. Configure one or more worker node pools. A single worker node will be configured by default. To learn more about the configuration options, review the [Node Pool](../cluster-management/node-pool.md) documentation page. Click on **Next** when you are done with node pool configurations.


8. Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

# Delete a Tencent Cluster

The deletion of a Tencent cluster results in the removal of all Virtual Machines and associated Storage Disks created for the cluster. The following tasks need to be performed to delete a Tencent cluster:

1. Ensure you are in the correct project scope.


2. Navigate to the left **Main Menu** and click on **Clusters**


3. Click on the cluster that you want to remove.


4. Click on the **Settings** drop-down menu.


5. Click on **Delete Cluster**


6. Type in the name of the cluster and click on **OK**

The cluster status is updated to **Deleting** while cluster resources are being deleted. Once all resources are successfully deleted, the cluster status is updated to **Deleted** and is removed from the list of clusters.

## Force Delete a Cluster

In Tenant Admin and Project Admin scope, Palette allows you to force the deletion of a cluster that's been stuck in **Deletion** state for a minimum of **15 minutes**.

1. Log in to the Palette Management Console.


2. Navigate to the **Cluster Details** page of the cluster stuck in deletion.

      - If the deletion is stuck for more than 15 minutes, click the **Force Delete Cluster** button from the **Settings** dropdown.

      - If the **Force Delete Cluster** button is not enabled, wait for 15 minutes. The **Settings** dropdown will give the estimated time for the auto-enabling of the **Force Delete** button.

    :::warning

    If any resources remain in the cloud, you should clean them up before initiating a forced delete.

    :::
