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

Palette’s On-Prem Quick-Start Mode is a single-node installation of the Palette platform in vCenter. This installation is typically used for Proof of Concept (POC) deployments to quickly understand the capabilities of the Palette platform. It is not recommended for Production deployments but serves as a precursory installation for Enterprise mode. 

For production environments, you will migrate the single-node cluster you deploy in Quick-Start mode to Enterprise mode. Enterprise mode deploys two additional nodes to create a three-node cluster for High Availability (HA). For steps on migrating the single-node cluster to Enterprise Mode, refer to the [Migrate Cluster to Enterprise Mode](/vertex-edition/migrate-cluster-to-enterprise-mode) guide.

# Prerequisites

- Downloaded platform installer Open Virtualization Appliance (OVA) file using the link provided, and upload it into vCenter.


- Added port permissions to inbound rules for security groups to provide Palette connectivity and outbound connections. Refer to [Network Ports](/architecture/networking-ports/#self-hostednetworkcommunicationsandports) for a list of required ports that must enabled for inbound or outbound communication. 


- A new or existing SSH key pair to access the platform installer for any troubleshooting.  
 
# Install Palette

The following steps will guide you to deploy the installer for your Palette platform. 

<br />

<InfoBox>

We recommend using the Chrome browser.

</InfoBox>

<br />

1. Log in to the vSphere console and navigate in the left **Main Menu** to **Datacenter** and the folder you will use for your installation.


2. Right-click on the folder and select **Deploy OVF Template**.


3. Provide the URL for the platform installer. ?? Does user receive this URL from Spectro Support ??


4. Type a custom name for your Virtual Machine (VM) in the **Virtual machine name** field, and select the folder that contains the OVF.


5. Select a compute resource and click **Next**. Template details will be displayed. Review the details. You can click **Ignore** in the warning box about an untrusted certificate. 


6. Select the storage option and click **Next**.


7. Select a destination network. The installer requires an outgoing internet connection. Select a network that provides this access directly or via a proxy. When you have made your selection, click **Next** to continue.


8. Fill out template customization options. If needed, you can modify the following input fields at a later time. <br /><br />

  ### General Settings

  | Parameter | Description |  Default Value |
  | --- | --- | -- |
  | **SSH Public Key** | The key to enable ssh for the default user. You can create a new public key or use an existing one. The public key will be installed in the installer VM to provide SSH access as user ``ubuntu``, which is useful for troubleshooting purposes. | - |
  | **Name** | A name to identify the platform installer. | `spectro1`|

  ### Kubernetes Cluster Settings

  | Parameter | Description | Default Value |
  | --- | --- | --- |
  | **Pod CIDR** | CIDR range for pods in the cluster. This must not overlap with the host or service network. |`192.168.0.0/16` |
  | **Service cluster IP range** | CIDR notation IP range from which to assign service cluster IPs. This must not overlap with IP ranges assigned to nodes or pods. | `10.96.0.0/12` |

  ### Monitoring Console

  | Parameter | Description | Default Value |
  | --- | --- | ---|
  | **Monitoring Console Password** | A password that gives access to the monitoring console after you power on the VM to view installation status and system logs. Access the console at https://<vm_ip_address>:5080. You must append port ``5080`` to the VM IP address. Username: `admin`. You can configure the password or use the default password `admin`.  | `admin:admin` |

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


6. When you are done filling out options, click the **Finish** button. Status is displayed for **Spectro Cloud artifacts**, **Kubernetes configuration**, and **Palette installation**. Confirm these have processed successfully. Processing may take a few minutes. URLs for the Monitoring Console and the on-prem System Console will be displayed when processing is complete.

  <br />

6. Copy the URL for the **On-Prem System Console** to a new tab. A privacy notification displays. Click the **Advanced** button, then click the **Proceed** link.


7. Enter default Palette credentials and click the **Login** button. Default: **Username**: admin, **Password**: admin. 

    <br />

    A form displays to reset the password. Type a new password and click the **Reset Password** button.


8. Install Palette: 

     - To install Palette Enterprise or Palette VerteX, click the **Install Now** button displayed under **Enterprise** and follow steps in the [Migrate Cluster to Enterprise Mode](/vertex-edition/migrate-cluster-to-enterprise-mode) guide.

     - To install for a POC, click the **Start Now** button under **Quick Start**.


# Validation




# Next Steps

If you are using the installation as a POC, you can now create gateways, cloud accounts, cluster profiles, and launch clusters using the management console. [Need a link here to Clusters docs].

If you are installing for a production environment, you are ready to migrate the initial cluster you deployed to Enterprise mode. [Link here to Enterprise Mode doc].



<br />


<br />

