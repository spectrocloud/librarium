---
title: "AWS-EKS"
metaTitle: "Creating new clusters on Palette"
metaDescription: "The methods of creating clusters for a speedy deployment on any Cloud Service Provider CSP"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Following are some architectural highlights of Amazon Web Services' (AWS) managed Kubernetes clusters (also known as Elastic Kubernetes Service or (EKS)), provisioned by Palette:

1. Cluster resources such as Virtual Machines (VMs) can be provisioned into an existing infrastructure (Gateways, VPCs, Subnets etc.) as part of static provisioning as well as new dedicated infrastructure as part of dynamic provisioning.


2. Full support for EKS Fargate profiles


3. Spot instance support

 ![eks_cluster_architecture.png](eks_cluster_architecture.png)

# Prerequisites

The following prerequisites must be met before deploying an EKS workload cluster:

1. You must have an active AWS cloud account with all the permissions listed below in the **AWS Cloud Account Permissions** section.


2. You must register your AWS cloud account in Palette as described in the **Creating an AWS Cloud account** section below.


3. Have an Infrastructure cluster profile already created in Palette for EKS.


4. Sufficient capacity in the desired AWS region should exist for the creation of the following resources:
    - vCPU
    - VPC
    - Elastic IP
    - Internet Gateway
    - Elastic Load Balancers
    - NAT Gateway

# AWS Cloud Account Permissions

The following **four** policies include all the required permissions for provisioning clusters through Palette:

<Tabs>

<Tabs.TabPane tab="Controller Policy" key="Controller Policy">

### Controller Policy

**Last Update**: June 1, 2021

