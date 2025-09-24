---
sidebar_label: "Create and Manage AWS IaaS Cluster"
title: "Create and Manage AWS Cluster"
description: "Learn how to add and manage a cluster deployed to AWS."
hide_table_of_contents: false
tags: ["public cloud", "aws"]
sidebar_position: 20
---

Palette supports creating and managing Kubernetes clusters deployed to an AWS account. This section guides you on how to
create a Kubernetes cluster in AWS that is managed by Palette.

## Prerequisites

The following prerequisites must be met before deploying a cluster to AWS:

- Access to an AWS cloud account

  - AWS clusters deployed by Palette use the
    [AWS Instance Metadata Service (IMDS)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html)
    configuration specified in the EC2 account defaults. Refer to the
    [Configure the Instance Metadata Service options](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-options.html)
    guide for further information.

- You have added an AWS account in Palette. Review [Add AWS Account](add-aws-accounts.md) for guidance.

- An infrastructure cluster profile. Review
  [Create an Infrastructure Profile](../../../profiles/cluster-profiles/create-cluster-profiles/create-infrastructure-profile.md)
  for guidance.

- An [EC2 Key Pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) in the target region.

- Palette creates compute, network, and storage resources in AWS during the provisioning of Kubernetes clusters. Ensure
  there is sufficient capacity in the preferred AWS region for the creation of the following resources:

  - vCPU
  - VPC
  - Elastic IP
  - Internet Gateway
  - Elastic Load Balancers
  - NAT Gateway

  <br />

  :::info

  The following tags should be added to the virtual private network (VPC) public subnets to enable automatic subnet
  discovery for integration with AWS load balancer service. Replace the value `yourClusterName` with your cluster's
  name.

  - `kubernetes.io/role/elb = 1`
  - `sigs.k8s.io/cluster-api-provider-aws/role = public`
  - `kubernetes.io/cluster/[yourClusterName] = shared`
  - `sigs.k8s.io/cluster-api-provider-aws/cluster/[yourClusterName] = owned`

  :::

- Ensure you don't have an existing security group that starts with the cluster name followed by the text `-node` in the
  selected VPC. Palette will automatically create a security group using the cluster name as a prefix followed by the
  text `-node`. The format is `[name of cluster]-node`. If you have an existing security group with the same name, you
  will need to either rename the existing security group before creating the cluster, or use a different cluster name.
  Otherwise, the cluster creation will fail due to duplicate resource name in the VPC.

## Deploy an AWS Cluster

Use the following steps to provision a new AWS cluster:

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left **Main Menu** select **Clusters**, and click **Add New Cluster**.

4. In **Public Clouds**, under **Infrastructure Provider**, select **AWS IaaS**.

5. In the bottom-right corner, click **Start AWS IaaS Configuration**.

6. Fill out the following basic information and click **Next**.

   | **Field**         | **Description**                                                                                                                                                                                     |
   | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Cluster Name**  | A custom name for the cluster.                                                                                                                                                                      |
   | **Description**   | Use the description to provide context about the cluster.                                                                                                                                           |
   | **Tags**          | Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `region:us-east-1a` or `zone:vpc-private-us-east-1a`. |
   | **Cloud Account** | If you already added your AWS account in Palette, select it from the **drop-down Menu**. Otherwise, click **Add New Account** and add your AWS account information.                                 |

   To learn how to add an AWS account, review the [Add an AWS Account to Palette](add-aws-accounts.md) guide.

7. Click **Add Cluster Profile**, select a cluster profile and click **Next**. Palette displays the cluster profile
   layers.

8. Review the profile layers and customize parameters as desired in the YAML files that display when you select a layer.
   All pack parameters contain default values from the cluster profile.

