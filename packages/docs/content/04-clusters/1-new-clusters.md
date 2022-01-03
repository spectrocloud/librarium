---
title: "New Clusters"
metaTitle: "Creating new clusters on Spectro Cloud"
metaDescription: "The methods of creating clusters for a speedy deployment on any CSP"
icon: "server"
hideToC: false
fullWidth: false
---

import WarningBox from '@librarium/shared/src/components/WarningBox';
import InfoBox from '@librarium/shared/src/components/InfoBox';
import Tooltip from '@librarium/shared/src/components/ui/Tooltip';


# New Clusters 

Spectro Cloud supports provisioning and end-to-end lifecycle management of Kubernetes clusters (workload clusters) on various public clouds, private clouds, bare metal servers (installed in data centers)  as well as on edge appliances (isolated bare metal servers or virtual machines installed on edge locations such as hospitals, restaurants, grocery stores, etc.) On public clouds, Spectro Cloud supports provisioning new clusters using the cloud provider's infrastructure by provisioning new VMs for control plane and worker pools as well as through their managed Kubernetes services such as EKS, AKS etc. Provisioning of clusters on private environments like VMware, OpenStack etc requires a Private Cloud Gateway (PCG) to be installed for Spectro Cloud to be able to install Kubernetes clusters. Deploying edge clusters (clusters installed on edge appliances), requires a Private Cloud Gateway - Edge (PCG-Edge) to be installed on the appliances for Spectro Cloud to discover the appliance and provisiong workload clusters on them.

<InfoBox>
Workload clusters are instantiated from cloud specific <Tooltip trigger={<u>cluster profiles</u>}><a href="/cluster-profiles">Cluster profiles</a> are instantiated templates that are created with pre-configured layers/components needed for cluster deployments.</Tooltip>. You can use one of the cluster profiles provided out-of-the-box or create a new one.
</InfoBox>

# Environments

The following pages provide detailed instructions for setting up new workload clusters in various environments :

* [Amazon Web Services](/clusters/new-clusters/aws)
* [Amazon Elastic Kubernetes Service (EKS)](/clusters/new-clusters/eks)
* [Azure](/clusters/new-clusters/azure)
* [Azure Kubernetes Service (AKS)](/clusters/new-clusters/aks)
* [Edge](/clusters/new-clusters/edge)
* [GCP](/clusters/new-clusters/gcp)
* [Bare Metal using Canonical's Metal-as-a-Service (MaaS)](/clusters/new-clusters/maas)
* [OpenStack](/clusters/new-clusters/openstack)
* [VMWare](/clusters/new-clusters/vmware)
