---
title: "Create Cluster Definition"
metaTitle: "Create Cluster Definition"
metaDescription: "Define your Edge cluster using the Edge hosts that are registered and available."
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';

# Overview

To complete the Edge Installation process, an Edge host must become a member of a host cluster. You can add an Edge host to an existing host cluster that is of the type Edge Native, or you can create a new host cluster for Edge hosts to become a member.



# Create an Edge Native Host Cluster

Use the following steps to create a new host cluster so that you can add Edge hosts to the node pools.

## Prerequisites

- A registered Edge host.

## Create Cluster

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Click on **Add New Cluster**.


4. Choose **Edge Native** for the cluster type and click on **Start Edge Native Configuration**.


5. Provide the cluster with a name, description and tags. Click on **Next**.


6. Select a cluster profile. If you don't have a cluster profile for Edge Native, refer to the [Create Edge Native Cluster Profile](/clusters/edge/site-deployment/model-profile#createedgenativeclusterprofile) guide. Click on **Next** after you have selected a cluster profile.


7. Review your cluster profile values and make any changes as needed. Proceed to the next step by selecting **Next**.


8.  Provide the host cluster with the Virtual IP address used by the physical site. You can also select any SSH keys in case you need to remote into the host cluster. And you can provide a list of Network Time Protocol (NTP) servers. Click on **Next**.


9. The node configuration page is where you can specify what Edge hosts make up the host cluster. Go ahead and assign Edge hosts to the **master-pool** and the **worker-pool**. Click on **Next** once you have completed configuring the node pools.


10. The settings page is where you can configure a patching schedule, security scans, backup settings, and set up role-based access control (RBAC). Review the settings and make changes if needed. Click on **Validate**.


11. Review the settings summary and click on **Finish Configuration** to deploy the cluster.


After you create the cluster, the Palette Edge Host agent will start the installation process. You can track the installation progress in Palette. The cluster overview page displays a summary of the progress. Use the *Events* tab to review detailed logs.

## Validation

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select the host cluster you created to view its details page.


4. Review the **Cluster Status**. Ensure the **Cluster Status** field displays **Running**.


You can also use the command `kubectl get nodes` to review the status of all nodes in the cluster. Check out the [Access Cluster with CLI](/clusters/cluster-management/palette-webctl#overview) to learn how to use `kubectl` with a host cluster.


# Add an Edge Host to a Host Cluster

You can add Edge hosts to an existing host cluster's node pools. Use the following steps to an Edge host to a host cluster's node pool.

## Prerequisites

- A registered Edge host.


- A host cluster that is of the type Edge Native. 

<WarningBox>

When adding a new Edge host to an existing cluster, ensure you are not creating a scenario where [etcd](https://etcd.io/) could fail in establishing a quorum. Quorum failures typically result when there is an even number of nodes.
Refer to the [Why an odd number of cluster members](https://etcd.io/docs/v3.3/faq/#why-an-odd-number-of-cluster-members) resource from the etcd documentation to learn more.

</WarningBox>

## Add Edge Host to Node Pool

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Use the **drop-down Menu Cloud Types** and select **Edge Native**. 


4. Select the host cluster you want to add the registered Edge host.


5. Click on the **Nodes** tab.


6. Select the node pool to which you wish to add the Edge host and click the **Edit** button.


7. Navigate to the **Edge Hosts drop-down** and select your Edge host.


8. Confirm your changes.

The Palette Edge Host agent will start the installation process. You can track the installation progress in Palette. The cluster overview page displays a summary of the progress. Use the *Events* tab to review detailed logs.

## Validation

1. Log in to [Palette](https://console.spectrocloud.com).


2. Navigate to the left **Main Menu** and select **Clusters**.


3. Select the host cluster you created to view its details page.


4. Review the **Cluster Status**. Ensure the **Cluster Status** field displays **Running**.

You can also use the command `kubectl get nodes` to review the status of all nodes in the cluster. Check out the [Access Cluster with CLI](/clusters/cluster-management/palette-webctl#overview) to learn how to use `kubectl` with a host cluster.