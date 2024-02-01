---
sidebar_label: "Cost Visibility"
title: "Cost Visibility"
description: "Calculate Cloud Cost in Palette"
hide_table_of_contents: false
sidebar_position: 80
tags: ["clusters", "cluster management", "cost management"]
---

Palette calculates estimated cloud cost for workload clusters based on the rate of the instance type used for cluster
node pools and usage cost breakdown by namespaces based on actual resource utilization within the namespace.

## Cloud Cost

Cluster cloud cost is the sum of the estimated cost of all the nodes launched in the cluster. The cost calculation is
done based on the instance type and storage type selected for each machine pool.

|     | **FORMULAS FOR CALCULATION**                                                                |
| --- | ------------------------------------------------------------------------------------------- |
|     | Machine Pool Cost = ( Number of Nodes X Instance Price ) + ( Storage Size X Storage Price ) |
|     | Cluster Cloud Cost = control plane pool cost + worker pool cost                             |

**Example 1:**

Let's assume that a cluster ‘demo’ is launched with two machine pools with the following configuration:

| MACHINE POOL  | SIZE | INSTANCE TYPE WITH COST     | ROOT DISK WITH COST          |
| ------------- | ---- | --------------------------- | ---------------------------- |
| Control Plane | 3    | AWS t2.medium($0.0496/hour) | 60GB - gp2($0.00014/GB/hour) |
| Worker Pool   | 3    | AWS t2.large($0.0992/hour)  | 60GB - gp2($0.00014/GB/hour) |

| Calculation for the above scenario                                           |
| ---------------------------------------------------------------------------- |
| control-plane-pool cost = ( 3 X $0.0496 ) + ( 60 X $0.00014 ) = $0.1572/hour |
| worker-pool cost = ( 3 X $0.0992 ) + ( 60 X $0.00014 ) = $0.306/hour         |
| Cluster Cloud Cost = $0.1572 + $0.306 = $0.4632/hour                         |

:::info

For private clouds like VMware, OpenStack, MAAS, etc., the unit rate for CPU and Memory can be configured as an
administrative setting. These rates are used in place of instance-type rates for cost calculation.

:::

## Usage Cost

Usage cost is calculated based on the pods' actual CPU & Memory usage, including the claimed PVC storage size. The pod
cost calculation is done by dividing the instance type rate into CPU and memory rates proportional to the instance type
category.

| Instance Type Category | CPU: Memory |
| ---------------------- | ----------- |
| General Purpose        | 65% : 35%   |
| Compute Optimized      | 65% : 35%   |
| Memory-Optimized       | 25% : 75%   |

| **FORMULAS FOR CALCULATION**                                             |     |
| ------------------------------------------------------------------------ | --- |
| Pod CPU Cost = (CPU Proportion x Instance Rate ) x Pod CPU Usage         |
| Pod Memory Cost = (Memory Proportion x Instance Rate) x Pod Memory Usage |
| Pod Storage Cost = PVC Storage Size x Storage Rate                       |
| Pod Cost = Pod CPU Cost + Pod Memory Cost + Pod Storage Cost             |

**Example 2**

For the cluster configuration of control-plane-pool and worker-pool considers in example 1,

| Calculation for the example scenario                                            |
| ------------------------------------------------------------------------------- |
| Pod CPU usage = 200m, Pod Memory Usage = 200MB, Pod Storage Size = 10GB         |
| Pod CPU Cost = ( 65% _ $0.0992 ) _ 200m = 0.06448 \* 0.2 = $0.012896/hour       |
| Pod Memory Cost = ( 35% _ $0.0992 ) _ 200MB = 0.03472 \* 0.2GB = $0.006944/hour |
| Pod Storage Cost = 10GB \* $0.00014 = $0.0014/hour                              |
| Pod Cost = $0.012896 + $0.006944 + $0.0014 = $0.02124/hour                      |

:::info

Cluster costs are calculated for all cluster types (new and existing) across all cloud types (public and private).

:::
