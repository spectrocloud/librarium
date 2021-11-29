---
title: "AWS"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';

# Overview

Following are some of the architectural highlights of AWS clusters provisioned by Spectro Cloud:

* Kubernetes nodes can be distributed across multiple AZs to achieve high availability. For each of the AZ's that you select, a public subnet and a private subnet is created.
* All the control plane nodes and worker nodes are created within the private subnets so there is no direct public access available.
* A NAT gateway is created in the public subnet of each AZ, to allow nodes in the private subnet to be able to go out to the internet or call other AWS services.
* An Internet gateway is created for each VPC, to allow SSH access to the bastion node for debugging purposes. SSH into Kubernetes nodes is only available through the Bastion node. A bastion node helps to provide access to the EC2 instances. This is because the EC2 instances are created in a private subnet and the bastion node operates as a secure, single point of entry into the infrastructure. The bastion node can be accessed via SSH or RDP.
* The Kubernetes APIServer endpoint is accessible through an ELB, which load balances across all the control plane nodes.

![aws_cluster_architecture.png](aws_cluster_architecture.png)

# Prerequisites

The following prerequisites must be met before deploying an EKS workload cluster:

* You must have an active AWS cloud account with all the permissions listed below in the "AWS Cloud Account Permissions" section.
* You must register your AWS cloud account in Spectro Cloud as described in the "Creating an AWS Cloud account" section below.
* You should have an Infrastructure cluster profile created in Spectro Cloud for AWS.
* Spectro Cloud creates compute, network, and storage resources on AWS during the provisioning of Kubernetes clusters. Sufficient capacity in the desired AWS region should exist for the creation of the following resources:
  - vCPU
  - VPC
  - Elastic IP
  - Internet Gateway
  - Elastic Load Balancers
  - NAT Gateway

# AWS Cloud Account Permissions

The following **four** policies include all the required permissions for provisioning clusters through Spectro Cloud:

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

<WarningBox>
Ensure that the role created encompasses all the policies defined above
</WarningBox>

<WarningBox>
These policies cannot be used as an inline policy, as it exceeds the 2048 non-whitespace character limit by AWS.
</WarningBox>

<WarningBox>
The following warning is expected and can be ignored:<p></p>
These policies defines some actions, resources, or conditions that do not provide permissions. To grant access, policies must have an action that has an applicable resource or condition.
</WarningBox>

# Creating an AWS cloud account

To create an AWS cloud account provide a name and a description for the account and follow the steps below based on the account type desired:

* In the AWS console, create the four policies listed above.
* Access Credentials
    - In the AWS console, create a role with all the four policies created in the previous step. Assign this role to the root user or the IAM user to be used from Spectro Cloud.
    - In Spectro Cloud, provide the access key and secret key for the user.
* Security Token Service(STS)
    - In theAWS console, create a new IAM role called using the following options:
      - Trusted Entity Type: Another AWS account
      - Account ID: [Copy the Account ID displayed on the UI]
      - Require External ID: Enable
      - External ID: [Copy the External ID displayed on the UI]
      - Permissions Policy: Search and select the 4 policies added in step #2
      - Role Name: SpectroCloudRole
    - In the AWS console, browse to the role details page and copy the Role ARN
    - In Spectro Cloud, enter the role ARN in the field provided

# Deploying an AWS Cluster

 ![aws-cluster-creation](./cluster-creation-videos/aws.mp4)

The following steps need to be performed to provision a new AWS cluster:

* Provide basic cluster information like name, description, and tags. Tags on a cluster are propagated to the VMs deployed on the cloud/data center environments.
* Select a cluster profile created for AWS cloud. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide the AWS Cloud account and placement information.
    - Cloud Account - Select the desired cloud account. AWS cloud accounts with AWS credentials need to be pre-configured in project settings.
    - Region - Choose the desired AWS region where you would like the clusters to be provisioned.
    - SSH Key Pair Name - Choose the desired SSH Key pair. SSH key pairs need to be pre-configured on AWS for the desired regions. The selected key is inserted into the VMs provisioned.
    - Static Placement - By default, Spectro Cloud uses dynamic placement wherein a new VPC with a public and private subnet is created to place cluster resources for every cluster. These resources are fully managed by Spectro Cloud and deleted when the corresponding cluster is deleted. Turn on the Static Placement option if its desired to place resources into preexisting VPCs and subnets.

<InfoBox>
 The following tags should be added to the public subnet to enable auto subnet discovery for integration with AWS load balancer service.

kubernetes.io/role/elb = 1 <br />
sigs.k8s.io/cluster-api-provider-aws/role = public
kubernetes.io/cluster/[ClusterName] = shared
sigs.k8s.io/cluster-api-provider-aws/cluster/[ClusterName] = owned
</InfoBox>

* Configure the master and worker node pools. A master and a worker node pool are configured by default.
    - Name - a descriptive name for the node pool.
    - Size - Number of VMs to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.
    - Allow worker capability (master pool) - Select this option for allowing workloads to be provisioned on master nodes.
    - Instance type - Select the AWS instance type to be used for all nodes in the node pool.
    - Availability Zones - Choose one or more availability zones. Spectro Cloud provides fault tolerance to guard against failures like hardware failures, network failures, etc. by provisioning nodes across availability zones if multiple zones are selected.

    - By default, worker pools are configured to use On-Demand instances. Optionally, to take advantage of discounted spot instance pricing, the ‘On-Spot’ option can be selected. This option allows you to specify a maximum bid price for the nodes as a percentage of the on-demand price. Spectro Cloud tracks the current price for spot instances and launches nodes when the spot price falls in the specified range.
* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if its desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the ‘m3.large’ instance types for general-purpose workloads, and another worker pool with instance type ‘g2.2xlarge’ can be configured to run GPU workloads.
</InfoBox>


