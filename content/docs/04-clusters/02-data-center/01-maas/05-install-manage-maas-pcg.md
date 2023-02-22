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

The Private Cloud Gateway (PCG) enables support for isolated private cloud or data center environments. You can set up the cloud gateway as a single-node or three-node cluster. 
<br />

<InfoBox>

For production environments, we recommend using three nodes. If you initially set up the gateway with one node, you can resize it at a later time. 

</InfoBox>


Palette provides an installer in the form of a docker container that is temporarily deployed on your laptop, workstation or jump-box. You can run the installer on any system that has a docker daemon installed and connectivity to Palette and the MAAS identity endpoint.


# Prerequisites

- A linux computer with a docker daemon installed and a connection to Palette and the MAAS endpoint. The installer must be invoked on a linux system.

- One IP address for a Kubernetes control-plane.

- One IP address for a single-node gateway or three IP addresses for a three-node gateway.

- Sufficient IPs for application workload services, such as Load Balancer services.

<WarningBox>

By default, the MAAS Kubernetes pack uses 192.168.0.0/16. Ensure that the Pod CIDR range for any clusters you deploy after setting up the PCG do not overlap with the network used by the bare metal machines that MAAS manages.

</WarningBox>

- Minimum capacity requirements as follows:

    - One node (no HA): 4 vCPU, 8 GiB Memory, 60 GiB Storage.
    - Three nodes (HA): 6 vCPU, 12 GiB Memory, 90 GiB Storage.<br /><br />

- An active MAAS API key in the format  ``[consumer_key], [key], and [secret] tokens: API key = '[consumer_key]:[key]:[secret]'``.

- The DNS server that the installer will use must be able to resolve the public internet names of the machines that MAAS manages because the installer must connect to the machines.  

    The installer must connect to the MAAS machines. This is commonly done by ensuring the DNS server delegates the MAAS domain to the MAAS controlplane. To connect, the installer uses the FQDN ``machine-hostname.maas``. A common way to enable this is to ensure that the DNS server delegates the MAAS domain to the MAAS controlplane.


# Install the Gateway

`video: title: "maas-pcg-creation": /pcg-creation-video/maas.mp4`

Follow these steps to install the PCG. 

