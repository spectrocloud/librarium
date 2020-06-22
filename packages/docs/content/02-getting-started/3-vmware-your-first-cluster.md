---
title: "VMware: Your First Cluster"
metaTitle: "VMware: Your First Cluster"
metaDescription: "Spectro Cloud page listing the steps for deploying VMware clusters"
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';

# VMWare Your First Cluster

<InfoBox>
The guided documentation guide below is prescriptive with the names and selections. We highly recommend you follow the guide verbatim for your first cluster.
</InfoBox>

The following steps will be taken to provision your first VMware cluster:

* Create Private Cloud Gateway.
* Create Cluster Profile.
* Add VMware Cloud Account.
* Provision Cluster.

# Private Cloud Gateway

1. Switch to the Admin view if you are in a project view by selecting Admin from the left navigation bar. 
2. Navigate to the settings in the admin view from the left navigation bar and select the Private Cloud Gateways.
3. Click on Create Private Cloud Gateway.
4. Copy the location of the gateway installer OVF template. Also note down the 4 digit pairing code displayed on the UI.
5. Login to vSphere console and navigate to VMs and Templates.
6. Pick a Datacenter you would like to use and under that, create a folder called 'Spectro'.
7. Right click on the folder and invoke the VM creation wizard by selecting the option to Deploy OVF Template.
8. Complete all steps of theOVF deployment wizard. Provide values for various fields as follows:
    * URL: <Location of the gateway installer from step #2>
    * Virtual Machine Name: spectro-cloud-gateway
    * Folder: Spectro
    * Select the desired Datacenter, Storage and Network for the gateway installed VM as you proceed through the next few steps. Private Cloud Gateway VMs require outgoing internet connection to the Spectro Cloud console. Select a network that provides this access directly, or via a proxy. 
    * Customize template as follows:
        * Installer Name: spectro-cloud-gateway. This is the name that will be used by the gateway to register itself on the tenant console. 
        * Console  Endpoint: https://console.spectrocloud.com
        * Pairing Code: <4 digit pairing code from code from step#2>
        * ssh public keys: Create a new ssh key pair (or pick one your existing ones). Enter the public key in this field. The public will be installed in the installer VM to provide ssh access as the user 'ubuntu'. This is useful for troubleshooting purposes. 
        * HTTP Proxy: &lt;endpoint for the http proxy server&gt;, e.g: _http://USERNAME:PASSWORD@PROXYIP:PROXYPORT_. Optional setting required only if a proxy is used for outbound connections
        * HTTPS Proxy: &lt;endpoint for the https proxy server&gt;, e.g: _http://USERNAME:PASSWORD@PROXYIP:PROXYPORT_. Optional setting required only if a proxy is used for outbound connections
        * SOCKS Proxy: &lt;endpoint for the SOCKS proxy server&gt;, e.g: _PROXYIP:PROXYPORT_. Optional setting required only if a proxy is used for outbound connections.
    * Finish OVF deployment wizard and wait for template fo be created. This make take a few minutes as the template is initially downloaded. 
9. Power on SpectroCloudGateway VM. 
10. Switch back to Spectro Cloud tenant console's admin view. Close the Cloud Gateway Installation Instructions if you still have it open. If you have been logged out or navigated away, you can access the page by clicking on Settings>Private Cloud Gateways in the left navigation bar.
11. Within a few minutes of having powered on the VM on vSphere console, it should register back as a Private Cloud Gateway on this page with the name spectro-cloud-gateway. 
12. From the actions menu for the gateway, click on Configure. It may take an additional minute or 2 for configure action to be available as the gateway goes through a configuration process after initially registering with the console. 
13. Enter server address, username and password for your vCenter. Leave the 'Use self-signed certificate' option selected, if a vSphere is configured with  a self-signed certificate. 
14. Leave the 'Share the account with projects' option selected. 
15. Validate Credentials. 
16. Click on 'Proceed to Configure'
17. Enter the desired settings for Datacenter, Compute Cluster, Network and Resource Pool. Select 'Spectro' as the folder. 
18. Select '1' for Number of Nodes. 
19. SSH Keys - Create a new ssh key pair (or pick one your existing ones).  Enter the public key in this field. The public will be installed in the gateway VM nodes to provide ssh access as the user 'spectro'. This is useful for troubleshooting purposes 
20. Leave NTP servers option blank
21. Click 'Confirm'. Private Cloud Gateway would transition to 'Provisioning' state. It takes around 10 to 15 minutes for the gateway to be installed. Two new VMs are created as part of gateway provisioning.
22. Proceed to the creation of cluster profile, once the gateway transitions to 'Running' state.

# Cluster Profile

1. Navigate to the Default Project (select back to Default project if you’re in the Admin view).
1. Switch to the *Cluster Profiles* page from the left navigation bar.
1. Click on the *Add Cluster Profile* button.
1. Specify the name **ExperimentalVMware** and click *Next*.
1. Select **VMware (VMware)** for the cloud selection.
1. Click on Start Configuring.
1. Please designate the following selections for each layer, leaving the default configuration:
    * OS: Ubuntu, 18.4.X (LTS)
    * Kubernetes: select version 1.17.X
    * Network: Calico 3.10.X
    * Storage: vSphere Storage Class
    * Additional layers:
        * Monitoring: Prometheus - Grafana 9.7.X
        * Monitoring: Kubernetes Dashboard 2.0.X
        * Logging: Elastic-Fluentd-Kibana (EFK) 6.7.X
    * Click on *Finish* to close the Layer dialogue.
1. Click on *Next* and review the *Cluster Profile*.
1. Click on *Finish* to create the Cluster Profile.


# Cluster

For the quick-start guide, we’ll provision a new cluster consisting of a single master and a single worker node:

**Steps:**

1. Navigate to the Default Project (select back to Default project if you’re in the Admin view).
1. Navigate to the *Clusters* page from the left-hand menu.
1. Click on *Create cluster* (and follow the wizard):
    * Name: cluster-vmware-1
    * Select VMware from the top environment selection bar. 
    * Select the cluster profile: ExperimentalVMware, click *Next*.
    * Leave the pack parameter overrides as-is, click *Next*.
    * Cloud Properties:
        * Cloud Account: spectro-cloud-gateway
        * Choose the desired setting for Datacenter, Compute Cluster, Network and Resource Pool. 
	* Folder: Spectro
        * SSH Keys - Create a new ssh key pair (or pick one your existing ones).  Enter the public key in this field. The public will be installed in the cluster VM nodes to provide ssh access as the user 'spectro'. This is useful for troubleshooting purposes.
        * Leave the NTP Server field blank
        * Click on *Next*.
    * In the node pool configuration:
        * For the *Master* node pool, keep the default options
        * For the *Worker* node pool, change the number of nodes in the pool to 2. Keep the default for ret of the fields
        * Click on *Next*.
    * In the final Review step, click on *Deploy*.
1. Wait for the cluster to transition to  Running state(check the *Overview* tab). Feel free to click on the Events tab to see the orchestration steps.

Once the cluster is provisioned - feel free to try the following:

* View deployed applications [as described here](/clusters).
* Scale up-down worker nodes [as described here](/clusters/vmware-clusters#clusterscaling).
* Upgrade Kubernetes to a new version [as described here](/cluster-profiles/task-update-profile).
