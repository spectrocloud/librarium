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

Palette’s On-Prem Quick-Start mode is a single-node deployment of a self-hosted Palette instance in vCenter. This single-node installation is typically used for Proof of Concept (POC) deployments to quickly understand the capabilities of the Palette platform. It is not recommended for Production deployments but serves as a precursory installation for Enterprise mode.  

For production environments, you will migrate the single-node cluster you deploy in Quick-Start mode to Enterprise mode. Enterprise mode deploys two additional nodes to create a three-node highly available cluster. For steps on how to migrate the single-node cluster to Enterprise mode, refer to the [Migrate Cluster to Enterprise Mode](/vertex-edition/migrate-cluster-to-enterprise-mode) guide.

# Prerequisites

- Downloaded platform installer Open Virtualization Appliance (OVA) file using the link provided.


- Added port permissions to inbound rules for security groups to provide Palette connectivity and outbound connections. Refer to [Network Ports](/architecture/networking-ports/#self-hostednetworkcommunicationsandports) for a list of required ports that must enabled for inbound or outbound communication. 

??Do users do this in the FIPS-enabled pack when the profile is created. If so, this doesn't seem to be a prerequisite.??

- A new or existing SSH key pair to access the platform installer for any troubleshooting.  
 
# Install Palette


1. Log in to vCenter Server by using the vSphere Client.


2. Navigate to the Datacenter and select the cluster you want to use for the installation. Right-click on the cluster and select **Deploy OVF Template**.


3. Provide the platform installer URL you received from our support team and click on **Next** to proceed.

  You may get a warning message stating the certificate is not trusted. You can ignore this message and select **Next**.


4. Type a custom name for your Virtual Machine (VM) in the **Virtual machine name** field, and select a location for the virtual machine.


5. Select a compute resource and click **Next**. Template details will be displayed. Review the details. You can click **Ignore** in the warning box about an untrusted certificate. 


6. Select your storage device and click **Next**.


7. Choose a network for your appliance. The installer requires an outgoing internet connection. Select a network that provides this access either directly or via a proxy. Click **Next** to proceed.


8. Fill out template customization options. Scroll to view all the options. If needed, you can modify the following input fields before completing the setup. <br /><br />

  ### General Settings

  | Parameter | Description |  Default Value |
  | --- | --- | -- |
  | **SSH Public Key** | The key to enable Secure Shell (SSH) for the default user. You can create a new public key or use an existing one. The public key will be installed in the installer VM to provide SSH access as user ``ubuntu``. This is useful for troubleshooting purposes. | - |
  | **Name** | A name to identify the platform installer. | `spectro1`|

  ### Kubernetes Cluster Settings

  | Parameter | Description | Default Value |
  | --- | --- | --- |
  | **Pod CIDR** | CIDR range for pods in the cluster. This must not overlap with the host or service network. |`192.168.0.0/16` |
  | **Service cluster IP range** | CIDR notation IP range from which to assign service cluster IPs. This must not overlap with IP ranges assigned to nodes or pods. | `10.96.0.0/12` |

  ### Monitoring Console

  | Parameter | Description | Default Value |
  | --- | --- | ---|
  | **Monitoring Console Password** | A password that gives access to the monitoring console after you power on the VM to view installation status and system logs. You can configure the password or use the default password `admin`, default username: `admin`. After powering on the VM, you can access the console at `https://<vm_ip_address>:5080`. You must append port ``5080`` to the VM IP address. | `admin:admin` |

  <br />

  ### Network Settings

  | Parameter | Description | Default Values |
  | --- | --- | ---|
  | **Static IP gateway** | Gateway IP address, such as 192.168.0.1, required only for static IP allocation. | - |
  | **Static IP DNS** | Comma-separated DNS addresses, required only for static IP allocation. | - |
  | **Static IP search domains** | Comma-separated search domains, required only for static IP allocation. | - |
  | **Static IP Address** | VM IP address to use only if you are using static IP allocation. If you are using default DHCP, leave fields blank. | DHCP |
  | **Static IP subnet prefix** | Static IP subnet prefix to use only if you are using static IP allocation. For example, `18`. | - |

  <br />

  ### Proxy Settings

  
  <InfoBox>
  
  Palette VerteX installations do not use a proxy. You can skip proxy configuration.

  </InfoBox>

  | Parameter | Description | Default Values |
  | --- | --- | ---|
  | HTTPS Proxy | Optional HTTPS proxy endpoint for outbound connections. | - |
  | NO Proxy | Optional comma-separated list of vCenter server, local network CIDR, hostnames, and domain names that should be excluded from proxying. | - |
  | Proxy Certificate | Optional certificate used by the proxy for encryption encoded in base64. | - |
  | HTTP Proxy | Optional HTTP proxy endpoint for outbound connections. | - |

  <br />

    ### Spectro Cloud Repository

  | Parameter | Description | Default Values |
  | --- | --- | --- |
  | **Password** | Repository password. If you used the default earlier, type `admin`. | - |
  | **User Name** | Repository user name. If you used the default earlier, type `admin`. | - |
  | **Location** | Artifacts for spectro cloud platform are retrieved from a public repository by default. As an alternative, a dedicated artifact repository can be configured below. This is typically done for FIPS-enabled Palette and air gapped environments.  | - |


6. When you have completed filling out template options, click **Next**. Configuration details will be displayed. Review the details. If you need to make any changes, you can click the **Back** button. Click **Finish** when you are done. <br />

  The vSphere Client dashboard is displayed as the OVF begins downloading and the virtual appliance is deployed. The process takes a few minutes to complete.


7. To view deployment progress, select the cluster in the Datacenter. 


8. When deployment status displays **Completed**, power on the appliance.


9. When the virtual appliance IP address displays next to the VM instance, copy it to a new tab. In the new tab, add prefix `https://` and append port number `:5080`. For example: `https://10.10.189.125:5080`. <br /><br />

![Arrow pointing to the location of the VM IP address in vSphere](/vertex_virtual-machine-ip.png)

<br /><br />


  You may get a warning message stating your connection is not private. You can ignore this message and select **Advanced**, then click the link to proceed.
  
  The On-prem supervisor console displays a **Status** tab. Take note of status for  **Spectro Cloud artifacts**, **Kubernetes configuration**, and **Palette installation**. Confirm all of these have processed successfully. This will take about 45 minutes. When processing is complete and **Status** displays **Done**, URLs for the On-Prem System Console and the Management Console are displayed.

  <br />

6. Click the **On-Prem System Console** URL. A privacy notification displays. Click the **Advanced** button, then click the link to proceed.


7. Enter default Palette credentials and click **Login**. Default: **admin/ admin**. 

    <br />

    You will be prompted to reset the password.


8. After you successfully reset the Palette password, the **Choose Installation Mode** window displays. You can install Palette in **Enterprise** mode or **Quick Start** mode.

<br />

<Tabs>
<Tabs.TabPane tab="Enterprise Mode" key="Enterprise">


  To install Palette Enterprise or Palette VerteX, do the following.

<br />

 
- Click the **Install Now** button displayed under **Enterprise**. The **Summary** window displays.  


- Click the **Migrate to Enterprise** button. 

<br />

![Arrow pointing to the Migrate to Enterprise button.](/vertex_migrate-to-enterprise.png)

<br />
  

- Follow steps in the [Migrate Cluster to Enterprise Mode](/vertex-edition/migrate-cluster-to-enterprise-mode) guide.

</Tabs.TabPane>

<Tabs.TabPane tab="Quick-Start Mode" key="Quick-Start">

To install for a POC, click the **Start Now** button under **Quick Start**.

</Tabs.TabPane>
</Tabs>

# Validation

Validate your setup... 

# Next Steps

If you are using the installation as a POC, you can now create gateways, cloud accounts, cluster profiles, and launch clusters using the management console. [Need a link here to Clusters docs].

If you are installing for a production environment, you are ready to migrate the initial appliance you deployed to Enterprise mode. Refer to the [Migrate Cluster to Enterprise Mode](/vertex-edition/migrate-cluster-to-enterprise-mode) guide. 



<br />


<br />

