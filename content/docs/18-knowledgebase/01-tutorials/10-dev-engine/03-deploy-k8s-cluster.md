---
title: "Deploy a Kubernetes Cluster with Palette"
metaTitle: "Deploy a Kubernetes Cluster with Palette"
metaDescription: "Learn how to deploy an application on a Kubernetes cluster with Palette. Experience a streamlined approach to creating and managing multiple Kubernetes clusters, on different public cloud providers, through Palette's optimized process."
icon: ""
category: ["tutorial"]
hideToC: false
fullWidth: false
#hideToCSidebar: false
#hiddenFromNav: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Deploy a Kubernetes Cluster with Palette

Palette's purpose is to allow you to create and manage a Kubernetes cluster to the public cloud providers with minimal effort. Palette makes possible for software engineers, application developers, or system administrators that want to deploy a containerized application, to interact with Kubernetes clusters with ease.

The *Cluster Profile* component allows you to customize the cluster infrastructure stack you prefer in a reusable and repeatable way on the main cloud providers, while a *Cluster* uses the cluster profile, as well as the cloud configuration, cluster size and placement configuration to provision a cluster on your preferred cloud provider.

This tutorial will teach you how to deploy a cluster with Palette on Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP) either from Palette dashboard or with Terraform. You will learn about *Cluster Mode*, *Cluster Profiles*, *Clusters*, and understand how they enable you to deploy applications to Kubernetes quickly with minimal effort but with high degree of customization.

<br />
<br />

# Architecture 

In this tutorial the creation of a Kubernetes infrastructure is transparent for the user because, given the basic configuration information, Palette manages it completely. In fact, Palette will save you all the effort to create the overall infrastructure, allowing to deploy a production-ready infrastructure with few steps, and to deploy the application on top of it.

This is a simplified architecture overview that shows the infrastructure Palette creates for you into the cloud provider you prefer.

![Infrastructure architecture](/tutorials/deploy-clusters/architecture_infrastructure.png)

<br />

Palette also makes very easy to deploy an application on Kubernetes because it offer all the support to deploy the application from the yaml templates, with no needs to execute commands towards the cluster.

This is the application architecture you will deploy with this tutorial:

![Application architecture](/tutorials/deploy-clusters/architecture_application.png)

<br />
<br />

# Deploy the Cluster and the Application

<Tabs>
<Tabs.TabPane tab="UI Workflow" key="ui-cluster">


## UI Workflow

Palette supports to create and manage clusters directly from the dashboard, to provide an easy to use way to manage deploys to multiple cloud providers.

<br />


## Prerequisites

To complete this tutorial, you will need the following items

