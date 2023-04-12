---
title: "Install Using Quick-Start Mode"
metaTitle: "Install Palette Using Quick-Start Mode"
metaDescription: "Install Palette Using Quick-Start Mode."
icon: " "
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';


# Install Using Quick-Start Mode

Palette’s On-Prem Quick-Start Mode is a single-node installation of the Palette platform in vCenter vSphere. This installation is typically used for Proof of Concept (POC) environments to quickly understand the capabilities of the Palette platform. It is not recommended for Production deployments but serves as a precursory installation for Enterprise mode. 

For production environments, you will migrate the single-node cluster you deploy in Quick-Start mode to Enterprise mode, which deploys three nodes in VSphere. For steps on migrating the single-node cluster, refer to the [Migrate Cluster to Enterprise Mode](/vertex-edition/migrate-cluster-to-enterprise-mode) guide.

# Prerequisites

- Downloaded platform installer Open Virtualization Application/Appliance (OVA) file using the link provided, and upload it into vCenter.


- Added port permissions to Inbound rules for Security groups for Palette connectivity and outbound connections. Refer to [Network Ports](/architecture/networking-ports/#self-hostednetworkcommunicationsandports) for a list of required ports that must enabled for inbound or outbound communication. 


- A new or existing SSH key pair to access the installer VM for any troubleshooting.  
 
# Install Palette

The following steps will guide you to deploy the installer for your Palette platform. 

<br />

<InfoBox>

We recommend using the Chrome browser.

</InfoBox>

<br />

1. Log in to the vSphere console and navigate in the left navigation pane to **Datacenter** and the folder you will use for your installation.


2. Right-click on the folder and select **Deploy OVF Template** to invoke the VM creation wizard.


3. Complete the steps of the OVA deployment wizard. Fill out fields listed in the table.

| **Field**               | **Description**                                        |
|---------------------|--------------------------------------------------------|
| **URL**                 | Platform installer location.                           |
| **Virtual Machine Name**| A custom name for your virtual machine.                |
| **Folder**             | The name of the folder that contains the OVA.           |

4. Select the desired Datacenter, Storage, and Network for the platform installer VM. ??what is the the installer VM??

    The Platform installer VM requires an outgoing internet connection. Select a network that provides this access directly or via a proxy.

    <br />

5. Customize the installer VM by filling out the fields listed in the table.

  <br />

    | **Field**               | **Description**                                    |
    |---------------------|--------------------------------------------------------|
    | **SSH Public Keys**| Your public key. The public key to provide SSH access, as user ``ubuntu``. This is useful for troubleshooting purposes. |
    | **Name**  | Platform installer name. ??Is this the OVA?? |
    | **Pod CIDR** (optional) | IP range for pods. This range should be different than your network CIDR to avoid overlapping IP addresses. |
    | **Service cluster IP range** (optional) | IP range for service clusters. This range must not overlap with the pod CIDR range or your network CIDR range. |
    | **Monitoring Console Password** | A console you can access after powering on the VM to view details about the installation progress and view logs for troubleshooting. Access the console at https://<vm_ip_address>:5080. The default credentials are:<br /><br />User name: admin<br />Password: admin |
    | **Static IP gateway**         | Gateway IP address required only for static IP allocation. |
    | **Static IP DNS**             | Comma-separated list of Domain Name Service (DNS) addresses of name servers. Example: 8.8.8.8,192.168.0.8. |
    | **Static IP search domains**  | A domain used as part of a domain search list to create a fully qualified domain name (FQDN) from a relative name. |
    | **Static IP Address** (optional)   | VM IP address if you are using static IP allocation. Default: DHCP. |
    | **Static IP subnet prefix**        | Network prefix required only for static IP allocation. |
    | **HTTPS Proxy** (optional)            | Endpoint for the http proxy server required only if you are using a proxy for outbound connections. Example: https://username:password@proxyip:proxyport. |
    | **NO Proxy**  | Comma-separated list of vCenter server, local network CIDR, hostnames, and domain names to exclude from proxying. Example: vcenter.company.com,10.10.0.0/16. |
    | **Proxy Certificate**  |
    | **HTTP Proxy** (optional)            | Endpoint for the http proxy server required only if you are using a proxy for outbound connections. Example: http://username:password@proxyip:proxyport.|
    | Spectro Cloud Repository Settings | Provide settings for the following:<br /><br /> Password you received to access the Artifact Repository.<br />Username to access the Artifact Repository. <br /> The Artifact Repository location is provided.<br /> Certificate to access the Artifact Repository.|  

  <br />

  When you have finished providing information, status is displayed for Spectro Cloud artifacts, Kubernetes configuration, and Palette installation. Confirm these have processed, configured, and installed successfully.

  <br />

6. Copy the **On-Prem System Console** URL to a new tab. A privacy notification displays. Click the **Advanced** button, then click the **Proceed** link.


7. Enter defaul Palette credentials and click the **Login** button. Default: **Username**: admin, **Password**: admin. 

    <br />

    A form displays to reset the password. Type a new password and click the **Reset Password** button.


8. Install Palette: 

     - For an Enterprise installation and for Palette Vertex, click the **Install Now** button under **Enterprise** and follow steps in ...

     - For a POC, click the **Start Now** button under **Quick Start**.




# Validation

# Next Steps



<br />


<br />

