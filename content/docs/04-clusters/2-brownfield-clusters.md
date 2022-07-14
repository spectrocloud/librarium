---
title: "Brownfield Clusters"
metaTitle: "Managing brownfield clusters on Palette"
metaDescription: "Importing and managing brownfield clusters provisioned on any CSP using other orchestration tools "
icon: "cloud-download-alt"
hideToC: false
fullWidth: false
---

import Tabs from 'shared/components/ui/Tabs';
import WarningBox from 'shared/components/WarningBox';
import InfoBox from 'shared/components/InfoBox';
import PointsOfInterest from 'shared/components/common/PointOfInterest';


# Overview

Existing Kubernetes clusters that were not deployed by Palette can be imported into the Palette platform for visibility, management, and additional capabilities such as application lifecycle management. Palette allows import and management of Kubernetes clusters on various public, private, and bare-metal environments.

Palette also supports generic cluster imports, where the users import their existing clusters to Palette regardless of the cloud service provider. If the existing cluster's cloud type is not supported by Palette, then those clusters could be imported as Generic clusters.

The name generic implies our support will be extended to the generic operations on the cluster. The generic operations include scans, backups, etc. which are not specific to the cloud infrastructure. For generic-imported clusters, the user will not be able to add cloud-specific, add-on profiles. Rather, they can add profiles of the cloud type which is supported for all.

 * In addition to Palette Generic cluster import, we support public cloud managed services such as:
  
    * Amazon
    * Azure
    * Google Cloud
    * VMware
    * OpenShift
    * EKS-Anywhere

  
 * Clusters provisioned through other management platforms (Rancher, CCP, etc.)
 * Clusters provisioned using orchestration tools (Kubeadm, kops, etc.)

# Importing a Brownfield Cluster

The following steps need to be performed to import a brownfield cluster into the Palette platform:

1. Select **Clusters** from the slide menu.


2. Find and select the **+ Add New Cluster** button.


3. Click the **Import Cluster** button to bring in your own cluster into Palette.


4. Provide a **Cluster Name** for the cluster.


5. Choose from the list the **Cloud Type**, where the cluster is currently deployed.
   
   **Note**: If you are importing a Generic cluster, there is an option to provide the proxy/non-proxy information if applicable. This is optional.


6. Select **Import mode** and click the **Create & Open Cluster Instance** button. Follow the steps in the Cluster Import procedure (Read-Only) slide-out to install Palette's Cluster Management agent with your brownfield cluster using the `kubectl` command provided.
   
   <InfoBox>
   It is important to follow through with the `kubectl` commands to complete the cluster import procedure for both the (Read-Only) and (Full Permissions) mode. Otherwise, the instance will stay in pending mode, and the Metrics Server will not visualize the full capabilities, making it unusable until you run the procedure that is in the call out box.

   </InfoBox>

* **Read-Only mode** - Starting out with minimal permission, allows health check monitoring, event logging, cost, and usage analysis. This state is optimal for those who want to restrict the minimal permissions allowed in the initial set up. 

     **Note**: When you are ready to expand the permissions or enable day 2 operations, you can later migrate to Full Permissions mode.


* **Full Permissions mode** - This mode unlocks and supports full cluster management capabilities that will take you from day 0 to day 2 operations.


7. Wait for the import process to complete. The cluster status will transition from **Pending** to **Running** and the cluster health will transition to **Healthy**, signaling a successful import of the brownfield cluster.

# Attach Add-On Profiles

Add-on cluster profiles can be attached to brownfield clusters after import to install and manage various applications/integrations above the Core Infrastructure layers. The following steps need to be performed to attach Add-on profiles to existing clusters:


1. Choose the desired cluster from the **Clusters** list and navigate to the **Profile** tab.


2. Select the **Add add-on profile** dialog from the menu on the left-hand side and choose the desired cluster profile. Multiple add-on profiles can be attached to a cluster.


3. In addition of a new add-on profile, the default configuration for all the layers that are part of the add-on profile are displayed. You can customize or override the default parameters in any of the layers as needed.


4. Click **Save**. The cluster configuration and the new layers from the attached profiles will then be installed on the cluster.



# Example Cluster Imports Illustration

## EKS Cluster Import to Palette Console
 ![eks cluster import](cluster-import/eks.mp4)


## Generic Cluster Import to Palette Console
 ![generic cluster import](cluster-import/generic.mp4) 

