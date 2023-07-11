---
title: 'AWS Cluster Autoscaler'
metaTitle: 'AWS Cluster Autoscaler'
metaDescription: 'AWS Cluster Autoscaler for Spectro Cloud Palette'
hiddenFromNav: true
type: "integration"
category: ['system app']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/aws-cluster-autoscaler/blobs/sha256:f86813591b3b63b3afcf0a604a7c8c715660448585e89174908f3c6a421ad8d8?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# AWS Cluster Autoscaler

The AWS Cluster Autoscaler dynamically scales cluster resources. It monitors the workload and provisions or shuts down cluster nodes to maintain the desired cluster utilization. It resizes the Kubernetes cluster under the following conditions:
<br />

* Insufficient resources leading to multiple pod failures in the cluster. The AWS Cluster Autoscaler redistributes these pods to different nodes in such cases.


* Underutilized cluster nodes for a specific period. In this scenario, the AWS Cluster Autoscaler migrates the pods from underutilized nodes to other available nodes.

# Versions Supported

<Tabs>

<Tabs.TabPane tab="1.26.x" key="1.26.x">

## Prerequisite

* Kubernetes server (control plane) version 1.24.x or higher. 


* **IAM Policy** - A full Cluster Autoscaler policy applied to the cluster in AWS console as an inline policy. Below is the recommended full Cluster Autoscaler policy.
<br />

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "autoscaling:DescribeAutoScalingGroups",
          "autoscaling:DescribeAutoScalingInstances",
          "autoscaling:DescribeLaunchConfigurations",
          "autoscaling:DescribeScalingActivities",
          "autoscaling:DescribeTags",
          "ec2:DescribeInstanceTypes",
          "ec2:DescribeLaunchTemplateVersions"
        ],
        "Resource": ["*"]
      },
      {
        "Effect": "Allow",
        "Action": [
          "autoscaling:SetDesiredCapacity",
          "autoscaling:TerminateInstanceInAutoScalingGroup",
          "ec2:DescribeImages",
          "ec2:GetInstanceTypesFromInstanceRequirements",
          "eks:DescribeNodegroup"
        ],
        "Resource": ["*"]
      }
    ]
  }
  ```

* **Kubernetes Layer Configuration** - Update the Kubernetes pack's YAML configuration. In the `managedMachinePool` node group, add the Amazon Resource Name (ARN) of the IAM policy created for the service account. The exmaple below shows how you can add the IAM policy's ARN to your Kubernetes pack's YAML configuration. In this example, replace the `"arn:aws:iam::012345678910:policy/autoscalingpolicy"` with the ARN of your IAM policy. 
<br />

  ```yaml
  managedMachinePool:
    # roleName: {{ name of the self-managed role | format "${string}" }}
    # A list of additional policies to attach to the node group role
    roleAdditionalPolicies:
    - "arn:aws:iam::012345678910:policy/autoscalingpolicy"
  ```

## Usage

Deploy a AWS EKS cluster with the AWS Cluster Autoscaler pack. Ensure that your worker pool is made up of instance size **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher, and then manually scale the instance size down to **t3.medium** (2 vCPUs, 8 GB RAM). Scaling down the instance size will result in insufficient resources for some pods. 

Suppose you have configured the AWS Cluster Autoscaler correctly. In that case, it will recognize the node's unscheduled pods and scale up the cluster by creating an additional node to accommodate them.

To confirm the creation of the new node, you can review the pod logs.


</Tabs.TabPane>

<Tabs.TabPane tab="1.24.x" key="1.24.x">

## Prerequisite

* Kubernetes server (control plane) version 1.19.x or higher. 


* **IAM Policy** - A full Cluster Autoscaler policy applied to the cluster in AWS console as an inline policy. Below is the recommended full Cluster Autoscaler policy.
<br />

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "autoscaling:DescribeAutoScalingGroups",
          "autoscaling:DescribeAutoScalingInstances",
          "autoscaling:DescribeLaunchConfigurations",
          "autoscaling:DescribeScalingActivities",
          "autoscaling:DescribeTags",
          "ec2:DescribeInstanceTypes",
          "ec2:DescribeLaunchTemplateVersions"
        ],
        "Resource": ["*"]
      },
      {
        "Effect": "Allow",
        "Action": [
          "autoscaling:SetDesiredCapacity",
          "autoscaling:TerminateInstanceInAutoScalingGroup",
          "ec2:DescribeImages",
          "ec2:GetInstanceTypesFromInstanceRequirements",
          "eks:DescribeNodegroup"
        ],
        "Resource": ["*"]
      }
    ]
  }
  ```

