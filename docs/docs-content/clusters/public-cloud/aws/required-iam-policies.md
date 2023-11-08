---
sidebar_label: "Required IAM Policies"
title: "Required IAM Policies"
description: "A list of required IAM policies that Palette requires."
hide_table_of_contents: false
tags: ["public cloud", "aws", "iam"]
sidebar_position: 40
---

Palette requires proper Amazon Web Services (AWS) permissions to operate and perform actions on your behalf.
The following policies include all the permissions needed for cluster provisioning with Palette.
 <br />

* **PaletteControllersPolicy**


* **PaletteControlPlanePolicy**


* **PaletteNodesPolicy**


* **PaletteDeploymentPolicy**

Additional IAM policies may be required depending on the use case. For example, AWS Elastic Kubernetes Service (EKS) requires the **PaletteControllersEKSPolicy**. Check out the [Controllers EKS Policy](#controllers-eks-policy) section to review the IAM policy.


:::caution

You can attach a maximum of ten managed policies to an IAM User or role. Exceeding this limit will result in cluster deployment failures. If you find yourself in a scenario where you are exceeding the limit, consider combining policies into a custom-managed policy.
You can learn more about AWS IAM limits in the [IAM Quotas](https://docs.aws.amazon.com/us_en/IAM/latest/UserGuide/reference_iam-quotas.html) reference guide.

:::

<Tabs queryString="iam-policies">

<TabItem label="Controllers Policy" value="Controllers Policy">


**Last Update**: April 20, 2023

``` json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "iam:DeleteOpenIDConnectProvider",
        "iam:GetOpenIDConnectProvider",
        "iam:ListOpenIDConnectProviders",
        "iam:TagOpenIDConnectProvider",
        "autoscaling:DescribeAutoScalingGroups",
        "autoscaling:DescribeInstanceRefreshes",
        "ec2:AllocateAddress",
        "ec2:AssociateRouteTable",
        "ec2:AttachInternetGateway",
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:CreateInternetGateway",
        "ec2:CreateLaunchTemplate",
        "ec2:CreateLaunchTemplateVersion",
        "ec2:CreateNatGateway",
        "ec2:CreateRoute",
        "ec2:CreateRouteTable",
        "ec2:CreateSecurityGroup",
        "ec2:CreateSubnet",
        "ec2:CreateTags",
        "ec2:CreateVpc",
        "ec2:DeleteInternetGateway",
        "ec2:DeleteLaunchTemplate",
        "ec2:DeleteLaunchTemplateVersions",
        "ec2:DeleteNatGateway",
        "ec2:DeleteRouteTable",
        "ec2:DeleteSecurityGroup",
        "ec2:DeleteSubnet",
        "ec2:DeleteTags",
        "ec2:DeleteVpc",
        "ec2:DescribeAccountAttributes",
        "ec2:DescribeAddresses",
        "ec2:DescribeAvailabilityZones",
        "ec2:DescribeImages",
        "ec2:DescribeInstances",
        "ec2:DescribeInternetGateways",
        "ec2:DescribeKeyPairs",
        "ec2:DescribeLaunchTemplates",
        "ec2:DescribeLaunchTemplateVersions",
        "ec2:DescribeNatGateways",
        "ec2:DescribeNetworkInterfaceAttribute",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DescribeRouteTables",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeSubnets",
        "ec2:DescribeVolumes",
        "ec2:DescribeVpcAttribute",
        "ec2:DescribeVpcs",
        "ec2:DetachInternetGateway",
        "ec2:DisassociateAddress",
        "ec2:DisassociateRouteTable",
        "ec2:ModifyInstanceAttribute",
        "ec2:ModifyNetworkInterfaceAttribute",
        "ec2:ModifySubnetAttribute",
        "ec2:ModifyVpcAttribute",
        "ec2:ReleaseAddress",
        "ec2:ReplaceRoute",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:RunInstances",
        "ec2:TerminateInstances",
        "elasticloadbalancing:AddTags",
        "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
        "elasticloadbalancing:ConfigureHealthCheck",
        "elasticloadbalancing:CreateLoadBalancer",
        "elasticloadbalancing:DeleteLoadBalancer",
        "elasticloadbalancing:DeleteTargetGroup",
        "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
        "elasticloadbalancing:DescribeLoadBalancerAttributes",
        "elasticloadbalancing:DescribeLoadBalancers",
        "elasticloadbalancing:DescribeTags",
        "elasticloadbalancing:ModifyLoadBalancerAttributes",
        "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
        "elasticloadbalancing:RemoveTags",
        "iam:CreateOpenIDConnectProvider",
        "tag:GetResources"
      ],
      "Resource": [
        "*"
      ],
      "Effect": "Allow"
    },
    {
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
      ],
      "Effect": "Allow"
    },
    {
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "autoscaling.amazonaws.com"
        }
      },
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling"
      ],
      "Effect": "Allow"
    },
    {
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "elasticloadbalancing.amazonaws.com"
        }
      },
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/aws-service-role/elasticloadbalancing.amazonaws.com/AWSServiceRoleForElasticLoadBalancing"
      ],
      "Effect": "Allow"
    },
    {
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "spot.amazonaws.com"
        }
      },
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/aws-service-role/spot.amazonaws.com/AWSServiceRoleForEC2Spot"
      ],
      "Effect": "Allow"
    },
    {
      "Action": [
        "iam:PassRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/*.cluster-api-provider-aws.sigs.k8s.io"
      ],
      "Effect": "Allow"
    },
    {
      "Action": [
        "secretsmanager:CreateSecret",
        "secretsmanager:DeleteSecret",
        "secretsmanager:TagResource"
      ],
      "Resource": [
        "arn:*:secretsmanager:*:*:secret:aws.cluster.x-k8s.io/*"
      ],
      "Effect": "Allow"
    },
    {
      "Action": [
        "s3:DeleteObject",
        "s3:PutBucketOwnershipControls",
        "s3:PutBucketPolicy",
        "s3:PutBucketPublicAccessBlock",
        "s3:PutObjectAcl",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:*:s3:::*"
      ],
      "Effect": "Allow"
    }
  ]
}
```

</TabItem>

<TabItem label="Control Plane Policy" value="Control Plane Policy">

**Last Update**: April 20, 2023

``` json
{
  "Version": "2012-10-17",
  "Statement": [
    {
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
      ],
      "Effect": "Allow"
    }
  ]
}
```
</TabItem>

<TabItem label="Nodes Policy" value="Nodes Policy">


**Last Update**: May 2, 2021

``` json
{
  "Version": "2012-10-17",
  "Statement": [
    {
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
      ],
      "Effect": "Allow"
    },
    {
      "Action": [
        "secretsmanager:DeleteSecret",
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:*:secretsmanager:*:*:secret:aws.cluster.x-k8s.io/*"
      ],
      "Effect": "Allow"
    },
    {
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
      ],
      "Effect": "Allow"
    }
  ]
}
```
</TabItem>

<TabItem label="Deployment Policy" value="Deployment Policy">

**Last Update**: April 20, 2023

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
        "ec2:DescribeSnapshots",
        "ec2:DescribeTags",
        "ec2:DescribeVolumesModifications",
        "ec2:DescribeKeyPairs",
        "iam:AttachGroupPolicy",
        "iam:CreatePolicy",
        "iam:CreatePolicyVersion",
        "iam:DeletePolicy",
        "iam:DeletePolicyVersion",
        "iam:DetachGroupPolicy",
        "iam:GetGroup",
        "iam:GetInstanceProfile",
        "iam:GetPolicy",
        "iam:GetUser",
        "iam:ListPolicies",
        "iam:ListPolicyVersions",
        "pricing:GetProducts",
        "sts:AssumeRole",
        "sts:GetServiceBearerToken",
        "iam:AddRoleToInstanceProfile",
        "iam:AddUserToGroup",
        "iam:CreateGroup",
        "iam:CreateInstanceProfile",
        "iam:CreateUser",
        "iam:DeleteGroup",
        "iam:DeleteInstanceProfile",
        "iam:RemoveRoleFromInstanceProfile",
        "iam:RemoveUserFromGroup"
      ],
      "Resource": "*"
    }
  ]
}
```

</TabItem>

</Tabs>


## Controllers EKS Policy

If you plan to deploy host clusters to AWS EKS, make sure to attach the **PaletteControllersEKSPolicy**.

**Last Update**: April 20, 2023

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ssm:GetParameter"
      ],
      "Resource": [
        "arn:*:ssm:*:*:parameter/aws/service/eks/optimized-ami/*"
      ],
      "Effect": "Allow"
    },
    {
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "eks.amazonaws.com"
        }
      },
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/aws-service-role/eks.amazonaws.com/AWSServiceRoleForAmazonEKS"
      ],
      "Effect": "Allow"
    },
    {
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "eks-nodegroup.amazonaws.com"
        }
      },
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/aws-service-role/eks-nodegroup.amazonaws.com/AWSServiceRoleForAmazonEKSNodegroup"
      ],
      "Effect": "Allow"
    },
    {
      "Condition": {
        "StringLike": {
          "iam:AWSServiceName": "eks-fargate.amazonaws.com"
        }
      },
      "Action": [
        "iam:CreateServiceLinkedRole"
      ],
      "Resource": [
        "arn:*:iam::*:role/aws-service-role/eks-fargate-pods.amazonaws.com/AWSServiceRoleForAmazonEKSForFargate"
      ],
      "Effect": "Allow"
    },
    {
      "Action": [
        "iam:AddClientIDToOpenIDConnectProvider",
        "iam:CreateOpenIDConnectProvider",
        "iam:DeleteOpenIDConnectProvider",
        "iam:ListOpenIDConnectProviders",
        "iam:UpdateOpenIDConnectProviderThumbprint"
      ],
      "Resource": [
        "*"
      ],
      "Effect": "Allow"
    },
    {
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
      ],
      "Effect": "Allow"
    },
    {
      "Action": [
        "iam:GetPolicy"
      ],
      "Resource": [
        "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
      ],
      "Effect": "Allow"
    },
    {
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
        "eks:CreateNodegroup",
        "eks:AssociateEncryptionConfig",
        "eks:ListIdentityProviderConfigs",
        "eks:AssociateIdentityProviderConfig",
        "eks:DescribeIdentityProviderConfig",
        "eks:DisassociateIdentityProviderConfig"
      ],
      "Resource": [
        "arn:*:eks:*:*:cluster/*",
        "arn:*:eks:*:*:nodegroup/*/*/*"
      ],
      "Effect": "Allow"
    },
    {
      "Action": [
        "ec2:AssociateVpcCidrBlock",
        "ec2:DisassociateVpcCidrBlock",
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
      ],
      "Effect": "Allow"
    },
    {
      "Condition": {
        "StringEquals": {
          "iam:PassedToService": "eks.amazonaws.com"
        }
      },
      "Action": [
        "iam:PassRole"
      ],
      "Resource": [
        "*"
      ],
      "Effect": "Allow"
    },
    {
      "Condition": {
        "ForAnyValue:StringLike": {
          "kms:ResourceAliases": "alias/cluster-api-provider-aws-*"
        }
      },
      "Action": [
        "kms:CreateGrant",
        "kms:DescribeKey"
      ],
      "Resource": [
        "*"
      ],
      "Effect": "Allow"
    }
  ]
}
```

