---
title: 'AWS Cluster Autoscaler'
metaTitle: 'AWS Cluster Autoscaler'
metaDescription: 'AWS Cluster Autoscaler for Spectro Cloud Palette'
hiddenFromNav: true
isIntegration: true
category: ['system app']
logoUrl: 'https://registry.dev.spectrocloud.com/v1/aws-cluster-autoscaler/blobs/sha256:f86813591b3b63b3afcf0a604a7c8c715660448585e89174908f3c6a421ad8d8?type=image/png'
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import Tooltip from "shared/components/ui/Tooltip";

# AWS Cluster Autoscaler

Palette supports Autoscaling for our **EKS clusters** to maximise the benefits of the AWS Cloud utilization. Palette Auto Scaling ensures that instances are launched propotional to the workload on the EKS cluster. The resources are scaled up and down based on the changing workload on the cluster by continously monitoring the applications and automatically adjusts the capacity to maintain steady, predictable performance at the lowest possible cost.


# Prerequisite

* Kubernetes version 1.19.x and above.
* Full Cluster Autoscaler Policy for the service account.
* Update the Kubernetes Pack node group `managedMachinePool` with the **ARN** of the autoscaler policy created for the service account.


## Full Cluster Autoscaler Features Policy (Recommended)

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
        "ec2:DescribeInstanceTypes",
        "eks:DescribeNodegroup"
      ],
      "Resource": ["*"]
    }
  ]
}
```
<InfoBox>

To deploy AWS Autoscaler, update the Kubernetes pack `managedMachinePool` node group with the **ARN** of the autoscaler policy created for the service account.

```yaml
managedMachinePool:
  #roleName: {{ name of the self-managed role | format "${string}" }}

  ## A list of additional policies to attach to the node group role
  roleAdditionalPolicies:
  - "arn:aws:iam::012345678910:policy/autoscalingpolicy" 
```
</InfoBox>

 
## Versions Supported

<Tabs>

<Tabs.TabPane tab="1.22.x" key="1.22.x">

**1.22.2**

</Tabs.TabPane>

<Tabs.TabPane tab="1.0.x" key="1.0.x">

**1.0.0**

</Tabs.TabPane>
</Tabs>

## References

https://github.com/splunk/splunk-connect-for-kubernetes
