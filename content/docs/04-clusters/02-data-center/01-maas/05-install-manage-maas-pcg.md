---
title: "Install and Manage MAAS Gateway"
metaTitle: "Install and Manage MAAS Private Cloud Gateway"
metaDescription: "Learn how to install and manage the MAAS Private Cloud Gateway in Palette."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview 

The Private Cloud Gateway (PCG) supports private cloud and data center environments. Its function is similar to that of a reverse proxy. The PCG facilitates connectivity between Palette and a private cloud that exists behind a NAT gateway or firewall. It traverses any NAT gateways or firewalls to establish a permanent connection with Palette.

The PCG is a Kubernetes cluster that supports Palette in a private network environment. All host clusters deployed through Palette communicate with PCG.

At a high level, the following occurs during a successful MAAS PCG installation:

<br />

- Start the PCG installer on a laptop, workstation, or Bastion host. 


- Provide information to the installer so that it can connect both to a local MAAS installation and a Palette account.


- The installer uses MAAS to obtain machines and install a PCG on them.


- The PCG then facilitates all communication between Palette and MAAS, enabling Palette to create new clusters on machines that MAAS provides.

You can set up the PCG as a single- or three-node cluster based on your requirements for high availability (HA).  

As the following diagram shows, Palette provides a command line interface (CLI) that is executed on your laptop, workstation, or jump box. You can use the CLI on any Linux x86-64 system with a Docker daemon installed and connectivity to Palette and the MAAS identity endpoint.


<br />


![An architecture diagram of MaaS with PCG.](/clusters_maas_install-manage-mass-pcg_diagram-of-mass-with-pcg.png)


<br />


<WarningBox>

The PCG installer is only compatible with Linux x86-64 systems.

</WarningBox>


## Prerequisites

