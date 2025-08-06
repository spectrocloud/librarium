---
sidebar_label: "Deploy to VMware vSphere"
title: "Deploy to VMware vSphere"
description: "Steps to deploy a PCG cluster to VMware vSphere"
hide_table_of_contents: false
sidebar_position: 30
tags: ["pcg"]
---

This guide provides you with the steps to deploy a PCG cluster to a VMware vSphere environment. Before you begin the
installation, carefully review the [Prerequisites](#prerequisites) section.

:::further

Refer to our [Deploy App Workloads with a PCG](../../../tutorials/cluster-deployment/pcg/deploy-app-pcg.md) tutorial for
detailed guidance on how to deploy app workloads with a PCG.

:::

## Prerequisites

:::info

If you are using a self-hosted Palette instance or Palette VerteX, and you deployed the instance to a VMware vSphere
environment, then you already have all the required permissions and roles. Proceed to the installation steps in the
[Deploy PCG](#deploy-pcg) guide.

:::

- Palette version 4.0.X or greater.

- A Palette API key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  page for guidance.

  :::warning

  The installation does not work with Single Sign-On (SSO) credentials. You must use an API key from a local tenant
  admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no
  longer used to keep the PCG connected to Palette, so you can deactivate the account if desired.

  :::

- Download and install the Palette CLI from the [Downloads](../../../downloads/cli-tools.md#palette-cli) page. Refer to
  the [Palette CLI Install](../../../automation/palette-cli/install-palette-cli.md) guide to learn more.

- You will need to provide the Palette CLI an encryption passphrase to secure sensitive data. The passphrase must be
  between 8 to 32 characters long and contain a capital letter, a lowercase letter, a digit, and a special character.
  Refer to the [Palette CLI Encryption](../../../automation/palette-cli/palette-cli.md#encryption) section for more
  information.

The following system requirements must be met to install a PCG in VMware vSphere:

- PCG IP address requirements:

  - One IP address for a single-node PCG or three IP addresses for a three-node PCG. Refer to the
    [PCG Sizing](./deploy-pcg.md#pcg-sizing) section for more information on sizing.
  - One IP address reserved for cluster repave operations.
  - One IP address for the Virtual IP (VIP).
  - DNS can resolve the domain `api.spectrocloud.com`.
  - NTP server is reachable from the PCG.

- A PCG requires the following minimum resources:

  - CPU: 4
  - Memory: 4 GiB
  - Storage: 60 GiB

  For production environments, we recommend using three nodes, each with 8 CPU, 8 GiB of memory, and 100 GiB of storage.
  Nodes can exhaust the 60 GiB storage with prolonged use. If you initially set up the gateway with one node, you can
  resize it at a later time.

- An x86 Linux environment with an installed Docker daemon and connections to Palette and the VMware vSphere endpoint.
  The Palette CLI installation must be invoked on an up-to-date Linux system with an x86-64 architecture.

Before installing the PCG on VMware, review the following system requirements and permissions. The vSphere user account
used to deploy the PCG must have the required permissions to access the proper roles and objects in vSphere.

Start by reviewing the required action items below:

1. Create two custom vSphere roles. Check out the [Create Required Roles](#create-required-roles) section to create the
   required roles in vSphere.

2. Review the [vSphere Permissions](#vsphere-permissions) section to ensure the created roles have the required vSphere
   privileges and permissions.

3. Create node zones and regions for your Kubernetes clusters. Refer to the [Zone Tagging](#zone-tagging) section to
   ensure that the required tags are created in vSphere to ensure proper resource allocation across fault domains.

### Create Required Roles

Palette requires two custom roles to be created in vSphere before the PCG installation. Refer to the
[Create a Custom Role](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-18071E9A-EED1-4968-8D51-E0B4F526FDA3.html?hWord=N4IghgNiBcIE4HsIFMDOIC+Q)
guide if you need help creating a custom role in vSphere. The required custom roles are:

- A root-level role with access to higher-level vSphere objects. This role is referred to as the _Spectro root role_.
  Check out the [Root-Level Role Privileges](../../data-center/vmware/permissions.md#spectro-root-role-privileges) table
  for the list of privileges required for the root-level role.

- A role with the required privileges for deploying VMs. This role is referred to as the _Spectro role_. Review the
  [Spectro Role Privileges](../../data-center/vmware/permissions.md#spectro-role-privileges) table for the list of
  privileges required for the Spectro role.

The user account you use to deploy the PCG must have access to both roles. Each vSphere object required by Palette must
have a
[Permission](https://docs.vmware.com/en/VMware-vSphere/6.5/com.vmware.vsphere.security.doc/GUID-4B47F690-72E7-4861-A299-9195B9C52E71.html)
entry for the respective Spectro role. The following tables list the privileges required for each custom role.

:::info

For an in-depth explanation of vSphere authorization and permissions, check out the
[Understanding Authorization in vSphere](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-security/GUID-74F53189-EF41-4AC1-A78E-D25621855800.html)
resource.

:::

### vSphere Permissions

<details>
    <summary>Click to reveal all required vSphere permissions</summary>
      <PartialsComponent category="permissions" name="vsphere-permissions" />

</details>

### Zone Tagging

You can use tags to create node zones and regions for your Kubernetes clusters. The node zones and regions can be used
to dynamically place Kubernetes workloads and achieve higher availability. Kubernetes nodes inherit the zone and region
tags as [Labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). Kubernetes workloads can
use the node labels to ensure that the workloads are deployed to the correct zone and region.

The following is an example of node labels that are discovered and inherited from vSphere tags. The tag values are
applied to Kubernetes nodes in vSphere.

| **Label**                                  | **Value** |
| ------------------------------------------ | --------- |
| `topology.kubernetes.io/region`            | `usdc`    |
| `topology.kubernetes.io/zone`              | `zone3`   |
| `failure-domain.beta.kubernetes.io/region` | `usdc`    |
| `failure-domain.beta.kubernetes.io/zone`   | `zone3`   |

:::info

To learn more about node zones and regions, refer to the
[Node Zones/Regions Topology](https://cloud-provider-vsphere.sigs.k8s.io/cloud_provider_interface.html) section of the
Cloud Provider Interface documentation.

:::

Zone tagging is required to install Palette and is helpful for Kubernetes workloads deployed in vSphere clusters through
Palette if they have persistent storage needs. Use vSphere tags on data centers and compute clusters to create distinct
zones in your environment. You can use vSphere
[Tag Categories and Tags](https://docs.vmware.com/en/VMware-vSphere/8.0/vsphere-vcenter-esxi-management/GUID-16422FF7-235B-4A44-92E2-532F6AED0923.html)
to create zones in your vSphere environment and assign them to vSphere objects.

The zone tags you assign to your vSphere objects, such as a data center and clusters, are applied to the Kubernetes
nodes you deploy through Palette into your vSphere environment. Kubernetes clusters deployed to other infrastructure
providers, such as public cloud, may have other native mechanisms for auto discovery of zones.

For example, assume a vCenter environment contains three compute clusters, cluster-1, cluster-2, and cluster-3. To
support this environment you create the tag categories `k8s-region` and `k8s-zone`. The `k8s-region` is assigned to the
data center, and the `k8s-zone` tag is assigned to the compute clusters.

The following table lists the tag values for the data center and compute clusters.

| **vSphere Object** | **Assigned Name** | **Tag Category** | **Tag Value** |
| ------------------ | ----------------- | ---------------- | ------------- |
| **Datacenter**     | dc-1              | k8s-region       | region1       |
| **Cluster**        | cluster-1         | k8s-zone         | az1           |
| **Cluster**        | cluster-2         | k8s-zone         | az2           |
| **Cluster**        | cluster-3         | k8s-zone         | az3           |

Create a tag category and tag values for each data center and cluster in your environment. Use the tag categories to
create zones. Use a name that is meaningful and that complies with the tag requirements listed in the following section.

#### Tag Requirements

The following requirements apply to tags:

- A valid tag must consist of alphanumeric characters.

- The tag must start and end with alphanumeric characters.

- The regex used for tag validation is `(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])?`.

## Deploy PCG

1.  In an x86 Linux host with the Palette CLI installed, open up a terminal session.

2.  Set your Palette CLI encryption passphrase value in an environment variable. Use the following command to set the
    passphrase. Replace `*************` with your passphrase.

    ```shell
    export PALETTE_ENCRYPTION_PASSWORD=*************
    ```

3.  Issue the following command to authenticate with Palette. When prompted, enter the required information. Refer to
    the table below for information about each parameter.

    ```shell
    palette login
    ```

    | **Parameter**                  | **Description**                                                                                                                                                                                                                                                    |
    | :----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Spectro Cloud Console**      | Enter the Palette endpoint URL. When using the Palette SaaS service, enter `https://console.spectrocloud.com`. When using a self-hosted instance of Palette, enter the URL for that instance.                                                                      |
    | **Allow Insecure Connection**  | Enabling this option bypasses x509 server Certificate Authority (CA) verification. Enter `y` if you are using a self-hosted Palette or VerteX instance with self-signed TLS certificates and need to provide a file path to the instance CA. Otherwise, enter `n`. |
    | **Spectro Cloud API Key**      | Enter your Palette API Key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md) guide to create an API key.                                                                                                           |
    | **Spectro Cloud Organization** | Select your Palette Organization name.                                                                                                                                                                                                                             |
    | **Spectro Cloud Project**      | Select the project for which you want to register the VMware vSphere account.                                                                                                                                                                                      |
    | **Acknowledge**                | Accept the login banner message. Login banner messages are only displayed if the tenant admin enabled a login banner.                                                                                                                                              |

    :::info

    The `CloudAccount.apiKey` and `Mgmt.apiKey` values in the **pcg.yaml** file are encrypted and cannot be manually
    updated. To change these values, use the `palette pcg install --update-passwords` command. Refer to the
    [PCG command](../../../automation/palette-cli/commands/pcg.md#update-passwords) reference page for more information.

    :::

4.  Once you have authenticated successfully, start the PCG installer by issuing the following command. Refer to the
    table below for information about each parameter.

    ```bash
    palette pcg install
    ```

    | **Parameter**                                        | **Description**                                                                                                                                                                                                                                                                    |
    | :--------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Management Plane Type**                            | Select Palette or VerteX.                                                                                                                                                                                                                                                          |
    | **Enable Ubuntu Pro (required for production)**      | Enter `y` if you want to use Ubuntu Pro and provide an Ubuntu Pro token. Otherwise, enter `n`.                                                                                                                                                                                     |
    | **Select an image registry type**                    | For a non-airgap installation, choose `Default` to pull images from public image registries. This requires an internet connection. For an airgap installation, select `Custom` and point to our airgap support VM or a custom internal registry that contains the required images. |
    | **Cloud Type**                                       | Choose VMware vSphere.                                                                                                                                                                                                                                                             |
    | **Private Cloud Gateway Name**                       | Enter a custom name for the PCG. Example: `vmware-pcg-1`.                                                                                                                                                                                                                          |
    | **Share PCG Cloud Account across platform Projects** | Enter `y` if you want the Cloud Account associated with the PCG to be available from all projects within your organization. Enter `n` if you want the Cloud Account to only be available at the tenant admin scope.                                                                |

5.  Next, provide environment configurations for the cluster. Refer to the following table for information about each
    option.

    <PartialsComponent category="pcg" name="proxy-certificate-propagation" />

6.  If you selected `Custom` for the image registry type, you will be prompted to provide the following information.

    | **Parameter**                                            | **Description**                                                                                                                                                                                                                                                    |
    | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Registry Name**                                        | Assign a name to the custom registry.                                                                                                                                                                                                                              |
    | **Registry Endpoint**                                    | The endpoint or IP address for the custom registry. Example: `https://palette.example.com` or `https://10.10.1.0`.                                                                                                                                                 |
    | **Registry Base Content Path**                           | The base content path for the custom registry. Example: `spectro-images`.                                                                                                                                                                                          |
    | **Configure Registry Mirror**                            | Your system default text editor, such as Vi, will open up and allow you to customize the default mirror registry settings. Add any additional registry mirrors you want to add. Otherwise, press `Esc` and then `:wq` to save and exit the file.                   |
    | **Allow Insecure Connection (Bypass x509 Verification)** | Enabling this option bypasses x509 CA verification. Enter `n` if using a custom registry with self-signed SSL certificates. Otherwise, enter `y`. If you enter `y`, you will receive a follow-up prompt asking you to provide the file path to the CA certificate. |
    | **Registry CA certificate Filepath**                     | The CA certificate for the custom registry. This is optional. Provide the file path of the CA certificate on the installer host. Example: `/usr/local/share/ca-certificates/ca.crt`.                                                                               |
    | **Registry Username**                                    | The username for the custom registry.                                                                                                                                                                                                                              |
    | **Password**                                             | The password for the custom registry.                                                                                                                                                                                                                              |

7.  The next set of prompts is for configuring connection details for the vSphere environment. The CLI will use this
    information to establish a network connection to the vSphere environment and query the vSphere API to retrieve
    information about the environment. The information retrieved is used in the next step to select target resources.

    | **Parameter**                                            | **Description**                                                                                                                                                                                                                                                    |
    | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **vSphere Endpoint**                                     | The vSphere endpoint. You can specify a Full Qualified Domain Name (FQDN) or an IP address. Make sure you specify the endpoint without the HTTP scheme `https://` or `http://`. Example: `vcenter.mycompany.com`.                                                  |
    | **vSphere Username**                                     | The vSphere account username.                                                                                                                                                                                                                                      |
    | **vSphere Password**                                     | The vSphere account password.                                                                                                                                                                                                                                      |
    | **Allow Insecure Connection (Bypass x509 Verification)** | Enabling this option bypasses x509 CA verification. Enter `n` if using a custom registry with self-signed SSL certificates. Otherwise, enter `y`. If you enter `y`, you will receive a follow-up prompt asking you to provide the file path to the CA certificate. |

8.  Next, fill out the VMware resource configurations. Refer to the following table for information about each option.

    | **Parameter**                                            | **Description**                                                                                                                                                                                                                                                               |
    | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Datacenter**                                           | The vSphere data center to target when deploying the PCG cluster.                                                                                                                                                                                                             |
    | **Folder**                                               | The folder to target when deploying the PCG cluster.                                                                                                                                                                                                                          |
    | **Network**                                              | The port group to which the PCG cluster will be connected.                                                                                                                                                                                                                    |
    | **Resource Pool**                                        | The resource pool to target when deploying the PCG cluster.                                                                                                                                                                                                                   |
    | **Cluster**                                              | The compute cluster to use for the PCG deployment.                                                                                                                                                                                                                            |
    | **Select specific Datastore or use a VM Storage Policy** | Select the datastore or VM Storage policy to apply to the PCG cluster.                                                                                                                                                                                                        |
    | **Datastore**                                            | The datastore to use for the PCG deployment.                                                                                                                                                                                                                                  |
    | **Add another Fault Domain**                             | Specify any fault domains you would like to use.                                                                                                                                                                                                                              |
    | **NTP Servers**                                          | Specify the IP address for any Network Time Protocol (NTP) servers the PCG cluster can reference. We recommend you specify at least one NTP server.                                                                                                                           |
    | **SSH Public Keys**                                      | Provide the public OpenSSH key for the PCG cluster. Use this key when establishing an SSH connection with the PCG cluster. This prompt will result in the default text editor for the Operating System to open. Vi is the more common text editor used in Linux environments. |
    | **Number of Nodes**                                      | The number of nodes that will make up the cluster. Available options are **1** or **3**. We recommend three nodes for a High Availability (HA) cluster in a production environment.                                                                                           |

9.  Specify the IP pool configuration. You have the option to select a static placement or use Dynamic Host
    Configuration Protocol (DHCP). With static placement, an IP pool is created, and the PCG VMs are assigned IP
    addresses from the selected pool. With DHCP, PCG VMs are assigned IP addresses via DNS. Review the following tables
    to learn more about each parameter.

    :::warning

    If you select **Static Placement**, you must create a PCG IPAM pool before deploying clusters. Refer to the
    [Create and Manage IPAM Node Pools](../manage-pcg/create-manage-node-pool.md) for guidance on how to create an IPAM
    pool.

    :::

    ##### Static Placement Configuration

    | **Parameter**                              | **Description**                                                                                                                    |
    | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
    | **IP Start range**                         | Enter the first address in the PCG IP pool range.                                                                                  |
    | **IP End range**                           | Enter the last address in the PCG IP pool range.                                                                                   |
    | **Network Prefix**                         | Enter the network prefix for the IP pool range. Valid values are network CIDR subnet masks from the range `0 - 32`. Example: `18`. |
    | **Gateway IP Address**                     | Enter the IP address of the IP gateway.                                                                                            |
    | **Name servers**                           | Comma-separated list of DNS name server IP addresses.                                                                              |
    | **Name server search suffixes (optional)** | Comma-separated list of DNS search domains.                                                                                        |

    ##### DHCP Placement Configuration

    | **Parameter**      | **Description**                             |
    | ------------------ | ------------------------------------------- |
    | **Search domains** | Comma-separated list of DNS search domains. |

10. Specify the cluster boot configuration.

    | **Parameter**                             | **Description**                                                                                                                                                |
    | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Patch OS on boot**                      | This parameter indicates whether or not to patch the OS of the PCG hosts on the first boot.                                                                    |
    | **Reboot nodes once OS patch is applied** | This parameter indicates whether or not to reboot PCG nodes after OS patches are complete. This only applies if the **Patch OS on boot** parameter is enabled. |

11. Enter the vSphere Machine configuration for the Private Cloud Gateway. We recommend `M` or greater for production
    workloads.

    | **Parameter** | **Description**                                                                                                                                                                                                                                                 |
    | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **S**         | 4 CPU, 4 GB of Memory, and 60 GB of Storage                                                                                                                                                                                                                     |
    | **M**         | 8 CPU, 8 GB of Memory, and 100 GB of Storage                                                                                                                                                                                                                    |
    | **L**         | 16 CPU, 16 GB of Memory, and 120 GB of Storage                                                                                                                                                                                                                  |
    | **Custom**    | Specify a custom configuration. If you select `Custom`, you will be prompted to enter the number of CPUs, memory, and storage to allocate to the PCG VM. Refer to the [Custom Machine Configuration](#custom-machine-configuration) table for more information. |

    #### Custom Machine Configuration

    | **Parameter** | **Description**                                           |
    | ------------- | --------------------------------------------------------- |
    | **CPU**       | The number of CPUs in the Virtual Machine.                |
    | **Memory**    | The number of memory to allocate to the Virtual Machine.  |
    | **Storage**   | The amount of storage to allocate to the Virtual Machine. |

12. Specify the node affinity configuration.

    | **Parameter**     | **Description**                                                   |
    | ----------------- | ----------------------------------------------------------------- |
    | **Node Affinity** | Enter `y` to schedule all Palette pods on the control plane node. |

13. A new PCG configuration file is generated, and its location is displayed on the console. You will receive an output
    similar to the following.

    ```bash hideClipboard
    ==== PCG config saved ====
    Location: :/home/demo/.palette/pcg/pcg-20230706150945/pcg.yaml
    ```

    The Palette CLI will now provision a PCG cluster in your VMware environment. You can monitor the progress of the PCG
    cluster by navigating to Palette and selecting **Tenant Settings** from the left **Main Menu**. Next, click on
    **Private Cloud Gateways** from the left **Tenant Settings Menu** and select the PCG cluster you just deployed to
    access its details page. From the details page, select the **Events** tab to view the progress of the PCG cluster
    deployment.

    If you encounter issues during the installation, refer to the [PCG Troubleshooting](../../../troubleshooting/pcg.md)
    guide for debugging assistance. If you need additional help, reach out to our
    [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) team.

    :::warning

    You cannot modify a deployed PCG cluster. If you need to make changes to the PCG cluster, you must first delete the
    cluster and redeploy it. We recommend you save your PCG configuration file for future use. Use the `--config-only`
    flag to save the configuration file without deploying the PCG cluster. Refer to the
    [Generate a Configuration File](../../../automation/palette-cli/commands/pcg.md#generate-a-configuration-file)
    section to learn more. For additional assistance, visit our
    [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) portal.

    :::

14. To avoid potential vulnerabilities, once the installation is complete, remove the `kind` images that were installed
    in the environment where you initiated the installation.

    Issue the following command to list all instances of `kind` that exist in the environment.

    ```shell
    docker images
    ```

    ```shell
    REPOSITORY     TAG        IMAGE ID       CREATED        SIZE
    kindest/node   v1.26.13   131ad18222cc   5 months ago   910MB
    ```

    Then, use the following command template to remove all instances of `kind`.

    ```shell
    docker image rm kindest/node:<version>
    ```

    Consider the following example for reference.

    ```shell
    docker image rm kindest/node:v1.26.13
    ```

    ```shell
    Untagged: kindest/node:v1.26.13
    Untagged: kindest/node@sha256:15ae92d507b7d4aec6e8920d358fc63d3b980493db191d7327541fbaaed1f789
    Deleted: sha256:131ad18222ccb05561b73e86bb09ac3cd6475bb6c36a7f14501067cba2eec785
    Deleted: sha256:85a1a4dfc468cfeca99e359b74231e47aedb007a206d0e2cae2f8290e7290cfd
    ```

## Validate

Once installed, the PCG registers itself with Palette. To verify the PCG is registered, use the following steps.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**.

3. From the **Tenant Settings Menu**, click on **Private Cloud Gateways**. Verify your PCG cluster is available from the
   list of PCG clusters displayed and that its **Status** is healthy.

4. Navigate to the left **Tenant Settings Menu** and select **Cloud Accounts**.

5. Verify a new VMware cloud account is available from the list of cloud accounts displayed.

## Next Steps

After you have successfully deployed the PCG into your VMware vSphere environment, you can now deploy clusters into your
VMware vSphere environment. If you selected **Static Placement**, make sure you define an IP Address Management (IPAM)
node pool that Kubernetes clusters deployed in vSphere can use. To learn more about creating and defining node pools,
refer to the [Create and Manage IPAM Node Pools](../manage-pcg/create-manage-node-pool.md) documentation.
