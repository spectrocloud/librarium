---
sidebar_label: "Install and Manage MAAS Gateway"
title: "Install and Manage MAAS Private Cloud Gateway"
description: "Learn how to install and manage the MAAS Private Cloud Gateway in Palette."
hide_table_of_contents: false
sidebar_position: 10
tags: ["data center", "maas"]
---

The Private Cloud Gateway (PCG) supports private cloud and data center environments. Its function is similar to that of
a reverse proxy. The PCG facilitates connectivity between Palette and a private cloud that exists behind a NAT gateway
or firewall. It traverses any NAT gateways or firewalls to establish a permanent connection with Palette.

The PCG is a Kubernetes cluster that supports Palette in a private network environment. All host clusters deployed
through Palette communicate with PCG.

At a high level, the following occurs during a successful MAAS PCG installation:

- Use the Palette CLI on a laptop, workstation, or Bastion host.

- Provide information to the CLI so that it can connect to both a local MAAS installation and a Palette account.

- The installation process uses MAAS to obtain machines and install a PCG on them.

- The PCG then facilitates all communication between Palette and MAAS, enabling Palette to create new clusters on
  machines that MAAS provides.

You can set up the PCG as a single- or three-node cluster based on your requirements for high availability (HA).

As the following diagram shows, Palette provides an installer in the form of a Docker container that is temporarily
deployed on your laptop, workstation, or jump box. You can use the installer on any Linux x86-64 system with a Docker
daemon installed and connectivity to Palette and the MAAS identity endpoint.

![An architecture diagram of MaaS with PCG.](/clusters_maas_install-manage-mass-pcg_diagram-of-mass-with-pcg.png)

## Install PCG

Use the following steps to install a PCG cluster in your MAAS environment. You can use the [Palette CLI](/palette-cli)
or the PCG Installer Image to deploy a PCG cluster. Review the prerequisites for each option to help you identify the
correct install method.

### Prerequisites

- Palette version 4.0.X or greater.

