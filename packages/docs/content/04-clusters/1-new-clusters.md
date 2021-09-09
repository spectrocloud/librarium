---
title: "New Clusters"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
icon: "server"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';



# Creating Clusters

The following steps describe the process of creating new clusters as well as performing Day-2 management operations such as scaling, resizing, reconfiguring etc. on various clouds.

<Tabs identifier="clusterType">

<Tabs. TabPane tab="AWS Cluster" key="aws_cluster">

## Overview

The following is the deployment architecture for an AWS cluster.

The Kubernetes nodes are distributed across multiple AZs to achieve high availability. For each of the AZ's that you choose, a public subnet and a private subnet is created.

All the control plane nodes and worker nodes are created within the private subnets so there is no direct public access available.

A NAT gateway is created in the public subnet of each AZ, to allow nodes in the private subnet to be able to go out to the internet or call other AWS services.

An Internet gateway is created for each VPC, to allow SSH access to the bastion node for debugging purposes. SSH into Kubernetes nodes is only available through the Bastion node. A bastion node helps to provide access to the EC2 instances. This is because the EC2 instances are created in a private subnet and the bastion node operates as a secure, single point of entry into the infrastructure. The bastion node can be accessed via SSH or RDP.

The APIServer endpoint is accessible through an ELB, which load balancing across all the control plane nodes.

![aws_cluster_architecture.png](aws_cluster_architecture.png)

## Prerequisites

Spectro Cloud creates compute, network, and storage resources on AWS during the provisioning of Kubernetes clusters. The following pre-requisites should be met for the successful creation of clusters.

### Resource Capacity

Sufficient capacity in the desired AWS region should exist for the creation of the following resources:

* vCPU
* VPC
* Elastic IP
* Internet Gateway
* Elastic Load Balancers
* NAT Gateway

## AWS Cloud Account Permissions

The first step towards generating AWS Cloud Account Permission is role creation.


Ensure that the IAM user or the ROOT user role created should have the following **four** IAM policies included:


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
The following warning can be expected:<p></p>
These policies defines some actions, resources, or conditions that do not provide permissions. To grant access, policies must have an action that has an applicable resource or condition.
</WarningBox>

Once the role is created an AWS cloud account can be created using any one method:

* Security Token Service(STS)

* Access Credentials

Users can make their choice of method through UI.

### Security Token Service

