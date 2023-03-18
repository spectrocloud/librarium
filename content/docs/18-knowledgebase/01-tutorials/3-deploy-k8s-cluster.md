---
title: "Deploy a Kubernetes Cluster with Palette"
metaTitle: "Deploy a Kubernetes Cluster with Palette"
metaDescription: "Learn how to deploy an application on a Kubernetes cluster with Palette. Experience a streamlined approach to creating and managing multiple Kubernetes clusters, on different public cloud providers, through Palette's optimized process."
icon: ""
hideToC: false
fullWidth: false
hideToCSidebar: false
hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Deploy a Kubernetes Cluster with Palette

Palette's purpose is to allow you to creating and managing a Kubernetes host cluster to the public cloud providers with minimal effort. Palette makes possibile for software engineers, application developers, or system administrators that want to deploy a containerized application, to interact with Kubernetes clusters with ease.

The *Cluster Profile* component allows you to customize the cluster infrastructure stack you prefer in a reusable and repetitible way on the main cloud providers.

This tutorial will teach you how to deploy a cluster with Palette . Yu will learn about *Cluster Mode*, *Cluster Profiles*, *Host Cluster* and understand how they enable you to deploy applications to Kubernetes quickly with minimal effort but with high degree of customization.

<br />
<br />

# Architecture 

In this tutorial the creation of a Kubernetes infrastructure is totally transparent and hidden because Palette manages it completely. In fact, Palette will save you all the effort to create the overall infrastructure, allowing to deploy a production-ready infrastructure with few clicks, and to deploy the application.

This is a semplified architecture overview that shows the infrastructure Palette creates for you into the cloud provider you prefer.

![Infrastructure architecture](deploy-k8s-cluster/architecture_infrastructure.png)

<br />

Palette also makes very easy to deploy an application on Kubernetes because it offer all the support to deploy the application from the yaml templates, with no needs to execute commands towards the cluster.

This is the application architecture you will deploy with this tutorial:

![Application architecture](deploy-k8s-cluster/architecture_application.png)

<br />
<br />

# Deploy the Cluster and the Application

<Tabs>
<Tabs.TabPane tab="UI Workflow" key="ui-cluster">

## UI Workflow

Palette supports to create and manage clusters directly from the dashboard, to provide n easy to use way to manage deploys to multiple cloud providers.

<br />


## Prerequisites

To complete this tutorial, you will need the following items.

