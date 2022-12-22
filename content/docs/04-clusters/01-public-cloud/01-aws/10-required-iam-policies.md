---
title: "Required IAM Policies"
metaTitle: "Required IAM Policies or Palette"
metaDescription: "A list of required IAM policies that Palette requires."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Required IAM Policies

Palette requires proper Amazone Web Services (AWS) permissions in order to operate and perform actions on your behalf.
The following four policies include all the required permissions for provisioning clusters through Palette:

<br />

<Tabs>

<Tabs.TabPane tab="Controller Policy" key="Controller Policy">


### Controller Policy 

**Last Update**: December 16, 2022

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
                "ec2:ReplaceRoute",
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
                "arn:*:iam::*:role/aws-service-role/eks-fargate-pods.amazonaws.com/AWSServiceRoleForAmazonEKSForFargate"
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
                "arn:*:iam::aws:policy/AmazonEKSClusterPolicy"
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
                "arn:*:eks:*:*:cluster/*"
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

**Last Update**: May 2, 2021

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

**Last Update**: May 2, 2021

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

**Last Update**: May 2, 2021

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
                "iam:ListPolicies",  
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

# Restricting Palette VPC Permissions

You can choose to have Palette operate in a static or dynamic environment. You can configure Palette to perform an AWS cluster creation into an existing VPC. The following policy allows Palette operate but restricts its access to the [Principle of Least Privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).


<br />
<br />

<Tabs>
<Tabs.TabPane tab="Minimum Dynamic Permissions" key="Minimum Dynamic Permissions">

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

</Tabs.TabPane>

<Tabs.TabPane tab="Minimum Static Permissions" key="Minimum Static Permissions">


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

</Tabs.TabPane>

</Tabs>

<InfoBox>


The following are important points to be aware of.

- Ensure that the role created contain all the policies defined above.

- These IAM policies cannot be used as an inline policy, as it exceeds the 2048 non-whitespace character limit by AWS.

- The following warning is expected and can be ignored: These policies define some actions, resources, or conditions that do not provide permissions. To grant access, policies must have an action that has an applicable resource or condition.

</InfoBox>

# Global Role Additional Policies:

There may be situations where additional node-level policies must be added to your deployment. For instance, when you create a host cluster with the **AWS EBS CSI** storage layer, ensure **AmazonEBSCSIDriverPolicy** is included. To add additional node-level policies, switch to the **Tenant Admin**  project, and click on the **Tenant Settings** on the **Main Menu**. Click on **Cloud Accounts**. Add an account if one does not exists. After validation of the AWS credentials, ensure `Add IAM policies` are enabled. You can specify additional amazon resource names (ARN) to be attached. The attached policies will be included to all the clusters launched with this specific AWS cloud Account.

<br />

** AmazonEBSCSIDriverPolicy:**
```yml
roleName: "custom-ng-role"
  roleAdditionalPolicies:
  - "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
```