[STS](https://aws.amazon.com/blogs/security/how-to-use-external-id-when-granting-access-to-your-aws-resources/) method is about granting access to your AWS resources using an IAM role with external ID. Spectro Cloud makes the process extremely simple, just follow the UI instructions once you create the role in AWS.

* Generate your role as per the UI instructions and obtain the ARN.
* Use the generated ARN and validate it to get your AWS cloud account created.

### Access Credentials

* Give the Access key and Secret Access Key for the role generated.
* Validate these credentials to get your AWS cloud account created.

## Create an AWS Cluster

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
 The following tags should be added to the public subnet to enable auto subnet discovery for integration with aws load balancer service.

kubernetes.io/role/elb = 1
sigs.k8s.io/cluster-api-provider-aws/role = public
kubernetes.io/cluster/[ClusterName] = shared
sigs.k8s.io/cluster-api-provider-aws/cluster/[ClusterName] = owned
</InfoBox>

* Configure the master and worker node pools. A master and a worker node pool are configured by default.
    - Name - a descriptive name for the node pool.
    - Size - Number of VMs to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.
    - Allow worker capability (master pool) - Select this option for allowing workloads to be provisioned on master nodes.
    - Instance type - Select the AWS instance type to be used for all nodes in the node pool.
    - Availability Zones - Choose one or more availability zones. Spectro Cloud provides fault tolerance to guard against failures like hardware failures, network failures, etc. by provisioning nodes across availability

    zones if multiple zones are selected.

    - By default, worker pools are configured to use On-Demand instances. Optionally, to take advantage of discounted spot instance pricing, the ‘On-Spot’ option can be selected. This option allows you to specify a maximum bid price for the nodes as a percentage of the on-demand price. Spectro Cloud tracks the current price for spot instances and launches nodes when the spot pricefalls in the specified range.
* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if its desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the ‘m3.large’ instance types for general-purpose workloads, and another worker pool with instance type ‘g2.2xlarge’ can be configured to run GPU workloads.
</InfoBox>



</Tabs. TabPane>

<Tabs. TabPane tab="Azure Cluster" key="azure_cluster">

## Overview

Azure cluster resources are placed within an existing Resource Group, and nodes will be provisioned within a Virtual Network that is either auto-created or preexisting, with one subnet for control plane nodes and one for worker nodes. These two subnets are secured with separate Network Security Groups. Both subnets can span across multiple AZs.  Worker nodes will be distributed across multiple AZs.

None of the control plane nodes and worker nodes have public IPs attached. The APIServer endpoint is accessed through a public LB.

![azure_cluster_architecture.png](azure_cluster_architecture.png)

## Creating an Azure cloud account

To create an Azure cloud account, we need:

* Client ID
* Tenant ID
* Client secret

For this, we first need to create an Azure Active Directory (AAD) Application which can be used with role-based access control. Follow the steps to get the required details:

* To create an AAD Application from the Azure portal, follow the [Create a new AAD Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) link. With this, the ClientID and TenantID are created and can be noted down.
* On creating the application, a minimum required [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) needs to be assigned. To assign any kind of role, the user must have a minimum role of [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator). The role can be assigned by following the [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) link.
* To create the client secret, [Create an Application Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret). Store the Client Secret safely as it will not be available in plaintext later.

## Creating an Azure Cluster

The following steps need to be performed to provision a new Azure cluster:

* Provide the basic cluster information like name, description, and tags.
* Select a cluster profile created for the Azure environment. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide the Azure Cloud account and placement information.
    - Cloud Account - Select the desired cloud account. Azure cloud accounts with credentials need to be pre-configured in project settings.
    - Subscription - Select the subscription which is to be used to access Azure Services.
    - Region - Select a region in Azure in which the cluster should be deployed.
    - Resource Group - Select the resource group in which the cluster should be deployed.
    - SSH Key - Public key to configure remote SSH access to the nodes.
* Configure the master and worker node pools. A master and a worker node pool are configured by default.
    - Name - A descriptive name for the node pool.
    - Size - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.
    - Allow worker capability (master pool) - To allow workloads to be provisioned on master nodes.
    - Instance Type - Select the Azure instance type to be used for all the nodes in the pool.
    - Managed Disk - Select the managed disk type to be used.
    - Disk Size - Storage disk size in GB to be attached to the node.
    - Availability Zones - Choose one or more availability zones. Spectro Cloud provides fault tolerance to guard against failures like hardware failures, network failures, etc. by provisioning nodes across availability zones if multiple zones are selected. Zones are supported only for worker pools.

* Review the settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if its desired to customize certain worker nodes to run specialised workloads. As an example, the default worker pool may be configured with the ‘Standard_D2_v2’ instance types for general-purpose workloads and another worker pool with instance type ‘Standard_NC12s_v3’ can be configured to run GPU workloads.
</InfoBox>


</Tabs. TabPane>

<Tabs. TabPane tab="GCP Cluster" key="google_cloud_cluster">

## Overview

On the GCP cluster, control plane nodes and worker nodes are placed within a single private subnet which spans across different availability zones within a region.

A new VPC Network is created together with all the network infrastructure components like Cloud NAT and a Cloud Router. Firewall rules are created to protect all the API endpoints.

API server endpoint is exposed through a Global Load Balancer. Applications running with the cluster use a Regional Load Balancer to expose the load-balancer services.

![gcp_cluster_architecture.png](gcp_cluster_architecture.png)

## Creating a GCP Cloud Account

To create a GCP cloud account, you need the JSON credentials (service account key) file of the service account.

To create a service account, the user should have one of the following IAM roles:
`roles/iam.serviceAccountAdmin` or `roles/iam.serviceAccountAdmin` .

To create a service account, refer to https://cloud.google.com/iam/docs/creating-managing-service-accounts.

There are two options to create a service account, either use existing standard roles, or create a new role with custom permissions.

### Create Service Account with existing standard roles

The service account should have the following roles:

1. Compute Admin
1. Service Account User
1. Storage Object Viewer

### Create Service Account with a new role with custom permissions

The custom new role should include these minimum permissions

```
compute.backendServices.create
compute.backendServices.delete
compute.backendServices.get
compute.backendServices.list
compute.backendServices.update
compute.backendServices.use
compute.disks.create
compute.firewalls.create
compute.firewalls.delete
compute.firewalls.get
compute.firewalls.list
compute.globalAddresses.create
compute.globalAddresses.delete
compute.globalAddresses.get
compute.globalAddresses.list
compute.globalAddresses.use
compute.globalForwardingRules.create
compute.globalForwardingRules.delete
compute.globalForwardingRules.get
compute.globalForwardingRules.list
compute.healthChecks.create
compute.healthChecks.delete
compute.healthChecks.get
compute.healthChecks.list
compute.healthChecks.useReadOnly
compute.instanceGroups.create
compute.instanceGroups.delete
compute.instanceGroups.get
compute.instanceGroups.list
compute.instanceGroups.update
compute.instanceGroups.use
compute.instances.create
compute.instances.delete
compute.instances.get
compute.instances.list
compute.instances.setLabels
compute.instances.setMetadata
compute.instances.setServiceAccount
compute.instances.setTags
compute.instances.use
compute.networks.create
compute.networks.delete
compute.networks.get
compute.networks.list
compute.networks.updatePolicy
compute.regions.get
compute.regions.list
compute.routers.create
compute.routers.delete
compute.routers.get
compute.routes.delete
compute.routes.get
compute.routes.list
compute.subnetworks.create
compute.subnetworks.delete
compute.subnetworks.get
compute.subnetworks.list
compute.subnetworks.use
compute.targetTcpProxies.create
compute.targetTcpProxies.delete
compute.targetTcpProxies.get
compute.targetTcpProxies.use
compute.zones.get
compute.zones.list
iam.serviceAccounts.actAs
iam.serviceAccounts.get
iam.serviceAccounts.list
resourcemanager.projects.get
resourcemanager.projects.list
storage.objects.get
storage.objects.list
```

The process of creating the JSON credential files is available here: https://cloud.google.com/iam/docs/creating-managing-service-account-keys.

</Tabs. TabPane>

<Tabs. TabPane tab="VMware Cluster" key="vmware_cluster">

## Overview

The Spectro Cloud management platform does not need direct access to the VMware environment. A Private Cloud Gateway needs to be set up within the VMware environment, to facilitate  communication between the Spectro Cloud management platform and vCenter, to create and delete target Kubernetes clusters.

The Private Gateway supports going through an optional Proxy server to talk to Spectro Cloud. If the Gateway is configured to use a proxy, the Proxy server needs to support HTTP(S) proxy.

If the IP allocation type is DHCP, an HAProxy Load balancer VM will be created for each of the Kubernetes clusters as the LB for the apiserver endpoints. If the IP allocation type is Static IP, a VIP(virtual IP address) will be selected from the master ippool and allocated to the cluster instead of the loadbalancer.

![vmware_arch_oct_2020.png](vmware_arch_oct_2020.png)

## Prerequisites

* Minimum capacity required for tenant clusters: ~26 vCPU, 50GB memory, 600GB storage.
* Minimum capacity required for a Private Cloud Gateway:
  + 1 node - 2 vCPU, 4GB memory, 30GB storage.
  + 3 nodes - 6 vCPU, 12GB memory, 70GB storage.
* Per tenant cluster IP requirements:
    - 1 per node.
    - 1 Kubernetes control-plane VIP.
    - 1 Kubernetes control-plane extra.
* Private cloud gateway IP requirements:
    - 1 node - 1 IP or 3 nodes - 3 IPs.
    - 1 Kubernetes control-plane VIP.
    - 1 Kubernetes control-plane extra.
* IPs for application workload services (e.g.: LoadBalancer services).
* Subnet with egress access to the internet (direct or via proxy):
    - For proxy: HTTP_PROXY, HTTPS_PROXY (both required).
    - Outgoing internet connection on port 443 to api.spectrocloud.com.
* DNS to resolve public internet names (e.g.: api.spectrocloud.com).
* vSphere [6.7U3](https://docs.vmware.com/en/VMware-vSphere/6.7/rn/vsphere-esxi-67u3-release-notes.html) or later (recommended).
* NTP configured on all Hosts.
* Shared Storage between vSphere hosts.
* VMware vCenter [permissions](https://docs.spectrocloud.com/clusters?clusterType=vmware_cluster#permissions).

## Configuration Requirements

A Resource Pool needs to be configured across the hosts, onto which the workload clusters will be provisioned. Every host in the Resource Pool will need access to shared storage, such as VSAN, in order to be able to make use of high-availability control planes. Network Time Protocol (NTP) must be configured on each of the ESXi hosts.

## Permissions

The vSphere user account used in the various Spectro Cloud tasks must have the minimum vSphere privileges required to perform the task. The `Administrator` role provides super-user access to all vSphere objects. For users without the `Administrator` role, one or more custom roles can be created based on the tasks being performed by the user.

| vSphere Object | Privileges |
| --- | --- |
| Datastore | Allocate Space |
| | Browse Datastore |
| | Low level file operations |
| | Remove file |
| | Update virtual machine files |
| | Update virtual machine metadata |
| Folder | Create folder |
| | Delete folder |
| | Move folder |
| | Rename folder|
| Network | Assign Network |
| Resource | Apply recommendation
| | Assign virtual machine to resource pool |
| | Migrate powered off virtual machine |
| | Migrate powered on virtual machine |
| | Query vMotion |
| Sessions| Validate session |
| Storage views | View|
| Tasks | Create task |
| | Update Task |
| Virtual Machines | Change Configuration |
| | * Change Settings |
| | * Change Swapfile Placement
| | * Configure host USB device
| | * Configure raw device
| | * Add existing disk
| | * Add new disk
| | * Add or remove device
| | * Advanced configuration
| | * Change CPU count
| | * Change resource
| | * Configure managedBy
| | * Display connection settings
| | * Extend virtual disk
| | * Modify device settings
| | * Query Fault Tolerance compatibility
| | * Query unowned files
| | * Reload from path
| | * Remove disk
| | * Rename
| | * Reset guest information
| | * Set annotation
| | * Toggle fork parent
| | * Upgrade virtual machine compatibility
| | Guest operations
| | * Guest operation alias modification
| | * Guest operation alias query
| | * Guest operation modifications
| | * Guest operation program execution
| | * Guest operation queries
| | Interaction
| | * Power off
| | * Power on
| | Inventory
| | * Create from existing
| | * Create new
| | * Move
| | * Remove
| | Provisioning
| | * Allow disk access
| | * Allow file access
| | * Allow read-only disk access
| | * Allow virtual machine download
| | * Allow virtual machine files upload
| | * Clone template
| | * Clone virtual machine
| | * Create template from virtual machine
| | * Customize guest
| | * Deploy template
| | * Mark as template
| | * Mark as virtual machine
| | * Modify customization specification
| | * Promote disks
| | * Read customization specifications
| | Service Configuration
| | * Allow notifications
| | * Allow polling of global event notifications
| | * Manage service configurations
| | * Modify service configuration
| | * Query service configurations
| | * Read service configuration
| | Snapshot management
| | * Create snapshot
| | * Remove snapshot
| | * Rename snapshot
| | * Revert to snapshot
| | vSphere Replication
| | * Configure replication
| | * Manage replication
| | * Monitor replication
| vApp | Import
| | View OVF environment
| | vApp application configuration
| | vApp instance configuration
| vSphere Tagging| Create vSphere Tag
| | Edit vSphere Tag


## Creating a VMware cloud gateway

<InfoBox>
For Enterprise version users, a system gateway is provided out of the box. However, additional gateways can be created as needed to isolate datacenters.
</InfoBox>

Setting up a cloud gateway involves initiating the install from the tenant portal, deploying gateway installer VM in vSphere, and launching the cloud gateway from the tenant portal.

By default, 4GB of memory is allocated for private gateways. Please ensure that this memory allocation is increased based on the number of clusters that need to be created.

## Tenant Portal - Initiate Install

<InfoBox>
This step does not apply to Enterprise version users.
</InfoBox>

* As a tenant administrator, navigate to the *Private Cloud Gateway* page under settings and invoke the dialogue to create a new private cloud gateway.
* Note down the link to the Spectro Cloud Gateway Installer OVA and PIN displayed on the dialogue.

## vSphere - Deploy Gateway Installer

<InfoBox>

This step does not apply to Enterprise version users.

</InfoBox>

* Initiate deployment of a new OVF template by providing a link to the installer OVA as the URL.
* Proceed through the OVF deployment wizard by choosing the desired name, placement, compute, storage, and network options.
* At the 'Customize Template' step, specify Spectro Cloud properties as follows:

| Parameter | Value | Remarks |
|---|---|---|
|Installer Name | Desired Spectro Cloud Gateway Name | The name will be used to identify the gateway instance. Typical environments may only require a single gateway to be set up, however, multiple gateways might be required for managing clusters in multiple vCenters. Choose a name that can easily identify the environment that this gateway instance is being configured for.|
| Console endpoint | URL to Spectro Cloud management platform portal | https://console.spectrocloud.com by default |
|Pairing Code | PIN displayed on the Spectro Cloud management platform portal's 'Create a new gateway' dialogue. | |
| SSH Public Key | Optional key, useful for troubleshooting purposes (Recommended) | Enables SSH access to the VM as 'ubuntu' user |
| Pod CIDR | Optional - IP range exclusive to pods | This range should be different to prevent an overlap with your network CIDR. |
| Service cluster IP range | Optional - IP range in the CIDR format exclusive to the service clusters | This range also must not overlap with either the pod CIDR or your network CIDR. |

Additional properties that are required to be set only for a Proxy Environment. Each of the proxy properties may or may not have the same value but all the three properties are mandatory.

| Parameter | Value | Remarks |
|---|---|---|
|HTTP PROXY | The endpoint for the HTTP proxy server | This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME: PASSWORD@PROXYIP: PROXYPORT |
| HTTPS PROXY | The endpoint for the HTTPS proxy server | This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME: PASSWORD@PROXYIP: PROXYPORT |
| NO Proxy | A comma-separated list of vCenter server, local network CIDR, hostnames, domain names that should be excluded from proxying | This setting will be propagated to all the nodes to bypass the proxy server . Eg., vcenter.company.com, .company.org, 10.10.0.0/16 |

* Finish the OVF deployment wizard and wait for the OVA to be imported and Virtual Machine to be deployed.
* Power on the Virtual Machine.

## Tenant Portal - Launch Cloud Gateway

* Close the 'Create New Gateway' dialogue if still open or navigate to the Private Cloud Gateway page under settings in case you have navigated away or been logged out.
* Wait for a gateway widget to be displayed on the page and for the "Configure" option to be available. The IP address of the installer VM will be displayed on the gateway widget. This may take a few minutes after the virtual machine is powered on. Failure of the installer to register with the Spectro Cloud management platform portal within 10 mins of powering on the Virtual Machine on vSphere, might be indicative of an error. Please follow the troubleshooting steps to identify and resolve the issue.
* Click on the "Configure" button to invoke the Spectro Cloud Configuration dialogue. Provide vCenter credentials and proceed to the next configuration step.
* Choose the desired values for Datacenter, Compute Cluster, Datastore, Network, Resource pool, and Folder. Optionally provide one or more SSH Keys and/or NTP server addresses.
* Choose the IP Allocation Scheme - Static IP or DHCP. If static IP is selected, an option to create an IP pool is enabled. Proceed to create an IP pool by providing an IP range (start and end IP addresses) or a subnet. The IP addresses from this IP Pool will be assigned to the gateway cluster. By default, the IP Pool is available for use by other tenant clusters. This can be prevented by enabling the "*Restrict to a single cluster*" button. A detailed description of all the fields involved in the creation of an IP pool can be found [here](/clusters?clusterType=vmware_cluster#ipaddressmanagement).
* Click on Confirm, to initiate provisioning of the gateway cluster. The status of the cluster on the UI should change to 'Provisioning' and eventually 'Running' when the gateway cluster is fully provisioned. This process might take several minutes (typically 8 to 10 mins). You can observe a detailed provisioning sequence on the cluster details page, by clicking on the gateway widget on the UI. If provisioning of the gateway cluster runs into errors or gets stuck, relevant details can be found on the summary tab or the events tab of the cluster details page. In certain cases where provisioning of the gateway cluster is stuck or failed due to invalid configuration, the process can be reset from the Cloud Gateway Widget on the UI.
* Once the Gateway transitions to the 'Running' state, it is fully provisioned and ready to bootstrap tenant cluster requests.

## vSphere - Clean up installer

* Power off installer OVA which was initially imported at the start of this installation process.

<InfoBox>
Gateway cluster installation automatically creates a cloud account behind the scenes using the credentials entered at the time of deploying the gateway cluster. This account may be used for the provisioning of clusters across all tenant Projects.<p></p>
A Pack registry instance is set up on the gateway cluster by default and it is registered as a private pack registry under Settings/Pack Registries. You can read more about Pack Registries <a href="/registries-and-packs">here</a>.
</InfoBox>

## Troubleshooting

### Gateway installer - Unable to register with the tenant portal

The installer VM, when powered on, goes through a bootstrap process and registers itself with the tenant portal. This process typically takes 5 to 10 mins. Failure of the installer to  register with the tenant portal within this duration might be indicative of a bootstrapping error. SSH into the installer virtual machine using the key provided during OVA import and inspect the log file located at *'/var/log/cloud-init-output.log'*. This log file will contain error messages in the event there are failures with connecting to the Spectro Cloud management platform portal, authenticating, or downloading installation artifacts. A common cause for these errors is that the Spectro Cloud management platform console endpoint or the pairing code is typed incorrectly. Ensure that the tenant portal console endpoint does not have a trailing slash. If these properties were incorrectly specified, power down and delete the installer VM and re-launch with the correct values.

Another potential issue is a lack of outgoing connectivity from the VM. The installer VM needs to have outbound connectivity directly or via a proxy. Adjust proxy settings (if applicable) to fix the connectivity or power down and delete the installer VM and relaunch in a network that enables outgoing connections.

If the above steps do not resolve your issues, copy the following script to the installer VM and execute to generate a logs archive. Open a support ticket and attach the logs archive to the ticket to allow the Spectro Cloud Support team to troubleshoot and provide further guidance:

``` bash
#!/bin/bash

DESTDIR="/tmp/"

CONTAINER_LOGS_DIR="/var/log/containers/"
CLOUD_INIT_OUTPUT_LOG="/var/log/cloud-init-output.log"
CLOUD_INIT_LOG="/var/log/cloud-init.log"
KERN_LOG="/var/log/kern.log"
KUBELET_LOG="/tmp/kubelet.log"
SYSLOGS="/var/log/syslog*"

FILENAME=spectro-logs-$(date +%-Y%-m%-d)-$(date +%-HH%-MM%-SS).tgz

journalctl -u kubelet > $KUBELET_LOG

tar --create --gzip -h --file=$DESTDIR$FILENAME $CONTAINER_LOGS_DIR $CLOUD_INIT_LOG $CLOUD_INIT_OUTPUT_LOG $KERN_LOG $KUBELET_LOG $SYSLOGS

retVal=$?
if [ $retVal -eq 1 ]; then
    echo "Error creating spectro logs package"
else
	echo "Successfully extracted spectro cloud logs: $DESTDIR$FILENAME"
fi
```

### Gateway Cluster - Provisioning stalled/failure

Installation of the gateway cluster may run into errors or might get stuck in the provisioning state for a variety of reasons like lack of infrastructure resources, IP addresses not being available, unable to perform NTP sync, etc. While these are most common, some of the other issues might be related to the underlying VMware environment. The Cluster Details page, which can be accessed by clicking anywhere on the gateway widget, contains details of every orchestration step including an indication of the current task being executed. Any intermittent errors will be displayed on this page next to the relevant orchestration task. The events tab on this page also provides a useful resource to look at lower-level operations being performed for the various orchestration steps. If you think that the orchestration is stuck or failed due to an invalid selection of infrastructure resources or an intermittent problem with the infrastructure, you may reset the gateway by clicking on the 'Reset' button on the gateway widget. This will reset the gateway state to 'Pending' allowing you to reconfigure the gateway and start provisioning of a new gateway cluster. If the problem persists, please contact Spectro support via the Service Desk.

## Upgrading a VMware cloud gateway

Spectro Cloud maintains the OS image and all configurations for the cloud gateway. Periodically, the OS images, configurations, or other components need to be upgraded to resolve security or functionality issues. Spectro Cloud releases such upgrades when required and communication about the same is presented in the form of an upgrade notification on the gateway.

Administrators should review the changes and apply them at a suitable time. Upgrading a cloud gateway does not result in any downtime for the tenant clusters. During the upgrade process, the provisioning of new clusters might be temporarily unavailable. New cluster requests are queued while the gateway is being upgraded, and are processed as soon as the gateway upgrade is complete.

## Deleting a VMware cloud gateway

The following steps need to be performed to delete a cloud gateway:

* As a tenant administrator, navigate to the *Private Cloud Gateway* page under settings.
* Invoke the ‘Delete’ action on the cloud gateway instance that needs to be deleted.
* The system performs a validation to ensure there are no running tenant clusters associated with the gateway instance being deleted. If such instances are found, the system presents an error. Delete relevant running tenant clusters and retry the deletion of the cloud gateway.
* Delete the gateway Virtual Machines from vSphere.

## Resizing a VMware cloud gateway

A Cloud gateway can be set up as a 1-node or a 3-node cluster.  For production environments, it is recommended that 3 nodes are set up. A cloud gateway can be initially set up with 1 node and resized to 3 nodes at a later time. The following steps need to be performed to resize a 1-node cloud gateway cluster to a 3-node gateway cluster:

* As a tenant administrator, navigate to the *Private Cloud Gateway* page under settings.

* Invoke the resize action for the relevant cloud gateway instance.

* Update the size from 1 to 3.

* The gateway upgrade begins shortly after the update. Two new nodes are created on vSphere and the gateway is upgraded to a 3-node cluster.

<InfoBox>
Scaling a 3-node cluster down to a 1-node cluster is not permitted.<p></p> A load balancer instance is launched even for a 1-node gateway to support future expansion.
</InfoBox>

## IP Address Management

Spectro cloud supports DHCP as well as Static IP based allocation strategies for the VMs that are launched during cluster creation. IP Pools can be defined using a range or a subnet. Administrators can define one or more IP pools linked to a private cloud gateway. Clusters created using a private cloud gateway can select from the IP pools linked to the corresponding private cloud gateway. By default, IP Pools are be shared across multiple clusters, but can optionally be restricted to a cluster. The following is a description of various IP Pool properties:

| Property | Description |
|---|---|
| Name | Descriptive name for the IP Pool. This name will be displayed for IP Pool selection when static IP is chosen as the IP allocation strategy |
| Network Type | Select 'Range' to provide a start and an end IP address. IPs within this range will become part of this pool. Alternately select 'Subnet' to provide the IP range in CIDR format.|
| Start | First IP address for a range based IP Pool E.g. 10.10.183.1|
| End | Last IP address for a range based IP Pool.  E.g. 10.10.183.100 |
| Subnet | CIDR to allocate a set of IP addresses for a subnet based IP Pool.  E.g. 10.10.183.64/26 |
| Subnet Prefix | Network subnet prefix. E.g. /18|
| Gateway | Network Gateway E.g. 10.128.1.1 |
| Nameserver addresses | A comma-separated list of name servers. Eg. 8.8.8.8 |
| Restrict to a Single Cluster | Select this option to reserve the pool for the first cluster that uses this pool. By default, IP pools can be shared across clusters.|

## Creating a VMware cloud account

<InfoBox>
Configuring the private cloud gateway is a prerequisite task. A default cloud account is created when the private cloud gateway is configured. This cloud account can be used to create a cluster.
</InfoBox>

<InfoBox>
Enterprise version users should choose the <i>"Use System Gateway"</i> option.
</InfoBox>

In addition to the default cloud account already associated with the private cloud gateway, new user cloud accounts can be created for the different vSphere users.

| Property | Description |
|---|---|
|Account Name | Custom name for the cloud account |
| Private cloud gateway | Reference to a running cloud gateway|
| vCenter Server | IP or FQDN of the vCenter server|
| Username | vCenter username|
| Password | vCenter password|

## Creating a VMware Cluster

The following steps need to be performed to provision a new VMware cluster:

* Provide basic cluster information like name, description, and tags. Tags are currently not propagated to the VMs deployed on the cloud/data center environments.
* Select a cluster profile created for the VMware environment. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide a vSphere Cloud account and placement information.
    - Cloud Account - Select the desired cloud account. VMware cloud accounts with credentials need to be pre-configured in project settings. An account is auto-created as part of the cloud gateway setup and is available for provisioning of tenant clusters if permitted by the administrator.
    - Datacenter -The vSphere datacenter where the cluster nodes will be launched.
    - Folder - The vSphere VM Folder where the cluster nodes will be launched.
    - SSH Keys (Optional) - Public key to configure remote SSH access to the nodes (User: spectro).
    - NTP Server (Optional) - Setup time synchronization for all the running nodes.
    - IP Allocation strategy - DHCP or Static IP
* Configure the master and worker node pools. A master and a worker node pool are configured by default.
    - Name - A descriptive name for the node pool.
    - Size - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, or 5.
    - Allow worker capability (master pool) - To workloads to be provisioned on master nodes.
    - CPU - Number of CPUs to be allocated to the nodes.
    - Memory - Amount of memory in GB to be allocated to the nodes.
    - Disk - Storage disk size in GB to be attached to the node.
    - One or more placement domains. VMs are distributed across multiple placement domains on a round-robin basis. Currently, only one placement domain is supported for a master pool.
	    * Compute Cluster - A Compute cluster under the selected Datacenter.
	    * Datastore - The vSphere storage in the selected Datacenter.
	    * Network - The vSphere Network in the selected Datacenter, to enable connectivity for the cluster nodes.
	    * Resource Pool- The vSphere resource pool where the cluster nodes will be launched.
	    * IP Pool - An IP pool to be used for allocation IP addresses to cluster VMs. Required only for Static IP allocation. IP pools need to be predefined for private cloud gateways.

* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if it is desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with 4 CPUs, 8GB of memory for general-purpose workloads, and another worker pool with 8CPU, 16 GB of memory for advanced workloads that demand larger resources.
</InfoBox>

## Deleting a VMware Cluster

The deletion of a VMware cluster results in the removal of all Virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete a VMware cluster:

* Select the cluster to be deleted from the cluster view and navigate to the cluster overview page
* Invoke a delete action available on the page
* Confirm delete action
* Cluster status is updated to ‘Deleting’ while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to ‘Deleted’ and it is removed from the list of clusters.

<InfoBox>
Delete action is only available for clusters that are fully provisioned. For clusters that are still in the process of being provisioned, ‘Abort’ action is available to stop provisioning and delete all resources.
</InfoBox>


</Tabs. TabPane>

<Tabs. TabPane tab="EKS Cluster" key="eks_cluster">

## Overview

Spectro Cloud supports EKS to manage services that can run Kubernetes on AWS without needing to install, operate, and maintain Kubernetes control plane or nodes. This ensures high availability, scalability, security and automated patching to tenant clusters. It runs up-to-date versions of Kubernetes, in addition to the existing plugins and tooling available. Applications that are running on Amazon EKS are fully compatible with any standard environment. Hence migrating your application workload to EKS can happen without any code change. For individual tenant clusters EKS runs a single Kubernetes control plane. The control plane infrastructure is not shared across clusters or AWS accounts. The control plane consists of at least two API server instances and three etcd instances that run across three Availability Zones within a Region.

 ![eks_cluster_architecture.png](eks_cluster_architecture.png)

## Prerequisites

Spectro Cloud creates compute, network, and storage resources for EKS during the provisioning of Kubernetes clusters. The following pre-requisites should be met for the successful creation of clusters.

### Resource Capacity

Sufficient capacity in the desired AWS region should exist for the creation of the following resources:

* vCpu
* VPC
* Elastic IP
* Internet Gateway
* Elastic Load Balancers
* NAT Gateway

## AWS Cloud Account Permissions

The first step towards generating AWS Cloud Account Permission is role creation.

Ensure that the IAM user or the ROOT user role created should have the following **four** policies included:

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
<InfoBox>
Note:
All the above policies are required as part of cluster api requirement derived using https://cluster-api-aws.sigs.k8s.io/clusterawsadm/clusterawsadm_bootstrap_iam_print-policy.html
</InfoBox>

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
The following warning can be expected:<p></p>
These policies defines some actions, resources, or conditions that do not provide permissions. To grant access, policies must have an action that has an applicable resource or condition.
</WarningBox>

Once the role is created an AWS cloud account can be created using any one method:

* Security Token Service(STS)

* Access Credentials

Users can make their choice of method through UI.

### Security Token Service

[STS](https://aws.amazon.com/blogs/security/how-to-use-external-id-when-granting-access-to-your-aws-resources/) method is about granting access to your AWS resources using an IAM role with external ID. Spectro Cloud makes the process extremely simple, just follow the UI instructions once you create the role in AWS.

* Generate your role as per the UI instructions and obtain the ARN.
* Use the generated ARN and validate it to get your AWS cloud account created.

### Access Credentials

* Give the Access key and Secret Access Key for the role generated.
* Validate these credentials to get your AWS cloud account created.

## Create an EKS Cluster

The following steps need to be performed to provision a new EKS cluster:

* Provide basic cluster information like name, description, and tags. Tags on a cluster are propagated to the VMs deployed on the cloud/data center environments.
* Select a cluster profile created for EKS cloud. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide the AWS Cloud account and placement information.
    - Cloud Account - Select the desired cloud account. AWS cloud accounts with AWS credentials need to be pre-configured in project settings.
    - Region - Choose the desired AWS region where you would like the clusters to be provisioned.
    - SSH Key Pair Name - Choose the desired SSH Key pair. SSH key pairs need to be pre-configured on AWS for the desired regions. The selected key is inserted into the VMs provisioned.
    - Static Placement - By default, Spectro Cloud uses dynamic placement wherein a new VPC with a public and private subnet is created to place cluster resources for every cluster. These resources are fully managed by Spectro Cloud and deleted when the corresponding cluster is deleted. Turn on the Static Placement option if it is desired to place resources into preexisting VPCs and subnets.

<InfoBox>
The following tags should be added to the public subnet to enable auto subnet discovery for integration with AWS load balancer service.

kubernetes.io/role/elb = 1
sigs.k8s.io/cluster-api-provider-aws/role = public
kubernetes.io/cluster/[ClusterName] = shared
sigs.k8s.io/cluster-api-provider-aws/cluster/[ClusterName] = owned
</InfoBox>

* Configure one or more worker node pools. A worker node will be  configured by default.
    - Name - a descriptive name for the node pool.
    - Size - Make your choice of minimum, maximum and desired sizes for the worker pool. The size of the instances will scale between the minimum and maximum size under varying workload conditions.
    - Instance type - Select the AWS instance type to be used for all nodes in the node pool.

* Optionally creates one or more Fargate Profiles to aid the provisioning of on-demand, optimized compute capacity for the workload clusters.
    - Name - Provide a name for the Fargate profile.
    - Subnets - Pods running on Fargate Profiles are not assigned public IP addresses, so only private subnets (with no direct route to an Internet Gateway) are accepted for this parameter. For dynamic provisioning, this input is not required and subnets are automatically selected.
    - Selectors - Define pod selector by providing a target namespace and optionally labels. Pods with matching namespace and app labels are scheduled to run on dynamically provisioned compute nodes. You can have up to five selectors in a Fargate profile and a pod only needs to match one selector to run using the Fargate profile.

* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

<InfoBox>
New worker pools may be added if it is desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the ‘m3.large’ instance types for general-purpose workloads, and another worker pool with instance type ‘g2.2xlarge’ can be configured to run GPU workloads.
</InfoBox>

</Tabs. TabPane>



<Tabs. TabPane tab="OpenStack Cluster" key="openstack-cluster">

## Overview

Spectro Cloud supports provisioning Kubernetes clusters in OpenStack, a modular cloud infrastructure that runs off standard hardware and is capable of running large pools of compute, storage, and networking resources managed and provisioned with refined authentication mechanisms.

A Private Cloud Gateway needs to be set up within the environment, to facilitate communication between the Spectro Cloud management platform and the OpenStack environment. The gateway establishes a secure communication channel with the management console thereby eliminating the need for an incoming connection into the OpenStack environment.


![openstack_cluster_architecture.png](openstack_cluster_architecture.png)

## Prerequisites
* Minimum capacity required for a Private Cloud Gateway:
    * 1 node - 2 vCPU, 4GB memory, 30GB storage.
    * 3 nodes - 6 vCPU, 12GB memory, 90GB storage.
* Private cloud gateway IP requirements:
    * 1 node - 1 IP or 3 nodes - 3 IPs.
    * 1 Kubernetes control-plane
    * 1 additional IP for rollowing upgrades.
* Per tenant cluster floating IP requirements:
    * 1 per node.
    * 1 Kubernetes API Server.
    * 1 additional per node pool for rolloing upgrade
* IPs for application workload services (e.g.: Load Balancer services).
* Subnet with egress access to the internet (direct or via proxy):
    * For proxy: HTTP_PROXY, HTTPS_PROXY (both required).
    * Outgoing internet connection on port 443 to api.spectrocloud.com.
* DNS to resolve public internet names (e.g.: api.spectrocloud.com).
* OpenStack Victoria (recommended).
* NTP configured on all Hosts.
* Shared Storage between OpenStack hosts.


## Permissions


### Cinder Service

``` json

"volume:attachment_update": "rule:admin_or_owner"
"volume:attachment_delete": "rule:admin_or_owner"
"volume:attachment_complete": "rule:admin_or_owner"
"volume:multiattach_bootable_volume": "rule:admin_or_owner"
"message:get_all": "rule:admin_or_owner"
"message:get": "rule:admin_or_owner"
"message:delete": "rule:admin_or_owner"
"volume:get_snapshot_metadata": "rule:admin_or_owner"
"volume:update_snapshot_metadata": "rule:admin_or_owner"
"volume:delete_snapshot_metadata": "rule:admin_or_owner"
"volume:get_all_snapshots": "rule:admin_or_owner"
"volume_extension:extended_snapshot_attributes": "rule:admin_or_owner"
"volume:create_snapshot": "rule:admin_or_owner"
"volume:get_snapshot": "rule:admin_or_owner"
"volume:update_snapshot": "rule:admin_or_owner"
"volume:delete_snapshot": "rule:admin_or_owner"
"backup:get_all": "rule:admin_or_owner"
"backup:get": "rule:admin_or_owner"
"backup:update": "rule:admin_or_owner"
"backup:delete": "rule:admin_or_owner"
"backup:restore": "rule:admin_or_owner"
"group:get_all": "rule:admin_or_owner"
"group:get": "rule:admin_or_owner"
"group:update": "rule:admin_or_owner"
"group:get_all_group_snapshots": "rule:admin_or_owner"
"group:get_group_snapshot": "rule:admin_or_owner"
"group:delete_group_snapshot": "rule:admin_or_owner"
"group:update_group_snapshot": "rule:admin_or_owner"
"group:reset_group_snapshot_status": "rule:admin_or_owner"
"group:delete": "rule:admin_or_owner"
"group:enable_replication": "rule:admin_or_owner"
"group:disable_replication": "rule:admin_or_owner"
"group:failover_replication": "rule:admin_or_owner"
"group:list_replication_targets": "rule:admin_or_owner"
"volume_extension:quotas:show": "rule:admin_or_owner"
"limits_extension:used_limits": "rule:admin_or_owner"
"volume_extension:volume_type_access": "rule:admin_or_owner"
"volume:extend": "rule:admin_or_owner"
"volume:extend_attached_volume": "rule:admin_or_owner"
"volume:revert_to_snapshot": "rule:admin_or_owner"
"volume:retype": "rule:admin_or_owner"
"volume:update_readonly_flag": "rule:admin_or_owner"
"volume_extension:volume_actions:upload_image": "rule:admin_or_owner"
"volume_extension:volume_actions:initialize_connection": "rule:admin_or_owner"
"volume_extension:volume_actions:terminate_connection": "rule:admin_or_owner"
"volume_extension:volume_actions:roll_detaching": "rule:admin_or_owner"
"volume_extension:volume_actions:reserve": "rule:admin_or_owner"
"volume_extension:volume_actions:unreserve": "rule:admin_or_owner"
"volume_extension:volume_actions:begin_detaching": "rule:admin_or_owner"
"volume_extension:volume_actions:attach": "rule:admin_or_owner"
"volume_extension:volume_actions:detach": "rule:admin_or_owner"
"volume:get_all_transfers": "rule:admin_or_owner"
"volume:create_transfer": "rule:admin_or_owner"
"volume:get_transfer": "rule:admin_or_owner"
"volume:delete_transfer": "rule:admin_or_owner"
"volume:get_volume_metadata": "rule:admin_or_owner"
"volume:create_volume_metadata": "rule:admin_or_owner"
"volume:update_volume_metadata": "rule:admin_or_owner"
"volume:delete_volume_metadata": "rule:admin_or_owner"
"volume_extension:volume_image_metadata": "rule:admin_or_owner"
"volume:get": "rule:admin_or_owner"
"volume:get_all": "rule:admin_or_owner"
"volume:update": "rule:admin_or_owner"
"volume:delete": "rule:admin_or_owner"
"volume_extension:volume_tenant_attribute": "rule:admin_or_owner"
"volume_extension:volume_encryption_metadata": "rule:admin_or_owner"
"volume:multiattach": "rule:admin_or_owner"

```
### Neutron Service

``` json
    "create_subnet": "rule:admin_or_network_owner",
    "get_subnet": "rule:admin_or_owner or rule:shared",
    "update_subnet": "rule:admin_or_network_owner",
    "delete_subnet": "rule:admin_or_network_owner",
    "get_subnetpool": "rule:admin_or_owner or rule:shared_subnetpools",
    "update_subnetpool": "rule:admin_or_owner",
    "delete_subnetpool": "rule:admin_or_owner",
    "get_address_scope": "rule:admin_or_owner or rule:shared_address_scopes",
    "update_address_scope": "rule:admin_or_owner",
    "delete_address_scope": "rule:admin_or_owner",
    "get_network": "rule:admin_or_owner or rule:shared or rule:external or rule:context_is_advsvc",
    "update_network": "rule:admin_or_owner",
    "delete_network": "rule:admin_or_owner",
    "network_device": "field:port:device_owner=~^network:",
    "create_port:device_owner": "not rule:network_device or rule:context_is_advsvc or rule:admin_or_network_owner",
    "create_port:mac_address": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "create_port:fixed_ips": "rule:context_is_advsvc or rule:admin_or_network_owner or rule:shared",
    "create_port:fixed_ips:ip_address": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "create_port:fixed_ips:subnet_id": "rule:context_is_advsvc or rule:admin_or_network_owner or rule:shared",
    "create_port:port_security_enabled": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "create_port:mac_learning_enabled": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "create_port:allowed_address_pairs": "rule:admin_or_network_owner",
    "create_port:allowed_address_pairs:mac_address": "rule:admin_or_network_owner",
    "create_port:allowed_address_pairs:ip_address": "rule:admin_or_network_owner",
    "get_port": "rule:context_is_advsvc or rule:admin_owner_or_network_owner",
    "update_port": "rule:admin_or_owner or rule:context_is_advsvc",
    "update_port:device_owner": "not rule:network_device or rule:context_is_advsvc or rule:admin_or_network_owner",
    "update_port:fixed_ips": "rule:context_is_advsvc or rule:admin_or_network_owner or rule:shared",
    "update_port:fixed_ips:ip_address": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "update_port:fixed_ips:subnet_id": "rule:context_is_advsvc or rule:admin_or_network_owner or rule:shared",
    "update_port:port_security_enabled": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "update_port:mac_learning_enabled": "rule:context_is_advsvc or rule:admin_or_network_owner",
    "update_port:allowed_address_pairs": "rule:admin_or_network_owner",
    "update_port:allowed_address_pairs:mac_address": "rule:admin_or_network_owner",
    "update_port:allowed_address_pairs:ip_address": "rule:admin_or_network_owner",
    "delete_port": "rule:context_is_advsvc or rule:admin_owner_or_network_owner",
    "create_router:external_gateway_info": "rule:admin_or_owner",
    "create_router:external_gateway_info:network_id": "rule:admin_or_owner",
    "get_router": "rule:admin_or_owner",
    "update_router": "rule:admin_or_owner",
    "update_router:external_gateway_info": "rule:admin_or_owner",
    "update_router:external_gateway_info:network_id": "rule:admin_or_owner",
    "delete_router": "rule:admin_or_owner",
    "add_router_interface": "rule:admin_or_owner",
    "remove_router_interface": "rule:admin_or_owner",
    "update_floatingip": "rule:admin_or_owner",
    "delete_floatingip": "rule:admin_or_owner",
    "get_floatingip": "rule:admin_or_owner",
    "update_rbac_policy": "rule:admin_or_owner",
    "update_rbac_policy:target_tenant": "rule:restrict_wildcard and rule:admin_or_owner",
    "get_rbac_policy": "rule:admin_or_owner",
    "delete_rbac_policy": "rule:admin_or_owner",
    "get_auto_allocated_topology": "rule:admin_or_owner",
    "get_trunk": "rule:admin_or_owner",
    "delete_trunk": "rule:admin_or_owner",
    "add_subports": "rule:admin_or_owner",
    "remove_subports": "rule:admin_or_owner",
    "get_security_groups": "rule:admin_or_owner",
    "get_security_group": "rule:admin_or_owner",
    "create_security_group": "rule:admin_or_owner",
    "update_security_group": "rule:admin_or_owner",
    "delete_security_group": "rule:admin_or_owner",
    "get_security_group_rules": "rule:admin_or_owner",
    "get_security_group_rule": "rule:admin_owner_or_sg_owner",
    "create_security_group_rule": "rule:admin_or_owner",
    "delete_security_group_rule": "rule:admin_or_owner",


```

### Glance Service

``` json

    "add_image": "role:admin or role:member",
    "delete_image": "role:admin or role:member",
    "get_image": "role:admin or role:member",
    "get_images": "role:admin or role:member",
    "publicize_image": "role:admin or role:member",
    "download_image": "role:admin or role:member",
    "upload_image": "role:admin or role:member",
    "get_image_location": "role:admin or role:member",
    "set_image_location": "role:admin or role:member",

```
### Nova Compute Service

``` json
 "os_compute_api:os-admin-password": "rule:admin_or_owner",
    "os_compute_api:os-attach-interfaces": "rule:admin_or_owner",
    "os_compute_api:os-attach-interfaces:create": "rule:admin_or_owner",
    "os_compute_api:os-attach-interfaces:delete": "rule:admin_or_owner",
    "os_compute_api:os-availability-zone:list": "rule:admin_or_owner",
    "os_compute_api:os-config-drive": "rule:admin_or_owner",
    "os_compute_api:os-console-output": "rule:admin_or_owner",
    "os_compute_api:os-consoles:create": "rule:admin_or_owner",
    "os_compute_api:os-consoles:show": "rule:admin_or_owner",
    "os_compute_api:os-consoles:delete": "rule:admin_or_owner",
    "os_compute_api:os-consoles:index": "rule:admin_or_owner",
    "os_compute_api:os-create-backup": "rule:admin_or_owner",
    "os_compute_api:os-deferred-delete": "rule:admin_or_owner",
    "os_compute_api:os-extended-availability-zone": "rule:admin_or_owner",
    "os_compute_api:os-extended-status": "rule:admin_or_owner",
    "os_compute_api:os-extended-volumes": "rule:admin_or_owner",
    "os_compute_api:extensions": "rule:admin_or_owner",
    "os_compute_api:os-flavor-access": "rule:admin_or_owner",
    "os_compute_api:os-flavor-extra-specs:show": "rule:admin_or_owner",
    "os_compute_api:os-flavor-extra-specs:index": "rule:admin_or_owner",
    "os_compute_api:os-flavor-rxtx": "rule:admin_or_owner",
    "os_compute_api:flavors": "rule:admin_or_owner",
    "os_compute_api:os-floating-ip-dns": "rule:admin_or_owner",
    "os_compute_api:os-floating-ip-pools": "rule:admin_or_owner",
    "os_compute_api:os-floating-ips": "rule:admin_or_owner",
    "os_compute_api:os-fping": "rule:admin_or_owner",
    "os_compute_api:image-size": "rule:admin_or_owner",
    "os_compute_api:os-instance-actions": "rule:admin_or_owner",
    "os_compute_api:ips:show": "rule:admin_or_owner",
    "os_compute_api:ips:index": "rule:admin_or_owner",
    "os_compute_api:os-keypairs": "rule:admin_or_owner",
    "os_compute_api:limits": "rule:admin_or_owner",
    "os_compute_api:os-lock-server:lock": "rule:admin_or_owner",
    "os_compute_api:os-lock-server:unlock": "rule:admin_or_owner",
    "os_compute_api:os-multinic": "rule:admin_or_owner",
    "os_compute_api:os-networks:view": "rule:admin_or_owner",
    "os_compute_api:os-pause-server:pause": "rule:admin_or_owner",
    "os_compute_api:os-pause-server:unpause": "rule:admin_or_owner",
    "os_compute_api:os-quota-sets:show": "rule:admin_or_owner",
    "os_compute_api:os-quota-sets:detail": "rule:admin_or_owner",
    "os_compute_api:os-remote-consoles": "rule:admin_or_owner",
    "os_compute_api:os-rescue": "rule:admin_or_owner",
    "os_compute_api:os-security-groups": "rule:admin_or_owner",
    "os_compute_api:os-server-groups": "rule:admin_or_owner",
    "os_compute_api:server-metadata:index": "rule:admin_or_owner",
    "os_compute_api:server-metadata:show": "rule:admin_or_owner",
    "os_compute_api:server-metadata:create": "rule:admin_or_owner",
    "os_compute_api:server-metadata:update_all": "rule:admin_or_owner",
    "os_compute_api:server-metadata:update": "rule:admin_or_owner",
    "os_compute_api:server-metadata:delete": "rule:admin_or_owner",
    "os_compute_api:os-server-password": "rule:admin_or_owner",
    "os_compute_api:os-server-tags:delete_all": "rule:admin_or_owner",
    "os_compute_api:os-server-tags:index": "rule:admin_or_owner",
    "os_compute_api:os-server-tags:update_all": "rule:admin_or_owner",
    "os_compute_api:os-server-tags:delete": "rule:admin_or_owner",
    "os_compute_api:os-server-tags:update": "rule:admin_or_owner",
    "os_compute_api:os-server-tags:show": "rule:admin_or_owner",
    "os_compute_api:os-server-usage": "rule:admin_or_owner",
    "os_compute_api:servers:index": "rule:admin_or_owner",
    "os_compute_api:servers:detail": "rule:admin_or_owner",
    "os_compute_api:servers:show": "rule:admin_or_owner",
    "os_compute_api:servers:create": "rule:admin_or_owner",
    "os_compute_api:servers:create:attach_volume": "rule:admin_or_owner",
    "os_compute_api:servers:create:attach_network": "rule:admin_or_owner",
    "os_compute_api:servers:delete": "rule:admin_or_owner",
    "os_compute_api:servers:update": "rule:admin_or_owner",
    "os_compute_api:servers:confirm_resize": "rule:admin_or_owner",
    "os_compute_api:servers:revert_resize": "rule:admin_or_owner",
    "os_compute_api:servers:reboot": "rule:admin_or_owner",
    "os_compute_api:servers:resize": "rule:admin_or_owner",
    "os_compute_api:servers:rebuild": "rule:admin_or_owner",
    "os_compute_api:servers:create_image": "rule:admin_or_owner",
    "os_compute_api:servers:create_image:allow_volume_backed": "rule:admin_or_owner",
    "os_compute_api:servers:start": "rule:admin_or_owner",
    "os_compute_api:servers:stop": "rule:admin_or_owner",
    "os_compute_api:servers:trigger_crash_dump": "rule:admin_or_owner",
    "os_compute_api:os-shelve:shelve": "rule:admin_or_owner",
    "os_compute_api:os-shelve:unshelve": "rule:admin_or_owner",
    "os_compute_api:os-simple-tenant-usage:show": "rule:admin_or_owner",
    "os_compute_api:os-suspend-server:resume": "rule:admin_or_owner",
    "os_compute_api:os-suspend-server:suspend": "rule:admin_or_owner",
    "os_compute_api:os-tenant-networks": "rule:admin_or_owner",
    "os_compute_api:os-virtual-interfaces": "rule:admin_or_owner",
    "os_compute_api:os-volumes": "rule:admin_or_owner",
    "os_compute_api:os-volumes-attachments:index": "rule:admin_or_owner",
    "os_compute_api:os-volumes-attachments:create": "rule:admin_or_owner",
    "os_compute_api:os-volumes-attachments:show": "rule:admin_or_owner",
    "os_compute_api:os-volumes-attachments:delete": "rule:admin_or_owner"

```


## Creating an OpenStack gateway

Spectro Cloud provides an installer in the form of a docker container. This installer can be run on any system that has docker daemon installed and has connectivity to the Spectro Cloud Management console as well as OpenStack identity endpoint. The installer must be run initially in config-only interactive mode initially to run through a series of prompts and generate a gateway config file. Subsequently the installer must be run in silent mode providing the generated config file as input to complete the installation.


#### Generate pairing code

Navigate to the Private Cloud Gateway page under Administration and Create a new OpenStack gateway. Copy the pairing code displayed on the page. This will be used in subsequent steps.

#### Generate gateway config

Invoke gateway installer in interactive mode to generate the gateway configuration file. Follow the prompts to provide the Spectro Cloud Management, OpenStack cloud account, Environment and Placement information as requested.

```bash
docker run --rm  \
  --net=host  \
  -it  \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/opt/spectrocloud \
    gcr.io/spectro-images-public/release/spectro-installer:v1.0.1 \
    pcg  \
    pcg-1 \
    OpenStack \
  -w=/opt/spectrocloud \
  -o=true
```

#### Enter Spectro Cloud  Management Information:
* Spectro Cloud Console - Management Console endpoint e.g. https://console.spectrocloud.com
* Spectro Cloud Username - Login email address e.g. user1@company.com
* Spectro Cloud Password - Login password
* Private Cloud Gateway pairing code: The unique authentication code generated in the previous step.

#### Enter Environment Configuration:

* HTTPS Proxy (--https_proxy) - The endpoint for the HTTPS proxy server. This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT
* HTTP Proxy(--http_proxy) - The endpoint for the HTTP proxy server	This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT
* No Proxy(--no_proxy) - A comma-separated list of local network CIDRs, hostnames, domain names that should be excluded from proxying. This setting will be propagated to all the nodes to bypass the proxy server. Eg., openstack.company.com,10.10.0.0/16
* Pod CIDR (--pod_cidr) -  The CIDR pool is used to assign IP addresses to pods in the cluster. This setting will be used to assign IP addresses to pods in Kubernetes clusters. The pod IP addresses should be unique and should not overlap with any Virtual Machine IPs in the environment.
* Service IP Range (--svc_ip_range) - IP address that will be assigned to services created on Kubernetes. This setting will be used to assign IP addresses to services in Kubernetes clusters. The service IP addresses should be unique and not overlap with any virtual machine IPs in the environment.

#### Enter OpenStack Account Information:

* OpenStack Identity Endpoint - OpenStack Identity endpoint. Domain or IP address. e.g. https://openstack.mycompany.com/identity
* OpenStack Account Username  - OpenStack account username
* OpenStack Account Password - OpenStack account password
* Default Domain - Default OpenStack domain. e.g. Default
* Default Region - Default OpenStack region. e.g. RegionOne
* Default Project - Default OpenStack project. e.g. dev

#### Enter OpenStack cluster configuration for the Private Cloud Gateway:

* Verify the following parameters:
	* Default Domain
	* Default Region
	* Default Project
* Enter the values for:
	* SSH Key - Select a key
	* Placement option as Static or Dynamic - For static placement, VMs are placed into existing networks whereas, for dynamic placement, new network is created.
	* Network - Select an existing network
	* Sub Network - Select a sub network

#### Enter OpenStack Machine configuration for the Private Cloud Gateway:

* Select the availability zone
* Choose flavor
* Number of nodes: choose between 1 and 3

After this step, a new gateway configuration file is generated and its location is displayed on the console.

E.g.: Config created:/opt/spectrocloud//install-pcg-ar-dev-os-gw-02-aug-01-20210802062349/pcg.yaml


#### Copy configuration file to known location:

* Copy the pcg.yaml file to a known location for easy access and updates.


```bash
cp /tmp/install-pcg-xxx/pcg.yaml /tmp
```


#### Deploy Private Cloud Gateway

* Invoke the gateway installer in silent mode providing the gateway config file as input to deploy the gateway. New VM(s) will be launched in your OpenStack environment and a gateway will be installed on those VM(s). If deployment fails due to misconfiguration, update the gateway configuration file and rerun the command.

```bash
docker run --rm  \
  --net=host  \
  -it  \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/opt/spectrocloud \
    gcr.io/spectro-images-public/release/spectro-installer:v1.0.1 \
    pcg  \
    pcg-1 \
    OpenStack \
  -w=/opt/spectrocloud \
  -s=true
  -c=/tmp/pcg.yaml
```

## Upgrading an OpenStack cloud gateway
Spectro Cloud maintains the OS image and all configurations for the cloud gateway. Periodically, the OS images, configurations, or other components need to be upgraded to resolve security or functionality issues. Spectro Cloud releases such upgrades when required and communication about the same is presented in the form of an upgrade notification on the gateway.
Administrators should review the changes and apply them at a suitable time. Upgrading a cloud gateway does not result in any downtime for the tenant clusters. During the upgrade process, the provisioning of new clusters might be temporarily unavailable. New cluster requests are queued while the gateway is being upgraded, and are processed as soon as the gateway upgrade is complete.

## Deleting an OpenStack cloud gateway
The following steps need to be performed to delete a cloud gateway:
* As a tenant administrator, navigate to the Private Cloud Gateway page under settings.
* Invoke the ‘Delete’ action on the cloud gateway instance that needs to be deleted.
* The system performs a validation to ensure that, there are no running tenant clusters associated with the gateway instance being deleted. If such instances are found, the system presents an error. Delete relevant running tenant clusters and retry the deletion of the cloud gateway.
* Delete the gateway.

<InfoBox>
The delete gateway operation deletes the gateway instance registered in the management console, however the gateway infrastructure such as Load Balancers, VMs, Networks (if dynamic provision was chosen), etc. need to be deleted on the OpenStack console

</InfoBox>


## Resizing an OpenStack gateway
A Cloud gateway can be set up as a 1-node or a 3-node cluster. For production environments, it is recommended that 3 nodes are set up. A cloud gateway can be initially set up with 1 node and resized to 3 nodes at a later time. The following steps need to be performed to resize a 1-node cloud gateway cluster to a 3-node gateway cluster:
* As a tenant administrator, navigate to the Private Cloud Gateway page under settings.
* Invoke the resize action for the relevant cloud gateway instance.
* Update the size from 1 to 3.
* The gateway upgrade begins shortly after the update. Two new nodes are created and the gateway is upgraded to a 3-node cluster.


## Creating an OpenStack Cloud Account

A default cloud account is automatically created when the private cloud gateway is configured. This cloud account can be used to create tenant clusters. Additional cloud accounts may be created if desired within the same gateway.

To create an OpenStack cloud account, proceed to project settings and select 'create cloud account' under OpenStack. Fill the following values to the cloud account creation wizard.

|Property|Description |
|:---------------|:-----------------------|
|  Account Name |  Custom name for the cloud account   |
|   Private cloud gateway|    Reference to a running cloud gateway |
| Username  |    OpenStack Username |
|   Password|   OpenStack Password  |
|  Identity Endpoint |  Identity Endpoint of the gateway   |
|  CA Certificate |   Digital certificate of authority  |
|  Parent Region | OpenStack Region to be used |
| Default Domain  | Default OpenStack domain    |
|  Default Project |  Default OpenStack project  |


## Creating an OpenStack Cluster
The following steps need to be performed to provision a new OpenStack cluster:
* Provide basic cluster information like name, description, and tags. Tags are currently not propagated to the VMs deployed on the cloud/data center environments.
* Select a cluster profile created for the  OpenStack environment. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide an OpenStack Cloud account and placement information.
   * Cloud Account - Select the desired cloud account. OpenStack cloud accounts with credentials need to be pre-configured in project settings. An account is auto-created as part of the cloud gateway setup and is available for provisioning of tenant clusters if permitted by the administrator.
   * Domain
   * Region
   * Project
   * SSH Key
   * Placement
        * if the user choice of placement is Static then:
            * Network
            * Subnet
        * if the user choice of placement is NOT Static then:
            * Subnet CIDR
            * DNS Name Server
* Configure the master and worker node pools. A master and a worker node pool are configured by default.
    * Name - A descriptive name for the node pool.
    * Size - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, 5, etc.
    * Allow worker capability (master pool) - To workloads to be provisioned on master nodes.
    * Availability zones
    * Flavor - VM instance type
    * Disk - Storage disk size in GB to be attached to the node.
    * Rolling Update
        * Expand first
        * Contract First
* Configure the cluster policies/features.
    * Manage Machines
    * Scan Policies
    * Backup Policies

* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

## Deleting an OpenStack Cluster
The deletion of an OpenStack cluster results in the removal of all Virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete a OpenStack cluster:
* Select the cluster to be deleted from the cluster view and navigate to the cluster overview page
* Invoke a delete action from the cluster settings
* Confirm delete action
* Cluster status is updated to ‘Deleting’ while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to ‘Deleted’ and is removed from the cluster list.

<InfoBox>
Delete action is only available for clusters that are fully provisioned. For clusters that are still in the process of being provisioned, the ‘Abort’ action is available to stop provisioning and delete all resources.
</InfoBox>

</Tabs. TabPane>

<Tabs. TabPane tab="AKS Cluster" key="aks_cluster">

## Overview
Spectro Cloud enables the effortless deployment and management of containerised applications with fully-managed Azure Kubernetes Service (AKS). It provides the users with server-less Kubernetes, an integrated continuous integration and continuous delivery (CI/CD) experience, and enterprise-grade security and governance. Thus uniting the development and operations to a single platform achieving faster build, delivery, and scaling of applications with credences. The infrastructure has an event-driven autoscaling and triggers, that enable Elastic provisioning for this self-managed infrastructure. Extensive authentication and authorization capabilities using Azure Active Directory and dynamic rules enforcement across multiple clusters with Azure Policy.

![aks_cluster_architecture.png](aks_cluster_architecture.png)

## Prerequisites
Azure Active Directory integration for the AKS cluster provisioning may optionally require the following:
* User has to provide the Tenant Name as part of the cloud account.
* For the Azure client mentioned in the cloud account the following API permission has to be provided
   *  Microsoft Graph: Group.Read.All (Application Type)
   *  Microsoft Graph: Directory.Read.All (Application Type)
These permissions can be configured from the Azure cloud console under App registrations > API permissions for the specified App

## Creating an Azure cloud account
To create an Azure cloud account, we need:
* Client ID
* Tenant ID
* Client secret

For this, we first need to create an Azure Active Directory (AAD) Application which can be used with role-based access control. Follow the steps to get the required details:

* To create an AAD Application from the Azure portal, follow the [Create a new AAD Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application) link. With this, the ClientID and TenantID are created and can be noted down.
* On creating the application, a minimum required [ContributorRole](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#contributor) needs to be assigned. To assign any kind of role, the user must have a minimum role of [UserAccessAdministrator](https://docs.microsoft.com/en-us/azure/role-based-access-control/built-in-roles#user-access-administrator). The role can be assigned by following the [Assign Role To Application](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#assign-a-role-to-the-application) link.
* To create the client secret, [Create an Application Secret](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret). Store the Client Secret safely as it will not be available in plaintext later.

## Creating an AKS Cluster
The following steps need to be performed to provision a new AKS cluster:
* Provide the basic cluster information like name, description, and tags.
* Select a cluster profile created for the AKS Cluster. The profile definition will be used as the cluster construction template.
* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.
* Provide the Azure Cloud account and placement information.
    * Cloud Account - Select the desired cloud account. Azure cloud accounts with credentials need to be pre-configured in project settings.
    * Subscription - Select the subscription which is to be used to access Azure Services.
    * Region - Select a region in Azure in which the cluster should be deployed.
    * Resource Group - Select the resource group in which the cluster should be deployed.
    * SSH Key - Public key to configure remote SSH access to the nodes.
    * Placement - If the choice of placement is Static then select
        * Virtual Network
        * Control Plane Subnet
        * Worker Subnet
* Configure the worker node pools. A worker node pool is configured by default.
   * Name - A descriptive name for the node pool.
   * Size - Number of nodes to be provisioned for the node pool.
   * Instance Type - Select the Azure instance type to be used for all the nodes in the pool.
   * Managed Disk - Select the managed disk type to be used.
   * Disk Size - Storage disk size in GB to be attached to the node.
   * Optionally select the system node pool.
   * Availability Zones (if any) - Choose one or more availability zones. Spectro Cloud provides fault tolerance to guard against failures like hardware failures, network failures, etc. by provisioning nodes across availability zones if multiple zones are selected. Zones are supported only for worker pools.

<InfoBox>
Every AKS cluster must contain at least one system node pool with at least one node.

If you run a single system node pool for your AKS cluster in a production environment, it is recommended to use at least three nodes for the node pool.
</InfoBox>

<InfoBox>
A minimum allocation of '2' CPU cores is required across all worker nodes.

A minimum allocation of '4Gi' of memory is required across all worker nodes.
</InfoBox>


* Set schedules of OS Patching, Scans, or backup and recovery as per user choice.
* Review the settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

New worker pools may be added if it desired to customize certain worker nodes to run specialized workloads. As an example, the default worker pool may be configured with the ‘Standard_D2_v2’ instance types for general-purpose workloads and another worker pool with instance type ‘Standard_NC12s_v3’ can be configured to run GPU workloads.

</Tabs. TabPane>

<Tabs. TabPane tab="MaaS Cluster" key="maas-cluster">

## Overview

Spectro Cloud supports the users to create a data centre from their bare-metal servers with MaaS support. We succor the provisioning of Kubernetes clusters in the MaaS environment to manage a large number of physical machines by merging them into user-defined resource pools. MAAS expanded as “Metal As A Service” aids in converting your bare-metal servers into cloud instances of virtual machines. It helps in the quick provisioning and de-provisioning of instances, similar to instances hosted in public clouds like Amazon AWS, Google GCE, or Microsoft Azure.


A Private Cloud Gateway needs to be set up within the environment, to facilitate communication between the Spectro Cloud management platform and the MaaS environment. The gateway establishes a secure communication channel with the management console thereby eliminating an incoming connection into the Maas environment.


![maas_cluster_architecture.png](maas_cluster_architecture.png)

## Prerequisites

* Minimum capacity required for tenant clusters: ~26 vCPU, 50GB memory, 600GB storage.
* Minimum capacity required for a Private Cloud Gateway:
    * 1 node - 2 vCPU, 4GB memory, 30GB storage.
    * 3 nodes - 6 vCPU, 12GB memory, 90GB storage.
* Per tenant cluster IP requirements:
    * 1 per node.
    * 1 Kubernetes control-plane VIP.
* Private cloud gateway IP requirements:
    * 1 node - 1 IP or 3 nodes - 3 IPs.
    * 1 Kubernetes control-plane VIP.
    * 1 Kubernetes control-plane extra.
* IPs for application workload services (e.g.: Load Balancer services).
* Subnet with egress access to the internet (direct or via proxy):
    * For proxy: HTTP_PROXY, HTTPS_PROXY (both required).
    * Outgoing internet connection on port 443 to api.spectrocloud.com.
* DNS to resolve public internet names (e.g.: api.spectrocloud.com).
* NTP configured on all Hosts.
* MaaS permission set.


## Creating a MaaS gateway

Spectro Cloud provides an installer in the form of a docker container. This installer can be run on any system that has docker daemon installed and has connectivity to the Spectro Cloud Management console as well as MaaS identity endpoint.


#### Generate pairing code

Navigate to the Private Cloud Gateway page under Administration and Create a new MaaS gateway. Copy the pairing code displayed on the page. This will be used in subsequent steps.

#### Generate gateway config

Invoke gateway installer in interactive mode to generate the gateway configuration file. Follow the prompts to provide the Spectro Cloud Management, MaaS cloud account, Environment and, Placement information as requested.

```bash
docker run --rm  \
  --net=host \
  -it  \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/opt/spectrocloud \
    gcr.io/spectro-images-public/release/spectro-installer:v1.0.3 \
    pcg  \
    User-define-MaaS-Gateway-Name \
    MaaS \
  -w=/opt/spectrocloud/ \
  -o=true
```


#### Enter Spectro Cloud  Management Information:

* Spectro Cloud Console - Management Console endpoint e.g. https://console.spectrocloud.com
* Spectro Cloud Username - Login email address e.g. user1@company.com
* Spectro Cloud Password - The login password
* Private Cloud Gateway pairing code: The unique authentication code generated in the previous step.

#### Enter Environment Configuration:

* HTTPS Proxy (--https_proxy):

The endpoint for the HTTPS proxy server. This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT

* HTTP Proxy(--http_proxy):
The endpoint for the HTTP proxy server. This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT

* No Proxy(--no_proxy):
A comma-separated list of local network CIDRs, hostnames, domain names that should be excluded from proxying. This setting will be propagated to all the nodes to bypass the proxy server. Eg., maas.company.com,10.10.0.0/16

* Pod CIDR (--pod_cidr):
The CIDR pool is used to assign IP addresses to pods in the cluster. This setting will be used to assign IP addresses to pods in Kubernetes clusters. The pod IP addresses should be unique and should not overlap with any Virtual Machine IPs in the environment.

* Service IP Range (--svc_ip_range):
The IP address that will be assigned to services created on Kubernetes. This setting will be used to assign IP addresses to services in Kubernetes clusters. The service IP addresses should be unique and not overlap with any virtual machine IPs in the environment.

#### Enter MaaS Account Information:

MaaS API Endpoint - MaaS API endpoint. Domain or IP address.
e.g. http://10.11.130.10:5240/MAAS

MaaS API Key - MAAS generates an API key when creating your MAAS account, which is used for authentication.


#### Enter MaaS Machine configuration for the Private Cloud Gateway:

* Select the availability zone
* Choose flavor
* Number of nodes: choose between 1 and 3

After this step, a new gateway configuration file is generated and its location is displayed on the console.

E.g.:
Config created:/opt/spectrocloud//User-define-MaaS-Gateway-Name-20210805155034/pcg.yaml


#### Copy configuration file to known location:

Copy the pcg.yaml file to a known location for easy access and updates.


```bash
cp /tmp/install-User-define-MaaS-Gateway-Name-20210805155034/pcg.yaml  /tmp
```


#### Deploy Private Cloud Gateway

Invoke the gateway installer in silent mode providing the gateway config file as input to deploy the gateway.

```bash
docker run --rm  \
  --net=host \
  -it  \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/opt/spectrocloud \
    gcr.io/spectro-images-public/release/spectro-installer:v1.0.3 \
    pcg  \
    User-define-MaaS-Gateway-Name \
    MaaS \
  -w=/opt/spectrocloud/ \
  -s=true \
  -c=/opt/spectrocloud/pcg.yaml
```

New machine(s) will be launched in your MaaS environment and a gateway will be installed on those machine(s). If the deployment fails due to misconfiguration, update the gateway configuration file and rerun the command.

## Upgrading a MaaS cloud gateway

Spectro Cloud maintains the OS image and all configurations for the cloud gateway. Periodically, the OS images, configurations, or other components need to be upgraded to resolve security or functionality issues. Spectro Cloud releases such upgrades when required and communication about the same is presented in the form of an upgrade notification on the gateway.
Administrators should review the changes and apply them at a suitable time. Upgrading a cloud gateway does not result in any downtime for the tenant clusters. During the upgrade process, the provisioning of new clusters might be temporarily unavailable. New cluster requests are queued while the gateway is upgraded and are processed as soon as the gateway upgrade is complete.

## Deleting a MaaS cloud gateway
The following steps need to be performed to delete a cloud gateway:
* As a tenant administrator, navigate to the Private Cloud Gateway page under settings.
* Invoke the ‘Delete’ action on the cloud gateway instance that needs to be deleted.
* The system performs a validation to ensure that, there are no running tenant clusters associated with the gateway instance being deleted. If such instances are found, the system presents an error. Delete relevant running tenant clusters and retry the deletion of the cloud gateway.
* Delete the gateway.


## Resizing a MaaS gateway

A Cloud gateway can be set up as a 1-node or a 3-node cluster. For production environments, it is recommended that 3 nodes are set up. A cloud gateway can be initially set up with 1 node and resized to 3 nodes at a later time. The following steps need to be performed to resize a 1-node cloud gateway cluster to a 3-node gateway cluster:
* As a tenant administrator, navigate to the Private Cloud Gateway page under settings.
* Invoke the resize action for the relevant cloud gateway instance.
* Update the size from 1 to 3.
* The gateway upgrade begins shortly after the update. Two new nodes are created and the gateway is upgraded to a 3-node cluster.


## Creating a MaaS Cloud Account

A default cloud account is automatically created when the private cloud gateway is configured. This cloud account can be used to create tenant clusters. Additional cloud accounts may be created if desired within the same gateway.

To create a MaaS cloud account, proceed to project settings and select 'create cloud account' under MaaS. Fill the following values to the cloud account creation wizard.

|Property|Description |
|:---------------|:-----------------------|
|  Account Name |  Custom name for the cloud account   |
|   Private cloud gateway|    Reference to a running cloud gateway |
|  API Endpoint |  API Endpoint of the gateway   |
| API Key|

Validate the above MaaS credentials to create your MaaS cloud account.

## Creating a MaaS Cluster

The following steps need to be performed to provision a new MaaS cluster:

* Provide basic cluster information like name, description, and tags. Tags are currently not propagated to the machines deployed on the cloud/data center environments.

* Select a cluster profile created for the  MaaS environment. The profile definition will be used as the cluster construction template.

* Review and override pack parameters as desired. By default, parameters for all packs are set with values defined in the cluster profile.

* Provide a MaaS Cloud account and placement information.

   * Cloud Account - Select the desired cloud account.
MaaS cloud accounts with credentials need to be pre-configured in project settings. An account is auto-created as part of the cloud gateway setup and is available for provisioning of tenant clusters if permitted by the administrator.

   * Domain

* Configure the master and worker node pools. A master and a worker node pool are configured by default.
    * Name - A descriptive name for the node pool.
    * Size - Number of nodes to be provisioned for the node pool. For the master pool, this number can be 1, 3, 5, etc.
    * Allow worker capability (master pool) - To workloads to be provisioned on master nodes.
    * Resource Pool
    * Availability zones
    * Minimum CPU
    * Minimum Disk - Storage disk size in GB to be attached to the node.
    * Rolling Update
* Expand first
* Contract First

* Configure the cluster policies/features.
    * Manage Machines
    * Scan Policies
    * Backup Policies

* Review settings and deploy the cluster. Provisioning status with details of ongoing provisioning tasks is available to track progress.

## Deleting a MaaS Cluster
The deletion of a MaaS cluster results in the removal of all Virtual machines and associated storage disks created for the cluster. The following tasks need to be performed to delete a MaaS cluster:
* Select the cluster to be deleted from the cluster view and navigate to the cluster overview page
* Invoke a delete action from the cluster settings
* Confirm delete action
* Cluster status is updated to ‘Deleting’ while cluster resources are being deleted. Provisioning status is updated with the ongoing progress of the delete operation. Once all resources are successfully deleted, the cluster status changes to ‘Deleted’ and is removed from the cluster list.

<InfoBox>
Delete action is only available for clusters that are fully provisioned. For clusters that are still in the process of being provisioned, the ‘Abort’ action is available to stop provisioning and delete all resources.
</InfoBox>

</Tabs. TabPane>


</Tabs>