``` json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:AllocateAddress",
        "ec2:AssociateRouteTable",
        "ec2:AttachInternetGateway",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:CreateInternetGateway",
        "ec2:CreateNatGateway",
        "ec2:CreateRoute",
        "ec2:CreateRouteTable",
        "ec2:CreateSecurityGroup",
        "ec2:CreateSubnet",
        "ec2:CreateTags",
        "ec2:CreateVpc",
        "ec2:ModifyVpcAttribute",
        "ec2:DeleteInternetGateway",
        "ec2:DeleteNatGateway",
        "ec2:DeleteNetworkInterface",
        "ec2:DeleteRouteTable",
        "ec2:DeleteSecurityGroup",
        "ec2:DeleteSubnet",
        "ec2:DeleteTags",
        "ec2:DeleteVpc",
        "ec2:DescribeAccountAttributes",
        "ec2:DescribeAddresses",
        "ec2:DescribeAvailabilityZones",
        "ec2:DescribeInstances",
        "ec2:DescribeInternetGateways",
        "ec2:DescribeImages",
        "ec2:DescribeKeyPairs",
        "ec2:DescribeNatGateways",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DescribeNetworkInterfaceAttribute",
        "ec2:DescribeRouteTables",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcs",
        "ec2:DescribeVpcAttribute",
        "ec2:DescribeVolumes",
        "ec2:DetachInternetGateway",
        "ec2:DisassociateRouteTable",
        "ec2:DisassociateAddress",
        "ec2:ModifyInstanceAttribute",
        "ec2:ModifyNetworkInterfaceAttribute",
        "ec2:ModifySubnetAttribute",
        "ec2:ReleaseAddress",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:RunInstances",
        "ec2:TerminateInstances",
        "tag:GetResources",
        "elasticloadbalancing:AddTags",
        "elasticloadbalancing:CreateLoadBalancer",
        "elasticloadbalancing:ConfigureHealthCheck",
        "elasticloadbalancing:DeleteLoadBalancer",
        "elasticloadbalancing:DescribeLoadBalancers",
        "elasticloadbalancing:DescribeLoadBalancerAttributes",
        "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
        "elasticloadbalancing:DescribeTags",
        "elasticloadbalancing:ModifyLoadBalancerAttributes",
        "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
        "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
        "elasticloadbalancing:RemoveTags",
        "autoscaling:DescribeAutoScalingGroups",
        "autoscaling:DescribeInstanceRefreshes",
        "ec2:CreateLaunchTemplate",
        "ec2:CreateLaunchTemplateVersion",
        "ec2:DescribeLaunchTemplates",
        "ec2:DescribeLaunchTemplateVersions",
        "ec2:DeleteLaunchTemplate",
        "ec2:DeleteLaunchTemplateVersions"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "autoscaling:CreateAutoScalingGroup",
        "autoscaling:UpdateAutoScalingGroup",
        "autoscaling:CreateOrUpdateTags",
        "autoscaling:StartInstanceRefresh",
        "autoscaling:DeleteAutoScalingGroup",
        "autoscaling:DeleteTags"
      ],
      "Resource": [
        "arn:*:autoscaling:*:*:autoScalingGroup:*:autoScalingGroupName/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling"
      ],
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "autoscaling.amazonaws.com"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing"
      ],
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "elasticloadbalancing.amazonaws.com"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/aws-service-role/spot.amazonaws.com/AWSServiceRoleForEC2Spot"
      ],
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "spot.amazonaws.com"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/*.cluster-api-provider-aws.sigs.k8s.io"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:CreateSecret",
        "secretsmanager:DeleteSecret",
        "secretsmanager:TagResource"
      ],
      "Resource": [
        "arn:*:secretsmanager:*:*:secret:aws.cluster.x-k8s.io/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter"
      ],
      "Resource": [
        "arn:*:ssm:*:*:parameter/aws/service/eks/optimized-ami/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/aws-service-role/eks.amazonaws.com/AWSServiceRoleForAmazonEKS"
      ],
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "eks.amazonaws.com"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/aws-service-role/eks-nodegroup.amazonaws.com/AWSServiceRoleForAmazonEKSNodegroup"
      ],
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "eks-nodegroup.amazonaws.com"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": [
        "arn:aws:iam::*:role/aws-service-role/eks-fargate-pods.amazonaws.com/AWSServiceRoleForAmazonEKSForFargate"
      ],
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "eks-fargate.amazonaws.com"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:ListOpenIDConnectProviders",
        "iam:CreateOpenIDConnectProvider",
        "iam:AddClientIDToOpenIDConnectProvider",
        "iam:UpdateOpenIDConnectProviderThumbprint",
        "iam:DeleteOpenIDConnectProvider"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:GetRole",
        "iam:ListAttachedRolePolicies",
        "iam:DetachRolePolicy",
        "iam:DeleteRole",
        "iam:CreateRole",
        "iam:TagRole",
        "iam:AttachRolePolicy"
      ],
      "Resource": [
        "arn:*:iam::*:role/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:GetPolicy"
      ],
      "Resource": [
        "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "eks:DescribeCluster",
        "eks:ListClusters",
        "eks:CreateCluster",
        "eks:TagResource",
        "eks:UpdateClusterVersion",
        "eks:DeleteCluster",
        "eks:UpdateClusterConfig",
        "eks:UntagResource",
        "eks:UpdateNodegroupVersion",
        "eks:DescribeNodegroup",
        "eks:DeleteNodegroup",
        "eks:UpdateNodegroupConfig",
        "eks:CreateNodegroup"
      ],
      "Resource": [
        "arn:*:eks:*:*:cluster/*",
        "arn:*:eks:*:*:nodegroup/*/*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "eks:AssociateIdentityProviderConfig",
        "eks:ListIdentityProviderConfigs"
      ],
      "Resource": [
        "arn:aws:eks:*:*:cluster/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "eks:DisassociateIdentityProviderConfig",
        "eks:DescribeIdentityProviderConfig"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "eks:ListAddons",
        "eks:CreateAddon",
        "eks:DescribeAddonVersions",
        "eks:DescribeAddon",
        "eks:DeleteAddon",
        "eks:UpdateAddon",
        "eks:TagResource",
        "eks:DescribeFargateProfile",
        "eks:CreateFargateProfile",
        "eks:DeleteFargateProfile"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": [
        "*"
      ],
      "Condition": {
        "StringEquals": {
          "iam:PassedToService": "eks.amazonaws.com"
        }
      }
    }
  ]
}

```

<InfoBox>
<b>Note</b>:
All the above policies are required as part of the Cluster API requirement, derived using <a href="https://cluster-api-aws.sigs.k8s.io/clusterawsadm/clusterawsadm_bootstrap_iam_print-policy.html/">clusterawsadm bootstrap iam print-policy.</a>
</InfoBox>

</Tabs.TabPane>
<Tabs.TabPane tab="Control Plane Policy" key="Control Plane Policy">

### Control Plane Policy

**Last Update**: June 6, 2021

