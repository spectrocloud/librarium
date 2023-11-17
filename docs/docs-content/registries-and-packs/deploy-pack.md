---
sidebar_label: "Deploy a Custom Pack"
title: "Deploy a Custom Pack"
description: "Learn how to deploy applications to a Kubernetes cluster with custom add-on packs. Deploy your custom pack from the Spectro Registry or an OCI registry. Learn how to get started with Palette’s custom packs and reuse them in multiple deployments."
icon: ""
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

In this tutorial, you will create a custom add-on pack to package a sample Kubernetes application, [Hello Universe](https://github.com/spectrocloud/hello-universe#hello-universe), and deploy the application to a cluster. You will learn to create the pack in two ways: using manifest files and Helm charts. 

After defining the custom pack, you will set up a new registry server or leverage an existing Open Container Initiative (OCI) registry. Then, you will publish the pack to the registry and configure the registry server in Palette. Lastly, you will create a cluster profile that contains your custom pack and apply the profile to a cluster using either Palette or Terraform. 

The following diagram illustrates the steps required to succesfully complete this tutorial.

![Architecture Diagram of the Deploy a Custom Pack Tutorial](/tutorials/deploy-pack/registries-and-packs_deploy-pack_architecture-diagram.png)

## Prerequisites {#prerequisites}

To complete this tutorial, ensure you have the following prerequisites in place:

- A Spectro Cloud account. Access [Spectro Cloud Console](https://console.spectrocloud.com) to create an account.
- Tenant admin access to Palette for the purpose of adding a new registry server.
- An Amazon Web Services (AWS) account added to your Palette project settings. Refer to the [Add an AWS Account to Palette](https://docs.spectrocloud.com/clusters/public-cloud/aws/add-aws-accounts) for instructions.
- An SSH key available in the region where you plan to deploy the cluster.
- [Docker Desktop](https://docs.docker.com/get-docker/) installed on your local machine to start the tutorial container. 
- Basic knowledge of Docker containers, Kubernetes manifest file attributes, and Terraform.

If you choose to use an OCI registry, you will need the following item.

- An active OCI registry such as Amazon Elastic Container Registry (ECR) or Harbor.

If you opt for an ECR OCI registry, you will require the following.

- An AWS Identity and Access Management (IAM) user with sufficient access to create ECR repositories and push artifacts.

:::caution

There might be some AWS expenses associated with this tutorial. Once you have completed the tutorial, be sure to delete the infrastructure to avoid additional charges.

:::


## Set Up the Tutorial Environment

In this tutorial, you will work in a Docker container pre-configured with the necessary tools. Alternatively, you can choose to practice the tutorial in any `linux/amd64` or `x86_64` environment by installing the [required tools](https://github.com/spectrocloud/tutorials/blob/main/docs/docker.md#docker) and cloning the [GitHub repository](https://github.com/spectrocloud/tutorials/) that contains the tutorial files. To initialize the tutorial container, follow the steps described below. 

Start Docker Desktop on your local machine and ensure that the Docker daemon is available by issuing a command to list the currently active containers.


```bash
docker ps
```


Download the `ghcr.io/spectrocloud/tutorials:1.0.9` image to your local machine. This Docker image includes the necessary tools. 


```bash
docker pull ghcr.io/spectrocloud/tutorials:1.0.9
```


Next, start the container and open a bash session into it.


```bash
docker run --name tutorialContainer --publish 7000:5000 --interactive --tty ghcr.io/spectrocloud/tutorials:1.0.9 bash
```


If the port 7000 on your local machine is unavailable, you can use any other port of your choice. 
<br /> 


:::caution

Do not exit the container until the tutorial is complete. Otherwise, you may lose your progress. 

:::


<br />

### Required Tools and Directories

After starting a bash session in the active container, confirm the installation of the required tools using the commands provided below. 


Check the Spectro Command Line Interface (CLI) version.

```bash
spectro version
```


Verify the Spectro registry server version.

```bash
registry --version
```


Check the Terraform version.

```bash
terraform --version
```


Additionally, the tutorial container includes other tools such as `ngrok`, `git`, `nano`, `aws-cli`, and `oras`.

Inspect the directories relevant to the current tutorial in the container **root** directory. 

```bash
.
├── packs
│   └── hello-universe-pack     # Stores the pack files.
└── terraform
    └── pack-tf                 # Contains the Terraform files used to create Spectro Cloud resources.
```


The **packs** directory stores the pack files. The **terraform** directory contains the Terraform files used to create Spectro Cloud resources, which you will use later in this tutorial.


## Build a Pack

Building a custom pack involves defining specific files. 
As outlined in the [Adding Add-on Packs](adding-add-on-packs.md) guide, there are two ways to define a custom pack: using manifest files or Helm charts. The file structure differs for manifest-based packs and Helm chart-based packs. Below is the reference file structure for each.
<br />

<Tabs>

<TabItem label="Manifests-based pack" value="add_on_packs_manifests">

<br />

```bash
.
├── pack.json           # Mandatory.
├── values.yaml         # Mandatory.
├── manifests           # Mandatory.
    ├── manifest-1.yaml
    ├── manifest-2.yaml
│   └── manifest-3.yaml
├── logo.png            # Mandatory.
└── README.md           # Optional.
```

</TabItem>

<TabItem label="Helm charts-based pack" value="add_on_packs_helm_charts">

<br />

```bash
.
├── pack.json           # Mandatory.
├── values.yaml         # Mandatory. Pack-level values.yaml file.
├── charts              # Mandatory.
│   ├── chart-1         # Can have nested charts.
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
├── logo.png            # Mandatory.
└── README.md           # Optional.
```

</TabItem>

</Tabs>

<br /> 

For your convenience, we provide you with the manifest-based pack files for the *Hello Universe* application. These files are located in the **packs/hello-universe-pack** folder. 

Navigate to the **packs/hello-universe-pack** directory.

```bash
cd /packs/hello-universe-pack
```


Ensure you have the following files in the current directory.

```bash
.
├── pack.json           # Mandatory.
├── values.yaml         # Mandatory.
├── manifests           # Mandatory.
│   └── hello-universe.yaml
├── logo.png            # Mandatory.
└── README.md           # Optional.
```
<br />

### Pack File Structure

Review each of the following five files in the **hello-universe-pack** folder.

* **pack.json** -  This file contains the pack metadata such as `addonType`, `cloudTypes`, and the `kubeManifests` array. The array consists of a list of manifest files: `layer`, `name`, and `version`. Refer to the [JSON Schema](add-custom-packs.md#json-schema) for a list of attributes and respective data types. The schema validation happens when you push a pack to the registry.  

  
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

  Optionally, you can define *presets*, which are predefined values to use in the **values.yaml** file. You define presets in a separate **presets.yaml** file. The presets become available when you create the cluster profile. Presets facilitate configuring the profile and avoid errors that can happen by manually editing the **values.yaml** file. Refer to [Pack Presets](pack-constraints.md#pack-presets) for details and examples of how to define presets. 
  
  The example below shows the parameters you can configure in the **values.yaml** file for the `hello-universe` manifest during the creation of the cluster profile. 


  ![Screenshot of the configurable parameters in the values.yaml file.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_profile-values-yaml.png )


* **manifests** -  This directory contains the manifest files for your Kubernetes application. This tutorial has only one file, **hello-universe.yaml**. Note that the **values.yaml** file has a corresponding `manifests/hello-universe` element with the same name as the YAML file. 
  <br />

* **logo.png** -  This file contains a logo that displays when you create a cluster profile. 
<br />


* **README.md** -  This file may contain the pack description, purpose, authors, and other relevant information. The README in the current example introduces the application used in the pack.
<br />


After completing the review of all files in the pack directory, the next step is to set up a registry server, publish the pack to that registry, and configure the registry in Palette.


<br />

## Set Up the Registry Server

You can set up a registry server using either the Spectro Registry or an OCI-compliant registry. Palette supports all OCI-compliant registries, and you can refer to the [Spectro Cloud OCI Registry](https://docs.spectrocloud.com/registries-and-packs/oci-registry/) resource for more information.

The tutorial environment already includes the Spectro registry service and other necessary tools. For OCI registries, as per the [Prerequisites](#prerequisites) section, ensure you have an active OCI registry. Two types of OCI authentication are available: **Amazon (ECR)** and **Basic**. To get started with Amazon ECR, consult the [What is ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html) user guide. For Basic OCI Authentication, this tutorial uses a [Harbor registry](https://goharbor.io/) as an example. Learn how to set up a Harbor registry server by referring to the [Harbor Installation and Configuration](https://goharbor.io/docs/2.9.0/install-config/) guide.

The following sections will guide you through starting the registry server, logging in, pushing your custom add-on pack, and, finally, configuring the registry server in Palette.

### Start the Registry Server

<Tabs>

<TabItem label="Spectro Registry" value="Spectro_Registry">

<br />

Start the registry server by issuing the following command from the tutorial container bash session. 

```bash
registry serve /etc/spectro/config.yml > /var/log/registry.log 2>&1 &
```

The registry server starts in HTTP mode. If you want to deploy an HTTPS registry server, refer to the [Add a Custom Registry](adding-a-custom-registry.md) guide. 


Next, make the registry server accessible to the public using [Ngrok](https://ngrok.com/) reverse proxy so that you can configure it later in Palette. Execute the command below to expose the registry server listening on port 5000 via an HTTP tunnel. 


```bash
ngrok http 5000 --log-level debug
```

This command reserves the current bash session and displays the status of each HTTP request made to the Ngrok server. The image below shows the registry server successfully exposed via Ngrok.  


![Screenshot of registry server exposed via ngrok](/tutorials/deploy-pack/registries-and-packs_deploy-pack_ngrok-start.png )


Check if the registry server is accessible from outside the tutorial container by visiting the `/health` endpoint. Open your browser and go to *https://Your-URL-Here/health*, replacing the base URL with the Ngrok URL output. You should get a `{"status":"UP"}` response.

</TabItem>

<TabItem label="ECR" value="ECR_Registry">

<br />

An Amazon ECR private registry is provided to each AWS account, allowing the creation of repositories within it.

The initial step to create the pack's repository in the ECR registry is to export your AWS credentials as environment variables for authentication. 

In the tutorial container's bash session, export the following variables. This tutorial utilizes **us-east-1** as the default region.

```bash
export AWS_ACCESS_KEY_ID=<Your_Access_Key_ID>
export AWS_SECRET_ACCESS_KEY=<Your_Secret_Access_Key>
export AWS_DEFAULT_REGION=<Your_Default_Region>
```

Next, export the variables below, which will you use later to create the ECR repository and push the pack.

- **REGISTRY_NAME** - the name of your ECR registry. This tutorial uses **spectro-oci-registry**.
- **NAME** - the pack's name, which must match the name in the **pack.json** file. 
- **VERSION** - the pack's version, which must match with the version in the **pack.json** file.
- **ACCOUNT_ID** - your AWS account ID, containing only numerical digits and no dashes.

```bash
export REGISTRY_NAME=spectro-oci-registry
export NAME=hellouniverse
export VERSION=1.0.0
export ACCOUNT_ID=<Your_AWS_Account_ID>
```

Create a base path repository to store your pack repositories using the AWS CLI, which is already installed in the tutorial container. Follow the provided structure below.

```bash
aws ecr create-repository --repository-name $REGISTRY_NAME/spectro-packs/archive --region $AWS_DEFAULT_REGION
```

Next, create the repository to store the **Hello Universe** pack.

```bash
aws ecr create-repository --repository-name $REGISTRY_NAME/spectro-packs/archive/$NAME --region $AWS_DEFAULT_REGION
```

This configuration sets up the required environment and repositories for pushing the **Hello Universe** pack to your ECR Registry.

</TabItem>

<TabItem label="Basic" value="Basic_Registry">

<br />

</TabItem>

</Tabs>

<br /> 

### Log in to the Registry Server

<Tabs>

<TabItem label="Spectro Registry" value="Spectro_Registry">

<br />

Once the `/health` endpoint of the registry server displays an `UP` status, proceed to the authentication step. In a new terminal window, start another bash session in the tutorial container.  


```bash
docker exec -it tutorialContainer bash
```

Log in to the registry server using the Ngrok public URL assigned to you. Issue the following command, replacing the URL with your Ngrok URL. The command below uses these credentials to log in to the registry server: `{username: admin, password: admin}`.


```bash
spectro registry login  --insecure --default --username admin --password admin \
58ec-174-119-143-38.ngrok-free.app
```
<br />

:::caution

Do not include the "https://" or "http://" keywords in the Ngrok URL. Using either of these keywords will result in an authorization issue. 

:::

<br />

You will receive a `Login Succeeded` response upon successful login.

```bash
# Output condensed for readability
WARNING! Your password will be stored unencrypted in /root/.spectro/config.json.
Login Succeeded
```
<br />

</TabItem>

<TabItem label="ECR" value="ECR_Registry">

<br />

After you have created the repositories, authenticate to your ECR registry using the `aws ecr get-login-password` command. The ECR authorization token is then passed to the `oras login` command with **AWS** as username and the registry Uniform Resource Identifier (URI). [Oras](https://oras.land/docs/) is a CLI tool to push and pull OCI artifacts to and from OCI registries.

```bash
aws ecr get-login-password --region $AWS_DEFAULT_REGION | oras login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
```

If the login is successful, you will receive the following confirmation message.

```bash
Login Succeeded
```

</TabItem>

<TabItem label="Basic" value="Basic_Registry">

<br />

</TabItem>

</Tabs>

<br />

### Push the Pack to the Registry Server

<Tabs>

<TabItem label="Spectro Registry" value="Spectro_Registry">

<br />

Once you are logged in, push the pack to the registry server using the following command. 


```bash
spectro pack push /packs/hello-universe-pack/
```

To confirm that the pack is now in the registry, use the `ls` command. This command lists all packs available in the registry. 


```bash
spectro pack ls
```

Check if the pushed pack is listed, as shown in the image below.  


![Screenshot of spectro pack ls](/tutorials/deploy-pack/registries-and-packs_deploy-pack_pack-push.png)


For assistance with Spectro CLI commands, refer to the [Spectro CLI Commands](spectro-cli-reference.md#commands) guide. 
<br /> 

</TabItem>

<TabItem label="ECR" value="ECR_Registry">

<br />

Once you are authenticated to your ECR registry, navigate to the **packs** directory, which contains the pack folder, **hello-universe-pack**.

```bash
cd /packs
```

Before pushing the pack to the registry, compress the contents of the pack folder into an archive file. Issue the command below to create the archive file.

```bash
tar -czvf $NAME-$VERSION.tar.gz hello-universe-pack
```

Now, proceed to push the **Hello Universe** pack to the ECR registry.

```bash
oras push $ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$REGISTRY_NAME/spectro-packs/archive/$NAME:$VERSION $NAME-$VERSION.tar.gz
```

You can use the `aws ecr describe-images` command to check if the pushed pack is listed in your ECR repository.

```bash
aws ecr describe-images --repository-name $REGISTRY_NAME/spectro-packs/archive/$NAME --region $AWS_DEFAULT_REGION
```

The image below displays the output of the `aws ecr describe-images` command, confirming the presence of the **Hello Universe** pack in the repository.

![Screenshot of the output of the command aws ecr describe-images](/tutorials/deploy-pack/registries-and-packs_deploy-pack_pack-describe.png)

</TabItem>

<TabItem label="Basic" value="Basic_Registry">

<br />

</TabItem>

</Tabs>

<br />

### Configure the Registry Server in Palette

<Tabs>

<TabItem label="Spectro Registry" value="Spectro_Registry">

<br />

After pushing the pack to the registry server, follow the next steps to log in to Palette and add the registry server to it.


Log in to [Palette](https://console.spectrocloud.com) and switch to the **Tenant Admin** view.


![Screenshot of Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_tenant-admin.png)


Navigate to the **Tenant Settings** > **Registries** > **Pack Registries** section and click on **Add New Pack Registry**. Palette will open a pop-up window prompting you for the required fields to configure a custom pack registry.

![A screenshot highlighting the fields to configure a custom pack registry. ](/tutorials/deploy-pack/registries-and-packs_adding-a-custom-registry-tls_certificate.png)


Provide the pack registry name, endpoint, and user credentials in the pop-up window. For consistency, we suggest using the registry name **private-pack-registry**. Use your Ngrok URL as the pack registry endpoint. Ensure to add "https://" as a prefix in the pack registry endpoint. Set both the username and password as **admin**.

In the **TLS Configuration** section, select the **Insecure Skip TLS Verify** checkbox. This tutorial does not establish a secure HTTPS connection between Palette and your pack registry server. Therefore, you can skip the TLS verification. Instead, this tutorial uses an unencrypted  HTTP connection. However, in a production environment, you can upload your certificate in the **TLS Configuration** section if you need Palette to establish a secure HTTPS connection while communicating with the pack registry server.

Click on **Validate** to ensure that the provided URL and credentials are correct, then click on **Confirm** to finish the registry server configuration.


![Screenshot of registry server edit option in Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_registry-edit.png)


Palette automatically syncs the registry server periodically. However, you can sync it manually by clicking on the **Three-dot Menu** next to the registry server name and selecting **Sync**.  


![Screenshot of registry server sync in Palette](/tutorials/deploy-pack/registries-and-packs_deploy-pack_registry-sync.png)

<br />

</TabItem>

<TabItem label="ECR" value="ECR_Registry">

<br />

After pushing the pack to the ECR registry, follow the next steps to log in to Palette and add the ECR registry to it.


Log in to [Palette](https://console.spectrocloud.com) and switch to the **Tenant Admin** view.


![Screenshot of Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_tenant-admin.png)


Navigate to the **Tenant Settings** > **Registries** > **OCI Registries** section and click on **Add New OCI Registry**. Palette will open a pop-up window prompting you for the required fields to configure an OCI registry.

![A screenshot highlighting the fields to configure an OCI registry. ](/tutorials/deploy-pack/registries-and-packs_deploy-pack_oci-registry.png)


Provide the registry name. For consistency, we suggest using the registry name **ecr-registry**. Choose **Pack** as the provider and select **ECR** as the OCI authentication type. Complete the **Endpoint** field with your ECR registry URI. The URI follows the structure `123456.dkr.ecr.us-east-1.amazonaws.com` Replace **123456** with your AWS account ID and **us-east-1** with your AWS default region.

Next, set the base content path as **spectro-oci-registry**, which is your ECR registry name. Toggle the **Protected** option, choose **Credentials** as the AWS authentication method, and specify your AWS access and secret access keys.

Lastly, click on **Validate** to ensure that the provided URL and credentials are correct. After validation, click on **Confirm** to finish the ECR registry configuration.


![Screenshot of OCI registry fields in Palette tenant settings.](/tutorials/deploy-pack/registries-and-packs_deploy-pack_oci-registry-edit.png)


Palette automatically syncs the registry. However, you can sync it manually by clicking on the **Three-dot Menu** next to the registry name and selecting **Sync**.  


![Screenshot of OCI registry sync in Palette](/tutorials/deploy-pack/registries-and-packs_deploy-pack_oci-registry-sync.png)

</TabItem>

<TabItem label="Basic" value="Basic_Registry">

<br />

</TabItem>

</Tabs>

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
|---| --- | ---|
|Instance Type | General purpose `m4.xlarge` <br />A minimum allocation of four CPU cores are required for the master node. |
|Availability zones | Choose any *one* availability zone.<br /> This tutorial example will deploy to the `us-east-2a` availability zone. | 
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
docker image rm --force ghcr.io/spectrocloud/tutorials:1.0.9
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