- Canonical [MAAS installed](https://maas.io/docs/how-to-install-maas), set up, and available in your environment.


- A Linux environment with a Docker daemon installed and a connection to Palette and the MAAS endpoint. The installer must be invoked on an up-to-date Linux system with an x86-64 architecture. ARM architecture is currently not supported.


- PCG IP requirements:

    - Either one or three node IP addresses, depending on topology: single node PCG vs. three node (HA) PCG
    - One IP for the Kubernetes control-plane (VIP).
    - One additional Kubernetes control-plane IP (required for rolling upgrade).


- Sufficient available IPs within the configured MAAS subnets.

<WarningBox>

By default, the MAAS Kubernetes pack uses a pod classless inter-domain routing (CIDR) range of 192.168.0.0/16. Ensure that the pod CIDR range for any clusters you deploy after setting up the PCG does not overlap with the network used by the bare metal machines that MAAS manages.

</WarningBox>

- Each node in the PCG cluster requires a machine from MAAS in a ready state with the following resources:

    <br />

    - CPU: 4
    - Memory: 8192 MiB
    - Storage: 60 GiB

    For production environments, we recommend using three nodes, each with 100 GiB of storage, as nodes can run out of 60 GiB with prolonged use. If you initially set up the PCG with one node, you can resize it at a later time. 


- An active [MAAS API key](https://maas.io/docs/api-authentication-reference) which can be generated in the MAAS web console under **My Preferences** > **API keys**. The following is an example key:

  ``APn53wz232ZwBMxDp5:MHZIbUp3e4DJTjZEKg:mdEv33WAG536MhNC8mIywNLtjcDTnFAQ``

 For details, refer to the MAAS document on [how to add an API key](https://maas.io/docs/how-to-manage-user-accounts#heading--api-key).

  <br />

- The DNS server that the PCG installer will use, must be able to resolve the DNS names of machines that MAAS deploys so it can connect to them. The default setup is to use the MAAS server as the DNS server for any bare metal servers that it deploys. The default MAAS DNS zone is ``.maas``. You can use ``.maas`` or you can use the MAAS web console to create a new DNS zone. When you deploy the PCG and clusters, you can select the desired DNS zone in which DNS name records should be created.

    In the MAAS subnets configuration, you can specify which DNS servers those servers in the MAAS subnet should use. 
    
<WarningBox> 

If you configure a different DNS server than the MAAS DNS server, you must be sure to create a DNS delegation in the other DNS server, so that it can forward DNS requests for zones that are hosted by MAAS to the MAAS DNS server.

</WarningBox>

<br />

The installer first requests machines from MAAS and then must connect to them. To connect, the installer attempts to use the fully qualified domain name (FQDN) of the server. If you used ``.maas`` as the default DNS zone, the FQDN would be ``machine-hostname.maas``. 

The diagram shows an example of using an external DNS server for servers that MAAS deploys in addition to a DNS delegation. This ensures all servers in the network can resolve the DNS names of servers deployed by MAAS. Note that it is not required for the DNS records to be accessible from the internet.


![Image showing external DNS server machines that MAAS deploys in addition to a DNS delegation](/clusters_maas_maas-dns-setup.png)


## Understand the Gateway Installation Process

The following steps outline the overall process to install the PCG. 

For detailed steps, refer to the **Install PCG** tab below, which describes a single-step installation that creates the PCG configuration file and installs the PCG.

If you have already installed the PCG and are experiencing issues that you want to fix by editing the PCG configuration file directly, refer to the **Edit PCG Config** tab.

<br />

1. You obtain the Palette PCG installer CLI.


2. Use the installer to start the installation on the installer host.


3. Provide the installer with all necessary information that it prompts you for.


4. The installer generates a PCG configuration file from information you provide in step **3**.

    <br />

    The installer needs access to your Palette account and to your MAAS environment. Additionally, one (no HA) or three (HA) machines must be in ready state and have internet access in MAAS. If you select one machine in step 3, then you need one in MAAS. Likewise, if you select three machines in step 3, you need three in MAAS.
    <br />

5. The installer provisions the MAAS machines and deploys a new kubernetes cluster to host the PCG application.

<br />


<Tabs>

<Tabs.TabPane tab="Install PCG" key="install_pcg"> 


## Install the PCG

The following steps will guide you to install the PCG. 
<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. If you have Single or Social Sign-On (SSO) enabled, you will need to use or create a local non-SSO tenant admin account in Palette and use the API key for that account in step **5**.

<WarningBox>

The installer does not work with SSO or Social sign on credentials. You must use an API key from a local tenant admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no longer used to keep the PCG connected to Palette, so you can disable the account if desired.

</WarningBox>

3. Download the installer and authenticate with Palette by executing the following code snippet in a terminal.
    <br />
    ```bash
    wget https://software.spectrocloud.com/palette-pcg-installer-cli/v3.4.0/linux/cli/palette -O /usr/local/bin/palette
    chmod +x /usr/local/bin/palette

    palette login
    ```

4. When prompted, enter the information listed in the following table.

#### Palette Login Parameters

|**Parameter**       | **Description**|
|:-----------------------------|---------------|
|**Spectro Cloud Console** |Enter the Palette endpoint URL. When using the Palette SaaS service, enter ``https://console.spectrocloud.com``. When using a dedicated instance of Palette, enter the URL for that instance. |
|**Allow Insecure Connection (Bypass x509 Verification)** |Enter 'y' if using a self-hosted Palette instance with self-signed TLS certificates. Otherwise, enter 'n'.|
|**Spectro Cloud API Key** |Enter your Palette API Key.|
|**Spectro Cloud Organization** |Enter your Palette Organization.|
|**Spectro Cloud Project** |Enter your desired Project within the selected Organization.|

5. Once you have authenticated successfully, invoke the PCG installer by executing the following command. When prompted, enter the information listed in each of the following tables.
    <br />
    ```bash
    palette pcg install
    ```
#### Palette PCG Parameters

|**Parameter**       | **Description**|
|:-----------------------------|---------------|
|**Cloud Type**| Choose MAAS.|
|**Private Cloud Gateway Name** | Enter a custom name for the PCG. Example: ``maas-pcg-1``.|
|**Share PCG Cloud Account across platform Projects** |Enter 'y' if you want the Cloud Account associated with the PCG to be available from all Projects within your Organization. Enter 'n' if you want the Cloud Account to be available at the tenant admin scope only.|

<br />

#### Environment Configuration


|**Parameter**| **Description**|
|:-------------|----------------|
|**HTTPS Proxy**| Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: ``https://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
| **HTTP Proxy**| Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: ``http://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
| **No Proxy**| The default is blank. You can add a comma-separated list of local network CIDR addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server. Example if you have a self-hosted environment: ``maas.company.com,10.10.0.0/16``.|
| **Proxy CA Certificate Filepath  (e.g., /usr/local/share/ca-certificates/ca.crt)**| The default is blank. You can provide the filepath of a CA certificate on the installer host. If provided, this CA certificate will be copied to each host in the PCG cluster during the deployment process. The exact path that is provided will be used on the PCG cluster hosts.|
| **Pod CIDR**|Enter the CIDR pool that will be used to assign IP addresses to pods in the PCG cluster. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.|
| **Service IP Range**|Enter the IP address range that will be used to assign IP addresses to services in the PCG cluster. The service IP addresses should be unique and not overlap with any machine IPs in the environment.|

<br />


#### MAAS Account Information

|**Parameter**| **Description**|
|-------------|----------------|
| **MAAS API Endpoint** |Enter the MAAS API endpoint (syntax is important). This can be a domain or IP address. Example: ``http://10.11.12.13:5240/MAAS``.|
| **MAAS API Key** |Enter an active MAAS API key to use for authentication.|

<br />

#### MAAS PCG Placement Information

1. When the installer prompts you, select the appropriate option for each of the following items to define which machines should be selected on the MAAS server for deployment as a PCG:

    - Domain
    - Patch OS on boot
    - Reboot node(s) once OS patch is applied (if OS patching is enabled)
    - Availability Zone
    - Resource Pool
    - Number of nodes (One node (no HA) or three nodes (HA))

  <br />
  
  <WarningBox>

   Ensure the MAAS server has one or more machines in the **Ready** state for the chosen availability zone 
   and resource pool combination.

  </WarningBox>

When you have entered all the configuration values, the installer saves the PCG configuration file to disk and prints its location before proceeding with the installation. For example:

``/home/spectro/.palette/pcg/pcg-20230706150945/pcg.yaml``

<br />

The installer then requests available bare metal machines in your MAAS environment on which to install the PCG. The ``CloudAccount.apiKey`` and ``Mgmt.apiKey`` values in the ``pcg.yaml`` are encrypted and cannot be manually updated. To change these values, rerun the installer using ``palette pcg install``.

If the deployment fails due to misconfiguration, update the PCG configuration file and rerun the installer. Refer to the **Edit PCG Configuration File** section below.

If you need assistance, please visit our [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) portal.

<br />

## Validate

Once installed, the PCG registers itself with Palette. To verify the PCG is registered, navigate to **Tenant Settings > Private Cloud Gateways** and ensure the PCG is listed on the **Manage Private Cloud Gateways** page. 

When you install the PCG, a cloud account is auto-created. To verify the cloud account is created, go to **Tenant Settings > Cloud Accounts** and locate **MAAS** in the table. Verify your MAAS account is listed.

</Tabs.TabPane>

<Tabs.TabPane tab="Edit PCG Config" key="edit_pcg_config">


## Edit PCG Configuration File

Use the following steps if you want to edit the PCG configuration file directly.

<br />

1. Make the necessary changes to the configuration file.

```bash
vi /home/spectro/.palette/pcg/pcg-20230706150945/pcg.yaml
```

<br />

2. To redeploy the PCG, copy the following code snippet to your terminal:

```bash
palette pcg install -s -f /home/spectro/.palette/pcg/pcg-20230706150945/pcg.yaml
```

The installer requests available bare metal machines in your MAAS environment on which to install the PCG.

If you need assistance, please visit our [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) portal.

</Tabs.TabPane>

</Tabs>

<br />

# Update and Manage the MAAS Private Cloud Gateway

Palette maintains the Operating System (OS) image and all configurations for the PCG. Periodically, the OS images, configurations, and other components need to be updated to resolve security or functionality issues. Palette releases updates when required, and informs you with an update notification when you click on the PCG in the **Manage Cloud Gateways** page.

Review the changes in the update notification, and apply the update when you are ready. 

Updating the PCG does not result in any downtime for the tenant clusters. During the update process, new cluster provisioning is unavailable. New cluster requests are queued and processed when the PCG update is complete.

<br />

# Delete the MAAS Private Cloud Gateway

Follow these steps to delete a MAAS PCG.
<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to the **Main menu** and select **Tenant Settings > Private Cloud Gateways**.


3. Click the **three-dot Menu** for the PCG instance you want to delete and choose **Delete**.

    Palette checks for running tenant clusters associated with the PCG instance and displays an error message if it detects any. 
    <br />

4. If there are running clusters, delete them and retry deleting the PCG instance.

<br />

# Resize the MAAS Private Cloud Gateway

You can set up a PCG as a single-node (no HA) or three-node (HA) cluster. You can set up a PCG initially with one node and resize it to three nodes at a later time.

<br />

<InfoBox>

For production environments, we recommend setting up three nodes.

</InfoBox>

## Prerequisites

- Each PCG node requires the following: 

    - 4 CPUs
    - 8192 MiB memory
    - 60 GiB storage

Follow these steps to resize a single-node PCG to three nodes.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to the **Main Menu** and select **Tenant Settings > Private Cloud Gateways**.


3. Click the **three-dot Menu** for the PCG instance you want to resize and choose **Set number of nodes**.


4. Change the number of nodes to 3.

Two new nodes will be added to the PCG cluster.

<br />


<WarningBox>

Ensure the MAAS server has two more machines in the **Ready** state in the same Availability Zone and Resource Pool combination.

</WarningBox>


## Validate

You can validate your your PCG has been resized by navigating to the **Private Cloud Gateways** page. Select the resized PCG instance and click the **Nodes** tab. You will see two additional nodes being deployed along with their health status. Three nodes in total will be listed.

<br />


# Next Steps

You can now create tenant clusters in the auto-created cloud account. To get started, check out [Create and Manage MAAS Clusters](/clusters/data-center/maas/create-manage-maas-clusters).

You can also create additional cloud accounts if you need them. Refer to [Register and Manage MAAS Cloud Accounts](/clusters/data-center/maas/register-manage-maas-cloud-accounts).


<br />


# Resources 

 - [Install MAAS](https://maas.io/)


 - [MAAS Fresh Install](https://maas.io/docs/how-to-install-maas)


 - [Manage MAAS User Accounts](https://maas.io/docs/how-to-manage-user-accounts#heading--api-key)
