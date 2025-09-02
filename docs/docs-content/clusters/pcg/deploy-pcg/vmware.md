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

Refer to our [Deploy App Workloads with a PCG](../../../tutorials/clusters/pcg/deploy-app-pcg.md) tutorial for detailed
guidance on how to deploy app workloads with a PCG.

:::

## Prerequisites

:::info

If you are using a self-hosted Palette instance or Palette VerteX, and you deployed the instance to a VMware vSphere
environment, then you already have all the required permissions and roles. Proceed to the installation steps in the
[Deploy PCG](#deploy-pcg) guide.

:::

- A Palette API key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  page for guidance.

  :::warning

  The installation does not work with Single Sign-On (SSO) credentials. You must use an API key from a local tenant
  admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no
  longer used to keep the PCG connected to Palette, so you can deactivate the account if desired.

  :::

- Download and install the Palette CLI from the [Downloads](../../../spectro-downloads.md#palette-cli) page. Refer to
  the [Palette CLI Install](../../../automation/palette-cli/install-palette-cli.md) guide to learn more.

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

<PartialsComponent category="pcg" name="pcg-initial-installation" edition="VMware vSphere" />

8.  Next, fill out the VMware resource configurations.

    | **Parameter**                                            | **Description**                                                                                                                                                                                                                                              |
    | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Datacenter**                                           | Enter the vSphere data center to target when deploying the PCG cluster.                                                                                                                                                                                      |
    | **Folder**                                               | Enter the folder to target when deploying the PCG cluster.                                                                                                                                                                                                   |
    | **Network**                                              | Enter the port group to connect the PCG cluster to.                                                                                                                                                                                                          |
    | **Resource Pool**                                        | Enter the resource pool to target when deploying the PCG cluster.                                                                                                                                                                                            |
    | **Cluster**                                              | Enter the compute cluster to use for the PCG deployment.                                                                                                                                                                                                     |
    | **Select specific Datastore or use a VM Storage Policy** | Enter the datastore or VM Storage policy to apply to the PCG cluster.                                                                                                                                                                                        |
    | **Datastore**                                            | Enter the datastore to use for the PCG deployment.                                                                                                                                                                                                           |
    | **Add another Fault Domain**                             | Specify any fault domains you would like to use.                                                                                                                                                                                                             |
    | **NTP Servers**                                          | Specify the IP address for any Network Time Protocol (NTP) servers the PCG cluster can reference. We recommend you specify at least one NTP server.                                                                                                          |
    | **SSH Public Key**                                       | Provide the public OpenSSH key for the PCG cluster. Use this key when establishing an SSH connection with the PCG cluster. Your system default text editor, such as Vi, will open and prompt you to enter the SSH key. Save and exit the file when finished. |
    | **Number of Nodes**                                      | Enter the number of nodes that will make up the cluster. Available options are **1** or **3**. We recommend three nodes for a High Availability (HA) cluster in a production environment.                                                                    |

9.  Specify the IP pool configuration. You have the option to select a static placement or use Dynamic Domain Name
    Service (DDNS). With static placement, an IP pool is created, and the PCG VMs are assigned IP addresses from the
    selected pool. With DDNS, PCG VMs are assigned IP addresses via DNS. Review the following tables to learn more about
    each parameter.

    :::warning

    If you select **Static Placement**, you must create a PCG IPAM pool before deploying clusters. Refer to the
    [Create and Manage IPAM Node Pools](../manage-pcg/create-manage-node-pool.md) guide for more information.

    :::

    ##### Static Placement Configuration

    | **Parameter**                              | **Description**                                                                                                                    |
    | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
    | **IP Start range**                         | Enter the first address in the PCG IP pool range.                                                                                  |
    | **IP End range**                           | Enter the last address in the PCG IP pool range.                                                                                   |
    | **Network Prefix**                         | Enter the network prefix for the IP pool range. Valid values are network CIDR subnet masks from the range `0 - 32`. Example: `18`. |
    | **Gateway IP Address**                     | Enter the IP address of the IP gateway.                                                                                            |
    | **Name servers**                           | Enter a comma-separated list of DNS name server IP addresses.                                                                      |
    | **Name server search suffixes (optional)** | Enter a comma-separated list of DNS search domains.                                                                                |

    ##### DDNS Placement Configuration

    | **Parameter**      | **Description**                                     |
    | ------------------ | --------------------------------------------------- |
    | **Search domains** | Enter a comma-separated list of DNS search domains. |

10.  Specify the cluster boot configuration.

    | **Parameter**                             | **Description**                                                                                                           |
    | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
    | **Patch OS on boot**                      | Indicate whether to patch the OS of the PCG hosts on the first boot.                                                      |
    | **Reboot nodes once OS patch is applied** | Indicate whether to reboot PCG nodes after OS patches are complete. This applies only if **Patch OS on boot** is enabled. |

11. Enter the vSphere Machine configuration for the Private Cloud Gateway. We recommend `M` or greater for production
    workloads.

    | **Parameter** | **Description**                                                                                                                                                                                                                                             |
    | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **S**         | 4 CPUs, 4 GB of memory, and 60 GB of storage                                                                                                                                                                                                                |
    | **M**         | 8 CPUs, 8 GB of memory, and 100 GB of storage                                                                                                                                                                                                               |
    | **L**         | 16 CPUs, 16 GB of memory, and 120 GB of storage                                                                                                                                                                                                             |
    | **Custom**    | Specify a custom configuration. If you select `Custom`, you are prompted to enter the number of CPUs, memory, and storage to allocate to the PCG VM. Refer to the [Custom Machine Configuration](#custom-machine-configuration) table for more information. |

    #### Custom Machine Configuration

    | **Parameter** | **Description**                              |
    | ------------- | -------------------------------------------- |
    | **CPU**       | The number of CPUs in the VM.                |
    | **Memory**    | The number of memory to allocate to the VM.  |
    | **Storage**   | The amount of storage to allocate to the VM. |

12. Specify the node affinity configuration.

    | **Parameter**     | **Description**                                                   |
    | ----------------- | ----------------------------------------------------------------- |
    | **Node Affinity** | Enter `y` to schedule all Palette pods on the control plane node. |

13. <PartialsComponent category="pcg" name="pcg-cluster-provisioning" edition="VMware vSphere" />

14. <PartialsComponent category="pcg" name="pcg-kind-cleanup" />

## Validate

<PartialsComponent category="pcg" name="pcg-validate" edition="VMware vSphere" />

## Next Steps

After you have successfully deployed the PCG into your VMware vSphere environment, you can deploy clusters into your
VMware vSphere environment. If you selected **Static Placement**, make sure you define an IP Address Management (IPAM)
node pool that Kubernetes clusters deployed in vSphere can use. To learn more about creating and defining node pools,
refer to the [Create and Manage IPAM Node Pools](../manage-pcg/create-manage-node-pool.md) guide.
