---
title: "Deploy a Cluster"
metaTitle: "Deploy a Cluster"
metaDescription: "Learn how to deploy a Kubernetes cluster to a public cloud provider with Palette. "
icon: ""
category: ["tutorial"]
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';
import YouTube from 'shared/components/Video';

# Deploy a Cluster

Palette helps you create and manage Kubernetes clusters in various cloud environments with minimal overhead.

Palette offers profile-based management for Kubernetes, enabling consistency, repeatability, and operational efficiency across multiple clusters. A [cluster profile](/cluster-profiles) allows you to customize the cluster infrastructure stack, allowing you to choose the desired Operating System (OS), Kubernetes, Container Network Interfaces (CNI), Container Storage Interfaces (CSI). You can further customize the stack with add-on application layers. 

After defining a cluster profile, you can provide the cloud environment details, the control plane, and worker node configurations to deploy a host cluster.

This tutorial will teach you how to deploy a host cluster with Palette using Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) cloud providers. You can deploy a cluster using either Palette or Terraform. You will learn about *Cluster Mode* and *Cluster Profiles* and how these components enable you to deploy customized applications to Kubernetes with minimal effort.

# Architecture 

As you navigate the tutorial, refer to this diagram to help you understand how Palette uses a cluster profile as a blueprint for the host cluster you deploy. Palette clusters have the same node pools you may be familiar with: control plane nodes, often called *master nodes*, and *worker nodes* where you will deploy applications. The result is a host cluster that Palette manages.

![A view of Palette managing the Kubernetes lifecycle](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_application.png)

<br />

# Deploy the Cluster and the Application

Select the tab for the workflow you want to learn more about.

<br />

<Tabs>
<Tabs.TabPane tab="UI Workflow" key="ui">


You can create and manage clusters directly from the Palette dashboard. Use the following steps to learn how to deploy a host cluster to multiple cloud providers.

## Prerequisites

To complete this tutorial, you will need the following.