* **Kubernetes Layer Configuration** - Update the Kubernetes pack's YAML configuration. In the `managedMachinePool` node group, add the Amazon Resource Name (ARN) of the IAM policy created for the service account. The exmaple below shows how you can add the IAM policy's ARN to your Kubernetes pack's YAML configuration. In this example, replace the `"arn:aws:iam::012345678910:policy/autoscalingpolicy"` with the ARN of your IAM policy. 
<br />

  ```yaml
  managedMachinePool:
    # roleName: {{ name of the self-managed role | format "${string}" }}
    # A list of additional policies to attach to the node group role
    roleAdditionalPolicies:
    - "arn:aws:iam::012345678910:policy/autoscalingpolicy"
  ```

## Usage

Deploy an EKS cluster with the AWS Cluster Autoscaler pack. Ensure that your worker pool is made up of instance size **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher, and then manually scale the instance size down to **t3.medium** (2 vCPUs, 8 GB RAM). Scaling down the instance size will result in insufficient resources for some pods. 

Suppose you have configured the AWS Cluster Autoscaler correctly. In that case, it will recognize the node's unscheduled pods and scale up the cluster by creating an additional node to accommodate them.

To confirm the creation of the new node, you can review the pod logs.


</Tabs.TabPane>

<Tabs.TabPane tab="1.0.x" key="1.0.x">


## Prerequisite

* Kubernetes server (control plane) version 1.19.x or higher. 


* **IAM Policy** - A full Cluster Autoscaler policy applied to the cluster in AWS console as an inline policy. Below is the recommended full Cluster Autoscaler policy.
<br />

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "autoscaling:DescribeAutoScalingGroups",
          "autoscaling:DescribeAutoScalingInstances",
          "autoscaling:DescribeLaunchConfigurations",
          "autoscaling:DescribeScalingActivities",
          "autoscaling:DescribeTags",
          "ec2:DescribeInstanceTypes",
          "ec2:DescribeLaunchTemplateVersions"
        ],
        "Resource": ["*"]
      },
      {
        "Effect": "Allow",
        "Action": [
          "autoscaling:SetDesiredCapacity",
          "autoscaling:TerminateInstanceInAutoScalingGroup",
          "ec2:DescribeImages",
          "ec2:GetInstanceTypesFromInstanceRequirements",
          "eks:DescribeNodegroup"
        ],
        "Resource": ["*"]
      }
    ]
  }
  ```

* **Kubernetes Layer Configuration** - Update the Kubernetes pack's YAML configuration. In the `managedMachinePool` node group, add the Amazon Resource Name (ARN) of the IAM policy created for the service account. The exmaple below shows how you can add the IAM policy's ARN to your Kubernetes pack's YAML configuration. In this example, replace the `"arn:aws:iam::012345678910:policy/autoscalingpolicy"` with the ARN of your IAM policy. 
<br />

  ```yaml
  managedMachinePool:
    # roleName: {{ name of the self-managed role | format "${string}" }}
    # A list of additional policies to attach to the node group role
    roleAdditionalPolicies:
    - "arn:aws:iam::012345678910:policy/autoscalingpolicy"
  ```

## Usage

Deploy an EKS cluster with the AWS Cluster Autoscaler pack. Ensure that your worker pool is made up of instance size **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher, and then manually scale the instance size down to **t3.medium** (2 vCPUs, 8 GB RAM). Scaling down the instance size will result in insufficient resources for some pods. 

Suppose you have configured the AWS Cluster Autoscaler correctly. In that case, it will recognize the node's unscheduled pods and scale up the cluster by creating an additional node to accommodate them.

To confirm the creation of the new node, you can review the pod logs.



</Tabs.TabPane>

</Tabs>


# References

[Cluster Autoscaler on AWS](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md)

