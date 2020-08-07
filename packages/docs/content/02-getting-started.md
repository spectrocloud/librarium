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

<Tabs>

<Tabs.TabPane tab="AWS" key="aws">

# Your First AWS Cluster

<InfoBox>
The guided documentation guide below is prescriptive with the names and selections. We highly recommend you follow the guide verbatim for your first AWS cluster.
</InfoBox>

<p>The following steps will be taken to provision your first AWS cluster:</p>
<ul>
<li>Create Cluster Profile.</li>
<li>Add AWS Cloud Account.</li>
<li>Provision Cluster.</li>
</ul>

<h2 id="cluster-profile">Cluster Profile</h2>

<ol>

<li>Navigate to the Default Project (select back to the Default project if you’re in the Admin view).</li>
<li>Switch to the <em>Cluster Profiles</em> page from the left navigation bar.</li>
<li>Click on the <em>Add Cluster Profile</em> button.</li>
<li>Specify the name <strong>ExperimentalAWS</strong> and click <em>Next</em>.</li>
<li>Select <strong>Amazon (AWS)</strong> for the cloud selection.</li>
<li>Click on Edit Layers.</li>
<li>Please designate the following selections for each layer, leaving the default configuration:

<ul>
<li>OS: Ubuntu, 18.04.X (LTS)</li>
<li>Kubernetes: select version 1.17.X</li>
<li>Network: Calico 3.10.X</li>
<li>Storage: Amazon EBS 1.0.X</li>
<li>Additional layers:<ul>
<li>Monitoring: Prometheus - Grafana 9.7.X</li>
<li>Monitoring: Kubernetes Dashboard 2.0.X</li>
<li>Logging: Elastic-Fluentd-Kibana (EFK) 6.7.X</li>
</ul></li>
<li>Click on <em>Finish</em> to close the Layer dialogue.</li>
</ul></li>

<li>Click on <em>Next</em> and review the <em>Cluster Profile</em>.</li>
<li>Click on <em>Finish</em> to create the Cluster Profile.</li>
</ol>

<h2 id="cloud-account">Cloud Account</h2>
<p><em>Cloud Accounts</em> are where access credentials are stored for public and private clouds. It is used by the system to provide new cluster infrastructure and cluster resources.</p>
<WarningBox>
<strong>Prerequisites:</strong><p></p>
<p>You need your own cloud account with appropriate permissions to create EC2 VMs and AMIs. Please ensure that your cloud account has at least the following configurations: <a href="/clusters/aws-clusters#prerequisites">Cloud Account Permissions</a>. Please import an SSH keypair into your account in the region <strong>us-east-1</strong>.</p>
<p></p>
<p>Also, this exercise creates a new VPC/Nat gateway/Elastic IP, so please confirm that your account has sufficient quota for the creation.</p>
</WarningBox>

