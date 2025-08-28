---
sidebar_position: 0
sidebar_label: "Deploy an Application using Palette Dev Engine"
title: "Deploy an Application using Palette Dev Engine"
description:
  "Learn how to deploy applications to a Kubernetes cluster without the traditional overhead accompanied by Kubernetes.
  Palette’s App Mode reduces the deployment time and complexity when deploying applications to Kubernetes. Learn how to
  get started with Palette’s App Mode in this tutorial. Get started with the free tier of Palette App Mode"
tags: ["devx", "app mode", "pde", "tutorial"]
category: ["tutorial"]
---

Palette’s mission is to reduce the challenges you, as a user, face when interacting with Kubernetes. Whether you are a
system administrator or an application developer, Kubernetes can introduce overhead that slows down the development
process. One of Palette’s core components, _Dev Engine_, focuses on reducing the application development time by
enabling builders to deploy applications to Kubernetes with minimal friction.

This tutorial will teach you how to deploy single and multiple applications to Kubernetes through Palette’s Dev Engine
experience. You will learn about _App Mode_, _App Profiles_, and _Palette Virtual Clusters_ and understand how they
enable you to deploy applications to Kubernetes quickly with minimal overhead.

## Prerequisites

To complete this tutorial, you will need the following items.

- A Spectro Cloud account
- Basic knowledge about containers.
- A Cluster Group available in Palette with at least the following resources:

  - 12 CPU
  - 12 GiB of Memory,
  - 20 GiB of Storage.

    If you don’t have a cluster group, check out the
    [Create Cluster Group](../../clusters/cluster-groups/cluster-groups.md) documentation to learn how to create one.

If you select the Terraform workflow, you will need the following software installed.

