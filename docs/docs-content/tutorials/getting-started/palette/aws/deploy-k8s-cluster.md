---
sidebar_label: "Deploy a Cluster"
title: "Deploy a Cluster"
description: "Learn to deploy a Palette host cluster."
icon: ""
hide_table_of_contents: false
sidebar_position: 30
tags: ["getting-started", "aws", "tutorial"]
---

This tutorial will teach you how to deploy a host cluster with Palette using Amazon Web Services (AWS). You will learn
about _Cluster Mode_ and _Cluster Profiles_ and how these components enable you to deploy customized applications to
Kubernetes with minimal effort.

As you navigate the tutorial, refer to this diagram to help you understand how Palette uses a cluster profile as a
blueprint for the host cluster you deploy. Palette clusters have the same node pools you may be familiar with: _control
plane nodes_ and _worker nodes_ where you will deploy applications. The result is a host cluster that Palette manages.
The concepts you learn about in the Getting Started section are centered around a fictional case study company,
Spacetastic Ltd.

![A view of Palette managing the Kubernetes lifecycle](/getting-started/getting-started_deploy-k8s-cluster_application.webp)

## 🧑‍🚀 Back at Spacetastic HQ

<PartialsComponent category="getting-started" name="spacetastic-deploy-cluster-intro" />

## Prerequisites

To complete this tutorial, you will need the following.

- Follow the steps described in the [Set up Palette with AWS](./setup.md) guide to authenticate Palette for use with
  your AWS cloud account.

- A Palette cluster profile. Follow the [Create a Cluster Profile](./create-cluster-profile.md) tutorial to create the
  required AWS cluster profile.

## Deploy a Cluster

The following steps will guide you through deploying the cluster infrastructure.

Navigate to the left **Main Menu** and select **Clusters**. Click on **Create Cluster**. If there are existing clusters,
choose **Add New Cluster**.

![Palette clusters overview page](/getting-started/getting-started_deploy-k8s-cluster_new_cluster.webp)

Palette will prompt you to select the type of cluster. Select **AWS IaaS** and click the **Start AWS IaaS
Configuration** button. Use the following steps to create a host cluster in AWS.

In the **Basic information** section, insert the general information about the cluster, such as the Cluster name,
Description, Tags, and Cloud account. Click on **Next**.

![Palette clusters basic information](/getting-started/aws/getting-started_deploy-k8s-cluster_clusters_basic_info.webp)

On the **Cluster setup type** window, choose **Cluster Profiles > Add Cluster Profile**. A list is displayed of
available profiles you can choose to deploy to AWS. Select the cluster profile you created in the
[Create a Cluster Profile](./create-cluster-profile.md) tutorial, named **aws-profile**, and click on **Confirm**.

The **Cluster Profile** section displays all the layers in the cluster profile.

![Palette clusters parameters](/getting-started/aws/getting-started_deploy-k8s-cluster_clusters_creation_parameters.webp)

Each layer has a pack manifest file with the deploy configurations. The pack manifest file is in a YAML format. Each
pack contains a set of default values. You can change the manifest values if needed. Click on **Next** to proceed.

The **Cluster Config** section allows you to select the **Region** in which to deploy the host cluster and specify other
options such as the **SSH Key Pair** to assign to the cluster. All clusters require you to select an SSH key. After you
have selected the **Region** and your **SSH Key Pair Name**, click on **Next**.

The **Nodes Config** section allows you to configure the nodes that make up the control plane and worker nodes of the
host cluster.

Before you proceed to next section, review the following parameters.

- **Number of nodes in the pool** - This option sets the number of control plane or worker nodes in the control plane or
  worker pool. For this tutorial, set the count to one for the control plane pool and two for the worker pool.

- **Allow worker capability** - This option allows the control plane node to also accept workloads. This is useful when
  spot instances are used as worker nodes. You can check this box if you want to.

- **Instance Type** - Select the compute type for the node pool. Each instance type displays the amount of CPU, RAM, and
  hourly cost of the instance. Select `m4.2xlarge`.

- **Availability zones** - Used to specify the availability zones in which the node pool can place nodes. Select an
  availability zone.

- **Disk size** - Set the disk size to **60 GiB**.

