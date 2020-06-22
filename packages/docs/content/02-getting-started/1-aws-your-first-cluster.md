---
title: "AWS: Your First Cluster"
metaTitle: "AWS: Your First Cluster"
metaDescription: "Spectro Cloud page listing the steps for deploying AWS clusters"
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';

# AWS:Your First Cluster

<WarningBox>
The guided documentation guide below is prescriptive with the names and selections. We highly recommend you follow the guide verbatim for your first cluster.
</WarningBox>

The following steps will be taken to provision your first AWS cluster:

* Create Cluster Profile.
* Add AWS Cloud Account.
* Provision Cluster.

# Cluster Profile

1. Navigate to the Default Project (select back to Default project if you’re in the Admin view).
1. Switch to the *Cluster Profiles* page from the left navigation bar.
1. Click on the *Create Cluster Profile* button.
1. Specify the name **ExperimentalAWS** and click *Next*.
1. Select **Amazon (AWS)** for the cloud selection.
1. Click on Edit Layers.
1. Please designate the following selections for each layer, leaving the default configuration:
    * OS: Ubuntu, 18.4.X (LTS)
    * Kubernetes: select version 1.18.X
    * Network: Calico 3.10.X
    * Storage: Amazon EBS 1.0.X
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
Prerequisites: You need your own cloud account with appropriate permissions to create EC2 VMs and AMIs. Please ensure that your cloud account has at least the following configurations: [Cloud Account Permissions](/clusters/aws-clusters#prerequisites). Please import an SSH keypair into your account in the region `us-east-1`.
</WarningBox>

<WarningBox>
Also, this exercise creates a new VPC/Nat gateway/Elastic IP, so please confirm that your account has sufficient quota for the creation.
</WarningBox>

**Steps:**

1. Navigate to the Default Project (select back to Default project if you’re in the Admin view).
1. From the left-hand main-menu, select Settings.
1. Click on *Add AWS Cloud Account*.
    * name: ca1
    * Access Key: your &lt;AWS access key&gt;
    * Secret Key: your &lt;AWS secret key&gt;
1. Click on *Validate*.
1. Click on *Confirm* to finish creating your cloud account.

# Cluster

For the quick-start guide, we’ll provision a new cluster consisting of a single master and a single worker node:

**Steps:**

1. Navigate to the Default Project (select back to Default p.roject if you’re in the Admin view)
1. Navigate to the *Clusters* page from the left-hand menu.
1. Click on *Create cluster* (and follow the wizard):
    * Name: c1
    * Select the cluster profile: ProductionAWS, click *Next*.
    * Leave the pack parameter overrides as-is, click *Next*.
    * Cloud Properties:
        * Cloud Account: ca1
        * Region: us-east-1
        * SSH keyname: &lt;select imported key&gt;
        * Do not select (deselect): Static Placement
        * Click on *Next*.
    * In the node pool configuration:
        * For the *Master* node pool, pick the following properties:
            * Instance type: t3.large (General Compute)
            * Availability Zone: us-east-1a
        * For the *Worker* node pool, pick the following properties:
            * nstance type: t3.large (General Compute)
            * Availability Zone: us-east-1a
    * In the final Review step, click on *Deploy*.
1. Wait for the cluster to become Active (check the *Overview* tab). Feel free to click on the Events tab to see the orchestration steps.

Once the cluster is provisioned - feel free to try the following:

* View deployed applications [as described here](/clusters).
* Scale up-down worker nodes [as described here](/clusters/aws-clusters#clusterscaling).
* Upgrade Kubernetes to a new version [as described here](/cluster-profiles/task-update-profile).