<p><strong>Steps:</strong></p>
<ol>
<li>Navigate to the Default Project (select back to the Default project if you’re in the Admin view).</li>
<li>From the left-hand main menu, select Settings.</li>
<li>Click on <em>Add AWS Cloud Account</em>.<ul>
<li>name: ca-aws-1</li>
<li>Access Key: your &lt;AWS access key&gt;</li>
<li>Secret Key: your &lt;AWS secret key&gt;</li>
</ul>
</li>
<li>Click on <em>Validate</em>.</li>
<li>Click on <em>Confirm</em> to finish creating your cloud account.</li>
</ol>
<h2 id="cluster">Cluster</h2>
<p>For the quick-start guide, we’ll provision a new cluster consisting of a single master and a single worker node:</p>
<p><strong>Steps:</strong></p>
<ol>
<li>Navigate to the Default Project (select back to Default p.roject if you’re in the Admin view)</li>
<li>Navigate to the <em>Clusters</em> page from the left-hand menu.</li>
<li>Click on <em>Create cluster</em> (and follow the wizard):<ul>
<li>Name: cluster-aws-1</li>
<li>Select the cluster profile: ProductionAWS, click <em>Next</em>.</li>
<li>Leave the pack parameter overrides as-is, click <em>Next</em>.</li>
<li>Cloud Properties:<ul>
<li>Cloud Account: ca-aws-1</li>
<li>Region: us-east-1</li>
<li>SSH keyname: &lt;select imported key&gt;</li>
<li>Do not select (deselect): Static Placement</li>
<li>Click on <em>Next</em>.</li>
</ul>
</li>
<li>In the node pool configuration:<ul>
<li>For the <em>Master</em> node pool, pick the following properties:<ul>
<li>Instance type: t3.large (General Compute)</li>
<li>Availability Zone: us-east-1a</li>
</ul>
</li>
<li>For the <em>Worker</em> node pool, pick the following properties:<ul>
<li>Instance type: t3.large (General Compute)</li>
<li>Availability Zone: us-east-1a</li>
</ul>
</li>
</ul>
</li>
<li>In the final Review step, click on <em>Deploy</em>.</li>
</ul>
</li>
<li>Wait for the cluster to become Active (check the <em>Overview</em> tab). Feel free to click on the Events tab to see the orchestration steps.</li>
</ol>
<p>Once the cluster is provisioned - feel free to try the following:</p>
<ul>
<li>View deployed applications <a href="/clusters">as described here</a>.</li>
<li>Scale up-down worker nodes <a href="/clusters/aws-clusters#clusterscaling">as described here</a>.</li>
<li>Upgrade Kubernetes to a new version <a href="/cluster-profiles/task-update-profile">as described here</a>.</li>
</ul>

</Tabs.TabPane>

<Tabs.TabPane tab="Azure" key="azure">