## Restricting Palette VPC Permissions

You can choose to have Palette operate in a static or dynamic environment. You can configure Palette to perform an AWS cluster creation into an existing VPC. The following policy allows Palette to operate but restricts its access to the [Principle of Least Privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).


<br />
<br />

<Tabs queryString="min-permissions">
<TabItem label="Minimum Dynamic Permissions" value="Minimum Dynamic Permissions">

This is a policy for those who want to restrict Palette to a single VPC and not give Palette access to create or delete VPCs.

<br />


### Minimum Dynamic Permissions


```json
{
 "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "ec2:AuthorizeSecurityGroupIngress",
        "ec2:DescribeInstances",
        "iam:RemoveRoleFromInstanceProfile",
        "ec2:AttachInternetGateway",
        "iam:AddRoleToInstanceProfile",
        "ec2:DeleteRouteTable",
        "ec2:AssociateRouteTable",
        "ec2:DescribeInternetGateways",
        "ec2:CreateRoute",
        "ec2:CreateInternetGateway",
        "ec2:DescribeVolumes",
        "ec2:DescribeKeyPairs",
        "ec2:DescribeNetworkAcls",
        "ec2:DescribeRouteTables",
        "ec2:CreateTags",
        "ec2:CreateRouteTable",
        "ec2:RunInstances",
        "ec2:ModifyInstanceAttribute",
        "ec2:TerminateInstances",
        "ec2:DetachInternetGateway",
        "ec2:DisassociateRouteTable",
        "ec2:RevokeSecurityGroupIngress",
        "ec2:DescribeIpv6Pools",
        "ec2:DeleteVpc",
        "ec2:CreateSubnet",
        "ec2:DescribeSubnets",
        "iam:CreateInstanceProfile",
        "ec2:DisassociateAddress",
        "ec2:DescribeAddresses",
        "ec2:CreateNatGateway",
        "ec2:DescribeRegions",
        "ec2:CreateVpc",
        "ec2:DescribeDhcpOptions",
        "ec2:DescribeVpcAttribute",
        "ec2:DescribeNetworkInterfaces",
        "ec2:DescribeAvailabilityZones",
        "ec2:DescribeNetworkInterfaceAttribute",
        "ec2:CreateSecurityGroup",
        "ec2:ModifyVpcAttribute",
        "iam:DeleteInstanceProfile",
        "ec2:ReleaseAddress",
        "iam:GetInstanceProfile",
        "ec2:DescribeTags",
        "ec2:DeleteRoute",
        "ec2:DescribeNatGateways",
        "ec2:DescribeIpamPools",
        "ec2:AllocateAddress",
        "ec2:DescribeSecurityGroups",
        "ec2:DescribeImages",
        "ec2:DescribeVpcs",
        "elasticloadbalancing:DeleteLoadBalancer",
        "elasticloadbalancing:DescribeLoadBalancers",
        "elasticloadbalancing:DescribeLoadBalancerAttributes",
        "elasticloadbalancing:CreateLoadBalancer",
        "elasticloadbalancing:ModifyLoadBalancerAttributes",
        "elasticloadbalancing:DescribeTags",
        "secretsmanager:CreateSecret",
        "secretsmanager:DeleteSecret",
        "secretsmanager:TagResource",
        "secretsmanager:GetSecretValue",
        "autoscaling:StartInstanceRefresh",
        "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
        "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
        "eks:DescribeCluster",
        "eks:ListClusters",
        "cloudformation:CreateStack",
        "cloudformation:DescribeStacks",
        "cloudformation:UpdateStack",
        "ecr:GetAuthorizationToken",
        "iam:PassRole",
        "elasticloadbalancing:ConfigureHealthCheck",
        "elasticloadbalancing:DescribeTargetHealth",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:GetRepositoryPolicy",
        "ecr:DescribeRepositories",
        "ecr:ListImages",
        "ecr:BatchGetImage",
        "ec2:DeleteInternetGateway",
        "ec2:DeleteNatGateway",
        "ec2:DeleteNetworkInterface",
        "ec2:DeleteSecurityGroup",
        "ec2:DeleteSubnet",
        "ec2:DeleteTags",
        "ssm:UpdateInstanceInformation",
        "ssmmessages:CreateControlChannel",
        "ssmmessages:CreateDataChannel",
        "ssmmessages:OpenControlChannel",
        "ssmmessages:OpenDataChannel",
        "pricing:GetProducts",
        "sts:AssumeRole",
        "ec2:ReplaceRoute",
        "ec2:ModifyNetworkInterfaceAttribute",
        "ec2:AssociateAddress",
        "tag:GetResources",
        "ec2:ModifySubnetAttribute"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
         "iam:PassRole"
      ],
      "Resource": [
          "arn:*:iam::*:role/*.cluster-api-provider-aws.sigs.k8s.io"
      ]
    }
  ]
}
```

