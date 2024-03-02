---
sidebar_label: "Deploy App Workloads with a PCG"
title: "Deploy App Workloads with a PCG"
description:
  "Learn how to deploy a Private Cloud Gateway (PCG) to connect your data center or private cloud environment to
  Palette. This tutorial teaches you how to launch a PCG, create a data center cluster, and deploy a demo application."
hide_table_of_contents: false
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
    - [Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli), if you choose to follow along with the Terraform workflow.

## Authenticate with Palette

The first step to deploy a PCG using Palette CLI is to authenticate with your Palette environment using the
[`palette login`](../../palette-cli/commands/login.md) command.

In your terminal, execute the following command.

```bash
palette login
```

Once issued, you will be prompted for a few parameters to complete the authentication. The table below displays the
required parameters along with the values that will be utilized in this tutorial. If the parameter is specific to your
environment, such as your Palette API key, enter the value according to your environment. Access the
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

The PCG that will be deployed in this tutorial is for educational purposes only and is not recommended for use in
production environments.

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

   This tutorial will deploy a one-node PCG with dynamic IP placement (DDNS).

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

## Create a Cluster Profile and Deploy a Cluster

UI and Terraform workflows

### Validate

## Clean Up

## Wrap-up