- A Spectro Cloud account. You can [sign up to Palette](https://console.spectrocloud.com/auth/signup) 
- Basic knowledge about containers
- Create a Cloud account ([AWS, Azure, GCP](#providers))
- Basic knowledge of the main public cloud platforms

In case you want to extend the experiments of this tutorial, exceeding the providers free tier threshold, you can request an authorization to the [Spectro Cloud Free Cloud Credit program](https://docs.spectrocloud.com/getting-started/palette-freemium#requestafreecloudaccount)

<br />


## Deploy the Environment

The following steps will guide you through deploying the cluster infrastructure. You will start with the definition of the cluster profile, then you will create the cluster and, finally, provision the cluster.

From the Palette user-interface, you will create the cluster and deploy the application. Each cluster will be hosted on a cloud service provider, such as AWS, Azure, GCP, and managed through Palette.

<div id="providers"></div>
<br />
<br />
<br />

<Tabs>
<Tabs.TabPane tab="AWS" key="aws-ui">

## Create AWS Account

Open the [AWS home page](https://aws.amazon.com) and follow the [page to create and activate a AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account).

When you create an account, we recommend creating another user to execute everyday tasks and give to that user sufficient rights to create the cluster, avoiding to use the root user credentials to perform it.

<br />


## Create Cluster Profile

[Cluster profiles](/cluster-profiles) are templates that are created with preconfigured core layers (Operating System, Kubernetes orchestrator, Network, Storage) with the possibility to add several available add-on layers, such as security, monitoring, logging, and so forth. 
Cluster profiles allows to create infrastructural stacks that can be customized in terms of number of layers, type of components, and version and offer a reproducible way to create clusters.

Start by log in to Palette and open the **Profiles** tab on the left panel. 
You can see the list of available default profiles. For now, we create our own profile, so click on **Add Cluster Profile** at the top right side.

Follow the procedure to create a new profile that is composed of the following steps.

In **Basic Information**, insert the name of the profile such as *aws-profile*, a brief  description of the profile, the type as *Full*, and tags as *aws*. You can leave version empty since the version defaults to 1.0.0.

**Cloud Type** allows you to choose the infrastructure provider this profile is associated to. Select *AWS*.

**Profile Layers** is the main configuration steps when you create a profile and you need to specify the packs that compose the profile. There are four required infrastructure packs and several optional add-on packs you can choose.
Every pack requires the *Pack Type*, *Registry*, *Pack Name*, *Chart version*, *Manifests* options that compose the *Pack Values* string.

The infrastructure packs and their *Pack Values* configuration used in this tutorial are the following:
- **Operating System (OS)** pack type -> *ubuntu-aws LTS__20.4.x*
- **Kubernetes** pack type -> *Kubernetes 1.21.x*
- **Network** pack type -> *cni-calico 3.24.x* (Calico)
- **Storage** pack type -> *csi-aws 1.0.x* (Container Storage Interface - CSI)

We also add, as add-on pack, a reverse proxy to access the web application you are going to deploy later.
Click on **Add New Pack**, choose **Authentication** as pack type and select the latest version of **Spectro Proxy** pack name with its default manifest.


The **Review** section gives an overview of the cluster profile configuration created.

![aws cluster profile overview page](/tutorials/deploy-clusters/aws/profile_review.png)

After the creation of a cluster profile, you can update it by adding, removing, or editing layers, in any moment.

<br />

## Verify the Cluster Profile

To check the profile creation on Palette, login to Palette dashboard and, from the left **Main Menu** click on the **Profiles** panel to access the profile page. At the top of the list you can find the newly created *aws-profile*.

Click on the profile to see the details of the stacks that compose the profile:
![AWS cluster profile details](/tutorials/deploy-clusters/aws/cluster_profile.png)

<br />

## Create a New Cluster

Select the **Cluster** tab on the Palette left panel to open the clusters overview.

From the clusters page, select **Add New Cluster**

![palette clusters overview page](/tutorials/deploy-clusters/new_cluster.png)

and **Deploy New Cluster** from the pop-up menu.

Choose the cloud provider at your choice, AWS in this case, and **Start AWS Configuration**

This starts the procedure to create the cluster on AWS, whose steps are the following.

<br />


### Basic information

In the **Basic information** section, insert the general information about the cluster, such as the Cluster name, Description, Tags, and Cloud account.

![palette clusters basic information](/tutorials/deploy-clusters/aws/clusters_basic_info.png)

<br />


### Cluster profile

From the **Cluster profile** section, select the profile you want to apply to the host cluster.

![palette cluster profiles](/tutorials/deploy-clusters/aws/clusters_cluster_profile.png)

On the right side there is a list of available and suitable profile you can choose to deploy on the selected cloud provider.

<br />


### Parameters

The **Parameters** section resumes the list of infrastructure layers and add-on components included in the cluster profile.

![palette clusters parameters](/tutorials/deploy-clusters/aws/clusters_parameters.png)

For each component, there is a manifest file with the deploy configurations.

The default manifest is already suitable for production since it already includes a working configuration and most of the hardening standards recommended for production environments.
Despite that, you can edit the default manifest, customizing the deploy configuration.

<br />


### Cluster config

The **Cluster config** section allows to select the *Region* where to deploy the cluster among the ones provided by the cloud providers and the *SSH Key Pair* to use.

![palette clusters basic information](/tutorials/deploy-clusters/aws/clusters_cluster_config.png)

To [create an SSH key pair on AWS](https://docs.aws.amazon.com/ground-station/latest/ug/create-ec2-ssh-key-pair.html) use the AWS dashboard
- open the [Amazon EC2 console](https://console.aws.amazon.com/ec2)
- in the navigation panel, under *Network & Security*, choose *Key Pairs*.
- choose *Create key pair* and enter the information required to create the key pair: a descriptive name for the key, the type of key pair, and the private key file format. Then, select *Create a key pair*.

![aws key pair creation](/tutorials/deploy-clusters/aws/key_pair_create.png)

To create a SSH Key on Palette, browse *Project Settings* on the left panel and select *SSH Keys* from the secondary panel.
Click on *Add New SSH Key* and insert the name of the key and the content of the public key from the cloud provider. Then confirm it.

![spectro cloud key pair creation](/tutorials/deploy-clusters/sp_ssh_key_create.png)

<br />


### Nodes config

The **Nodes config** section allows you to configure the nodes that make up the control plane (master nodes) and data plane (worker nodes) of the Kubernetes cluster. 


Before you proceed to next section, take the time to review the following parameters. <br /> <br />
- *Number of nodes in the pool* used to set the right amount of nodes that make up the pool of either the master or worker nodes. Set the count to one for the master pool and two for the worker pool.


- *Allow worker capability*. This option allows the master node also to accept workloads. This is useful when spot instances are used as worker nodes.  You can check this box if you want to.


- *Instance Type* select the compute type for the node pool. Each instance type displays the amount of CPU, RAM, and hourly cost of the instance. Select `m4.2xlarge`.


- *Availability zones* specify the availability zones the node pool can place nodes. Select one availability zone.


- *Instance Option* Choose between [on-demand instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html) and [spot instance](https://aws.amazon.com/ec2/spot/) as worder nodes.  Select **On Demand**.

![palette clusters basic information](/tutorials/deploy-clusters/aws/clusters_nodes_config.png)

Select **Next* to proceed with the cluster deployment.

<br />


### Settings

In the **Settings** section, you can configure advanced options such as when to patch the OS, enable security scans, manage backups, add role-based access control (RBAC), and more.

For this tutorial, you can use the default settings configuration. Click on **Validate** to continue. 

<br />


### Review

The **Review** section is an opportunity for you to review all the cluster configurations prior to deploying the cluster. Review all the settings and click on **Finish Configuration** to deploy the cluster.

![aws creation of a new cluster overview page](/tutorials/deploy-clusters/aws/clusters_review.png)


<br /> 

Navigate to the left **Main Menu** and select **Clusters**. 

![Update the cluster](/tutorials/deploy-clusters/aws/aws_create_cluster.png)

Click on your cluster to review details such as deployment status, event logs, cluster profile, monitoring data, and other information about the cluster.

<br />


</Tabs.TabPane>
<Tabs.TabPane tab="Azure" key="azure-ui">

## Create Azure Account

Open the [Azure home page](https://azure.microsoft.com/free) and follow the [page to create an Azure account](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account).

When you create an account, we recommend creating another user to execute everyday tasks and give to that user sufficient rights to create the cluster, avoiding to use the root user credentials to perform it.

<br />

When you login in Azure, you need to [create an application and assign a role to it](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret).

First, you need to [create a subscription](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/create-subscription) and to [create a resource group](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal). Then, to create the application, navigate to the *Azure Active Directory* section and select *App registrations* from the left-side menu. Click on *New registration* at the top of the page and add the application name and required parameters. Then, click on *Register* to create it.

To assign a role to the application, navigate to the *Subscriptions* page and, referring to your Subscription, select *Access control (IAM)*. 

![create a subscription](/tutorials/deploy-clusters/azure/azure_subscription.png)

Select *Add -> Add role assignment* and follow the next steps with the following information:
- **Assignment type** -> Select **Privileged administrator roles. Grant privileged administrator access, such as the ability to assign roles to other users.**
- **Role** -> Select **Contributor**
- **Members** -> Click on **Select Members** and select your application name to add it.

Finally, [generate an SSH Key](https://learn.microsoft.com/en-us/azure/virtual-machines/ssh-keys-portal) to add later on Palette.

<br />

## Create Cluster Profile

[Cluster profiles](https://docs.spectrocloud.com/cluster-profiles) are templates that are created with preconfigured core layers (Operating System, Kubernetes orchestrator, Network, Storage) with the possibility to add several available add-on layers, such as security, monitoring, logging, and so forth. 
Cluster profiles allows to create infrastructural stacks that can be customized in terms of number of layers, type of components, and version and offer a reproducible way to create clusters.

Start by log in to Palette and open the **Profiles** tab on the left panel. 
You can see the list of available default profiles. For now, we create our own profile, so click on **Add Cluster Profile** at the top right side.

Follow the procedure to create a new profile that is composed of the following steps.

In **Basic Information**, insert the name of the profile such as *azure-profile*, a brief  description of the profile, the type as *Full*, and tags as *azure*. You can leave version empty since the version defaults to 1.0.0.

**Cloud Type** allows you to choose the infrastructure provider this profile is associated to. Select *Azure*.

**Profile Layers** is the main configuration steps when you create a profile, and you need to specify the packs that compose the profile. There are four required infrastructure packs and several optional add-on packs you can choose.
Every pack requires the *Pack Type*, *Registry*, *Pack Name*, *Chart version*, *Manifests* options that compose the *Pack Values* string.

The infrastructure packs and their *Pack Values* configuration used in this tutorial are the following:
- **Operating System (OS)** pack type -> *ubuntu-azure LTS__20.4.x*
- **Kubernetes** pack type -> *Kubernetes 1.21.x*
- **Network** pack type -> *cni-calico-azure 3.24.x* (Calico)
- **Storage** pack type -> *csi-azure 1.20.x* (Container Storage Interface - CSI)

We also add, as add-on pack, a reverse proxy to access the web application you are going to deploy later.
Click on **Add New Pack**, choose **Authentication** as pack type and select the latest version of **Spectro Proxy** pack name with its default manifest.

The **Review** section gives an overview of the cluster profile configuration created.

![azure cluster profile overview page](/tutorials/deploy-clusters/azure/profile_review.png)

After the creation of a cluster profile, you can update it by adding, removing, or editing layers, in any moment.

<br />


## Verify the Cluster Profile

To check the profile creation on Palette, login to Palette dashboard and, from the left **Main Menu** click on the **Profiles** panel to access the profile page. At the top of the list you can find the *azure-profile*.

Click on the profile to see the details of the stacks that compose the profile:
![Azure cluster profile details](/tutorials/deploy-clusters/azure/cluster_profile.png)


## Create a New Cluster

Select the **Cluster** tab on the Palette left panel to open the clusters overview.

From the clusters page, select **Add New Cluster**

![palette clusters overview page](/tutorials/deploy-clusters/new_cluster.png)

and **Deploy New Cluster** from the pop-up menu.

Choose the cloud provider at your choice, Azure in this case, and **Start Azure Configuration**

This starts the procedure to create the cluster on Azure, whose steps are the following.

<br />


### Basic information

In the **Basic information** section, insert the general information about the cluster, such as the Cluster name, Description, Tags, and Cloud account.

![palette clusters basic information](/tutorials/deploy-clusters/azure/clusters_basic_info.png)

<br />


### Cluster profile
 
From the **Cluster profile** section, select the profile you want to deploy on Azure.

![palette clusters basic information](/tutorials/deploy-clusters/azure/clusters_cluster_profile.png)

On the right side there is a list of available and suitable profile you can choose to deploy on the selected cloud provider.

<br />


### Parameters

The **Parameters** section resumes the list of infrastructure layers and add-on components included in the cluster profile.

![palette clusters basic information](/tutorials/deploy-clusters/azure/clusters_parameters.png)

For each component, there is a manifest file with the deploy configurations.

The default manifest is already suitable for production since it already includes a working configuration and most of the hardening standards recommended for production environments.
Despite that, you can edit the default manifest, customizing the deploy configuration.

<br />


### Cluster config

The **Cluster config** section allows to select multiple parameters to deploy of the cluster.

![palette cluster configuration](/tutorials/deploy-clusters/azure/clusters_cluster_config.png)

For the scope of this tutorial we insert only the mandatory ones:
- the *Subscription* associated to your Azure account
- the *Region* where to deploy among the ones provided by the cloud provider
- the *Resource Group* 
- the Palette *SSH Key* to use.

To create a SSH Key on Palette, browse *Project Settings* on the left panel and select *SSH Keys* from the secondary panel.
Click on *Add New SSH Key* and insert the name of the key and the content of the public key from the cloud provider. Then confirm it.

![spectro cloud key pair creation](/tutorials/deploy-clusters/sp_ssh_key_create.png)

<br />


### Nodes config

The **Nodes config** section allows to configure the nodes that will compose the control plane (master nodes) and data plane (worker nodes) of the Kubernetes cluster.

You can find the list and the explanation of all the parameters in [Node Pool page](https://docs.spectrocloud.com/clusters/cluster-management/node-pool).

Among the multiple configuration you can set, be sure to consider:
- *Number of nodes in the pool* to set the right amount of nodes that compose the pool of either the master or worker nodes. For the tutorial we set 1 for the master pool and 2 for the worker pool
- *Allow worker capability* to allow the master node also to accept workloads.
- *Instance Type* to select the amount of resources each node must have. Each instance type shows the amount of CPU, RAM and the hourly cost of the instance.
- *Availability zones* to use within the Region selected in the *Cluster config* section.

![palette clusters nodes configuration](/tutorials/deploy-clusters/azure/clusters_nodes_config.png)

<br />


### Settings

In the **Settings** section you can select advanced configurations about the management of the instances, such as when to patch the OS, enable security scans, manage backups, add role-based access control (RBAC), or enable virtual clusters.

For the purpose of this tutorial, you can use the default settings configuration.

<br />


### Review

The **Review** section resumes the cluster configuration as you have configured it in the previous steps.

![azure creation of a new cluster overview page](/tutorials/deploy-clusters/azure/clusters_review.png)

Take a look of the overall setup and press *Finish Configuration* to deploy it.

<br />

Now select the **Clusters** page from the left panel and check the created cluster.

![Update the cluster](/tutorials/deploy-clusters/azure/azure_create_cluster.png)

Click on the cluster to see the details, such as status, pack layers, monitoring data, and many other information.

<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Google Cloud" key="gcp-ui">

## Create GCP Account

Open to [GCP home page](https://cloud.google.com) and follow the [page to create an GCP account](https://cloud.google.com/docs/get-started).

When you create an account, we recommend creating another user to execute everyday tasks and give to that user sufficient rights to create the cluster, avoiding to use the root user credentials to perform it.

When you login in GCP, you need to [create a project](https://cloud.google.com/resource-manager/docs/creating-managing-projects). To do that navigate to the *IAM & Admin* section and select *manage Resources* to enter into the page to manage the project, the folder and the organization. From there you can crate a folder, create or edit a project, and assign a project to an organization.

In order to allow Palette to manage the cloud resource for you, you need to grant the access to the two management API: **Cloud Resource Manager API** and **Compute Engine API**.

To enable *Cloud Resource Manager API*, enter in *APIs & Services* section, select *Enable APIs & Services* from the panel on the left, and click on *+ Enable APIs and Services* on the top of the page. 
Search for *Cloud Resource Manager API*, enter into the product details and enable it. 

![gcp how to enable cloud resource manager api](/tutorials/deploy-clusters/gcp/cloud_resource_manager_api.png)

To enable *Compute Engine API*, enter in *APIs & Services* section, select *Enable APIs & Services* from the panel on the left, and click on *+ Enable APIs and Services* on the top of the page. 
Search for *Compute Engine API*, enter into the product details and enable it. 

![gcp how to enable compute engine api](/tutorials/deploy-clusters/gcp/computer_engine_api.png)

<br />

## Create Cluster Profile

[Cluster profiles](https://docs.spectrocloud.com/gcp/cluster-profiles) are templates that are created with preconfigured core layers (Operating System, Kubernetes orchestrator, Network, Storage) with the possibility to add several available add-on layers, such as security, monitoring, logging, and so forth. Cluster profiles allows to create infrastructural stacks that can be customized in terms of number of layers, type of components, and version and offer a reproducible way to create clusters.

Start by log in to Palette and open the **Profiles** tab on the left panel. 
You can see the list of available default profiles. For now, we create our own profile, so click on **Add Cluster Profile** at the top right side.

Follow the procedure to create a new profile that is composed of the following steps.

In **Basic Information**, insert the name of the profile such as *azure-profile*, a brief  description of the profile, the type as *Full*, and tags as *azure*. You can leave version empty since the version defaults to 1.0.0.

**Cloud Type** allows you to choose the infrastructure provider this profile is associated to. Select *Azure*.

**Profile Layers** is the main configuration steps when you create a profile, and you need to specify the packs that compose the profile. There are four required infrastructure packs and several optional add-on packs you can choose.
Every pack requires the *Pack Type*, *Registry*, *Pack Name*, *Chart version*, *Manifests* options that compose the *Pack Values* string.

The infrastructure packs and their *Pack Values* configuration used in this tutorial are the following:
- **Operating System (OS)** pack type -> *ubuntu-gcp LTS__20.4.x*
- **Kubernetes** pack type -> *Kubernetes 1.21.x*
- **Network** pack type -> *cni-calico 3.24.x* (Calico)
- **Storage** pack type -> *csi-gcp-driver 1.7.x* (Container Storage Interface - CSI)

We also add, as add-on pack, a reverse proxy to access the web application you are going to deploy later.
Click on **Add New Pack**, choose **Authentication** as pack type and select the latest version of **Spectro Proxy** pack name with its default manifest.

The **Review** section gives an overview of the cluster profile configuration created.

![gcp cluster profile overview page](/tutorials/deploy-clusters/gcp/profile_review.png)

After the creation of a cluster profile, you can update it by adding, removing, or editing layers, in any moment.

<br />


## Verify the Cluster Profile

To check the profile creation on Palette, login to Palette dashboard and, from the left **Main Menu** click on the **Profiles** panel to access the profile page. At the top of the list you can find the *gcp-profile*.

Click on the profile to see the details of the stacks that compose the profile:
![GCP cluster profile details](/tutorials/deploy-clusters/gcp/cluster_profile.png)

<br />


## Create a New Cluster

Select the **Cluster** tab on the Palette left panel to open the clusters overview.

From the clusters page, select **Add New Cluster**

![palette clusters overview page](/tutorials/deploy-clusters/new_cluster.png)

and **Deploy New Cluster** from the pop-up menu.

Choose the cloud provider at your choice, GCP in this case, and **Start Google Cloud Configuration**

This starts the procedure to create the cluster on GCP, whose steps are the following.

<br />


### Basic information

In the **Basic information** section, insert the general information about the cluster, such as the Cluster name, Description, Tags, and Cloud account.

![palette clusters basic information](/tutorials/deploy-clusters/gcp/clusters_basic_info.png)

<br />


### Cluster profile

From the **Cluster profile** section, select the profile you want to deploy on GCP.

![palette clusters basic information](/tutorials/deploy-clusters/gcp/clusters_cluster_profile.png)

On the right side there is a list of available and suitable profile you can choose to deploy on the selected cloud provider.

<br />


### Parameters

The **Parameters** section resumes the list of infrastructure layers and add-on components included in the cluster profile.

![palette clusters basic information](/tutorials/deploy-clusters/gcp/clusters_parameters.png)

For each component, there is a manifest file with the deploy configurations.

The default manifest is already suitable for production since it already includes a working configuration and most of the hardening standards recommended for production environments.
Despite that, you can edit the default manifest, customizing the deploy configuration.

<br />


### Cluster config

The **Cluster config** section allows to select the *Region* where to deploy the cluster among the ones provided by the cloud providers and the *SSH Key Pair* to use.

![palette cluster configuration](/tutorials/deploy-clusters/gcp/clusters_cluster_config.png)

Create an SSH key pair and add to the GCP account.
Open the [GCP Compute Engine console](https://console.cloud.google.com/compute/instances) and, in the navigation panel, under *Setting*, choose *Metadata*. Open the *SSH Keys* tab and click on *Add SSH Key*.

Refer to the [create SSH keys guide](https://cloud.google.com/compute/docs/connect/create-ssh-keys) to create the ssh key on your local machine. Then, copy the full value of your public key and paste it on GCP.

![gcp key pair creation](/tutorials/deploy-clusters/gcp/gcp_ssh_key_create.png)

To create a SSH Key on Palette, browse *Project Settings* on the left panel and select *SSH Keys* from the secondary panel.
Click on *Add New SSH Key* and insert the name of the key and the content of the public key from the cloud provider. Then confirm it.

![spectro cloud key pair creation](/tutorials/deploy-clusters/sp_ssh_key_create.png)

<br />


### Nodes config

The **Nodes config** section allows to configure the nodes that will compose the control plane (master nodes) and data plane (worker nodes) of the Kubernetes cluster.

You can find the list and the explanation of all the parameters in [Node Pool page](https://docs.spectrocloud.com/clusters/cluster-management/node-pool).

Among the multiple configuration you can set, be sure to consider:
- *Number of nodes in the pool* to set the right amount of nodes that compose the pool of either the master or worker nodes. For the tutorial we set 1 for the master pool and 2 for the worker pool
- *Allow worker capability* to allow the master node also to accept workloads.
- *Instance Type* to select the amount of resources each node must have. Each instance type shows the amount of CPU, RAM and the hourly cost of the instance.
- *Availability zones* to use within the Region selected in the *Cluster config* section.

![palette clusters nodes configuration](/tutorials/deploy-clusters/gcp/clusters_nodes_config.png)

<br />


### Settings

In the **Settings** section you can select advanced configurations about the management of the instances, such as when to patch the OS, enable security scans, manage backups, add role-based access control (RBAC), or enable virtual clusters.

For the purpose of this tutorial, you can use the default settings configuration.

<br />


### Review

The **Review** section resumes the cluster configuration as you have configured it in the previous steps.

![gcp creation of a new cluster overview page](/tutorials/deploy-clusters/gcp/clusters_review.png)

Take a look of the overall setup and press *Finish Configuration* to deploy it.

<br />

Now select the **Clusters** page from the left panel and check the created cluster.

![Update the cluster](/tutorials/deploy-clusters/gcp/gcp_create_cluster.png)

Click on the cluster to see the details, such as status, pack layers, monitoring data, and many other information.

<br />

</Tabs.TabPane>
</Tabs>

## Deploy the Application

The following steps will guide you through deploying an application to your host cluster. You begin by modifying the cluster profile you created earlier and adding a custom manifest to the cluster profile. 

<br />



### Add the Manifest

Navigate to the left **Main Menu** and select *Profiles*. Select the cluster profile you created earlier and applied to the host cluster.

Select *Add Manifest* at the top of the page and insert the provide the fill out the following input fields. <br /> <br />

- *Layer name*: name of the layer to add to the profile stack.
- *Manifests*: add your manifest by giving it a name and clicking the blue circle button. An empty editor will appear on the right side of the screen.

![manifest](/tutorials/deploy-clusters/manifest.png)

<br />


### Customize the Manifest

In the manifest editor, provide the following content.

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

The code snippet will deploy the [*hello-universe*](https://github.com/spectrocloud/hello-universe) demo application.

The manifest defined two replicas for the application to simulate a distributed environment with a redundant web application deployed to Kubernetes. In front of them, a load balancer service is defined to route requests to both containers. By using a load balancer, you can expose a single access point and distribute the workload to both containers.

For more information about the service LoadBalancer component you can refer to the [Kubernetes official documentation](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer).


<br />


### Deploy

From the left **Main Menu** select the **Clusters**.  Click on the host cluster you deployed to open the details page.

![Cluster details with available updates](/tutorials/deploy-clusters/deploy_app/app_update_available.png)

<br />

On the top right-hand corner is a green button **Updates Available**. Click on the button to review the available updates. Compare the new changes against the previous cluster profile definition. The only change is the addition of a manifest that will deploy the Hello Universe application.


![Available updates details](/tutorials/deploy-clusters/deploy_app/updates_available_details.png)

Click on **Confirm updates** to apply the updates to the host cluster.

<br />


# Verify the Application

From the cluster details page, click on **Workloads** at the top of the page:

![Workloads](/tutorials/deploy-clusters/workloads.png)

The tab opens an overview of the Kubernetes components. From there, you can check if the application components have been created successfully.

Select the **Namespaces** tab and check for a namespace called *cluster-xxxxxx*.

Select the **Deployments** tab and check the existence of a deployment with name *hello-universe-deployment*. In the **Deployments** tab you can verify the status of the deployment: next to the deployment name, check the number of Pods ready and the number of replicas to know if the application is fully deployed.

Select the **Pods** tab and check for two pods with name *hello-universe-deployment-xxxxxx*. In the **Pods** tab, next to the pods names, check the status of the pods

![Pods status](/tutorials/deploy-clusters/deploy_app/app_update_pods.png)

Remember to update the list of components by clicking the *sync* button at top right corner to refresh and synchronize the current state of the Kubernetes components.

<br />

After a few moments, the application is now ready to accept user traffic. From the **Overview**  page, click on the URL for port  **:8080** next to the *hello-universe-service* in the **Services** row. 

![Deployed application](/tutorials/deploy-clusters/app.png)

<br />


# Cleanup

Use the following steps to clean up all the resources you created for the tutorial.

<br />

To remove the cluster you created in this tutorial, open the Palette dashboard and, from the left **Main Menu**, click on **Clusters** to access the clusters page. Select the cluster you want to delete to access its details page.

Click on **Settings**, at the top-right corner of the page, from the details page to expand the **settings Menu** and select **Delete Cluster** to delete the cluster.

![Destroy-cluster](/tutorials/deploy-clusters/delete-cluster-button.png)

You will be asked to type in the cluster name to confirm the delete action. Continue and type in the cluster name to proceed with the delete step. 

<br />

<InfoBox>

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for Force Delete. To trigger a force delete, navigate to the respective cluster’s details page and click on Settings. Click on the Force Delete Cluster to delete the cluster. Palette will automatically remove clusters stuck in the cluster deletion phase for over 24 hours.

</InfoBox>


<br />

To verify the execution of the deletion, open the Palette Dashboard and, from the left **Main Menu** click on the **Cluster** panel to access the clusters page. From there, you can see the cluster is deleting

![Deleting cluster](/tutorials/deploy-clusters/deleting_cluster.png)

<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Terraform" key="terraform-cluster">


##  Terraform

The [Spectro Cloud Terraform](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) provider enables you to create and manage Palette resources in a codified manner by leveraging Infrastructure as Code (IaC). There are many reasons why you would want to utilize IaC. A few reasons worth highlighting are: the ability to automate infrastructure, improve collaboration related to infrastructure changes, self-document infrastructure through codification, and track all infrastructure in a single source of truth. 

If you need to become more familiar with Terraform, check out the [Terraform explanation from HashiCorp](https://developer.hashicorp.com/terraform/intro). 

<br />

## Prerequisites

To complete this tutorial, you will need the following items

- A Spectro Cloud account.

- Basic knowledge of containers.

- Terraform v1.3.6 or greater.


<br />

## Create Provider Account

<Tabs>
<Tabs.TabPane tab="AWS" key="terraform-aws-account">

Open the [AWS home page](https://aws.amazon.com) and follow the [page to create and activate a AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account).

When you create an account, we recommend creating another user to execute everyday tasks and give to that user sufficient rights to create the cluster, avoiding to use the root user credentials to perform it.

</Tabs.TabPane>
<Tabs.TabPane tab="Azure" key="terraform-azure-account">

Open the [Azure home page](https://azure.microsoft.com/free) and follow the [page to create an Azure account](https://learn.microsoft.com/en-us/training/modules/create-an-azure-account).

When you create an account, we recommend creating another user to execute everyday tasks and give to that user sufficient rights to create the cluster, avoiding to use the root user credentials to perform it.

<br />

When you login in Azure, you need to [create an application and assign a role to it](https://learn.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-a-new-application-secret).

First, you need to [create a subscription](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/create-subscription) and to [create a resource group](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/manage-resource-groups-portal). Then, to create the application, navigate to the *Azure Active Directory* section and select *App registrations* from the left-side menu. Click on *New registration* at the top of the page and add the application name and required parameters. Then, click on *Register* to create it.

To assign a role to the application, navigate to the *Subscriptions* page and, referring to your Subscription, select *Access control (IAM)*. 

![create a subscription](/tutorials/deploy-clusters/azure/azure_subscription.png)

Select *Add -> Add role assignment* and follow the next steps with the following information:
- **Assignment type** -> Select **Privileged administrator roles. Grant privileged administrator access, such as the ability to assign roles to other users.**
- **Role** -> Select **Contributor**
- **Members** -> Click on **Select Members** and select your application name to add it.

Finally, [generate an SSH Key](https://learn.microsoft.com/en-us/azure/virtual-machines/ssh-keys-portal) to add later on Palette.

<br />

</Tabs.TabPane>
<Tabs.TabPane tab="Google Cloud" key="terraform-gcp-account">

Open to [GCP home page](https://cloud.google.com) and follow the [page to create an GCP account](https://cloud.google.com/docs/get-started).

When you create an account, we recommend creating another user to execute everyday tasks and give to that user sufficient rights to create the cluster, avoiding to use the root user credentials to perform it.

When you login in GCP, you need to [create a project](https://cloud.google.com/resource-manager/docs/creating-managing-projects). To do that navigate to the *IAM & Admin* section and select *manage Resources* to enter into the page to manage the project, the folder and the organization. From there you can crate a folder, create or edit a project, and assign a project to an organization.

In order to allow Palette to manage the cloud resource for you, you need to grant the access to the two management API: **Cloud Resource Manager API** and **Compute Engine API**.

To enable *Cloud Resource Manager API*, enter in *APIs & Services* section, select *Enable APIs & Services* from the panel on the left, and click on *+ Enable APIs and Services* on the top of the page. 
Search for *Cloud Resource Manager API*, enter into the product details and enable it. 

![gcp how to enable cloud resource manager api](/tutorials/deploy-clusters/gcp/cloud_resource_manager_api.png)

To enable *Compute Engine API*, enter in *APIs & Services* section, select *Enable APIs & Services* from the panel on the left, and click on *+ Enable APIs and Services* on the top of the page. 
Search for *Compute Engine API*, enter into the product details and enable it. 

![gcp how to enable compute engine api](/tutorials/deploy-clusters/gcp/computer_engine_api.png)

<br /> 

</Tabs.TabPane>
</Tabs>


<br />

## Deploy the Environment

The following steps will guide you through deploying the cluster infrastructure. You will start by creating the cluster profile, then deploy a cluster that uses your cluster profile. 


<br />

## Configure the Cluster Profile

Create a folder where you will put all the Terraform configuration files.

<br />
```bash
mkdir terraform-profile && cd terraform-profile
```


### Providers

Create the file **provider.tf** and insert the following content.

<br />

```terraform
terraform {
  required_providers {
    spectrocloud = {
      version = "= 0.11.1"
      source  = "spectrocloud/spectrocloud"
    }
  }
}
provider "spectrocloud" {
  project_name = "Default"
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
spectrocloud_api_key = "j54xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

To find the value of the *spectrocloud_api_key*, open the Palette dashboard and, from the left **Main Menu** click on the **Tenant Settings** panel and select **API Keys**.

<br />

### Data
The data file contains all of our data query resources. You will use the data resources to query the information about available Packs. These packs make up the core layers of the cluster profile you will create.

Create the file data.tf and insert:

<br />

<Tabs>
<Tabs.TabPane tab="AWS" key="aws-tf-profile">

```terraform
data "spectrocloud_pack" "csi" {
  name    = "csi-aws"
  version = "1.0.0"
}
data "spectrocloud_pack" "cni" {
  name    = "cni-calico"
  version = "3.24.5"
}
data "spectrocloud_pack" "k8s" {
  name    = "kubernetes"
  version = "1.21.14"
}
data "spectrocloud_pack" "ubuntu" {
  name    = "ubuntu-aws"
  version = "20.04"
}
data "spectrocloud_pack" "proxy" {
  name = "spectro-proxy"
  version  = "1.2.0"
}
```
</Tabs.TabPane>
<Tabs.TabPane tab="Azure" key="azure-tf-profile">

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

</Tabs.TabPane>
<Tabs.TabPane tab="Google Cloud" key="gcp-tf-profile">

```terraform
data "spectrocloud_pack" "csi" {
  name    = "csi-gcp-driver"
  version = "1.7.1"
}
data "spectrocloud_pack" "cni" {
  name    = "cni-calico"
  version = "3.24.5"
}
data "spectrocloud_pack" "k8s" {
  name    = "kubernetes"
  version = "1.24.10"
}
data "spectrocloud_pack" "ubuntu" {
  name    = "ubuntu-gcp"
  version = "20.04"
}
data "spectrocloud_pack" "proxy" {
  name    = "spectro-proxy"
  version = "1.2.0"
}
```

</Tabs.TabPane>
</Tabs>

<br />


### Cluster Profile

The ** cluster_profile** file contains all the packs that comprise the profile. Go ahead and copy the following content into the file.

<br />

Create the file *cluster_profile.tf* and insert:

```terraform
resource "spectrocloud_cluster_profile" "profile" {
  name  = "tf-profile"
  tags  = ["tutorial"]
  cloud = <specify the provider (aws, azure, gcp)>
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

Use the following Terraform commands to create the resources you defined in the previous files in Palette. 

<br />

```bash
cd terraform-profile
```

Initialize the working directory that contains the Terraform configuration files.
```bash
terraform init
```

Validate the Terraform files.
```bash
terraform validate 
```

You can preview the actions Terraform will take by using the `plan` command.
```bash
terraform plan
```

Use the `apply` command to deploy the resources to your target environment.
```bash
terraform apply --auto-approve
```
<br />


## Verify the Profile

<Tabs>
<Tabs.TabPane tab="AWS" key="aws-validation-p">

To check the profile creation on Palette, login to Palette dashboard and, from the left **Main Menu** click on the **Profiles** panel to access the profile page. At the top of the list you can find the *tf-aws-profile*:

![Terraform AWS profile](/tutorials/deploy-clusters/terraform/tf_aws_profile.png)

<br />

Click on the profile to see the details of the stacks that compose the profile:

![Terraform AWS profile details](/tutorials/deploy-clusters/terraform/tf_aws_profile_details.png)

</Tabs.TabPane>
<Tabs.TabPane tab="Azure" key="azure-validation-p">

To check the profile creation on Palette, login to Palette dashboard and, from the left **Main Menu** click on the **Profiles** panel to access the profile page. At the top of the list you can find the *tf-azure-profile*:

![Terraform Azure profile](/tutorials/deploy-clusters/terraform/tf_azure_profile.png)

<br />

Click on the profile to see the details of the stacks that compose the profile:

![Terraform Azure profile details](/tutorials/deploy-clusters/terraform/tf_azure_profile_details.png)

</Tabs.TabPane>
<Tabs.TabPane tab="Google Cloud" key="gcp-validation-p">

To check the profile creation in Palette, login to the Palette dashboard and, from the left **Main Menu** click on the **Profiles** panel to access the profile page. At the top of the list you can find the *tf-gcp-profile*.

![Terraform GCP profile](/tutorials/deploy-clusters/terraform/tf_gcp_profile.png)

<br />

Click on the profile to review the details of the stacks that compose the profile.

![Terraform GCP profile details](/tutorials/deploy-clusters/terraform/tf_gcp_profile_details.png)

</Tabs.TabPane>
</Tabs>

<br />

## Configure the Cluster


<Tabs>
<Tabs.TabPane tab="AWS" key="aws-tf-cluster">

Create a folder where you will put all the Terraform configuration files:
```bash
$ mkdir terraform-cluster
$ cd terraform-cluster
```

### Variables

Create a file named **variables.tf** and insert the following variables.

```terraform
variable "spectrocloud_api_key" {}
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

Next, create a file named *terraform.tfvars* and add the following content.

```terraform
spectrocloud_api_key    = "j54xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
aws_ssh_key_name        = "aws-key"
aws-cloud-account-name  = "82xxxxxxxxxx"
cluster_profile         = "tf-profile"
region                  = "us-east-1"
master_nodes = {
    count           = "1"
    instance_type   = "m5.large"
    disk_size_gb    = "60"
    availability_zones = ["us-east-1a"]
}
worker_nodes = {
    count           = "2"
    instance_type   = "m5.large"
    disk_size_gb    = "60"
    availability_zones = ["us-east-1a"]
}
```
<br />

### Cluster Resources

Create the **cluster.tf** file and insert the cluster resources definition.

<br />

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
    name                    = "worker-basic"
    count                   = var.worker_nodes.count
    instance_type           = var.worker_nodes.instance_type
    disk_size_gb            = var.worker_nodes.disk_size_gb
    azs                     = var.worker_nodes.availability_zones
  }
}
```

</Tabs.TabPane>
<Tabs.TabPane tab="Azure" key="azure-tf-cluster">

Create a folder where you will put all the Terraform configuration files:
```bash
$ mkdir terraform-cluster
$ cd terraform-cluster
```

### Variables

Create the file *variables.tf* and insert the list of variables:

```terraform
spectrocloud_api_key     = "j54xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
azure-cloud-account-name = "azure-palette"
subscription_id          = "03axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
resource_group           = "palette_rg"
cluster_profile          = "tf-profile"
region                   = "eastus"
cluster_ssh_public_key   = "key"
master_nodes = {
    count                = "1"
    instance_type        = "Standard_A2_v2"
    disk_size_gb         = "60"
    availability_zones   = []
    is_system_node_pool  = false
}
worker_nodes = {
    count                = "2"
    instance_type        = "Standard_A2_v2"
    disk_size_gb         = "60"
    availability_zones   = []
    is_system_node_pool  = false
}
```

<br />

Then, create also the file terraform.tfvars and append the content of the variables:

```terraform
variable "spectrocloud_api_key" {}
variable "subscription_id" {}
variable "resource_group" {}
variable "region" {}
variable "cluster_ssh_public_key" {}
variable "cluster_profile" {}

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
<br />

### Cluster Resources
Create the cluster.tf file and insert the cluster resources definition:

```terraform
data "spectrocloud_cloudaccount_azure" "account" {
  name = var.azure-cloud-account-name
}
data "spectrocloud_cluster_profile" "profile" {
  name = var.cluster_profile
}
resource "spectrocloud_cluster_azure" "cluster" {
  name             = "azure-cluster"
  tags             = ["ms-azure", "tutorial"]
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


</Tabs.TabPane>
<Tabs.TabPane tab="Google Cloud" key="gcp-tf-cluster">

Create a folder where you will put all the Terraform configuration files:
```bash
$ mkdir terraform-cluster
$ cd terraform-cluster
```

### Variables

Create the file *variables.tf* and insert the list of variables:

```terraform
spectrocloud_api_key    = "j54AsdjnSP2YU9jJF1K5dVYeURWzO4qd"
cluster_profile         = "tf-gcp-profile"
region                  = "us-east1"
gcp-cloud-account-name  = "myproject-379610"
master_nodes = {
    count            = "1"
    instance_type    = "n1-standard-2"
    disk_size_gb     = "60"
    availability_zones = ["us-east1-b"]
}
worker_nodes = {
    count            = "2"
    instance_type    = "n1-standard-2"
    disk_size_gb     = "60"
    availability_zones = ["us-east1-b"]
}
```

<br />

Then, create also the file terraform.tfvars and append the content of the variables:

```terraform
variable "spectrocloud_api_key" {}
variable "cluster_profile" {}
variable "region" {}
variable "gcp-cloud-account-name" {
    type = string
    description = "The name of your GCP account as assigned in Palette"
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
<br />

### Cluster Resources
Create the cluster.tf file and insert the cluster resources definition:

```terraform
data "spectrocloud_cloudaccount_gcp" "account" {
  name = var.gcp-cloud-account-name
}
data "spectrocloud_cluster_profile" "profile" {
  name = var.cluster_profile
}
resource "spectrocloud_cluster_gcp" "cluster" {
  name             = "gcp-cluster"
  tags             = ["gcp", "tutorial"]
  cloud_account_id = data.spectrocloud_cloudaccount_gcp.account.id
  cloud_config {
    project = "Default"
    region  = var.region
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

</Tabs.TabPane>
</Tabs>

<br />


## Create the Cluster

To create the cluster on the cloud provider use the Terraform commands to apply the information present in the configuration files.

Open the terminal and enter into the folder where you have the Terraform configuration files

```bash
$ cd terraform-cluster
```

Initialize the working directory having Terraform configuration files
```bash
terraform init
```

Validate the configuration files in the directory
```bash
terraform validate 
```

Create the execution plan with the preview changes your configuration will create on the infrastructure
```bash
terraform plan
```

Finally, apply the modifications there are in the plan to execute them and create the infrastructure
```bash
terraform apply
```
<br />


## Verify the Cluster

<Tabs>
<Tabs.TabPane tab="AWS" key="aws-validation">

To check the cluster creation, login to the Palette dashboard, and from the left **Main Menu** click on the **Clusters**.

![Update the cluster](/tutorials/deploy-clusters/aws/aws_create_cluster.png)

<br />

Select your cluster to review its details page which contains the status, cluster profile, and more.


</Tabs.TabPane>
<Tabs.TabPane tab="Azure" key="azure-validation">

To check the cluster creation, login to Palette dashboard and, from the left **Main Menu** click on the **Clusters** panel from the left panel and check the created cluster. At the top of the list you can find the *azure-cluster*:

![Update the cluster](/tutorials/deploy-clusters/azure/azure_create_cluster.png)

<br />

Click on the cluster to see the details, such as status, pack layers, monitoring data, and many other information.

![Update the cluster details](/tutorials/deploy-clusters/azure/azure_create_cluster_details.png)

</Tabs.TabPane>
<Tabs.TabPane tab="Google Cloud" key="gcp-validation">

To check the cluster creation, login to Palette dashboard and, from the left **Main Menu** click on the **Clusters** panel from the left panel and check the created cluster. At the top of the list you can find the *gcp-cluster*:

![Update the cluster](/tutorials/deploy-clusters/gcp/gcp_create_cluster.png)

<br />

Click on the cluster to see the details, such as status, pack layers, monitoring data, and many other information.

</Tabs.TabPane>
</Tabs>

<br />

Since the cluster may take several minutes to create, in relation to the packs to install, the type of instances selected, and so forth, it might be useful to check the creation events from the **Events** tab at the top of the page

![Update the cluster](/tutorials/deploy-clusters/cluster_create_events.png)

<br />
<br />

## Deploy the Application

The following steps will guide you through deploying an application to your host cluster. You begin by modifying the cluster profile you created earlier and adding a custom manifest to the cluster profile. 

<br />


### Add the Manifest

Open the folder where you have the profile configuration
```bash
$ cd terraform-profile
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

So, first, check the validation of the configuration files:
```bash
$ terraform validate
```

Create the execution plan with the additional modifications to the already existant configuration:
```bash
$ terraform plan
```

Finally, apply the modifications there are in the plan to execute them and create the infrastructure:
```bash
$ terraform apply
```


<br />


### Deploy

From the left **Main Menu** select the **Clusters**.  Click on the host cluster you deployed to open the details page.

![Cluster details with available updates](/tutorials/deploy-clusters/deploy_app/app_update_available.png)

<br />

On the top right-hand corner is a green button **Updates Available**. Click on the button to review the available updates. Compare the new changes against the previous cluster profile definition. The only change is the addition of a manifest that will deploy the Hello Universe application.


![Available updates details](/tutorials/deploy-clusters/deploy_app/updates_available_details.png)

Click on **Confirm updates** to apply the updates to the host cluster.

<br />

# Verify the Application

From the cluster details page, click on **Workloads** at the top of the page:

![Workloads](/tutorials/deploy-clusters/workloads.png)

The tab opens an overview of the Kubernetes components. From there, you can check if the application components have been created successfully.

Select the **Namespaces** tab and check for a namespace called *cluster-xxxxxx*.

Select the **Deployments** tab and check the existence of a deployment with name *hello-universe-deployment*. In the **Deployments** tab you can verify the status of the deployment: next to the deployment name, check the number of Pods ready and the number of replicas to know if the application is fully deployed.

Select the **Pods** tab and check for two pods with name *hello-universe-deployment-xxxxxx*. In the **Pods** tab, next to the pods names, check the status of the pods

![Pods status](/tutorials/deploy-clusters/deploy_app/app_update_pods.png)

Remember to update the list of components by clicking the *sync* button at top right corner to refresh and synchronize the current state of the Kubernetes components.

<br />

After a few moments, the application is now ready to accept user traffic. From the **Overview**  page, click on the URL for port  **:8080** next to the *hello-universe-service* in the **Services** row. 

![Deployed application](/tutorials/deploy-clusters/app.png)

<br />


# Cleanup

Use the following steps to clean up all the resources you created for the tutorial.

<br />


Use the destroy command to remove all the resources you created through Terraform.

First enter into the folder where you have the Terraform configuration for the cluster
```bash
$ cd terraform-cluster
```

If you want to check the resources you will delete, you can first execute: 
```terraform
terraform plan -destroy
```

Then delete the components by running the destroy command:
```terraform
terraform destroy --auto-approve
```

The deletion process will take a few minutes. 

<br />

To verify the execution of the deletion, open the Palette Dashboard and, from the left **Main Menu** click on the **Cluster** panel to access the clusters page. From there, you can see the cluster is deleting

![Deleting cluster](/tutorials/deploy-clusters/deleting_cluster.png)

<br />

</Tabs.TabPane>
</Tabs>

<br />


# Wrap-up

In this tutorial, you created a cluster profile, which is a template containing the core layers required to deploy a cluster. You then deployed a host cluster onto your preferred cloud service provider. Once the cluster deployed, you updated the cluster profile and added the application Hello Universe to the profile definition, and applied the updates to the host cluster. 

Palette assures consistency across workload cluster deployments and enables developers to quickly deploy applications into a Kubernetes environment with little or no prior Kubernetes knowledge. In a matter of minutes, you were able to provision a new Kubernetes cluster and deploy an application.

We encourage you the check out the [Deploy an Application using Palette Dev Engine](/devx/apps/deploy-app) tutorial to learn more about Palette and how the Palette Dev Engine can help you deploy applications more quickly. 

- [Palette Modes](/introduction/palette-modes)


- [Cluster Profiles](/devx/cluster_profile)


- [Palette Clusters](/devx/clusters) 


- [Hello Universe GitHub repository](https://github.com/spectrocloud/hello-universe)
