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

Palette supports autoscaling for EKS clusters by using the AWS Cluster Autoscaler pack. 
The AWS Cluster Autoscaler dynamically scales cluster resources. It monitors the workload and provisions or shuts down cluster nodes to maximize cluster utilization. It resizes the Kubernetes cluster under the following conditions:
<br />

* Insufficient resources leading to multiple pod failures in the cluster. The AWS Cluster Autoscaler redistributes these pods to different nodes in such cases.


* Underutilized cluster nodes for a specific period. In this scenario, the AWS Cluster Autoscaler migrates the pods from underutilized nodes to other available nodes.

# Versions Supported

<Tabs>

<Tabs.TabPane tab="1.26.x" key="1.26.x">

## Prerequisite

* Kubernetes 1.24.x or higher. 

* Permission to create an IAM policy in the AWS account you use with Palette. 

* **IAM Policy** - The following full Cluster Autoscaler policy should be attached to the cluster's node group. There are two ways to achieve this prerequisite. You can define this as a customer-managed policy in the AWS account and use its Amazon Resource Name (ARN) in the cluster profile. Alternatively, you can attach the following IAM policy directly to the node group if you have already deployed your cluster. Refer to the **Usage** section below for more details. 
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


* **Update the Kubernetes Layer Manifest** - 
Kubernetes pack's manifest should be updated with the ARN of the newly created IAM policy. The YAML code snippet below shows the `managedMachinePool.roleAdditionalPolicies` section to update in the Kubernetes pack's manifest. Refer to the **Usage** section below for more details with an example. 
<br />

  ```yaml
  managedMachinePool:
    #roleName: {{ name of the self-managed role | format "${string}" }}

    ## A list of additional policies to attach to the node group role
    roleAdditionalPolicies:
    - {{ arn for the policy1 | format "${string}" }}
  ```


## Usage

The first step is to define a customer-managed IAM policy in the AWS account. To define the new IAM policy, use the full Cluster Autoscaler policy outlined in the prerequisites section above, and give it a name, for example, *PaletteEKSClusterAutoscaler*. 

After defining the IAM policy, copy its ARN. For example, the policy ARN will be similar to `arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler`.

The second step is to update the cluster profile. Switch back to Palette, and create a new cluster profile or update an existing one. In the Kubernetes layer, update the Kubernetes pack's manifest with the ARN of the newly created IAM policy. The example code block below shows the `managedMachinePool.roleAdditionalPolicies` section to update in the Kubernetes pack's manifest. Replace  `"arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler"` with your IAM policy ARN. 

<br />

  ```yaml
  managedMachinePool:
    # roleName: {{ name of the self-managed role | format "${string}" }}
    # A list of additional policies to attach to the node group role
    roleAdditionalPolicies:
    - "arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler"
  ```

The snapshot below shows policy ARN, `arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler`, added to the `managedMachinePool.roleAdditionalPolicies` section in the Kubernetes pack's manifest. 


**Snapshot 1**


<InfoBox>

If you do not want to update the Kubernetes pack's manifest, add the AWS Autoscaler pack to the cluster profile and add an *inline* IAM policy to the cluster's node group role. 

</InfoBox>


Adding the ARN of your newly created IAM policy to the Kubernetes pack's manifest will make Palette add it to the node group's role. 

Note that when you deploy an EKS cluster using Palette, Palette creates two IAM roles automatically - one for the cluster and another for the node group. Refer to the [XXXXX]() documentation to know about the constituent IAM policies of these two roles. 

|**Policy name**|**Type**|Attached to the cluster's IAM role?|Attached to the node group's IAM role?|
|---|---|---|---|
|PaletteBackupRestore| Customer-managed|✅ |✅ |
|PaletteControlPlanePolicy| Customer-managed|✅ |✅ |
|PaletteControllerPolicy| Customer-managed|✅ |✅ |
|PaletteDeploymentPolicy| Customer-managed|✅ |✅ |
|PaletteNodesPolicy| Customer-managed|✅ |✅ |
|AmazonEKSClusterPolicy|AWS managed|✅ |--|
|AmazonEBSCSIDriverPolicy|AWS managed|✅ |✅ |
|AmazonEC2ContainerRegistryReadOnly|AWS managed|--|✅ |
|AmazonEKS_CNI_Policy|AWS managed|--|✅ |
|AmazonEKSWorkerNodePolicy|AWS managed|--|✅ |
|AmazonSSMManagedInstanceCore|AWS managed|--|✅ |



After updating your Kubernetes pack, add other layers per your requirements if you create a new cluster profile. Next, add AWS Cluster Autoscaler pack as an add-on layer. Once your cluster profile is ready, deploy it to a cluster. 

During the cluster configuration, ensure that your worker pool is made up of instance size **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher. The snapshot below shows one node of type **t3.2xlarge** in the worker pool.  


**Snapshot 2 - ONE single node**


After your cluster is deployed successfully, validate the functioning of the AWS AutoScaler pack by navigating to the **Nodes** tab in the cluster details page in Palette. Notice the current nodes in the worker pool, and edit the configuration to scale the instance size down to **t3.medium** (2 vCPUs, 8 GB RAM). The snapshot below shows how to edit the instance size in the node pool configuration in Palette. 


**Snapshot 3 - Edit node pool**


Scaling down the instance size will result in insufficient resources for some pods. Consequently, Cluster Autoscaler will provision new nodes with smaller instance sizes, *collectively* providing enough capacity to accommodate the current workload. The snapshot below shows new nodes of size **t3.medium** spin up automatically.


**Snapshot 4 - TWO new nodes**

AWS Cluster Autoscaler dynamically scales cluster nodes to maximize cluster utilization by monitoring the workload. If nodes are overutilized, it will provision new nodes to accommodate unscheduled pods. On the other hand, if nodes are underutilized, it will migrate the pods from underutilized to other available nodes and shut down underutilized ones.   




</Tabs.TabPane>

<Tabs.TabPane tab="1.24.x" key="1.24.x">


</Tabs.TabPane>

<Tabs.TabPane tab="1.0.x" key="1.0.x">


</Tabs.TabPane>

</Tabs>


# References

[Cluster Autoscaler on AWS](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md)