``` json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "autoscaling:DescribeAutoScalingGroups",
        "autoscaling:DescribeLaunchConfigurations",
        "autoscaling:DescribeTags",
        "ec2:DescribeInstances",
        "ec2:DescribeImages",
        "ec2:DescribeRegions",
        "ec2:DescribeRouteTables",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVolumes",
        "ec2:CreateSecurityGroup",
        "ec2:CreateTags",
        "ec2:CreateVolume",
        "ec2:ModifyInstanceAttribute",
        "ec2:ModifyVolume",
        "ec2:AttachVolume",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:CreateRoute",
        "ec2:DeleteRoute",
        "ec2:DeleteSecurityGroup",
        "ec2:DeleteVolume",
        "ec2:DetachVolume",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:DescribeVpcs",
        "elasticloadbalancing:AddTags",
        "elasticloadbalancing:AttachLoadBalancerToSubnets",
        "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
        "elasticloadbalancing:CreateLoadBalancer",
        "elasticloadbalancing:CreateLoadBalancerPolicy",
        "elasticloadbalancing:CreateLoadBalancerListeners",
        "elasticloadbalancing:ConfigureHealthCheck",
        "elasticloadbalancing:DeleteLoadBalancer",
        "elasticloadbalancing:DeleteLoadBalancerListeners",
        "elasticloadbalancing:DescribeLoadBalancers",
        "elasticloadbalancing:DescribeLoadBalancerAttributes",
        "elasticloadbalancing:DetachLoadBalancerFromSubnets",
        "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
        "elasticloadbalancing:ModifyLoadBalancerAttributes",
        "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
        "elasticloadbalancing:SetLoadBalancerPoliciesForBackendServer",
        "elasticloadbalancing:AddTags",
        "elasticloadbalancing:CreateListener",
        "elasticloadbalancing:CreateTargetGroup",
        "elasticloadbalancing:DeleteListener",
        "elasticloadbalancing:DeleteTargetGroup",
        "elasticloadbalancing:DescribeListeners",
        "elasticloadbalancing:DescribeLoadBalancerPolicies",
        "elasticloadbalancing:DescribeTargetGroups",
        "elasticloadbalancing:DescribeTargetHealth",
        "elasticloadbalancing:ModifyListener",
        "elasticloadbalancing:ModifyTargetGroup",
        "elasticloadbalancing:RegisterTargets",
        "elasticloadbalancing:SetLoadBalancerPoliciesOfListener",
        "iam:CreateServiceLinkedRole",
        "kms:DescribeKey"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}

```
<InfoBox>
<b>Note</b>:
All the above policies are required as part of the Cluster API requirement, derived using <a href="https://cluster-api-aws.sigs.k8s.io/clusterawsadm/clusterawsadm_bootstrap_iam_print-policy.html/">clusterawsadm bootstrap iam print-policy.</a>
</InfoBox>

</Tabs.TabPane>

<Tabs.TabPane tab="Nodes Policy" key="Nodes Policy">

### Nodes Policy

**Last Update**: June 1, 2021

``` json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeRegions",
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:GetRepositoryPolicy",
        "ecr:DescribeRepositories",
        "ecr:ListImages",
        "ecr:BatchGetImage"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:DeleteSecret",
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:*:secretsmanager:*:*:secret:aws.cluster.x-k8s.io/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ssm:UpdateInstanceInformation",
        "ssmmessages:CreateControlChannel",
        "ssmmessages:CreateDataChannel",
        "ssmmessages:OpenControlChannel",
        "ssmmessages:OpenDataChannel",
        "s3:GetEncryptionConfiguration"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}

```
<InfoBox>
<b>Note</b>:
All the above policies are required as part of the Cluster API requirement, derived using the <a href="https://cluster-api-aws.sigs.k8s.io/clusterawsadm/clusterawsadm_bootstrap_iam_print-policy.html/">clusterawsadm bootstrap iam print-policy.</a>
</InfoBox>

</Tabs.TabPane>

<Tabs.TabPane tab="Deployment Policy" key="Deployment Policy">

### Deployment Policy

 **Last Update**: June 1, 2021

``` json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:CreateStack",
                "cloudformation:DescribeStacks",
                "cloudformation:UpdateStack",
                "ec2:CreateSnapshot",
                "ec2:DeleteSnapshot",
                "ec2:DescribeKeyPairs",
                "ec2:DetachNetworkInterface",
                "ec2:DeleteNetworkInterface",
                "ec2:DescribeSnapshots",
                "ec2:DescribeTags",
                "ec2:DescribeVolumesModifications",
                "iam:AddRoleToInstanceProfile",
                "iam:AddUserToGroup",
                "iam:AttachGroupPolicy",
                "iam:CreateGroup",
                "iam:CreateInstanceProfile",
                "iam:CreatePolicy",
                "iam:CreatePolicyVersion",
                "iam:CreateUser",
                "iam:DeleteGroup",
                "iam:DeleteInstanceProfile",
                "iam:DeletePolicy",
                "iam:DetachGroupPolicy",
                "iam:DeletePolicyVersion",
                "iam:GetGroup",
                "iam:GetInstanceProfile",
                "iam:GetUser",
                "iam:GetPolicy",
                "iam:ListPolicyVersions",
                "iam:RemoveRoleFromInstanceProfile",
                "iam:RemoveUserFromGroup",
                "pricing:GetProducts",
                "sts:AssumeRole"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}

```

