---
title: "Getting Started"
metaTitle: "Getting Started"
metaDescription: "Spectro Cloud Getting Started"
icon: "overview"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';

# Getting Started

This section is a tour of the two main dashboards of the tenant console. It also helps with the creation of cluster profiles and clusters to enable users to get going. More details on creating clusters is available in the dedicated [clusters](/clusters) page.

# Understanding the tenant console

The Spectro Cloud tenant console contains two main dashboards. The first one is mainly for the Kubernetes-related options while the other is for the settings related to operations.

# Default Dashboard

Upon login, the dashboard shows the [cluster profiles](/cluster-profiles) (marked as 1) of the default project. [Projects](/projects) (2) help to organize the cluster resources in a logical grouping. The left pane in this dashboard contains further options for [Clusters](/clusters) (3) and [audit logs](/audit-logs) (4). The bottom left contains buttons for the user's profile (5) and the Admin dashboard (6).

The "Settings" section (7) of the default dashboard relates to the cloud account settings. This is an important distinction from the settings under the Admin dashboard.

![default_dashboard](default_dashboard.png)

# Admin Dashboard

The menu within the Admin dashboard also contains the Projects button. This is different from the Projects menu in the default dashboard. Within the Admin dashboard, the Projects button provides access to modifying a project itself (edit/configure/delete and the overall status), whereas the button in the default dashboard provides access to the cluster profiles inside of the project.

The Cluster Profiles button in the Admin dashboard provides access to all the cluster profiles. These cluster profiles can be used in one or more projects; or they can left unused.

