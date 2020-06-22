---
title: "Azure: Your First Cluster"
metaTitle: "Azure: Your First Cluster"
metaDescription: "Spectro Cloud page listing the steps for deploying Azure clusters"
hideToC: false
fullWidth: false
---

import InfoBox from '@librarium/shared/src/components/InfoBox';

import WarningBox from '@librarium/shared/src/components/WarningBox';

# Your First Azure Cluster


<InfoBox>
The guided documentation guide below is prescriptive with the names and selections. We highly recommend you follow the guide verbatim for your first cluster.
</InfoBox>

The following steps will be taken to provision your first Azure cluster:

* Create Cluster Profile.
* Add Azure Cloud Account.
* Provision Cluster.

# Cluster Profile

1. Navigate to the Default Project (select back to Default project if you’re in the Admin view).
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

# Cloud Account

*Cloud Accounts* are where access credentials are stored for public and private clouds. It is used by the system to provide new cluster infrastructure and cluster resources.

<WarningBox>
<strong>Prerequisites:</strong><p></p>
<p>You need your own cloud account with appropriate permissions to create resources like virtual machines, vmnet, subnet, network security groups, route tables etc. Please ensure that your cloud account has at least the following configurations: <a href="/clusters/azure-clusters#prerequisites">Cloud Account Permissions</a>. 
<p></p>
<p>Also, this exercise creates various resources for the cluster infrastructure, so please confirm that your account has sufficient quota for the creation.</p>
</WarningBox>

**Steps:**

1. Navigate to the Default Project (select back to Default project if you’re in the Admin view).
1. From the left-hand main-menu, select Settings.
1. Click on *Add Azure Cloud Account*.
    * name: ca-azure-1
    * Tenant Id: your &lt;Azure Tenant Id&gt;
    * Cient Id: your &lt;Azure Client Id&gt;
    * Cient Secret: your &lt;Azure Client Secret&gt;    
1. Click on *Validate*.
1. Click on *Confirm* to finish creating your cloud account.

# Cluster

For the quick-start guide, we’ll provision a new cluster consisting of a single master and a single worker node:

**Steps:**

1. Navigate to the Default Project (select back to Default project if you’re in the Admin view).
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
        * Resource Group: an &lt;Azure Resource availble in Ease US&gt;
        * SSH keys: Create a new ssh key pair (or pick one your existing ones). Enter the public key in this field.
        * Do not select (deselect): Static Placement
        * Click on *Next*.
    * In the node pool configuration:
        * For the *Master* node pool, pick the following properties:
            * Instance type: Standard_B2S (General Purpose)
            * Managed Disk: Standard LRS
            * Managed Disk: 60
        * For the *Worker* node pool, pick the following properties:
            * Instance type: Standard_B2S (General Purpose)
            * Managed Disk: Standard LRS
            * Managed Disk: 60
            * Availability Zones: select  *1*
    * In the final Review step, click on *Deploy*.
1. Wait for the cluster to become Active (check the *Overview* tab). Feel free to click on the Events tab to see the orchestration steps.

Once the cluster is provisioned - feel free to try the following:

* View deployed applications [as described here](/clusters).
* Scale up-down worker nodes [as described here](/clusters/azure-clusters#reconfiguringazurenodes).
* Upgrade Kubernetes to a new version [as described here](/cluster-profiles/task-update-profile).