</TabItem>

<TabItem label="Minimum Static Permissions" value="Minimum Static Permissions">


This is a policy for those who want to restrict Palette to a single VPC and not give Palette access to create or delete VPCs.

<br />

### Minimum Static Permissions


```json
{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Sid": "VisualEditor0",
          "Effect": "Allow",
          "Action": [
              "ec2:AuthorizeSecurityGroupIngress",
              "ec2:DescribeInstances",
            "iam:RemoveRoleFromInstanceProfile",
            "pricing:GetProducts",
            "sts:AssumeRole",
            "ec2:DescribeRegions",
            "ec2:DescribeKeyPairs",
            "ec2:DescribeVpcs",
            "ec2:DescribeVpcAttribute",
            "ec2:DescribeSubnets",
            "cloudformation:DescribeStacks",
            "cloudformation:CreateStack",
            "cloudformation:UpdateStack",
            "ec2:DescribeRouteTables",
            "ec2:DescribeNatGateways",
            "ec2:DescribeSecurityGroups",
            "elasticloadbalancing:DescribeLoadBalancers",
            "elasticloadbalancing:DescribeLoadBalancerAttributes",
            "elasticloadbalancing:DescribeTags",
            "secretsmanager:CreateSecret",
            "secretsmanager:TagResource",
            "secretsmanager:GetSecretValue",
            "secretsmanager:DeleteSecret",
            "iam:GetInstanceProfile",
            "iam:AddRoleToInstanceProfile",
            "iam:CreateInstanceProfile",
            "iam:DeleteInstanceProfile",
            "ec2:RunInstances",
            "ec2:ModifyInstanceAttribute",
            "ec2:TerminateInstances",
            "autoscaling:StartInstanceRefresh",
            "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
            "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
            "ssm:UpdateInstanceInformation",
            "ec2:DescribeAvailabilityZones",
            "eks:DescribeCluster",
            "eks:ListClusters",
            "ec2:CreateSecurityGroup",
            "ec2:DeleteSecurityGroup",
            "ec2:RevokeSecurityGroupIngress",
            "ssmmessages:CreateControlChannel",
            "ssmmessages:CreateDataChannel",
            "ssmmessages:OpenControlChannel",
            "ssmmessages:OpenDataChannel",
            "elasticloadbalancing:ConfigureHealthCheck",
            "elasticloadbalancing:DescribeTargetHealth",
            "ec2:CreateTags",
            "ec2:DescribeNetworkInterfaces",
            "elasticloadbalancing:DeleteLoadBalancer",
            "elasticloadbalancing:CreateLoadBalancer",
            "elasticloadbalancing:ModifyLoadBalancerAttributes",
            "ec2:DisassociateAddress",
            "ec2:DescribeAddresses",
            "ec2:DescribeVolumes",
            "ec2:DescribeImages",
            "ec2:ModifyVpcAttribute",
            "s3:GetEncryptionConfiguration",
            "ec2:ModifyVolume",
            "ec2:AttachVolume",
            "ec2:DescribeVolumesModifications",
            "ec2:DetachVolume",
            "elasticloadbalancing:DetachLoadBalancerFromSubnets",
            "ec2:DetachInternetGateway",
            "ec2:DeleteNetworkInterface",
            "tag:GetResources",
            "ec2:ReleaseAddress",
            "ec2:ModifyNetworkInterfaceAttribute",
            "ec2:DescribeNetworkInterfaceAttribute",
            "ec2:AllocateAddress",
            "ec2:AssociateAddress"
        ],
        "Resource": "*"
    },
    {
        "Effect": "Allow",
        "Action": [
            "iam:PassRole"
        ],
        "Resource": [
            "arn:*:iam::*:role/*.cluster-api-provider-aws.sigs.k8s.io"
        ]
    }
  ]
}
```