- A Spectro Cloud account. You can [sign up to Palette](https://console.spectrocloud.com/auth/signup) 
- Basic knowledge about containers.
- Create a Cloud account ([AWS, Azure, GCP ](#providers))
- Basic knowledge of the main public cloud platforms

In case, you want to extend the experiments of this tutorial, exceeding the providers free tier threshold, you can request an authorization to the [Spectro Cloud Free Cloud Credit program](https://docs.spectrocloud.com/getting-started/palette-freemium#requestafreecloudaccount)

<br />


## Deploy the Environment

The following steps will guide you through deploying the cluster infrastructure. You will start with the definition of the cluster profile, then you will create the cluster and launch the provision of the cluster.

From Palette, you will create the cluster and deploy the application. Each cluster will be hosted on a cloud service provider, i.e. AWS, Azure, GCP, and managed through Palette.

<div id="providers"></div>
<br />
<br />

<Tabs>
<Tabs.TabPane tab="AWS" key="aws-ui">

## Create AWS Account

Go to [AWS home page](https://aws.amazon.com) and follow the [page to create and activate a AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account).

When you create an account, we recommend to create another user to execute everyday tasks and give to that user sufficient rights to create the cluster, avoiding to use the root user credentials to perform it.

<br />


## Create Cluster Profile

[Cluster profiles](https://docs.spectrocloud.com/cluster-profiles) are templates that are created with preconfigured core layers (OS, Kubernetes orchestrator, Network, Storage) with the possibility to add several available add-on layers, such as security, monitoring, logging, and so forth. 
Cluster profiles allows to create infrastructural stacks that can be customized in terms of number of layers, type of components, and version and offer a reproducible way to create clusters.

Start by log in to Palette and open the **Profiles** tab on the left panel. 
You can see the list of available default profiles. For now, we create our own profile, so click to **Add Cluster Profile** at the top right side.

Follow the procedure to create a new profile.

In **Basic Information**, insert the name of the profile such as *aws-profile*, a brief  description of the profile, the type as *Full*, and tags as *aws*. You can leave version empty since the version defaults to 1.0.0.

**Cloud Type** allows you to choose the infrastructure provider this profile is associated to. Select *AWS*.

**Profile Layers** is the main configuration steps when you create a profile and you need to specify the packs that compose the profile. There are 4 required infrastructure packs and several optional add-on packs you can choose.
Every pack requires the *Pack Type*, *Registry*, *Pack Name*, *Chart version*, *Manifests* options that compose the *Pack Values* string.

The infrastrucutre packs and their *Pack Values* configuration used in this tutorial are the following:
- **Operating System (OS)** pack type -> *ubuntu-aws LTS__20.4.x*
- **Kubernetes** pack type -> *Kubernetes 1.21.x*
- **Network** pack type -> *cni-calico 3.24.x* (Calico)
- **Storage** pack type -> *csi-aws 1.0.x* (Container Storage Interface - CSI)

We also add, as add-on pack, a reverse proxy to access the web application you are going to deploy later on.
Click on **Add New Pack**, choose **Authentication** as pack type and select the latest version of **Spectro Proxy** pack name with its default manifest.


The **Review** section gives an overview of the cluster profile configuration created.

![aws cluster profile overview page](deploy-k8s-cluster/aws/profile_review.png)

After the creation of a cluster profile, you can update it by adding, removing, or editing layers, in any moment.

<br />


## Create New Cluster

You can open the clusters overview by selecting the **Cluster ** tab on the Palette left panel.

From the clusters page, you can select **Add New Cluster**

![palette clusters overview page](deploy-k8s-cluster/new_cluster.png)

and **Deploy New Cluster** from the pop-up menu.

Choose the cloud provider at your choice, AWS in this case, and **Start AWS Configuration**

This starts the procedure to create configure the cluster on AWS, whose steps are the following.

<br />


### Basic information

In the basic information section, you insert the general information about the cluster, such as the Cluster name, Description, Tags, the Cloud account.

![palette clusters basic information](deploy-k8s-cluster/aws/clusters_basic_info.png)

<br />


### Cluster profile

[Cluster profiles](https://docs.spectrocloud.com/cluster-profiles) are templates that are created with preconfigured core layers (OS, Kubernetes orchestrator, Network, Storage) with the possibility to add several available add-on layers, such as security, monitoring, logging, and so forth. 
Cluster profiles allows to create infrastructural stacks that can be customized in terms of number of layers, type of components, and version and offer a reproducible way to create clusters.

Start by log in to Palette and open the **Profiles** tab on the left panel. 
You can see the list of available default profiles. For now, we create our own profile, so click to **Add Cluster Profile** at the top right side.

Follow the procedure to create a new profile.

In **Basic Information**, insert the name of the profile such as *gcp-profile*, a brief  description of the profile, the type as *Full*, and tags as *gcp". You can leave version empty since the version defaults to 1.0.0.

**Cloud Type** allows you to choose the infrastructure provider this profile is associated to. Select *Google Cloud*.

**Profile Layers** is the main configuration steps when you create a profile and you need to specify the packs that compose the profile. There are 4 required infrastructure packs and several optional add-on packs you can choose.
Every pack requires the *Pack Type*, *Registry*, *Pack Name*, *Chart version*, *Manifests* options that compose the *Pack Values* string.

The infrastrucutre packs and their *Pack Values* configuration used in this tutorial are the following:
- **Operating System (OS)** pack type -> *ubuntu-gcp LTS__20.4.x*
- **Kubernetes** pack type -> *Kubernetes 1.21.x*
- **Network** pack type -> *cni-calico 3.24.x* (Calico)
- **Storage** pack type -> *csi-gcp 1.0.x* (Google Compute Engine persistent disk Container Storage Interface - GCE CSI)

We also add, as add-on pack, a reverse proxy to access the web application you are going to deploy later on.
Click on **Add New Pack**, choose **Authentication** as pack type and select the latest version of **Spectro Proxy** pack name with its default manifest.


The **Review** section gives an overview of the cluster profile configuration created.

![aws cluster profile overview page](deploy-k8s-cluster/gcp/profile_review.png)

After the creation of a cluster profile, you can update it by adding, removing, or editing layers, in any moment.

<br />


### Parameters

The parameters section resumes the list of infrastructure layers and the list of add-on components.

![palette clusters basic information](deploy-k8s-cluster/aws/clusters_parameters.png)

For each component, there is a manifest with the deploy configurations.

The default manifest is already suitable for production environment since it already includes a working configuration and the most of the hardening standards recommended for production environments.
Despite that, you can edit the default manifest, customizing the deploy configuration.

<br />


### Cluster config

The cluster config section allows to select the Region where to deploy among the ones provided by the cloud providers and the SSH Key Pair to use.

![palette clusters basic information](deploy-k8s-cluster/aws/clusters_cluster_config.png)

Create an SSH key pair from the AWS dashboard.
Open the [Amazon EC2 console](https://console.aws.amazon.com/ec2) and, in the navigation panel, under Network & Security, choose Key Pairs.
Choose Create key pair and enter the information required to create the key pair:  a descriptive name for the key, the type of key pair, and the private key file format. Then, select to Create a key pair.

![aws key pair creation](deploy-k8s-cluster/aws/key_pair_create.png)

<br />


### Nodes config

The node config section allows to configure the type of nodes you will use as master and worker nodes in the Kubernetes configuration.

You can find the list and the explaination of all the paramerters in [Node Pool page](https://docs.spectrocloud.com/clusters/cluster-management/node-pool).

Among the multiple configuration you can set, be sure to consider:
- *Number of nodes in the pool* to set the right amount of nodes that compose the pool of either the master or worker nodes. For the tutorial we set 1 for the master pool and 2 for the worker pool
- *Allow worker capability* to allow the master node also to accept workloads. This option is particularly useful in case you select *spot instance* as worker nodes in order to guarantee a minimum number of available nodes on the cluster. For the tutorial we check it.
- *Instance Type* to select the amount of resources each node must have. Each instance type shows the amount of vCPU, RAM and the hourly cost of the instance.
- *Availability zones* to use within the Region seleted in the *Cluster config* section.
- *Instance Option* to choose between [on-demand instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html) and [spot instance](https://aws.amazon.com/ec2/spot/) as worder nodes. 
  - (in case of spot instance) *Maximum spot bid price* to set the bid price threshold to get instances. For this tutorial, you can select spot instance to minimize cost but make sure you check the *Allow worker capability* flag.

![palette clusters basic information](deploy-k8s-cluster/aws/clusters_nodes_config.png)

<br />


### Settings

In the Settings section you can select advanced configurations about the management of the instances, such as when to patch the OS, enable security scans, manage backups, add role-based access control (RBAC), enable virtual clusters.

For the purpose of this tutorial, you can use the default settings configuration.

<br />


### Review

The review section resumes the cluster configuration as you have configured it in the previous steps.

![aws creation of a new cluster overview page](deploy-k8s-cluster/aws/clusters_review.png)

Take a look of the overall setup and press *Finish Configuration* to deploy it.

<br />

Now select the **Clusters** page from the left panel and check the created cluster.

![Update the cluster](deploy-k8s-cluster/deploy_app/aws_create_cluster.png)

Click on the cluster to see the details, such as status, pack layers, monitoring data, and many other information.

<br />


</Tabs.TabPane>

<Tabs.TabPane tab="Azure" key="azure-ui">

## Create Azure Account

Go to [Azure home page](https://azure.microsoft.com/free) and follow the [page to create an Azure account](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account).

When you create an account, we recommend to create another user to execute everyday tasks and give to that user sufficient rights to create the cluster, avoiding to use the root user credentials to perform it.

<br />

Azure Active Directory -> create the application
Subscriptions -> Create subscription
Resource groups -> Create resource group withn the subscription
SSH keys -> Generate SSH Key Pair



## Create Cluster Profile

todo ...

<br />


## Create New Cluster

todo ...

<br />


</Tabs.TabPane>

<Tabs.TabPane tab="GCP" key="gcp-ui">

## Create GCP Account

Go to [GCP home page](https://cloud.google.com) and follow the [page to create an GCP account](https://cloud.google.com/docs/get-started).

When you create an account, we recommend to create another user to execute everyday tasks and give to that user sufficient rights to create the cluster, avoiding to use the root user credentials to perform it.

When you login in GCP, you need to create a project. To do that navigate to the *IAM & Admin* section and select *manage Resources* to enter into the page to manage the project, the folder and the organization. From there you can crate a folder, create or edit a project, and assign a project to an organization. Create a project for this tutorial.

In order to allow Palette to manage the cloud resource for you, you need to grant the access to the two management API: *Cloud Resource Manager API* and *Compute Engine API*.

To enable *Cloud Resource Manager API*, enter in *APIs & Services* section, select *Enable APIs & Services* from the panel on the left, and click on *+ Enable APIs and Services* on the top of the page. 
Search for *Cloud Resource Manager API*, enter into the product details and enable it. 

Your API should now be enabled.

![gcp how to enable cloud resource manager api](deploy-k8s-cluster/gcp/cloud_resource_manager_api.png)

To enable *Compute Engine API*, enter in *APIs & Services* section, select *Enable APIs & Services* from the panel on the left, and click on *+ Enable APIs and Services* on the top of the page. 
Search for *Compute Engine API*, enter into the product details and enable it. 

Your API should now be enabled.

![gcp how to enable compute engine api](deploy-k8s-cluster/gcp/computer_engine_api.png)


## Create Cluster Profile

[Cluster profiles](https://docs.spectrocloud.com/aws/cluster-profiles) are templates that are created with preconfigured core layers (OS, Kubernetes orchestrator, Network, Storage) with the possibility to add several available add-on layers, such as security, monitoring, logging, and so forth.

Cluster profiles allows to create infrastructural stacks that can be customized in terms of number of layers, type of components, and version and offer a reproducible way to create clusters.

After the creation of a cluster profile, you can update it in any moment by adding/removing layers, editing the manifests, and so forth.

Here an example of cluster profile configuration.

![gcp cluster profile overview page](deploy-k8s-cluster/gcp/cluster_profile.png)

For this tutorial, we use Ubuntu as OS, Calico as networking component, Amazon Elastic Block Store (EBS) Container Storage Interface (CSI) driver to manage the lifecycle of EBS volumes for persistent volumes, and Spectro-Proxy as reverse proxy to access the web application you are going to deploy later on.

<br />


## Create New Cluster

You can open the clusters overview by selecting the **Cluster ** tab on the Palette left panel.

From the clusters page, you can select **Add New Cluster**

![palette clusters overview page](deploy-k8s-cluster/new_cluster.png)

and **Deploy New Cluster** from the pop-up menu.

Choose the cloud provider at your choice, AWS in this case, and **Start AWS Configuration**

This starts the procedure to create configure the cluster on AWS, whose steps are the following.

<br />


### Basic information

In the basic information section, you insert the general information about the cluster, such as the Cluster name, Description, Tags, the Cloud account.

![palette clusters basic information](deploy-k8s-cluster/gcp/clusters_basic_info.png)

<br />


### Cluster profile

From the Cluster profile section, you can select the profile you want to deploy on AWS.

![palette clusters basic information](deploy-k8s-cluster/gcp/clusters_cluster_profile.png)

On the right side there is a list of available and suitable profile you can choose for the deployment on the selected cloud provider.

<br />


### Parameters

The parameters section resumes the list of infrastructure layers and the list of add-on components.

![palette clusters basic information](deploy-k8s-cluster/gcp/clusters_parameters.png)

For each component, there is a manifest with the deploy configurations.

The default manifest is already suitable for production environment since it already includes a working configuration and the most of the hardening standards recommended for production environments.
Despite that, you can edit the default manifest, customizing the deploy configuration.

<br />


### Cluster config

The cluster config section allows to select the Region where to deploy among the ones provided by the cloud providers and the SSH Key Pair to use.

![palette cluster configuration](deploy-k8s-cluster/gcp/clusters_cluster_config.png)

Create an SSH key pair and add to the GCP account.
Open the [GCP Compute Engine console](https://console.cloud.google.com/compute/instances) and, in the navigation panel, under *Setting*, choose *Metadata*. Open the *SSH Keys* tab and click on *Add SSH Key*.

Refer to the [create SSH keys guide](https://cloud.google.com/compute/docs/connect/create-ssh-keys) to create the ssh key on your local machine

Copy and paste the full value of your public key and save it.

![gcp key pair creation](deploy-k8s-cluster/gcp/gcp_ssh_key_create.png)
a
On Palette Console, browse *Project Settings* on the left panel and select *SSH Keys* from the secondary panel.
Click on *Add New SSH Key* and insert the name of the key and the content of the public key. Then confirm it.

![spectro cloud key pair creation](deploy-k8s-cluster/gcp/sp_ssh_key_create.png)

<br />


### Nodes config

The node config section allows to configure the type of nodes you will use as master and worker nodes in the Kubernetes configuration.

You can find the list and the explaination of all the paramerters in [Node Pool page](https://docs.spectrocloud.com/clusters/cluster-management/node-pool).

Among the multiple configuration you can set, be sure to consider:
- *Number of nodes in the pool* to set the right amount of nodes that compose the pool of either the master or worker nodes. For the tutorial we set 1 for the master pool and 2 for the worker pool
- *Allow worker capability* to allow the master node also to accept workloads. This option is particularly useful in case you select *spot instance* as worker nodes in order to guarantee a minimum number of available nodes on the cluster. For the tutorial we check it.
- *Instance Type* to select the amount of resources each node must have. Each instance type shows the amount of vCPU, RAM and the hourly cost of the instance.
- *Availability zones* to use within the Region seleted in the *Cluster config* section.
- *Instance Option* to choose between [on-demand instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html) and [spot instance](https://aws.amazon.com/ec2/spot/) as worder nodes. 
  - (in case of spot instance) *Maximum spot bid price* to set the bid price threshold to get instances. For this tutorial, you can select spot instance to minimize cost but make sure you check the *Allow worker capability* flag.

![palette clusters nodes configuration](deploy-k8s-cluster/gcp/clusters_nodes_config.png)

<br />


### Settings

In the Settings section you can select advanced configurations about the management of the instances, such as when to patch the OS, enable security scans, manage backups, add role-based access control (RBAC), enable virtual clusters.

For the purpose of this tutorial, you can use the default settings configuration.

<br />


### Review

The review section resumes the cluster configuration as you have configured it in the previous steps.

![aws creation of a new cluster overview page](deploy-k8s-cluster/gcp/clusters_review.png)

Take a look of the overall setup and press *Finish Configuration* to deploy it.

<br />

Now select the **Clusters** page from the left panel and check the created cluster.

![Update the cluster](deploy-k8s-cluster/deploy_app/gcp_create_cluster.png)

Click on the cluster to see the details, such as status, pack layers, monitoring data, and many other information.

<br />

</Tabs.TabPane>
</Tabs>


## Deploy the Application

The following steps will guide you through deploying the application on the cluster. You will start with the modification of the cluster profile with the addition of the manifest, then the configuration of the manifest, and the deploy of the application.
The deploy of the application can be done when you create the cluster or, like in this tutorial, after the creation of the cluster.

<br />

### Add the Manifest

Return to the *Profiles* tabs on the left panel and open the profile related to the cluster deployed.

Select *Add Manifest* at the top of the page and insert the data:
- *layer name*: name of the pack to add to the profile stack
- *Manifests*: add your manifest by giving it a name and click on the blue tick to confirm it.

![manifest](deploy-k8s-cluster/manifest.png)

<br />


### Customise the Manifest

From the *editor* icon next to the manifest you can switch between the text editor and the overview of the profile stack.

Click on the manifest to prompt a text file on the right side. Here you add the code to deploy the application.
The manifest example code to deploy the *hello-universe* application is the following.

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
        image: ghcr.io/spectrocloud/hello-universe:1.0.9
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
```

In this code example, we deploy the [*hello-universe*](https://github.com/spectrocloud/hello-universe) demo application.

We set 2 replicas to simulate a minimal distributed environment with a redountant web application deployed on Kubernetes. In front of them, we add a load balancer service to route requests across all replica containers as best practice to maximize the workload and to expose a single access point to the web application.

For more information about the service LoadBalancer component you can refer to the [Kuberntes official documentation](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer).

<br />

### Deploy

Select the **Clusters** page from the left panel and click on the cluster to open the details page.

![Cluster details with available updates](deploy-k8s-cluster/deploy_app/updates_available.png)

<br />

On the top right corner you'll see a green button **Updates Available** that shows you have updates to deploy on the cluster.
Click on it to see the modification of the current profile with the last deployed and revise the application configurations.

![Available updates details](deploy-k8s-cluster/deploy_app/updates_available_details.png)

Click on **Confirm updates** to finalize the modification of the profile and apply the configuration of the application on the cluster.

<br />

</Tabs.TabPane>

<Tabs.TabPane tab="Terraform" key="terraform-cluster">

##  Terraform

Palette supports the open-source Infrastructure as Code (IaC) software tool, [Terraform](https://www.terraform.io/), to provide consistent CLI workflow support to multiple cloud services.

The [Spectro Cloud Terraform](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) provider enables you to create and manage Palette resources in a codified manner by leveraging Infrastructure as Code (IaC). There are many reasons why you would want to utilize IaC. A few reasons worth highlighting are: the ability to automate infrastructure, improve collaboration related to infrastructure changes, self-document infrastructure through codification, and track all infrastructure in a single source of truth. 

If you need to become more familiar with Terraform, check out the [Terraform explanation from HashiCorp](https://developer.hashicorp.com/terraform/intro). 

<br />

## Prerequisites

To complete this tutorial, you will need the following items.

- A Spectro Cloud account
- Basic knowledge about containers.
- Terraform v1.3.6 or greater
- A Spectro Cloud API key. [To learn how to create an API key](https://docs.spectrocloud.com/user-management/user-authentication/#apikey)

<br />

## Deploy the Environment

The following steps will guide you through deploying the cluster infrastructure. You will start with the definition of the cluster profile, then you will create the cluster and launch the provision of the cluster.

With Terraform, you will create the cluster and deploy the application. Each cluster will be hosted on a cloud service provider, i.e. AWS, Azure, GCP, and managed through Palette.

<br />

<Tabs>
<Tabs.TabPane tab="AWS" key="aws-terraform">

## Configure the Cluster Profile

### Providers

Create the file *provider.tf* and insert the content:
```terraform
terraform {
  required_providers {
    spectrocloud = {
      version = ">= 0.11.1"
      source  = "spectrocloud/spectrocloud"
    }
  }
}
provider "spectrocloud" {
  project_name = "Default"
  api_key      = var.spectrocloud_api_key
}
```

This file will connect to Palette through the Palette's *api_key*.

<br />


### Variables

Create the file *variables.tf* and insert the content:

```terraform
variable "spectrocloud_api_key" {}
```

Create the file *terraform.tfvars* and insert the content of the variable:

```terraform
spectrocloud_api_key = "j54Asdjnxxxxxxxxxxxxxxxxxxxxxxxx"
```

To find the value of the *spectrocloud_api_key*, open the Palette dashboard and, from the left **Main Menu** click on the **Tenant Settings** panel and select **API Keys**.

<br />


### Cluster Profile

The *cluster profile file* contains the packs that create the profile.

Create the file *cluster_profile.tf* and insert:

```terraform
resource "spectrocloud_cluster_profile" "profile" {
  name  = "tf-aws-profile"
  tags  = ["aws", "tutorial"]
  cloud = "aws"
  type  = "cluster"

  pack {
    name   = data.spectrocloud_pack.ubuntu.name
    tag    = data.spectrocloud_pack.ubuntu.version
    uid    = data.spectrocloud_pack.ubuntu.id
    values = data.spectrocloud_pack.ubuntu.values
  }

  pack {
    name   = data.spectrocloud_pack.k8s.name
    tag    = data.spectrocloud_pack.k8s.version
    uid    = data.spectrocloud_pack.k8s.id
    values = data.spectrocloud_pack.k8s.values
  }

  pack {
    name   = data.spectrocloud_pack.cni.name
    tag    = data.spectrocloud_pack.cni.version
    uid    = data.spectrocloud_pack.cni.id
    values = data.spectrocloud_pack.cni.values
  }

  pack {
    name   = data.spectrocloud_pack.csi.name
    tag    = data.spectrocloud_pack.csi.version
    uid    = data.spectrocloud_pack.csi.id
    values = data.spectrocloud_pack.csi.values
  }

  pack {
    name   = data.spectrocloud_pack.proxy.name
    tag    = data.spectrocloud_pack.proxy.version
    uid    = data.spectrocloud_pack.proxy.id
    values = data.spectrocloud_pack.proxy.values
  }
}
```

## Configure the Cluster

### Variables

Edit the file *variables.tf* and insert the list of variables:

```terraform
variable "cluster_profile" {}
variable "region" {}
variable "aws_ssh_key_name" {}
variable "aws-cloud-account-name" {
    type = string
    description = "The name of your AWS account as assigned in Palette"
}
variable "master_nodes" {
    type = object({
        count           = string
        instance_type   = string
        disk_size_gb    = string
        availability_zones = list(string)
    })
    description = "Master nodes configuration."
}
variable "worker_nodes" {
    type = object({
        count           = string
        instance_type   = string
        disk_size_gb    = string
        availability_zones = list(string)
    })
    description = "Worker nodes configuration."
}
```

Then, edit also the file *terraform.tfvars* and append the content of the variables:
```terraform
spectrocloud_api_key    = "j54AsdjnSP2YU9jJF1K5dVYeURWzO4qd"
aws_ssh_key_name        = "palette-key"
aws-cloud-account-name  = "aws-palette"
cluster_profile         = "tf-aws-profile"
region                  = "us-east-1"
master_nodes = {
    count           = "1"
    instance_type   = "m5.large"
    disk_size_gb    = "50"
    availability_zones = ["us-east-1a"]
}
worker_nodes = {
    count           = "1"
    instance_type   = "m5.large"
    disk_size_gb    = "50"
    availability_zones = ["us-east-1a"]
} 
```

### Cluster Profile

Create the *cluster.tf* file and insert the cluster resource:

```terraform
data "spectrocloud_cloudaccount_aws" "account" {
  name = var.aws-cloud-account-name
}

data "spectrocloud_cluster_profile" "profile" {
  name = var.cluster_profile
}

resource "spectrocloud_cluster_aws" "cluster" {
  name             = aws-cluster"
  tags             = ["aws", "tutorial"]
  cloud_account_id = data.spectrocloud_cloudaccount_aws.account.id

  cloud_config {
    region        = var.region
    ssh_key_name  = var.aws_ssh_key_name
  }

  cluster_profile {
    id = data.spectrocloud_cluster_profile.profile.id
  }

  machine_pool {
    control_plane           = true
    control_plane_as_worker = true
    name                    = "master-pool"
    count                   = var.master_nodes.count
    instance_type           = var.master_nodes.instance_type
    disk_size_gb            = var.master_nodes.disk_size_gb
    azs                     = var.master_nodes.availability_zones
  }

  machine_pool {
    name          = "worker-basic"
    count         = var.worker_nodes.count
    instance_type = var.worker_nodes.instance_type
    disk_size_gb  = var.worker_nodes.disk_size_gb
    azs           = var.worker_nodes.availability_zones
  }
}
```


## Create the Profile and the Cluster

To create the cluster profile on Palette and the cluster on the cloud provider use the Terraform commands to apply the information present into the configuration files.

Open the terminal and enter into the folder where you have the Terraform configuration files

```bash
$ cd terraform-project
```

Initialize the working directory containing Terraform configuration files
```bash
$ terraform init
```

Validate the configuration files in the directory
```bash
$ terraform validate 
```

Create the execution plan with the preview changes your configuration will create on the infrastructure and output them in a file to save it
```bash
$ terraform plan -out tutorial.tfplan
```

Revise the components you are about to apply to the cloud provider
```bash
$ terraform show tutorial.tfplan
```

Finally, apply the modifications there are in the plan to execute them and create the infrastructure
```bash
$ terraform apply tutorial.tfplan
```


## Validation

To check the profile creation on Palette, login to Palette dashboard and, from the left **Main Menu** click on the **Profiles** panel to access the profile page. At the top of the list you can find the *tf-aws-profile*:
![Terraform AWS profile](deploy-k8s-cluster/terraform/tf_aws_profile.png)

Click on the profile to see the details of the stacks that compose the profile:
![Terraform AWS profile details](deploy-k8s-cluster/terraform/tf_aws_profile_details.png)


To check the cluster creation, login to Palette dashboard and, from the left **Main Menu** click on the **Clusters** panel from the left panel and check the created cluster. At the top of the list you can find the *aws-cluster*:

![Update the cluster](deploy-k8s-cluster/deploy_app/aws_create_cluster.png)

Click on the cluster to see the details, such as status, pack layers, monitoring data, and many other information.

<br />


</Tabs.TabPane>
<Tabs.TabPane tab="Azure" key="azure-terraform">

## Configure the Cluster Profile

Create a folder where you will put all the Terraform configuration files and open it:
```bash
$ mkdir terraform-project
$ cd terraform-project
```

### Providers

Create the file *provider.tf* and insert the list of variables:
```terraform
terraform {
  required_providers {
    spectrocloud = {
      version = ">= 0.11.1"
      source  = "spectrocloud/spectrocloud"
    }
  }
}
provider "spectrocloud" {
  project_name = "Default"
  api_key      = var.spectrocloud_api_key
}
```

This file will connect to Palette through the Palette's *api_key*.

<br />


### Variables

Create the file *variables.tf* and insert the content:

```terraform
variable "spectrocloud_api_key" {}
```

Create the file *terraform.tfvars* and insert the content of the variable:

```terraform
spectrocloud_api_key = "j54Asdjnxxxxxxxxxxxxxxxxxxxxxxxx"
```

To find the value of the *spectrocloud_api_key*, open the Palette dashboard and, from the left **Main Menu** click on the **Tenant Settings** panel and select **API Keys**.

<br />


### Data

The *data* file contains the details, such as name, version, of the stacks that compose the infrastructure.

Create the file *data.tf* and insert:

```terraform
data "spectrocloud_pack" "csi" {
  name    = "csi-azure"
  version = "1.25.0"
}

data "spectrocloud_pack" "cni" {
  name    = "cni-calico-azure"
  version = "3.24.5"
}

data "spectrocloud_pack" "k8s" {
  name    = "kubernetes"
  version = "1.24.10"
}

data "spectrocloud_pack" "ubuntu" {
  name    = "ubuntu-azure"
  version = "20.04"
}

data "spectrocloud_pack" "proxy" {
  name    = "spectro-proxy"
  version = "1.2.0"
}
```


### Cluster Profile

The *cluster profile file* contains the packs that create the profile.

Create the file *cluster_profile.tf* and insert:

```terraform
resource "spectrocloud_cluster_profile" "profile" {
  name  = "tf-azure-profile"
  tags  = ["ms-azure", "tutorial"]
  cloud = "azure"
  type  = "cluster"

  pack {
    name   = data.spectrocloud_pack.ubuntu.name
    tag    = data.spectrocloud_pack.ubuntu.version
    uid    = data.spectrocloud_pack.ubuntu.id
    values = data.spectrocloud_pack.ubuntu.values
  }

  pack {
    name   = data.spectrocloud_pack.k8s.name
    tag    = data.spectrocloud_pack.k8s.version
    uid    = data.spectrocloud_pack.k8s.id
    values = data.spectrocloud_pack.k8s.values
  }

  pack {
    name   = data.spectrocloud_pack.cni.name
    tag    = data.spectrocloud_pack.cni.version
    uid    = data.spectrocloud_pack.cni.id
    values = data.spectrocloud_pack.cni.values
  }

  pack {
    name   = data.spectrocloud_pack.csi.name
    tag    = data.spectrocloud_pack.csi.version
    uid    = data.spectrocloud_pack.csi.id
    values = data.spectrocloud_pack.csi.values
  }

  pack {
    name   = data.spectrocloud_pack.proxy.name
    tag    = data.spectrocloud_pack.proxy.version
    uid    = data.spectrocloud_pack.proxy.id
    values = data.spectrocloud_pack.proxy.values
  }
}
```

## Create the Profile

To create the cluster profile on Palette use the Terraform commands to apply the information present into the configuration files.

Open the terminal, enter into the folder where you have the Terraform configuration files and initialize the working directory containing Terraform configuration files
```bash
$ terraform init
```

Validate the configuration files in the directory
```bash
$ terraform validate 
```

Create the execution plan with the preview changes your configuration will create on the infrastructure
```bash
$ terraform plan
```

Revise the output of the *plan* command to check the profile details and apply the modifications there are in the plan to execute them and create the infrastructure
```bash
$ terraform apply
```


## Configure the Cluster

### Variables

Edit the file *variables.tf* and insert the list of variables:

```terraform
variable "spectrocloud_api_key" {}
variable "cluster_profile" {}
variable "region" {}
variable "subscription_id" {}
variable "resource_group" {}
variable "cluster_ssh_public_key" {}

variable "azure-cloud-account-name" {
    type = string
    description = "The name of your Azure account as assigned in Palette"
}

variable "master_nodes" {
    type = object({
        count               = string
        instance_type       = string
        disk_size_gb        = string
        availability_zones  = list(string)
        is_system_node_pool = bool
    })
    description = "Master nodes configuration."
}

variable "worker_nodes" {
    type = object({
        count           = string
        instance_type   = string
        disk_size_gb    = string
        availability_zones = list(string)
        is_system_node_pool = bool
    })
    description = "Worker nodes configuration."
}

```

Then, edit also the file *terraform.tfvars* and append the content of the variables:
```terraform
spectrocloud_api_key    = "j54xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
azure-cloud-account-name  = "azure-palette"
cluster_profile         = "tf-azure-profile"
region                  = "East US"
subscription_id         = "03axxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
resource_group          = "palette_rg"
cluster_ssh_public_key  = "xxxxxxxxxxx"

master_nodes = {
    count            = "1"
    instance_type    = "Standard_D2_v3"
    disk_size_gb     = "50"
    availability_zones = []
    is_system_node_pool = false
}

worker_nodes = {
    count            = "1"
    instance_type    = "Standard_D2_v3"
    disk_size_gb     = "50"
    availability_zones = []
    is_system_node_pool = false
}
```

### Cluster Profile

Create the *cluster.tf* file and insert the cluster resource:

```terraform
data "spectrocloud_cloudaccount_azure" "account" {
  name = var.azure-cloud-account-name
}

data "spectrocloud_cluster_profile" "profile" {
  name = var.cluster_profile
}

resource "spectrocloud_cluster_azure" "cluster" {
  name             = "azure-cluster"
  tags             = ["azure", "tutorial"]
  cloud_account_id = data.spectrocloud_cloudaccount_azure.account.id

  cloud_config {
    subscription_id = var.subscription_id
    resource_group  = var.resource_group
    region          = var.region
    ssh_key         = var.cluster_ssh_public_key
  }

  cluster_profile {
    id = data.spectrocloud_cluster_profile.profile.id
  }

  machine_pool {
    control_plane           = true
    control_plane_as_worker = true
    name                    = "master-pool"
    count                   = var.master_nodes.count
    instance_type           = var.master_nodes.instance_type
    azs                     = var.master_nodes.availability_zones
    is_system_node_pool     = var.master_nodes.is_system_node_pool
    disk {
      size_gb = var.master_nodes.disk_size_gb
      type    = "Standard_LRS"
    }
  }

  machine_pool {
    name                 = "worker-basic"
    count                = var.worker_nodes.count
    instance_type        = var.worker_nodes.instance_type
    azs                  = var.worker_nodes.availability_zones
    is_system_node_pool  = var.worker_nodes.is_system_node_pool
  }
}
```


## Create the Cluster

To create the cluster on the cloud provider use the Terraform commands to apply the information present into the configuration files.

Open the terminal, enter into the folder where you have the Terraform configuration files and validate the configuration files in the directory
```bash
$ terraform validate
```

Create the execution plan with the preview changes your configuration will create on the infrastructure
```bash
$ terraform plan
```

Revise the output of the *plan* command to check the cluster details and apply the modifications there are in the plan to execute them and create the infrastructure
```bash
$ terraform apply
```


## Validation

To check the profile creation on Palette, login to Palette dashboard and, from the left **Main Menu** click on the **Profiles** panel to access the profile page. At the top of the list you can find the *tf-azure-profile*:
![Terraform Azure profile](deploy-k8s-cluster/terraform/tf_azure_profile.png)

Click on the profile to see the details of the stacks that compose the profile:
![Terraform Azure profile details](deploy-k8s-cluster/terraform/tf_azure_profile_details.png)


To check the cluster creation, login to Palette dashboard and, from the left **Main Menu** click on the **Clusters** panel from the left panel and check the created cluster. At the top of the list you can find the *azure-cluster*:

![Update the cluster](deploy-k8s-cluster/deploy_app/azure_create_cluster.png)

Click on the cluster to see the details, such as status, pack layers, monitoring data, and many other information.

<br />

</Tabs.TabPane>
<Tabs.TabPane tab="GCP" key="gcp-terraform">

## Configure the Cluster Profile

### Providers

Create the file *provider.tf* and insert the list of variables:
```terraform
terraform {
  required_providers {
    spectrocloud = {
      version = ">= 0.11.1"
      source  = "spectrocloud/spectrocloud"
    }
  }
}
provider "spectrocloud" {
  project_name = "Default"
  api_key      = var.spectrocloud_api_key
}
```

This file will connect to Palette through the Palette's *api_key*.

<br />


### Variables

Create the file *variables.tf* and insert the content:

```terraform
variable "spectrocloud_api_key" {}
```

Create the file *terraform.tfvars* and insert the content of the variable:

```terraform
spectrocloud_api_key = "j54Asdjnxxxxxxxxxxxxxxxxxxxxxxxx"
```

To find the value of the *spectrocloud_api_key*, open the Palette dashboard and, from the left **Main Menu** click on the **Tenant Settings** panel and select **API Keys**.

<br />


### Cluster Profile

The *cluster profile file* contains the packs that create the profile.

Create the file *cluster_profile.tf* and insert:

```terraform
resource "spectrocloud_cluster_profile" "profile" {
  name  = "tf-gcp-profile"
  tags  = ["gcp", "tutorial"]
  cloud = "gcp"
  type  = "cluster"

  pack {
    name   = data.spectrocloud_pack.ubuntu.name
    tag    = data.spectrocloud_pack.ubuntu.version
    uid    = data.spectrocloud_pack.ubuntu.id
    values = data.spectrocloud_pack.ubuntu.values
  }

  pack {
    name   = data.spectrocloud_pack.k8s.name
    tag    = data.spectrocloud_pack.k8s.version
    uid    = data.spectrocloud_pack.k8s.id
    values = data.spectrocloud_pack.k8s.values
  }

  pack {
    name   = data.spectrocloud_pack.cni.name
    tag    = data.spectrocloud_pack.cni.version
    uid    = data.spectrocloud_pack.cni.id
    values = data.spectrocloud_pack.cni.values
  }

  pack {
    name   = data.spectrocloud_pack.csi.name
    tag    = data.spectrocloud_pack.csi.version
    uid    = data.spectrocloud_pack.csi.id
    values = data.spectrocloud_pack.csi.values
  }

  pack {
    name   = data.spectrocloud_pack.proxy.name
    tag    = data.spectrocloud_pack.proxy.version
    uid    = data.spectrocloud_pack.proxy.id
    values = data.spectrocloud_pack.proxy.values
  }
}
```

<br />

</Tabs.TabPane>
</Tabs>


<br />
<br />


## Deploy the Application

The following steps will guide you through deploying the application on the cluster. You will start with the modification of the cluster profile with the addition of the manifest, then the configuration of the manifest, and the deploy of the application.
The deploy of the application can be done when you create the cluster or, like in this tutorial, after the creation of the cluster.

<br />


### Add the Manifest

Open the file *cluster_profile.tf* and add the manifest pack inside the profile definition:

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

This new manifest pack contains the configurations of the application through the file *manifest.yaml*. So, create the file *manifest.yaml* with the content:

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

<br />

Create the execution plan with the additional modifications to the already existant configuration:
```bash
$ terraform plan
```

Finally, apply the modifications there are in the plan to execute them and create the infrastructure:
```bash
$ terraform apply
```

</Tabs.TabPane>
</Tabs>

<br />

# Validation

Open the Palette dashboard and click on **Workloads** on the top of the page:

![Workloads](deploy-k8s-cluster/workloads.png)

This tab opens an overview of the Kubernetes components. From there you can check if the application components have been created successfully:
- select the **Namespace** tab and check for a namespace called *cluster-xxxxxx*
- select the **Deployment** tab and check for the *hello-universe-deployment* deployment
- select the **Pods** tab and check for two pods with name *hello-universe-xxxxxx*

Next to the pods name, check the pods *ready* information

Access the application: click on Service button ...


<br />


# Clean-up

It is a good practice to clean up the cluster used for the tutorial, by removing every resource created on the cloud provider, to avoid unexpected cloud charges.

<br />

<Tabs>
<Tabs.TabPane tab="UI Workflow" key="ui-clean">

## UI Workflow

To remove all resources created in this tutorial, open the Palette Dashboard and, from the left **Main Menu** click on the **Cluster** panel to access the clusters page. Click on the cluster you want to delete to access its details page.

Click on **Settings**, at the top-right corner of the page, from the details page to expand the settings menu and select **Delete Cluster** to delete the cluster.

![Destroy-cluster](destroy-cluster.png)

You will be asked to type in the cluster name to confirm the delete action. Go ahead and type the cluster name to proceed with the delete step. Repeat this process for all the cluster you want to delete.

</Tabs.TabPane>

<Tabs.TabPane tab="Terraform" key="terraform-clean">

## Terraform

To destroy resources with Terraform, use the destroy command.

If you want to check the resources you will delete, you can first run: 
```terraform
terraform plan -destroy
```

Then delete the components running the destroy command:
```terraform
$ terraform destroy
```

</Tabs.TabPane>
</Tabs>

<br />


# Next Steps

In this tutorial, you learned about Palette’s Dev Engine and App Mode. You deployed two virtual clusters, each containing a different architecture and configuration of the Hello Universe application. Palette’s Dev Engine enables developers to quickly deploy applications into a Kubernetes environment without requiring Kubernetes knowledge. In a matter of minutes, you deployed a new Kubernetes cluster and all its applications without having to write Kubernetes configuration files. To learn more about Palette Dev Engine and its capabilities.
<br />

- [Palette Modes](/introduction/palette-modes)
- [App Profiles](/devx/app-profile)
- [App Services]()
- [Palette Virtual Clusters](/devx/palette-virtual-clusters) 
- [Hello Universe GitHub respository](https://github.com/spectrocloud/hello-universe)