- Canonical [MAAS installed](https://maas.io/docs/how-to-install-maas), set up, and available in your environment.

- Download the Palette CLI from the [Downloads](../../../spectro-downloads.md#palette-cli) page and install it. Refer to
  the [Palette CLI Install](../../../palette-cli/install-palette-cli.md) guide to learn more. Use the latest version of
  the Palette CLI that matches the version of your Palette or Palette VerteX instance.

- A Palette API key. Refer to the [Create API Key](../../../user-management/authentication/api-key/create-api-key.md)
  page for guidance.

  :::warning

  The installation does not work with Single Sign-On (SSO) credentials. You must use an API key from a local tenant
  admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no
  longer used to keep the PCG connected to Palette, so you can disable the account if desired.

  :::

- A Linux environment with a Docker daemon installed and a connection to Palette and the MAAS endpoint. The installation
  must be invoked on an up-to-date Linux system with an x86-64 architecture. ARM architecture is currently not
  supported.

- PCG IP address requirements:

  - For a single-node gateway, one IP address must be available in the MAAS subnet for the PCG, or three available IP
    addresses for a three-node gateway.

  - One IP address must be available in the MAAS subnet for the Kubernetes API-server endpoint when deploying a
    three-node gateway.

- Sufficient available IPs within the configured MAAS subnets.

  :::warning

  By default, the MAAS Kubernetes pack uses a pod classless inter-domain routing (CIDR) range of 192.168.0.0/16. Ensure
  that the pod CIDR range for any clusters you deploy after setting up the PCG does not overlap with the network used by
  the bare metal machines that MAAS manages.

  :::

- Each node in the PCG cluster requires a machine from MAAS in a ready state with the following resources:

  - CPU: 4
  - Memory: 8192 MiB
  - Storage: 60 GiB

  For production environments, we recommend using three nodes, each with 100 GiB of storage, as nodes can exhaust the 60
  GiB storage with prolonged use. If you initially set up the gateway with one node, you can resize it at a later time.

- An active [MAAS API key](https://maas.io/docs/api-authentication-reference) can be generated in the MAAS web console
  under **My Preferences** > **API keys**. The following is an example key:

  `APn53wz232ZwBMxDp5:MHZIbUp3e4DJTjZEKg:mdEv33WAG536MhNC8mIywNLtjcDTnFAQ`

For details, refer to the MAAS document on
[how to add an API key](https://maas.io/docs/how-to-manage-user-accounts#heading--api-key).

- The DNS server that the PCG installer will use, must be able to resolve the DNS names of machines that MAAS deploys so
  it can connect to them. The default setup is to use the MAAS server as the DNS server for any bare metal servers that
  it deploys. The default MAAS DNS zone is `.maas`. You can use `.maas` or you can use the MAAS web console to create a
  new DNS zone. When you deploy the PCG and clusters, you can select the desired DNS zone in which DNS name records
  should be created.

  In the MAAS subnets configuration, you can specify which DNS servers those servers in the MAAS subnet should use.

:::warning

If you configure a different DNS server than the MAAS DNS server, you must be sure to create a DNS delegation in the
other DNS server, so that it can forward DNS requests for zones that are hosted by MAAS to the MAAS DNS server.

:::

The installation process first requests machines from MAAS and then must connect to them. To connect, the install
process attempts to use the fully qualified domain name (FQDN) of the server. If you used `.maas` as the default DNS
zone, the FQDN would be `machine-hostname.maas`.

The diagram below shows an example of using an external DNS server for servers that MAAS deploys in addition to a DNS
delegation. This ensures all servers in the network can resolve the DNS names of servers deployed by MAAS. Note that it
is not required for the DNS records to be accessible from the internet.

![Image showing external DNS server machines that MAAS deploys in addition to a DNS delegation](/clusters_maas_maas-dns-setup.png)

### Install

The following steps will guide you on how to install a PCG cluster.

1. In an x86 Linux host, open up a terminal session.

2. Use the [Palette CLI](../../../palette-cli/install-palette-cli.md) `login` command to authenticate the CLI with
   Palette. When prompted, enter the information listed in the following table.

   ```shell
   palette login
   ```

   <br />

   | **Parameter**                  | **Description**                                                                                                                                                                               |
   | :----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Spectro Cloud Console**      | Enter the Palette endpoint URL. When using the Palette SaaS service, enter `https://console.spectrocloud.com`. When using a self-hosted instance of Palette, enter the URL for that instance. |
   | **Allow Insecure Connection**  | Enabling this option bypasses x509 verification. Enter `y` if you are using a self-hosted Palette instance with self-signed TLS certificates. Otherwise, enter `n`.                           |
   | **Spectro Cloud API Key**      | Enter your Palette API Key.                                                                                                                                                                   |
   | **Spectro Cloud Organization** | Enter your Palette Organization name.                                                                                                                                                         |
   | **Spectro Cloud Project**      | Enter your desired project name within the selected Organization.                                                                                                                             |

3. Once you have authenticated successfully, invoke the PCG installer by issuing the following command. When prompted,
   enter the information listed in each of the following tables.

{" "}

<br />

```bash
palette pcg install
```

{" "}

<br />

| **Parameter**                                        | **Description**                                                                                                                                                                                                     |
| :--------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cloud Type**                                       | Choose MAAS.                                                                                                                                                                                                        |
| **Private Cloud Gateway Name**                       | Enter a custom name for the PCG. Example: `maas-pcg-1`.                                                                                                                                                             |
| **Share PCG Cloud Account across platform Projects** | Enter `y` if you want the Cloud Account associated with the PCG to be available from all projects within your organization. Enter `n` if you want the Cloud Account to only be available at the tenant admin scope. |

4. Next, provide environment configurations for the cluster. Refer to the following table for information about each
   option.

{" "}

<br />

| **Parameter**                     | **Description**                                                                                                                                                                                                                                                                                                |
| :-------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| **HTTPS Proxy**                   | Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: `https://USERNAME:PASSWORD@PROXYIP:PROXYPORT`.                                                                                                                   |
| **HTTP Proxy**                    | Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: `http://USERNAME:PASSWORD@PROXYIP:PROXYPORT`.                                                                                                                     |
| **No Proxy**                      | You will be prompted to provide a list of local network CIDR addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server. Example if you have a self-hosted environment: `maas.company.com,10.10.0.0/16`.   |
| **Proxy CA Certificate Filepath** | The default is blank. You can provide the file path of a CA certificate on the installer host. If provided, this CA certificate will be copied to each host in the PCG cluster during deployment. The provided path will be used on the PCG cluster hosts. Example: `/usr/local/share/ca-certificates/ca.crt`. |
| **Pod CIDR**                      | Enter the CIDR pool that will be used to assign IP addresses to pods in the PCG cluster. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.                                                                                                                        |
| **Service IP Range**              | Enter the IP address range that will be used to assign IP addresses to services in the PCG cluster. The service IP addresses should be unique and not overlap with any machine IPs in the environment.                                                                                                         | .   |

<br />

5. After the environment options, the next set of prompts is for configuring the PCG cluster for the MAAS environment.
   The following table contains information about each prompt.

{" "}

<br />

| **Parameter**         | **Description**                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| **MAAS API Endpoint** | Enter the MAAS API endpoint. This can be a domain or IP address. Example: `http://10.11.12.13:5240/MAAS`. |
| **MAAS API Key**      | Enter an active MAAS API key to use for authentication.                                                   |

6. Next, select the appropriate option for each of the following items to define which machines should be selected on
   the MAAS server for deployment as a PCG.

{" "}

<br />

| **Parameter**                             | **Description**                                                                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| **Domain**                                | Select the MAAS domain.                                                                                                                         |
| **Patch OS on boot**                      | This parameter indicates whether or not to patch the OS of the PCG hosts on the first boot.                                                     |
| **Reboot nodes once OS patch is applied** | This parameter indicates whether or not to reboot PCG nodes after OS patches are applied.                                                       |
| **Availability Zone**                     | Select the availability zones for the PCG cluster.                                                                                              |
| **Resource Pool**                         | Select the MAAS resource pool.                                                                                                                  |
| **Cluster Size**                          | The number of nodes that will make up the cluster. Available options are **1** or **3** . Use three nodes for a High Availability (HA) cluster. |     |

:::warning

Ensure the MAAS server has one or more machines in the **Ready** state for the chosen availability zone and resource
pool combination.

:::

7. A new PCG configuration file is generated and its location is displayed on the console. You will receive an output
   similar to the following.

{" "}

<br />

```bash hideClipboard
==== PCG config saved ====
Location: :/home/spectro/.palette/pcg/pcg-20230706150945/pcg.yaml
```

:::info

The `CloudAccount.apiKey` and `Mgmt.apiKey` values in the **pcg.yaml** are encrypted and cannot be manually updated. To
change these values, use the `palette pcg install --update-passwords` command. Refer to the
[PCG command](../../../palette-cli/commands.md#update-passwords) reference page for more information.

:::

The Palette CLI will now provision a PCG cluster in your MAAS environment.

:::warning

You cannot modify a deployed PCG cluster. If you need to make changes to the PCG cluster, you must first delete the
cluster and redeploy it. We recommend you save your PCG configuration file for future use. Use the `--config-only` flag
to save the configuration file without deploying the PCG cluster. Refer to the
[Generate a Configuration File](../../../palette-cli/commands.md#generate-a-configuration-file) section to learn more.
For additional assistance, visit our [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals)
portal.

:::

### Validate

Once installed, the PCG registers itself with Palette. To verify the PCG is registered, use the following steps.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the left **Main Menu** and select **Tenant Settings**

3. From the **Tenant Settings Menu** click on **Private Cloud Gateways**. Verify your PCG cluster is available from the
   list of PCG clusters displayed.

4. When you install the PCG, a cloud account is auto-created. To verify the cloud account is created, go to **Tenant
   Settings > Cloud Accounts** and locate **MAAS** in the table. Verify your MAAS account is listed.

## Update and Manage the PCG

Palette maintains the Operating System (OS) image and all configurations for the PCG. Periodically, the OS images,
configurations, and other components need to be updated to resolve security or functionality issues. Palette releases
updates when required, and informs you with an update notification when you click on the gateway in the **Manage Cloud
Gateways** page.

Review the changes in the update notification, and apply the update when you are ready.

Updating the cloud gateway does not result in any downtime for the tenant clusters. During the update process, new
cluster provisioning is unavailable. New cluster requests are queued and processed when the gateway update is complete.

<br />

## Delete the MAAS Gateway

Follow these steps to delete a MAAS gateway.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the **Main menu** and select **Tenant Settings > Private Cloud Gateways**.

3. Click the **three-dot Menu** for the gateway instance you want to delete and choose **Delete**. Palette checks for
   active tenant clusters associated with the gateway instance and displays an error message if it detects any.

4. If there are active clusters, delete them and retry deleting the gateway instance.

<br />

## Resize the MAAS Gateway

You can set up a PCG as a single-node (no HA) or three-node (HA) cluster. You can set up a PCG initially with one node
and resize it to three nodes at a later time.

<br />

:::info

For production environments, we recommend setting up three nodes.

:::

### Prerequisites

- Each PCG node requires the following:

  - 4 CPUs
  - 8192 MiB memory
  - 60 GiB storage

Follow these steps to resize a single-node gateway to three nodes.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the **Main Menu** and select **Tenant Settings > Private Cloud Gateways**.

3. Click the **three-dot Menu** for the gateway instance you want to resize and choose **Set number of nodes**.

4. Change the number of nodes to 3.

Two new nodes will be added to the PCG cluster.

:::warning

Ensure the MAAS server has two more machines in the **Ready** state in the same Availability Zone and Resource Pool
combination.

:::

### Validate

You can validate that your PCG has been resized by navigating to the **Private Cloud Gateways** page. Select the resized
gateway instance and click the **Nodes** tab. Two additional nodes are displayed along with their health status. Three
nodes in total will be listed.

## Next Steps

You can now create tenant clusters in the auto-created cloud account. To get started, check out
[Create and Manage MAAS Clusters](create-manage-maas-clusters.md).

You can also create additional cloud accounts if you need them. Refer to
[Register and Manage MAAS Cloud Accounts](register-manage-maas-cloud-accounts.md).

# Resources

- [Install MAAS](https://maas.io/)

- [MAAS Fresh Install](https://maas.io/docs/how-to-install-maas)

- [Manage MAAS User Accounts](https://maas.io/docs/how-to-manage-user-accounts#heading--api-key)
