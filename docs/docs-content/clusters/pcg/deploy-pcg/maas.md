---
sidebar_label: "Deploy to MAAS"
title: "Deploy to MAAS"
description: "Steps to deploy a PCG cluster to MAAS"
hide_table_of_contents: false
sidebar_position: 20
tags: ["pcg"]
---

This guide provides you with the steps to deploy a PCG cluster to a MAAS environment. Before you begin the installation,
carefully review the [Prerequisites](#prerequisites) section.

## Prerequisites

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

The following system requirements must be met to install a PCG in MAAS:

- PCG IP address requirements:

  - For a single-node gateway, one IP address must be available in the MAAS subnet for the PCG, or three available IP
    addresses for a three-node gateway. Refer to the [PCG Sizing](./deploy-pcg.md#pcg-sizing) section for more
    information on sizing.
  - One IP address must be available in the MAAS subnet for the Kubernetes API-server endpoint when deploying a
    three-node gateway.
  - One IP address reserved for cluster repave operations.
  - One IP address for the Virtual IP (VIP).
  - DNS can resolve the domain `api.spectrocloud.com`.

- An x86 Linux environment with a Docker daemon installed and a connection to Palette and the MAAS endpoint. The Palette
  CLI installation must be invoked on an up-to-date Linux system with the x86-64 architecture.

- Sufficient IP range available within the configured MAAS subnets.

  :::warning

  By default, the MAAS Kubernetes pack uses a pod Classless Inter-Domain Routing (CIDR) range of 192.168.0.0/16. Ensure
  that the pod CIDR range for any clusters you deploy after setting up the PCG does not overlap with the network used by
  the bare metal machines that MAAS manages.

  :::

- Each node in the PCG cluster requires a machine from MAAS in a ready state with the following resources:

  - CPU: 4
  - Memory: 8192 MiB
  - Storage: 60 GiB

  For production environments, we recommend using three nodes, each with 100 GiB of storage, as nodes can exhaust the 60
  GiB storage with prolonged use. If you initially set up the gateway with one node, you can resize it later.

- An active MAAS API key. Refer to the [Authenticating to the MAAS API](https://maas.io/docs/api) guide to learn more
  about how to create an API key.

- The DNS server that the PCG installer will use must be able to resolve the DNS names of machines that MAAS deploys so
  it can connect to them. The default setup is to use the MAAS server as the DNS server for any bare metal servers that
  it deploys. The default MAAS DNS zone is `.maas`. You can use `.maas` or the MAAS web console to create a new DNS
  zone. When you deploy the PCG and clusters, you can select the desired DNS zone in which DNS name records should be
  created.

  In the MAAS subnet configuration, you can specify which DNS servers those servers in the MAAS subnet should use.

  :::warning

  If you configure a DNS server other than the MAAS DNS server, you must create a DNS delegation so that it can forward
  DNS requests for zones that are hosted by MAAS to the MAAS DNS server.

  :::

The installation process first requests machines from MAAS and then must connect to them. To connect, the installation
process attempts to use the Fully Qualified Domain Name (FQDN) of the server. If you used `.maas` as the default DNS
zone, the FQDN would be `machine-hostname.maas`.

The diagram below shows an example of using an external DNS server for servers that MAAS deploys in addition to a DNS
delegation. This ensures all servers in the network can resolve the DNS names of servers deployed by MAAS. Note that it
is not required for the DNS records to be accessible from the internet.

![Image showing external DNS server machines that MAAS deploys in addition to a DNS delegation](/clusters_maas_maas-dns-setup.webp)

## Deploy PCG

1. In an x86 Linux host with the Palette CLI installed, open up a terminal session.

2. Set your Palette CLI encryption passphrase value in an environment variable. Use the following command to set the
   passphrase. Replace `*************` with your passphrase.

   ```shell
   export PALETTE_ENCRYPTION_PASSWORD=*************
   ```

3. Issue the following command to authenticate with Palette. When prompted, enter the required information. Refer to the
   table below for information about each parameter.

   ```shell
   palette login
   ```

   | **Parameter**                  | **Description**                                                                                                                                                                                                                                                    |
   | :----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | **Spectro Cloud Console**      | Enter the Palette endpoint URL. When using the Palette SaaS service, enter `https://console.spectrocloud.com`. When using a self-hosted instance of Palette, enter the URL for that instance.                                                                      |
   | **Allow Insecure Connection**  | Enabling this option bypasses x509 server Certificate Authority (CA) verification. Enter `y` if you are using a self-hosted Palette or VerteX instance with self-signed TLS certificates and need to provide a file path to the instance CA. Otherwise, enter `n`. |
   | **Spectro Cloud API Key**      | Enter your Palette API Key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md) guide to create an API key.                                                                                                           |
   | **Spectro Cloud Organization** | Select your Palette Organization name.                                                                                                                                                                                                                             |
   | **Spectro Cloud Project**      | Select the project name you want to register the MAAS account in.                                                                                                                                                                                                  |
   | **Acknowledge**                | Accept the login banner message. Login banner messages are only displayed if the tenant admin enabled a login banner.                                                                                                                                              |

   :::info

   The `CloudAccount.apiKey` and `Mgmt.apiKey` values in the **pcg.yaml** file are encrypted and cannot be manually
   updated. To change these values, use the `palette pcg install --update-passwords` command. Refer to the
   [PCG command](../../../automation/palette-cli/commands/pcg.md#update-passwords) reference page for more information.

   :::

4. Once you have authenticated successfully, start the PCG installer by issuing the following command. Refer to the
   table below for information about each parameter.

   ```bash
   palette pcg install
   ```

   | **Parameter**                                        | **Description**                                                                                                                                                                                                                                                                 |
   | :--------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Management Plane Type**                            | Select Palette or VerteX.                                                                                                                                                                                                                                                       |
   | **Enable Ubuntu Pro (required for production)**      | Enter `y` if you want to use Ubuntu Pro and provide an Ubuntu Pro token. Otherwise, enter `n`.                                                                                                                                                                                  |
   | **Select an image registry type**                    | For a non-airgap installation, choose `Default` to pull images from public image registries. This requires an internet connection. Select' Custom' for an airgap installation and point to your airgap support VM or a custom internal registry containing the required images. |
   | **Cloud Type**                                       | Select MAAS.                                                                                                                                                                                                                                                                    |
   | **Private Cloud Gateway Name**                       | Enter a custom name for the PCG. Example: `maas-pcg-1`.                                                                                                                                                                                                                         |
   | **Share PCG Cloud Account across platform Projects** | Enter `y` if you want the Cloud Account associated with the PCG to be available from all projects within your organization. Enter `n` if you want the Cloud Account to only be available at the tenant admin scope.                                                             |

5. Next, provide environment configurations for the cluster. Refer to the following table for information about each
   option.

   <PartialsComponent category="pcg" name="proxy-certificate-propagation" />

6. If you selected `Custom` for the image registry type, you will be prompted to provide the following information.

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

7. Provide the MAAS API key and the MAAS server URL. Refer to the table below for information about each parameter.

   | **Parameter**       | **Description**                                                  |
   | :------------------ | ---------------------------------------------------------------- |
   | **MAAS API Key**    | Enter the MAAS API key.                                          |
   | **MAAS Server URL** | Enter the MAAS server URL. Example: `http://10.1.1.1:5240/MAAS`. |

8. Configure the PCG Cluster. The values provided will determine which machines should be selected in MAAS for the PCG
   deployment. Refer to the table below for information about each parameter.

   | **Parameter**                             | **Description**                                                                                       |
   | ----------------------------------------- | ----------------------------------------------------------------------------------------------------- |
   | **Domain**                                | Select the MAAS domain.                                                                               |
   | **Patch OS on boot**                      | This parameter indicates whether or not to patch the OS of the PCG hosts on the first boot.           |
   | **Reboot nodes once OS patch is applied** | This parameter indicates whether or not to reboot PCG nodes after OS patches are applied.             |
   | **Availability Zone**                     | Select the availability zones for the PCG cluster.                                                    |
   | **Number of Nodes**                       | Select the number of nodes for the PCG cluster. We recommend three nodes for production environments. |
   | **Node Affinity**                         | Select `y` to allow all Palette pods to be scheduled on control plane nodes.                          |

   :::warning

   Ensure the MAAS server has one or more machines in the **Ready** state for the chosen availability zone and resource
   pool combination.

   :::

9. A new PCG configuration file is generated, and its location is displayed on the console. You will receive an output
   similar to the following.

   ```bash hideClipboard
   ==== PCG config saved ====
   Location: :/home/demo/.palette/pcg/pcg-20230706150945/pcg.yaml
   ```

   The Palette CLI will now provision a PCG cluster in your MAAS environment. You can monitor the progress of the PCG
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

10. To avoid potential vulnerabilities, once the installation is complete, remove the `kind` images that were installed
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

5. Verify a new MAAS cloud account is available from the list of cloud accounts displayed.

## Next Steps

After you have successfully deployed the PCG into your MAAS environment, you can now deploy Kubernetes clusters in your
environment through Palette. Check out the
[Create and Manage MAAS Clusters](../../data-center/maas/create-manage-maas-clusters.md) guide to learn how to deploy a
Kubernetes cluster in MAAS that is managed by Palette.
