---
title: "Brownfield Clusters"
metaTitle: "Managing brownfield clusters on Palette"
metaDescription: "Importing and managing brownfield clusters provisioned on any CSP using other orchestration tools"
icon: "cloud-download-alt"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';


# Overview

Existing Kubernetes clusters that Palette has not deployed can be imported into the Palette platform for visibility, management, and additional capabilities such as application lifecycle management. Palette allows the import and management of Kubernetes clusters in various public, private, and bare-metal environments.

Palette also supports generic cluster imports, where the users import their existing clusters to Palette, regardless of the cloud service provider. For example, if Palette does not support the existing cluster's cloud type, those clusters could be imported as Generic clusters.

The name *generic* implies support will be extended to the generic operations on the cluster. The generic operations include scans, backups, etc., which are not specific to the cloud infrastructure. Therefore, for generic-imported clusters, the user will not be able to add cloud-specific, add-on profiles. Instead, they can add profiles of the cloud type, which is supported for all.

<br />

 * In addition to Palette Generic cluster import, we support public cloud-managed services such as:

   * Amazon

   * Azure

   * Google Cloud

   * VMware

   * OpenShift

   * EKS-Anywhere
<br />
 * Clusters provisioned through other management platforms (Rancher, CCP, etc.)


 * Clusters provisioned using orchestration tools (Kubeadm, kOps, etc.)

# Prerequisites

   - Kubernetes version >= 1.19.X


   - Egress internet access (e.g: api.spectrocloud.com)


   - DNS configured for public internet name resolution


   - Metrics server (highly recommended for full permissions mode import)

<WarningBox>

While importing EKS clusters, Palette encourages importing Standard clusters over [Autopilot Clusters](https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview).

</WarningBox>

# Importing a Brownfield Cluster



Run the following steps to import a brownfield cluster into the Palette platform:

<br />

1. Log in to the Palette Management Console as a **Project Administrator**.


2. Select **Clusters** from the slide menu.


3. Find and select the **+ Add New Cluster** button.


4. Click the **Import Cluster** button to bring in your own cluster into Palette.


5. Provide a **Cluster Name** for the cluster.


6. Choose from the **Cloud Type** list where the cluster is currently deployed.

   **Note**: If you are importing a Generic cluster, there is an option to provide the proxy/non-proxy information, if applicable.


7. Select **Import mode** by choosing the permissions level and clicking the **Create & Open Cluster Instance** button.


<InfoBox>
<b>Read-Only mode</b>: Starting with minimal permission allows health check monitoring, event logging, cost, and usage analysis. This state is optimal for those who want to restrict the minimal permissions allowed in the initial setup. When you are ready to raise the permissions levels, migrate to full permissions mode.

<br />
<br />

<b>Full Permission mode</b>: This mode unlocks day 2 operations.
</InfoBox>


## Install the Agent

<InfoBox>
   It is essential to follow through with the steps in the call-out box to complete the cluster import procedure. Otherwise, the instance will stay in pending mode, and the metrics server will not visualize the full capabilities.
</InfoBox>
<br />


<br />

### Install the Read-Only Agent


1. Follow the steps in the Cluster Import procedure (Read-Only) slide-out. This installs the Palette Cluster Management Agent to use with your imported brownfield cluster.


