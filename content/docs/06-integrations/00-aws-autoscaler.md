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
The Cluster Autoscaler dynamically scales cluster resources. It monitors the workload and provisions or shuts down cluster nodes to maximize cluster utilization. It resizes the Kubernetes cluster under the following conditions:
<br />

* Insufficient resources leading to multiple pod failures in the cluster. The Cluster Autoscaler redistributes these pods to different nodes in such cases.


* Underutilized cluster nodes for a specific period. In this scenario, the Cluster Autoscaler migrates the pods from underutilized nodes to other available nodes.


Cluster Autoscaler pack runs as a `Deployment` in your cluster and utilizes [Amazon EC2 Auto Scaling Groups](https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html) to manage node groups. To know the internal details of the pack, check out the pack manifest [here](https://github.com/spectrocloud/pax/tree/master/stable/addon/systemapps).



# Versions Supported

<Tabs>

<Tabs.TabPane tab="1.26.x" key="1.26.x">

## Prerequisites

* Kubernetes 1.24.x or higher. 

</Tabs.TabPane>

<Tabs.TabPane tab="1.24.x" key="1.24.x">

## Prerequisites

* Kubernetes 1.19.x or higher. 

</Tabs.TabPane>

<Tabs.TabPane tab="1.0.x" key="1.0.x">

## Prerequisites

* Kubernetes 1.19.x or higher. 

</Tabs.TabPane>

</Tabs>

* Permission to create an IAM policy in the AWS account you use with Palette. 


* IAM policy - The following IAM policy must be attached to the EKS cluster's node group. The policy below will allow the Cluster Autoscaler to scale the cluster's node groups. There are two ways to achieve this prerequisite. You can define the policy  as a *customer-managed* policy in the AWS account and use its Amazon Resource Name (ARN) in the cluster profile. Alternatively, you can attach the following IAM policy as an *inline* policy to the node group if you have already deployed your cluster. Refer to the [Usage](#usage) section below for more details. 
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
<br />

* Updated Kubernetes layer manifest - The Kubernetes pack's manifest should be updated with the newly created IAM policy ARN. The YAML code block below shows the `managedMachinePool.roleAdditionalPolicies` section to update in the Kubernetes pack's manifest. Refer to the [Usage](#usage) section below for more details with an example. 
<br />

  ```yaml
  managedMachinePool:
    #roleName: {{ name of the self-managed role | format "${string}" }}
    ## A list of additional policies to attach to the node group role
    roleAdditionalPolicies:
    - {{ arn for the policy1 | format "${string}" }}
  ```
<br />

## Usage

To use the Cluster Autoscaler pack, you must first define an IAM policy in the AWS account associated with Palette. 

Next, update the cluster profile to specify the IAM policy ARN in the Kubernetes pack's manifest. Palette will attach that IAM policy to your cluster's node group during deployment. Note that Palette automatically creates two IAM roles in the AWS account when you deploy an EKS cluster. One role is for the cluster, and another for the cluster's node group. The cluster's IAM role name will have the following naming convention, `[your-cluster-name]-iam-service-role`, and the node group's IAM role name will follow the `ng-role_worker-pool-[random-string]` naming convention. 

The following steps provide detailed instructions for the prerequisites discussed above.

<br />

1. Define the new IAM policy, using the IAM policy outlined in the prerequisites section above, and give it a name, for example, *PaletteEKSClusterAutoscaler*. 


2. Copy the IAM policy ARN to the clipboard for the next step. For example, the policy ARN will be similar to `arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler`. 


3.  In your cluster profile, and update the `managedMachinePool.roleAdditionalPolicies` section in the Kubernetes pack's manifest with the newly created IAM policy ARN. The snapshot below shows the section to update with the policy ARN. 

  ![A snapshot showing the ARN added to the Kubernetes pack's manifest.](/integrations_aws-cluster-autoscaler_k8s-manifest.png)

  For example, the code block below shows the updated `managedMachinePool.roleAdditionalPolicies` section with a sample policy ARN, `"arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler"`. Before you use the following code block, replace the ARN below with yours. 
<br />

  ```yaml
  managedMachinePool:
    # roleName: {{ name of the self-managed role | format "${string}" }}
    # A list of additional policies to attach to the node group role
    roleAdditionalPolicies:
    - "arn:aws:iam::650628870702:policy/PaletteEKSClusterAutoscaler"
  ```
  <br />

  <InfoBox>

  If you do not want to update the Kubernetes pack's manifest, you can add an *inline* IAM policy to the cluster's node group post deployment. Refer to this [AWS guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console) on how to embed an inline policy for a user or role. Refer to the [AWS IAM documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_managed-vs-inline.html) for the differences between managed and inline policies.

  </InfoBox>


4. In the cluster deployment wizard, when you are in the **Nodes configuration** section, you must enter the minimum and maximum number of worker pool nodes, and the instance type (size) that suits your requirement.

  You need to enter these node count limits because Cluster Autoscaler uses Auto Scaling Group to manage the cluster's node group. Auto Scaling Group requires a minimum and maximum count and the instance type. Also, specify the instance type (size). You can choose an instance type that suits your requirement. 

  For example, the snapshot below shows the minimum one and maximum three node count for the Cluster Autoscaler. 

  ![A snapshot showing the minimum and maximum node count in Palette.](/integrations_aws-cluster-autoscaler_node-count.png)

<br />

### Use Cases 

This subsection outlines how the pack works. The Cluster Autoscaler will automatically adjust the number of nodes in your cluster when either of these events occur:
<br />

- Multiple pods fail due to resource contention. In this case, Cluster Autoscaler will provision more nodes. 


- Nodes are underutilized for a specific period.  In this case, Cluster Autoscaler will reschedule the pods onto other nodes, and shut down the underutilized node. 
<br />

### Example

This subsection shows an example to validate the Cluster Autoscaler working. Use the following steps to manually trigger the pod rescheduling event:
<br />

1. In the cluster deployment wizard, while defining the **Nodes configuration**, choose a large-sized instance type. For example, you can choose your worker pool to have instance size **t3.2xlarge** (8 vCPUs, 32 GB RAM) or higher. 


2. After your cluster is successfully deployed, navigate to the **Nodes** tab in the cluster details page in Palette, and note the count and size of nodes. For example, the snapshot below shows one node of type **t3.2xlarge** in the worker pool of a successfully deployed cluster.   

  ![A snapshot showing one node of type **t3.2xlarge** in the worker pool.](/integrations_aws-cluster-autoscaler_one-node.png)



3. Manually reduce the instance size in the worker-pool configuration. For example, reduce the instance size to **t3.medium** (2 vCPUs, 8 GB RAM). The snapshot below shows how to edit the instance size in the node pool configuration.

  ![A snapshot showing how to edit node pool configuration.](/integrations_aws-cluster-autoscaler_edit-node.png)


4. Wait for a few minutes for the new nodes to provision. Reducing the node size will make the Cluster Autoscaler shut down the large node and provision smaller-sized nodes with enough capacity to accommodate the current workload. Also, the new nodes' count will be within the minimum and maximum limit you specified for the worker pool. 

  
  For example, the snapshot below shows two new nodes of size **t3.medium** spin up automatically. These two smaller-sized nodes will be able to handle the workload just as well as the single large-sized node. 

  ![A snapshot showing new nodes of size **t3.medium** spin up automatically, *collectively* providing enough capacity to accommodate the current workload. ](/integrations_aws-cluster-autoscaler_two-nodes.png)
  <br />


# Troubleshooting

If you are facing the `LimitExceeded: Cannot exceed quota for PoliciesPerRole:10` error in the cluster deployment logs, it may be because the default IAM role Palette creates for the node group already has 10 policies attached to it, and you are trying to attach one more. By default, your AWS account will have a quota of 10 managed policies per IAM role. To fix the error, follow the instruction on this [AWS guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html#reference_iam-quotas-entities) to request a quota increase. 



If you encounter an `executable aws-iam-authenticator not found` error in your terminal while trying to access your EKS cluster from your local machine, you can resolve it by installing the 
[aws-iam-authenticator](https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html) plugin on your local machine. 


# References

- [Cluster Autoscaler on AWS](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/aws/README.md)


- [Amazon EKS Autoscaling](https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html)