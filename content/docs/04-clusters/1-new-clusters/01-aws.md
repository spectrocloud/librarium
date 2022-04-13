---
title: "AWS"
metaTitle: "Creating new clusters on Palette"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

Following are some architectural highlights of the Amazon Web Services (AWS) clusters, provisioned by Palette:

1. Kubernetes nodes can be distributed across multiple availability zones (AZs) to achieve high availability (HA). For each of the AZs that you select, a public subnet and a private subnet is created.


2. All the control plane nodes and worker nodes are created within the private subnets, so there is no direct public access available.


3. A Network Address Translation (NAT) Gateway is created in the public subnet of each AZ, to allow nodes in the private subnet to be able to go out to the internet or call other AWS services.


4. An Internet Gateway (IG) is created for each Virtual Private Cloud (VPC), to allow Secure Shell Protocol (SSH) access to the bastion node for debugging purposes. SSH into Kubernetes nodes is only available through the bastion node. A bastion node helps to provide access to the Amazon Elastic Compute Cloud (EC2) instances. This is because the EC2 instances are created in a private subnet and the bastion node operates as a secure, single point of entry into the infrastructure. The bastion node can be accessed via SSH or Remote Desktop (RDP).


5. The Kubernetes API Server endpoint is accessible through an Elastic Load Balancing (ELB), which load balances across all the control plane nodes.

![aws_cluster_architecture.png](aws_cluster_architecture.png)

# Prerequisites

The following prerequisites must be met before deploying an Amazon Elastic Kubernetes Service (EKS) workload cluster:

1. You need an active AWS cloud account with all the permissions listed below in the **AWS Cloud Account Permissions** section.


2. Register your AWS cloud account in Palette, as described in the **Creating an AWS Cloud Account** section below.


3. You should have an Infrastructure Cluster profile created in Palette for AWS.


4. Palette creates compute, network, and storage resources on AWS, during the provisioning of Kubernetes clusters. Ensure there is sufficient capacity in the preferred AWS region for the creation of the following resources:
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

</Tabs.TabPane>



<Tabs.TabPane tab="Control Plane Policy" key="Control Plane Policy">


### Control Plane Policy

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


</Tabs.TabPane>



<Tabs.TabPane tab="Nodes Policy" key="Nodes Policy">

### Nodes Policy

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


</Tabs.TabPane>



<Tabs.TabPane tab="Deployment Policy" key="Deployment Policy">


### Deployment Policy

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


<WarningBox>
Ensure that the role created contain all the policies defined above.
</WarningBox>

<WarningBox>
These policies cannot be used as an inline policy, as it exceeds the 2048 non-whitespace character limit by AWS.
</WarningBox>

<WarningBox>
The following warning is expected and can be ignored:<p></p>
<i>These policies defines some actions, resources, or conditions that do not provide permissions. To grant access, policies must have an action that has an applicable resource or condition.</i>
</WarningBox>

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

To create an AWS cloud account, provide a name and a description for the account and follow the steps below, based on the account type desired:

1. In the AWS console, create the four policies listed above.


2. Access Credentials
    - In the AWS console, create a role with all the four policies created in the previous step. Assign this role to the root user, or the IAM user to be used from Palette.
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
    

4. In the AWS console, browse to the Role Details page and copy the Amazon Resource Name (ARN) Role.Arn.


5. In Palette, enter the Role ARN in the field provided. 


</Tabs.TabPane>
</Tabs>

# Deploying an AWS Cluster

 ![aws-cluster-creation](./cluster-creation-videos/aws.mp4)

The following steps need to be performed to provision a new AWS cluster:

1. Provide basic cluster information: Name, Description, and Tags. Tags on a cluster are propagated to the VMs deployed on the cloud/data center environments.


2. Select the Cluster Profile created for the AWS cloud. The profile definition will be used as the cluster construction template.


3. Review and override pack parameters, as desired. By default, parameters for all packs are set with values, defined in the Cluster Profile.


4. Provide the AWS cloud account and placement information.

    |**Parameter**| **Description**|
    |-------------|---------------|
    |**Cloud Account** | Select the desired cloud account. AWS cloud accounts with AWS credentials need to be preconfigured in project settings.|
    |**Region** | Choose the preferred AWS region where you would like the clusters to be provisioned.|
    |**SSH Key Pair Name** | Choose the desired SSH Key pair. SSH key pairs need to be preconfigured on AWS for the desired regions. The selected key is inserted into the VMs provisioned.|
    |**Static Placement** | By default, Palette uses dynamic placement, wherein a new VPC with a public and private subnet is created to place cluster resources for every cluster. <br /> These resources are fully managed by Palette and deleted, when the corresponding cluster is deleted. Turn on the **Static Placement** option if it's desired to place resources into preexisting VPCs and subnets.<br /> If the user is making the selection of **Static Placement** of resources, the following placement information needs to be provided:
    ||**Virtual Network**: Select the virtual network from dropdown menu.
    ||**Control plane Subnet**: Select the control plane network from the dropdown menu.
    ||**Worker Network**: Select the worker network from the dropdown menu. |
    

