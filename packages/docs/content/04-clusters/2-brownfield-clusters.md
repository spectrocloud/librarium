---
title: "Brownfield Clusters"
metaTitle: "Managing brownfield clusters on Spectro Cloud"
metaDescription: "Importing and managing brownfield clusters provisioned on any CSP using other orchestration tools "
icon: "cloud-download-alt"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';


# Overview

Existing Kubernetes clusters that were not deployed by Spectro Cloud Palette can be imported into the Palette platform for visibility, management and additional capabilities such as application lifecycle management. Palette allows import and management of Kubernetes clusters on various public, private, and bare-metal environments.

Palette also supports Generic cluster imports, where the users import their existing clusters to Palette irrespective of the cloud service provider. If the cloud type of the existing cluster is not supported by Palette, then those clusters could be imported as Generic Clusters.  The name generic implies our support will be extended to the generic operations on the cluster. The generic operations include scans, backups, etc. which are not specific to the cloud infrastructure. For Generic imported clusters, the user will not be able to add cloud-specific add-on profiles rather he can add profiles of cloud type which is supported for all.

 * In addition to Palette Generic cluster import, we support public cloud managed services  such as:
	* Amazon EKS
	* Google GKE
	* Azure AKS
	* VMware
	* Open Shift
 * Clusters provisioned through other management platforms (Rancher, CCP, etc.)
 * Clusters provisioned using orchestration tools (Kubeadm, kops, etc.)


# Import

The following steps need to be performed in order to import a brownfield cluster into the Palette platform:

 * From the Clusters page, invoke the option to “Import” a cluster.
 * Provide a name for the cluster. Select the cloud type where the cluster is currently deployed.
 * Provide proxy and non proxy information if applicable.
 * Install Palette’s cluster management agent into your brownfield cluster using the kubectl command provided.
 * Wait for the import process to complete. The cluster status will transition from ‘Pending’ to ‘Running’ and the cluster health will transition to ‘Healthy’, signalling successful import of the brownfield cluster.

# Attach Add-On profiles

Add-on cluster profiles can be attached to brownfield clusters after import to install and manage various applications / integrations above the core infrastructure layers. The following steps need to be performed in order to attach add-on profiles to existing clusters:

 * Choose the desired cluster from the clusters list and navigate to the ‘Profile’ tab.
 * Invoke the ‘Add add-on profile’ dialog from the menu on the left hand side, and choose the desired cluster profile. Multiple add-on profiles can be attached to a cluster.
 * Upon addition of a new add-on profile, the default configuration for all the layers that are part of the add-on profile are displayed. You can customize or override the default parameters in any of the layers as needed. Click save.
The cluster configuration and the new layers from the attached profiles will then be installed on the cluster.

# Example Cluster Imports Illustration

## EKS Cluster Import to Palette Console
 ![eks cluster import](cluster-import/eks.mp4)


## Generic Cluster Import to Palette Console
 ![generic cluster import](cluster-import/generic.mp4) 