[Roles](/user-management/rbac#roles) and [Permissions](/introduction/concept-overviews#permission); as well as [Users](/introduction/concept-overviews#users) and [Teams](/introduction/concept-overviews#team) allow the admin to set or restrict these attributes for one or more team members.

Settings under the Admin dashboard provide access to the [pack registries](/registries-and-packs); [private cloud gateways](/introduction/concept-overviews#privatecloudgateway) and [SAML SSO](/user-management/saml-sso) configurations.

Finally, [audit logs](/audit-logs) allows the admin to track the user interaction with the application resources along with the timeline.

![admin_dashboard](admin_dashboard.png)

# Deploying your first cluster

Deploying your first [cluster](https://kubernetes.io/docs/setup/best-practices/cluster-large/#setup) should be a walk in the park. As an overview, Spectro Cloud mandates the creation of a cluster profile before a cluster can be created. This is because the [Cluster Profile](/cluster-profiles/task-define-profile) contains the configurations needed for your cluster. The cluster profile helps you prepare a readymade configuration of - at a minimum - the OS, the Kubernetes layer, the network layer, and the storage layers. These four are the mandatory layers without which a cluster profile cannot be created. There are a host of other layers and components available to add in the cluster profile (load balancers, authentication, monitoring, and logging, etc.) which will be detailed in the cluster profile section.

<Tabs identifier="getting_started">

<Tabs.TabPane tab="AWS" key="aws">

## Your First AWS Cluster

<InfoBox>
The guided documentation guide below is prescriptive with the names and selections. We highly recommend you follow the guide verbatim for your first AWS cluster.
</InfoBox>

The following steps will be taken to provision your first AWS cluster:

* Create Cluster Profile.
* Add AWS Cloud Account.
* Provision Cluster.

## Cluster Profile

* Navigate to the Default Project (select back to the Default project if you’re in the Admin view).
* Switch to the *Cluster Profiles* page from the left navigation bar.
* Click on the *Add Cluster Profile* button.
* Specify the name **ExperimentalAWS** and click *Next*.
* Select **Amazon (AWS)**for the cloud selection.
* Click on Edit Layers.
* Please designate the following selections for each layer, leaving the default configuration:

    * OS: Ubuntu, 18.04.X (LTS)
    * Kubernetes: select version 1.17.X
    * Network: Calico 3.10.X
    * Storage: Amazon EBS 1.0.X
    * Additional layers:
        * Monitoring: Prometheus - Grafana 9.7.X
        * Monitoring: Kubernetes Dashboard 2.0.X
        * Logging: Elastic-Fluentd-Kibana (EFK) 6.7.X

* Click on *Finish* to close the Layer dialogue.

* Click on *Next* and review the Cluster Profile.
* Click on *Finish* to create the Cluster Profile.

## Cloud Account

*Cloud Accounts* are where access credentials are stored for public and private clouds. It is used by the system to provide new cluster infrastructure and cluster resources.

<WarningBox>

**Prerequisites:**
You need your own cloud account with appropriate permissions to create EC2 VMs and AMIs. Please ensure that your cloud account has at least the following configurations: [Cloud Account Permissions](/clusters?clusterType=aws_cluster#prerequisites). Please import an SSH keypair into your account in the region **us-east-1**.

Also, this exercise creates a new VPC/Nat gateway/Elastic IP, so please confirm that your account has sufficient quota for the creation.

</WarningBox>

**Steps:**

* Navigate to the Default Project (select back to the Default project if you’re in the Admin view).
* From the left-hand main menu, select Settings.
* Click on *Add AWS Cloud Account*.
    * name: ca-aws-1
    * Access Key: your &lt;AWS access key&gt;
    * Secret Key: your &lt;AWS secret key&gt;

* Click on *Validate*.
* Click on *Confirm* to finish creating your cloud account.

## Cluster

For the quick-start guide, we’ll provision a new cluster consisting of a single master and a single worker node:

**Steps:**

* Navigate to the Default Project (select back to Default p.roject if you’re in the Admin view)
* Navigate to the *Clusters* page from the left-hand menu.
* Click on *Create cluster* (and follow the wizard):
    * Name: cluster-aws-1
    * Select the cluster profile: ProductionAWS, click *Next*.
    * Leave the pack parameter overrides as-is, click *Next*.
    * Cloud Properties:
* Cloud Account: ca-aws-1
* Region: us-east-1
* SSH keyname: &lt;select imported key&gt;
* Do not select (deselect): Static Placement
* Click on *Next*.

* In the node pool configuration:
    * For the *Master* node pool, pick the following properties:
* Instance type: t3.large (General Compute)
* Availability Zone: us-east-1a

* For the *Worker* node pool, pick the following properties:
    * Instance type: t3.large (General Compute)
* Availability Zone: us-east-1a

* In the final Review step, click on *Deploy*.

* Wait for the cluster to become Active (check the *Overview* tab). Feel free to click on the Events tab to see the orchestration steps.

Once the cluster is provisioned - feel free to try the following:

* View deployed applications [as described here](/clusters).
* Scale up-down worker nodes [as described here](/clusters?clusterType=aws_cluster#scalinganawscluster).
* Upgrade Kubernetes to a new version [as described here](/cluster-profiles/task-update-profile).

</Tabs.TabPane>

<Tabs.TabPane tab="Azure" key="azure">

## Your First Azure Cluster

<InfoBox>
The guided documentation guide below is prescriptive with the names and selections. We highly recommend you follow the guide verbatim for your first cluster.
</InfoBox>

The following steps will be taken to provision your first Azure cluster:

* Create Cluster Profile.
* Add Azure Cloud Account.
* Provision Cluster.

## Cluster Profile

1. Navigate to the Default Project (select back to the Default project if you’re in the Admin view).
1. Switch to the *Cluster Profiles* page from the left navigation bar.
1. Click on the *Create Cluster Profile* button.
1. Specify the name **ExperimentalAzure** and click *Next*.
1. Select **Azure (Azure)** for the cloud selection.
1. Click on Edit Layers.
1. Please designate the following selections for each layer, leaving the default configuration:
    * OS: Ubuntu, 18.4.X (LTS)
    * Kubernetes: select version 1.17.X
    * Network: Calico 3.10.X
    * Storage: Azure EBS 1.0.X
    * Additional layers:
        * Monitoring: Prometheus - Grafana 9.7.X
        * Monitoring: Kubernetes Dashboard 2.0.X
        * Logging: Elastic-Fluentd-Kibana (EFK) 6.7.0
    * Click on *Finish* to close the Layer dialogue.
1. Click on *Next* and review the *Cluster Profile*.
1. Click on *Finish* to create the Cluster Profile.

## Cloud Account

*Cloud Accounts* are where access credentials are stored for public and private clouds. It is used by the system to provide new cluster infrastructure and cluster resources.

<WarningBox>

**Prerequisites:**
You need your own cloud account with appropriate permissions to create resources like virtual machines, vmnet, subnet, network security groups, route tables, etc. Please ensure that your cloud account has at least the following configurations: [Cloud Account Permissions](/clusters?clusterType=azure_cluster#creatinganazurecloudaccount).
Also, this exercise creates various resources for the cluster infrastructure, so please confirm that your account has sufficient quota for the creation.

</WarningBox>

**Steps:**

1. Navigate to the Default Project (select back to the Default project if you’re in the Admin view).
1. From the left-hand main menu, select Settings.
1. Click on *Add Azure Cloud Account*.
    * name: ca-azure-1
    * Tenant Id: your &lt;Azure Tenant Id&gt;
    * Client Id: your &lt;Azure Client Id&gt;
    * Client Secret: your &lt;Azure Client Secret&gt;
1. Click on *Validate*.
1. Click on *Confirm* to finish creating your cloud account.

## Cluster

For the quick-start guide, we’ll provision a new cluster consisting of a single master and a single worker node:

**Steps:**

1. Navigate to the Default Project (select back to the Default project if you’re in the Admin view).
1. Navigate to the *Clusters* page from the left-hand menu.
1. Click on *Create cluster* (and follow the wizard):
    * Name: cluster-azure-1
    * Select Azure cloud from the top environment selection bar.
    * Select the cluster profile: ExperimentalAzure, click *Next*.
    * Leave the pack parameter overrides as-is, click *Next*.
    * Cloud Properties:
        * Cloud Account: ca-azure-1
        * Subscription: your &lt;Azure Subscription&gt;
        * Region: East US
        * Resource Group: an &lt;Azure Resource available in East US&gt;
        * SSH keys: Create a new ssh key pair (or pick one of your existing ones). Enter the public key in this field.
        * Do not select (deselect): Static Placement
        * Click on *Next*.
    * In the node pool configuration:
        * For the *Master* node pool, pick the following properties:
            * Instance type: Standard_D2s_v3, (General Purpose)
            * Managed Disk: Premium LRS
            * Managed Disk: 60
        * For the *Worker* node pool, pick the following properties:
            * Instance type: Standard_D2s_v3, (General Purpose)
            * Managed Disk: Premium LRS
            * Managed Disk: 60
            * Availability Zones: select  *1*
    * In the final Review step, click on *Deploy*.
1. Wait for the cluster to become Active (check the *Overview* tab). Feel free to click on the Events tab to see the orchestration steps.

Once the cluster is provisioned - feel free to try the following:

* View deployed applications [as described here](/clusters).
* Scale up-down worker nodes [as described here](/clusters?clusterType=azure_cluster#scalinganazurecluster).
* Upgrade Kubernetes to a new version [as described here](/cluster-profiles/task-update-profile).

</Tabs.TabPane>

<Tabs.TabPane tab="VMware" key="vmware">

## Your First VMWare Cluster

<InfoBox>
The guided documentation guide below is prescriptive with the names and selections. We highly recommend you follow the guide verbatim for your first cluster.
</InfoBox>

The following steps will be taken to provision your first VMware cluster:

* Create Private Cloud Gateway.
* Deploy Private Cloud Gateway Installer VM.
* Configure Private Cloud Gateway.
* Create Cluster Profile.
* Provision Cluster.

## Create Private Cloud Gateway

1. Switch to the Admin view if you are in a project view by selecting Admin from the left navigation bar.
2. Navigate to settings in the admin view from the left navigation bar and select Private Cloud Gateways.
3. Click on Create Private Cloud Gateway.
4. Copy the location of the gateway installer OVF template. Also, note down the 5 digit pairing code displayed on the UI.

## Deploy Private Cloud Gateway Installer VM

1. Login to vSphere console and navigate to VMs and Templates.
2. Pick a Datacenter you would like to use and under that, create a folder called 'Spectro'.
3. Right-click on the folder and invoke the VM creation wizard by selecting the option to Deploy OVF Template.
4. Complete all the steps of the OVF deployment wizard. Provide values for various fields as follows:
    * URL: <Location of the gateway installer from step #2>
    * Virtual Machine Name: spectro-cloud-gateway
    * Folder: Spectro
    * Select the desired Datacenter, Storage, and Network for the gateway installer VM as you proceed through the next few steps. Private Cloud Gateway VMs require an outgoing internet connection. Select a network that provides this access directly, or via a proxy.
    * Customize the template as follows:
    * Gateway Name: spectro-cloud-gateway. This is the name that will be used by the gateway to register itself on the management console.
        * Console Endpoint: https://console.spectrocloud.com
        * Pairing Code: <5 digit pairing code from step #2>
        * ssh public keys: Create a new ssh key pair (or pick one of your existing ones). Enter the public key in this field. The public key will be installed in the installer VM to provide ssh access, as the user 'ubuntu'. This is useful for troubleshooting purposes.
        * Static IP Address: &lt;VM IP Address&gt; Optional IP address(e.g: 192.168.10.15) to be specified only if static IP allocation is desired. DHCP is used by default.
        * Static IP subnet prefix: &lt;Network Prefix&gt; Network gateway IP (e.g: 192.168.0.1), required only for static IP allocation
        * Static IP gateway: &lt;Gateway IP Address&gt; Static IP subnet prefix (e.g: 18), required only for static IP allocation
        * Static IP DNS: &lt;Name servers&gt; Comma separated DNS addresses (e.g: 8.8.8.8, 192.168.0.8), required only for static IP allocation
        * HTTP Proxy: &lt;endpoint for the http proxy server&gt;, e.g: _http://USERNAME:PASSWORD@PROXYIP:PROXYPORT_.  An optional setting, required only if a proxy is used for outbound connections
        * HTTPS Proxy: &lt;endpoint for the https proxy server&gt;, e.g: _http://USERNAME:PASSWORD@PROXYIP:PROXYPORT_.   An optional setting, required only if a proxy is used for outbound connections
        * SOCKS Proxy: &lt;endpoint for the SOCKS proxy server&gt;, e.g: _PROXYIP:PROXYPORT_.  An optional setting, required only if a proxy is used for outbound connections.
    * Finish the OVF deployment wizard and wait for the template to be created. This may take a few minutes as the template is initially downloaded.
5. Power on the spectro-cloud-gateway VM.

## Configure Private Cloud Gateway

1. Switch back to the Spectro Cloud management console's admin view. Close the Cloud Gateway Installation Instructions dialog, if you still have it open. If you have been logged out or navigated away, you can access the page by clicking on Settings > Private Cloud Gateways in the left navigation bar.
2. Within a few minutes of having powered on the VM on the vSphere console, it should register back as a Private Cloud Gateway on this page with the name spectro-cloud-gateway.
3. From the actions menu for the gateway, click on Configure. It may take an additional minute or two for the configure action to be available as the gateway goes through a configuration process after initially registering with the console.
4. Enter server address, username, and password for your vCenter. Leave the 'Use self-signed certificate' option selected, if  vSphere is configured with a self-signed certificate.
5. Leave the 'Share the account with projects' option selected.
6. Click on 'Validate' to validate Credentials.
7. Click on 'Proceed to Configure'
8. Enter the desired settings for Datacenter, Compute Cluster, Network, and Resource Pool. Select 'Spectro' as the folder.
9. Select '1' for the Number of Nodes.
10. SSH Keys - Create a new ssh key pair (or pick one of your existing ones). Enter the public key in this field. The public key will be installed in the gateway VM nodes to provide ssh access as the user 'spectro'. This is useful for troubleshooting purposes.
10. Leave the NTP servers option blank, only if NTP is already configured on each of the ESXi hosts.
11. Select DHCP as IP allocation strategy. 
12. Click 'Confirm'. Private Cloud Gateway would transition to 'Provisioning' state. It takes around 10 to 15 minutes for the gateway to be installed. Two new VMs are created as part of gateway provisioning.
13. Proceed to creation of cluster profile once the gateway transitions to 'Running' state.

## Cluster Profile

1. Navigate to the Default project (select back to the Default project if you’re in the Admin view).
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

## Cluster

For the quick-start guide, we’ll provision a new cluster consisting of a single master and a single worker node:

**Steps:**

1. Navigate to the Default Project (select back to the Default project if you’re in the Admin view).
1. Navigate to the *Clusters* page from the left-hand menu.
1. Click on *Create cluster* (and follow the wizard):
    * Name: cluster-vmware-1
    * Select VMware from the top environment selection bar.
    * Select the cluster profile: ExperimentalVMware, click *Next*.
    * Leave the pack parameter overrides as-is, click *Next*.
    * Cloud Properties:
        * Cloud Account: spectro-cloud-gateway
        * Choose the Datacenter in which the 'Spectro' folder was created while creating the [Private Cloud Gateway](/getting-started?clusterType=vmware_cluster#privatecloudgateway).
        * Folder: Spectro
        * Select DHCP as the IP management protocol. (Details of the static IP settings are available in the [VMware Clusters](/clusters?clusterType=vmware_cluster#creatingavmwarecluster) section.)
        * SSH Keys - Create a new ssh key pair (or pick one of your existing ones).  Enter the public key in this field. The public key will be installed in the cluster VM nodes to provide ssh access as the user 'spectro'. This is useful for troubleshooting purposes.
        * Leave the NTP Server field blank, only if NTP is already configured on each of the ESXi hosts.
        * Click on *Next*.
    * In the node pool configuration:
        * For the *Master* node pool, keep the default options. For the Compute Cluster, Resource Pool, and Network values as used while creating the Private Cloud Gateway. Select a datastore as required.
        * For the *Worker* node pool, change the number of nodes in the pool to 2. Keep the default selection for the rest of the fields. Select 'Scale Out' under the rolling updates. Click the `Copy from Master Pool` button for the 'Cloud Configuration'.
        * Click on *Next*.
    * In the final Review step, click on *Deploy*.
1. Wait for the cluster to transition to  Running state(check the *Overview* tab). Feel free to click on the Events tab to see the orchestration steps.

Once the cluster is provisioned - feel free to try the following:

* View deployed applications [as described here](/clusters).
* Scale up-down worker nodes [as described here](/clusters?clusterType=vmware_cluster#scalingavmwarecluster).
* Upgrade Kubernetes to a new version [as described here](/cluster-profiles/task-update-profile).

</Tabs.TabPane>

</Tabs>
