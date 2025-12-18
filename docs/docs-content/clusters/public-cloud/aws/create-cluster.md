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
  - The AWS account used for IMDS configuration needs to be assigned the `ec2:GetInstanceMetadataDefaults` permission.
    Clusters will be launched with `IMDSv2 (token optional)` enforcement if this permission is not assigned. Refer to
    the [AWS reference](https://docs.aws.amazon.com/cli/latest/reference/ec2/get-instance-metadata-defaults.html) guide
    for further information.

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

  :::warning

  For static network deployments, you must have port 6443 open between Palette and the workload cluster. Refer to the
  [Network Ports](../../../architecture/networking-ports.md) documentation for detailed network architecture diagrams
  and to learn more about the ports used for communication.

  :::

- If you plan to use
  [AWS Dedicated Hosts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html) for your
  cluster nodes, ensure you have the following prerequisites met:

  - A license configuration created in AWS License Manager.
  - A Host Resource Group created in AWS License Manager with the license configuration associated.
  - Dedicated Host allocated to the Host Resource Group.
  - The desired instance type is supported on the Dedicated Host. Refer to the
    [Amazon EC2 Dedicated Host instance capacity configurations](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-limits.html)
    for more information.
  - Ensure that the AMI licenses match the licenses associated with the Host Resource Group.

## Deploy an AWS Cluster

Use the following steps to provision a new AWS cluster:

1. Log in to [Palette](https://console.spectrocloud.com).

2. Ensure you are in the correct project scope.

3. From the left main menu, select **Clusters**, and click **Add New Cluster**.

4. In **Public Clouds**, under **Infrastructure Provider**, select **AWS IaaS**.

5. In the bottom-right corner, click **Start AWS IaaS Configuration**.

6. Fill out the following basic information and click **Next**.

   | **Field**         | **Description**                                                                                                                                                                                     |
   | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Cluster Name**  | A custom name for the cluster.                                                                                                                                                                      |
   | **Description**   | Use the description to provide context about the cluster.                                                                                                                                           |
   | **Tags**          | Assign any desired cluster tags. Tags on a cluster are propagated to the Virtual Machines (VMs) deployed to the target environments. Example: `region:us-east-1a` or `zone:vpc-private-us-east-1a`. |
   | **Cloud Account** | If you already added your AWS account in Palette, select it from the drop-down menu. Otherwise, click **Add New Account** and add your AWS account information.                                     |

   To learn how to add an AWS account, review the [Add an AWS Account to Palette](add-aws-accounts.md) guide.

7. <PartialsComponent category="cluster-templates" name="profile-vs-template" />

8. <PartialsComponent category="profiles" name="cluster-profile-variables-deployment" />

9. Provide the AWS cloud account and placement information.

   | **Parameter**             | **Description**                                                                                                                                                                                                                         |
   | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Cloud Account**         | Select the desired cloud account. AWS cloud accounts with AWS credentials need to be pre-configured in project settings.                                                                                                                |
   | **Region**                | Choose the preferred AWS region where you would like to provision clusters.                                                                                                                                                             |
   | **SSH Key Pair Name**     | Choose the desired SSH Key pair. SSH key pairs need to be pre-configured on AWS for the desired regions. The selected key is inserted into the provisioned VMs.                                                                         |
   | **Static Placement**      | Check the **Static Placement** box if you want to deploy resources into pre-existing VPCs and subnets. Review the [Static Placement](#static-placement) table below to learn more about the required input fields.                      |
   | **Private API Server LB** | Enable to deploy the cluster load balancer in a private subnet. This feature requires Palette to have direct network connectivity with the private subnet or a [Private Cluster Gateway](../../pcg/pcg.md) deployed in the environment. |

   #### Static Placement

   | Parameter                | Description                                                                |
   | ------------------------ | -------------------------------------------------------------------------- |
   | **VPCID**                | Select the Virtual Private Cloud (VPC) ID network from the drop-down menu. |
   | **Control plane subnet** | Select the control plane network from the drop-down menu.                  |
   | **Worker Network**       | Select the worker network from the drop-down menu.                         |

10. Provide the following node pool and cloud configuration information for the control plane and worker node pools.

    The minimum number of CPUs and amount of memory depend on your cluster profile, but in general you need at least 4
    CPUs and 4 GB of memory for each node in both the control plane pool and across all worker pools.

    :::info

    You can add new worker pools if you need to customize certain worker nodes to run specialized workloads. As an
    example, the default worker pool may be configured with the m3.large instance types for general-purpose workloads,
    and another worker pool with instance type g2.2xlarge can be configured to run GPU workloads.

    :::

    #### Node Configuration Settings

    | **Parameter**                          | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
    | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Node pool name**                     | A descriptive name for the node pool.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
    | **Enable Autoscaler**                  | _Only applicable to worker node pools._ Enable this option to allow the node pool to automatically scale based on workload demand using [autoscaler](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/cloudprovider/clusterapi/README.md). When enabled, you need to provide values for the following parameters: <br /><br /> - **Minimum size** - The minimum number of nodes that should be maintained in the node pool. <br /> - **Maximum size** - The maximum number of nodes that can be created in the node pool.                                                                                                                                                                                                                                                             |
    | **Node repave interval (Optional)**    | _Only applicable to worker node pools._ Specify the time interval in seconds at which nodes in the node pool are [repaved](../../cluster-management/node-pool.md#repave-behavior-and-configuration). The default value is `0`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
    | **Number of nodes in the pool**        | Specify the number of nodes in the node pool. For control plane pools, this number can be 1, 3, or 5. For worker node pools, this option is hidden if **Enable Autoscaler** is toggled on.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
    | **Allow worker capability (Optional)** | _Only applicable to control plane pools._ Enable this option to allow the control plane nodes to also function as worker nodes. This is useful for small clusters where resource utilization needs to be optimized.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
    | **Rolling update**                     | _Only applicable to worker node pools._ - **Expand First** - When performing a rolling update, new nodes are added to the node pool before old nodes are removed. This helps ensure that there is always sufficient capacity to run workloads during the update process. <br /> - **Contract First** - Old nodes are removed from the pool before new nodes are added.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
    | **Additional Labels (Optional)**       | You can add optional labels to nodes in key-value format. For general information about applying labels, review the [Node Labels](../../cluster-management/node-labels.md) guide. Example: `"environment": "production"`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
    | **Taints (Optional)**                  | You can apply optional taint labels to a node pool during cluster creation or edit taint labels on an existing cluster. Review the [Node Pool](../../cluster-management/node-pool.md) management page and [Taints and Tolerations](../../cluster-management/taints.md) guide to learn more. Toggle the **Taint** button to create a taint label. When tainting is enabled, you need to provide a custom key-value pair. Use the drop-down menu to choose one of the following **Effect** options: <br /><br /> - **NoSchedule** - Pods are not scheduled onto nodes with this taint. <br /> - **PreferNoSchedule** - Kubernetes attempts to avoid scheduling pods onto nodes with this taint, but scheduling is not prohibited. <br /> - **NoExecute** - Existing pods on nodes with this taint are evicted. |

    #### Cloud Configuration Settings

    | **Parameter**                                              | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                        |
    | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Instance Option**                                        | Choose a pricing method: <br /><br /> - **On-Demand** - Provides stable and uninterrupted compute capacity at a higher cost. <br /> - **Spot** - _Only available for worker node pools._ Allows you to bid for unused EC2 capacity at a lower cost. <br /> - **Dedicated Hosts** - Use a dedicated host where you able to apply specific granular hardware configuration. <br /> We recommend you base your choice on your application's requirements. |
    | **Maximum spot bid price (% of on-demand instance price)** | _Only applicable to worker node pools when **Spot** is selected as the **Instance Option**._ Specify the maximum percentage of the on-demand instance price that you are willing to pay for spot instances. For example, if you enter `30`, Palette will only provision spot instances when the spot price is less than or equal to 30% of the on-demand price.                                                                                        |
    | **Host Resource Group**                                    | _Only applicable when **Dedicated Hosts** is selected as the **Instance Option**._ Select an existing host resource group from the drop-down menu.                                                                                                                                                                                                                                                                                                     |
    | **License Configuration ARN**                              | _Only applicable when **Dedicated Hosts** is selected as the **Instance Option**._ Provide the Amazon Resource Name (ARN) for the license configuration if you plan to use your existing software licenses on the dedicated hosts.                                                                                                                                                                                                                     |
    | **Instance Type**                                          | Select the instance type to use for all nodes in the node pool.                                                                                                                                                                                                                                                                                                                                                                                        |
    | **Availability Zones**                                     | Select one or more availability zones for the node pool. Distributing nodes across multiple availability zones increases fault tolerance and availability.                                                                                                                                                                                                                                                                                             |
    | **Additional Security Groups (Optional)**                  | If you checked the **Static Placement** box in the **Cluster config** page, you can specify additional AWS [security groups](https://docs.aws.amazon.com/vpc/latest/userguide/security-groups.html) to apply to the node pool. Use the drop-down menu to select additional security groups.                                                                                                                                                            |
    | **Root Disk size (GB)**                                    | Choose a disk size based on your requirements. The default size is `60`.                                                                                                                                                                                                                                                                                                                                                                               |

11. Click **Next**.

12. <PartialsComponent category="clusters" name="cluster-settings" />

13. Select **Validate** to review your cluster configurations and settings.

14. If no changes are needed, select **Finish Configuration** to deploy your cluster.

To monitor the status of your cluster deployment, from the left main menu, select **Clusters** and choose your cluster.
The cluster **Overview** tab displays the status and health of your cluster, as well as deployment details. Use the
**Events** tab to monitor the deployment in real time. Provisioning may take several minutes.

## Validate

You can validate that your cluster is up and available by reviewing the cluster details page.

1. Log in to [Palette](https://console.spectrocloud.com).

2. Navigate to the left main menu and click **Clusters**.

3. The **Clusters** page contains a list of the available clusters Palette manages. Click on the cluster you want to
   review.

4. From the cluster details page, verify the **Cluster Status** field displays **Running**.

## Next Steps

Now that you have a Kubernetes cluster deployed, you can start developing and deploying applications to your clusters.
We recommend you review the day two responsibilities and become familiar with the cluster management tasks. Check out
the [Manage Clusters](../../cluster-management/cluster-management.md) documentation to learn more about day two
responsibilities.
