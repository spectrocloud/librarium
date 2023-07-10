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

Palette supports autoscaling for AWS EKS clusters, ensuring cluster nodes launch according to the workload. 

The AWS cluster autoscaler dynamically scales resources up or down based on the changing cluster workload. It monitors the workload and provisions or shuts down cluster nodes to maintain consistent cluster utilization. It resizes the Kubernetes cluster under the following conditions:

* Insufficient resources leading to multiple pod failures in the cluster. The AWS cluster autoscaler redistributes these pods to different nodes in such cases.

* Underutilized cluster nodes for a specific period. In this scenario, the AWS cluster autoscaler migrates the pods from underutilized nodes to other available nodes.

# Versions Supported

<Tabs>

<Tabs.TabPane tab="1.24+" key="1.24.x">

**1.24+**

You can use AWS cluster autoscaler with the Kubernetes control plane (previously referred to as *master*) version 1.24.x or higher. 




# Prerequisite

* Kubernetes version 1.24.x and above.


* A full cluster autoscaler policy applied to the cluster in AWS console as an inline policy. Below is the recommended full cluster autoscaler policy.
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


* Update the Kubernetes pack's  `managedMachinePool` node group with the **ARN** of the autoscaler policy created for the service account. Here is an example YAML configuration. 
<br />

  ```yaml
  managedMachinePool:
    #roleName: {{ name of the self-managed role | format "${string}" }}

    ## A list of additional policies to attach to the node group role
    roleAdditionalPolicies:
    - "arn:aws:iam::012345678910:policy/autoscalingpolicy"
  ```

## Usage

Deploy an EKS cluster with a cluster autoscaler pack. Ensure that your worker pool is made up of instance size **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher, and then manually scale the instance size down to **t3.medium** (2 vCPUs, 8 GB RAM). Scaling down the instance size will result in insufficient resources for some pods. 

Suppose you have configured the AWS cluster autoscaler correctly. In that case, it will recognize the node's unscheduled pods and scale up the cluster by creating an additional node to accommodate them.

To confirm the creation of the new node, review the pod logs.


</Tabs.TabPane>

</Tabs>



# References

[Cluster Autoscaler on AWS](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md)

