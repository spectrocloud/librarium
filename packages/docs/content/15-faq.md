---
title: "FAQ"
metaTitle: "Frequently Asked Questions about Spectro Cloud"
metaDescription: "Frequently Asked Questions about Spectro Cloud"
icon: "fa-question-circle"
hideToC: false
fullWidth: false
---

import Tabs from '@librarium/shared/src/components/ui/Tabs';
import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import PointsOfInterest from '@librarium/shared/src/components/common/PointOfInterest';

# How does Spectro Cloud handle IP management?

* Static IP Pools are configured and managed by Spectro Cloud.  
* Pools can be [dedicated to an](/clusters?clusterType=vmware_cluster#ipaddressmanagement) individual cluster.  
* Pool IPs will be re-used by all cluster nodes.  

# How does Spectro Cloud work with failure domains for both the control plane and workers?

We fully tested both control-plane and worker-node resiliency across fault-domains.

# What access workflows does Spectro Cloud support (ie. how can VMs be accessed, if needed)?

* Kubernetes nodes are accessed via SSH (using the key specified during cluster provisioning). Keys are stored in the internal Metsi vault.  
* VMware VM Console access is also available.  

# What OS’s are supported with Spectro Cloud?

* Out-of-the-box support for Spectro Cloud provides security-hardened CentOS and Ubuntu images.  
* Spectro Cloud supports the options to Bring-Your-Own-Image for Operating Systems supporting `cloud-init`.  

# How are Cluster Etcd components bootstrapped? Backup/Restore?

* ETCD is provisioned inline with Cluster API.  
* Backup tools (like Velero, Portworx PX-Backup) are all supported.  

# How do upgrades work with Spectro Cloud (how long does it take, how does PWX react, etc.)?

Upgrades are rolling, and there is no impact to the application workloads. Depending on the number of workloads running, a cluster node is upgraded within 5-8 minutes.  

# How does Spectro Cloud handle API Server configuration changes?

All Kubernetes control plane components (api-server, controller-manager, cloud-manager, …) are fully configurable, including component flags and feature-gates.  

# Can the ClusterAPI artifacts under the covers be exported from Spectro Cloud and imported to a raw ClusterAPI management cluster?

We are a Top-5 contributor to ClusterAPI. All the functionality that we have created has been contributed back to ClusterAPI. In the event of a customer needing to move away from Spectro Cloud, the Spectro Cloud orchestrated Kubernetes clusters can be imported and managed by ClusterAPI.  