- [Terraform](https://developer.hashicorp.com/terraform/install) 1.9.0 or later.

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [Podman](https://podman.io/docs/installation).

There are no expenses associated with this tutorial as everything falls under the Palette Free Tier.

## Architecture

The tutorial includes two scenarios, and for each scenario, you will deploy a separate Kubernetes environment. The
following diagram illustrates the different layers that will power the tutorial environment.

![Architecture diagram depicting two virtual clusters](/tutorials/deploy-app/devx_apps_deploy-apps_architecture-diagram.webp)

The top layer is Palette, which is the product platform. Palette can be used in two modes: app mode or cluster mode.
Each mode is intended for different use cases and personas, but for this tutorial, you will use app mode. For an
in-depth explanation of each mode’s differences, check out the
[App Mode and Cluster Mode](../../introduction/palette-modes.md) documentation.

## Deploy The Environment

The following steps will guide you through deploying the two scenarios. You will start with the single application
scenario to build up your knowledge before deploying the multiple applications scenario.

From Palette, you will deploy two Palette Virtual Clusters. Palette Virtual Clusters will be referred to as virtual
clusters for the rest of the tutorial. Each virtual cluster will be deployed onto your cluster group. Each scenario’s
virtual cluster will reside on the workload clusters belonging to the cluster group.

<br />

:::info

Virtual clusters are standalone Kubernetes environments that sit on top of what you would consider a traditional
Kubernetes cluster or host cluster. Palette Virtual Clusters are Kubernetes clusters that run as nested clusters within
an existing host cluster and share the host cluster resources, such as CPU, memory, and storage. Palette Virtual
Clusters use k3s, a highly available, certified Kubernetes distribution designed for production workloads. Palette
Virtual Clusters are also powered by vCluster.

:::

You can complete this tutorial by using the Palette console, simulating a manual workflow. Or you may leverage
infrastructure as code and complete the tutorial using Terraform.

- [UI Workflow](#ui-workflow)

- [Terraform Workflow](#terraform-workflow)

<br />

## UI Workflow

Start by logging in to Palette. From the landing page, click on the user **drop-down Menu** and click on **App Mode**.

![Image with an arrow pointing to the user drop-down Menu](/tutorials/deploy-app/devx_apps_deploy-apps_toggle-app-mode.webp)

From the app mode landing page, navigate to the left **Main Menu** and click on **Virtual Clusters**. Next, click on the
button **New Virtual Cluster**.

![View of the virtual cluster list](/tutorials/deploy-app/devx_apps_deploy-apps_virtual-cluster-list.webp)

In the following screen, you will be prompted for the cluster group, virtual cluster name, and the cluster size in terms
of CPU, memory, and storage. Select your cluster group, name the cluster `cluster-1`, and allocate 4 CPU, 4 GiB memory,
and 2 GiB of storage. Click on **Deploy Virtual Cluster** after you have filled out all the required information.

It will take a few minutes for the virtual cluster to deploy. In the meantime, navigate to the left **Main Menu** and
click on **App Profiles**.

![The App Profile page with arrows guiding](/tutorials/deploy-app/devx_apps_deploy-apps_app-profiles.webp)

App Profiles are templates that contain all the configurations and settings required to deploy applications to virtual
clusters. App Profiles provide a way to drive consistency across virtual clusters as you can re-use app profiles and
deploy them to different virtual clusters. You can think of app profiles as declarative templates that inform the
Kubernetes cluster of the desired application or set of applications.

Click on the **New App Profile** button to start creating your first app profile. Give the app profile the name
`hello-universe-ui` and add the tag `scenario-1`. Click on **Next**. The following screen is the service type selection
page. You have the option to deploy applications through containers, Helm, or Manifests. You can also consume services
such as databases and more. Click on **Container Deployment**.

Name the container `ui`, select a public registry, and provide the image URL
`ghcr.io/spectrocloud/hello-universe:1.0.12`. Change the network access to **Public** and add the port `8080`.

![App Profile container creation page with details](/tutorials/deploy-app/devx_apps_deploy-apps_app-profile-creation.webp)

Click on **Review** once you have filled out the provided information. On the next page, click on the **Deploy New App**
button.

It’s time to deploy your application to a virtual cluster. Name the application `single-scenario`. For the **App
profile** input field, click on the button to the right of the input field to get a list of all your available app
profiles. Select the **hello-universe-ui profile** and click on **Confirm**.

Next, click the radio button **Deploy in An Existing Palette Virtual Cluster**. Select **cluster-1** and click on
**Create App** to deploy the app profile onto the virtual cluster.

<br />

:::warning

If no clusters are displayed, then **cluster-1** is not yet available. Wait a few more moments and return to the above
steps. You can refresh the page, but you must fill out all the required input fields.

:::

The app profile deployment takes a few moments to finish. You can review the application's deployment progress by
navigating to the left **Main Menu** and selecting **Virtual Clusters**. Click on **cluster-1** to view its details
page. You can review cluster information, log events, access a remote shell session in the cluster, and more from the
cluster details page.

![Cluster details view displaying exposed services](/tutorials/deploy-app/devx_apps_deploy-apps_cluster-details-view.webp)

When the application is deployed and ready for use, the **Services** row on the details page will automatically be
updated by Palette with the app's public-facing URL. Click on the **:8080** link to view the application.

<br />

:::warning

It takes between one to three minutes for DNS to properly resolve the public load balancer URL. We recommend waiting a
few moments before clicking on the service URL to prevent the browser from caching an unresolved DNS request.

:::

![Hello Universe landing page displaying global clicks](/tutorials/deploy-app/devx_apps_deploy-apps_hello-universe.webp)

Welcome to [Hello Universe](https://github.com/spectrocloud/hello-universe), a demo application to help you learn more
about Palette and its features. Feel free to click on the logo to increase the global counter and for a fun image
change.

You have deployed your first application to Palette. Your first application is a single container application with no
upstream dependencies. In a production environment, you often deploy applications that consume other services and
require connectivity with other resources. The next scenario expands on the single application scenario by adding an API
server and Postgres database to simulate a common application architecture encountered in a production environment.

### Deploy Multiple Applications

Create another virtual cluster for the multi-application scenario. From the app mode landing page, navigate to the left
**Main Menu** and click on **Virtual Clusters**. Next, click on the **New Virtual Cluster** button.

Add the following details. Select your cluster group, name the cluster **cluster-2**, add the tag **scenario-2**, and
allocate 8 CPU, 12 GiB memory, and 12 GiB of storage. Click on **Deploy Virtual Cluster** after you have filled out all
the required information.

It will take a few minutes for the new virtual cluster to deploy. In the meantime, go ahead and navigate to the left
**Main Menu** and click on **App Profiles**.

### Postgres

Click on the **New App Profile** button to create your second app profile. Give the app profile the name
`hello-universe-complete` and add the tag `scenario-2`. Click on **Next**. This application profile will contain three
different applications, and you will create a service configuration for each. The three layers or tiers will together
make up the entire application deployment. The order in which you create each layer plays an important role, as it
dictates the deployment order. For this scenario, you will deploy the database, the API, and the UI. To create the first
layer, select the database service Postgres.

In the next screen, assign the following values to the Postgres database.

- Name: `postgres-db`

- Username: `pguser`

- Database Name: `counter`

- Database Volume Size: `2`

- Version: `14`

![Postgres service creation page](/tutorials/deploy-app/devx_apps_deploy-apps_postgres-service-create.webp)

Take note of the **Output Variables** section. The Postgres service exposes several output variables to help other
applications connect with the database. In the next section, you will use these output variables and other output
variables that Palette exposes for each service. You can learn more about output variables by reviewing the app profile
[output variables](../../profiles/app-profiles/app-profile-output-vars.md) documentation.

Next, navigate to the top left side of the wizard screen and click on the **Actions** button **+**. Go ahead and select
**Container Deployment**.

### API

The API is available as a container image. To deploy the API successfully, you need to provide the API server with
information about the database such as hostname, database user, database name, and password. The required information
can be retrieved using Palette's global output variables and the output variables the database service exposes.

Provide the container service with the following information:

- Container Name: `api`

- Registry: Public

- Image: `ghcr.io/spectrocloud/hello-universe-api:1.0.8`

- Network Access: Public

- Ports: `3000`

Assign the following environment variables to the API service:

| Parameter       | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| `DB_NAME`       | `counter`                                                          |
| `DB_HOST`       | `{{.spectro.app.$appDeploymentName.postgres-db.POSTGRESMSTR_SVC}}` |
| `DB_PASSWORD`   | `{{.spectro.app.$appDeploymentName.postgres-db.PASSWORD}}`         |
| `DB_INIT`       | `true`                                                             |
| `DB_USER`       | `{{.spectro.app.$appDeploymentName.postgres-db.USERNAME}}`         |
| `DB_ENCRYPTION` | `require`                                                          |
| `AUTHORIZATION` | `true`                                                             |

You can learn more about each environment variable's purpose by reviewing the API server's
[documentation](https://github.com/spectrocloud/hello-universe-api#environment-variables). One variable that you should
understand in greater detail is the `DB_HOST.` The value of this environment variable is constructed using the output
variables the Postgres service exposed. The `{{.spectro.app.$appDeploymentName.postgres-db.POSTGRESMSTR_SVC}}` variable
contains the Kubernetes DNS value of the Postgres service container.

<br />

:::info

To learn more about connecting different service layers, refer to the
[Service Connectivity](../../devx/services/connectivity.md) resource.

:::

A virtual cluster is a Kubernetes environment, and because it’s a Kubernetes environment, you can use the
[Kubernetes DNS](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/) record created for each
service and pod. You will have another opportunity to practice this concept when you deploy the UI.

When you have filled out all the required information, navigate to the top left side of the wizard screen and click on
the **Actions** button **+**. Select the **Container Deployment** to add the final service layer, the UI.

### UI

This time the UI will point to the API server that you manage. The API server has authentication enabled, so to ensure
all API requests are accepted you will provide the UI with the anonymous token.

![A diagram of the reverse proxy architecture](/tutorials/deploy-app/devx_apps_deploys-apps_reverse-proxy-diagram.webp)

Provide the UI container with the following information.

- Container Name: `ui`

- Registry: Public

- Image: `ghcr.io/spectrocloud/hello-universe:1.0.12`

- Network Access: Public

- Ports: `8080`

Assign the following environment variables to the UI service:

| Parameter | Value                                                                                |
| --------- | ------------------------------------------------------------------------------------ |
| `API_URI` | `http://{{.spectro.app.$appDeploymentName.api.CONTAINER_SVC_EXTERNALHOSTNAME}}:3000` |
| `TOKEN`   | `931A3B02-8DCC-543F-A1B2-69423D1A0B94`                                               |

If you want to explore the UI service's environment variables in greater detail, you can review the UI
[documentation](https://github.com/spectrocloud/hello-universe). The `API_URI` contains the address of the application
load balancer that will be deployed for the API service.

The output variable `{{.spectro.app.$appDeploymentName.api.CONTAINER_SVC_EXTERNALHOSTNAME}}` is used to retrieve the
load balancer URL value.

Click on the **Review** button at the bottom of the screen to finalize the app profile. Click on **Deploy New App** in
the following screen to deploy the new app profile to cluster-2.

Name the app `multiple-app-scenario`, select the app profile **hello-universe-complete**, pick version **1.0.0** and
toggle the radio button **Deploy In An Existing Palette Virtual Cluster**. Select **cluster-2** and click on **Create
App**.

<br />

:::warning

If cluster-2 is not displayed. Wait a few more moments and return to the above steps. You can refresh the page but you
must fill out all the required input fields.

:::

![App deployment cluster-2](/tutorials/deploy-app/devx_app_deploy-apps_cluster-2-deploy-app.webp)

The app profile deployment takes a few moments to finish. You can review the application's deployment progress by
navigating to the left **Main Menu** and selecting **Virtual Clusters**. Click on **cluster-2** to view its details
page.

Once the app is successfully deployed, the cluster details page will expose the public-facing URLs of the services.

![Cluster 2's details page](/tutorials/deploy-app/devx_apps_deploy-apps_cluster-2-details-page.webp)

Click on the UI’s service URL for port **8080** to access the Hello Universe application in a three-tier configuration.

![View of the self-hosted version of Hello Universe](/tutorials/deploy-app/devx_apps_deploy-app_self-hosted-hello-universe.webp)

The global counter is no longer available. Instead, you have a counter that starts at zero. Each time you click on the
center image, the counter is incremented and stored in the Postgres database along with metadata. Also, remember that
the reverse proxy injects the Bearer token value in each request sent to the API.

### Cleanup

To remove all resources created in this tutorial, begin by navigating to the left **Main Menu** and select **Apps**. For
each application, click on the **three-dots Menu** to expand the options menu and click on the **Delete** button. Repeat
this process for each application.

![Apps view with an arrow pointing towards the delete button](/tutorials/deploy-app/devx_apps_deploy-apps_delete-apps-view.webp)

Next, in the left **Main Menu**, click on the **Cluster** link to access the clusters page.

Click on **cluster-1** to access its details page. Click on **Settings** from the details page to expand the settings
menu. Click on **Delete** to delete the cluster. You will be asked to enter the cluster name to confirm the delete
action. Type the cluster name to proceed with the delete step. Repeat this process for cluster-2.

![Delete a cluster view with arrow](/tutorials/deploy-app/devx_apps_deploy-apps_delete-cluster-view.webp)

:::info

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for **Force Delete**. To trigger a
force delete, navigate to the respective cluster’s details page and click on **Settings**. Click on the **Force Delete
Cluster** to delete the cluster. Palette will automatically remove clusters stuck in the cluster deletion phase for over
24 hours.

:::

<br />

## Terraform Workflow

The [Spectro Cloud Terraform](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) provider
enables you to create and manage Palette resources in a codified manner by leveraging Infrastructure as Code (IaC).
There are many reasons why you would want to utilize IaC. A few reasons worth highlighting are: the ability to automate
infrastructure, improve collaboration related to infrastructure changes, self-document infrastructure through
codification, and track all infrastructure in a single source of truth. If you need to become more familiar with
Terraform, check out the [Why Terraform](https://developer.hashicorp.com/terraform/intro) explanation from HashiCorp.

<br />

:::info

As you go through the Terraform workflow, be aware that high-level concepts from Palette will not be discussed in-depth
to optimize the reader experience and focus more on the Terraform concepts that apply to Palette. To better understand
the mentioned Palette concepts, review the UI workflow where the concepts are explained in greater detail.

:::

<br />

<Tabs>

<TabItem label="Docker" value="docker">

Ensure Docker Desktop on your local machine is available. Use the following command and ensure you receive an output
displaying the version number.

<br />

```bash
docker version
```

<PartialsComponent category="tutorials" name="download-tutorials-image-docker" />

<PartialsComponent category="tutorials" name="run-tutorials-container-docker" />

Navigate to the tutorial code.

<br />

```shell
cd terraform/hello-universe-tf/
```

</TabItem>

<TabItem label="Podman" value="Podman">

If you are not running a Linux operating system, create and start the Podman Machine in your local environment.
Otherwise, skip this step.

```bash
podman machine init
podman machine start
```

Use the following command and ensure you receive an output displaying the installation information.

```bash
podman info
```

<PartialsComponent category="tutorials" name="download-tutorials-image-podman" />

<PartialsComponent category="tutorials" name="run-tutorials-container-podman" />

Navigate to the tutorial code.

<br />

```shell
cd terraform/hello-universe-tf/
```

</TabItem>

<TabItem label="Git" value="git">

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

<PartialsComponent category="tutorials" name="checkout-tutorials-tag" />

Change directory to the tutorial code.

<br />

```shell
cd terraform/hello-universe-tf/
```

</TabItem>
</Tabs>

Before you can get started with the Terraform code, you need a Spectro Cloud API key.

### API Key

To create an API key, log in to Palette, and click on the user **User Menu** and select **My API Keys**.

![Image that points to the user drop-down Menu and points to the API key link](/tutorials/deploy-app/devx_apps_deploy-app_create-api-key.webp)

Next, click on **Add New API Key**. Fill out the required input field, **API Key Name**, and the **Expiration Date**.
Click on **Confirm** to create the API key. Copy the key value to your clipboard, as you will use it shortly.

### Initialize Terraform

The tutorial folder contains several Terraform files that you should review and explore. Each file is named after the
respective type of Palette resource it supports. Use the following list to gain a high-level overview of the files.

<br />

- **provider.tf** - the provider configuration and version of the provider.
- **inputs.tf** - contains all the Terraform variables and the default values used in the tutorial.
- **outputs.tf** - contains the output variables that are used to expose information.
- **data.tf** - all the data resources that are used to dynamically retrieve data from Palette.
- **virtual-clusters.tf** - the code for the virtual clusters that will be deployed in Palette.
- **application-profiles.tf** - contains the configurations that make up all the app profiles.
- **application.tf** - the configuration that creates a Spectro Cloud app and deploys the app into a virtual cluster.

The [Spectro Cloud Terraform](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs) provider
requires credentials to interact with the Palette API. Export the API key as an environment variable so that the Spectro
Cloud provider can authenticate with the Palette API.

```shell
export SPECTROCLOUD_APIKEY=YourAPIKeyHere
```

To simplify future steps, export the name of the cluster group you want to deploy the virtual clusters to as an
environment variable.

```shell
export CLUSTER_GROUP_NAME=YourClusterGroupName
```

Next, initialize the Terraform provider by issuing the following command.

```shell
terraform init
```

```shell
Initializing the backend...

Initializing provider plugins...

Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.

If you ever set or change modules or backend configuration for Terraform,
rerun this command to reinitialize your working directory. If you forget, other
commands will detect it and remind you to do so if necessary.
```

The `init` command downloads all the required plugins and providers specified in **provider.tf** file. In the provider
configuration, the scope or context of Palette is set. The provider is configured for the `Default` project, but you can
change this value to point to any other projects you may have in Palette.

<br />

```hcl
terraform {
  required_providers {
    spectrocloud = {
      version = ">= 0.21.6"
      source  = "spectrocloud/spectrocloud"
    }
  }
}

provider "spectrocloud" {
  project_name = "Default"
}
```

To deploy the first scenario, a single application container, you must first create a configuration for the virtual
cluster. Look at the virtual cluster resources in **virtual-clusters.tf**, and check out the "cluster-1" resource. The
resource specifies the cluster name, the cluster group id, the resource limits, and the tags that will apply to the
cluster.

<br />

```hcl
resource "spectrocloud_virtual_cluster" "cluster-1" {
  name              = var.scenario-one-cluster-name
  cluster_group_uid = data.spectrocloud_cluster_group.cluster-group.id

  resources {
    max_cpu           = 4
    max_mem_in_mb     = 4096
    min_cpu           = 0
    min_mem_in_mb     = 0
    max_storage_in_gb = "2"
    min_storage_in_gb = "0"
  }

  tags = concat(var.tags, ["scenario-1"])

  timeouts {
    create = "15m"
    delete = "15m"
  }
}
```

The cluster group id is retrieved from the data resource `spectrocloud_cluster_group.beehive`. The data resource will
query the Palette API and retrieve information about the specified cluster group, which is the _beehive_ cluster group
made available for all Palette users. This resource will create a new virtual cluster that is hosted in the _beehive_
cluster group.

<br />

```hcl
data "spectrocloud_cluster_group" "cluster-group" {
  name = var.cluster-group-name
  context = "project"
}
```

Next, take a look at the **application-profiles.tf** file. The resource
`spectrocloud_application_profile.hello-universe-ui` is the resource responsible for creating the app profile for the
first scenario. There are several points of interest in this resource that you should be familiar with. Focus on these
five key points:

<br />

1. The pack object represents a single tier or layer in the app profile. Inside the pack object, you define all the
   attributes that make up the specific layer of the app profile.

2. The type of app layer. This application is hosted on a container image. Therefore a container pack is specified.
   Instead of hard coding the value, the data resource `data.spectrocloud_pack_simple.container_pack` is specified.

3. A pack requires a registry id. To create the app profile, Terraform needs to know what registry is hosting the pack.
   For containers, you can use the `Public Repo` hosting most of the Palette packs. This time the data resource
   `data.spectrocloud_registry.public_registry` is specified to avoid hardcoded values.

4. The attribute `source_app_tier` is used to specify the unique id of the pack. All packs are assigned a unique id,
   including different versions of a pack. To ensure the correct pack is selected, the data resource
   `data.spectrocloud_pack_simple.container_pack` is used.

5. The `values` attribute is used to specify the properties of the specific service. In this case, the properties of the
   container such as the image name, ports, and service type, are specified. These properties can be provided as an
   extended string using the
   [Terraform Heredoc strings](https://developer.hashicorp.com/terraform/language/expressions/strings#heredoc-strings),
   or you can specify these values as a JSON object.

<!-- vale off -->

<PointsOfInterest points={[
  { x: 105, y: 160, label: "1", description: "The pack object represents a single tier or layer in the app profile. Inside the pack object, you define all the attributes that make up the specific layer of the app profile.", },
  { x: 720, y: 230, label: 2, description: "The type of app tier or layer. This application is hosted on a container image. Therefore a container pack is specified. Instead of hard coding the value, the data resource data.spectrocloud_pack_simple.container_pack is specified", tooltipPlacement: "rightTop", }, { x: 720, y: 265, label: "3", description: "A pack requires a registry id. To create the app profile, Terraform needs to know what registry is hosting the pack. For containers, you can use the `Public Repo` hosting most of the Palette packs. This time the data resource data.spectrocloud_registry.container_registry is specified to avoid hardcoding values", tooltipPlacement: "rightTop", },
  { x: 720, y: 295, label: "4", description: "The attribute source_app_tier is used to specify the unique id of the pack. All packs are assigned a unique id, including different versions of a pack. To ensure the correct pack is selected, the data resource data.spectrocloud_pack_simple.container_pack is used.", tooltipPlacement: "rightTop", },
  { x: 290, y: 332, label: "5", description: "The values attribute is used to specify the properties of the specific service. In this case, the properties of the container, such as the image name, ports, and service type, are specified. These properties can be provided as an extended string using the Terraform Heredoc strings or you can alternatively specify these values as a stringified JSON object.", tooltipPlacement: "rightTop", },
]}>

<!-- vale on -->

```hcl
resource "spectrocloud_application_profile" "hello-universe-ui" {
  name        = "hello-universe-ui"
  description = "Hello Universe as a single UI instance"
  version     = "1.0.0"
  pack {
    name            = "ui"
    type            = data.spectrocloud_pack_simple.container_pack.type
    registry_uid    = data.spectrocloud_registry.public_registry.id
    source_app_tier = data.spectrocloud_pack_simple.container_pack.id
    values          = <<-EOT
        pack:
          namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
          releaseNameOverride: "{{.spectro.system.appdeployment.tiername}}"
        postReadinessHooks:
          outputParameters:
            - name: CONTAINER_NAMESPACE
              type: lookupSecret
              spec:
                namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
                secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
                ownerReference:
                  apiVersion: v1
                  kind: Service
                  name: "{{.spectro.system.appdeployment.tiername}}-svc"
                keyToCheck: metadata.namespace
            - name: CONTAINER_SVC
              type: lookupSecret
              spec:
                namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
                secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
                ownerReference:
                  apiVersion: v1
                  kind: Service
                  name: "{{.spectro.system.appdeployment.tiername}}-svc"
                keyToCheck: metadata.annotations["spectrocloud.com/service-fqdn"]
            - name: CONTAINER_SVC_EXTERNALHOSTNAME
              type: lookupSecret
              spec:
                namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
                secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
                ownerReference:
                  apiVersion: v1
                  kind: Service
                  name: "{{.spectro.system.appdeployment.tiername}}-svc"
                keyToCheck: status.load balancer.ingress[0].hostname
                conditional: true
            - name: CONTAINER_SVC_EXTERNALIP
              type: lookupSecret
              spec:
                namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
                secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
                ownerReference:
                  apiVersion: v1
                  kind: Service
                  name: "{{.spectro.system.appdeployment.tiername}}-svc"
                keyToCheck: status.load balancer.ingress[0].ip
                conditional: true
            - name: CONTAINER_SVC_PORT
              type: lookupSecret
              spec:
                namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
                secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
                ownerReference:
                  apiVersion: v1
                  kind: Service
                  name: "{{.spectro.system.appdeployment.tiername}}-svc"
                keyToCheck: spec.ports[0].port
        containerService:
            serviceName: "{{.spectro.system.appdeployment.tiername}}-svc"
            registryUrl: ""
            image: ${var.single-container-image}
            access: public
            ports:
              - "8080"
            serviceType: load balancer
    EOT
  }
  tags = concat(var.tags, ["scenario-1"])
}
```

</PointsOfInterest>

A tip for gathering the required values to provide the `values` attribute is to visit the Palette console and create the
app profile through the UI. During the app profile creation process, click on the API button to display the API payload.
Review the payload's `values` attribute to find all of the properties of the service. You can copy the entire string and
pass it to the resource `spectrocloud_application_profile` as an input for the `values` attribute.

![UI ability to display the API object](/tutorials/deploy-app/devx_apps_deploy-apps_ui-api-display.webp)

The last Terraform resource to review before deploying the application is located in the **application.tf** file. The
resource `spectrocloud_application.hello-universe-ui` is what creates the _app_. In Palette, an app combines a virtual
cluster and an app profile. When you deploy an app profile into a virtual cluster, you create an app. This resource
points to the app profile `spectrocloud_application_profile.hello-universe-ui` and the cluster resource
`spectrocloud_virtual_cluster.cluster-1`. The two resources are required to create an app.

<!-- vale off -->

<PointsOfInterest points={[
  { x: 810, y: 90, label: "1", description: "The id of the application profile that will be created with the resource spectrocloud_application_profile.hello-universe-ui.", },
  { x: 590, y: 230, label: "2", description: "The id of the virtual cluster that will be created with the resource spectrocloud_virtual_cluster.cluster-1.", tooltipPlacement: "rightTop", },
]}>

<!-- vale on -->

```hcl
resource "spectrocloud_application" "scenario-1" {
  name                    = "single-scenario"
  application_profile_uid = spectrocloud_application_profile.hello-universe-ui.id

  config {
    cluster_name      = spectrocloud_virtual_cluster.cluster-1.name
    cluster_uid = spectrocloud_virtual_cluster.cluster-1.id
    cluster_context = "project"
  }
  tags = concat(var.tags, ["scenario-1"])
}
```

Before deploying the application, use a terraform variable file to populate the cluster group name for the variable
`cluster-group-name`. Issue the following command to create the file.

```shell
echo "cluster-group-name = \"${CLUSTER_GROUP_NAME}\"" > terraform.tfvars
```

</PointsOfInterest>

Preview the resources Terraform will create by issuing the following command.

```shell
terraform plan
```

```
// Output condensed for readability
Plan: 3 to add, 0 to change, 0 to destroy.
```

The output displays the resources Terraform will create in an actual implementation. If you review the output, you will
find the three resources previously discussed in great detail.

Go ahead and deploy the application by using the `terraform apply` command.

```shell
terraform apply -auto-approve
```

```
// Output condensed for readability
Apply complete! Resources: 3 added, 0 changed, 0 destroyed.
```

Log in to [Palette](https://console.spectrocloud.com), navigate to the left **Main Menu**, and select **Apps**. Click on
the **scenario-1** row, which takes you to the application’s overview page. Once you are on the scenario-1 overview
page, click on the exposed URL for the service. A hyperlink for port 8080 is available.

![scenario-1 overview page with an arrow pointing to the URL](/tutorials/deploy-app/devx_app_deploy-apps_scenario-1-overview.webp)

<br />

:::warning

It takes between one to three minutes for DNS to properly resolve the public load balancer URL. We recommend waiting a
few moments before clicking on the service URL to prevent the browser from caching an unresolved DNS request.

:::

Welcome to Hello Universe, a demo application to help you learn more about Palette and its features. Feel free to click
on the logo to increase the global counter and for a fun image change.

![Hello Universe landing page displaying global clicks](/tutorials/deploy-app/devx_apps_deploy-apps_hello-universe.webp)

You have deployed your first app profile to Palette. Your first application is a single container application with no
upstream dependencies. In a production environment, you often deploy applications that consume other services and
require connectivity with other resources. The following scenario expands on the single application scenario by adding
an API server and Postgres database to simulate a common application architecture encountered in a production
environment.

### Deploy Multiple Applications

The second scenario contains two additional microservices, an API, and a Postgres database. This time, instead of using
a the global API for storing clicks, you will instead deploy your own API server and Postgres database. The following
diagram illustrates the network connectivity path and behavior discussed.

![A diagram of the three-tier architecture where the load balancer forwards all requests to the UI container OR the API container](/tutorials/deploy-app/devx_apps_deploys-apps_reverse-proxy-diagram.webp)

To deploy the second scenario, you will again deploy the same three resource types previously discussed but another
instance of them.

- `spectrocloud_virtual_cluster` - `cluster-2` - this resource will create the second virtual cluster.

- `spectrocloud_application_profile` - `hello-universe-complete` - the application profile that will contain the three
  different services, database, API, and UI.

- `spectrocloud_application` - `scenario-2` - the application that will be deployed into cluster-2 that uses the
  `spectrocloud_application_profile.hello-universe-complete` app profile.

You can review all the resources for the second scenario in the respective Terraform files. You can find the second
scenario code after the comment block in all of the files that have resources specific to the second scenario.

```hcl
##########################################
# Scenario 2: Multiple Applications
##########################################
```

From a Terraform perspective, there are no significant differences in the authoring experience. The main difference in
the second scenario lies in the application profile resource `spectrocloud_application_profile.hello-universe-complete`.
The other difference is that the virtual cluster you will deploy in the second scenario, cluster-2, is much larger than
cluster-1.

You can add multiple services to an app profile, but you must add a `pack {}` block for each service in the
`spectrocloud_application_profile` resource. Take a close look at the
`spectrocloud_application_profile.hello-universe-complete` resource below.

<br />

```hcl
resource "spectrocloud_application_profile" "hello-universe-complete" {
  count       = var.enable-second-scenario == true ? 1 : 0
  name        = "hello-universe-complete"
  description = "Hello Universe as a three-tier application"
  version     = "1.0.0"
  pack {
    name            = "postgres-db"
    type            = data.spectrocloud_pack_simple.postgres_service.type
    source_app_tier = data.spectrocloud_pack_simple.postgres_service.id
    properties = {
      "dbUserName"         = var.database-user
      "databaseName"       = var.database-name
      "databaseVolumeSize" = "8"
      "version"            = var.database-version
    }
  }
  pack {
    name            = "api"
    type            = data.spectrocloud_pack_simple.container_pack.type
    registry_uid    = data.spectrocloud_registry.public_registry.id
    source_app_tier = data.spectrocloud_pack_simple.container_pack.id
    values          = <<-EOT
pack:
  namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
  releaseNameOverride: "{{.spectro.system.appdeployment.tiername}}"
postReadinessHooks:
  outputParameters:
  - name: CONTAINER_NAMESPACE
    type: lookupSecret
    spec:
      namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
      secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
      ownerReference:
        apiVersion: v1
        kind: Service
        name: "{{.spectro.system.appdeployment.tiername}}-svc"
      keyToCheck: metadata.namespace
  - name: CONTAINER_SVC
    type: lookupSecret
    spec:
      namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
      secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
      ownerReference:
        apiVersion: v1
        kind: Service
        name: "{{.spectro.system.appdeployment.tiername}}-svc"
      keyToCheck: metadata.annotations["spectrocloud.com/service-fqdn"]
  - name: CONTAINER_SVC_EXTERNALHOSTNAME
    type: lookupSecret
    spec:
      namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
      secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
      ownerReference:
        apiVersion: v1
        kind: Service
        name: "{{.spectro.system.appdeployment.tiername}}-svc"
      keyToCheck: status.load balancer.ingress[0].hostname
      conditional: true
  - name: CONTAINER_SVC_EXTERNALIP
    type: lookupSecret
    spec:
      namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
      secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
      ownerReference:
        apiVersion: v1
        kind: Service
        name: "{{.spectro.system.appdeployment.tiername}}-svc"
      keyToCheck: status.load balancer.ingress[0].ip
      conditional: true
  - name: CONTAINER_SVC_PORT
    type: lookupSecret
    spec:
      namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
      secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
      ownerReference:
        apiVersion: v1
        kind: Service
        name: "{{.spectro.system.appdeployment.tiername}}-svc"
      keyToCheck: spec.ports[0].port
containerService:
  serviceName: "{{.spectro.system.appdeployment.tiername}}-svc"
  registryUrl: ""
  image: ${var.multiple_container_images["api"]}
  access: public
  ports:
    - "3000"
  serviceType: load balancer
  env:
    - name: DB_HOST
      value: "{{.spectro.app.$appDeploymentName.postgres-db.POSTGRESMSTR_SVC}}"
    - name: DB_USER
      value: "{{.spectro.app.$appDeploymentName.postgres-db.USERNAME}}"
    - name: DB_PASSWORD
      value: "{{.spectro.app.$appDeploymentName.postgres-db.PASSWORD}}"
    - name: DB_NAME
      value: counter
    - name: DB_INIT
      value: "true"
    - name: DB_ENCRYPTION
      value: "${var.database-ssl-mode}"
    - name: AUTHORIZATION
      value: "true"
    EOT
  }
  pack {
    name            = "ui"
    type            = data.spectrocloud_pack_simple.container_pack.type
    registry_uid    = data.spectrocloud_registry.public_registry.id
    source_app_tier = data.spectrocloud_pack_simple.container_pack.id
    values          = <<-EOT
        pack:
          namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
          releaseNameOverride: "{{.spectro.system.appdeployment.tiername}}"
        postReadinessHooks:
          outputParameters:
            - name: CONTAINER_NAMESPACE
              type: lookupSecret
              spec:
                namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
                secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
                ownerReference:
                  apiVersion: v1
                  kind: Service
                  name: "{{.spectro.system.appdeployment.tiername}}-svc"
                keyToCheck: metadata.namespace
            - name: CONTAINER_SVC
              type: lookupSecret
              spec:
                namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
                secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
                ownerReference:
                  apiVersion: v1
                  kind: Service
                  name: "{{.spectro.system.appdeployment.tiername}}-svc"
                keyToCheck: metadata.annotations["spectrocloud.com/service-fqdn"]
            - name: CONTAINER_SVC_EXTERNALHOSTNAME
              type: lookupSecret
              spec:
                namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
                secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
                ownerReference:
                  apiVersion: v1
                  kind: Service
                  name: "{{.spectro.system.appdeployment.tiername}}-svc"
                keyToCheck: status.load balancer.ingress[0].hostname
                conditional: true
            - name: CONTAINER_SVC_EXTERNALIP
              type: lookupSecret
              spec:
                namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
                secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
                ownerReference:
                  apiVersion: v1
                  kind: Service
                  name: "{{.spectro.system.appdeployment.tiername}}-svc"
                keyToCheck: status.load balancer.ingress[0].ip
                conditional: true
            - name: CONTAINER_SVC_PORT
              type: lookupSecret
              spec:
                namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
                secretName: "{{.spectro.system.appdeployment.tiername}}-custom-secret"
                ownerReference:
                  apiVersion: v1
                  kind: Service
                  name: "{{.spectro.system.appdeployment.tiername}}-svc"
                keyToCheck: spec.ports[0].port
        containerService:
          serviceName: "{{.spectro.system.appdeployment.tiername}}-svc"
          registryUrl: ""
          image: ${var.multiple_container_images["ui"]}
          access: public
          ports:
            - "8080"
          env:
            - name: "API_URI"
              value: "http://{{.spectro.app.$appDeploymentName.api.CONTAINER_SVC_EXTERNALHOSTNAME}}:3000"
            - name: "TOKEN"
              value: "${var.token}"
          serviceType: load balancer
    EOT
  }
  tags = concat(var.tags, ["scenario-2"])
}
```

Each service has its own `pack {}` and a set of unique properties and values.

The database service block uses a different data resource, `data.spectrocloud_pack_simple.postgres_service`, to find the
Postgres service. If you review the data resource, you will find a different type, `operator-instance`. The Postgres
service uses a Postgres [operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) to manage the
database inside the virtual cluster.

<br />

```
data "spectrocloud_pack_simple" "postgres_service" {
  name         = "postgresql-operator"
  type         = "operator-instance"
  version      = "1.8.2"
  registry_uid = data.spectrocloud_registry.public_registry.id
}
```

Inside the `pack {}` block, the database services uses the `properties` attribute instead of the `values` attribute. The
`properties` values provided are the same properties you must fill out when creating the database service through the UI
workflow.

<br />

```hcl
 pack {
    name            = "postgres-db"
    type            = data.spectrocloud_pack_simple.postgres_service.type
    source_app_tier = data.spectrocloud_pack_simple.postgres_service.id
    properties = {
      "dbUserName"         = var.database-user
      "databaseName"       = var.database-name
      "databaseVolumeSize" = "8"
      "version"            = var.database-version
    }
  }
```

If you go further down the app profile stack, you will find the `pack {}` object for the API. A good part of the content
provided to the `values` attribute will be removed in the following code snippet to improve readability. Take a closer
look at the `env` block inside the `containerService` section. The API server requires a set of environment variables to
start properly, such as the database hostname, user, password, and more. The Postgres service lower in the app profile
stack exposes output variables you can use to provide information to other services higher up in the app profile stack.

The `env` section uses the output variables exposed by the Postgres service. Other environment variables specified will
be populated during Terraform runtime because they reference Terraform variables. Palette will populate the environment
variables referencing a Palette output variable at runtime inside the virtual cluster.

<br />

```hcl
pack {
    name            = "api"
    type            = data.spectrocloud_pack_simple.container_pack.type
    registry_uid    = data.spectrocloud_registry.public_registry.id
    source_app_tier = data.spectrocloud_pack_simple.container_pack.id
    values          = <<-EOT
pack:
  namespace: "{{.spectro.system.appdeployment.tiername}}-ns"
  releaseNameOverride: "{{.spectro.system.appdeployment.tiername}}"
postReadinessHooks:
  outputParameters:
  #....
  #...
containerService:
  serviceName: "{{.spectro.system.appdeployment.tiername}}-svc"
  registryUrl: ""
  image: ${var.multiple_container_images["api"]}
  access: public
  ports:
    - "3000"
  serviceType: load balancer
  env:
    - name: DB_HOST
      value: "{{.spectro.app.$appDeploymentName.postgres-db.POSTGRESMSTR_SVC}}"
    - name: DB_USER
      value: "{{.spectro.app.$appDeploymentName.postgres-db.USERNAME}}"
    - name: DB_PASSWORD
      value: "{{.spectro.app.$appDeploymentName.postgres-db.PASSWORD}}"
    - name: DB_NAME
      value: counter
    - name: DB_INIT
      value: "true"
    - name: DB_ENCRYPTION
      value: "${var.database-ssl-mode}"
    - name: AUTHORIZATION
      value: "true"
    EOT
  }
```

The last `pack {}` block in the app profile resource `spectrocloud_application_profile.hello-universe-complete` is for
the UI. Like the API service, environment variables are used to initialize the UI and the reverse proxy. The UI service
requires the URL of the API service and the URL of the public-facing load balancer. Palette output variables are used to
populate these two environment variables. A Terraform variable will populate the authentication token required for all
API requests.

<br />

```hcl
pack {
    name            = "ui"
    type            = data.spectrocloud_pack_simple.container_pack.type
    registry_uid    = data.spectrocloud_registry.public_registry.id
    source_app_tier = data.spectrocloud_pack_simple.container_pack.id
    values          = <<-EOT
        # ....
        # ....
        containerService:
            serviceName: "{{.spectro.system.appdeployment.tiername}}-svc"
            registryUrl: ""
            image: ${var.multiple_container_images["ui"]}
            access: public
            ports:
              - "8080"
            env:
              - name: "API_URI"
                value: "http://{{.spectro.app.$appDeploymentName.api.CONTAINER_SVC_EXTERNALHOSTNAME}}:3000"
              - name: "TOKEN"
                value: "${var.token}"
            serviceType: load balancer
    EOT
  }
```

:::info

All container services expose their service address, Kubernetes hostname, and the exposed service ports as output
variables. You will use output variables frequently when creating app profiles. You can learn more about connecting
services by referring to the [Service Connectivity](../../devx/services/connectivity.md) documentation.

:::

Open the **inputs.tf** file and set the `variable enable-second-scenario"` default value to `true`.

<br />

```terraform
variable "enable-second-scenario" {
  type        = bool
  description = "Whether to enable the second scenario"
  default     = true
}
```

Next, issue the command `terraform apply` to deploy the second scenario. Notice how the `-var` flag is included with the
token value in the command.

<br />

```shell
terraform apply -var="token=931A3B02-8DCC-543F-A1B2-69423D1A0B94" -auto-approve
```

```
// Output condensed for readability
Apply complete! Resources: 3 added, 0 changed, 0 destroyed.
```

Log in to [Palette](https://console.spectrocloud.com) and navigate to the left **Main Menu**, click on **Apps**. Select
the **scenario-2** row. When you are on the scenario-2 overview page, click on the exposed URL for the service. A
hyperlink for port 8080 and port 3000 is available.

![A view of the scenario-2 overview page](/tutorials/deploy-app/devx_apps_deploy_scenario-2-overview.webp)

Click on the UI’s service URL for port **8080** to access the Hello Universe application in a three-tier configuration.

<br />

:::warning

It takes between one to three minutes for DNS to properly resolve the public load balancer URL. We recommend waiting a
few moments before clicking on the service URL to prevent the browser from caching an unresolved DNS request.

:::

![View of the self-hosted hello universe app](/tutorials/deploy-app/devx_apps_deploy-app_self-hosted-hello-universe.webp)

The global counter is no longer available. Instead, you have a counter that starts at zero. Each time you click on the
center image, the counter is incremented and stored in the Postgres database along with metadata.

### Cleanup

To remove all resources created in this tutorial, issue the `terraform destroy` command.

<br />

```shell
terraform destroy -var="token=931A3B02-8DCC-543F-A1B2-69423D1A0B94" -auto-approve
```

```shell
Destroy complete! Resources: 6 destroyed.
```

<br />

If you are using the tutorial container and want to exit the container, type `exit` in your terminal session and press
the **Enter** key. Next, issue the following command to stop the container.

<br />

<Tabs>

<TabItem label="Docker" value="Docker">

<PartialsComponent category="tutorials" name="stop-tutorials-container-docker" />

</TabItem>

<TabItem label="Podman" value="Podman">

<PartialsComponent category="tutorials" name="stop-tutorials-container-podman" />

</TabItem>

</Tabs>

:::info

If a cluster remains in the delete phase for over 15 minutes, it becomes eligible for **Force Delete**. To trigger a
force delete, navigate to the respective cluster’s details page and click on **Settings**. Click on the **Force Delete
Cluster** to delete the cluster. Palette will automatically remove clusters stuck in the cluster deletion phase for over
24 hours.

:::

## Wrap-Up

In this tutorial, you learned about Palette’s Dev Engine and App Mode. You deployed two virtual clusters, each
containing a different architecture and configuration of the Hello Universe application. Palette’s Dev Engine enables
developers to quickly deploy applications into a Kubernetes environment without requiring Kubernetes knowledge. In a
matter of minutes, you deployed a new Kubernetes cluster and all its applications without having to write Kubernetes
configuration files.

To learn more about Palette Dev Engine and its capabilities, check out the references resource below.

- [Palette Modes](../../introduction/palette-modes.md)
- [Spectro Cloud Terraform Provider](https://registry.terraform.io/providers/spectrocloud/spectrocloud/latest/docs)
- [App Profiles](../../profiles/app-profiles/app-profiles.md)
- [App Services](../../devx/services/services.md)
- [Palette Virtual Clusters](../../devx/palette-virtual-clusters/palette-virtual-clusters.md)
- [Hello Universe GitHub respository](https://github.com/spectrocloud/hello-universe)
