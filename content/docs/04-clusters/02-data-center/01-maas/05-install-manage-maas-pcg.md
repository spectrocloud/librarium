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

The Private Cloud Gateway (PCG) enables support for private cloud or data center environments. You can set up the cloud gateway as a single-node or three-node cluster based on your requirements for high availability (HA).  
<br />

<InfoBox>

For production environments, we recommend using three nodes. If you initially set up the gateway with one node, you can resize it at a later time. 

</InfoBox>


Palette provides an installer in the form of a Docker container that is temporarily deployed on your laptop, workstation, or jump box. You can use the installer on any linux x86-64 system that has a Docker daemon installed and connectivity to Palette and the MAAS identity endpoint. 

<br />


<WarningBox>

The installer does not currently work on MacOS.

</WarningBox>


## Prerequisites

- Canonical [MAAS installed](https://maas.io/docs/how-to-install-maas), set up, and available in your environment.


- A linux computer with a Docker daemon installed and a connection to Palette and the MAAS endpoint. The installer must be invoked on a linux system. We have tested the gateway installation using Ubuntu 20.04 on x86-64.


- Private cloud gateway IP requirements: <br /><br /> 
    
    - One IP address for a single-node gateway or three IP addresses for a three-node gateway.
    - One IP address for a Kubernetes control plane.


- Sufficient IPs for application workload services, such as Load Balancer services.

<WarningBox>

By default, the MAAS Kubernetes pack uses 192.168.0.0/16. Ensure that the Pod classless inter-domain routing (CIDR) range for any clusters you deploy after setting up the PCG do not overlap with the network used by the bare metal machines that MAAS manages.

</WarningBox>

- Each node in the PCG cluster requires a machine from MAAS in a ready state, and with the following resources:

    <br />

    - 4 CPUs
    - 4096 MiB memory
    - 60 GiB storage
    

- An active [MAAS API](https://maas.io/docs/api-authentication-reference) key in the following format:

  ``[consumer_key], [key], and [secret] tokens: API key = '[consumer_key]:[key]:[secret]``

  You can obtain a [MAAS API key](https://maas.io/docs/how-to-manage-user-accounts#heading--api-key) from either the MAAS CLI or the UI.

  <br />

- The DNS server that the installer will use must be able to resolve the public internet names of machines that MAAS manages so it can connect to them. MAAS provides a DNS server, and the default zone that it manages is ***.maas***. 

    The installer first requests machines from MAAS and then must connect to them. To connect, the installer attempts to use the fully qualified domain name (FQDN) ``machine-hostname.maas``. 

    As shown in the diagram, a common way to enable this is to ensure the DNS server used by the installer delegates the MAAS domain to the MAAS control plane. Alternatively, configure the installer host to use the MAAS control plane as its DNS server. Ensure that **every** DNS server configured on the installer host can resolve the .maas domain.


![Image with arrow pointing from .maas domain to MAAS network that contains installer computer and DNS server](/clusters_maas_maas-dns-setup.png)


## Understand the Gateway Installation Process

The following steps outline the overall process to install the PCG. 

For detailed steps, refer to the **Install PCG** tab below, which describes a single-step installation that creates the PCG configuration file and installs the PCG.

If you have already installed the PCG and are experiencing issues that you want to fix by editing the PCG configuration file directly, refer to the **Edit PCG Config** tab.

<br />

1. You obtain a pairing code in Palette that you will use later.


2. Use the Docker image to start the installation on the installer host.


3. The installer prompts you for information, including the pairing code you obtained in step **1**. 


4. The installer generates the PCG configuration file from information you provide in step **3**.

    <br />

    The installer needs access to your Palette account and to one (no HA) or three (HA) machines in your MAAS cluster. If you select one machine in Palette, then you need one in MAAS. Likewise, if you select three machines in Palette, you need three in MAAS. The MAAS machines must have internet access and be in a ready state.
    <br />

5. The installer installs to the MAAS machine(s) and uses the configuration file to build a new cluster to host the PCG application. 

<br />


<Tabs>

<Tabs.TabPane tab="Install PCG" key="install_pcg"> 


# Install the Gateway

The following steps will guide you to install the PCG. 
<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. If you have Single or Social Sign-On (SSO) enabled, you will need to disable it temporarily. 

<WarningBox>

The installer does not work with SSO or Social sign on, as they require a password. After the PCG is configured and functioning, SSO can be re-enabled.

</WarningBox>


3. Navigate to the **Main Menu** and select **Tenant Settings > Private Cloud Gateway**.


4. Click the **Create Private Cloud Gateway** button and select **MAAS**. Private Gateway installation instructions are displayed.


5. Note the pairing code displayed in the Instructions section of the page. You will input this code when you use the installer. 


6. To invoke the installer, copy the following code snippet to your terminal.
    <br />

    ```bash
    docker run -it --rm \
    --net=host \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume /tmp:/opt/spectrocloud \
    gcr.io/spectro-images-public/release/spectro-installer:1.0.12
    ```

7. When prompted, enter the pairing code and information listed in each of the following tables. The installer will generate the gateway configuration file. 
    <br />


#### Palette Parameters

|**Parameter**       | **Description**|
|:-----------------------------|---------------|
|**Install Type**| Choose **Private Cloud Gateway**. <br />You can change your selection with the up or down keys.|
|**Cloud Type**| Choose MAAS.|
|**Name** | Enter a custom name for the PCG.|
|**Endpoint** |Enter the Palette endpoint. Example for the Palette SaaS portal: ``https://console.spectrocloud.com``. Example for a self-hosted environment: ``https://customername.console.spectrocloud.com``. |
|**Username** |Enter your Palette username. This is your sign-in email address. Example: user1@company.com. |
|**Password** |Enter your Palette Password. This is your sign-in password.|
|**Private Cloud Gateway** |Enter the PCG pairing code you noted from the instructions page in step **5**. |

<br />

#### Environment Configuration


|**Parameter**| **Description**|
|:-------------|----------------|
|**HTTPS Proxy (--https_proxy)**| Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all PCG nodes and all subsequent cluster nodes. Example: ``https://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
| **HTTP Proxy(--http_proxy)**| Leave this blank unless you are using an HTTP Proxy. This setting will be propagated to all PCG nodes and all subsequent cluster nodes. Example: ``http://USERNAME:PASSWORD@PROXYIP:PROXYPORT``.|
| **No Proxy(--no_proxy)**| The default is blank. You can add a comma-separated list of local network CIDR addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server.  Example if you have a self-hosted environment: ``maas.company.com,10.10.0.0/16``.|
| **Pod CIDR (--pod_cidr)**|Enter the CIDR pool that will be used to assign IP addresses to pods in the cluster. The pod IP addresses should be unique and should not overlap with any machine IPs in the environment.|
| **Service IP Range (--svc_ip_range)**|Enter the IP address range that will be used to assign IP addresses to services in Kubernetes clusters. The service IP addresses should be unique and not overlap with any virtual machine IPs in the environment.|

<br />


#### MAAS Account Information

|**Parameter**| **Description**|
|-------------|----------------|
| **API Endpoint** |Enter the MAAS API endpoint. This can be a domain or IP address. Example: ``http://10.11.12.13:5240/MAAS``.|
| **API Key** |Enter an active MAAS API key to use for authentication.|

<br />

8. When the installer prompts you, select the following to configure the MAAS server:

    - Availability Zone
    - Domain
    - Resource Pool
    - One node (no HA) or three nodes (HA)

When you have entered all the configuration values, the installer saves the gateway configuration file to disk and prints its location before proceeding with the installation. For example:

``/tmp/install-user-defined-MaaS-Gateway_Name-20210805155034/pcg.yaml``

The installer then requests available bare metal machines in your MAAS environment on which to install the gateway. If the deployment fails due to misconfiguration, update the gateway configuration file and rerun the installer. Refer to the **Edit PCG Config** tab above.

If you need assistance, please visit our [Customer Support](https://spectrocloud.atlassian.net/servicedesk/customer/portals) portal.

<br />

## Validation

Once installed, the gateway registers itself with Palette. To verify the gateway is registered, navigate to **Tenant Settings > Private Cloud Gateways > MAAS** and verify the gateway is listed on the Manage Private Cloud Gateways page. 

When you install the gateway, a cloud account is auto-created. To verify the cloud account is created, go to **Tenant Settings > Cloud Accounts** and locate **MAAS** in the table. Verify your MAAS account is listed.

</Tabs.TabPane>

<Tabs.TabPane tab="Edit PCG Config" key="edit_pcg_config">


# Edit PCG Configuration File

Use the following steps if you want to edit the PCG configuration file directly.

<br />

1. Copy the ``pcg.yaml`` file out of ``/tmp/install-user-defined-MaaS-Gateway_Name-20210805155034/pcg.yaml`` and into ``/tmp`` as follows.


```bash
cp /tmp/install-User-define-MaaS-Gateway-Name-20210805155034/pcg.yaml  /tmp
```


2. Make the necessary changes to the configuration file.


3. Before you redeploy the gateway, do the following: 

    <br />

    - Ensure the pairing code in the configuration file is the same as the pairing code displayed in the Private Gateway installation instructions in Palette. To verify the pairing code, click the **Create Private Cloud Gateway** button and select **MAAS**. Note the pairing code and verify it is the same code in the configuration file. 

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

</Tabs.TabPane>

</Tabs>

<br />

# Update and Manage the MAAS Gateway

Palette maintains the Operating System (OS) image and all configurations for the PCG. Periodically, the OS images, configurations, and other components need to be updated to resolve security or functionality issues. Palette releases updates when required, and informs you with an update notification on the gateway.

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



Follow these steps to resize a single-node gateway to three nodes.

<br />

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.


2. Navigate to the **Main Menu** and select **Tenant Settings > Private Cloud Gateways**.


3. Click the **three-dot Menu** for the gateway instance you want to resize and choose **Set number of nodes**.


4. Change the number of nodes to 3.

Two new nodes will be created in the cluster.

<br />

# Next Steps

You can now create tenant clusters in the auto-created cloud account.  To get started, check out [Create and Manage MAAS Clusters](/clusters/data-center/maas/create-manage-maas-clusters).

You can also create additional cloud accounts if you need them. Refer to [Register and Manage MAAS Cloud Accounts](/clusters/data-center/maas/register-manage-mass-cloud-accounts).


<br />

# References 

 - [Install MAAS](https://maas.io/)
 - [Install MAAS How-To](https://maas.io/docs/how-to-install-maas)

<br />

<br />