</TabItem>

</Tabs>

:::info


The following are important points to be aware of.

- Ensure that the role created contain all the policies defined above.

- These IAM policies cannot be used as an inline policy, as it exceeds the 2048 non-whitespace character limit by AWS.

- The following warning is expected and can be ignored: These policies define some actions, resources, or conditions that do not provide permissions. To grant access, policies must have an action that has an applicable resource or condition.

:::

## Global Role Additional Policies

There may be situations where additional node-level policies must be added to your deployment. For instance, when you create a host cluster with the **AWS EBS CSI** storage layer, ensure **AmazonEBSCSIDriverPolicy** is included. To add additional node-level policies, switch to the **Tenant Admin**  project, and click on the **Tenant Settings** on the **Main Menu**. Click on **Cloud Accounts**. Add an account if one does not exists. After validation of the AWS credentials, ensure `Add IAM policies` are enabled. You can specify additional amazon resource names (ARN) to be attached. The attached policies will be included to all the clusters launched with this specific AWS cloud Account.

<br />

** AmazonEBSCSIDriverPolicy:**

```yml
roleName: "custom-ng-role"
  roleAdditionalPolicies:
  - "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
```


## Roles and Policies

Palette creates and attaches IAM roles and policies to the clusters it deploys. Depending on which type of cluster you deploy, either AWS EKS or IaaS (using EC2 instances), Palette creates and attaches different IAM roles and policies.