# Your First Azure Cluster

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
    <p><strong>Prerequisites:</strong></p>
    <p>You need your own cloud account with appropriate permissions to create resources like virtual machines, vmnet, subnet, network security groups, route tables, etc. Please ensure that your cloud account has at least the following configurations: <a href="/clusters/azure-clusters#prerequisites">Cloud Account Permissions</a>.</p>
    <p>Also, this exercise creates various resources for the cluster infrastructure, so please confirm that your account has sufficient quota for the creation.</p>
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
* Scale up-down worker nodes [as described here](/clusters/azure-clusters#reconfiguringazurenodes).
* Upgrade Kubernetes to a new version [as described here](/cluster-profiles/task-update-profile).

</Tabs.TabPane>

<Tabs.TabPane tab="VMware" key="vmware">

# Your First VMWare Cluster

<InfoBox>
The guided documentation guide below is prescriptive with the names and selections. We highly recommend you follow the guide verbatim for your first cluster.
</InfoBox>

The following steps will be taken to provision your first VMware cluster:

* Create a Private Cloud Gateway.
* Create Cluster Profile.
* Provision Cluster.

## Private Cloud Gateway

1. Switch to the Admin view if you are in a project view by selecting Admin from the left navigation bar.
2. Navigate to settings in the admin view from the left navigation bar and select Private Cloud Gateways.
3. Click on Create Private Cloud Gateway.
4. Copy the location of the gateway installer OVF template. Also, note down the 4 digit pairing code displayed on the UI.
5. Login to vSphere console and navigate to VMs and Templates.
6. Pick a Datacenter you would like to use and under that, create a folder called 'Spectro'.
7. Right-click on the folder and invoke the VM creation wizard by selecting the option to Deploy OVF Template.
8. Complete all the steps of the OVF deployment wizard. Provide values for various fields as follows:
    * URL: <Location of the gateway installer from step #2>
    * Virtual Machine Name: spectro-cloud-gateway
    * Folder: Spectro
    * Select the desired Datacenter, Storage, and Network for the gateway installer VM as you proceed through the next few steps. Private Cloud Gateway VMs require an outgoing internet connection. Select a network that provides this access directly, or via a proxy.
    * Customize the template as follows:
        * Installer Name: spectro-cloud-gateway. This is the name that will be used by the gateway to register itself on the management console.
        * Console  Endpoint: https://console.spectrocloud.com
        * Pairing Code: <4 digit pairing code from step#2>
        * ssh public keys: Create a new ssh key pair (or pick one of your existing ones). Enter the public key in this field. The public key will be installed in the installer VM to provide ssh access, as the user 'ubuntu'. This is useful for troubleshooting purposes.
        * HTTP Proxy: &lt;endpoint for the http proxy server&gt;, e.g: _http://USERNAME:PASSWORD@PROXYIP:PROXYPORT_.  An optional setting, required only if a proxy is used for outbound connections
        * HTTPS Proxy: &lt;endpoint for the https proxy server&gt;, e.g: _http://USERNAME:PASSWORD@PROXYIP:PROXYPORT_.   An optional setting, required only if a proxy is used for outbound connections
        * SOCKS Proxy: &lt;endpoint for the SOCKS proxy server&gt;, e.g: _PROXYIP:PROXYPORT_.  An optional setting, required only if a proxy is used for outbound connections.
    * Finish the OVF deployment wizard and wait for the template to be created. This may take a few minutes as the template is initially downloaded.
9. Power on the spectro-cloud-gateway VM.
10. Switch back to the Spectro Cloud management console's admin view. Close the Cloud Gateway Installation Instructions dialog, if you still have it open. If you have been logged out or navigated away, you can access the page by clicking on Settings > Private Cloud Gateways in the left navigation bar.
11. Within a few minutes of having powered on the VM on the vSphere console, it should register back as a Private Cloud Gateway on this page with the name spectro-cloud-gateway.
12. From the actions menu for the gateway, click on Configure. It may take an additional minute or two for the configure action to be available as the gateway goes through a configuration process after initially registering with the console.
13. Enter server address, username, and password for your vCenter. Leave the 'Use self-signed certificate' option selected, if  vSphere is configured with a self-signed certificate.
14. Leave the 'Share the account with projects' option selected.
15. Click on 'Validate' to validate Credentials.
16. Click on 'Proceed to Configure'
17. Enter the desired settings for Datacenter, Compute Cluster, Network, and Resource Pool. Select 'Spectro' as the folder.
18. Select '1' for the Number of Nodes.
19. SSH Keys - Create a new ssh key pair (or pick one of your existing ones). Enter the public key in this field. The public key will be installed in the gateway VM nodes to provide ssh access as the user 'spectro'. This is useful for troubleshooting purposes.
20. Leave the NTP servers option blank, only if NTP is already configured on each of the ESXi hosts.
21. Click 'Confirm'. Private Cloud Gateway would transition to 'Provisioning' state. It takes around 10 to 15 minutes for the gateway to be installed. Two new VMs are created as part of gateway provisioning.
22. Proceed to creation of cluster profile once the gateway transitions to 'Running' state.

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
        * Choose the desired setting for Datacenter, Compute Cluster, Network, and Resource Pool.
        * Folder: Spectro
        * SSH Keys - Create a new ssh key pair (or pick one of your existing ones).  Enter the public key in this field. The public key will be installed in the cluster VM nodes to provide ssh access as the user 'spectro'. This is useful for troubleshooting purposes.
        * Leave the NTP Server field blank, only if NTP is already configured on each of the ESXi hosts.
        * Click on *Next*.
    * In the node pool configuration:
        * For the *Master* node pool, keep the default options
        * For the *Worker* node pool, change the number of nodes in the pool to 2. Keep the default selection for rest of the fields
        * Click on *Next*.
    * In the final Review step, click on *Deploy*.
1. Wait for the cluster to transition to  Running state(check the *Overview* tab). Feel free to click on the Events tab to see the orchestration steps.

Once the cluster is provisioned - feel free to try the following:

* View deployed applications [as described here](/clusters).
* Scale up-down worker nodes [as described here](/clusters/vmware-clusters#clusterscaling).
* Upgrade Kubernetes to a new version [as described here](/cluster-profiles/task-update-profile).

</Tabs.TabPane>

</Tabs>