2. Copy and paste in a terminal window the following kubectl command to the cluster that you are importing:
<br />

   ```yml
   kubectl apply -n cluster-xxxxxxxxxx -f https://api.dev.spectrocloud.com/v1/spectroclusters/xxxxxxxxx/import/manifest`
   ```
   After this command is applied, the cluster will go to an *Importing* state and eventually show as *Running* in the console interface. At this point, metrics and installed services will be populated.


3. Install the metrics server.

   The Read-Only Agent relies on the metrics server to capture usage metrics in the cluster. If the metrics server is not installed already, execute the following command(s):
<br />

   ```yml
   helm repo add bitnami https://charts.bitnami.com/bitnami
   ```

   ```yml
   helm install my-release bitnami/metrics-server
   ```
<br />

4. Wait for the import process to complete. The cluster status will transition from *Pending* to *Running*, and the cluster health will transition to *Healthy*, signaling a successful import of the brownfield cluster.


## Migrate to Full Permissions Mode

When you are ready to expand the permissions or enable day 2 operations, migrate to Full Permissions mode.
<br />

1. To migrate to Full Permissions mode, go to the slide menu and select **Clusters**.


2. Pick the read-only cluster you wish to migrate and click the **Migrate To Full Permissions** button.


3. Click **OK** to confirm.


4. Proceed to install the agent.

<br />


### Install the Agent (Full Permissions Mode)

1. Copy and paste the command in a Terminal window to apply the following `kubectl` command to the cluster that you are migrating:
<br />

   ```yml
   kubectl apply -n cluster-xxxxx -f https://api.dev.spectrocloud.com/v1/spectroclusters/xxxxx/import/manifest
   ```
<br />

2. Wait for the import process to complete. The cluster status will transition from *Pending* to *Running*, and the cluster health will transition to *Healthy*, signaling a successful import of the brownfield cluster.

# Attach Add-on Profiles

Add-on cluster profiles can be attached to brownfield clusters, after an import, to install and manage various applications/integrations above the Core Infrastructure layers. The following steps need to be performed to attach Add-on profiles to existing clusters:

<br />

1. Choose the desired cluster from the **Clusters** list and navigate to the **Profile** tab.


2. Select the **Add add-on profile** dialog from the menu on the left-hand side and choose the desired cluster profile. Multiple add-on profiles can be attached to a cluster.


3. In addition of a new add-on profile, the default configuration for all the layers that are part of the add-on profile are displayed. You can customize or override the default parameters in any of the layers as needed.


4. Click **Save**. The cluster configuration and the new layers from the attached profiles will then be installed on the cluster.


# Deleting an Imported Cluster

<br />

The deletion of the imported cluster results in the removal of the workspace, cloud infrastructure, control plane nodes, and worker nodes created for the cluster.


The following tasks need to be performed to delete an imported cluster:

<br />

1. Go to the **Clusters** tab from the slide menu.


2. Select the cluster to be deleted from the **Cluster** **View** page and navigate to the **Cluster Overview** page.


3. Invoke a delete action available on the page: **Cluster** > **Settings** > **Cluster** **Settings** > **Delete Cluster**.


4. Type the name of the cluster you wish to delete.


5. Click **Confirm** and delete.


<InfoBox>
In Read-Only mode, if user want to delete/detach cluster then they need to run the following command manually on the cluster.

       kubectl delete -n cluster-xxxxxx

</InfoBox>

Cluster status is updated to *Deleting* while cluster resources are being deleted. In addition, the cluster status is updated with the ongoing progress of the delete operation. This deletion state can go up to 15 minutes.

Once all resources are successfully deleted, the cluster status changes to *Deleted* and is removed from the unfiltered list of clusters. Toggle the **Deleted only** checkbox to view the deleted clusters from the last 72 hours.


# Force Delete a Cluster

A cluster stuck in the **Deletion** state can be force deleted by the user through the user interface (UI). The user can go for a force deletion of the cluster, only if it is stuck in a deleting state for a minimum of **15 minutes**. Palette enables cluster force delete from the Tenant Admin and Project Admin scope.

## To force delete a cluster:

1. Log in to the Palette Management Console.


2. Navigate to the **Cluster Details** page of the cluster stuck in a deleting mode.

      - If the deleting mode is stuck for more than 15 minutes, click the **Force Delete Cluster** button from the **Settings** dropdown.

      - If the **Force Delete Cluster** button is not enabled, wait for 15 minutes. The **Settings** dropdown will give the estimated time for the auto-enabling of the force delete button.


<WarningBox>
If there are any cloud resources still on the cloud, the user should clean up those resources before going for the force deletion.
</WarningBox>



# Example Cluster Imports Illustration

## EKS Cluster Import to Palette Console
 ![eks cluster import](cluster-import/eks.mp4)


## Generic Cluster Import to Palette Console
 ![generic cluster import](cluster-import/generic.mp4)

