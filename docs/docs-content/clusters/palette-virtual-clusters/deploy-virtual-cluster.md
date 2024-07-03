---
sidebar_label: "Deploy a Virtual Cluster to a Cluster Group"
title: "Deploy a Virtual Cluster to a Cluster Group"
description: "Learn how to add Palette Virtual Clusters to a Cluster Group"
icon: ""
hide_table_of_contents: false
sidebar_position: 0
tags: ["clusters", "cluster groups", "virtual clusters"]
---

You can deploy Palette Virtual Clusters to a [cluster group](../cluster-groups/cluster-groups.md). The advantages of a
virtual cluster environment are:

- You can operate with admin-level privileges while ensuring strong isolation.
- Virtual clusters reduce operational overhead and improve resource utilization.

Use the following steps to deploy a virtual cluster.

## Prerequisites

- A Spectro Cloud account.

- A cluster group. Refer to the [Create and Manage Cluster Groups](/clusters/cluster-groups/create-cluster-group) guide
  to learn how to create a cluster group.

- Attach any required policies in your cloud account that must be added to your virtual cluster deployment.

  - For AWS, refer to the
    [Required IAM Policies](../public-cloud/aws/required-iam-policies.md#global-role-additional-policies) documentation.
  - For Azure, no additional policies are required.

  <br />

  :::info

  Palette does not support _Usage_ and _Cost_ metrics for Virtual Clusters running on Google Kubernetes Engine (GKE).

  :::

## Add Node-Level Policies in your Cloud Account

In some situations additional node-level policies must be added to your deployment.

To add node-level policies:

1. In **Cluster Mode**, switch to the **Tenant Admin** project.

2. Select **Tenant Settings** in the **Main Menu**.

3. Click **Cloud Accounts** and ensure **Add IAM policies** is enabled for your cloud account. If an account does not
   already exist, you must add one.

4. You can specify any additional policies to include in virtual clusters deployed with this cloud account.

   - For AWS, add the **AmazonEBSCSIDriver** policy so that the virtual clusters can access the underlying host
     cluster's storage. Check out the [Palette required IAM policies](../public-cloud/aws/required-iam-policies.md)
     documentation to learn more about additional IAM policies.

5. Confirm your changes.

## Deploy a Virtual Cluster

Follow these steps to deploy a virtual cluster to a cluster group:

1. Log in to [Palette](https://console.spectrocloud.com) and switch to **App Mode**.

2. Select **Virtual Clusters** from the left **Main Menu**.

3. Click the **+New Virtual Cluster**.

4. Select your cluster group from the **Select cluster group drop-down Menu**, and type a name for the virtual cluster.

5. Assign the CPU, Memory, and Storage size for the cluster.

6. Deploy the cluster.

## Validate

To validate that your virtual cluster is available and ready for use, log in to
[Palette](https://console.spectrocloud.com) and switch to **App Mode**. Select **Virtual Clusters** from the left **Main
Menu**. Your cluster is ready for use if the status is **Running**.

## Resources

- [Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

- [CPU resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)

- [Memory resource units](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)

- [Amazon EBS CSI driver - Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html)

- [Creating the Amazon EBS CSI driver IAM role for service accounts - Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/csi-iam-role.html)
