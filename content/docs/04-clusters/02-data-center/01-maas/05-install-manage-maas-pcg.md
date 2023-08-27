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

- Use the Palette CLI on a laptop, workstation, or Bastion host. 


- Provide information to the CLI so that it can connect to both a local MAAS installation and a Palette account.


- The installation process uses MAAS to obtain machines and install a PCG on them.


- The PCG then facilitates all communication between Palette and MAAS, enabling Palette to create new clusters on machines that MAAS provides.

You can set up the PCG as a single- or three-node cluster based on your requirements for high availability (HA).  

As the following diagram shows, Palette provides an installer in the form of a Docker container that is temporarily deployed on your laptop, workstation, or jump box. You can use the installer on any Linux x86-64 system with a Docker daemon installed and connectivity to Palette and the MAAS identity endpoint. 


<br />


![An architecture diagram of MaaS with PCG.](/clusters_maas_install-manage-mass-pcg_diagram-of-mass-with-pcg.png)


# Install PCG

Use the following steps to install a PCG cluster in your MAAS environment. You can use the [Palette CLI](/palette-cli) or the PCG Installer Image to deploy a PCG cluster. Review the prerequisites for each option to help you identify the correct install method.

<br />


<Tabs>

<Tabs.TabPane tab="Palette CLI" key="palette-cli">


## Prerequisites


- Palette version 4.0.X or greater.


