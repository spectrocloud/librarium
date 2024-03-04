---
sidebar_label: "Deploy App Workloads with a PCG"
title: "Deploy App Workloads with a PCG"
description:
  "Learn how to deploy a Private Cloud Gateway (PCG) to connect your data center or private cloud environment to
  Palette. This tutorial teaches you how to launch a PCG, create a data center cluster, and deploy a demo application."
hide_table_of_contents: false
toc_min_heading_level: 2
toc_max_heading_level: 2
sidebar_position: 50
tags: ["pcg"]
---

Palette Private Cloud Gateway (PCG) is a crucial infrastructure support component that acts as a bridge between your
private cloud environment or data center and Palette.

A PCG is required in environments lacking direct network access to Palette. For example, many infrastructure
environments reside within private networks that restrict external connections, preventing Palette from reaching them.
Upon installation, the PCG acts as an endpoint, enabling Palette to securely deploy and delete Kubernetes clusters
within your private cloud environment or data center. Refer to the [PCG Architecture](./architecture.md) section for
more information.

Typically, a PCG is used with Palette SaaS and self-hosted Palette instances that do not have direct access to the
target environment. However, when direct network connectivity is available, a System Private Gateway is recommended. You
can refer to the [System Private Gateway](./architecture.md/#system-private-gateway) section to learn more about it.

A PCG comprises a cluster of nodes and can be deployed by two methods. These include using the
[Palette CLI](./deploy-pcg/) for VMware vSphere, MAAS, or OpenStack environments, or deploying it
[manually onto an existing Kubernetes cluster](./deploy-pcg-k8s.md).

In this tutorial, you will deploy a VMware PCG using Palette CLI. Next, you will learn how to deploy a VMware cluster
with a sample Kubernetes application called
[Hello Universe](https://github.com/spectrocloud/hello-universe#hello-universe), utilizing either Palette or Terraform.

The following diagram illustrates the components that will be deployed and how they communicate with each other.

![An architecture diagram of PCG](/clusters_pcg_architecture_overview_diagram.png)

## Prerequisites

To complete this tutorial, you will need the following items in place.

    - A Palette account with [tenant admin](../../tenant-settings/tenant-settings.md) access.
    - A Palette API key. Refer to the [Create API Key](../../user-management/authentication/api-key/create-api-key.md) page for instructions on how to create an API key.
    - A [VMware vSphere](https://docs.vmware.com/en/VMware-vSphere/index.html) user account with the required [permissions](../data-center/vmware.md/#vsphere-permissions), [roles](../data-center/vmware.md/#spectro-role-privileges), and [zone tagging](../data-center/vmware.md/#zone-tagging) defined.
    - A Linux x86-64 machine with access to a terminal and to the internet, and connection to Palette and to the VMware vSphere endpoint.
    - An SSH key pair. Use the [Create and Upload an SSH Key](../cluster-management/ssh-keys.md) guide to learn how to create an SSH key and upload it to Palette.
    - The following IP address requirements must be met on VMware vSphere:
        - One IP address available for a single-node PCG or three IP addresses for a three-node PCG. Refer to the [PCG Sizing](./manage-pcg/scale-pcg-nodes.md) section for more information on sizing.
        - One IP address reserved for cluster repave operations.
        - One IP address for the Virtual IP (VIP).
        - DNS must be able to resolve the domain `api.spectrocloud.com`.
        - NTP server must be reachable from the PCG.
    - The following minimum resources must be available on VMware vSphere:
        - CPU: 4 cores.
        - Memory: 4 GiB.
        - Storage: 60 GiB.

        :::info

        In production environments, we recommend deploying a three-node PCG, each node with 8 cores of CPU, 8 GiB of memory, and 100 GiB of storage.

        :::

    The following software installed.
    - [Palette CLI](../../palette-cli/install-palette-cli.md).
    - [Docker](https://docs.docker.com/desktop).
    - [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation).
    - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
    - [Terraform CLI](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) v1.4.0 or greater, if you choose to follow along with the Terraform workflow.

## Authenticate with Palette

The first step to deploy a PCG using Palette CLI is to authenticate with your Palette environment using the
[`palette login`](../../palette-cli/commands/login.md) command.

In your terminal, execute the following command.

```bash
palette login
```

Once issued, you will be prompted for a few parameters to complete the authentication. The table below displays the
required parameters along with the values that will be utilized in this tutorial. If the parameter is specific to your
environment and Palette account, such as your Palette API key, enter the value according to your environment. Access the
[Deploy a PCG to VMware vSphere](../pcg/deploy-pcg/vmware.md) guide for more information about each option.

| **Parameter**                  | **Value**                                                                                                        | **Specific** |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------ |
| **Spectro Cloud Console**      | `https://console.spectrocloud.com`. If using a self-hosted instance of Palette, enter the URL for that instance. | No           |
| **Allow Insecure Connection**  | `Y`                                                                                                              | No           |
| **Spectro Cloud API Key**      | Enter your Palette API Key.                                                                                      | Yes          |
| **Spectro Cloud Organization** | Select your Palette Organization name.                                                                           | Yes          |
| **Spectro Cloud Project**      | `None (TenantAdmin)`                                                                                             | No           |
| **Acknowledge**                | `Y`                                                                                                              | No           |

After accepting the login banner message, you will get the following output confirming you have successfully
authenticated with Palette.

```text hideClipboard
Welcome to Spectro Cloud Palette
```

The video below demonstrates Palette's authentication process. Ensure to use the values that are appropriate for your
environment.

(TERMINAL RECORDING HERE)

## Deploy a PCG with Palette CLI

After authenticating with Palette, you can now proceed with the PCG creation. Issue the command below to start the PCG
installation process.

```bash
palette pcg install
```

:::info

Optionally, you can use the command `palette pcg install` with the flag `--config-only` to generate a configuration
file. The generated configuration file is named **pcg.yaml** and it is located at the home directory in the folder path
**.palette/pcg**. Then, you can utilize the configuration file to install a PCG with pre-defined values. Refer to the
[Palette CLI PCG Commands](../../palette-cli/commands/pcg.md) page to learn more about the `pcg` command.

:::

The `palette pcg install` command will prompt you for information regarding your PCG cluster, vSphere environment, and
VMware resource configurations. The sequence of tables below display the required parameters along with the values that
will be used in this tutorial. When prompted, enter the provided values. If the parameter is specific to your
environment, such as your vSphere endpoint, enter the value according to your environment. Refer to the
[Deploy a PCG to VMware vSphere](../pcg/deploy-pcg/vmware.md) guide to learn more about each parameter.

:::info

The PCG to be deployed in this tutorial is for educational purposes only and is not recommended for use in production
environments.

:::

1. **PCG General Information**

   Provide the PCG general information such as the **Cloud Type** and **Private Cloud Gateway Name** according to the
   table below.

   | **Parameter**                                        | **Value**             | **Specific** |
   | :--------------------------------------------------- | --------------------- | ------------ |
   | **Management Plane Type**                            | `Palette`             | No           |
   | **Enable Ubuntu Pro (required for production)**      | `N`                   | No           |
   | **Select an image registry type**                    | `Default`             | No           |
   | **Cloud Type**                                       | `VMware vSphere`      | No           |
   | **Private Cloud Gateway Name**                       | `vmware-pcg-tutorial` | No           |
   | **Share PCG Cloud Account across platform Projects** | `Y`                   | No           |

2. **Environment Configuration**

   Enter the environment configuration information, such as the **Pod CIDR** and **Service IP Range** according to the
   table below.

   | **Parameter**        | **Value**                                                                                                           | **Specific** |
   | :------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------ |
   | **HTTPS Proxy**      | Skip.                                                                                                               | No           |
   | **HTTP Proxy**       | Skip.                                                                                                               | No           |
   | **Pod CIDR**         | `172.16.0.0/20`. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.     | No           |
   | **Service IP Range** | `10.155.0.0/24`. The service IP addresses should be unique and not overlap with any machine IPs in the environment. | No           |

3. **vSphere Account Information**

   Enter the information specific to your vSphere account.

   | **Parameter**                                            | **Value**                                                                                                                                                                                                         | **Specific** |
   | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
   | **vSphere Endpoint**                                     | The vSphere endpoint. You can specify a Full Qualified Domain Name (FQDN) or an IP address. Make sure you specify the endpoint without the HTTP scheme `https://` or `http://`. Example: `vcenter.mycompany.com`. | Yes          |
   | **vSphere Username**                                     | The vSphere account username.                                                                                                                                                                                     | Yes          |
   | **vSphere Password**                                     | The vSphere account password.                                                                                                                                                                                     | Yes          |
   | **Allow Insecure Connection (Bypass x509 Verification)** | `Y`                                                                                                                                                                                                               | No           |

4. **vSphere Cluster Configuration**

   Enter the PCG cluster configuration as for example the vSphere **Resource Pool** to be targeted by the PCG cluster.

   | **Parameter**                                            | **Value**                                                        | **Specific** |
   | -------------------------------------------------------- | ---------------------------------------------------------------- | ------------ |
   | **Datacenter**                                           | The vSphere Datacenter to target when deploying the PCG cluster. | Yes          |
   | **Folder**                                               | The folder to target when deploying the PCG cluster.             | Yes          |
   | **Network**                                              | The port group to which the PCG cluster will be connected.       | Yes          |
   | **Resource Pool**                                        | The resource pool to target when deploying the PCG cluster.      | Yes          |
   | **Cluster**                                              | The compute cluster to use for the PCG deployment.               | Yes          |
   | **Select specific Datastore or use a VM Storage Policy** | `Datastore`                                                      | No           |
   | **Datastore**                                            | The datastore to use for the PCG deployment.                     | Yes          |
   | **Add another Fault Domain**                             | `N`                                                              | No           |
   | **NTP Servers**                                          | Skip.                                                            | No           |
   | **SSH Public Keys**                                      | Provide the public OpenSSH key to connect to the PCG cluster.    | Yes          |

5. **PCG Cluster Size**

   This tutorial will deploy a one-node PCG with dynamic IP placement (DDNS). If needed, you can convert a single-node
   PCG to a multi-node PCG to provide additional capacity. Refer to the
   [Increase PCG Node Count](./manage-pcg/scale-pcg-nodes.md) guide to learn more about it.

   | **Parameter**       | **Value**                                                                     | **Specific** |
   | ------------------- | ----------------------------------------------------------------------------- | ------------ |
   | **Number of Nodes** | `1`                                                                           | No           |
   | **Placement Type**  | `DDNS`                                                                        | No           |
   | **Search domains**  | Comma-separated list of DNS search domains. For example, `spectrocloud.test`. | Yes          |

6. **Cluster Settings**

   Set the parameter **Patch OS on boot** as `N`, which means the OS of the PCG hosts will not be patch on the first
   boot.

   | **Parameter**        | **Value** | **Specific** |
   | -------------------- | --------- | ------------ |
   | **Patch OS on boot** | `N`       | No           |

7. **vSphere Machine Configuration**

   Set the size of the PCG as small as this PCG will not be used in production environments.

   | **Parameter** | **Value**                                     | **Specific** |
   | ------------- | --------------------------------------------- | ------------ |
   | **S**         | `4 CPU, 4 GB of Memory, and 60 GB of Storage` | No           |

8. **Node Affinity Configuration Information**

   Set node affinity as `N`, which means that there is no affinity between Palette pods and control plane nodes.

   | **Parameter**     | **Value** | **Specific** |
   | ----------------- | --------- | ------------ |
   | **Node Affinity** | `N`       | No           |

After finishing answering the prompts, a new PCG configuration file is generated and its location displayed on the
console.

```text hideClipboard
==== PCG config saved ==== Location: :/home/demo/.palette/pcg/pcg-20230706150945/pcg.yaml
```

Next, Palette CLI will create a local kind cluster that will be used to bootstrap the PCG cluster deployment in your
VMware environment. Once installed, the PCG registers itself with Palette and creates a VMware cloud account with the
same name of the PCG.

The following recording showcases the `pcg install --config-only` command with the set of prompts that needs to be
answered in order to deploy a PCG cluster.

((VIDEO RECORDING))

You can monitor the creation of the PCG cluster by logging in to Palette, switching to the **Tenan Admin** scope, and
clicking on **Tenant Settings** from the left **Main Menu**. Next, click on **Private Cloud Gateways** from the left
**Tenant Settings Menu** and select the PCG cluster you just deployed to access its **Overview** page. From the
**Overview** page, select the **Events** tab to view the progress of the PCG cluster deployment.

((IMAGE PCG TAB??))

### Validate

Log in to Palette as a tenant admin, navigate to the left **Main Menu** and select **Tenant Settings**. Next, click on
**Private Cloud Gateways** from the **Tenant Settings Menu** and check if the PCG you created is displayed in the list
of PCG clusters. Click on your PCG and verify that its cluster status is **Running** and it is **Healthy**.

((IMAGE PCG HEALTH))

## Create a Cluster Profile and Deploy a Cluster

Once you have successfully deployed the PCG, create a cluster profile with the
[hello-universe](hhttps://github.com/spectrocloud/hello-universe) application and use it to deploy a VMware cluster.
This tutorial provides two different workflows: Palette User Interface (UI) and Terraform.

<Tabs groupId="deploy-pcg">

<TabItem label="UI Workflow" value="UI_Workflow">

### Create a Cluster Profile

Log in to Palette and select **Profiles** from the left **Main Menu** to view the cluster profile page and the available
cluster profiles. Click on the **Add Cluster Profile** button and follow the wizard to create a new cluster profile.

((IMAGE CLUSTER PROFILE CREATION))

**Basic Information**

Complete the **Basic Information** section with the information provided below.

| **Field**   | **Value**                                                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name        | `pcg-tutorial-profile`                                                                                                                                      |
| Version     | `1.0.0`                                                                                                                                                     |
| Description | Cluster profile as part of the Deploy App Workloads with a PCG tutorial.                                                                                    |
| Type        | Full                                                                                                                                                        |
| Tags        | `spectro-cloud-education`, `app:hello-universe`, `terraform_managed:false`, `repository:spectrocloud:tutorials`, `tutorial:DEPLOY_APP_WORKLOADS_WITH_A_PCG` |

Click on **Next** to continue.

**Cloud Type**

In the **Cloud Type** section, select VMware as the infrastructure provider, and click **Next** to proceed.

**Profile Layers**

Add the core infrastructure layers displayed below to your profile.

| Pack Name          | Version | Layer            |
| ------------------ | ------- | ---------------- |
| ubuntu-vsphere LTS | 22.4.x  | Operating System |
| kubernetes         | 1.28.x  | Kubernetes       |
| cni-calico         | 3.26.x  | Network          |
| csi-vsphere-csi    | 3.0.x   | Storage          |

As you add each layer, click on the **Next Layer** button. After adding the storage layer, click on the **Confirm**
button to complete the core infrastructure stack.

Next, click on the **Add New Pack** button to include add-on layers to your cluster profile.

Add the MetalLB (Helm) pack to your profile. The MetalLB pack will provide a load-balancer implementation for your
VMware cluster, as VMware does not offer a load balancer solution natively. You will need a load balancer to help the
LoadBalancer service specified in the Hello Universe application manifest obtain an IP address, so that you can access
the application on your browser. Refer to the Metallb (LINK TO METALLB PACK) guide to learn more about the pack.

| Pack Name       | Version | Layer         |
| --------------- | ------- | ------------- |
| lb-metallb-helm | 0.13.x  | Load Balancer |

Now, click on **Values** under **Pack Details** and replace the `192.168.10.0/24` IP CIDR listed below the **addresses**
line with a valid IP address or range of IP addresses for your load balancer. This will be the address that will be used
to access the Hello Universe application, and it can be a private IP address of your VMware environment, for example.
Click on the **Confirm & Create** button to finish adding the Metallb pack.

((FOTO IP ADDR METALLB))

Finally, click again on the **Add New Pack** button to add the Hello Universe pack.

| Pack Name      | Version | Layer       |
| -------------- | ------- | ----------- |
| hello-universe | 1.1.x   | App Service |

Click on the **Confirm & Create** button and then click **Next**.

**Review**

The review section displays the cluster layers you selected. Click on **Finish Configuration** to complete the cluster
profile creation.

((IMAGE CLUSTER PROFILE CREATION))

### Create a VMware Cluster

Navigate to the left **Main Menu** and select **Profiles**. Click on the cluster profile you created previously. Next,
click on the **Deploy** button and then **OK** to start the cluster deployment using the selected cluster profile.

((IMAGE DEPLOY BUTTON))

**Basic Information**

Use the following values for the **Basic Information** section.

| **Field**       | **Value**                                                                                                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster name    | `pcg-tutorial-cluster`                                                                                                                                                                               |
| Description     | Cluster as part of the Deploy App Workloads with a PCG tutorial.                                                                                                                                     |
| Tags            | `spectro-cloud-education`, `app:hello-universe`, `terraform_managed:false`, `repository:spectrocloud:tutorials`, `tutorial:DEPLOY_APP_WORKLOADS_WITH_A_PCG`                                          |
| Type of cluster | Datacenter                                                                                                                                                                                           |
| Cloud Account   | Select the VMware cloud account that was registered with Palette during the PCG creation. The cloud account has the same name of the PCG. In this tutorial, the cloud account is called `gateway-1`. |

**Parameters**

The **Parameters** section displays all the layers in the cluster profile and allows you to change the profile
configurations if needed. Click on **Next** to proceed.

**Cluster Configuration**

In the **Cluster Config** section, fill in the fields with the information specific to your VMware vSphere enviroment.
First, select the **Datacenter** and the **Deployment Folder** where the cluster nodes will be launched. Next, select
the **Image Template Folder** to which the Spectro templates are imported and the **SSH key** that will be used to
access the cluster nodes. Finally, select **DHCP** as the **Network Type**. Click Next to proceed to the **Nodes
Configuration** section.

**Nodes Configuration**

Provide the details for the nodes of the control plane and worker pools.

| **Field**                   | **Control Plane Pool** | **Worker Pool** |
| --------------------------- | ---------------------- | --------------- |
| Node pool name              | control-plane-pool     | worker-pool     |
| Number of nodes in the pool | `1`                    | `1`             |
| Allow worker capability     | No                     | Not applicable  |
| Enable Autoscaler           | Not applicable         | No              |
| Rolling update              | Not applicable         | Expand First    |

Keep the **Cloud Configuration** the same for both pools, with **CPU** set to 4 cores, **memory** allocated at 8 GB, and
**disk** space at 60 GB. Next, populate the **Compute cluster**, **Resource Pool**, **Datastore**, and **Network**
fields according to your VMware vSphere environment. Click **Next** to continue.

**Settings**

The **Settings** section provides advanced options for OS patching, scheduled scans, scheduled backups, and cluster role
binding. Use the default values, and click on the **Validate** button.

**Review**

The **Review** section allows you to review the cluster configuration before deployng the cluster. If everything is
correct, click on **Finish Configuration** to start the cluster deployment, which may take up to 20 minutes.

((IMAGE REVIEW PAGE))

Now, navigate to the left **Main Menu** and click on **Clusters**. While the deployment is in progress, Palette displays
the cluster status as **Provisioning**. You can select your cluster and explore the cluster information such as the
deployment status and event logs.

((IMAGE CLUSTER PROVISIONING))

</TabItem>

<TabItem label="Terraform Workflow" value="Terraform_Workflow">

### Set Up Local Environment

Open a terminal window and clone the Spectro Cloud [Tutorials](https://github.com/spectrocloud/tutorials) repository
from GitHub.

```bash
git clone https://github.com/spectrocloud/tutorials.git
```

Change the directory to the **/terraform/vmware-cluster-deployment-tf** directory, which contains the Terraform code for
this tutorial.

```bash
cd terraform/vmware-cluster-deployment-tf
```

Next, copy your Palette API key and issue the following command to export it as an environment variable. Replace
`YourAPIKeyHere` with your API key.

```bash
export SPECTROCLOUD_APIKEY=YourAPIKeyHere
```

### Create a Cluster Profile and Deploy a VMware Cluster

We recommend that you explore all Terraform files available in the directory. Below is a high-level overview of each
file.

- **profile.tf** - contains the configuration for the `spectrocloud_cluster_profile` resource. The following layers will
  be added to the profile.

| Pack Name          | Version | Layer            |
| ------------------ | ------- | ---------------- |
| ubuntu-vsphere LTS | 22.4.x  | Operating System |
| kubernetes         | 1.28.x  | Kubernetes       |
| cni-calico         | 3.26.x  | Network          |
| csi-vsphere-csi    | 3.0.x   | Storage          |
| lb-metallb-helm    | 0.13.x  | Load Balancer    |
| hello-universe     | 1.1.x   | App Service      |

The MetalLB pack will provide a load-balancer implementation for your VMware cluster, as VMware does not offer a load
balancer solution natively. You will need a load balancer to help the LoadBalancer service specified in the Hello
Universe application manifest obtain an IP address, so that you can access the application on your browser. Refer to the
Metallb (LINK TO METALLB PACK) guide to learn more about the pack.

- **cluster.tf** - This file contains the configuration for the `spectrocloud_cluster_vsphere` resource.

- **data.tf** - This file has the required configuration for the resources to retrieve data from Palette dynamically.

- **inputs.tf** - This file contains the variables used in the tutorial, such as the pcg name, SSH key, and vSphere
  information.

- **outputs.tf** - This file contains output variables responsible to output information to the terminal once the
  resources are created, such as the location of the SSH key and the command to use to SSH to your cluster nodes.

- **provider.tf** - This file contains the Terraform providers and their respective versions.

- **ssh-key.tf** - This file contains the resources to generate an SSH key pair in case the user does not provide one.

- **ippool.tf** - This file contains the resources required for static IP placement deployments. You will note that the
  resource `spectrocloud_privatecloudgateway_ippool` is currently commented out as this tutorial uses dynamic IP
  placement.

- **terraform.tfvars** - This file contains the variable definitions. Open the **terraform.tfvars** file in the editor
  of your choice and provide the values for the variables required for the deployment according to the table below.

| Variable Name      | Description                                                                                | Required |
| ------------------ | ------------------------------------------------------------------------------------------ | -------- |
| metallb_ip         | Provide a valid IP address or a range of IP addresses for your Metallb Load Balancer.      | Yes      |
| pcg_name           | Provide the name of the PCG that will be used to deploy the Palette cluster.               | Yes      |
| datacenter_name    | Provide the name of the PCG that will be used to deploy the Palette cluster.               | Yes      |
| folder_name        | Provide the name of the folder in vSphere.                                                 | Yes      |
| search_domain      | Provide the name of the network search domain.                                             | Yes      |
| vsphere_cluster    | Provide the cluster name for the machine pool as it appears in vSphere.                    | Yes      |
| datastore_name     | Provide the datastore name for the machine pool as it appears in vSphere.                  | Yes      |
| network_name       | Provide the network name for the machine pool as it appears in vSphere.                    | Yes      |
| resource_pool_name | Provide the resource pool name for the machine pool as it appears in vSphere.              | Yes      |
| ssh_key            | Provide the path to your public SSH key. If not provided, a new key pair will be created.  | No       |
| ssh_key_private    | Provide the path to your private SSH key. If not provided, a new key pair will be created. | No       |

When you are ready making the required changes, execute the following command to initialize Terraform.

```bash
terraform init
```

The `init` command will download the plugins and providers defined in the **provider.tf** file.

Next, issue the `terraform plan` command to preview the resources that Terraform will create.

```bash
terraform plan
```

The output displays the resources that Terraform will create in an actual implementation, including the cluster profile,
VMware vSphere cluster, and a new SSH key pair if the keys were not provided.

```text hideClipboard
# Output condensed for readability
Plan: 5 to add, 0 to change, 0 to destroy.
```

Issue the `terraform apply` command to deploy the resources to your VMware vSphere environment.

```bash
terraform apply -auto-approve
```

It can take up to 20 minutes to complete the cluster deployment process. Once the cluster provisioning is complete, the
following output will be displayed.

```text hideClipboard
# Output condensed for readability
Apply complete! Resources: 5 added, 0 to changed, 0 to destroyed.
```

Now, log in to Palette, navigate to the left **Main Menu** and click on **Clusters**. While the deployment is in
progress, Palette displays the cluster status as **Provisioning**.

((IMAGE CLUSTER PROVISIONING))

You can select the `pcg-tutorial-cluster` and explore the cluster information such as the deployment status and event
logs.

</TabItem>

</Tabs>

## Validate

In Palette, navigate to the left **Main Menu** and click on **Clusters**. Select the `pcg-tutorial-cluster` to display
the cluster's **Overview** page. Once the cluster status displays **Running** and **Healthy**, you can access the
application through the exposed service URL along with the displayed port number. Click on the URL for port **:8080** to
access the Hello Universe application landing page.

((IMAGE HELLO UNI APPLICATION))

You have successfully deployed your first application to a VMware cluster managed by Palette.

## Clean Up

The following steps will guide you to clean up your environment after completing the tutorial. Follow the steps below to
delete the PCG, the cluster profile, and the VMware cluster.

### Delete the Cluster Profile and Cluster

<Tabs groupId="deploy-pcg">

<TabItem label="UI Workflow" value="UI_Workflow">

In Palette, navigate to the left **Main Menu**, click on **Clusters** and select the `pcg-tutorial-cluster` to access
its details page. Next, click on the **Settings** button to expand the **drop-down Menu**, and select the **Delete
Cluster** option. Palette will prompt you to enter the cluster name to confirm the deletion.

(((IMAGE CLUSTER DELETION)))

The cluster status will display **Deleting**, and the deletion may take up to 15 minutes.

Once the cluster is deleted, proceed to delete the cluster profile. In the left **Main Menu**, click on **Profiles** and
select the profile `pcg-tutorial-profile`. Next, click on the **three-dot Menu**, select the **Delete** option and
confirm the selection to remove the cluster profile.

</TabItem>

<TabItem label="Terraform Workflow" value="Terraform_Workflow">

Issue the `terraform destroy` command within the **/terraform/vmware-cluster-deployment-tf** directory to remove all the
resources that were created through Terraform.

```bash
terraform destroy --auto-approve
```

Deleting the resources may take up to 15 minutes. Upon deletion, you should receive an output similar to the provided
below.

```text hideClipboard
# Output condensed for readability
Destroy complete! Resources: 5 destroyed.
```

</TabItem>

</Tabs>

### Delete the PCG

After deleting your VMware cluster and cluster profile, proceed with the PCG deletion. Log in to Palette as a tenant
admin, navigate to the left **Main Menu** and select **Tenant Settings**. Next, on the **Tenant Settings Menu**, select
**Private Cloud Gateways**. Identify the PCG you want to delete, click on the **Three-Dot Menu** at the end of the PCG
row, and select **Delete**. Click **OK** to confirm the PCG deletion.

((IMAGE PCG DELETION))

Palette will delete the PCG and the Palette services deployed on the PCG node. However, the underlying infrastructure
resources, such as the virtual machine, must be removed manually from VMware vSphere.

Log in to your VMware vSphere server and select the VM that composes the PCG node named `gateway-1-cp`. Click on the
**Three-Dot Actions** button, select **Power**, and **Power Off** to power off the machine. Once the machine is powered
off, click on the **Three-Dot Actions** button again and select **Delete from Disk** to remove the machine from your
VMware vSphere environment.

((IMAGE VSPHERE VM DELETION))

## Wrap-Up

In this tutorial, you learned how to deploy a VMware PCG using Palette CLI. After the PCG deployment, you utilized it to
deploy a Palette cluster with a sample Kubernetes application to your VMware vSphere environment. Next, you accessed the
Hello Universe application landing page through the exposed service URL.

A PCG is a powerful component that enables Palette to communicate with private clouds or data center environments that
restrict external connections. Through the PCG, you can deploy Palette clusters in environments such as VMware vSphere,
securing lifecycle support and monitoring for your clusters.

We encourage you to check out the reference resources below to learn more about PCGs.

- [Private Cloud Gateway](./pcg.md)
- [PCG Architecture](architecture.md)
- [Deploy a PCG to VMware vSphere](./deploy-pcg/vmware.md)
- [Manage PCG](./manage-pcg/)
