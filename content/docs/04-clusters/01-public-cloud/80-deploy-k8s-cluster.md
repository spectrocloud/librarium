---
title: "Deploy a Cluster"
metaTitle: "Deploy a Cluster"
metaDescription: "Learn how to deploy an application to a Kubernetes cluster with Palette. Experience a streamlined approach to creating and managing multiple Kubernetes clusters, on different public cloud providers, through Palette's optimized process."
icon: ""
category: ["tutorial"]
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Deploy a Cluster

Palette is designed to help you create and manage Kubernetes clusters in any environment with minimal overhead. Palette makes this possible for application authors and system administrators that want to deploy a containerized application to a Kubernetes environment.

Palette's [*Cluster Profile*](/clusters) component allows you to customize the cluster infrastructure stack you prefer in a declarative and reusable manner. Palette uses a cluster profile when creating a host cluster. The cluster profile is combined with infrastructure configurations such as cluster size and placement configuration to create a final manifest to provision a host cluster based on your preferred infrastructure provider.

This tutorial will teach you how to deploy a host cluster with Palette by using the following public cloud providers - Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP). You can deploy the cluster from the Palette console or use Infrastructure as Code (IaC) through Terraform. You will learn about *Cluster Mode*, *and Cluster Profiles*, and learn how both components enable you to deploy applications to Kubernetes quickly with minimal effort but with a high degree of customization.

# Architecture 

In this tutorial, you will discover how Palette simplifies the creation of a Kubernetes cluster. With some basic configuration information, Palette manages the entire deployment and management process, saving you time and effort. In a few steps, you will have a Kubernetes cluster and your application deployed on top of it.

<br />

This is the application architecture you will deploy, a containerized application with a *replicaSet*.

![Application architecture part 2](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_application.png)

<br />

# Deploy the Cluster and the Application

Select the tab representing the workflow you want to learn more about.

<br />

<Tabs>
<Tabs.TabPane tab="Terraform" key="terraform">


##  Terraform

The [Spectro Cloud Terraform](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) provider enables you to create and manage Palette resources in a codified manner by leveraging Infrastructure as Code (IaC). There are many reasons why you would want to utilize IaC. A few reasons worth highlighting are: the ability to automate infrastructure, improve collaboration related to infrastructure changes, self-document infrastructure through codification, and track all infrastructure in a single source of truth. 