</Tabs.TabPane>

</Tabs>

<InfoBox>
Ensure that the role created encompasses all the policies defined above.
</InfoBox>

<InfoBox>
These policies cannot be used as an inline policy, as it exceeds the 2048 non-whitespace character limit by AWS.
</InfoBox>

<InfoBox>
The following warning is expected and can be ignored:<p></p>
<i>These policies define some actions, resources, or conditions that do not provide permissions. To grant access, policies must have an action that has an applicable resource or condition.</i>
</InfoBox>

# Creating an AWS Cloud Account

<Tabs>

<Tabs.TabPane tab="Using the Access Credentials Method" key="Using the Access Credentials Method">

## AWS Account Creation Using the Access Credentials Method

![AWS-Cloud-Account](/cloud-accounts/aws-credentials.mp4)

</Tabs.TabPane>

<Tabs.TabPane tab="Using the Security Token Service (STS) Method" key="Using the Security Token Service (STS) Method"> 

## AWS Account Creation Using the Security Token Service (STS) Method

![AWS-Cloud-Account](/cloud-accounts/aws-sts.mp4)

## Security Token Service (STS) Method

To create an AWS cloud account, provide a name and a description for the account and follow the steps below based on the account type desired:

1. In the AWS console, create the four policies listed above.


2. Access Credentials
    - In the AWS console, create a role with all the four policies created in the previous step. Assign this role to the root user or the IAM user to be used from Palette.
    - In Palette, provide the access key and secret key for the user.


3. Security Token Service (STS)

    In the AWS console, create a new IAM role called using the following options:

    |**Parameter**|**Description**|
    |---------|---------------|
    |**Trusted Entity Type**| Another AWS account|
    |**Account ID**|Copy the Account ID displayed on the UI|
    |**Require External ID**| Enable|
    |**External ID**|Copy the External ID displayed on the UI|
    |**Permissions Policy**|Search and select the 4 policies added in step #2|
    |**Role Name**|SpectroCloudRole|


</Tabs.TabPane>
</Tabs>

# Deploying an EKS Cluster

 ![eks-cluster-creation](./cluster-creation-videos/eks.mp4)

The following steps need to be performed to provision a new EKS cluster:

1. Provide the basic cluster information like Name, Description, and Tags. Tags on a cluster are propagated to the VMs deployed on the cloud/data center environments.


2. Select the Cluster Profile created for the EKS cloud. The profile definition will be used as the cluster construction template.


3. Review and override pack parameters, as desired. By default, parameters for all packs are set with values defined in the cluster profile.


4. Provide the AWS Cloud account and placement information.

    |**Parameter**| **Description**|
    |-------------|---------------|
    |**Cloud Account** | Select the desired cloud account. AWS cloud accounts with AWS credentials need to be preconfigured in project settings.|
    |**Region** | Choose the preferred AWS region where you would like the clusters to be provisioned.|
    |**SSH Key Pair Name** | Choose the desired SSH Key pair. SSH key pairs need to be preconfigured on AWS for the desired regions. The selected key is inserted into the VMs provisioned.|
    |**Static Placement** | By default, Palette uses dynamic placement, wherein a new VPC with a public and private subnet is created to place cluster resources for every cluster. <br /> These resources are fully managed by Palette and deleted, when the corresponding cluster is deleted. Turn on the **Static Placement** option if it's desired to place resources into preexisting VPCs and subnets. |


<InfoBox>
The following Tags should be added to the public subnet to enable automatic subnet discovery for integration with AWS load balancer service.<p> </p>
kubernetes.io/role/elb = 1 <br />
sigs.k8s.io/cluster-api-provider-aws/role = public <br />
kubernetes.io/cluster/[ClusterName] = shared <br />
sigs.k8s.io/cluster-api-provider-aws/cluster/[ClusterName] = owned

</InfoBox>

