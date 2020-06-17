---
title: "Task: Create a VMware cloud gateway"
metaTitle: "Task: Create a VMware cloud gateway"
metaDescription: "The method of creating a cloud gateway on VMware for deploying a cluster through Spectro Cloud"
icon: ""
---

# Creating a cloud gateway

Setting up a cloud gateway involves initiating the install from the tenant portal, deploying gateway installer VM in vSphere and launching the cloud gateway from the tenant portal.

# Tenant Portal - Initiate Install

* As a tenant administrator, navigate to the *Private Cloud Gateway* page under settings and invoke the dialog to create new private cloud gateway.
* Note down the link to the Spectro Cloud Gateway Installer OVA and PIN displayed on the dialog.

# vSphere - Deploy Gateway Installer

* Initiate deployment of a new OVF template by providing a link to the installer OVA as the URL.
* Proceed through the OVF deployment wizard by choosing the desired name, placement, compute, storage and network options
* At the 'Customize Template' step, specify Spectro Cloud properties as follows:

| Parameter | Value | Remarks |
|---|---|---|
|Installer Name | Desired Spectro Cloud Gateway Name | The name will be used to identify the gateway instance. Typical environments may only require a single gateway to be setup, however multiple gateways might be required for managing clusters in multiple vCenters. Choose a name that can easily identify the environment that this gateway instance is being configured for.|
| Console End Point | URL to Spectro Cloud SaaS portal | https://console.spectrocloud.com by default |
|Pairing Code | PIN displayed on SaaS portal's 'Create new gateway' dialog. | |
| SSH Public Key | Optional key, userful for troubleshooting purposes (Recommnded) | Enables SSH access to the VM as 'ubuntu' user |

Additional properties that are required to be set only for a Proxy Environment. Each of the proxy properties may or may not have the same value but all the three properties are mandatory.

| Parameter | Value | Remarks |
|---|---|---|
|HTTP PROXY | The endpoint for the HTTP proxy server | This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT |
| HTTPS PROXY | The endpoint for the HTTPS proxy server | This setting will be propagated to all the nodes launched in the proxy network. Eg., http://USERNAME:PASSWORD@PROXYIP:PROXYPORT |
| SOCKS PROXY | The endpoint for the SOCKS Proxy server | This setting will be propagated to all the nodes running in the proxy network. Eg., PROXYIP:PROXYPORT |

* Finish the OVF deployment wizard and wait for the OVA to be imported and Virtual Machine to be deployed.
* Power on Virtual Machine

# Tenant Portal - Launch Cloud Gateway

*Close the 'Create New Gateway' dialog if still open or navigate to the Private Cloud Gateway page under settings in case you have navigated away or been logged out.
* Wait for a gateway widget to be displayed on the page and for the "Configure" option to be available. The IP address of the installer VM will be displayed on the gateway widget. This may take a few minutes after the virtual machine is powered on. Failure of the installer to register with the SaaS portal within 10 mins of powering on the Virtual Machine on vSphere, might be indicative of an error. Please follow the troubleshooting steps to identify and resolve the issue. 
* Click on "Configure" button to invoke the Spectro Cloud Configuration Dialog. Provide vCenter credentials and proceed to the next configuration step.
* Choose desired value for Datacenter, Compute Cluster, Datastore, Network, Resource pool and Folder. Optionally provide one or more SSH Keys and/or NTP server addresses. 
* Click on Deploy, to initiate provisioning of the gateway cluster. The status on the UI should change to 'Provisioning' and eventually 'Running' when gateway cluster is fully provisioned. This process might take several minutes (typically 8 to 10 mins). You can observe detailed provisioning sequence on the cluster details page, by clicking on the gateway widget on the UI. If provisioning of the gateway cluster runs into errors, or gets stuck, relevant details can be found on the summary tab or the events tab of the cluster details page. In certain cases where provisioning of the gateway cluster is stuck or failed due to invalid configuration, the process can be reset from the Cloud Gateway Widget on the UI.
* Once the Gateway transitions to Running state, it is fully provisioned and ready to bootstrap tenant cluster requests.

# vSphere - Clean up installer

* Power off installer OVA which was initially imported at the start of this installation process

> Gateway cluster installation automatically creates a cloud account behind the scenes using the credentials entered at the time of deploying the gateway cluster. This account may be used provisioning of clusters across all tenant Projects.
>
> A Pack registry instance is setup on the gateway cluster by default and it is registered as a private pack registry under Settings/Pack Registries. You can read more about Pack Registries [here](/registries-and-packs).

# Troubleshooting

##  Gateway installer - Unable to register with tenant portal

The installer VM, when powered on, goes through a bootstrap process and registers itself with the tenant portal. This process typically takes 5 to 10 mins. Failure of the the installer to  register with tenant portal within this duration, might be indicative of a bootstrapping error. SSH into the installer virtual machine using the key provided during OVA import and inspect the log file located at *'/var/log/cloud-init-output.log'*. This log file will contain error messages in the event there are failures with connecting to the SaaS portal, authenticating or downloading installation artifacts. A common cause for these errors is that the SaaS console end point or the pairing code is typed incorrectly. Ensure that the tenant portal console end point does not have a trailing slash. If these properties were incorrectly specified, power down and delete the installer VM and re-launch with the correct values.

Another potential issue is a lack of outgoing connectivity from the VM. The installer VM needs to have outbound connectivity directly or via a proxy. Adjust proxy settings (if applicable) to fix the connectivity or power down and delete the installer VM and relaunch in a network that enables outgoing connections. 

If the above steps do not resolve your issues, copy the **following script** to the installer VM and execute to generate a logs archive. Open a support ticket and attach the logs archive to the ticket to allow the Spectro Cloud Support team to troubleshoot and provide further guidance.

# SCRIPT NEEDED as per the previous paragraph

## Gateway Cluster - Provisioning failure or stuck

Installation of the gateway cluster may run into errors or might get stuck in provisioning state for a variety of reasons: a lack of infrastructure resources, IP addresses not being available, unable to perform NTP sync, etc. While these are most common, several other reasons could be the reasons. These might possibly be based on the underlying environment. The Cluster Details page, which can be accessed by clicking anywhere on the gateway widget, contains details of every orchestration step including an indication of the current task being executed. Any intermittent errors will be displayed on this page next to the relevant orchestration task. The events tab on this page also provides a useful resource to look at lower level operations being performed for various orchestration steps. If you think that the orchestration is stuck or failed due to an invalid selection of infrastructure resources or an intermittent problem with the infrastructure, you may reset the gateway by clicking on the 'Reset' button on the gateway widget. This will reset the gateway state to 'Pending' allowing you to reconfigure the gateway and start provisioning of a new gateway cluster. If the problem persists, please contact Spectro support via the Service Desk.