- A public cloud account from one of these providers:
  - [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account)
  - [Azure](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account)
  - [GCP](https://cloud.google.com/docs/get-started)

  <br />

- Register the cloud account in Palette. The following resources provide additional guidance.
  - [Register and Manage AWS Accounts](/clusters/public-cloud/aws/add-aws-accounts)
  - [Register and Manage Azure Cloud Accounts](/clusters/public-cloud/azure/azure-cloud)
  - [Register and Manage GCP Accounts](/clusters/public-cloud/gcp#creatingagcpcloudaccount)

  <br />

- An SSH Key Pair. Use the [Create and Upload an SSH Key](/clusters/cluster-management/ssh-keys) guide to learn how to create an SSH key and upload it to Palette.

  - AWS users must create an AWS Key pair before starting the tutorial. If you need additional guidance, check out the [Create EC2 SSH Key Pair](https://docs.aws.amazon.com/ground-station/latest/ug/create-ec2-ssh-key-pair.html) tutorial.

## Deploy the Environment

The following steps will guide you through deploying the cluster infrastructure. You will start by creating a cluster profile that you apply to the host cluster.

<br />

<Tabs>
<Tabs.TabPane tab="AWS" key="aws-ui">

### Create Cluster Profile (AWS)

[Cluster profiles](https://docs.spectrocloud.com/cluster-profiles) are templates you create with the following core layers and any add-on layers such as security, monitoring, logging, and more.

 - Operating System (OS)
 - Kubernetes distribution
 - Network Container Interface (CNI)
 - Storage Container Interface (CSI)
 

You customize profiles by choosing the type of component and version. In this way, profiles offer a reproducible way to create clusters.

Log in to Palette and navigate to the left **Main Menu**. Select **Profiles** to view the cluster profile page.
You can view the list of available cluster profiles. To create a cluster profile, click the **Add Cluster Profile** button.

![View of the cluster Profiles page](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_profile_list_view.png)

Follow the wizard to create a new profile.

In the **Basic Information** section, assign the name **aws-profile**, a brief profile description, select the type as **Full**, and assign the tag **env:aws**. You can leave the version empty if you want to. Just be aware that the version defaults to **1.0.0**. Click on **Next**.

**Cloud Type** allows you to choose the infrastructure provider with which this cluster profile is associated. Select **AWS** and click on **Next**.

**Profile Layers**, this is the main configuration step where you specify the packs that compose the profile. There are four required infrastructure packs and several optional add-on packs you can choose from.
Every pack requires you to select the **Pack Type**, **Registry**, and **Pack Name**.

For this tutorial, use the following packs:

| Pack Name          | Version   | Layer              |
|--------------------|-----------|--------------------|
| ubuntu-aws LTS     | 20.4.x    | Operating System   |
| Kubernetes         | 1.24.x  | Kubernetes         |
| cni-calico         | 3.24.x    | Network            |
| csi-aws-ebs        | 1.16.x | Storage            |


As you fill out the information for each layer, click on **Next** to proceed to the next layer.

Click on **Confirm** after you have completed filling out all the core layers.

![A view of the cluster profile stack](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_clusters_parameters.png)

The review section gives an overview of the cluster profile configuration you selected. Click on **Finish Configuration** to create the cluster profile. 


You can modify cluster profiles after you create them by adding, removing, or editing the layers. 

<br />


## Create a New Cluster

Navigate to the left **Main Menu** and select **Cluster**. From the clusters page, click on the **Add New Cluster** button.

![Palette clusters overview page](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_new_cluster.png)

Palette will prompt you to either deploy a new cluster or import an existing one. Click on **Deploy New Cluster** to access the cluster deployment wizard. Select **AWS** and click the **Start AWS Configuration** button. Use the following steps to create a host cluster in AWS.

<br />


### Basic information

In the **Basic information** section, insert the general information about the cluster, such as the Cluster name, Description, Tags, and Cloud account. Click on **Next**.

![Palette clusters basic information](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_clusters_basic_info.png)

<br />


### Cluster Profile

A list is displayed of available profiles you can choose to deploy to AWS. Select the cluster profile you created earlier and click on **Next**.

<br />


### Parameters

The **Parameters** section displays the core and add-on layers in the cluster profile.

![Palette clusters parameters](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_clusters_creation_parameters.png)

Each layer has a pack manifest file with the deploy configurations. The pack manifest file is in a YAML format. Each pack contains a set of default values. You can change the manifest values if needed. Click on **Next** to proceed.

<br />


### Cluster Configuration

The **Cluster config** section allows you to select the **Region** in which to deploy the host cluster and specify other options such as the **SSH Key Pair** to assign to the cluster. All clusters require you to select an SSH key. After you have selected the **Region** and your **SSH Key Pair Name**, click on **Next**. 

### Nodes Configuration

The **Nodes config** section allows you to configure the nodes that make up the control plane (master nodes) and data plane (worker nodes) of the host cluster. 


Before you proceed to next section, review the following parameters. <br /> <br />
- **Number of nodes in the pool** - This option sets the number of master or worker nodes in the master or worker pool. For this tutorial, set the count to one for the master pool and two for the worker pool.


- **Allow worker capability** - This option allows the master node to also accept workloads. This is useful when spot instances are used as worker nodes. You can check this box if you want to.


- **Instance Type** -  Select the compute type for the node pool. Each instance type displays the amount of CPU, RAM, and hourly cost of the instance. Select `m4.2xlarge`.


- **Availability zones** - Used to specify the availability zones in which the node pool can place nodes. Select an availability zone.


- **Disk size** - Set the disk size to **60 GiB**.


- **Instance Option** -  This option allows you to choose [on-demand instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html) or [spot instance](https://aws.amazon.com/ec2/spot/) for worker nodes. Select **On Demand**.

![Palette clusters basic information](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_cluster_nodes_config.png)

Select **Next** to proceed with the cluster deployment.

<br />


### Settings

In the **Settings** section, you can configure advanced options such as when to patch the OS, enable security scans, manage backups, add role-based access control (RBAC) bindings, and more.

For this tutorial, you can use the default settings. Click on **Validate** to continue. 

<br />


### Review

The **Review** section allows you to review the cluster configuration prior to deploying the cluster. Review all the settings and click on **Finish Configuration** to deploy the cluster.

![Configuration overview of newly created AWS cluster](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_profile_cluster_profile_review.png)


<br /> 

Navigate to the left **Main Menu** and select **Clusters**. 

![Update the cluster](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_aws_create_cluster.png)

Click on your cluster to review its details such as deployment status, event logs, cluster profile, monitoring data, and other information about the cluster.

<br />

![A view of the cluster details page](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_details.png)


</Tabs.TabPane>
<Tabs.TabPane tab="Azure" key="azure-ui">

### Create Cluster Profile (Azure)

[Cluster profiles page](https://docs.spectrocloud.com/cluster-profiles) are templates you create with the following core layers and any add-on layers such as security, monitoring, logging, and more.
 - Operating System (OS)
 - Kubernetes distribution and version 
 - Network Container Interface (CNI)
 - Storage Container Interface (CSI)
 
A cluster profile contains these core and additional add-on layers, such as security, monitoring, logging, etc.  

Cluster profiles enable you to create infrastructure stacks that can be customized in terms of the number of layers, type of components, and version and offer a reproducible way to create clusters.

Log in to Palette and navigate to the left **Main Menu**. Select **Profiles** to view the cluster profile page.
You can view the list of available cluster profiles. To create a cluster profile, click the **Add Cluster Profile** button at the top right.

![View of the cluster view page](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_profile_list_view.png)

Follow the wizard to create a new profile.

In the **Basic Information** section, assign the name **azure-profile**, a brief profile description, select the type as **Full**, and assign the tag  **env:azure***. You can leave the version empty if you want to. Just be aware that the version defaults to **1.0.0**. Click on **Next**.

**Cloud Type** allows you to choose the infrastructure provider with which this cluster profile is associated. Select **Azure** and click on **Next**.

**Profile Layers** is the main configuration step where you specify the packs that compose the profile. You can choose from four required infrastructure packs and several optional add-on packs.
Every pack requires you to select the **Pack Type**, **Registry**, and **Pack Name**.

For this tutorial, use the following packs:

| Pack Name          | Version                                          | Layer              |
|--------------------|--------------------------------------------------|--------------------|
| ubuntu-azure LTS   | 20.4.x    | Operating System   |
| Kubernetes         | 1.24.x     | Kubernetes         |
| cni-calico-azure   | 3.24.x                                 | Network            |
| Azure Disk         | 1.25.x       | Storage            |


As you fill out the information for a layer, click on **Next** to proceed to the following layer.

Click on **Confirm** after you have completed filling out all the core layers.

![azure cluster profile overview page](/tutorials/deploy-clusters/azure/clusters_public-cloud_deploy-k8s-cluster_cluster_profile_stack.png)

The review section gives an overview of the cluster profile configuration you selected. Click on **Finish Configuration** to finish creating the cluster profile. 


You can update cluster profiles after the creation process. You can modify cluster profiles by adding, removing, or editing layers at any moment.

<br />


## Create a New Cluster

Navigate to the left **Main Menu** and select **Cluster**. Click the **Add New Cluster** button from the clusters page.

![palette clusters overview page](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_new_cluster.png)

Click on **Deploy New Cluster** to access the cluster deployment wizard. Select **Azure** and click the **Start Azure Configuration** button. Use the following steps to create a host cluster in Azure.

<br />


### Basic information

In the **Basic information** section, insert the general information about the cluster, such as the Cluster name, Description, Tags, and Cloud account. Click on **Next**.

![palette clusters basic information](/tutorials/deploy-clusters/azure/clusters_public-cloud_deploy-k8s-cluster_clusters_basic_info.png)

<br />


### Cluster Profile

A list of available cluster profiles you can deploy to Azure is on the right side. Select the cluster profile you created earlier and click on **Next**.

### Profile Layers

The **Profile Layers** section displays all the layers and add-on components in the cluster profile.

![palette clusters basic information](/tutorials/deploy-clusters/azure/clusters_public-cloud_deploy-k8s-cluster_parameters.png)

Each layer has a pack manifest file with the deploy configurations. The pack manifest file is in a YAML format. Each pack contains a set of default values. You can change the manifest values if you don't want to use the default values of the cluster profile. Click on **Next** to proceed.

<br />


### Cluster Configuration


The **Cluster config** section allows you to select the **Subscription**, **Region**, **Resource Group**, **Storage account**, and **SSH Key**** to apply to the host cluster. All clusters require you to assign an SSH key. Refer to the [SSH Keys](/clusters/cluster-management/ssh-keys) guide for uploading an SSH key.


<br />

After selecting a **Subscription**, **Region**, **Resource Group**, **Storage account** and **SSH Key**, click on **Next**. 


### Nodes Configuration

The **Nodes config** section allows configuring the nodes composing the control plane (master nodes) and data plane (worker nodes) of the Kubernetes cluster.

You can find the list and the parameters' explanation on the [Node Pool](https://docs.spectrocloud.com/clusters/cluster-management/node-pool) documentation page.

Among the multiple configurations you can set, be sure to consider the following:
- **Number of nodes in the pool** - Used to set the right amount of nodes that make up the pool of either the master or worker nodes. Set the count to one for the master pool and two for the worker pool.

- **Allow worker capability** - This option allows the master node also to accept workloads. This is useful when spot instances are used as worker nodes. You can check this box if you want to.


- **Instance Type** - Select the compute type for the node pool. Each instance type displays the amount of CPU, RAM, and hourly cost of the instance. Select **Standard_A8_v2**.


- **Managed disk** - Used to select the storage class. Select **Standard LRS** and set the disk size to **60**.


- **Availability zones** -  Used to specify the availability zones the node pool can place nodes. Pick one availability zone.

![palette clusters nodes configuration](/tutorials/deploy-clusters/azure/clusters_public-cloud_deploy-k8s-cluster_cluster_nodes_config.png)

<br />


### Settings

In the **Settings** section, you can configure advanced options such as when to patch the OS, enable security scans, manage backups, add role-based access control (RBAC) bindings, and more.

For this tutorial, you can use the default settings. Click on **Validate** to continue.

<br />


### Review

The Review section allows you to review all the cluster configurations before deploying the cluster. Review all the settings and click on **Finish Configuration** to deploy the cluster.

![azure creation of a new cluster overview page](/tutorials/deploy-clusters/azure/clusters_public-cloud_deploy-k8s-cluster_profile_review.png)


<br />

Navigate to the left **Main Menu** and select **Clusters**.

![Update the cluster](/tutorials/deploy-clusters/azure/clusters_public-cloud_deploy-k8s-cluster_azure_create_cluster.png)

Click on your cluster to review details such as deployment status, event logs, cluster profile, monitoring data, and other information about the cluster.

<br />

![View of the cluster details page](/tutorials/deploy-clusters/azure/clusters_public-cloud_deploy-k8s-cluster_azure_create_cluster_details.png)

<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Google Cloud" key="gcp-ui">

### Create Cluster Profile (GCP)
[Cluster profiles](https://docs.spectrocloud.com/cluster-profiles) are templates created with the following core layers.

 - Operating System (OS).
 - Kubernetes distribution and version.
 - Network Container Interface (CNI).
 - Storage Container Interface (CSI).
 
A cluster profile contains these core and additional add-on layers, such as security, monitoring, logging, etc.  

Cluster profiles enable you to create infrastructure stacks that can be customized in terms of the number of layers, type of components, and version and offer a reproducible way to create clusters.

Log in to Palette and navigate to the left **Main Menu**. Select **Profiles** to view the cluster profile page.
You can view the list of available cluster profiles. To create a cluster profile, click the **Add Cluster Profile** button at the top right.

![View of the cluster view page](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_profile_list_view.png)

Follow the wizard to create a new profile.

In the **Basic Information** section, assign the name **gcp-profile**, a profile description, select the type as **Full**, and assign the tag **env:gcp**. You can leave the version empty if you want to. Just be aware that the version defaults to 1.0.0. Click on **Next**.

Cloud Type allows you to choose the infrastructure provider with which this cluster profile is associated. Select **Google Cloud** and click on **Next**.

Profile Layers, this is the main configuration step where you specify the packs that compose the profile. You can choose from four required infrastructure packs and several optional add-on packs. Every pack requires you to select the Pack Type, Registry, and Pack Name.


For this tutorial, use the following packs:

| Pack Name          | Version                  | Layer              |
|--------------------|--------------------------|--------------------|
| ubuntu-gcp LTS     | 20.4.x                   | Operating System   |
| Kubernetes         | 1.24.x                   | Kubernetes         |
| cni-calico         | 3.24.x                   | Network            |
| csi-gcp-driver     | 1.7.x                    | Storage            |


As you fill out the information for a layer, click on **Next** to proceed to the following layer.

Click on **Confirm** after you have completed filling out all the core layers.

![gcp cluster profile view](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_gcp_cluster_profile_stack_view.png)

The review section gives an overview of the cluster profile configuration you selected. Click on **Finish Configuration** to create the cluster profile.

You can update cluster profiles after the creation process. You can modify cluster profiles by adding, removing, or editing layers at any moment.

<br />

Navigate to the left **Main Menu** and select **Cluster**. Click the **Add New Cluster** button from the clusters page.

![palette clusters overview page](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_new_cluster.png)

Click on **Deploy New Cluster** to access the cluster deployment wizard. Select **Google Cloud** and click the **Start Google Cloud Configuration** button. Use the following steps to create a host cluster in Google Cloud.

<br />


### Basic information

In the **Basic information** section, insert the general information about the cluster, such as the **Cluster name**, **Description**, **Tags**, and **Cloud account**. Click on **Next**.

![palette clusters basic information](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_basic_info.png)

<br />


### Cluster Profile

On the right side is a list of available cluster profiles you can choose to deploy to GCP. Select the cluster profile you created earlier and click on **Next**.

![palette clusters basic information](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_cluster_gcp_profile.png)

<br />


### Parameters

The **Parameters** section displays all the layers and add-on components in the cluster profile.

![palette clusters basic information](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_clusters_parameters.png)

Each layer has a pack manifest file with the deploy configurations. The pack manifest file is in a YAML format. Each pack contains a set of default values. You can change the manifest values if you don't want to use the default values of the cluster profile. Click on **Next** to proceed.

<br />


### Cluster Configuration

The **Cluster config** section allows you to select the **Project**, **Region**, and **SSH Key** to apply to the host cluster. All clusters require you to assign an SSH key. Refer to the [SSH Keys](/clusters/cluster-management/ssh-keys) guide for uploading an SSH key.


<br />

After selecting a **Project**, **Region**, and **SSH Key**, click on **Next**. 
### Nodes Configuration

The **Nodes config** section allows you to configure the nodes that make up the control plane (master nodes) and data plane (worker nodes) of the host cluster.

Before you proceed to the next section, take the time to review the following parameters.

The list and parameters' explanation are found on the [Node Pool](/clusters/cluster-management/node-pool) documentation page.

Among the multiple configurations you can set, be sure to consider the following:
- **Number of nodes in the pool** - Used to set the right amount of nodes that make up the pool of either the master or worker nodes. Set the count to one for the master pool and two for the worker pool.

- **Allow worker capability** - This option allows the master node also to accept workloads. This is useful when spot instances are used as worker nodes. You can check this box if you want to.


- **Instance Type** - Select the compute type for the node pool. Each instance type displays the amount of CPU, RAM, and hourly cost of the instance. Select **n1-standard-4**.

`
- **Disk size** - set the disk size to **60**.


- **Availability zones** -  Used to specify the availability zones node pool nodes can be placed. Pick one availability zone.

![palette clusters nodes configuration](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_cluster_nodes_config.png)

<br />

Select **Next** to proceed with the cluster deployment.


### Settings

In the **Settings** section, you can configure advanced options such as when to patch the OS, enable security scans, manage backups, add role-based access control (RBAC) bindings, and more.

For this tutorial, you can use the default settings. Click on **Validate** to continue.

### Review

The **Review** section allows you to review all the cluster configurations before deploying the cluster. Review all the settings and click on **Finish Configuration** to deploy the cluster.

![gcp creation of a new cluster overview page](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_profile_review.png)

<br />

Navigate to the left **Main Menu** and select **Clusters**.

<br />

![Update the cluster](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_new_cluster.png)

Click on your cluster to review details such as deployment status, event logs, cluster profile, monitoring data, and other information about the cluster.

<br />

![View of the cluster details page](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_profile_details.png)

</Tabs.TabPane>
</Tabs>


The cluster deployment process can take several minutes, approximately 15 to 30 min. The deployment time is affected by the selected cloud provider, cluster profile, cluster size, and the node pool configurations provided. You can learn more about the deployment progress by reviewing the event log. Click on the **Events** tab to check the event log.

![Update the cluster](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-event_log.png)

  <br />

While you wait for the cluster deployment process to complete, feel free to check out a video where we discuss the growing pains of using Kubernetes and how Palette can help your address these pain points.

<br />


<YouTube url="https://www.youtube.com/embed/wM3hcrHbAC0" title="Three Common Kubernetes Growing Pains  - and how to solve them" />

---

## Update Cluster Profile

Once the cluster is deployed and ready you are ready for the next steps. In the following steps, you will learn how to update cluster profiles after deploying a host cluster. In this scenario, you will add a new layer to the cluster profile that contains the application.

<br />

### Add a Manifest

Navigate to the left **Main Menu** and select **Profiles**. Select the cluster profile you created earlier and applied to the host cluster.

Click on **Add Manifest** at the top of the page and fill out the following input fields. <br /> <br />

- **Layer name** - The name of the layer. Assign the name **application**.


- **Manifests**  - Add your manifest by giving it a name and clicking the **New Manifest** button. Assign a name to the internal manifest and click on the blue button  An empty editor will appear on the right side of the screen.

![Image of the blue button](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_manifest_blue_btn.png)

<br />

In the manifest editor, insert the following content.

<br />

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-universe-service
spec:
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 8080
  selector:
    app: hello-universe
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-universe-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: hello-universe
  template:
    metadata:
      labels:
        app: hello-universe
    spec:
      containers:
      - name: hello-universe
        image: ghcr.io/spectrocloud/hello-universe:1.0.11
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
```

The code snippet you added will deploy the [*hello-universe*](https://github.com/spectrocloud/hello-universe) application. You may have noticed that the code snippet you added is a Kubernetes configuration. Manifest files are a method you can use to achieve more granular customization of your Kubernetes cluster. You can add any valid Kubernetes configuration to a manifest file.

![manifest](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_manifest.png)

The manifest defined a replica set for the application to simulate a distributed environment with a web application deployed to Kubernetes. The application is assigned a load balancer. Using a load balancer, you can expose a single access point and distribute the workload to both containers.

Click on **Confirm & Create** to save your changes.

<br />


### Deploy

Navigate to the left **Main Menu** and select **Clusters**. Click on the host cluster you deployed to open its details page.


On the top right-hand corner is a blue button **Updates Available**. Click on the button to review the available updates. 

![The cluster details page with a view of pending updates](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_update_available.png)


Compare the new changes against the previous cluster profile definition. The only difference is the addition of a manifest that will deploy the Hello Universe application.


![Available updates details](/tutorials/deploy-clusters/deploy_app/clusters_public-cloud_deploy-k8s-cluster_update_details_compare.png)

Click on **Confirm updates** to apply the updates to the host cluster. Depending on the scope of the change this may take a few moments.

<br />


## Verify the Application

Navigate to the cluster's details page and verify you are in the **Overview** tab. Once the application is deployed and ready for network traffic, in the **Services** row, Palette will expose the service URL. Click on the URL for port **:8080** to access the Hello Universe application. 

![Cluster details page with service URL highlighted](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_service_url.png)


<br />


<WarningBox>

It takes between one to three minutes for DNS to properly resolve the public load balancer URL. We recommend waiting a few moments before clicking on the service URL to prevent the browser from caching an unresolved DNS request.


</WarningBox>

<br />

![Deployed application landing page with counter displayed](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_app.png)

<br />

Welcome to Hello Universe, a demo application to help you learn more about Palette and its features. Feel free to click on the logo to increase the counter and for a fun image change.

You have deployed your first application to a cluster managed by Palette. Your first application is a single container application with no upstream dependencies. 


## Cleanup

Use the following steps to remove all the resources you created for the tutorial.

To remove the cluster, navigate to the left **Main Menu** and click on **Clusters** to access the clusters page. Select the cluster you want to delete to access its details page.

Click on **Settings**. In the top-right-hand corner of the page, expand the **settings Menu** and select **Delete Cluster** to delete the cluster.

![Destroy-cluster](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_delete-cluster-button.png)

You will be asked to type in the cluster name to confirm the delete action. Type in the cluster name to proceed with the delete step. The deletion process will take several minutes to complete.

<br />

<InfoBox>

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for Force Delete. To trigger a force delete, navigate to the respective cluster’s details page and click on Settings. Click on the Force Delete Cluster to delete the cluster. Palette will automatically remove clusters stuck in the cluster deletion phase for over 24 hours.

</InfoBox>


<br />

Once the cluster is deleted, navigate to the left **Main Menu** and click on **Profiles**. Find the cluster profile you created and click on the **three-dot Menu** to display the **Delete** button. Select **Delete** and confirm the selection to remove the cluster profile. 


</Tabs.TabPane>
<Tabs.TabPane tab="Terraform" key="terraform">


##  Terraform

The [Spectro Cloud Terraform](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) provider enables you to create and manage Palette resources in a codified manner by leveraging Infrastructure as Code (IaC). There are many reasons why you would want to utilize IaC. A few reasons worth highlighting are: the ability to automate infrastructure, improve collaboration related to infrastructure changes, self-document infrastructure through codification, and track all infrastructure in a single source of truth. 

If want to become more familiar with Terraform, we recommend you check out the [Terraform](https://developer.hashicorp.com/terraform/intro) learning resources from HashiCorp. 

<br />

## Prerequisites

To complete this tutorial, you will need the following items

- Basic knowledge of containers.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or another container management tool.
- Create a Cloud account from one of the following providers.
  - [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account)
  - [Azure](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account)
  - [GCP](https://cloud.google.com/docs/get-started)
- Register the [cloud account with Palette](https://console.spectrocloud.com/auth/signup). Use the following resource for additional guidance.
  - [Register and Manage AWS Accounts](/clusters/public-cloud/aws/add-aws-accounts)
  - [Register and Manage Azure Cloud Accounts](/clusters/public-cloud/azure/azure-cloud)
  - [Register and Manage GCP Accounts](/clusters/public-cloud/gcp#creatingagcpcloudaccount)

<br />

## Setup Local Environment

You can clone the tutorials repository locally or follow along by downloading a Docker image that contains the tutorial code and all dependencies. 

<br />

<WarningBox>

If you choose to clone the repository instead of using the tutorial container make sure you have Terraform v1.4.0 or greater installed.


</WarningBox>

<br />

<Tabs>

<Tabs.TabPane tab="Docker" key="docker">


Ensure Docker Desktop on your local machine is available. Use the following command and ensure you receive an output displaying the version number.

<br />

```bash
docker version
```

Download the tutorial image to your local machine.
<br />

```bash
docker pull ghcr.io/spectrocloud/tutorials:1.0.4
```

Next, start the container, and open a bash session into it.
<br />

```shell
docker run --name tutorialContainer --interactive --tty ghcr.io/spectrocloud/tutorials:1.0.4 bash
```

Navigate to the tutorial code.

<br />

```shell
cd /terraform/iaas-cluster-deployment-tf
```


</Tabs.TabPane>
<Tabs.TabPane tab="Git" key="git">

Open a terminal window to begin the tutorial and download the tutorial code from GitHub. 

<br />

```shell
git@github.com:spectrocloud/tutorials.git
```

Change directory to the tutorial folder.

<br />

```shell
cd tutorials/
```

Check out the following git tag.

<br />

```shell
git checkout v1.0.4
```

Change the directory to the tutorial code.

<br />

```shell
cd terraform/iaas-cluster-deployment-tf/
```

</Tabs.TabPane>


</Tabs>

---

## Create an API Key

Before you can get started with the Terraform code, you need a Spectro Cloud API key. 

To create an API key, log in to [Palette](https://console.spectrocloud.com) and click on the user **User Menu** and select **My API Keys**. 

![Image that points to the user drop-down Menu and points to the API key link](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_create_api_key.png)

Next, click on **Add New API Key**. Fill out the required input field, **API Key Name**, and the **Expiration Date**. Click on **Confirm** to create the API key. Copy the key value to your clipboard, as you will use it shortly.

<br />

In your terminal session, issue the following command to export the API key as an environment variable.

<br />

```shell
export SPECTROCLOUD_APIKEY=YourAPIKeyHere
```

The [Spectro Cloud Terraform](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) provider requires credentials to interact with the Palette API.
The Spectro Cloud Terraform provider will use the environment variable to authenticate with the Spectro Cloud API endpoint. 


## Resources Review

To help you get started with Terraform, the tutorial code is structured to support deploying a cluster to either Azure, GCP, or AWS. Before you deploy a host cluster to your target provider, take a few moments to review the following files in the folder structure.

<br />

- **providers.tf** - this file contains the Terraform providers that are used to support the deployment of the cluster.


- **inputs.tf** - a file containing all the Terraform variables for the deployment logic.


- **data.tf** - contains all the query resources that perform read actions.


- **cluster_profiles.tf** - this file contains the cluster profile definitions. Each cloud provider has its own cluster profile definition.


- **cluster.tf** - this file has all the required cluster configurations to deploy a host cluster to one of the cloud providers.


- **terraform.tfvars** - use this file to customize the deployment and target a specific cloud provider. This is the primary file you will make modifications to.


- **outputs.tf** - contains content that will be output in the terminal session upon a successful Terraform `apply` action.

In the following section, you will be able to review the core terraform resources more closely.

<br />

### Provider

The **provider.tf** file contains the Terraform providers and their respective versions. The tutorial uses two providers - the Spectro Cloud Terraform provider and the TLS Terraform provider. Take note of how the project name is specified in the `provider "spectrocloud" {}` block. You can change the target project by changing the value specified to the `project_name` parameter.

<br />


```terraform
terraform {
  required_providers {
    spectrocloud = {
      version = ">= 0.13.1"
      source  = "spectrocloud/spectrocloud"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "4.0.4"
    }
  }
}

provider "spectrocloud" {
  project_name = "Default"
}
```

The next file you should become familiar with is the **cluster-profiles.tf** file.

### Cluster Profile

The Spectro Cloud Terraform provider has several resources available for use. When creating a cluster profile, use the `spectrocloud_cluster_profile`.
This resource can be used to customize all layers of a cluster profile. You can specify all the different packs and versions to use and add a manifest or Helm chart.


In the **cluster-profiles.tf** file, the cluster profile resource is declared three times. Each instance of the resources is for a specific cloud provider. Using the AWS cluster profile as an example, notice how the cluster profile uses `pack {}` blocks to specify each layer of the cluster profile. The order you arrange the `pack {}` plays an important role, as each layer maps to the core infrastructure in a cluster profile. The first layer must be the OS, followed by Kubernetes, the container network interface, the container storage interface, etc. Ensure you define the bottom layer of the cluster profile first.

<br />

```terraform
resource "spectrocloud_cluster_profile" "aws-profile" {
  name        = "tf-aws-profile"
  description = "A basic cluster profile for AWS"
  tags        = concat(var.tags, ["env:aws"])
  cloud       = "aws"
  type        = "cluster"

  pack {
    name   = data.spectrocloud_pack.aws_ubuntu.name
    tag    = data.spectrocloud_pack.aws_ubuntu.version
    uid    = data.spectrocloud_pack.aws_ubuntu.id
    values = data.spectrocloud_pack.aws_ubuntu.values
  }

  pack {
    name   = data.spectrocloud_pack.aws_k8s.name
    tag    = data.spectrocloud_pack.aws_k8s.version
    uid    = data.spectrocloud_pack.aws_k8s.id
    values = data.spectrocloud_pack.aws_k8s.values
  }

  pack {
    name   = data.spectrocloud_pack.aws_cni.name
    tag    = data.spectrocloud_pack.aws_cni.version
    uid    = data.spectrocloud_pack.aws_cni.id
    values = data.spectrocloud_pack.aws_cni.values
  }

  pack {
    name   = data.spectrocloud_pack.aws_csi.name
    tag    = data.spectrocloud_pack.aws_csi.version
    uid    = data.spectrocloud_pack.aws_csi.id
    values = data.spectrocloud_pack.aws_csi.values
  }

  pack {
    name   = "hello-universe"
    type   = "manifest"
    tag    = "1.0.0"
    values = ""
    manifest {
      name    = "hello-universe"
      content = file("manifests/hello-universe.yaml")
    }
  }
}
```

The last `pack {}` block contains a manifest file that contains all the Kubernetes configurations for the [Hello Universe](https://github.com/spectrocloud/hello-universe) application. Including the application in the cluster profile ensures the application is installed during the cluster deployment process. If you are wondering what all the data resources are for, head on to the next section, where data resources are reviewed.


### Data Resources

You may have noticed that each `pack {}` block contains references to a data resource. 

<br />


```terraform
  pack {
    name   = data.spectrocloud_pack.aws_csi.name
    tag    = data.spectrocloud_pack.aws_csi.version
    uid    = data.spectrocloud_pack.aws_csi.id
    values = data.spectrocloud_pack.aws_csi.values
  }
```

[Data resources](https://developer.hashicorp.com/terraform/language/data-sources) are used to perform read actions in Terraform. The Spectro Cloud Terraform provider exposes several data resources to help you make your Terraform code more dynamic. The data resource used in the cluster profile is `spectrocloud_pack`. This resource enables you to query Palette for information about a specific. You can get information about the pack using the data resource, such as unique ID, registry ID, version available, and YAML values.

Below is the data resource used to query Palette for information about the Kubernetes pack for version `1.24.10`.

<br />

```terraform
data "spectrocloud_pack" "aws_k8s" {
  name    = "kubernetes"
  version = "1.24.10"
}
```

Using the data resource, you avoid manually typing in the parameter values required by the cluster profile's `pack {}` block.

### Cluster

The file **clusters.tf** contains the definitions for deploying a host cluster to one of the cloud providers. To create a host cluster, you must use one of the cluster resources specific to the cloud provider you want to target.

In this tutorial, the following Terraform cluster resources are used.

<br />

| Terraform Resource | Platform | Documentation |
|---|---|---|
| `spectrocloud_cluster_aws` | AWS | [Link](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_aws) |
| `spectrocloud_cluster_azure` | Azure | [Link](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_azure)|
| `spectrocloud_cluster_gcp` | GCP |  [Link](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs/resources/cluster_gcp)|


Using the `spectrocloud_cluster_azure` resource used in the tutorial as an example, notice how the resource accepts a set of parameters.When deploying a cluster, you can change the same parameters through the Palette User Interface (UI). You can learn more about each parameter by reviewing the resource's documentation page hosted in the Terraform registry.

<br />

```terraform
resource "spectrocloud_cluster_azure" "cluster" {
  name             = "azure-cluster"
  tags             = concat(var.tags, ["env:azure"])
  cloud_account_id = data.spectrocloud_cloudaccount_azure.account[0].id

  cloud_config {
    subscription_id = var.azure_subscription_id
    resource_group  = var.azure_resource_group
    region          = var.azure-region
    ssh_key         = tls_private_key.tutorial_ssh_key[0].public_key_openssh
  }

  cluster_profile {
    id = spectrocloud_cluster_profile.azure-profile[0].id
  }

  machine_pool {
    control_plane           = true
    control_plane_as_worker = true
    name                    = "master-pool"
    count                   = var.azure_master_nodes.count
    instance_type           = var.azure_master_nodes.instance_type
    azs                     = var.azure_master_nodes.azs
    is_system_node_pool     = var.azure_master_nodes.is_system_node_pool
    disk {
      size_gb = var.azure_master_nodes.disk_size_gb
      type    = "Standard_LRS"
    }
  }

  machine_pool {
    name                = "worker-basic"
    count               = var.azure_worker_nodes.count
    instance_type       = var.azure_worker_nodes.instance_type
    azs                 = var.azure_worker_nodes.azs
    is_system_node_pool = var.azure_worker_nodes.is_system_node_pool
  }

  timeouts {
    create = "30m"
    delete = "15m"
  }
}
```
## Deploy Cluster

You must first make changes to the **terraform.tfvars** file. Open the **terraform.tfvars** file in any editor of your choice, and focus on the cloud provider you want to deploy a host cluster.

In this Terraform template, to help simplify things, we have added a toggle variable that you can use to select the deployment environment. Each cloud provider has its section containing all the variables you must populate. If a variable under your chosen cloud provider has the value `REPLACE_ME`, it must be replaced.

As an example, review the AWS section. To deploy to AWS, you would change `deploy-aws = false` to `deploy-aws = true`. Additionally, you would replace all the variables with a value `REPLACE_ME`. You can also change the nodes in either the master pool or worker pool by updating the values.

```terraform
###########################
# AWS Deployment Settings
############################
deploy-aws = false # Set to true to deploy to AWS

aws-cloud-account-name = "REPLACE_ME"
aws-region             = "REPLACE_ME"
aws-key-pair-name      = "REPLACE_ME"

aws_master_nodes = {
  count              = "1"
  control_plane      = true
  instance_type      = "m4.2xlarge"
  disk_size_gb       = "60"
  availability_zones = ["REPLACE_ME"] # If you want to deploy to multiple AZs, add them here
}

aws_worker_nodes = {
  count              = "1"
  control_plane      = false
  instance_type      = "m4.2xlarge"
  disk_size_gb       = "60"
  availability_zones = ["REPLACE_ME"] # If you want to deploy to multiple AZs, add them here
}
```

After you have made all the required changes, issue the following command to initialize Terraform.

<br />

```shell
terraform init
```

Next, issue the plan command to preview the changes.

<br />

```shell
terraform plan
```


Output:
```shell
Plan: 2 to add, 0 to change, 0 to destroy.
```

If you change the desired cloud provider's toggle variable to `true,` you will receive an output stating two new resources will be created. The two resources are your cluster profile and the host cluster.

To deploy all the resources, use the apply command.

<br />

```shell
terraform apply -auto-approve
```


### Verify the Profile


To check out the cluster profile creation in Palette, login to [Palette](https://console.spectrocloud.com), and from the left **Main Menu** click on **Profiles** to access the profile page. Scan the list and look for a cluster profile with the following name pattern `tf-[cloud provier]-profile`. Click on the cluster profile to review its details, such as layers, packs, and versions.

![A view of the cluster profile](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_cluster_profile_view.png)


<br />


### Verify the Cluster


You can also check the cluster creation process by navigating to the left **Main Menu** and selecting **Clusters**.

![Update the cluster](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_aws_create_cluster.png)

<br />

Select your cluster to review its details page, which contains the status, cluster profile, event logs, and more.

<br />

The cluster deployment may take several minutes depending on the cloud provider, node count, node sizes used, and the cluster profile. You can learn more about the deployment progress by reviewing the event log. Click on the **Events** tab to check the event log.

![Update the cluster](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-event_log.png)

  <br />

While you wait for the cluster deployment process to complete, feel free to check out a video where we discuss the growing pains of using Kubernetes and how Palette can help your address these pain points.

<br />


<YouTube url="https://www.youtube.com/embed/wM3hcrHbAC0" title="Three Common Kubernetes Growing Pains  - and how to solve them" />

<br />

## Validation

Once the cluster is deployed and ready, you can access the deployed application Hello Universe.
From the cluster's **Overview** page, click on the URL for port **:8080** next to the **hello-universe-service** in the **Services** row. This URL will take you to the application landing page. 

<br />


<WarningBox>

It takes between one to three minutes for DNS to properly resolve the public load balancer URL. We recommend waiting a few moments before clicking on the service URL to prevent the browser from caching an unresolved DNS request.

</WarningBox>


![Deployed application](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_app.png)

<br />

Welcome to Hello Universe, a demo application to help you learn more about Palette and its features. Feel free to click on the logo to increase the counter and for a fun image change.

You have deployed your first application to a cluster managed by Palette through Terraform. Your first application is a single container application with no upstream dependencies.


## Cleanup

Use the following steps to clean up all the resources you created for the tutorial. Use the destroy command to remove all the resources you created through Terraform.

<br />

```shell
terraform destroy --auto-approve
```

Output:
```shell
Destroy complete! Resources: 2 destroyed.
```

<br />

<InfoBox>

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for Force Delete. To trigger a force delete, navigate to the respective cluster’s details page and click on Settings. Click on the Force Delete Cluster to delete the cluster. Palette will automatically remove clusters stuck in the cluster deletion phase for over 24 hours.

</InfoBox>


If you are using the tutorial container and want to exit the container, type `exit` in your terminal session and press the **Enter** key. Next, issue the following command to stop the container.

<br />

```shell
docker stop tutorialContainer && \
docker rmi --force ghcr.io/spectrocloud/tutorials:1.0.4
```


</Tabs.TabPane>
</Tabs>

# Wrap-up

In this tutorial, you created a cluster profile, which is a template containing the core layers required to deploy a host cluster. You then deployed a host cluster onto your preferred cloud service provider. Once the cluster deployed, you updated the cluster profile and added the application Hello Universe to the profile definition, and applied the updates to the host cluster.

Palette assures consistency across cluster deployments through cluster profiles. Palette also enables you to quickly deploy applications to a Kubernetes environment with little or no prior Kubernetes knowledge. In a matter of minutes, you were able to provision a new Kubernetes cluster and deploy an application.

We encourage you to check out the [Deploy an Application using Palette Dev Engine](/devx/apps/deploy-app) tutorial to learn more about Palette. Palette Dev Engine can help you deploy applications more quickly through the usage of [virtual clusters](/glossary-all#palettevirtualcluster). Feel free to check out the reference links below to learn more about Palette.

<br />


- [Palette Modes](/introduction/palette-modes)


- [Cluster Profiles](/devx/cluster_profile)


- [Palette Clusters](/devx/clusters) 


- [Hello Universe GitHub repository](https://github.com/spectrocloud/hello-universe)

<br />