- **Instance Option** - This option allows you to choose
  [on-demand instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html) or
  [spot instance](https://aws.amazon.com/ec2/spot/) for worker nodes. Select **On Demand**.

![Palette clusters basic information](/getting-started/aws/getting-started_deploy-k8s-cluster_cluster_nodes_config.webp)

Select **Next** to proceed with the cluster deployment.

In the **Cluster Settings** section, you can configure advanced options such as when to patch the OS, enable security
scans, manage backups, add role-based access control (RBAC) bindings, and more.

For this tutorial, you can use the default settings. Click on **Validate** to continue.

The **Review** section allows you to review the cluster configuration prior to deploying the cluster. Review all the
settings and click on **Finish Configuration** to deploy the cluster.

![Configuration overview of newly created AWS cluster](/getting-started/aws/getting-started_deploy-k8s-cluster_profile_cluster_profile_review.webp)

Navigate to the left **Main Menu** and select **Clusters**.

![Update the cluster](/getting-started/aws/getting-started_deploy-k8s-cluster_create_cluster.webp)

The cluster deployment process can take 15 to 30 minutes. Deployment time varies depending on the cloud provider,
cluster profile, cluster size, and node pool configurations provided. You can learn more about the deployment progress
by reviewing the event log. Choose your cluster and select the **Events** tab to view the log.

![Update the cluster](/getting-started/aws/getting-started_deploy-k8s-cluster_event_log.webp)

## Verify the Application

Navigate to the left **Main Menu** and select **Clusters**.

Select your cluster to view its **Overview** tab. When the application is deployed and ready for network traffic,
indicated in the **Services** field, Palette exposes the service URL. Click on the URL for port **:8080** to access the
Hello Universe application.

![Cluster details page with service URL highlighted](/getting-started/aws/getting-started_deploy-k8s-cluster_service_url.webp)

<br />

:::warning

It can take up to three minutes for DNS to properly resolve the public load balancer URL. We recommend waiting a few
moments before clicking on the service URL to prevent the browser from caching an unresolved DNS request.

:::

<br />

![Image that shows the cluster overview of the Hello Universe Frontend Cluster](/getting-started/getting-started_deploy-k8s-cluster_hello-universe-with-api.webp)

Welcome to the Spacetastic astronomy education platform. Feel free to explore the pages and learn more about space. The
statistics page offers information on visitor counts on your deployed cluster.

You have deployed your first application to a cluster managed by Palette. Your first application is a three-tier
application with a frontend, API server, and Postgres database.

## Cleanup

Use the following steps to remove all the resources you created for the tutorial.

:::tip

If you plan to explore the [Deploy Cluster Profile Updates](./update-k8s-cluster.md) tutorial, do not delete your
cluster, as it is a prerequisite for the tutorial.

:::

To remove the cluster, navigate to the left **Main Menu** and click on **Clusters**. Select the cluster you want to
delete to access its details page.

Click on **Settings** to expand the menu, and select **Delete Cluster**.

![Delete cluster](/getting-started/aws/getting-started_deploy-k8s-cluster_delete-cluster-button.webp)

You will be prompted to type in the cluster name to confirm the delete action. Type in the cluster name to proceed with
the delete step. The deletion process takes several minutes to complete.

<br />

:::info

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for a force delete. To trigger a force
delete, navigate to the cluster’s details page, click on **Settings**, then select **Force Delete Cluster**. Palette
automatically removes clusters stuck in the cluster deletion phase for over 24 hours.

:::

<br />

Once the cluster is deleted, navigate to the left **Main Menu** and click on **Profiles**. Find the cluster profile you
created and click on the **three-dot Menu** to display the **Delete** button. Select **Delete** and confirm the
selection to remove the cluster profile.

## Wrap-Up

In this tutorial, you used the cluster profile you created in the previous
[Create a Cluster Profile](./create-cluster-profile.md) tutorial to deploy a host cluster onto AWS. After the cluster
deployed, you verified the Hello Universe application was successfully deployed.

We recommend that you continue to the [Deploy Cluster Profile Updates](./update-k8s-cluster.md) tutorial to learn how to
update your host cluster.

## 🧑‍🚀 Catch up with Spacetastic

<PartialsComponent category="getting-started" name="spacetastic-deploy-cluster-end" />
