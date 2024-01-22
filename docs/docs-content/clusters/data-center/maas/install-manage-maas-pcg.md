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

PCG is a Kubernetes cluster responsible for supporting Palette in a private network environment. All host clusters
deployed through Palette will communicate with PCG.

At a high level, the following occurs during a successful MAAS PCG installation:

- Start the PCG installer on a laptop, workstation, or Bastion host.

- Provide information to the installer so that it can connect both to a local MAAS installation and a Palette account.

- The installer uses MAAS to obtain machines and install a PCG on them.

- The PCG then facilitates all communication between Palette and MAAS, enabling Palette to create new clusters on
  machines that MAAS provides.

You can set up the PCG as a single- or three-node cluster based on your requirements for high availability (HA).

Palette provides an installer in the form of a Docker container that is temporarily deployed on your laptop,
workstation, or jump box. You can use the installer on any Linux x86-64 system with a Docker daemon installed and
connectivity to Palette and the MAAS identity endpoint.

![An architecture diagram of MaaS with PCG.](/clusters_maas_install-manage-mass-pcg_diagram-of-mass-with-pcg.png)

<br />

:::warning

The installer does not work on Apple Mac operating systems with Apple silicon chips.

:::

## PCG Installer Image

### Prerequisites

- Canonical [MAAS installed](https://maas.io/docs/how-to-install-maas), set up, and available in your environment.

- A Linux environment with a Docker daemon installed and a connection to Palette and the MAAS endpoint. The installer
  must be invoked on an up-to-date Linux system with an x86-64 architecture. ARM architecture is currently not
  supported.

- PCG IP address requirements:

  - For a single-node gateway, one IP address must be available in the MaaS subnet for the PCG, or three available IP
    addresses for a three-node gateway.

    <br />

  - One IP address must be available in the MAAS subnet for the Kubernetes api-server endpoint when deploying a
    three-node gateway.

- Sufficient available IPs within the configured MAAS subnets.

:::warning

By default, the MAAS Kubernetes pack uses a pod classless inter-domain routing (CIDR) range of 192.168.0.0/16. Ensure
that the pod CIDR range for any clusters you deploy after setting up the PCG does not overlap with the network used by
the bare metal machines that MAAS manages.

:::

- Each node in the PCG cluster requires a machine from MAAS in a ready state with the following resources:

  <br />

  - CPU: 4
  - Memory: 8192 MiB
  - Storage: 60 GiB

  For production environments, we recommend using three nodes, each with 100 GiB of storage, as nodes can run out of 60
  GiB with prolonged use. If you initially set up the gateway with one node, you can resize it at a later time.

- An active [MAAS API key](https://maas.io/docs/api-authentication-reference) which can be generated in the MAAS web
  console under **My Preferences** > **API keys**. The following is an example key:

  `APn53wz232ZwBMxDp5:MHZIbUp3e4DJTjZEKg:mdEv33WAG536MhNC8mIywNLtjcDTnFAQ`

For details, refer to the MAAS document on
[how to add an API key](https://maas.io/docs/how-to-manage-user-accounts#heading--api-key).

<br />

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

<br />

The installer first requests machines from MAAS and then must connect to them. To connect, the installer attempts to use
the fully qualified domain name (FQDN) of the server. If you used `.maas` as the default DNS zone, the FQDN would be
`machine-hostname.maas`.

The diagram shows an example of using an external DNS server for servers that MAAS deploys in addition to a DNS
delegation. This ensures all servers in the network can resolve the DNS names of servers deployed by MAAS. Note that it
is not required for the DNS records to be accessible from the internet.

![Image showing external DNS server machines that MAAS deploys in addition to a DNS delegation](/clusters_maas_maas-dns-setup.png)

### Understand the Gateway Installation Process

The following steps outline the overall process to install the PCG.

For detailed steps, refer to the **Install PCG** tab below, which describes a single-step installation that creates the
PCG configuration file and installs the PCG.

If you have already installed the PCG and are experiencing issues that you want to fix by editing the PCG configuration
file directly, refer to the **Edit PCG Config** tab.

<br />

1. You obtain a pairing code in Palette that you will use later.

2. Use the Docker image to start the installation on the installer host.

3. The installer prompts you for information, including the pairing code you obtained in step **1**.

4. The installer generates the PCG configuration file from information you provide in step **3**.

   <br />

   The installer needs access to your Palette account and to your MAAS environment. Additionally, one (no HA) or three
   (HA) machines must be in ready state and have internet access in MAAS. If you select one machine in step 3, then you
   need one in MAAS. Likewise, if you select three machines in step 3, you need three in MAAS.

   <br />

5. The installer installs the MAAS machines and uses the configuration file to build a new cluster to host the PCG
   application.

<br />

<Tabs>

<TabItem label="Install PCG" value="install_pcg">

## Install the Gateway

The following steps will guide you to install the PCG.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. If you have Single or Social Sign-On (SSO) enabled, you will need to use or create a local non-SSO tenant admin
   account in Palette and use the credentials for that account in step **7**.

:::warning

The installer does not work with SSO or Social sign on credentials. You must use a username and password from a local
tenant admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no
longer used to keep the PCG connected to Palette, so you can disable the account if desired.

:::

3. Navigate to the **Main Menu** and select **Tenant Settings > Private Cloud Gateway**.

4. Click the **Create Private Cloud Gateway** button and select **MAAS**. Private Gateway installation instructions are
   displayed.

5. Note the pairing code displayed in the Instructions section of the page. You will input this code when you use the
   installer. This pairing code is valid for 24 hours.

6. To invoke the installer, copy the following code snippet to your terminal.

   <br />

   ```bash
   docker run -it --rm \
   --net=host \
   --volume /var/run/docker.sock:/var/run/docker.sock \
   --volume /tmp:/opt/spectrocloud \
   gcr.io/spectro-images-public/release/spectro-installer:v1.0.12
   ```

7. When prompted, enter the pairing code and information listed in each of the following tables. The installer will
   generate the gateway configuration file.
   <br />

#### Palette Parameters

| **Parameter**    | **Description**                                                                                                                                                                             |
| :--------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Install Type** | Choose **Private Cloud Gateway**. <br />You can change your selection with the up or down keys.                                                                                             |
| **Cloud Type**   | Choose MAAS.                                                                                                                                                                                |
| **Name**         | Enter a custom name for the PCG. Example: `maas-pcg-1`.                                                                                                                                     |
| **Endpoint**     | Enter the Palette endpoint URL. When using the Palette SaaS service, enter `https://console.spectrocloud.com`. When using a dedicated instance of Palette, enter the URL for that instance. |
| **Username**     | Enter your Palette username. This is your sign-in email address. Example: `user1@company.com`.                                                                                              |
| **Password**     | Enter your Palette Password. This is your sign-in password.                                                                                                                                 |
| **Pairing Code** | Enter the pairing code you noted from the instructions page in step **5**.                                                                                                                  |

<br />

#### Environment Configuration

| **Parameter**                         | **Description**                                                                                                                                                                                                                                                                                                                |
| :------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **HTTPS Proxy (--https_proxy)**       | Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: `https://USERNAME:PASSWORD@PROXYIP:PROXYPORT`.                                                                                                                                   |
| **HTTP Proxy(--http_proxy)**          | Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: `http://USERNAME:PASSWORD@PROXYIP:PROXYPORT`.                                                                                                                                     |
| **No Proxy(--no_proxy)**              | The default is blank. You can add a comma-separated list of local network CIDR addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server. Example if you have a self-hosted environment: `maas.company.com,10.10.0.0/16`. |
| **Pod CIDR (--pod_cidr)**             | Enter the CIDR pool that will be used to assign IP addresses to pods in the PCG cluster. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.                                                                                                                                        |
| **Service IP Range (--svc_ip_range)** | Enter the IP address range that will be used to assign IP addresses to services in the PCG cluster. The service IP addresses should be unique and not overlap with any machine IPs in the environment.                                                                                                                         |

<br />

#### MAAS Account Information

| **Parameter**    | **Description**                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **API Endpoint** | Enter the MAAS API endpoint (syntax is important). This can be a domain or IP address. Example: `http://10.11.12.13:5240/MAAS`. |
| **API Key**      | Enter an active MAAS API key to use for authentication.                                                                         |

<br />

1. When the installer prompts you, select the appropriate option for each of the following items to define which
   machines should be selected on the MAAS server for deployment as a PCG:

   - Domain
   - Availability Zone
   - Resource Pool
   - One node (no HA) or three nodes (HA)

<br />
:::warning

Ensure the MAAS server has one or more machines in the **Ready** state for the chosen availability zone and resource
pool combination.

:::

When you have entered all the configuration values, the installer saves the gateway configuration file to disk and
prints its location before proceeding with the installation. For example:

`/tmp/install-user-defined-MaaS-Gateway_Name-20210805155034/pcg.yaml`

<br />

:::info

The **/opt/spectrocloud** folder is volume mapped to the installer's **/tmp** folder.

:::

The installer then requests available bare metal machines in your MAAS environment on which to install the gateway. The
`password` and `API key` values in the `pcg.yaml` are encrypted and cannot be manually updated. To change these values,
copy the code snippet in step **6** to rerun the installer.

If the deployment fails due to misconfiguration, update the gateway configuration file and rerun the installer. Refer to
the **Edit PCG Config** tab above.

If you need assistance, please visit our
[Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) portal.

<br />

### Validate

Once installed, the gateway registers itself with Palette. To verify the gateway is registered, navigate to **Tenant
Settings > Private Cloud Gateways** and ensure the gateway is listed on the **Manage Private Cloud Gateways** page.

When you install the gateway, a cloud account is auto-created. To verify the cloud account is created, go to **Tenant
Settings > Cloud Accounts** and locate **MAAS** in the table. Verify your MAAS account is listed.

</TabItem>

<TabItem label="Edit PCG Config" value="edit_pcg_config">

### Edit PCG Configuration File

Use the following steps if you want to edit the PCG configuration file directly.

<br />

1. Copy the `pcg.yaml` file out of `/tmp/install-user-defined-MaaS-Gateway_Name-20210805155034/pcg.yaml` and into `/tmp`
   as follows.

```bash
cp /tmp/install-User-define-MaaS-Gateway-Name-20210805155034/pcg.yaml  /tmp
```

2. Make the necessary changes to the configuration file.

3. Before you redeploy the gateway, do the following:

   <br />

   - Ensure the pairing code in the configuration file is the same as the pairing code displayed in the installation
     instructions in Palette. To verify the pairing code, click the **Create Private Cloud Gateway** button and select
     **MAAS**. Note the pairing code and verify it is the same code in the configuration file.

   <br />

   - If the codes do not match, modify the code in the configuration file so it matches the code displayed in Palette.

<br />

:::warning

Issues can occur with the PCG installation if the pairing code in Palette changes during the time it takes to modify the
configuration file. Ensure pairing codes in Palette and the configuration file match before you redeploy the gateway.

If you stop the installation or it fails due to mismatched pairing codes, the gateway might display as **Pending
(unnamed)** on the **Private Cloud Gateways** page. If this happens, delete the gateway and ensure pairing codes in
Palette and the configuration file match before redeploying the gateway.

:::

<br />

4. To redeploy the gateway, copy the following code snippet to your terminal and provide the gateway configuration file
   as input.

```bash
docker run -it –rm \
–net-host \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /tmp:/opt/spectrocloud \
gcr.io/spectro-images-public/release/spectro-installer:1.0.12 \
-s true \
-c /opt/spectrocloud/pcg.yaml
```

The installer requests available bare metal machines in your MAAS environment on which to install the gateway.

If you need assistance, please visit our
[Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) portal.

</TabItem>

</Tabs>

<br />

# Update and Manage the MAAS Gateway

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

3. Click the **three-dot Menu** for the gateway instance you want to delete and choose **Delete**.

   Palette checks for running tenant clusters associated with the gateway instance and displays an error message if it
   detects any.

   <br />

4. If there are running clusters, delete them and retry deleting the gateway instance.

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

<br />

## Resources

- [Install MAAS](https://maas.io/)

- [Install MAAS How-To](https://maas.io/docs/how-to-install-maas)

- [How to add an API key](https://maas.io/docs/how-to-manage-user-accounts#heading--api-key)

<br />