1. Log in to [Palette](https://console.spectrocloud.com).

2. From the **User Menu**, select Cluster Mode and choose **Tenant Admin**.

3. Navigate to the **Main** menu and select **Tenant Settings > Private Cloud Gateway** below the table.

4. Select **MAAS**. Private Gateway installation instructions are displayed.

5. Copy the pairing code displayed on the instructions page. You will input this code when you run the installer.

6. Copy the following commands to your terminal to invoke the installer.
    <br />

    ```bash
    docker run -it --rm \
    --net=host \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /tmp:/opt/spectrocloud \
    gcr.io/spectro-images-public/release/spectro-installer:1.0.11 \
    -o true
    ```

7. When prompted, enter information listed in each of the following tables. The installer will generate the gateway configuration file. 
    <br />

    <WarningBox>

    When specifying the MAAS endpoint, be sure not to add a trailing / .

    </WarningBox>

    <br />

#### Palette Information:

|**Parameter**       | **Description**|
|:-----------------------------|---------------|
|**Install Type**| Choose **Private Cloud Gateway** or **Self Hosted Enterprise Cluster**. <br />You can change your selection with the up or down keys.|
|**Cloud Type**| MAAS.|
|**Name** | Enter a custom name for the PCG.|
|**Endpoint** |Enter the Palette endpoint. Example: https://customername.console.spectrocloud.com. |
|**Username** |Enter your Palette username. This is your sign-in email address. Example: user1@company.com. |
|**Password** |Enter your Palette Password. This is your sign-in password.|
|**Private Cloud Gateway** |Enter the PCG pairing code you copied from the instructions page in step **5**. |

<br />

#### Environment Configuration:


|**Parameter**| **Description**|
|:-------------|----------------|
|**HTTPS Proxy (--https_proxy)**| Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all the nodes launched in the proxy network. Example: https://USERNAME:PASSWORD@PROXYIP:PROXYPORT.|
| **HTTP Proxy(--http_proxy)**| Leave this blank unless you are using an HTTPS Proxy. This setting will be propagated to all the nodes launched in the proxy network. Example: http://USERNAME:PASSWORD@PROXYIP:PROXYPORT.|
| **No Proxy(--no_proxy)**| The default is blank. A comma-separated list of local network classless inter-domain routing (CIDR) addresses, hostnames, and domain names that should be excluded from being a proxy. This setting will be propagated to all the nodes to bypass the proxy server. Example: maas.company.com,10.10.0.0/16.|
| **Pod CIDR (--pod_cidr)**|The CIDR pool used to assign IP addresses to pods in the cluster. This setting will be used to assign IP addresses to pods in Kubernetes clusters. The pod IP addresses should be unique and should not overlap with any virtual machine IPs in the environment.|
| **Service IP Range (--svc_ip_range)**|The IP address range that will be used to assign IP addresses to services in Kubernetes clusters. The service IP addresses should be unique and not overlap with any virtual machine IPs in the environment.|

<br />


#### MAAS Account Information:

|**Parameter**| **Description**|
|-------------|----------------|
| **API Endpoint** | The MAAS API endpoint. This can be a domain or IP address. Example: http://10.11.12.13:5240/MAAS.|
| **API Key** |Generate an API key from MAAS and enter it when prompted. This key will be used for authentication.|

<br />

#### MAAS server configuration:

When the installer prompts you, select the following:

- Availability Zone
- Domain
- Resource Pool
- One node (no HA) or three nodes (HA)

The installer generates a gateway configuration file and its location is displayed on the console.
For example: <br />

``Config created:/opt/spectrocloud//User-define-MaaS-Gateway-Name-20210805155034/pcg.yaml``

<br />

8. Copy the ``pcg.yaml`` file from ``/tmp/install-user-defined-MaaS-Gateway_Name/pcg.yaml`` to ``/tmp``.

<WarningBox>

After you copy ``pcg.yaml``, delete it from ``/tmp/install-user-defined-MaaS-Gateway_Name/pcg.yaml`` because it contains your Spectro Cloud credential.

</WarningBox>

9. To deploy the gateway, copy the following code snippet to your terminal and provide the gateway configuration file as input.
<br />

    ```bash
    docker run -it --rm \
    --net=host \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /tmp:/opt/spectrocloud \
    gcr.io/spectro-images-public/release/spectro-installer:1.0.11 \
    -s true \
    -c //opt/spectrocloud/pcg.yaml
    ```
The installer selects available bare metal machines in your MAAS environment on which to install the gateway. If the deployment fails due to misconfiguration, update the gateway configuration file and rerun the command.

If you need assisstance, you can send a message to our slack channel with questions: #support-sustaining.


# Validation

Once installed, the gateway registers itself with Palette's SaaS portal. To verify the gateway is registered, go to **Tenant Settings > Private Cloud Gateways** and verify the gateway is listed in the **Manage Private Cloud Gateways** table. 

When you install the gateway, a default MAAS cloud account is automatically created. To verify the account creation, go to **Tenant Settings > Cloud Accounts** and locate **MAAS** in the table. Verify your MAAS account is listed.


# Upgrade and Manage the MAAS Cloud Gateway

Palette maintains the Operating System (OS) image and all configurations for the PCG. Periodically, the OS images, configurations, or other components need to be upgraded to resolve security or functionality issues. Palette releases upgrades when required, and informs you with an upgrade notification on the gateway.

Review the changes in the upgrade notification, and apply the upgrade when you are ready. 

Upgrading the cloud gateway does not result in any downtime for the tenant clusters. During the upgrade process, new cluster provisioning is unavailable. New cluster requests are queued and processed when the gateway upgrade is complete.


# Delete the MAAS Private Gateway

Follow these steps to delete a MAAS gateway.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin. 

2. Navigate to the **Main** menu and select **Tenant Settings > Private Cloud Gateways**.

3. Click the **three-dot Menu** for the gateway instance you want to delete and choose **Delete**.

    Palette checks for running tenant clusters associated with the gateway instance and displays an error message if it detects any.

4. If there are running clusters, delete them and retry deleting the gateway instance.


# Resize the MAAS Gateway

You can set up a PCG as a single-node (no HA) or three-node (HA) cluster. You can set up a PCG initially with one node and resize it to three nodes at a later time.

<InfoBox>

For production environments, we recommend setting up three nodes.

</InfoBox>

Follow these steps to resize a single-node gateway to three nodes.

1. Log in to [Palette](https://console.spectrocloud.com) as a tenant admin.

2. Navigate to the **Main** menu and select **Tenant Settings > Private Cloud Gateways**.

3. Click the **three-dot Menu** for the gateway instance you want to resize and choose **Set number of nodes**.

4. Change the number of nodes to 3.

    Two new nodes are created in the cluster.


# Next Steps

Now that you have a MAAS cloud account, you can use it to create tenant clusters. You can also create additional cloud accounts if desired. Check out [Register and Manage MAAS Cloud Account](??) guide to learn more.
