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

- A CloudStack template imported.

      <details>

      <summary> Importing a template </summary>

            In CloudStack console, navigate to **Images**. Select **Templates** and click on **Register Template from URL**.

            Provide values for the fields below.

            | **Field** | **Description** |
            | --------- | --------------- |
            | **URL** | Provide the following image [template URL](https://cloudstackgoldenimage.s3.us-east-1.amazonaws.com/u-2404-0-k-13210-0.qcow2). The URL must end with `qcow2` when using KVM as the hypervisor. |
            | **Name** | Must follow the format `u-2404-0-k-13210-0`. |
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
            Image name must follow the required format, must be set **Public**, and only one template with that name may exist per user. Duplicate names can cause CloudStack functional issues and deployment failures.

            For example, user A imports an image named `u-2404-0-k-13210-0` and sets it to **Public** availability. User B creates another template with the same name but does not mark it **Public**. User A will have one template named `u-2404-0-k-13210-0` and user B will have two templates named `u-2404-0-k-13210-0`. When user B deploys a cluster using `u-2404-0-k-13210-0`, the deployment will fail with a duplicate template error: `Reconciler error: expected 1 Template with name u-2404-0-k-13210-0, but got 2`.

      </details>

## Deploy PCG

1.  On your Linux host with the Palette CLI installed, open a terminal session.

2.  Create a Palette CLI encryption passphrase and set it as an environment variable. Replace
    `<palette-cli-encryption-passphrase>` with your passphrase.

    ```shell
    export PALETTE_ENCRYPTION_PASSWORD=<palette-cli-encryption-passphrase>
    ```

3.  Issue the following command to authenticate your Palette CLI installation with Palette. When prompted, enter the
    required information. Refer to the table below for information about each parameter.

    ```shell
    palette login
    ```

    | **Parameter**                  | **Description**                                                                                                                                                                                                                                     |
    | :----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Spectro Cloud Console**      | Enter the Palette endpoint URL. When using the Palette SaaS service, enter `https://console.spectrocloud.com`. When using a self-hosted instance of Palette, enter the URL for that instance.                                                       |
    | **Allow Insecure Connection**  | Bypass x509 server Certificate Authority (CA) verification. Enter `y` if you are using a self-hosted Palette or Palette VerteX instance with self-signed TLS certificates and need to provide a file path to the instance CA. Otherwise, enter `n`. |
    | **Spectro Cloud API Key**      | Enter your Palette API Key. Refer to the <VersionedLink text="Create API Key" url="/user-management/authentication/api-key/create-api-key" /> guide for more information.                                                                           |
    | **Spectro Cloud Organization** | Select your Palette organization name.                                                                                                                                                                                                              |
    | **Spectro Cloud Project**      | Select the Palette project you want to register your {props.edition} account in.                                                                                                                                                                    |
    | **Acknowledge**                | Accept the login banner message. Login banner messages are only displayed if the tenant admin enabled a login banner.                                                                                                                               |

    :::info

    After completing the `palette pcg install` steps, the configuration details are saved to a file named `pcg.yaml` in
    the `~/.palette/pcg/pcg-<date-time>` directory. The `CloudAccount.apiKey` and `Mgmt.apiKey` values in the `pcg.yaml`
    file are encrypted and cannot be manually updated. To change these values, use the
    `palette pcg install --update-passwords` command. Refer to the

    <VersionedLink text="PCG command" url="/automation/palette-cli/commands/pcg#update-passwords" /> reference page for
    more information.

    :::

4.  Once you have authenticated your Palette CLI installation, start the PCG installer by issuing the following command.
    Refer to the table below for information about each parameter.

    ```bash
    palette pcg install
    ```

    | **Parameter**                                        | **Description**                                                                                                                                                                                                                                                                      |
    | :--------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Management Plane Type**                            | Select **Palette** or **VerteX**.                                                                                                                                                                                                                                                    |
    | **Enable Ubuntu Pro (required for production)**      | Enter `y` if you want to use Ubuntu Pro and provide an Ubuntu Pro token. Otherwise, enter `n`.                                                                                                                                                                                       |
    | **Select an image registry type**                    | For a non-airgap installation, choose `Default` to pull images from public image registries. This requires an internet connection. For airgapped installations, select `Custom` and point to your airgap support VM or a custom internal registry that contains the required images. |
    | **Cloud Type**                                       | Select **{props.edition}**.                                                                                                                                                                                                                                                          |
    | **Private Cloud Gateway Name**                       | Enter a custom name for the PCG.                                                                                                                                                                                                                                                     |
    | **Share PCG Cloud Account across platform Projects** | Enter `y` if you want the cloud account associated with the PCG to be available from all projects within your organization. Enter `n` if you want the cloud account to only be available at the tenant admin scope.                                                                  |

5.  If you want to configure your PCG to use a proxy network, complete the following fields, as appropriate.

    :::info

    By default, proxy environment variables (`HTTPS_PROXY`, `HTTP_PROXY`, and `NO_PROXY`) configured during PCG
    installation are propagated to all PCG cluster nodes, as well as the nodes of all tenant workload clusters deployed
    with the PCG. However, proxy CA certificates are only propagated to PCG cluster nodes; they are not propagated the
    nodes of tenant workload clusters.

    :::

    | **Parameter**   | **Description**                                                                                                                                                                                                              |
    | :-------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **HTTPS Proxy** | Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all PCG nodes in the cluster, as well as all tenant clusters using the PCG. Example: `https://USERNAME:PASSWORD@PROXYIP:PROXYPORT`. |
    | **HTTP Proxy**  | Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all PCG nodes in the cluster, as well as all tenant clusters using the PCG. Example: `http://USERNAME:PASSWORD@PROXYIP:PROXYPORT`.   |

6.  Enter the following network details.

    | **Parameter**        | **Description**                                                                                                                                                                                        |
    | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
    | **Pod CIDR**         | Enter the CIDR pool that will be used to assign IP addresses to pods in the PCG cluster. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.                |
    | **Service IP Range** | Enter the IP address range that will be used to assign IP addresses to services in the PCG cluster. The service IP addresses should be unique and not overlap with any machine IPs in the environment. |

7.  If you selected `Custom` for the image registry type, you are prompted to provide the following information.

    | **Parameter**                                            | **Description**                                                                                                                                                                                                                        |
    | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **Registry Name**                                        | Assign a name to the custom registry.                                                                                                                                                                                                  |
    | **Registry Endpoint**                                    | Enter the endpoint or IP address for the custom registry. Example: `https://palette.example.com` or `https://10.10.1.0`.                                                                                                               |
    | **Registry Base Content Path**                           | Enter the base content path for the custom registry. Example: `spectro-images`.                                                                                                                                                        |
    | **Configure Registry Mirror**                            | Customize the default mirror registry settings. Your system default text editor, such as Vi, will open and allow you to make any desired changes. When finished, save and exit the file.                                               |
    | **Allow Insecure Connection (Bypass x509 Verification)** | Bypass x509 CA verification. Enter `n` if using a custom registry with self-signed SSL certificates. Otherwise, enter `y`. If you enter `y`, you receive a follow-up prompt asking you to provide the file path to the CA certificate. |
    | **Registry CA certificate Filepath**                     | (Optional) Enter the CA certificate for the custom registry. Provide the file path of the CA certificate on the installer host. Example: `/usr/local/share/ca-certificates/ca.crt`.                                                    |
    | **Registry Username**                                    | Enter the username for the custom registry.                                                                                                                                                                                            |
    | **Password**                                             | Enter the password for the custom registry.                                                                                                                                                                                            |

8.  Provide the CloudStack account information when prompted by the Palette CLI.

    | **Field**                        | **Description**                                                                                                                                                                                                       |
    | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **CloudStack URL**               | Enter the CloudStack API endpoint URL. For example, `https://cloudstack.example.com:8443/client/api` or `https://management-server-ip:8080/client/api`.                                                               |
    | **CloudStack ApiKey**            | Enter the CloudStack API key for the user account that has permissions to deploy the PCG.                                                                                                                             |
    | **CloudStack SecretKey**         | Enter the CloudStack Secret key for the user account that has permissions to deploy the PCG.                                                                                                                          |
    | **CloudStack Domain (optional)** | If applicable, enter the CloudStack [domain](https://docs.cloudstack.apache.org/en/latest/adminguide/accounts.html#domains) name for the user account that has permissions to deploy the PCG. Otherwise, leave blank. |

9.  Provide the CloudStack cluster configuration information when prompted by the Palette CLI.

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
   | **Disk Offering**                                     | Select the CloudStack disk service offering that defines the disk resources for the PCG nodes. Refer to the [PCG Sizing](./deploy-pcg.md#pcg-sizing) section for more information on sizing. This option will be available based on the **Compute Offering** template selected, and available **Disk offerings** in CloudStack. |

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