Select the tab below to review the IAM roles and policies attached to the cluster's IAM role and the node group's IAM role.


<Tabs queryString="service">
<TabItem label="EKS" value="eks">

When you deploy an EKS cluster using Palette, two IAM roles are created automatically. One IAM role is for the cluster, and the other IAM role for the worker node group.

The cluster's IAM role is named in the following syntax, `[cluster-name]-iam-service-role`, and the node group's IAM role is named as `ng-role_worker-pool-[random-string]`. These two IAM roles have customer-managed and AWS-managed IAM policies. You can attach more IAM policies to any of these IAM roles if needed. The following table lists the IAM policies attached to the cluster's IAM role and the node group's IAM role. 

|**Policy Name**|**Type**|**Attached to the cluster's IAM role?**|**Attached to the node group's IAM role?**| **Description** |
|---|---|---|---|---|
|AmazonEKSClusterPolicy|AWS managed|✅ | ❌ | Provides the cluster permissision to manage compute resources. | 
|AmazonEC2ContainerRegistryReadOnly|AWS managed| ❌ |✅ | Provides the node group permission to pull images from Amazon ECR. |
|AmazonEKS_CNI_Policy|AWS managed| ❌ |✅ | Provides the node group permission to manage network resources. |
|AmazonEKSWorkerNodePolicy|AWS managed| ❌ |✅ | This policy allows Amazon EKS worker nodes to connect to Amazon EKS Clusters.|
|AmazonSSMManagedInstanceCore|AWS managed| ❌ |✅ | The policy for Amazon EC2 Role to enable AWS Systems Manager service core functionality. |