5. Make the choice of updating the worker pool in parallel, if required.

<InfoBox>
The following Tags should be added to the public subnet to enable automatic subnet discovery for integration with AWS load balancer service.<p> </p>
kubernetes.io/role/elb = 1 <br />
sigs.k8s.io/cluster-api-provider-aws/role = public <br />
kubernetes.io/cluster/[ClusterName] = shared <br />
sigs.k8s.io/cluster-api-provider-aws/cluster/[ClusterName] = owned

</InfoBox>

6. Configure the master and worker node pools. A master and a worker node pool are configured by default.
 

7. An optional Label can be applied to a node pool during the cluster creation. During the cluster creation, while configuring the node pools, tag an optional Label in a unique key: value format. For a running cluster, the created label can be edited as well as a new label can be added.


8. Enable or disable node pool Taint as per the user's choice. If Taint is enabled, the following parameters need to be passed:
    
    |**Parameter**| **Description**|
    |---------|---------------|
    |**Key** |Custom key for the Taint.|
    |**Value**| Custom value for the Taint key.|
    | **Effect**| Make the choice of effect from the dropdown menu. <p> There are three options to go with: </p>
    ||**NoSchedule**: A pod that cannot tolerate the node Taint, should not be scheduled to the node. 
    ||**PreferNoSchedule**: The system will avoid placing a non-tolerant pod to the tainted node but is not guaranteed.
    ||**NoExecute**: New pods will not be scheduled on the node, and existing pods on the node if any on the node will be evicted if they do not tolerate the Taint.
    
    

## Running Clusters through Edit Node Pool
<InfoBox>
Palette allows its users to apply/edit the Taints, for a running cluster, through the <b>Edit node pool</b> option under the <b>Nodes</b> tab.
</InfoBox>

  |**Parameter**| **Description**|
        |---------|---------------|
        |**Name** |A descriptive name for the node pool.|
        |**Size** |Number of VMs to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.|
        |**Allow worker capability (master pool)**|Select this option for allowing workloads to be provisioned on master nodes.|
        |**Instance type**|Select the AWS instance type to be used for all nodes in the node pool.|
        |**Rolling Update**| There are two choices of Rolling Update:
        ||**Expand First**: Launches the new node and then shut down the old node.
        ||**Contract First**: Shut down the old node first and then launches the new node.
        |**Availability Zones**| Choose one or more availability zones. Palette provides fault tolerance to guard against failures like hardware failures, network failures, etc. by provisioning nodes across availability zones if multiple zones are selected.|
## On-Demand Instances and On-Spot
By default, worker pools are configured to use On-Demand instances. Optionally, to take advantage of discounted spot instance pricing, the **On-Spot** option can be selected. This option allows you to specify a maximum bid price for the nodes as a percentage of the On-Demand price. Palette tracks the current price for spot instances and launches nodes, when the spot price falls in the specified range.
* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if it's desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the <i>m3.large</i> instance types for general-purpose workloads, and another worker pool with instance type <i>g2.2xlarge</i> can be configured to run GPU workloads.
</InfoBox>

# Deleting an AWS Cluster
The deletion of an AWS cluster results in the removal of all Virtual Machines and associated Storage Disks, created for the cluster. The following tasks need to be performed to delete an AWS cluster:

1. Select the cluster to be deleted from the **Cluster** **View** page and navigate to the **Cluster Overview** page.





2. Invoke a delete action available on the page: **Cluster** > **Settings** > **Cluster** **Settings** > **Delete** **Cluster**.


3. Click **Confirm** to delete.


The Cluster Status is updated to **Deleting** while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to **Deleted** and is removed from the list of clusters.

# Forcing a Cluster Deletion

A cluster stuck in the **Deletion** state can be force deleted by the user through the User Interface. The user can go for a force deletion of the cluster, only if it is stuck in a deletion state for a minimum of **14 minutes**. Palette enables cluster force delete from the Tenant Admin and Project Admin scope. 

## To force delete a cluster:

1. Log in to the Palette Management Console.


2. Navigate to the **Cluster Details** page of the cluster stuck in deletion.

      - If the deletion is stuck for more than 14 minutes, click the **Force Delete Cluster** button from the **Settings** dropdown. 
    
      - If the **Force Delete Cluster** button is not enabled, wait for 14 minutes. The **Settings** dropdown will give the estimated time for the auto-enabling of the force delete button.
    
<WarningBox>
If there are any cloud resources still on the cloud, the user should clean up those resources before going for the force deletion. 
</WarningBox>