9. Provide the AWS cloud account and placement information.

   | **Parameter**             | **Description**                                                                                                                                                                                                                         |
   | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Cloud Account**         | Select the desired cloud account. AWS cloud accounts with AWS credentials need to be pre-configured in project settings.                                                                                                                |
   | **Region**                | Choose the preferred AWS region where you would like to provision clusters.                                                                                                                                                             |
   | **SSH Key Pair Name**     | Choose the desired SSH Key pair. SSH key pairs need to be pre-configured on AWS for the desired regions. The selected key is inserted into the provisioned VMs.                                                                         |
   | **Static Placement**      | Check the **Static Placement** box if you want to deploy resources into pre-existing VPCs and subnets. Review the [Static Placement](#static-placement) table below to learn more about the required input fields.                      |
   | **Private API Server LB** | Enable to deploy the cluster load balancer in a private subnet. This feature requires Palette to have direct network connectivity with the private subnet or a [Private Cluster Gateway](../../pcg/pcg.md) deployed in the environment. |

   #### Static Placement

   | Parameter                | Description                                                                    |
   | ------------------------ | ------------------------------------------------------------------------------ |
   | **VPCID**                | Select the Virtual Private Cloud (VPC) ID network from the **drop-down Menu**. |
   | **Control plane subnet** | Select the control plane network from the **drop-down Menu**.                  |
   | **Worker Network**       | Select the worker network from the **drop-down Menu**.                         |

10. Configure the control plane and worker node pool. Specify availability zones, instance types,
    [instance cost type](architecture.md#spot-instances), disk size, the number of nodes, and
    [autoscaler support](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/clusterapi/README.md),
    as necessary. Refer to the [Node Pool](../../cluster-management/node-pool.md) documentation to learn more about the
    node pool configuration.

    The minimum number of CPUs and amount of memory depend on your cluster profile, but in general you need at least 4
    CPUs and 4 GB of memory both in the control plane pool and across all worker pools.

    :::info

    You can add new worker pools if you need to customize certain worker nodes to run specialized workloads. As an
    example, the default worker pool may be configured with the m3.large instance types for general-purpose workloads,
    and another worker pool with instance type g2.2xlarge can be configured to run GPU workloads.

    :::

11. An optional taint label can be applied to a node pool during the cluster creation. For an existing cluster, the
    taint label can be edited, review the [Node Pool](../../cluster-management/node-pool.md) management page to learn
    more. Toggle the **Taint** button to create a label.

12. Enable or disable node pool taints. If tainting is enabled, then you need to provide values for the following
    parameters:

    | **Parameter** | **Description**                                                                                     |
    | ------------- | --------------------------------------------------------------------------------------------------- |
    | **Key**       | Custom key for the taint.                                                                           |
    | **Value**     | Custom value for the taint key.                                                                     |
    | **Effect**    | Make the choice of effect from the drop-down menu. Review the effect table bellow for more details. |

    #### Effect Table

    | **Parameter**        | **Description**                                                                                                                              |
    | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
    | **NoSchedule**       | A pod that cannot tolerate the node taint and should not be scheduled to the node.                                                           |
    | **PreferNoSchedule** | The system will avoid placing a non-tolerant pod to the tainted node but is not guaranteed.                                                  |
    | **NoExecute**        | New pods will not be scheduled on the node, and existing pods on the node if any on the node will be evicted they do not tolerate the taint. |

13. If you checked the **Static Placement** box in the **Cluster config** page, you can specify additional AWS
    [security groups](https://docs.aws.amazon.com/vpc/latest/userguide/security-groups.html) to apply to the worker
    group nodes. Use the **Additional Security Groups (Optional) drop-down Menu** to select additional security groups.

14. Click **Next**.

15. Configure the patching schedule, security scans, backup settings, and set up Role Based Access Control (RBAC).
    Review the cluster settings and make changes if needed.

16. Click **Validate** to continue.

17. Review the summary and click **Finish Configuration** to deploy the cluster. Provisioning IaaS clusters can take
    15 - 30 minutes depending on the cluster profile and the node pool configuration.

The cluster details page of the cluster contains the status and details of the deployment. Use this page to track the
deployment progress.

## Validate

You can validate that your cluster is up and available by reviewing the cluster details page.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left **Main Menu** and click **Clusters**.

3. The **Clusters** page contains a list of the available clusters Palette manages. Click on the cluster you want to
   review.

4. From the cluster details page, verify the **Cluster Status** field displays **Running**.

## Next Steps

Now that you have a Kubernetes cluster deployed, you can start developing and deploying applications to your clusters.
We recommend you review the day two responsibilities and become familiar with the cluster management tasks. Check out
the [Manage Clusters](../../cluster-management/cluster-management.md) documentation to learn more about day two
responsibilities.