If want to become more familiar with Terraform, we recommend you check out the [Terraform](https://developer.hashicorp.com/terraform/intro) learning resources from HashiCorp. 

<br />

## Prerequisites

To complete this tutorial, you will need the following items

- Basic knowledge of containers.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or another container management tool.
- Terraform v1.4.0 or greater.
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

<Tabs>
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

Change directory to the tutorial code.

<br />

```shell
cd terraform/iaas-cluster-deployment-tf/
```

</Tabs.TabPane>

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


- **cluster_profiles.tf** - this file contains the cluster profile definitions. Each cloud provider has its own cluser profile.


- **cluster.tf** - this file has all the required cluster configurations to deploy a host cluster to one of the cloud providers.


- **terraform.tfvars** - use this file to customize the deployment and to target the deployment environment. This is the primary file you will make modifications to.


- **outputs.tf** - contains content that will be outputed upon a succesfull Terraform `apply` action.

In the following section, you will have an opportunity to review the core resources more closely.

<br />

### Provider

The **provider.tf** file contains the Terraform providers and their respective version. In the tutorial, two providers are used, the Spectro Cloud Terraform provider, and the TLS Terraform provider. Take note of how in in the `provider "spectrocloud" {}` provider block, the project name is specified. You can change the target project by changing the value specified to the `project_name` parameter.

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

The Spectro Cloud Terraform provider has several resources available for use. When it comes to creating a cluster profile, you need to use the `spectrocloud_cluster_profile`.
This resource can be used to customize all layers of a cluster profile. You can specify all the different packs and versions to use, as well as adding a manifest or Helm chart.


In the **cluster-profiles.tf**  file, you will find the cluster profile resource declared three times. Each instance of the resources is for a specific cloud provider. Using the AWS cluster profile as an example, notice how the cluster profile uses `pack {}` blocks to soecify each layer of the cluster profile. The order you arrange the  `pack {}` play an important role, so ensure you start with the bottom layer of the cluster profile first.

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

The last `pack {}` block contains a manifest file that contains all the Kubernetes configurations for the [Hello Universe](https://github.com/spectrocloud/hello-universe) application. By including the application in the cluster profile, you ensure the application is installed during the cluster deployment process.  If you are wondering what all the data resources are for, head on to the next section where data resources are discussed.


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

[Data resources](https://developer.hashicorp.com/terraform/language/data-sources) are used to perform read actions in Terraform. The Spectro Cloud Terraform provider exposes several data resources to help you make your Terraform code more dynamic in nature. The data resource used in the cluster profile is `spectrocloud_pack`. This resource enables you to query Palette for information about a specific. By using the data resource, you can get information about the pack such as unique ID, registry ID, version available, and its YAML values.

Below is the data resource used to query Palette for information about the Kubernetes pack for version `1.24.10`.

<br />

```terraform
data "spectrocloud_pack" "aws_k8s" {
  name    = "kubernetes"
  version = "1.24.10"
}
```

By using the data resource, you avoid having to manualy type in the values required by the cluster profile's `pack {}` block.

### Cluster

The file **clusters.tf** contain the definitions for deploying a host cluster to one of the cloud providers. To create a host cluster, you

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

### Verify the Profile

<br />

To check the profile creation on Palette, login to Palette dashboard and, from the left **Main Menu** click on the **Profiles** panel to access the profile page. At the top of the list you can find the previously created profile.

![Terraform GCP profile](/tutorials/deploy-clusters/terraform/clusters_public-cloud_deploy-k8s-cluster_details.png)

<br />

Click on the profile to see the details of the stacks that compose the profile.

![Terraform GCP profile details](/tutorials/deploy-clusters/terraform/clusters_public-cloud_deploy-k8s-cluster_profile.png)

<br />


### Verify the Cluster

<Tabs>
<Tabs.TabPane tab="AWS" key="aws-validation">

To check the cluster creation, login to the Palette dashboard, and from the left **Main Menu** click on the **Clusters**.

![Update the cluster](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_aws_create_cluster.png)

<br />

Select your cluster to review its details page which contains the status, cluster profile, and more.

</Tabs.TabPane>
<Tabs.TabPane tab="Azure" key="azure-validation">

To check the cluster creation, login to Palette dashboard and, from the left **Main Menu** click on the **Clusters** panel from the left panel and check the created cluster. At the top of the list you can find the *azure-cluster*:

![Update the cluster](/tutorials/deploy-clusters/azure/clusters_public-cloud_deploy-k8s-cluster_azure_create_cluster.png)

<br />

Click on the cluster to see the details, such as status, pack layers, monitoring data, and many other information.

![Update the cluster details](/tutorials/deploy-clusters/azure/clusters_public-cloud_deploy-k8s-cluster_azure_create_cluster_details.png)

</Tabs.TabPane>
<Tabs.TabPane tab="Google Cloud" key="gcp-validation">

To check the cluster creation, login to Palette dashboard and, from the left **Main Menu** click on the **Clusters** panel from the left panel and check the created cluster. At the top of the list you can find the *gcp-cluster*:

![Update the cluster](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_new_cluster.png)

<br />

Click on the cluster to see the details, such as status, pack layers, monitoring data, and many other information.

</Tabs.TabPane>
</Tabs>

<br />

Since the cluster may take several minutes to create, in relation to the packs to install, the type of instances selected, and so forth, it might be useful to check the creation events from the **Events** tab at the top of the page

![Update the cluster](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_create_events.png)

<br />
<br />


## Deploy the Application

The following steps will guide you through deploying an application to your host cluster. You begin by modifying the cluster profile you created earlier and adding a custom manifest to the cluster profile. 

<br />


### Add the Manifest

Open the folder where you have the Terraform configuration files.

```bash
$ cd terraform-config
```

Edit the file **cluster_profile.tf** and add the manifest pack inside the profile definition. Make sure you add the new `pack {}` after all the other pack objects.

```terraform
resource "spectrocloud_cluster_profile" "profile" {
  ...
  pack {
    name = "hello-universe"
    type = "manifest"
    tag  = "1.0.0"
    manifest {
      name    = "hello-universe"
      content = file("manifest.yaml")
    }
  }
}
```

This new manifest pack contains the application configurations defined in a file named *manifest.yaml*. Create the file **manifest.yaml** and add the following Kubernetes configuration.

<br />

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello-universe-service
spec:
  type: LoadBalancer
  selector:
    app: hello-universe
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 8080
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
        image: ghcr.io/spectrocloud/hello-universe:1.0.10
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
```

In this code example, we deploy the [*hello-universe*](https://github.com/spectrocloud/hello-universe) demo application.

We set two replicas for the application to simulate a distributed environment with a redundant web application deployed on Kubernetes. In front of them, we add a load balancer service to route requests across all replica containers as best practice to maximize the workload and to expose a single access point to the web application.

For more information about the service LoadBalancer component you can refer to the [Kubernetes official documentation](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer).

<br />

Then, use Terraform to push the modification to Palette and finalize the application deployment.

So, first, check the validation of the configuration files.

```bash
terraform validate
```

```
Success! The configuration is valid.
```

Create the execution plan with the additional modifications to the already existant configuration:

```shell
terraform plan
```

```shell
// Output condensed for readability
Plan: 0 to add, 1 to change, 0 to destroy.
```

Finally, apply the modifications there are in the plan to execute them and create the infrastructure:

```shell
terraform apply --auto-approve
```

```shell
// Output condensed for readability
Apply complete! Resources: 0 added, 1 changed, 0 destroyed.
```

<br />


## Verify the Application

From the cluster details page, click on **Workloads** at the top of the page:

![Workloads](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_workloads.png)

The tab opens an overview of the Kubernetes components. From there, you can check if the application components have been created successfully.

Select the **Namespaces** tab and check for a namespace called *cluster-xxxxxx*.

Select the **Deployments** tab and check the existence of a deployment with name *hello-universe-deployment*. In the **Deployments** tab you can verify the status of the deployment: next to the deployment name, check the number of Pods ready and the number of replicas to know if the application is fully deployed.

Select the **Pods** tab and check for two pods with name *hello-universe-deployment-xxxxxx*. In the **Pods** tab, next to the pods names, check the status of the pods

![Pods status](/tutorials/deploy-clusters/deploy_app/clusters_public-cloud_deploy-k8s-cluster_app_update_pods.png)

<br />

<WarningBox>
  
It takes between one to three minutes for DNS to properly resolve the public load balancer URL. We recommend waiting a few moments before clicking on the service URL to prevent the browser from caching an unresolved DNS request.

</WarningBox>

The application will be, then, ready to accept user traffic. From the **Overview**  page, click on the URL for port  **:8080** next to the *hello-universe-service* in the **Services** row. 

![Deployed application](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_app.png)

<br />


## Cleanup

Use the following steps to clean up all the resources you created for the tutorial.

<br />


Use the destroy command to remove all the resources you created through Terraform.

First, open the folder where you have the Terraform configuration for the cluster.

```shell
$ cd terraform-config
```

If you want to check the resources you will delete, you can first execute: 

```shell
terraform plan -destroy
```

```shell
// Output condensed for readability
Plan: 0 to add, 0 to change, 3 to destroy.
```

Then delete the components by running the destroy command:

```shell
terraform destroy --auto-approve
```

```shell
// Output condensed for readability
Destroy complete! Resources: 3 destroyed.
```

<br />


</Tabs.TabPane>
<Tabs.TabPane tab="UI Workflow" key="ui">


You can create and manage clusters directly from the Palette dashboard. Use the following steps to learn how to deploy a host cluster to multiple cloud providers.

## Prerequisites

To complete this tutorial, you will need the following items

- A public cloud account from one of the following providers.
  - [AWS](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account)
  - [Azure](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account)
  - [GCP](https://cloud.google.com/docs/get-started)
- Register the cloud account in Palette. Use the following resource for additional guidance.
  - [Register and Manage AWS Accounts](/clusters/public-cloud/aws/add-aws-accounts)
  - [Register and Manage Azure Cloud Accounts](/clusters/public-cloud/azure/azure-cloud)
  - [Register and Manage GCP Accounts](/clusters/public-cloud/gcp#creatingagcpcloudaccount)
## Deploy the Environment

The following steps will guide you through deploying the cluster infrastructure. You will start by creating a cluster profile and deploying the host cluster using your cluster profile.

<br />

<Tabs>
<Tabs.TabPane tab="AWS" key="aws-ui">

### Create Cluster Profile

[Cluster profiles](https://docs.spectrocloud.com/cluster-profiles) are templates created with the following core layers.

 - Operating System (OS).
 - Kubernetes distribution and version.
 - Network Container Interface (CNI).
 - Storage Container Interface (CSI).
 
A cluster profile contains these core layers and additional add-on layers, such as security, monitoring, logging, and so forth.  

Cluster profiles enable you to create infrastructure stacks that can be customized in terms of the number of layers, type of components, and version and offer a reproducible way to create clusters.

Start by logging in to Palette and navigating to the left **Main Menu**. Select **Profiles** to view the cluster profile page.
You can view the list of available cluster profiles. To create a cluster profile, click on the **Add Cluster Profile** button at the top right side.

![View of the cluster view page](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_profile_list_view.png)

Follow the wizard to create a new profile.

In the **Basic Information** section, assign the name **aws-profile**, a brief description of the profile, select the type as **Full**, and assign the tas  **aws***. You can leave the version empty if you want to. Just be aware that the version defaults to **1.0.0**. Click on **Next**.

**Cloud Type** allows you to choose the infrastructure provider with which this cluster profile is associated. Select **AWS** and click on **Next**.

**Profile Layers**, this is the main configuration step where you specify the packs that compose the profile. There are four required infrastructure packs and several optional add-on packs you can choose from.
Every pack requires you to select the **Pack Type**, **Registry**, and **Pack Name**.

For this tutorial, use the following packs:
- **Operating System (OS)** -> *ubuntu-aws LTS__20.4.x*
- **Kubernetes** -> *Kubernetes 1.24.x*
- **Network** -> *cni-calico 3.24.x* (Calico)
- **Storage** -> *csi-aws-ebs 1.16.x* (Amazon Elastic Block Store Container Storage Interface)

As you fill out the information for a layer, click on **Next** to proceed to the following layer.

Click on **Confirm** after you have completed filling out all the core layers.

![A view of the cluster profile stack](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_clusters_parameters.png)

The review section gives an overview of the cluster profile configuration you selected. Click on **Finishing Configuration** to create the cluster profile. 


You can update cluster profiles after the creation process. You can modify cluster profiles by adding, removing, or editing layers at any moment.

<br />


## Create a New Cluster

Navigate to the left **Main Menu** and select **Cluster**. From the clusters page, click on the **Add New Cluster** button.

![palette clusters overview page](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_new_cluster.png)

Click on **Deploy New Cluster** to access the cluster deployment wizard. Select **AWS** and click the **Start AWS Configuration** button. Use the following steps to create a host cluster in AWS.

<br />


### Basic information

In the **Basic information** section, insert the general information about the cluster, such as the Cluster name, Description, Tags, and Cloud account. Click on **Next**.

![palette clusters basic information](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_clusters_basic_info.png)

<br />


### Cluster Profile

On the right side, there is a list of available cluster profiles you can choose to deploy to AWS. Select the cluster profile you created earlier and click on **Next**.

<br />


### Parameters

The **Parameters** section displays all the layers and add-on components in the cluster profile.

![palette clusters parameters](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_clusters_creation_parameters.png)

Each layer has a pack manifest file with the deploy configurations. The pack manifest file is in a YAML format. Each pack contains a set of default values. You can change the manifest values if you don't want to use the default values of the cluster profile. Click on **Next** to proceed.

<br />


### Cluster Configuration

The **Cluster config** section allows you to select the **Region** of where to deploy the host cluster and other options such as FIPS and specifying the **SSH Key Pair** to assign to the cluster. All clusters require you to assign an SSH key.


To create an SSH key pair in AWS login into the AWS dashboard. Open the [Amazon EC2 console](https://console.aws.amazon.com/ec2). In the navigation panel, under **Network & Security**, choose **Key Pairs**. Choose **Create key pair** and enter the information required to create the key pair. Click on the **Create a key pair**. Review the [Create an SSH key pair on AWS](https://docs.aws.amazon.com/ground-station/latest/ug/create-ec2-ssh-key-pair.html) guide for additional information.

![aws key pair creation](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_key_pair_create.png)

<br />

After you have selected the **Region** and your **SSH Key Pair Name**, click on **Next**. 


### Nodes Configuration

The **Nodes config** section allows you to configure the nodes that make up the control plane (master nodes) and data plane (worker nodes) of the host cluster. 


Before you proceed to next section, take the time to review the following parameters. <br /> <br />
- **Number of nodes in the pool** - Used to set the right amount of nodes that make up the pool of either the master or worker nodes. Set the count to one for the master pool and two for the worker pool.


- **Allow worker capability** - This option allows the master node also to accept workloads. This is useful when spot instances are used as worker nodes. You can check this box if you want to.


- **Instance Type** -  Select the compute type for the node pool. Each instance type displays the amount of CPU, RAM, and hourly cost of the instance. Select `m4.2xlarge`.


- **Availability zones** - Used to specify the availability zones the node pool can place nodes. Pick one availability zone.


- **Disk size** - set the disk size to **60**.


- **Instance Option** -  Choose between [on-demand instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html) and [spot instance](https://aws.amazon.com/ec2/spot/) as worker nodes. Select **On Demand**.

![palette clusters basic information](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_cluster_nodes_config.png)

Select **Next** to proceed with the cluster deployment.

<br />


### Settings

In the **Settings** section, you can configure advanced options such as when to patch the OS, enable security scans, manage backups, add role-based access control (RBAC) bindings, and more.

For this tutorial, you can use the default settings. Click on **Validate** to continue. 

<br />


### Review

The **Review** section is an opportunity for you to review all the cluster configurations prior to deploying the cluster. Review all the settings and click on **Finish Configuration** to deploy the cluster.

![aws creation of a new cluster overview page](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_profile_cluster_profile_review.png)


<br /> 

Navigate to the left **Main Menu** and select **Clusters**. 

![Update the cluster](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_aws_create_cluster.png)

Click on your cluster to review details such as deployment status, event logs, cluster profile, monitoring data, and other information about the cluster.

<br />

![A view of the cluster details page](/tutorials/deploy-clusters/aws/clusters_public-cloud_deploy-k8s-cluster_details.png)


</Tabs.TabPane>
<Tabs.TabPane tab="Azure" key="azure-ui">

### Create Cluster Profile

[Cluster profiles](https://docs.spectrocloud.com/cluster-profiles) are templates created with the following core layers.
 - Operating System (OS).
 - Kubernetes distribution and version. 
 - Network Container Interface (CNI). 
 - Storage Container Interface (CSI).
 
A cluster profile contains these core layers and additional add-on layers, such as security, monitoring, logging, and so forth.  

Cluster profiles enable you to create infrastructure stacks that can be customized in terms of the number of layers, type of components, and version and offer a reproducible way to create clusters.

Start by logging in to Palette and navigating to the left **Main Menu**. Select **Profiles** to view the cluster profile page.
You can view the list of available cluster profiles. To create a cluster profile, click on the **Add Cluster Profile** button at the top right side.

![View of the cluster view page](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_profile_list_view.png)

Follow the wizard to create a new profile.

In the **Basic Information** section, assign the name **azure-profile**, a brief description of the profile, select the type as **Full**, and assign the tas  **azure***. You can leave the version empty if you want to. Just be aware that the version defaults to **1.0.0**. Click on **Next**.

**Cloud Type** allows you to choose the infrastructure provider with which this cluster profile is associated. Select **Azure** and click on **Next**.

**Profile Layers**, this is the main configuration step where you specify the packs that compose the profile. There are four required infrastructure packs and several optional add-on packs you can choose from.
Every pack requires you to select the **Pack Type**, **Registry**, and **Pack Name**.

For this tutorial, use the following packs:
- **Operating System (OS)** -> *ubuntu-azure LTS__20.4.x*
- **Kubernetes** -> *Kubernetes 1.24.x*
- **Network** -> *cni-calico-azure 3.24.x* (Calico)
- **Storage** -> *Azure Disk 1.25.x* (Container Storage Interface - CSI)

As you fill out the information for a layer, click on **Next** to proceed to the following layer.

Click on **Confirm** after you have completed filling out all the core layers.

![azure cluster profile overview page](/tutorials/deploy-clusters/azure/clusters_public-cloud_deploy-k8s-cluster_cluster_profile_stack.png)

The review section gives an overview of the cluster profile configuration you selected. Click on **Finishing Configuration** to create the cluster profile. 


You can update cluster profiles after the creation process. You can modify cluster profiles by adding, removing, or editing layers at any moment.

<br />


## Create a New Cluster

Navigate to the left **Main Menu** and select **Cluster**. From the clusters page, click on the **Add New Cluster** button.

![palette clusters overview page](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_new_cluster.png)

Click on **Deploy New Cluster** to access the cluster deployment wizard. Select **Azure** and click the **Start Azure Configuration** button. Use the following steps to create a host cluster in Azure.

<br />


### Basic information

In the **Basic information** section, insert the general information about the cluster, such as the Cluster name, Description, Tags, and Cloud account. Click on **Next**.

![palette clusters basic information](/tutorials/deploy-clusters/azure/clusters_public-cloud_deploy-k8s-cluster_clusters_basic_info.png)

<br />


### Cluster Profile

On the right side, there is a list of available cluster profiles you can choose to deploy to Azure. Select the cluster profile you created earlier and click on **Next**.

### Profile Layers

The **Profile Layers** section displays all the layers and add-on components in the cluster profile.

![palette clusters basic information](/tutorials/deploy-clusters/azure/clusters_public-cloud_deploy-k8s-cluster_parameters.png)

Each layer has a pack manifest file with the deploy configurations. The pack manifest file is in a YAML format. Each pack contains a set of default values. You can change the manifest values if you don't want to use the default values of the cluster profile. Click on **Next** to proceed.

<br />


### Cluster Configuration


The **Cluster config** section allows you to select the **Subscription**, **Region**, **Resource Group**, **Storage accoun** and **SSH Key**  to apply to the host cluster. All clusters require you to assign an SSH key. Refer to the [SSH Keys](/clusters/cluster-management/ssh-keys) guide for guidance on how to upload an SSH key.


<br />

After you have selected a **Subscription**, **Region**, **Resource Group**, **Storage accoun** and **SSH Key**, click on **Next**. 


### Nodes Configuration

The **Nodes config** section allows to configure the nodes that will compose the control plane (master nodes) and data plane (worker nodes) of the Kubernetes cluster.

You can find the list and the explanation of all the parameters in [Node Pool page](https://docs.spectrocloud.com/clusters/cluster-management/node-pool).

Among the multiple configuration you can set, be sure to consider:
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

The Review section is an opportunity for you to review all the cluster configurations prior to deploying the cluster. Review all the settings and click on **Finish Configuration** to deploy the cluster.

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

### Create Cluster Profile
[Cluster profiles](https://docs.spectrocloud.com/cluster-profiles) are templates created with the following core layers.

 - Operating System (OS).
 - Kubernetes distribution and version.
 - Network Container Interface (CNI).
 - Storage Container Interface (CSI).
 
A cluster profile contains these core layers and additional add-on layers, such as security, monitoring, logging, and so forth.  

Cluster profiles enable you to create infrastructure stacks that can be customized in terms of the number of layers, type of components, and version and offer a reproducible way to create clusters.

Start by logging in to Palette and navigating to the left **Main Menu**. Select **Profiles** to view the cluster profile page.
You can view the list of available cluster profiles. To create a cluster profile, click on the **Add Cluster Profile** button at the top right side.

![View of the cluster view page](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_profile_list_view.png)

Follow the wizard to create a new profile.

In the **Basic Information** section, assign the name **gcp-profile**, a brief description of the profile, select the type as **Full**, and assign the tas **gcp**. You can leave the version empty if you want to. Just be aware that the version defaults to 1.0.0. Click on **Next**.

Cloud Type allows you to choose the infrastructure provider with which this cluster profile is associated. Select **Google Cloud** and click on **Next**.

Profile Layers, this is the main configuration step where you specify the packs that compose the profile. There are four required infrastructure packs and several optional add-on packs you can choose from. Every pack requires you to select the Pack Type, Registry, and Pack Name.


For this tutorial, use the following packs:
- **Operating System (OS)** -> *ubuntu-gcp LTS__20.4.x*
- **Kubernetes** -> *Kubernetes 1.24.x*
- **Network** -> *cni-calico 3.24.x*
- **Storage** -> *csi-gcp-driver 1.7.x* 

As you fill out the information for a layer, click on **Next** to proceed to the following layer.

Click on **Confirm** after you have completed filling out all the core layers.

![gcp cluster profile view](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_gcp_cluster_profile_stack_view.png)

The review section gives an overview of the cluster profile configuration you selected. Click on **Finishing Configuration** to create the cluster profile.

You can update cluster profiles after the creation process. You can modify cluster profiles by adding, removing, or editing layers at any moment.

<br />

Navigate to the left **Main Menu** and select **Cluster**. From the clusters page, click on the **Add New Cluster** button.

![palette clusters overview page](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_new_cluster.png)

Click on **Deploy New Cluster** to access the cluster deployment wizard. Select **Google Cloud** and click the **Start Google Cloud Configuration** button. Use the following steps to create a host cluster in Google Cloud.

<br />


### Basic information

In the **Basic information** section, insert the general information about the cluster, such as the **Cluster name**, **Description**, **Tags**, and **Cloud account**. Click on **Next**.

![palette clusters basic information](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_basic_info.png)

<br />


### Cluster Profile

On the right side, there is a list of available cluster profiles you can choose to deploy to GCP. Select the cluster profile you created earlier and click on **Next**.

![palette clusters basic information](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_cluster_gcp_profile.png)

<br />


### Parameters

The **Parameters** section displays all the layers and add-on components in the cluster profile.

![palette clusters basic information](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_clusters_parameters.png)

Each layer has a pack manifest file with the deploy configurations. The pack manifest file is in a YAML format. Each pack contains a set of default values. You can change the manifest values if you don't want to use the default values of the cluster profile. Click on **Next** to proceed.

<br />


### Cluster Configuration

The **Cluster config** section allows you to select the **Project**, **Region**, and **SSH Key** to apply to the host cluster. All clusters require you to assign an SSH key. Refer to the [SSH Keys](/clusters/cluster-management/ssh-keys) guide for guidance on how to upload an SSH key.


<br />

After you have selected a **Project**, **Region**, and **SSH Key**, click on **Next**. 
### Nodes Configuration

The **Nodes config** section allows you to configure the nodes that make up the control plane (master nodes) and data plane (worker nodes) of the host cluster.

Before you proceed to next section, take the time to review the following parameters

You can find the list and the explanation of all the parameters in [Node Pool page](/clusters/cluster-management/node-pool).

Among the multiple configuration you can set, be sure to consider:
- **Number of nodes in the pool** - Used to set the right amount of nodes that make up the pool of either the master or worker nodes. Set the count to one for the master pool and two for the worker pool.

- **Allow worker capability** - This option allows the master node also to accept workloads. This is useful when spot instances are used as worker nodes. You can check this box if you want to.


- **Instance Type** - Select the compute type for the node pool. Each instance type displays the amount of CPU, RAM, and hourly cost of the instance. Select **n1-standard-4**.

`
- **Disk size** - set the disk size to **60**.


- **Availability zones** -  Used to specify the availability zones the node pool can place nodes. Pick one availability zone.

![palette clusters nodes configuration](/tutorials/deploy-clusters/gcp/clusters_public-cloud_deploy-k8s-cluster_cluster_nodes_config.png)

<br />

Select **Next** to proceed with the cluster deployment.


### Settings

In the **Settings** section, you can configure advanced options such as when to patch the OS, enable security scans, manage backups, add role-based access control (RBAC) bindings, and more.

For this tutorial, you can use the default settings. Click on **Validate** to continue.

### Review

The **Review** section is an opportunity for you to review all the cluster configurations prior to deploying the cluster. Review all the settings and click on **Finish Configuration** to deploy the cluster.

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

## Deploy the Application

The following steps will guide you through deploying an application to your host cluster. You will learn how you can update cluster profiles after a host cluster is deployed. In this scenario, you will add a new layer to cluster profile that contains the application. 

<br />

### Add a Manifest

Navigate to the left **Main Menu** and select **Profiles**. Select the cluster profile you created earlier and applied to the host cluster.

Click on **Add Manifest** at the top of the page and fill out the following input fields. <br /> <br />

- **Layer name** - The name of the layer.
- **Manifests**  - Add your manifest by giving it a name and clicking the blue circle button. An empty editor will appear on the right side of the screen.

![manifest](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_manifest.png)

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

The code snippet you added will deploy the [*hello-universe*](https://github.com/spectrocloud/hello-universe) application. You may have noticed the code snippet you added is actually a Kubernetes configuration. Manifest files are a method you can use to acieve more granular customization. You can add any valid Kubernetes configuration to a manifest file.

The manifest defined two replicas for the application to simulate a distributed environment with a web application deployed to Kubernetes. The application is assigned a load balancer. By using a load balancer, you can expose a single access point and distribute the workload to both containers.

Click on **Confirm & Create** to save your changes.

<br />


### Deploy

Navigate to the left **Main Menu** select **Clusters**. Click on the host cluster you deployed to open its details page.


On the top right-hand corner is a green button **Updates Available**. Click on the button to review the available updates. Compare the new changes against the previous cluster profile definition. The only change is the addition of a manifest that will deploy the Hello Universe application.


![Available updates details](/tutorials/deploy-clusters/deploy_app/clusters_public-cloud_deploy-k8s-cluster_update_details_compare.png)

Click on **Confirm updates** to apply the updates to the host cluster.

<br />


## Verify the Application

From the cluster details page, click on **Workloads** at the top of the page:

![Workloads](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_workloads.png)

The tab opens an overview of the Kubernetes components. From there, you can check if the application components have been created successfully.

Select the **Deployments** tab and check the existence of a deployment with name **hello-universe-deployment**. In the **Deployments** tab you can verify the status of the deployme. 

Select the **Pods** tab and check for two pods with name *hello-universe-deployment-xxxxxx*. In the **Pods** tab, next to the pods names, check the status of the pods.

![Pods status](/tutorials/deploy-clusters/deploy_app/clusters_public-cloud_deploy-k8s-cluster_app_update_pods.png)

<br />

Navigate back to the **Overview** tab. Once application is deployed and ready for network traffic, in the **Services** row, the service URL will be exposed. Click on the URL for port  **:8080** to access the Hello Universe application. 

![Deployed application](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_app.png)

<br />


<WarningBox>

It takes between one to three minutes for DNS to properly resolve the public load balancer URL. We recommend waiting a few moments before clicking on the service URL to prevent the browser from caching an unresolved DNS request.


</WarningBox>

<br />

Welcome to Hello Universe, a demo application to help you learn more about Palette and its features. Feel free to click on the logo to increase the counter and for a fun image change.

You have deployed your first application to a cluster managed by Palette. Your first application is a single container application with no upstream dependencies. 


## Cleanup

Use the following steps to remove all the resources you created for the tutorial.

To remove the cluster, navigate to the left **Main Menu** and click on **Clusters** to access the clusters page. Select the cluster you want to delete to access its details page.

Click on **Settings**. In the top-right-hand corner of the page, expand the **settings Menu** and select **Delete Cluster** to delete the cluster.

![Destroy-cluster](/tutorials/deploy-clusters/clusters_public-cloud_deploy-k8s-cluster_delete-cluster-button.png)

You will be asked to type in the cluster name to confirm the delete action. Go ahead and type in the cluster name to proceed with the delete step. The delete process will take several minutes to complete. 

<br />

<InfoBox>

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for Force Delete. To trigger a force delete, navigate to the respective cluster’s details page and click on Settings. Click on the Force Delete Cluster to delete the cluster. Palette will automatically remove clusters stuck in the cluster deletion phase for over 24 hours.

</InfoBox>


<br />

Once the cluster is deleted, navigate back to left **Main Menu** and click on **Profiles**. Find the cluster profile you created and click on the **three-dot Menu** to display the **Delete** button. Select **Delete** and confirm the selection to remove the cluster profile. 


</Tabs.TabPane>
</Tabs>

# Wrap-up

In this tutorial, you created a cluster profile, which is a template containing the core layers required to deploy a host cluster. You then deployed a host cluster onto your preferred cloud service provider. Once the cluster deployed, you updated the cluster profile and added the application Hello Universe to the profile definition, and applied the updates to the host cluster. 

Palette assures consistency across cluster deployments through cluster profiles. Palette also enables you to quickly deploy applications to a Kubernetes environment with little or no prior Kubernetes knowledge. In a matter of minutes, you were able to provision a new Kubernetes cluster and deploy an application.

We encourage you the check out the [Deploy an Application using Palette Dev Engine](/devx/apps/deploy-app) tutorial to learn more about Palette and how the Palette Dev Engine can help you deploy applications more quickly.  Feel free to check out the reference links below to learn more about Palette.

<br />


- [Palette Modes](/introduction/palette-modes)


- [Cluster Profiles](/devx/cluster_profile)


- [Palette Clusters](/devx/clusters) 


- [Hello Universe GitHub repository](https://github.com/spectrocloud/hello-universe)

<br />
