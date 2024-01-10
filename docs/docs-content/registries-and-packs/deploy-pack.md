---
sidebar_label: 'Deploy a Custom Pack'
title: 'Deploy a Custom Pack'
description: 'How to create and deploy a custom pack using the manifest files or Helm charts in Spectro Cloud.'
icon: ''
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 2
sidebar_position: 40
tags: ["packs", "tutorial"]
---


Custom add-on packs allow you to deploy Kubernetes applications in clusters and reuse them in multiple deployments. This ensures uniformity across your clusters. The primary use cases for creating custom packs are:

- Aggregated configuration and application dependencies simplify deployment and consumption.

- Open-source contributors can add new Kubernetes applications to a custom add-on pack for the community.

- Enterprises can add proprietary Kubernetes applications to a custom add-on pack.

In this tutorial, you will create a custom add-on pack to package a sample Kubernetes application, [Hello Universe](https://github.com/spectrocloud/hello-universe#hello-universe), and deploy that application to a cluster. You will learn to create the pack in two ways, using manifest files and Helm charts. 

After defining the custom pack, you will set up a registry server, publish the pack to that registry, and configure the registry server in Palette. Lastly, you will create a cluster profile that contains your custom pack and apply the profile to a cluster using either Palette or Terraform.  


## Prerequisites
To complete the tutorial, you will need the following items:
<br />

1. A Spectro Cloud account. Visit [https://console.spectrocloud.com](https://console.spectrocloud.com) to create an account.


2. Tenant admin access to Palette for the purpose of adding a new registry server.


3. A cloud account, such as AWS, Azure, or GCP, added to your Palette project settings. 


4. An SSH key created in the region where you will deploy the cluster.


5. [Docker Desktop](https://docs.docker.com/get-docker/) installed on your local machine to start the tutorials container. 


6. Basic knowledge of Docker containers and Kubernetes manifest file attributes.




## Set Up the Tutorial Environment

You will work in a Docker container pre-configured with the necessary tools for this tutorial. However, you can practice this tutorial in any `linux/amd64` or `x86_64` environment by installing the [necessary tools](https://github.com/spectrocloud/tutorials/blob/main/docs/docker.md#docker) and cloning the [GitHub repository](https://github.com/spectrocloud/tutorials/) that contains the tutorial files. Here are the steps to start the tutorials container. 
<br />

Start the Docker Desktop on your local machine and ensure the daemon is available by issuing a command to list the currently active containers.

<br />

```bash
docker ps
```

Download the `ghcr.io/spectrocloud/tutorials:1.0.4` image to your local machine. The Docker image includes the necessary tools. 
<br />

```bash
docker pull ghcr.io/spectrocloud/tutorials:1.0.4
```

Next, start the container, and open a bash session into it.
<br />

```bash
docker run --name tutorialContainer --publish 7000:5000 --interactive --tty ghcr.io/spectrocloud/tutorials:1.0.4 bash
```

If port 7000 on your local machine is unavailable, you can use any other port of your choice. 
<br /> 

:::caution

Wait to exit the container until the tutorial is complete. Otherwise, you may lose your progress. 

:::



### Tools and Starter Code
After opening a bash session in the active container, verify that the tools necessary for this tutorial are installed. 
<br />

Check the Spectro CLI version.
<br />

```bash
spectro version
```

Check the Spectro registry server version.
<br />

```bash
registry --version
```

Check the Terraform version.
<br />

```bash
terraform --version
```

In addition to these tools, the tutorials container has other tools, such as `ngrok`, `git`, and `nano`. 

Examine the directories that pertain to the current tutorial in the **root** directory. 
<br />

```bash
.
├── packs
│   └── hello-universe-pack             # Contains the pack files
└── terraform
    └── pack-tf                         # Contains the .tf files for creating Spectro Cloud resources
```
The **packs** directory contains the pack files. The **terraform** directory contains the Terraform files used to create Spectro Cloud resources, which you will use later in this tutorial.


## Build a Pack

Building a custom pack requires defining specific files. 
As outlined in the [Adding Add-on Packs](adding-add-on-packs.md) guide, you can define a custom pack in two ways: using manifest files or Helm charts. The file structure varies for manifest-based packs and Helm chart-based packs. Below is the reference file structure for each:
<br />

<Tabs>

<TabItem label="Manifests-based pack" value="add_on_packs_manifests">

<br />

```bash
.
├── pack.json           # Mandatory
├── values.yaml         # Mandatory
├── manifests           # Mandatory
    ├── manifest-1.yaml
    ├── manifest-2.yaml
│   └── manifest-3.yaml
├── logo.png            # Mandatory
└── README.md           # Optional
```

</TabItem>

<TabItem label="Helm charts-based pack" value="add_on_packs_helm_charts">

<br />

```bash
.
├── pack.json           # Mandatory
├── values.yaml         # Mandatory. Pack-level values.yaml file.
├── charts              # Mandatory
│   ├── chart-1         # Can have nested charts
│   │   ├── Chart.yaml
│   │   ├── templates
│   │   │   ├── template-1.yaml
│   │   │   └── template-2.yaml
│   │   └── values.yaml # Chart-level values.yaml file. 
│   ├── chart-1.tgz
│   ├── chart-2
│   │   ├── Chart.yaml
│   │   ├── templates
│   │   │   ├── template-1.yaml
│   │   │   └── template-2.yaml
│   │   └── values.yaml # Chart-level values.yaml file. 
│   └── chart-2.tgz
├── logo.png            # Mandatory
└── README.md           # Optional
```

</TabItem>

</Tabs>

<br /> 

To simplify this tutorial, we provide you with the manifest file for the *Hello Universe* application in the **packs/hello-universe-pack** folder. Change the directory to the **packs/hello-universe-pack** folder.
<br />

```bash
cd /packs/hello-universe-pack
```
Ensure you have the following files in the current directory.
<br />

```bash
.
├── pack.json           # Mandatory
├── values.yaml         # Mandatory
├── manifests           # Mandatory
│   └── hello-universe.yaml
├── logo.png            # Mandatory
└── README.md           # Optional
```
<br />

### Pack File Structure

Go ahead and review each of the following five files in the pack.

* **pack.json** -  This file contains the pack metadata such as `addonType`, `cloudTypes`, and the `kubeManifests` array that contains the list of manifest files: `layer`, `name`, and `version`. Refer to the [JSON Schema](add-custom-packs.md#json-schema) for a list of attributes and respective data types. The schema validation will happen when you push a pack to the registry.  

  

  ```json
  {
      "addonType":"app services",
      "cloudTypes": [ "all" ],
      "displayName": "Hello Universe",
      "kubeManifests": [
          "manifests/hello-universe.yaml"
      ],
      "layer": "addon",
      "name": "hellouniverse",
      "version": "1.0.0"
  }
  ```
  
  <br />



* **values.yaml** -  This file contains configurable parameters you can define while adding the current pack to a cluster profile. In the **values.yaml** file for this tutorial, the `pack/namespace` attribute specifies the namespace on the target cluster to deploy the pack. If the **values.yaml** specifies a namespace value, then Palette first checks to see if the namespace has been created. If so, Palette uses the existing namespace. If the namespace has not been created, Palette creates a new one using the value specified in the YAML file. 

  If the **values.yaml**  does not specify a namespace value, Palette deploys the application to the default namespace.
  
  The `manifests` section exposes the configurable parameters for each manifest file listed in the **manifests** directory. For example, in the sample code snippet below, the `hello-universe` attribute exposes the `registry`, `repository`, and `tag` parameters. 
  <br />

  ```yaml
  pack:
      namespace: "hello-universe"
  manifests:
      hello-universe:
          registry: ghcr.io
          repository: spectrocloud/hello-universe
          tag: 1.0.12
  ```

  <br />

  You can optionally define *presets*, which are predefined values to use in the **values.yaml**. You define presets in a separate **presets.yaml** file. The presets become available when you create the cluster profile. Presets facilitate configuring the profile and avoid errors that can happen by manually editing the **values.yaml** file. Refer [Pack Presets](pack-constraints.md#pack-presets) for details and examples of how to define presets. 
  
  The example below shows the parameters you can configure in the **values.yaml** for the `hello-universe` manifest when you create the cluster profile. 

  <br />

  ![Screenshot of the configurable parameters in the values.yaml file.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_profile-values-yaml.png )

  <br />

* **manifests** -  This directory contains the manifest files for your Kubernetes application. This tutorial has only one file, **hello-universe.yaml**. Note that the **values.yaml** file has a corresponding `manifests/hello-universe` element with the same name as the YAML file. 
  <br />

* **logo.png** -  This file contains a logo that displays when you create a cluster profile. 
<br />


* **README.md** -  This file may contain the pack description, purpose, authors, and other relevant information. The README in the current example introduces the application used in the pack.
<br />


After finalizing all files in the pack directory, the next step is to set up a registry server and publish the pack to that registry, where you can access it directly from Palette. 

<br />

## Set Up the Registry Server

The tutorials environment already has the Spectro registry service and other necessary tools available. The following sections will guide you to start the registry server, expose the service to the external world using [Ngrok](https://ngrok.com/) reverse proxy, and log in to the registry server to push your custom add-on pack to it.   

### Start and Expose the Registry Server
Start the registry server by issuing the following command from the bash session you opened into the tutorials container. 
<br />

```bash
registry serve /etc/spectro/config.yml > /var/log/registry.log 2>&1 &
```

The registry server will start in HTTP mode (not HTTPS). Refer to the [Add a Custom Registry](adding-a-custom-registry.md) guide to learn more about deploying an HTTPS registry server. 


Next, expose the registry server to the public so that you can configure it later in Palette. Use Ngrok reverse proxy to expose the registry server listening on port 5000 via an HTTP tunnel using the following command. 
<br />

```bash
ngrok http 5000 --log-level debug
```

The command above will reserve the current bash session and display the status of each HTTP request made to the Ngrok server later in this tutorial. The screenshot below shows the registry server successfully exposed via Ngrok.  

<br />

![Screenshot of registry server exposed via ngrok](/tutorials/deploy-pack/registries-and-packs_deploy-pack_ngrok-start.png )

<br />

Verify the registry server is accessible from outside the tutorials container by visiting the `/health` endpoint. Access the *https://Your-URL-Here/health* in your host browser. Replace the base URL with the Ngrok URL output you received. You should receive a `{"status":"UP"}` response.

<br /> 

### Log in to the Registry Server
Once the registry server's `/health` endpoint shows `UP` status, the next step is to log in and then push the pack to it. The pack you will push is in the tutorials container. Open another bash session into the tutorials container from your local terminal.  
<br/>

```bash
docker exec -it tutorialContainer bash
```

Log in to the registry server using Ngrok's public URL assigned to you. Issue the command below, but replace the URL with your Ngrok URL. The command below uses these credentials to log in to the registry server: `{username: admin, password: admin}`.
<br/>

```bash
spectro registry login  --insecure --default --username admin --password admin \
f59e-49-36-220-143.ngrok-free.app
```

:::caution

Do not use https:// or http:// keyword in the Ngrok URL. Using either of these keywords will result in an authorization issue. 

:::


You will receive a `Login Succeeded` response upon successful login. 
<br />

```bash
# Output condensed for readability
WARNING! Your password will be stored unencrypted in /root/.spectro/config.json.
Login Succeeded
```
<br />


### Push the Pack to the Registry Server
When you are logged in, push the pack to the registry server using the following command. 
<br />

```bash
spectro pack push /packs/hello-universe-pack/
```

You can verify that the pack is in the registry by using the `ls` command. This command lists all packs in the registry. 
<br />

```bash
spectro pack ls
```

Verify the pack you pushed is listed, as shown in the screenshot below.  

<br />

![Screenshot of spectro pack ls](/tutorials/deploy-pack/registries-and-packs_deploy-pack_pack-push.png)

<br />

If you need help with the Spectro CLI commands, such as deleting a pack, refer to the [Spectro CLI commands](spectro-cli-reference.md#commands) guide. 
<br /> 

### Configure the Registry Server in Palette
After you push the pack to the registry server, log in to Palette and configure the registry service so that you can access it when you create your cluster profile.   


Log in to [Palette](https://console.spectrocloud.com), and switch to the Tenant admin view.
<br />

![Screenshot of Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_tenant-admin.png)

<br />



Navigate to **Tenant Settings** > **Registries** > **Pack Registries** section. Click on the **Add New Pack Registry**. Palette will open a pop-up window asking for the fields to configure a custom pack registry, as highlighted in the screenshot below. 

![A screenshot highlighting the fields to configure a custom pack registry. ](/registries-and-packs_adding-a-custom-registry-tls_certificate.png)


Provide the pack registry name, endpoint, and user credentials in the pop-up window. For a consistent experience in this tutorial, we suggest using the name **private-pack-registry**. Use your Ngrok URL as the pack registry endpoint. Ensure to use an "https://" prefix in the pack registry endpoint. 

In the **TLS Configuration** section, select the **Insecure Skip TLS Verify** checkbox. This tutorial does not establish a secure HTTPS connection between Palette and your pack registry server. Therefore, you can skip the TLS verification. Instead, this tutorial uses an unencrypted  HTTP connection. However, in a production environment, you can upload your certificate in the **TLS Configuration** section if you need Palette to have a secure HTTPS connection while communicating with the pack registry server.

Click on **Validate** to ensure the URL and credentials are correct, then click on **Confirm** to finish configuring the registry server.

<br />

![Screenshot of registry server edit option in Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_registry-edit.png)

<br />


Palette syncs the registry server periodically. However, you can sync it manually the first time you add a server by clicking the **three-dot Menu** next to the registry server name and selecting **Sync**.  

<br />

![Screenshot of registry server sync in Palette](/tutorials/deploy-pack/registries-and-packs_deploy-pack_registry-sync.png)

<br />


### Create a Cluster Profile and Deploy a Cluster

This tutorial guides you to create a cluster profile for AWS. However, you can choose any other cloud service provider, provided you configure the following two items:
<br /> 

* **Cloud account**: A cloud account added to your Palette project settings. 

  The AWS cloud account name in this tutorial example is **spectro-cloud**. You can choose another name if desired. The screenshot below shows how to add and verify the AWS cloud account with your project. Navigate to **Project Settings** > **Cloud Accounts** > **AWS** > **Add AWS Account** in Palette. Check out the [Register and Manage AWS Accounts](../clusters/public-cloud/aws/add-aws-accounts.md) guide for additional help. 

  <br />

  ![Screenshot of Cloud Accounts in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_palette-cloud-account.png)

  <br />


* **SSH key**: An SSH key created in the region where you will deploy the cluster. 

  This tutorial example will deploy the cluster in the **us-east-2**  region, and the SSH key name used in this example is **aws_key_sk_us_east_2**. You must choose the desired region and the available SSH key name from your AWS account. 

<br /> 

Create a cluster profile and deploy it to a cluster using either Palette or Terraform code.

- [UI Workflow](#ui-workflow)

- [Terraform Workflow](#terraform-workflow)

---

<br />

## UI Workflow


### Create a Cluster Profile
Switch to the **Default** project scope for creating a cluster profile.  
<br />

![Screenshot of the Palette Default scope.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_default-scope.png)

<br />

Select the **Profile** section in the left **Main Menu** to create a cluster profile that will combine the core infrastructure and add-on layers. Click on the **Add Cluster Profile** button, and provide the details in the wizard that follows. The wizard displays the following sections. 
<br />

#### Basic Information
Use the following values in the **Basic Information** section. 

|**Field**|**Value**|
|---|---|
|Name|pack-tutorial-profile|
|Version|`1.0.0`|
|Description|Cluster profile as part of the pack tutorial.|
|Type|Full|
|Tags|`spectro-cloud-education, app:hello-universe, terraform_managed:true`|

Click on **Next** to continue. 
<br />

#### Cloud Type
In the **Cloud Type** section, choose AWS as the infrastructure provider for this tutorial, and click on **Next** at the bottom to move on to the next section.   
<br />

:::info

If you choose a different cloud service provider, the core infrastructure layers options, as outlined in the **Profile Layers** section below, will differ from this tutorial.

:::

<br />

#### Profile Layers
In the **Profile Layers** section, add the following core infrastructure layers if you have chosen the AWS cloud service provider. To deploy your resource to Azure or Google Cloud, use the core infrastructure layers outlined in [Cloud Service Provider Configurations](https://github.com/spectrocloud/tutorials/tree/main/terraform/pack-tf/README.md#cloud-service-provider-configurations).

|**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
|---|---|---|---|
|OS|Public Repo|Ubuntu|`LTS__20.4.x`|
|Kubernetes|Public Repo|Kubernetes|`1.24.x`|
|Network|Public Repo|Calico|`3.25.x`|
|Storage|Public Repo|Amazon EBS CSI|`1.16.x`|

As you add each layer, click on the **Next layer** button. After you add the **Storage** layer, click on the **Confirm** button to complete the core infrastructure stack. Palette displays the newly created infrastructure profile as a layered diagram. You can select any layer to make further edits or change the version if desired. 

Now you are ready to add the add-on layers. Click the **Add New Pack** button. 

Add the Spectro Proxy pack to enable a reverse proxy to connect to the cluster's API. Adding this pack is *optional*, but it will help connect your local machine to the cluster's API for debugging. 
Refer to the [Spectro Proxy](../integrations/frp.md) guide for more details. 

|**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
|---|---|---|---|
|Authentication | Public Repo| Spectro Proxy | `1.3.x`|

Click on the **Confirm & Create** button to finish adding the Spectro Proxy pack. Also, add the following certificate Subject Alternative Name (SAN) value to the Kubernetes pack under the `apiServer` parameter section to configure the Spectro Proxy pack.
<br />

```yaml
certSANs:
  - "cluster-{{ .spectro.system.cluster.uid }}.{{ .spectro.system.reverseproxy.server }}"
```
<br />

![Screenshot of the certificate Subject Alternative Name.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_profile-certsan.png)

<br />

Next, add the following **Hello Universe** pack. This is the custom add-on pack you defined and pushed to the **private-pack-registry** earlier in this tutorial. 

|**Pack Type**|**Registry**|**Pack Name**|**Pack Version**| 
|---|---|---|---|
|App Services | private-pack-registry | Hello Universe | `1.0.x` |


Click on the **Confirm & Create** button to finish adding the Hello Universe pack. 


If there are no errors or compatibility issues, Palette displays the newly created full cluster profile. Verify the layers you added, and click **Next**.    


<br />

![Screenshot of the Profile Layers success.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_profile-layer.png)

<br /> <br />


#### Review
Review once more and click **Finish Configuration**  to create the cluster profile. 
<br />

### Create a Cluster
From the **Profile** page,  click on the newly created cluster profile to view its details page. Palette displays all the layers and allows you to edit any of them. 

Click the **Deploy** button to deploy a new cluster. The cluster deployment wizard will displays the following sections. 
<br />

### Basic Information
Use the following values in the first section, **Basic Information**. 

|**Field**|**Value**|
|---|---|
|Cluster name| pack-tutorial-cluster |
|Description| Cluster as part of the pack tutorial.|
|Tags|`spectro-cloud-education, app:hello-universe, terraform_managed:true`|
|Cloud Account|spectro-cloud|

Note that the AWS cloud account name in this tutorial example is **spectro-cloud**. If you used a different cloud account name, choose the name configured in your Palette's project settings. 

Click **Next** to continue.    

<br /> 

#### Parameters

The **Parameters** section allows you to change the profile configurations. For example, clicking on the **Hello Universe 1.0.x** layer allows you to configure the `registry`, `repository`, and `tag` parameters defined in the **values.yaml** file. 
<br />

![Screenshot of the Cluster layers.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_cluster-layers.png)

<br />

Keep the default values and click **Next**.

<br />

#### Cluster config

In the **Cluster config** section, ensure the **Static Placement** field is unchecked. If checked, the **Static Placement** will deploy the cluster in an existing VPC, and you will need the [Amazon Resource Names](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html) (ARNs) for the existing subnets, roles, and other resources. For this tutorial, we will use dynamic placement, where Palette creates a new VPC and all other resources needed for the cluster. 

For the **Region** field, select the region of your choice. The tutorial example will deploy the cluster in the  **us-east-2** region. For the **SSH Key Pair Name** field, choose the SSH key pair name from the selected region. You must have an SSH key created already in the AWS region where you will deploy the cluster.

Click **Next** to continue.    

<br />

#### Nodes config
In the **Nodes config** section, provide the details for the master and the worker pools. For this tutorial, you can use the following minimal configuration:

|**Field** | **Value for the master-pool**| **Value for the worker-pool**|
|---| --- | ---|
|Node pool name| master-pool | worker-pool |
|Number of nodes in the pool| `1` | `1` |
|Allow worker capability| Checked | Not applicable |
|Enable Autoscaler | Not applicable | No |
|Rolling update |  Not applicable | Expand First. <br /> Launch a new node first, then shut down the old one. |

Keep the **Cloud Configuration** the same for the master and worker pools.

|**Field** | **Value**|
|---| --- | 
|Instance Type | General purpose `m4.xlarge` <br />A minimum allocation of four CPU cores is required for the master node. |
|Availability zones | Choose any *one* availability zone.<br /> This tutorial uses the `us-east-1a` availability zone. | 
|Disk size | 60 GiB | 

Click **Next** to continue.    
<br /> 

#### Settings 
#
The **Settings** section displays options for OS patching, scheduled scans, scheduled backups, and cluster role binding. Use the default values, and click on the **Validate** button.      

<br /> 

#### Review
Review all configurations in this section. The **Review** page displays the cluster name, tags, cloud account name, node pools, layers, and an estimated hourly cost. If everything looks good, click on the **Finish Configuration** button to finish deploying the cluster. Deployment may take up to *20 minutes* to finish. 

While deployment is in progress, Palette displays the cluster status as **Provisioning**. While you wait for the cluster to finish deploying, you can explore the various tabs on the cluster details page, such as **Overview**, **Workloads**, and **Events**. 

<br /> 

<!-- </TabItem>

<TabItem label="Terraform Workflow" value="terraform_code"> -->

## Terraform Workflow

The [Spectro Cloud Terraform provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) allows you to create and manage Palette resources using Infrastructure as Code (IaC). This offers such advantages as automating infrastructure, facilitating collaboration, documenting infrastructure, and keeping all infrastructure in a single source of truth.

### Starter Code
Navigate back to your tutorials container bash session to locate the starter Terraform files. If you have closed the terminal session, you can reopen another bash session in the tutorials container using the following command. 
<br />

```bash
docker exec -it tutorialContainer bash
```

Switch to the **/terraform/pack-tf** directory, which contains the Terraform code for this tutorial. 
<br />

```bash
cd /terraform/pack-tf
```

### Set Up the Spectro Cloud API Key

To get started with Terraform code, you need a Spectro Cloud API key to authenticate and interact with the Palette API endpoint. To add a new API key, log in to Palette, click on the user **User Menu** at the top right, and select **My API Keys**, as shown in the screenshot below. 

<br />

![Screenshot of generating an API key in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_generate-api-key.png )

<br />

Below are the steps to add and export an API key:


1. Fill in the required fields, such as the API key name and expiration date, and confirm your changes. 



2. Copy the key value to your clipboard, and switch back to the tutorials container environment. 



3. Export the API key as an environment variable in the tutorials container bash session so the Terraform code can authenticate with Palette API.
  <br />

  ```bash
  export SPECTROCLOUD_APIKEY=<Your-Spectro-Cloud-API-key>
  ```
<br />

### Review Terraform Files
Ensure you have the following files in the current working directory.
<br />

```bash
.
├── profile.tf		# Resource
├── cluster.tf		# Resource
├── data.tf			  # Spectro Cloud data resources
├── inputs.tf		  # Input variables
├── terraform.tfvars  # Variable definitions file
├── outputs.tf		# Output variables
└── provider.tf		# Spectro Cloud Terraform provider 
```

Note that the Terraform code will deploy the resources to **AWS**. 

We recommend you explore all Terraform files. Below is a high-level overview of each file:
<br />

-  **profile.tf** - contains the configuration for the `spectrocloud_cluster_profile` resource. Review the core infrastructure layers that make up the `spectrocloud_cluster_profile` resource. 



-  **cluster.tf** - contains the configuration for the `spectrocloud_cluster_aws` resource. The cluster resource depends upon the `spectrocloud_cluster_profile` resource. 



- **data.tf** - contains the configuration for the resources to retrieve data from Palette dynamically. The table below lists the pack details required for each pack layer in order to deploy the `spectrocloud_cluster_profile` resource. 

  |**Pack Type**|**Registry**|**Pack Name**|**Tag**| **Version** |
  |---|---|---|---|
  |OS|Public Repo|`ubuntu-aws`|`LTS__20.4.x`| `20.04`|
  |Kubernetes|Public Repo|`kubernetes`|`1.24.x`| `1.24.10` |
  |Network|Public Repo|`cni-calico`|`3.25.x`|`3.25.0`|
  |Storage|Public Repo|`csi-aws-ebs`|`1.16.x`|`1.16.0`|

  Note that using this Terraform code will deploy the resources to AWS. To deploy your resource to Azure or Google Cloud, use the layer details outlined in [Cloud Service Provider Configurations] (https://github.com/spectrocloud/tutorials/tree/main/terraform/pack-tf/README.md#cloud-service-provider-configurations). 



- **inputs.tf** - contains the variables used in the tutorial such as the names of cluster profile, cluster, cloud account, SSH key name, AWS region, pack name, and registry server. 

  Some variables have a default value, but you *must* provide the values for `cluster_cloud_account_aws_name`, `aws_region_name`, `ssh_key_name`, and `private_pack_registry` variables. You will find a `#ToDo` tag next to each variable to update. Provide the values for these variables in a separate file, **terraform.tfvars**. Use default values for the remaining variables.



- **terraform.tfvars** - contains the variable definitions. The list of variables is outlined in the code block below. You *must* specify the values for all variables that are marked `"REPLACE ME"`. Read the inline comments below to understand each variable. 

  - For example, the value for  `cluster_cloud_account_aws_name` will be the name of the cloud account added to your Palette project settings. In this tutorial example, the cloud account name is **spectro-cloud**. 
  
  - For `aws_region_name`, you can choose any [AWS region](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.RegionsAndAvailabilityZones.html) for your deployment. This tutorial example uses **us-east-2** region. 
  
  - The value for `ssh_key_name` will be the name of the SSH key available in the region where you will deploy the cluster. The SSH key name used in this example is **aws_key_sk_us_east_2**. 
  
  - Lastly, provide your registry server name for the `private_pack_registry` variable. You can provide the **private-pack-registry** as the value if you have followed the same naming convention as this tutorial. 
  <br />

  ```bash
  cluster_cloud_account_aws_name = "REPLACE ME"   # Name of the cloud account added to your Palette project settings
  aws_region_name = "REPLACE ME"                  # Use "us-east-2" or any other AWS region
  ssh_key_name = "REPLACE ME"                     # Name of the SSH key available in the region where you will deploy the cluster
  private_pack_registry = "REPLACE ME"            # Your registry server name. This tutorial uses "private-pack-registry". 
  ```



- **outputs.tf** - contains the output variables to expose information.



- **provider.tf** - contains the provider configuration and version.

<br /> 

### Deploy Terraform
After you update the **terraform.tfvars** file and carefully review the other files, initialize the Terraform provider.
<br />

```bash
terraform init
```

The `init` command downloads plugins and providers from the **provider.tf** file. Next, preview the resources Terraform will create. 
<br />

```bash
terraform plan
```

The output displays the resources Terraform will create in an actual implementation. 
<br />

```bash
# Output condensed for readability
Plan: 2 to add, 0 to change, 0 to destroy.
```

Finish creating all the resources. 
<br />

```bash
terraform apply -auto-approve
```

It can take up to 20 minutes to provision the cluster. When cluster provisioning completes, the following message displays. 
<br />

```bash
# Output condensed for readability
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

You can observe the cluster deployment progress in Palette by navigating back to Palette.
<br /> 


#### Check the In-Progress Deployment
Log into the [Palette](https://console.spectrocloud.com/), and navigate to the **Profile** section in the left **Main Menu**. If the Terraform deployment is successful, the newly created cluster profile is displayed as shown in the screenshot below. 

<br />

![Screenshot of the successful Profile in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_verify-profile.png)

<br /> 

<!-- </TabItem>

</Tabs> -->

<br /> 

## Validate
In Palette, navigate to the left **Main Menu** and select **Clusters**. Next, select your cluster to display the cluster Overview page and monitor cluster provisioning progress.  

<br /> 

![Screenshot of the cluster health.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_cluster-health.png)

<br />

When cluster status displays **Running** and **Healthy**, you can access the application from the exposed service URL with the port number displayed. For the Hello Universe application, port 8080 is exposed. Click on the URL to access the application.
<br />

:::caution

We recommend waiting to click on the service URL, as it takes one to three minutes for DNS to properly resolve the public load balancer URL. This prevents the browser from caching an unresolved DNS request.

:::

<br />

![Screenshot of the successful accessing the application using the load balancer URL.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_success.png)

<br /> 

You can also look at real-time metrics, such as CPU and memory consumption, in the cluster's **Overview** tab in Palette. 

<br />

![Screenshot of the cluster metrics.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_cluster-metrics.png)

<br />

Using your custom pack in the cluster, you have successfully deployed the Hello Universe application to the cluster. 

<br />

## Cleanup
Delete the cluster, cluster profile, and registry server, and remove the registry service configuration from Palette's settings. 

The following steps will guide you in cleaning up your environment. Follow the steps for Palette if you used Palette to deploy the cluster. Use Terraform commands to delete the cluster if you used Terraform for deployment. 

<br />

<Tabs>

<TabItem label="Palette" value="palette_ui_delete">

<br />

####  Delete the Cluster and Profile using Palette
Navigate to the **Cluster** section in Palette's left **Main Menu**, and view the details page of the **pack-tutorial-cluster**. To delete the cluster, click on the **Settings** button to expand the **drop-down Menu**, and select the **Delete Cluster** option. Palette prompts you to enter the cluster name and confirm the delete action. Type the cluster name to proceed with the delete step. 

<br />

![Screenshot of deleting the cluster in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_delete-cluster.png)

<br />

The cluster status displays **Deleting**. Deletion takes up to 10 minutes.
<br />

:::info

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for force deletion. Navigate to the cluster's details page and click on **Settings**. Select **Force Delete Cluster**. Palette automatically removes clusters that are stuck in the cluster deletion phase for over 24 hours.

:::
<br />

After you delete the cluster, go ahead and delete the profile. From the left **Main Menu**, click **Profiles** and select the profile to delete. Choose the **Delete** option in the **three-dot Menu**.

<br />

![Screenshot of deleting the profile in Palette.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_delete-profile.png)

<br />

Wait for the resources to clean up and ensure they are successfully deleted. 

<br />

</TabItem>

<TabItem label="Terraform Code" value="terraform_ui_delete">

<br />

####  Delete the Cluster and Profile using Terraform
If you've used Terraform to deploy the cluster, switch back to the tutorials container, and issue the following command from within the **/terraform/pack-tf** directory:
<br />

```bash
terraform destroy -auto-approve
```

Wait for the resources to clean up. Deleting the Terraform resources may take up to 10 minutes. 
<br />

```bash
# Output condensed for readability
Destroy complete! Resources: 2 destroyed.
```

<br />

</TabItem>

</Tabs>

<br />

####  Delete the Registry Server
After deleting the cluster and cluster profile, navigate to **Tenant Settings** > **Registries** > **Pack Registries** to delete the registry service configuration from Palette.
<br />

![Screenshot of registry server delete in Palette](/tutorials/deploy-pack/registries-and-packs_deploy-pack_registry-delete.png)

<br />

Stop the registry server by closing the tutorials container bash session that serves the Ngrok reverse proxy server. At this point, you can close all the bash sessions. To remove the container and the image from the local machine, issue the following commands:
<br />

```bash
docker container rm --force tutorialContainer
docker image rm --force ghcr.io/spectrocloud/tutorials:1.0.3
```

<br /> 


## Wrap-Up

In this tutorial, you learned how to create a custom pack using manifest files. You packaged up an application in a custom pack that you pushed to a private registry server and added to Palette.

Next, you created a cluster profile that included all the core infrastructure layers, such as the OS, Kubernetes distribution, and more. You also added your custom pack to the cluster profile so your application could be deployed to a Kubernetes cluster. 

Packs are the building blocks of cluster profiles, allowing you to customize your Kubernetes clusters. Palette enables you to use different packs to create multiple cluster profiles, each for specific purposes. As a result, you can ensure all Kubernetes deployments contain all the required dependencies and applications without developing complicated deployment scripts. All you need to do is maintain the cluster profiles.  

To learn more about packs in Palette, we encourage you to check out the reference resources below.


- [Custom OS Pack](add-custom-packs.md#add-a-custom-pack)


- [Add-on Packs](adding-add-on-packs.md)


- [Pack Constraints](pack-constraints.md)

