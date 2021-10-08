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

Spectro Cloud supports provisioning and end-to-end lifecycle managent of kubernetes clusters (workload clusters) on various public clouds, private clouds as well as on bare metal servers. On public clouds, Spectro Cloud supports provisioning new clusters using the cloud provider's infrastructure by provisioning new VMs for control plane and woker pools as well as through their managed kubernetes services such as EKS, AKS etc. Provisioning of clusters on private environments like VMware, OpenStack etc reuires a Private Cloud Gateway (PCG) to be installed for Spectro Cloud to be able to install kubernetes clusters.

<InfoBox>
Workload clusters are instantiated from cloud specific <Tooltip trigger={<u>cluster profiles</u>}><a href="/cluster-profiles">Cluster profiles</a> are instantiated templates that are created with pre-configured layers/components needed for cluster deployments.</Tooltip>. You can use one of the cluster profiles provided out-of-the-box or create a new one. 
</InfoBox>

# Cloud Providers

The following pages provide details instructions for setting up new workload clusters in various cloud environments:

* [Amazon EC2](/clusters/new-clusters/aws)
* [Amazon Elastic Kubernetes Service (EKS)](/clusters/new-clusters/eks)
* [Azure](/clusters/new-clusters/azure)
* [Azure Kubernetes Service (AKS)](/clusters/new-clusters/aks)
* [GCP](/clusters/new-clusters/gcp)
* [Bare Metal using Canonical's Metal-as-a-Service (MaaS)](/clusters/new-clusters/maas)
* [OpenStack](/clusters/new-clusters/openstack)
* [VMWare](/clusters/new-clusters/vmware)
