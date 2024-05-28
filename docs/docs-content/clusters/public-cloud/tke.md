---
sidebar_label: "Tencent TKE"
title: "Tencent TKE"
description: "The methods of creating clusters for a speedy deployment on Tencent-TKE"
hide_table_of_contents: false
tags: ["public cloud", "tencent", "tke"]
sidebar_position: 40
---

Palette supports the deployment of tenant workloads with Tencent Kubernetes Engine (TKE). The following are the
detailing of the Tencent TKE cluster provisioning through Palette:

- Palette enables the effortless deployment and management of containerized applications with fully managed TKE.

- TKE is fully compatible with the native Kubernetes APIs and extends Kubernetes plugins such as CBS and CLB on the
  Tencent Cloud.

- The Palette-supported TKE architecture is represented diagrammatically as below:

  ![tencent-diagram.webp](/tencent-diagram.webp)

## Prerequisites

- A Tencent Cloud account with appropriate [permissions](#tencent-cloud-account-permissions).

- Create a Cloud API **Secret ID** and **Secret Key**.

- Create the **Virtual Private Network** and **Subnet** to the region where the workload cluster needs to be deployed.

- The [**NAT Gateway**](https://intl.cloud.tencent.com/document/product/457/38369) is to be created to support IP
  address translation and to enable Internet access to resources in Tencent Cloud.

- A Route table set to accept external traffic, so that the nodes getting created in the associated subnets will have
  internet capability.

- Create a security group for network security isolation and add Inbound traffic rule that allows the TCP/HTTPS protocol
  for port 443 from all IPv6 and IPv4 sources through this security group.

## Tencent Cloud Account Permissions

**Last Update**: April 26, 2022

```json
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
        "vpc:Describe.webpw",
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
      "resource": ["*"]
    }
  ]
}
```

## Create a Tencent Cloud Account

1. Log in to Palette and from the **Tenant Admin Settings**, select the **Cloud Accounts** tab.

2. Click **+ Tencent Account** to open the cloud account creation wizard and fill in the following details:

   | **Parameter**            | **Description**                                                     |
   | ------------------------ | ------------------------------------------------------------------- |
   | **Account Name**         | A custom name to identify the cloud account on the Palette Console. |
   | **Optional Description** | Add a description, if any about the cloud account.                  |
   | **Secret ID**            | The Secret ID of the Tencent cloud account.                         |
   | **Secret Key**           | The secret key of the Tencent cloud account.                        |

3. Click the **Validate** button to validate credentials.

4. Click **Confirm** button to complete the cloud account create wizard.

## Deploy a Tencent Cluster

1. Log in to [Palette](https://console.spectrocloud.com/).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu** select **Clusters**, and click **Add New Cluster**.

4. In **Public Clouds**, under **Managed Kubernetes**, select **TKE**.

5. In the bottom-right corner, click **Start TKE Configuration**.

6. Fill out the following basic information and click **Next**.

   | **Field**         | **Description**                                                                                                                                                                                                            |
   | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Cluster Name**  | A custom name for the cluster.                                                                                                                                                                                             |
   | **Description**   | Use the description to provide context about the cluster.                                                                                                                                                                  |
   | **Tags**          | Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the computing environments. Example: `region:ap-guangzhou` or `zone:ap-guangzhou-2`.                           |
   | **Cloud Account** | If you already [added your Tencent Cloud account](#create-a-tencent-cloud-account) in Palette, select it from the **drop-down Menu**. Otherwise, click **Add New Account** and add your Tencent Cloud account information. |

7. Click **Add Cluster Profile**, select a cluster profile, and click **Next**. Palette displays the cluster profile
   layers.

8. Review the profile layers and customize parameters as desired in the YAML files that display when you select a layer.
   By default, the pack parameters contain values from the cluster profile.

9. While configuring the Operating System layer of the TKE cluster profile, configure the value of the OS pack file with
   any one of the following images:

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

10. Click **Next** to continue.

11. Provide the Tencent Cloud account and placement information:

    | **Parameter**               | **Description**                                                                                                                                                                                                                                        |
    | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Cloud Account**           | Select the desired cloud account.                                                                                                                                                                                                                      |
    | **Tencent Cloud Accounts**  | The Tencent credentials need to be pre-configured in the **Project**/**Tenant Admin** settings.                                                                                                                                                        |
    |                             | **Note**: The cloud account can be created during this step of<br /> cluster creation by clicking **+** next to the **Cloud Account**.                                                                                                                 |
    | **Region**                  | Choose the desired Tencent region where you <br /> would like the clusters to be provisioned.                                                                                                                                                          |
    | **SSH Key Pair Name**       | Choose the desired SSH keypair. You must preconfigure SSH key pairs on TKS for the desired regions. The selected key is inserted into the provisioned VMs.                                                                                             |
    | **VPCID**                   | The ID of the Virtual Private Cloud (VPC) that the stack is to be launched into. The VPC must be in the specified region. All cluster instances will be launched into this VPC.                                                                        |
    | **Cluster Endpoint Access** | Select Public, or Private & Public, based on how you want to establish the communication with the endpoint for the managed Kubernetes API server and your cluster.                                                                                     |
    | **Public Security Group**   | A security group to controls the traffic that is allowed to reach and leave the resources that it is associated with. For example, after you associate a security group with the cluster, it controls the inbound and outbound traffic to the cluster. |

    :::info

    We recommend going with the Public Cluster endpoint access as of now.

    :::

12. Configure **Public Access CIDRs** to enable access restrictions.

13. Enable the update of Worker Pools in parallel to patch updates to all Worker Pools simultaneously.

14. Configure one or more worker node pools. A single worker node will be configured by default. To learn more about the
    configuration options, review the [Node Pool](../cluster-management/node-pool.md) documentation page. Click **Next**
    when you are done with node pool configurations.

15. Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available
    to track progress.

## Delete a Tencent Cluster

The deletion of a Tencent cluster results in the removal of all Virtual Machines and associated Storage Disks created
for the cluster. The following tasks need to be performed to delete a Tencent cluster:

1. Ensure you are in the correct project scope.

2. Navigate to the left **Main Menu** and click **Clusters**

3. Click on the cluster that you want to remove.

4. Click the **Settings** drop-down menu.

5. Click **Delete Cluster**

6. Type in the name of the cluster and click **OK**

The cluster status is updated to **Deleting** while cluster resources are being deleted. Once all resources are
successfully deleted, the cluster status is updated to **Deleted** and is removed from the list of clusters.

## Force Delete a Cluster

In Tenant Admin and Project Admin scope, Palette allows you to force the deletion of a cluster that's been stuck in
**Deletion** state for a minimum of **15 minutes**.

1. Log in to the Palette Management Console.

2. Navigate to the **Cluster Details** page of the cluster stuck in deletion.

   - If the deletion is stuck for more than 15 minutes, click the **Force Delete Cluster** button from the **Settings**
     dropdown.

   - If the **Force Delete Cluster** button is not enabled, wait for 15 minutes. The **Settings** dropdown will give the
     estimated time for the auto-enabling of the **Force Delete** button.

   :::warning

   If any resources remain in the cloud, you should clean them up before initiating a forced delete.

   :::
