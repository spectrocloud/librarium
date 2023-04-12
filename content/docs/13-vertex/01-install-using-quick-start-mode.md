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

For production environments, you will migrate the single-node cluster you deploy in Quick-Start mode to Enterprise mode. Enterprise mode deploys three nodes for High Availability (HA). For steps on migrating the single-node cluster, refer to the [Migrate Cluster to Enterprise Mode](/vertex-edition/migrate-cluster-to-enterprise-mode) guide.

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


2. Right-click on the folder and select **Deploy OVF Template**.


3. Fill out the fields listed in the table.

| **Field**               | **Description**                                    |
|---------------------|--------------------------------------------------------|
| **URL**                 | The location of the platform installer.            |
| **Virtual Machine Name**| A custom name for your virtual machine.            |
| **Folder**              | The name of the folder that contains the OVF.      |

4. Select the desired Datacenter, Storage, and Network for the platform installer.

    The installer requires an outgoing internet connection. Select a network that provides this access directly or via a proxy.

    <br />

5. Fill out the remaining template customization options. You can modify the following input fields. <br /><br />

  ### General Settings

  | Parameter | Description |  Default Value |
  | --- | --- | -- |
  | SSH Public Key | The key to enable ssh for the default user. | - |
  | Name | The name to identify the platform installer. | `spectro1`|

  ### Kubernetes Cluster Settings

  | Parameter | Description | Default Value |
  | --- | --- | --- |
  | Pod CIDR | CIDR Range for Pods in the cluster. This must not overlap with any of the host or service network. |` 192.168.0.0/16` |
  | Service cluster IP range | CIDR notation IP range from which to assign service cluster IPs. This must not overlap with any IP ranges assigned to nodes or pods. | `10.96.0.0/12` |

  ### Monitoring Console

  | Parameter | Description | Default Value |
  | --- | --- | ---|
  | Monitoring Console Password | Installation status and system logs can be accessed from the monitoring console at `https://[ip address]:5080`.   Username: `admin`. Password can be configured below. Default password - `admin`.  | `admin:admin` |

  <br />

  ### Network Settings

  | Parameter | Description | Default Values |
  | --- | --- | ---|
  | Static IP gateway | Gateway IP address, such as 192.168.0.1, required only for static IP allocation. | - |
  | Static IP DNS | Comma-separated DNS addresses, required only for static IP allocation. | - |
  | Static IP search domains | Comma-separated search domains, required only for static IP allocation. | - |
  | Static IP Address | Configure settings below to assign a static IP address. Leave all fields blank for DHCP. | - |

  <br />

  ### Proxy Settings

  | Parameter | Description | Default Values |
  | --- | --- | ---|
  | HTTPS Proxy | Optional HTTPS proxy endpoint. | - |
  | NO Proxy | Optional comma-separated list of vCenter server, local network CIDR, hostnames, and domain names that should be excluded from proxying. | - |
  | Proxy Certificate | Optional certificate used by proxy for encryption encoded in base64. | - |
  | HTTP Proxy | Optional HTTP proxy endpoint. | - |

  <br />

    ### Spectro Cloud Repository

  | Parameter | Description | Default Values |
  | --- | --- | --- |
  | Password | Repository password. | - |
  | User Name | Repository user name. | - |
  | Location | Artifacts for spectro cloud platform are retrieved from a public repository by default. As an alternative, a dedicated artifact repository can be configured below. This is typically done for air gapped environments.  | - |


  When you have finished filling out options, status is displayed for **Spectro Cloud artifacts**, **Kubernetes configuration**, and **Palette installation**. Confirm these have processed successfully. Processing may take a few minutes.

  <br />

6. Copy the **On-Prem System Console** URL to a new tab. A privacy notification displays. Click the **Advanced** button, then click the **Proceed** link.


7. Enter default Palette credentials and click the **Login** button. Default: **Username**: admin, **Password**: admin. 

    <br />

    A form displays to reset the password. Type a new password and click the **Reset Password** button.


8. Install Palette: 

     - To install Palette Enterprise or Palette VerteX, click the **Install Now** button displayed under **Enterprise** and follow steps in the [Migrate Cluster to Enterprise Mode](/vertex-edition/migrate-cluster-to-enterprise-mode) guide.

     - To install for a POC, click the **Start Now** button under **Quick Start**.




# Validation

# Next Steps



<br />


<br />