- Canonical [MAAS installed](https://maas.io/docs/how-to-install-maas), set up, and available in your environment.


- Download the Palette CLI from the [Downloads](/spectro-downloads#palettecli) page and install the CLI. Refer to the [Palette CLI Install](/palette-cli/install-palette-cli) guide to learn more.


- A Palette API key. Refer to the [Create API Key](/user-management/user-authentication#apikey) page for guidance.

  <br />

  <WarningBox>

  The installation does not work with Single Sign-On (SSO) credentials. You must use an API key from a local tenant admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no longer used to keep the PCG connected to Palette, so you can disable the account if desired.

  </WarningBox>

- A Linux environment with a Docker daemon installed and a connection to Palette and the MAAS endpoint. The installation must be invoked on an up-to-date Linux system with an x86-64 architecture. ARM architecture is currently not supported.


-  PCG IP address requirements: <br /><br /> 
    
    - For a single-node gateway, one IP address must be available in the MAAS subnet for the PCG, or three available IP addresses for a three-node gateway.
    <br />

    - One IP address must be available in the MAAS subnet for the Kubernetes API-server endpoint when deploying a three-node gateway.


- Sufficient available IPs within the configured MAAS subnets.

<WarningBox>

By default, the MAAS Kubernetes pack uses a pod classless inter-domain routing (CIDR) range of 192.168.0.0/16. Ensure that the pod CIDR range for any clusters you deploy after setting up the PCG does not overlap with the network used by the bare metal machines that MAAS manages.

</WarningBox>

- Each node in the PCG cluster requires a machine from MAAS in a ready state with the following resources:

    <br />

    - CPU: 4
    - Memory: 8192 MiB
    - Storage: 60 GiB

    For production environments, we recommend using three nodes, each with 100 GiB of storage, as nodes can exhaust the 60 GiB storage with prolonged use. If you initially set up the gateway with one node, you can resize it at a later time. 


- An active [MAAS API key](https://maas.io/docs/api-authentication-reference) can be generated in the MAAS web console under **My Preferences** > **API keys**. The following is an example key:

  ``APn53wz232ZwBMxDp5:MHZIbUp3e4DJTjZEKg:mdEv33WAG536MhNC8mIywNLtjcDTnFAQ``

 For details, refer to the MAAS document on [how to add an API key](https://maas.io/docs/how-to-manage-user-accounts#heading--api-key).

  <br />

- The DNS server that the PCG installer will use, must be able to resolve the DNS names of machines that MAAS deploys so it can connect to them. The default setup is to use the MAAS server as the DNS server for any bare metal servers that it deploys. The default MAAS DNS zone is ``.maas``. You can use ``.maas`` or you can use the MAAS web console to create a new DNS zone. When you deploy the PCG and clusters, you can select the desired DNS zone in which DNS name records should be created.

    In the MAAS subnets configuration, you can specify which DNS servers those servers in the MAAS subnet should use. 
    
<WarningBox> 

If you configure a different DNS server than the MAAS DNS server, you must be sure to create a DNS delegation in the other DNS server, so that it can forward DNS requests for zones that are hosted by MAAS to the MAAS DNS server.

</WarningBox>

<br />

The installation process first requests machines from MAAS and then must connect to them. To connect, the install process attempts to use the fully qualified domain name (FQDN) of the server. If you used ``.maas`` as the default DNS zone, the FQDN would be ``machine-hostname.maas``. 

The diagram shows an example of using an external DNS server for servers that MAAS deploys in addition to a DNS delegation. This ensures all servers in the network can resolve the DNS names of servers deployed by MAAS. Note that it is not required for the DNS records to be accessible from the internet.


![Image showing external DNS server machines that MAAS deploys in addition to a DNS delegation](/clusters_maas_maas-dns-setup.png)


## Install

The following steps will guide you on how to install a PCG cluster. 
<br />

1. In an x86 Linux host, open up a terminal session.


2. Use the [Palette CLI](/palette-cli/install-palette-cli) `login` command to authenticate the CLI with Palette. When prompted, enter the information listed in the following table.

    <br />

    ```shell
    palette login
    ```

    <br />

    |**Parameter**       | **Description**|
    |:-----------------------------|---------------|
    |**Spectro Cloud Console** |Enter the Palette endpoint URL. When using the Palette SaaS service, enter ``https://console.spectrocloud.com``. When using a self-hosted instance of Palette, enter the URL for that instance. |
    |**Allow Insecure Connection** |Enabling this option bypasses x509 verification. Enter `y` if you are using a self-hosted Palette instance with self-signed TLS certificates. Otherwise, enter `n`.|
    |**Spectro Cloud API Key** |Enter your Palette API Key.|
    |**Spectro Cloud Organization** |Enter your Palette Organization name.|
    |**Spectro Cloud Project** |Enter your desired project name within the selected Organization.|


3. Once you have authenticated successfully, invoke the PCG installer by issuing the following command. When prompted, enter the information listed in each of the following tables.

  <br />

  ```bash
  palette pcg install
  ```

  <br />

  |**Parameter**       | **Description**|
  |:-----------------------------|---------------|
  |**Cloud Type**| Choose OpenStack.|
  |**Private Cloud Gateway Name** | Enter a custom name for the PCG. Example: `openstack-pcg-1`.|
  |**Share PCG Cloud Account across platform Projects** |Enter `y` if you want the Cloud Account associated with the PCG to be available from all projects within your organization. Enter `n` if you want the Cloud Account to only be available at the tenant admin scope.|



4. Next, provide environment configurations for the cluster. Refer to the following table for information about each option.

  <br />

  |**Parameter**| **Description**|
  |:-------------|----------------|
  |**HTTPS Proxy**|Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: ``https://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
  |**HTTP Proxy**|Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: ``http://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
  |**No Proxy**|The default is blank. You can add a comma-separated list of local network CIDR addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server. Example if you have a self-hosted environment: ``maas.company.com,10.10.0.0/16``.|
  |**Proxy CA Certificate Filepath**|The default is blank. You can provide the file path of a CA certificate on the installer host. If provided, this CA certificate will be copied to each host in the PCG cluster during deployment. The provided path will be used on the PCG cluster hosts. Example: `/usr/local/share/ca-certificates/ca.crt`.|
  |**Pod CIDR**|Enter the CIDR pool that will be used to assign IP addresses to pods in the PCG cluster. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.|
  |**Service IP Range**|Enter the IP address range that will be used to assign IP addresses to services in the PCG cluster. The service IP addresses should be unique and not overlap with any machine IPs in the environment.|.|

<br />


5. After the environment options, the next set of prompts is for configuring the PCG cluster for the MAAS environment. The following table contains information about each prompt.

  <br />

  |**Parameter**| **Description**|
  |-------------|----------------|
  | **MAAS API Endpoint** |Enter the MAAS API endpoint. This can be a domain or IP address. Example: `http://10.11.12.13:5240/MAAS`.|
  | **MAAS API Key** |Enter an active MAAS API key to use for authentication.|



6. Next, select the appropriate option for each of the following items to define which machines should be selected on the MAAS server for deployment as a PCG. 

  <br />

  |**Parameter**| **Description**|
  |-------------|----------------|
  | **Domain**  | Select the MAAS domain. |
  | **Patch OS on boot** | This parameter indicates whether or not to patch the OS of the PCG hosts on the first boot.|
  | **Reboot nodes once OS patch is applied** | This parameter indicates whether or not to reboot PCG nodes after OS patches are applied.|
  | **Availability Zone** |   Select the availability zones for the PCG cluster.   |
  | **Resource Pool** | Select the MAAS resource pool.   | 
  | **Cluster Size** |  The number of nodes that will make up the cluster. Available options are **1** or **3** . Use three nodes for a High Availability (HA) cluster. |                        |
  
  <WarningBox>

   Ensure the MAAS server has one or more machines in the **Ready** state for the chosen availability zone 
   and resource pool combination.

  </WarningBox>


7. A new PCG configuration file is generated and its location is displayed on the console. You will receive an output similar to the following.

  <br />

  ```bash hideClipboard
  ==== PCG config saved ====
  Location: :/home/spectro/.palette/pcg/pcg-20230706150945/pcg.yaml
  ```

  <InfoBox>

  The ``CloudAccount.apiKey`` and ``Mgmt.apiKey`` values in the **pcg.yaml** are encrypted and cannot be manually updated. To change these values, restart the installation process using the `palette pcg install` command.

  </InfoBox>


The Palette CLI will now provision a PCG cluster in your OpenStack environment. 
If the deployment fails due to misconfiguration, update the PCG configuration file and restart the install process. Refer to the Edit and Redeploy PCG section below. For additional assistance, visit our [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) portal.

## Validate

Once installed, the PCG registers itself with Palette. To verify the PCG is registered, use the following steps.


1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to the left **Main Menu** and select **Tenant Settings**


3. From the **Tenant Settings Menu** click on **Private Cloud Gateways**. Verify your PCG cluster is available from the list of PCG clusters displayed.


4. When you install the PCG, a cloud account is auto-created. To verify the cloud account is created, go to **Tenant Settings > Cloud Accounts** and locate **MAAS** in the table. Verify your MAAS account is listed.



## Edit and Redeploy PCG

To change the PCG install values, restart the installation process using the `palette pcg install` command.  Use the following steps to redeploy the PCG or restart the install process. 

<br />

1. Make the necessary changes to the PCG configuration file the CLI created during the installation, if needed. Use a text editor, such as Vi or Nano to update the PCG install configuration file.

  <br />

  ```shell hideClipboard
  ==== Create PCG reference config ====
  ==== PCG config saved ====
  Location: /Users/demo/.palette/pcg/pcg-20230717114807/pcg.yaml
  ```

  ```bash hideClipboard
  vi /home/demo/.palette/pcg/pcg-20230706150945/pcg.yaml
  ```



2. To redeploy the PCG, use the `install` command with the flag `--config-file`. Provide the file path to the generated PCG config file that was generated and displayed in the output. 

  <br />

  ```bash hideClipboard
  palette pcg install --config-file /home/demo/.palette/pcg/pcg-20230706150945/pcg.yaml
  ```


<br />

</Tabs.TabPane>

<Tabs.TabPane tab="PCG Installer Image" key="pcg-installer-image">

## Prerequisites

- Palette version 3.4.X or older. 



- Canonical [MAAS installed](https://maas.io/docs/how-to-install-maas), set up, and available in your environment.


- A Linux environment with a Docker daemon installed and a connection to Palette and the MAAS endpoint. The installer must be invoked on an up-to-date Linux system with an x86-64 architecture. ARM architecture is currently not supported.


-  PCG IP address requirements: <br /><br /> 
    
    - For a single-node gateway, one IP address must be available in the MaaS subnet for the PCG, or three available IP addresses for a three-node gateway.
    <br />

    - One IP address must be available in the MAAS subnet for the Kubernetes api-server endpoint when deploying a three-node gateway.


- Sufficient available IPs within the configured MAAS subnets.

<WarningBox>

By default, the MAAS Kubernetes pack uses a pod classless inter-domain routing (CIDR) range of 192.168.0.0/16. Ensure that the pod CIDR range for any clusters you deploy after setting up the PCG does not overlap with the network used by the bare metal machines that MAAS manages.

</WarningBox>

- Each node in the PCG cluster requires a machine from MAAS in a ready state with the following resources:

    <br />

    - CPU: 4
    - Memory: 8192 MiB
    - Storage: 60 GiB

    For production environments, we recommend using three nodes, each with 100 GiB of storage, as nodes can run out of 60 GiB with prolonged use. If you initially set up the gateway with one node, you can resize it at a later time. 


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

For detailed steps, refer to the **Install PCG** section below, which describes a single-step installation that creates the PCG configuration file and installs the PCG.

If you have already installed the PCG and are experiencing issues that you want to fix by editing the PCG configuration file directly, refer to the **Edit PCG Config** section below.

<br />

1. You obtain a pairing code in Palette that you will use later.


2. Use the Docker image to start the installation on the installer host.


3. The installer prompts you for information, including the pairing code you obtained in step **1**.


4. The installer generates the PCG configuration file from information you provide in step **3**.

    <br />

    The installer needs access to your Palette account and to your MAAS environment. Additionally, one (no HA) or three (HA) machines must be in ready state and have internet access in MAAS. If you select one machine in step 3, then you need one in MAAS. Likewise, if you select three machines in step 3, you need three in MAAS.
    <br />

5. The installer installs the MAAS machines and uses the configuration file to build a new cluster to host the PCG application.

<br />




## Install the PCG

The following steps will guide you to install the PCG. 
<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. If you have Single or Social Sign-On (SSO) enabled, you will need to use or create a local non-SSO tenant admin account in Palette and use the credentials for that account in step **7**.

<WarningBox>

The installer does not work with SSO or Social sign on credentials. You must use a username and password from a local tenant admin account in Palette to deploy the PCG. After the PCG is configured and functioning, this local account is no longer used to keep the PCG connected to Palette, so you can disable the account if desired.

</WarningBox>


3. Navigate to the **Main Menu** and select **Tenant Settings > Private Cloud Gateway**.


4. Click the **Create Private Cloud Gateway** button and select **MAAS**. Private Gateway installation instructions are displayed.


5. Note the pairing code displayed in the Instructions section of the page. You will input this code when you use the installer. This pairing code is valid for 24 hours.


6. To invoke the installer, copy the following code snippet to your terminal.
    <br />

    ```bash
    docker run -it --rm \
    --net=host \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume /tmp:/opt/spectrocloud \
    gcr.io/spectro-images-public/release/spectro-installer:v1.0.12
    ```

7. When prompted, enter the pairing code and information listed in each of the following tables. The installer will generate the gateway configuration file. 
    <br />


#### Palette Parameters

|**Parameter**       | **Description**|
|:-----------------------------|---------------|
|**Install Type**| Choose **Private Cloud Gateway**. <br />You can change your selection with the up or down keys.|
|**Cloud Type**| Choose MAAS.|
|**Name** | Enter a custom name for the PCG. Example: ``maas-pcg-1``.|
|**Endpoint** |Enter the Palette endpoint URL. When using the Palette SaaS service, enter ``https://console.spectrocloud.com``. When using a dedicated instance of Palette, enter the URL for that instance. |
|**Username** |Enter your Palette username. This is your sign-in email address. Example: ``user1@company.com``. |
|**Password** |Enter your Palette Password. This is your sign-in password.|
|**Pairing Code** |Enter the pairing code you noted from the instructions page in step **5**. |

<br />

#### Environment Configuration


|**Parameter**| **Description**|
|:-------------|----------------|
|**HTTPS Proxy (--https_proxy)**| Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: ``https://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
| **HTTP Proxy(--http_proxy)**| Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all PCG nodes and all of its cluster nodes. Example: ``http://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
| **No Proxy(--no_proxy)**| The default is blank. You can add a comma-separated list of local network CIDR addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server.  Example if you have a self-hosted environment: ``maas.company.com,10.10.0.0/16``.|
| **Pod CIDR (--pod_cidr)**|Enter the CIDR pool that will be used to assign IP addresses to pods in the PCG cluster. The pod IP addresses should be unique and not overlap with any machine IPs in the environment.|
| **Service IP Range (--svc_ip_range)**|Enter the IP address range that will be used to assign IP addresses to services in the PCG cluster. The service IP addresses should be unique and not overlap with any machine IPs in the environment.|

<br />


#### MAAS Account Information

|**Parameter**| **Description**|
|-------------|----------------|
| **API Endpoint** |Enter the MAAS API endpoint (syntax is important). This can be a domain or IP address. Example: ``http://10.11.12.13:5240/MAAS``.|
| **API Key** |Enter an active MAAS API key to use for authentication.|

<br />

1. When the installer prompts you, select the appropriate option for each of the following items to define which machines should be selected on the MAAS server for deployment as a PCG:

    - Domain
    - Availability Zone
    - Resource Pool
    - One node (no HA) or three nodes (HA)

  <br />
  
  <WarningBox>

   Ensure the MAAS server has one or more machines in the **Ready** state for the chosen availability zone 
   and resource pool combination.

  </WarningBox>

When you have entered all the configuration values, the installer saves the gateway configuration file to disk and prints its location before proceeding with the installation. For example:

``/tmp/install-user-defined-MaaS-Gateway_Name-20210805155034/pcg.yaml``

<br />

<InfoBox>

The **/opt/spectrocloud** folder is volume mapped to the installer's **/tmp** folder.

</InfoBox>

The installer then requests available bare metal machines in your MAAS environment on which to install the gateway. The ``password`` and ``API key`` values in the ``pcg.yaml`` are encrypted and cannot be manually updated. To change these values, copy the code snippet in step **6** to rerun the installer.

If the deployment fails due to misconfiguration, update the gateway configuration file and rerun the installer. Refer to the **Edit PCG Config** tab above.

If you need assistance, please visit our [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) portal.

<br />

## Validate

Once installed, the gateway registers itself with Palette. To verify the gateway is registered, navigate to **Tenant Settings > Private Cloud Gateways** and ensure the gateway is listed on the **Manage Private Cloud Gateways** page. 

When you install the gateway, a cloud account is auto-created. To verify the cloud account is created, go to **Tenant Settings > Cloud Accounts** and locate **MAAS** in the table. Verify your MAAS account is listed.




## Edit PCG Configuration File

Use the following steps if you want to edit the PCG configuration file directly.

<br />

1. Copy the ``pcg.yaml`` file out of ``/tmp/install-user-defined-MaaS-Gateway_Name-20210805155034/pcg.yaml`` and into ``/tmp`` as follows.


```bash
cp /tmp/install-User-define-MaaS-Gateway-Name-20210805155034/pcg.yaml  /tmp
```


2. Make the necessary changes to the configuration file.


3. Before you redeploy the gateway, do the following: 

    <br />

    - Ensure the pairing code in the configuration file is the same as the pairing code displayed in the installation instructions in Palette. To verify the pairing code, click the **Create Private Cloud Gateway** button and select **MAAS**. Note the pairing code and verify it is the same code in the configuration file. 

    <br />

    - If the codes do not match, modify the code in the configuration file so it matches the code displayed in Palette.

<br />

<WarningBox>

Issues can occur with the PCG installation if the pairing code in Palette changes during the time it takes to modify the configuration file. Ensure pairing codes in Palette and the configuration file match before you redeploy the gateway.  

If you stop the installation or it fails due to mismatched pairing codes, the gateway might display as **Pending (unnamed)** on the **Private Cloud Gateways** page. If this happens, delete the gateway and ensure pairing codes in Palette and the configuration file match before redeploying the gateway.

</WarningBox>

<br />

4. To redeploy the gateway, copy the following code snippet to your terminal and provide the gateway configuration file as input.


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

If you need assistance, please visit our [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) portal.



<br />

</Tabs.TabPane>
</Tabs>




# Update and Manage the PCG

Palette maintains the Operating System (OS) image and all configurations for the PCG. Periodically, the OS images, configurations, and other components need to be updated to resolve security or functionality issues. Palette releases updates when required, and informs you with an update notification when you click on the gateway in the **Manage Cloud Gateways** page.

Review the changes in the update notification, and apply the update when you are ready. 

Updating the cloud gateway does not result in any downtime for the tenant clusters. During the update process, new cluster provisioning is unavailable. New cluster requests are queued and processed when the gateway update is complete.

<br />

# Delete the MAAS Gateway

Follow these steps to delete a MAAS gateway.
<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to the **Main menu** and select **Tenant Settings > Private Cloud Gateways**.


3. Click the **three-dot Menu** for the gateway instance you want to delete and choose **Delete**.

    Palette checks for running tenant clusters associated with the gateway instance and displays an error message if it detects any. 
    <br />

4. If there are running clusters, delete them and retry deleting the gateway instance.

<br />

# Resize the MAAS Gateway

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

Follow these steps to resize a single-node gateway to three nodes.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to the **Main Menu** and select **Tenant Settings > Private Cloud Gateways**.


3. Click the **three-dot Menu** for the gateway instance you want to resize and choose **Set number of nodes**.


4. Change the number of nodes to 3.

Two new nodes will be added to the PCG cluster.

<br />


<WarningBox>

Ensure the MAAS server has two more machines in the **Ready** state in the same Availability Zone and Resource Pool combination.

</WarningBox>


## Validate

You can validate your your PCG has been resized by navigating to the **Private Cloud Gateways** page. Select the resized gateway instance and click the **Nodes** tab. You will see two additional nodes being deployed along with their health status. Three nodes in total will be listed.

<br />


# Next Steps

You can now create tenant clusters in the auto-created cloud account.  To get started, check out [Create and Manage MAAS Clusters](/clusters/data-center/maas/create-manage-maas-clusters).

You can also create additional cloud accounts if you need them. Refer to [Register and Manage MAAS Cloud Accounts](/clusters/data-center/maas/register-manage-maas-cloud-accounts).


<br />


# Resources 

 - [Install MAAS](https://maas.io/)


 - [MAAS Fresh Install](https://maas.io/docs/how-to-install-maas)


 - [Manage MAAS User Accounts](https://maas.io/docs/how-to-manage-user-accounts#heading--api-key)