In addition to the policies listed above, if you specified other IAM policies during the AWS account registration, those policies are also attached to the cluster's IAM role and the node group's IAM role. 


</TabItem>
<TabItem label="IaaS" value="iaas">


When you deploy an IaaS cluster using Palette, two IAM roles are created automatically. One IAM role is for the cluster control nodes, and the other IAM role for the worker nodes.

The control plane nodes IAM role is named `control-plane.cluster-api-provider-aws.sigs.k8s.io`, and the node group's IAM role is named as `nodes.cluster-api-provider-aws.sigs.k8s.io`. These two IAM roles have customer-managed and AWS-managed IAM policies. You can attach more IAM policies to any of these IAM roles if needed. The following table lists the IAM policies attached to the cluster's IAM role and the node group's IAM role. 

|**Policy name**|**Type**|**Attached to the control plane IAM role?**|**Attached to the node group's IAM role?**| **Description** |
|---|---|---|---|--|
| control-plane.cluster-api-provider-aws.sigs.k8s.io | Customer-managed|✅ | ❌ | Provides the control plane nodes access to compute services such as EC, autoscaling, and more.|
| controllers-eks.cluster-api-provider-aws.sigs.k8s.io | Customer-managed|✅ | ❌ | Provides the control plane nodes access to EKS services and AWS SSM.|
| controllers.cluster-api-provider-aws.sigs.k8s.io | Customer-managed | ✅ | ❌ | Provides the control plane nodes access to network resources, S3, and other services. |
| nodes.cluster-api-provider-aws.sigs.k8s.io | Customer-managed | ✅ | ✅  | Provides access to services EC2 and ECR. |
|AmazonEKSWorkerNodePolicy|AWS managed| ❌ |✅ | This policy allows Amazon EKS worker nodes to connect to Amazon EKS Clusters.|



In addition to the policies listed above, if you specified other IAM policies during the AWS account registration, those policies are also attached to the cluster's IAM role and the node group's IAM role. Other policies may also be attached to the IAM roles depending on the storage layer and network layer pack you choose.


</TabItem>

</Tabs>


:::caution

Be aware that AWS has a default limit of 10 policies per role. If you exceed this limit, the cluster deployment may fail due to the IAM role policy limit. Request a [service quota increase](https://docs.aws.amazon.com/servicequotas/latest/userguide/request-quota-increase.html) for the AWS account to increase the limit.

:::