5. Configure one or more worker node pools. A single worker node will be configured by default.

    |**Parameter**| **Description**|
    |-------------|----------------|
    |**Name** | A descriptive name for the node pool.|
    |**Size** | Make your choice of minimum, maximum and desired sizes for the worker pool. The size of the worker pool will scale between the minimum and maximum size under varying workload conditions.|
    |**Instance Type** | Select the AWS [instance type](/clusters/new-clusters/eks/#awsinstancetypewithpodcapacity) to be used for all nodes in the node pool.|

6. Optionally, create one or more Fargate Profile(s) to aid the provisioning of on-demand, optimized compute capacity for the workload clusters.

    |**Parameter**| **Description**|
    |-------------|---------------|
    |**Name** |Provide a name for the Fargate profile.|
    |**Subnets** |Pods running on Fargate Profiles are not assigned public IP addresses, so only private subnets (with no direct route to an Internet Gateway) are accepted for this parameter. For dynamic provisioning, this input is not required and subnets are automatically selected.|
    |**Selectors** |Define pod selector by providing a target namespace and optionally labels. Pods with matching namespace and app labels are scheduled to run on dynamically provisioned compute nodes.<br /> You can have up to five selectors in a Fargate profile and a pod only needs to match one selector to run using the Fargate profile.|

7. Review the settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if it is desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the <i>m3.large</i> instance types for general-purpose workloads, and another worker pool with instance type <i>g2.2xlarge</i> can be configured to run GPU workloads.
</InfoBox>

# AWS Instance Type and Pod Capacity
Choose the instance type and the number of instances to be launched according to the number of pods required for the workload. The number of pods that can be scheduled on the nodes for an instance type needs to be calculated for the same; otherwise, the cluster creation cannot go to completion, as the pods cannot come up on the target cluster, due to resource unavailability. 


The following section describes the method of calculating the pod capacity for individual AWS instance types. This will help in making exact choices of **desired size** of worker pool during **cluster creation**. We recommend selecting an instance that can support at least 30 pods.

## Formula for Pod Calculation
Number of pods = N * (M-1) + 2 

Where:
* **N** is the number of Elastic Network Interfaces (ENI) of the instance type (Maximum network interfaces).
* **M** is the number of IP addresses of a single ENI (Private IPv4 addresses per interface/IPv6 addresses per interface).
* Values for **N** and **M** for each instance type can be referred from [this document](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html#AvailableIpPerENI).

## Example Calculation:
* For instance type = t3.medium 
* For values of N = 3, and M = 6 (values derived from AWS [document](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html#AvailableIpPerENI) )
* N * (M-1) + 2 = 3(6-1)+2 =17 pods/instances
* In this example, we will need at least two (2) t3.medium instances to reach the minimum of 30 pods threshold.

<InfoBox>
Select the type and number of instances to support a minimum of 30 pods.
</InfoBox>

Hence, while setting the desired size of the worker pool, make the choice as per pod requirement. In the example given above, we need to launch a minimum of two (2) instances of t3.medium to satisfy the resource requirement of an EKS cluster.

# Deleting an EKS Cluster
The deletion of an EKS cluster results in the removal of all Virtual Machines and associated Storage Disks, created for the cluster. The following tasks need to be performed to delete an EKS cluster:

1. Select the cluster to be deleted from the **Cluster** **View** page and navigate to the **Cluster Overview** page.


2. Invoke a delete action available on the page: **Cluster** > **Settings** > **Cluster** **Settings** > **Delete** **Cluster**.


3. Click **Confirm** to delete.

Cluster status is updated to **Deleting** while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to **Deleted** and is removed from the list of clusters.

# Force Delete a Cluster

A cluster stuck in the **Deletion** state can be force deleted by the user through the User Interface. The user can go for a force deletion of the cluster only if it is stuck in a deletion state for a minimum of **15 minutes**. Palette enables cluster force delete from the tenant admin and project admin scope. 

## To force delete a cluster:
1. Log in to the Palette Management Console.


2. Navigate to the **Cluster Details** page of the cluster stuck in deletion.

      - If the deletion is stuck for more than 15 minutes, click the **Force Delete Cluster** button from the **Settings** dropdown. 
    
      - If the **Force Delete Cluster** button is not enabled, wait for 15 minutes. The **Settings** dropdown will give the estimated time for the auto-enabling of the force delete button.

<WarningBox>
If there are any cloud resources still on the cloud, the user should cleanup those resources before going for the force deletion. 
</WarningBox>




