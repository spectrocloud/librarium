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
import Tooltip from "@librarium/shared/src/components/ui/Tooltip";

# Frequently Asked Questions

Brief answers to the most commonly asked questions about Spectro Cloud.

## How does Spectro Cloud handle IP management?

Spectro cloud supports DHCP as well as Static IP based allocation strategies for the VMs that are launched during cluster creation. IP Pools can be defined using a range or a subnet. Administrators can define one or more IP pools linked to a private cloud gateway. Clusters created using a private cloud gateway can select from the IP pools linked to the corresponding private cloud gateway. By default, IP Pools are be shared across multiple clusters, but can optionally be restricted to a cluster.

Furthermore, pools can be [dedicated to an](/clusters?clusterType=vmware_cluster#ipaddressmanagement) individual cluster. Pool IPs will be re-used by all cluster nodes.  

## How does Spectro Cloud work with failure domains?

Both control-plane and worker-node resiliency across fault-domains have been checked.

## What access workflows does Spectro Cloud support?

VMs can be accessed, if needed, via SSH (using the key specified during cluster provisioning). The location where the keys are stored must be available to users requiring access The standard VMware VM Console access is also available.

## What OS’s are supported with Spectro Cloud?

Spectro Cloud provides VM images for cluster computing infrastructure out of the box for the most recent versions of operating systems such as Ubuntu, CentOS, RHEL. These images are security-hardened based on the respective CIS Benchmarks. Kubernetes components such as kubelet, kubeadm, etc. are pre-installed in these images. The specific image for a cluster is derived from the Operating System and Kubernetes packs configured in the cluster profile.

Spectro Cloud also supports the options to [Bring-Your-Own-Image](/clusters/#customization) for Operating Systems supporting `cloud-init`.  

## How are Cluster Etcd components bootstrapped?

ETCD is provisioned inline with Cluster API. On the enterprise version, the status of the provisioning can be seen on the <Tooltip trigger={<u>Supervisor</u>}>The platform installer contains a web application called the <a href="/enterprise-version/deploying-the-platform-installer/#monitorinstallation">Supervisor</a>, to provide detailed progress of the installation.</Tooltip> app.

## What options are available for Backup/Restore?

Backup tools (like Velero, Portworx PX-Backup) are all supported.  

## How do upgrades work with Spectro Cloud?

<Tooltip trigger={<u>Upgrades</u>}>Typically, cluster profiles are <a href="/cluster-profiles/task-update-profile">updated</a> to change the configuration of various layers in a Kubernetes stack, including version updates.</Tooltip> are rolling, and there is no impact to the application workloads. Depending on the number of workloads running, a cluster node is upgraded within 5-8 minutes.  

## How does Spectro Cloud handle API Server configuration changes?

All Kubernetes control plane components (api-server, controller-manager, cloud-manager, etc.) are fully configurable, including component flags and feature-gates.  

## Can the ClusterAPI artifacts under the covers be exported from Spectro Cloud and imported to a raw ClusterAPI management cluster?

We are a Top-5 contributor to ClusterAPI. All the functionality that we have created has been contributed back to ClusterAPI. In the event of a customer needing to move away from Spectro Cloud, the Spectro Cloud orchestrated Kubernetes clusters can be imported and managed by ClusterAPI.  
