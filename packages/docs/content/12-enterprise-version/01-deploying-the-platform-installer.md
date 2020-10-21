---
title: "Quick Start Mode"
metaTitle: "Quick Start Mode"
metaDescription: "A quick start to Spectro Cloud Plaform for PoC purposes."
icon: ""
hideToC: false
fullWidth: false
---

import InfoBox from '@librarium/shared/src/components/InfoBox';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# Quick Start Installation

As a prequisite, download the platform installer ova using the link provided, and upload it into vCenter.


## Deploy Platform Installer

1. Login to vSphere console and navigate to VMs and Templates.
2. Navigate to the Datacenter and folder you would like to use for the installation.
3. Right-click on the folder and invoke the VM creation wizard by selecting the option to Deploy OVF Template.
4. Complete all the steps of the OVF deployment wizard. Provide values for various fields as follows:
    * URL: <Location of the plaform installer>
    * Virtual Machine Name: <vm name>
    * Folder: <Select desired folder>
    * Select the desired Datacenter, Storage, and Network for the platform installer VM as you proceed through the next few steps. Platform installer VM requires an outgoing internet connection. Select a network that provides this access directly, or via a proxy.
    * Customize the template as follows:
        * SSH Public Keys: Create a new ssh key pair (or pick one of your existing ones). Enter the public key in this field. The public key will be installed in the installer VM to provide ssh access, as the user 'ubuntu'. This is useful for troubleshooting purposes.
        * Monitoring Console Password: A monitoring console is deployed in the platform installer VM to provide detailed information about the installation progress as well as to provide access to various logs. This console can be accessed after the VM is powered on at https://<VM IP Adddress>:5080. Default monitoring console credentials are, User Name: admin and Password: admin. Provide a different password for the monitoring console if desired. Leave the field blank to accept default password. 
        * Static IP Address: &lt;VM IP Address&gt; Optional IP address(e.g: 192.168.10.15) to be specified only if static IP allocation is desired. DHCP is used by default.
        * Static IP subnet prefix: &lt;Network Prefix&gt; Network gateway IP (e.g: 192.168.0.1), required only for static IP allocation.
        * Static IP gateway: &lt;Gateway IP Address&gt; Static IP subnet prefix (e.g: 18), required only for static IP allocation.
        * Static IP DNS: &lt;Name servers&gt; Comma separated DNS addresses (e.g: 8.8.8.8, 192.168.0.8), required only for static IP allocation.
        * HTTP Proxy: &lt;endpoint for the http proxy server&gt;, e.g: _http://USERNAME:PASSWORD@PROXYIP:PROXYPORT_.  An optional setting, required only if a proxy is used for outbound connections.
        * HTTPS Proxy: &lt;endpoint for the https proxy server&gt;, e.g: _http://USERNAME:PASSWORD@PROXYIP:PROXYPORT_.   An optional setting, required only if a proxy is used for outbound connections.
        * NO Proxy: &lt;comma-separated list of vCenter server, local network CIDR, hostnames, domain names that should be excluded from proxying&gt;, e.g: _vcenter.company.com_,10.10.0.0/16.
        * Spectro Cloud Repository settings: The platform installer downloads various platform artifacts from a repository. Currently this repository is hosted by Spectro Cloud and the installer VM needs to have outgoing internet connection to the repository. Upcoming releases will enable the option to privately host a dedicated repository to avoid having to connect outside. This option is currently unavaialble. Leave all the fields under Spectro Cloud Repository settings blank
    * Finish the OVF deployment wizard and wait for the template to be created. This may take a few minutes as the template is initially downloaded.
5. Power on the VM.
    
## Monitor Installation

The platform installer contains a web application called the Supervisor, to provide detailed progress of the installation. After the VM is powered on, perform the following steps to ensure installation is completed successfully. 

1. Open the Supervisor application in a browser window by navigating to https://<VM IP Address>:5080
2. Observe the installation status in the Status tab. The page auto-refreshes to provide updated installation progress. 
3. Once the final installation step is complete, you will see URLs to navigate to the On-Prem System Console as well as the Management Console. 
4. Navigate to the On-Prem System Console to perform initial configuration. Additional administration tasks like SMTP setup, certificate manamgent etc. can also be performed from the On-Prem System Console. 
    
Note: Typically installation takes around 10 mins after powereing on the virtual machine. If the installtion fails or takes an unusually long time, please look for failrue messages in the install status page, or access system logs from the 'Logs' tab to get detailed information about the failure.
 
 
## Initial Configuration

The On-Prem System Console provides various options for performing various administrative setup tasks. Most of these are optional and can be performed at any later time. To quickly start using the platform functionality, all you need to do is create your first tenant and activate it. 

1. Open the On-Prem System Console applicaton in a browser window by navigating to https://<VM IP Address>/system.
2. Login using username:admin and password:admin
3. Reset the default password
4. Choose Quick Start mode when prompted for a choice for startup mode. 
5. Navitate to Tenant Management section and create your first tenant.
6. Copy the tenant activation link and invoke it in a browser winow to activate the newly created tenant .  
7. Enter the desired password and proceed and login as a tenant into the Management Console. 
    
As next steps, continue to perform various tasks as desired from the management console like [create cloud accounts], [create tenant IP pool], [create cluster profiles] and [launch kubernetes clusters]
    
    
    
