---
sidebar_label: "Deploy to CloudStack"
title: "Deploy to CloudStack"
description: "Steps to deploy a PCG to an Apache CloudStack environment"
hide_table_of_contents: false
sidebar_position: 50
tags: ["pcg", "cloudstack"]
---

:::preview

:::

This guide provides you with the steps to deploy a Palette Cloud Gateway (PCG) cluster to an Apache CloudStack
environment using KVM as the hypervisor. Before you begin the installation, carefully review the
[Prerequisites](#prerequisites) section.

## Prerequisites

- A Palette API key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  page for guidance.

  :::warning

  The installation does not support Single Sign-On (SSO) credentials. You must use an API key from a local tenant admin
  account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no longer
  used to keep the PCG connected to Palette, so you can deactivate the account if desired.

  :::

- Download and install the Palette CLI from the [Downloads](../../../downloads/cli-tools.md#palette-cli) page. Refer to
  the [Palette CLI Install](../../../automation/palette-cli/install-palette-cli.md) guide to learn more.

  - You will need to provide the Palette CLI an encryption passphrase to secure sensitive data. The passphrase must be
    between 8 to 32 characters long and contain a capital letter, a lowercase letter, a digit, and a special character.
    Refer to the [Palette CLI Encryption](../../../automation/palette-cli/palette-cli.md#encryption) section for more
    information.

- PCG IP address requirements:

  - For a single-node deployment, one IP address must be available for the PCG, or three available IP addresses for a
    three-node deployment. Refer to the [PCG Sizing](./deploy-pcg.md#pcg-sizing) section for more information on sizing.
  - For three-node deployments, one IP address must be available for the Kubernetes API-server endpoint.
  - One IP address reserved for cluster repave operations.
  - One IP address for the Virtual IP (VIP).
  - DNS can resolve the domain `api.spectrocloud.com`.

- The PCG nodes must be deployed on an x86 Linux environment with a Docker daemon installed and a connection to Palette
  and the CloudStack endpoint. The Palette CLI installation must be invoked on an up-to-date Linux system with the
  x86-64 architecture.

- The CloudStack environment must have the following resources available:

  - A CloudStack project to host the PCG cluster.
  - A CloudStack zone to deploy the PCG cluster into.
  - A CloudStack network within the zone to host the PCG cluster.
  - A CloudStack service offering to define the compute resources for the PCG nodes. Refer to the
    [PCG Sizing](./deploy-pcg.md#pcg-sizing) section for more information on sizing.

- A CloudStack user account with the required permissions to deploy the PCG in the CloudStack environment. Review
  [Required Permissions](../../data-center/cloudstack/required-permissions.md) to learn more about the required
  permissions.

  - A CloudStack API key and Secret key for the user account used to deploy the PCG. Refer to the
    [Using API Key and Secret Key based Authentication](https://docs.cloudstack.apache.org/en/latest/adminguide/accounts.html#using-api-key-and-secret-key-based-authentication)
    guide about API and Secret keys.

- CloudStack SSH keys generated and available to the user account used to deploy the PCG. Refer to the
  [Using SSH Keys for Authentication](https://docs.cloudstack.apache.org/en/latest/adminguide/virtual_machines.html#using-ssh-keys-for-authentication)
  guide to learn how to create an SSH key pair.

- The CloudStack API endpoint URL. For example, `https://cloudstack.example.com:8443/client/api` or
  `https://management-server-ip:8080/client/api`.

- DNS must be able to resolve `api.spectrocloud.com` when using SaaS PCG.

- A CloudStack template imported

  <details>
<summary>Importing a template</summary>
    
    In CloudStack console, navigate to **Images**. 
    
    Select **Templates** and click on **Register Template from URL**.

        Provide values for the fields below:

        | **Field** | **Description** |
        | --------- | --------------- |
        | **URL** | Provide image template URL. The URL must end with `qcow2` when using KVM as the hypervisor. |
        | **Name** | Must follow the format `u-2404-0-k-1336-0`. |
        | **Description** | Optional. |
        | **Zone** | Specify the zone from the dropdown. |
        | **Domain** | Specify the domain from the dropdown. |
        | **Hypervisor** | Select **KVM** from the dropdown. |
        | **Format** | Select **QCOW2** from the dropdown. |
        | **OS type** | Select **Ubuntu 24.04 (64-bit)** from the dropdown. |
        | **Template type** | Select **USER** from the dropdown. |
        | **Extractable** | Leave default. |
        | **Dynamically scalable** | Leave default.|
        | **Public** | Select the checkbox. |
        | **Password enabled** | Leave default. |
        | **HVM** | Leave default. |

        Click **OK**.

        **Note:**
        Image name must follow the required format, and only one template with that name may exist per user. Duplicate names can cause CloudStack deployment failures.

        For example, user A imports an image named `u-2404-0-k-1336-0` and sets it to **Public** availability. User B creates another template with the same name but does not mark it **Public**. User A will have one template named `u-2404-0-k-1336-0` and user B will have two templates named `u-2404-0-k-1336-0`. When user B deploys a cluster using `u-2404-0-k-1336-0`, the deployment will fail with a duplicate template error: `Reconciler error: expected 1 Template with name u-2404-0-k-1336-0, but got 2`.

  </details>

## Deploy PCG

<PartialsComponent category="pcg" name="pcg-initial-installation" edition="CloudStack" />

8. Provide the CloudStack account information when prompted by the Palette CLI.

   | **Field**                        | **Description**                                                                                                                                                                                                       |
   | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **CloudStack URL**               | Enter the CloudStack API endpoint URL. For example, `https://cloudstack.example.com:8443/client/api` or `https://management-server-ip:8080/client/api`.                                                               |
   | **CloudStack ApiKey**            | Enter the CloudStack API key for the user account that has permissions to deploy the PCG.                                                                                                                             |
   | **CloudStack SecretKey**         | Enter the CloudStack Secret key for the user account that has permissions to deploy the PCG.                                                                                                                          |
   | **CloudStack Domain (optional)** | If applicable, enter the CloudStack [domain](https://docs.cloudstack.apache.org/en/latest/adminguide/accounts.html#domains) name for the user account that has permissions to deploy the PCG. Otherwise, leave blank. |

9. Provide the CloudStack cluster configuration information when prompted by the Palette CLI.

   | **Parameter**                                    | **Description**                                                                                                                                                                                                                                                                                                                    |
   | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Project**                                      | Enter the name of the CloudStack project to deploy the PCG into.                                                                                                                                                                                                                                                                   |
   | **Zone**                                         | Enter the name of the CloudStack zone to deploy the PCG into.                                                                                                                                                                                                                                                                      |
   | **Network**                                      | Enter the name of the CloudStack network to host the PCG cluster.                                                                                                                                                                                                                                                                  |
   | **SSH KeyPair**                                  | Enter the name of the CloudStack service offering that defines the compute resources for the PCG nodes. Refer to the [PCG Sizing](./deploy-pcg.md#pcg-sizing) section for more information on sizing.                                                                                                                              |
   | **Sync with CKS(CloudStack Kubernetes Service)** | Enter `y` to synchronize the PCG with [CloudStack Kubernetes Service (CKS)](https://docs.cloudstack.apache.org/en/latest/plugins/cloudstack-kubernetes-service.html#cloudstack-kubernetes-service) if it is available in your CloudStack environment. Enter `n` if CKS is not available or you do not want to synchronize with it. |
   | **Static Control Plane IP Address (optional)**   | Enter the static IP address for the control plane node of the PCG if you want to assign a fixed IP. Otherwise, leave blank.                                                                                                                                                                                                        |
   | **Patch OS on boot**                             | Enter `y` to enable automatic OS patching when the PCG nodes boot. Enter `n` to disable automatic OS patching.                                                                                                                                                                                                                     |
   | **Offering**                                     | Select the CloudStack service offering that defines the compute resources for the PCG nodes. Refer to the [PCG Sizing](./deploy-pcg.md#pcg-sizing) section for more information on sizing.                                                                                                                                         |

10. Provide the PCG cluster size information when prompted by the Palette CLI.

    | **Parameter**                           | **Description**                                                                                                                                                                                                                                     |
    | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Number of nodes**                     | Select `1` for a single-node deployment or `3` for a high-availability (HA) deployment.                                                                                                                                                             |
    | **Enable control plane node affinity?** | Enter `y` to enable control plane node affinity or `n` to disable it. If enabled, all Palette related pods (those in the `cluster-<uid>` namespace) will be deployed to control plane nodes only on all workload clusters created through this PCG. |

11. <PartialsComponent category="pcg" name="pcg-cluster-provisioning" edition="CloudStack" />

12. <PartialsComponent category="pcg" name="pcg-kind-cleanup" />

## Validate

<PartialsComponent category="pcg" name="pcg-validate" edition="CloudStack" />

## Next Steps

Learn how to create and manage CloudStack clusters using the deployed PCG by following the steps in the
[Create and Manage CloudStack Clusters](../../data-center/cloudstack/cloudstack.md) guide.
